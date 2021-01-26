import Order from "../../models/order/Order";
import ApiResponse from "../classes/ApiResponse";
import { graphQLReq } from "./basicServices";

export const addOrderIdToUserById = async function(authToken: string, userId: string, orderId: string) {
    const graphQLMutation = `
        mutation {
            addOrderId(userId:"${userId}", orderId:"${orderId}") {
                _id
            }
        }
    `;
    
    return await graphQLReq(authToken, `users/${userId}`, graphQLMutation); 
}

export const makeOrder = async function(authToken: string, order: Order) {
    const record = {
        userId: order.userId,
        sets: order.sets,
        setRefs: order.setRefs,
        total: order.total
    };

    const graphQLMutation = `
        mutation {
            orderCreateOne(record:${JSON.stringify(record).replace(/"(\w+)"\s*:/g, '$1:')}) {
                recordId
            }
        }
    `;


    const apiResponse: ApiResponse = await graphQLReq(authToken, 'orders', graphQLMutation);
    
    if (!apiResponse.success) return apiResponse;

    //proceed to add order ID to user if order is made successfully
    const orderId = apiResponse.body!.orderCreateOne.recordId;
    return await addOrderIdToUserById(authToken, order.userId, orderId);
}