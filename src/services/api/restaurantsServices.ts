import { graphQLReq } from "./basicServices";

const DEFAULT_PER_PAGE = parseInt(process.env.REACT_APP_API_PER_PAGE!);

export type getOpenRestaurantsInput = { 
    authToken: string,
    time: number,
    day: string,
    page: number,
    perPage?: number, 
    sortBy?: string 
};

export const getOpenRestaurants = async function(
    {
        authToken,
        time,
        day,
        page,
        perPage = DEFAULT_PER_PAGE,
        sortBy = '_id'
    } : getOpenRestaurantsInput
) {
    const graphQLQuery = `
        query {
            openRestaurants(time: ${time}, day: "${day}", perPage: ${perPage}, page: ${page}, sortBy: "${sortBy}") {
                _id
                name
                openingTime
                closingTime
                offDays
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
    
    return await graphQLReq(authToken, 'restaurants', graphQLQuery); 
}

export const getRestaurantWithSetById = async function(authToken: string, setId: string) {
    const graphQLQuery = `
        query {
            restaurantWithSetById(_id:"${setId}") {
                _id
                name
                openingTime
                closingTime
                offDays
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

    return await graphQLReq(authToken, 'restaurants', graphQLQuery); 
}

export const getRestaurantNameById = async function(authToken: string, restaurantId: string) {
    const graphQLQuery = `
        query {
            restaurantId(_id:"${restaurantId}") {
                _id
                name
            }
        }
    `;

    return await graphQLReq(authToken, 'restaurants', graphQLQuery); 
}