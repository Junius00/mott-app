import { getAuthTokenFromStorage } from "../../sessionStorage/storageServices";
import { apiResponseOptions, LooseObject } from "../../types";
import ApiResponse from "../classes/ApiResponse";
import { refreshAuth } from "../pages/reauthServices";

const nodeFetch = require('node-fetch');

const HOST = process.env.REACT_APP_API_HOST;
const PORT = process.env.REACT_APP_API_PORT;
const JSON_HEADER = process.env.REACT_APP_API_JSON_HEADER;

//returns URL based on path
export const getURL = function(path: String) {
    return `http://${HOST}:${PORT}/${path}`;
}

//gets preliminary response from HTTPS request
export const getHTTPRes = async function(path: String, method: String, bodyJSON?: Object, authToken?: String) {
    const body = bodyJSON ? JSON.stringify(bodyJSON) : null;

    const headers: LooseObject = { 'Content-Type': JSON_HEADER };
    if (body) headers['Content-Length'] = body.length;
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const options = {
        method: method,
        body: body,
        headers: headers
    }

    return await nodeFetch(getURL(path), options);
}

//gets ApiResponse object based on HTTP response
export const getApiResponseHTTP = async function(res: LooseObject, statusCodes: Array<Number>) {
    //check for 400 Bad Request
    statusCodes.push(400);

    const returnOptions: apiResponseOptions = {
        success: true,
        status: 200,
        error: undefined,
        body: undefined
    };

    //status code matches the provided error status codes; modify return options and return
    if (statusCodes.includes(res.status)) {
        returnOptions.success = false;
        returnOptions.status = res.status;
        returnOptions.error = (res.status === 400) ? 'Bad Request' : await res.text();
    } else {
        //200; return success response
        returnOptions.body = await res.json();
    }
        
    return new ApiResponse(returnOptions);
}

export const graphQLReq = async function(authToken: string, path: string, graphQLStr: string) {
    const bodyJSON = { query: graphQLStr };

    let res = await getHTTPRes(path, 'post', bodyJSON, authToken);
    const apiResponse: ApiResponse = await getApiResponseGraphQL(res);
    if (!apiResponse.success && [401, 403].includes(apiResponse.status)) {
        refreshAuth();
        res = await getHTTPRes(path, 'post', bodyJSON, getAuthTokenFromStorage()!);
        return await getApiResponseGraphQL(res);
    }

    return apiResponse;
}

//get ApiResponse Object based on GraphQL response
export const getApiResponseGraphQL = async function(res: LooseObject) {
    const returnOptions: apiResponseOptions = {
        success: true,
        status: 200,
        error: undefined,
        body: undefined
    };
    const statusCodes: Array<number> = [400, 401, 403];
    const errorMsgs: { [key: number] : string } = {
        400: 'Bad Request',
        401: 'Unauthenticated',
        403: 'Forbidden'
    };

    if (statusCodes.includes(res.status)) {
        returnOptions.success = false;
        returnOptions.status = res.status;
        returnOptions.error = errorMsgs[res.status];
        returnOptions.body = await res.json();
    }
    else {
        returnOptions.body = (await res.json()).data;
    }
    return new ApiResponse(returnOptions);
}