import Price from "./Price";

type setInput = {
    name: string,
    _id: string,
    price: Price
}

export default class Set {
    name: string;
    _id: string;
    price: Price

    constructor(setInput: setInput) {
        this.name = setInput.name;
        this._id = setInput._id;
        this.price = setInput.price;
    }
}