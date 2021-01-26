import { apiResponseOptions, LooseObject } from "../../types";

export default class ApiResponse {
    success: boolean;
    status: number;
    error?: string;
    body?: LooseObject;

    //takes a single 'options' parameter: { success: boolean, status: Number, error?: String, body: Object }
    constructor(options: apiResponseOptions) {
        this.success = options.success;
        this.status = options.status;
        this.error = options.error;
        this.body = options.body;
    }
}