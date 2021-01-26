import { SessionStorageKeys } from "./storageKeys";

export const initSessionStorage = function() {
    if (!checkAuth()) storeInSessionStorage(SessionStorageKeys.isAuthed, 'false'); 
}

export const collapseSessionStorage = function() {
    window.sessionStorage.clear();
}

export const storeInSessionStorage = function(key: string, value: any) {
    window.sessionStorage.setItem(key, value);
} 

export const removeFromSessionStorage = function(key: string) {
    window.sessionStorage.removeItem(key);
}

export const getFromSessionStorage = function(key: string) {
    return window.sessionStorage.getItem(key);
}

interface LoginResponse {
    username: string,
    userId: string,
    accessToken: string,
    refreshToken: string
}

export const authComplete = function(loginResponse: LoginResponse) {
    storeInSessionStorage(SessionStorageKeys.username, loginResponse.username);
    storeInSessionStorage(SessionStorageKeys.userId, loginResponse.userId);
    storeInSessionStorage(SessionStorageKeys.accessToken, loginResponse.accessToken);
    storeInSessionStorage(SessionStorageKeys.refreshToken, loginResponse.refreshToken);
    storeInSessionStorage(SessionStorageKeys.isAuthed, 'true');
}

export const logoutComplete = function() {
    removeFromSessionStorage(SessionStorageKeys.username);
    removeFromSessionStorage(SessionStorageKeys.userId);
    removeFromSessionStorage(SessionStorageKeys.accessToken);
    removeFromSessionStorage(SessionStorageKeys.refreshToken);
    storeInSessionStorage(SessionStorageKeys.isAuthed, 'false');   
}

export const checkAuth: () => boolean = function() {
    const isAuthed = getFromSessionStorage(SessionStorageKeys.isAuthed) === 'true';
    return isAuthed;
}

export const getAuthTokenFromStorage = function() {
    if (checkAuth()) return getFromSessionStorage(SessionStorageKeys.accessToken);
    return '';
}

export const getRefreshTokenFromStorage = function() {
    if (checkAuth()) return getFromSessionStorage(SessionStorageKeys.refreshToken);
    return '';
}