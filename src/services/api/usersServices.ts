import { SessionStorageKeys } from "../../sessionStorage/storageKeys";
import { checkAuth, getAuthTokenFromStorage, getFromSessionStorage } from "../../sessionStorage/storageServices";
import ApiResponse from "../classes/ApiResponse";
import { getApiResponseHTTP, getHTTPRes, graphQLReq } from "./basicServices";

//login or register function
//returns a HTTPResponse object with body { userId: string, accessToken: <JWT Token>, refreshToken: <JWT Token> }
export const userEntry = async function(username: String, password: String, purpose: String) {
    const bodyJSON = {
       username: username,
       password: password 
    };
    
    //purpose is either 'login' or 'register'
    const res = await getHTTPRes(`users/${purpose}`, 'post', bodyJSON);
    return await getApiResponseHTTP(res, [401, 503]);
};

//returns HTTPResponse object with body { loggedOut: boolean }
export const userExit = async function(refreshToken: String) {
    const bodyJSON = {
        token: refreshToken
    };

    const res = await getHTTPRes('users/logout', 'post', bodyJSON);

    return await getApiResponseHTTP(res, [403, 503]);
};

export const getUserOrders = async function() {
    const failureResponse = new ApiResponse({
        success: false,
        status: 401,
        error: 'not authenticated',
        body: undefined
    });

    if (!checkAuth()) return failureResponse;

    const userId = getFromSessionStorage(SessionStorageKeys.userId);
    const authToken = getAuthTokenFromStorage();

    if (!userId || !authToken) return failureResponse;

    const userGraphQLQuery = `
        query {
            userById(_id: "${userId}") {
                orderIds
            }
        }
    `;
    const apiResponse = await graphQLReq(authToken, `users/${userId}`, userGraphQLQuery);
    if (!apiResponse.success) return apiResponse;

    const orderIds = apiResponse.body!.userById.orderIds;
    
    const orderGraphQLQuery = `
        query {
            orderByIds(_ids: ${JSON.stringify(orderIds)}) {
                _id
                total {
                    currency
                    value
                }
                userId
                setRefs {
                    restaurantId
                    setId
                }
                sets {
                    _id
                    name
                    price {
                        currency
                        value
                    }
                }
            }
        }
    `;

    return await graphQLReq(authToken, 'orders', orderGraphQLQuery);
};
