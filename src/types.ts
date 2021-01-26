export {};

export interface LooseObject {
    [key: string]: any
}

export interface apiResponseOptions { 
    success: boolean, 
    status: number, 
    error?: string, 
    body?: LooseObject 
}

export type loginFormState = { redirect: boolean, redirectPath: string, hasError: boolean, errorMsg?: string, username: string, password: string };
export interface registerFormState extends loginFormState {
    confirmPassword: string
}