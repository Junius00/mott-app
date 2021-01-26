import Order from "../models/order/Order";
import Price from "../models/restaurant/Price";
import { SessionStorageKeys } from "../sessionStorage/storageKeys";
import { getFromSessionStorage } from "../sessionStorage/storageServices";

export let order = new Order({ 
    _id: '',
    userId: '',
    total: new Price({ currency: '', value: 0}), 
    sets: [], 
    setRefs: []});

export const initOrder = function() {
    order.userId = getFromSessionStorage(SessionStorageKeys.userId)!;
}