
class ApiResponse {
    constructor(statusCode, payload, message = null) {
        this.success = true;
        this.statusCode = statusCode;

        if (typeof payload === "string" && (message === null || message === undefined)) {
            this.message = payload;
            this.data = null;
            return;
        }

        if (typeof payload === "string" && message !== null && message !== undefined) {
            this.message = payload;
            this.data = message;
            return;
        }

        this.data = payload ?? null;
        this.message = typeof message === "string" ? message : "Success";
    }
}

export default ApiResponse;