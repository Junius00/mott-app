import { makeOrder } from "../../services/api/ordersServices";
import { getRestaurantWithSetById } from "../../services/api/restaurantsServices";
import ApiResponse from "../../services/classes/ApiResponse";
import { getAuthTokenFromStorage } from "../../sessionStorage/storageServices";
import Price from "../restaurant/Price";
import Restaurant from "../restaurant/Restaurant";
import Set from "../restaurant/Set";
import SetRef from "./SetRef";

interface OrderInput {
    _id: string,
    userId: string,
    sets: Array<Set>,
    total: Price,
    setRefs: Array<SetRef>
}

export interface OrderByRestaurantIds { [key: string]: [{ set: Set, quantity: number }] }

export default class Order {
    _id: string;
    userId: string;
    sets: Array<Set>;
    total: Price;
    setRefs: Array<SetRef>;

    constructor(input: OrderInput) {
        this._id = input._id;
        this.userId = input.userId;
        this.sets = input.sets;
        this.total = input.total;
        this.setRefs = input.setRefs;

        this.clear = this.clear.bind(this);
        this.setTotal = this.setTotal.bind(this);
        this.deleteSet = this.deleteSet.bind(this);
        this.commit = this.commit.bind(this);
        this.getSetRefById = this.getSetRefById.bind(this);
        this.getSetQuantityById = this.getSetQuantityById.bind(this);
        this.modifySetQuantityById = this.modifySetQuantityById.bind(this);
    }

    setTotal(total: Price) { this.total = total; }

    clear() {
        this.sets = [];
        this.setRefs = [];
        this.total = new Price({currency: '', value: 0});
    }

    deleteSet(setId: string) {
        this.sets = this.sets.filter(s => s._id !== setId);
        this.setRefs = this.setRefs.filter(s => s.setId !== setId);
    }

    async commit(): Promise<ApiResponse> {
        const apiResponse = await makeOrder(getAuthTokenFromStorage()!, this);
        if (apiResponse.success) this.clear();

        return apiResponse;
    }

    getSetById(setId: string): Set | undefined {
        return this.sets.find(set => set._id === setId);
    }

    getSetRefById(setId: string): SetRef | undefined {
        return this.setRefs.find(setRef => setRef.setId === setId);
    }

    getSetQuantityById(setId: string): number {
        const setRef: SetRef | undefined = this.getSetRefById(setId);

        if (!setRef) return 0;
        return setRef.quantity;
    }

    //makes a new SetRef automatically if it isn't found
    async modifySetQuantityById(set: Set, modifier: number): Promise<void> {
        const setId = set._id;
        let setRef = this.getSetRefById(setId);
        let existsInOrder = true;

        if (!setRef) {
            existsInOrder = false;

            const apiResponse = await getRestaurantWithSetById(getAuthTokenFromStorage()!, setId);
            if (!apiResponse.success) return;

            const data = apiResponse.body!.restaurantWithSetById;
            if (!data) return;

            const restaurant = new Restaurant(data);
            setRef = new SetRef({
                setId: setId,
                restaurantId: restaurant._id
            });
        }

        (modifier < 0) ? setRef.minusQuantity(-modifier) : setRef.addQuantity(modifier);

        if (existsInOrder) {
            if (setRef.quantity === 0) {
                //remove if 0
                this.deleteSet(setRef.setId);
                return;
            }

            //update setRef count
            const index = this.setRefs.indexOf(setRef);
            this.setRefs[index] = setRef;
            return;
        }

        //doesn't exist; make new set and setRef in record
        this.sets.push(set);
        this.setRefs.push(setRef);
    }

    getOrderByRestaurantIds(): OrderByRestaurantIds {
        let returnObj: OrderByRestaurantIds = {};

        this.setRefs.forEach(setRef => {
            //empty setRef; ignore
            if (setRef.quantity < 1) return;

            const restaurantId = setRef.restaurantId;
            const set = this.getSetById(setRef.setId)!;

            //make new array if one doesn't already exist; otherwise add set to array
            const restaurantArr = returnObj[restaurantId];
            const setQ = { set: set, quantity: setRef.quantity };
            if (restaurantArr) restaurantArr.push(setQ);
            returnObj[restaurantId] = (!restaurantArr) ? [setQ] : restaurantArr;
        });

        return returnObj;
    }
}