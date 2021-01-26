import { SessionStorageKeys } from "../../sessionStorage/storageKeys";
import { authComplete, getFromSessionStorage, getRefreshTokenFromStorage } from "../../sessionStorage/storageServices";
import { getNewAccessToken } from "../api/tokenServices";

export const refreshAuth: () => Promise<boolean> = async () => {
    const username: string = getFromSessionStorage(SessionStorageKeys.username)!;
    const userId: string = getFromSessionStorage(SessionStorageKeys.userId)!;
    const refreshToken: string = getRefreshTokenFromStorage()!;
    const apiResponse = await getNewAccessToken(refreshToken);
    
    if (!apiResponse.success) return false;

    authComplete({
        username: username,
        userId: userId,
        accessToken: apiResponse.body!.accessToken,
        refreshToken: refreshToken
    });

    return true;
};