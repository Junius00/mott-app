import { getApiResponseHTTP, getHTTPRes } from "./basicServices";

export const getNewAccessToken = async function(refreshToken: String) {
    const bodyJSON = {
        token: refreshToken
    };

    const res = await getHTTPRes('token/refresh', 'post', bodyJSON);
    return await getApiResponseHTTP(res, [401, 403, 503]);
}