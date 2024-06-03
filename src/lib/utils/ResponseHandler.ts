import type { ZodError } from "zod";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { ServiceResponse } from "~/common/interfaces/common.interface";

class ResponseHandler {
	success<T>(c: Context, data: T) {
		const response: ServiceResponse<T> = {
			success: true,
			data,
		};
		return c.json(response);
	}

	validationErr(c: Context, error: ZodError) {
		const response: ServiceResponse<null> = {
			success: false,
			errors: error.issues.map((issue) => ({
				code: issue.code,
				message: issue.message,
				field: issue.path.join("."),
			})),
		};
		this.logError("Validation Error", error);
		return c.json(response, 400);
	}

	genericError(c: Context, message: string, statusCode: StatusCode = 400) {
		const response: ServiceResponse<null> = {
			success: false,
			errors: [{ message }],
		};
		this.logError("API Error", new Error(message));
		return c.json(response, statusCode);
	}

	serverError(c: Context, message: string, statusCode: StatusCode = 500) {
		const response: ServiceResponse<null> = {
			success: false,
			errors: [{ message }],
		};
		this.logError("Generic Error", new Error(message));
		return c.json(response, statusCode);
	}

	notFound(c: Context, message: string = "Resource not found") {
		const response: ServiceResponse<null> = {
			success: false,
			errors: [{ message }],
		};
		this.logError("Not Found", new Error(message));
		return c.json(response, 404);
	}

	private logError(type: string, error: Error) {
		console.error(`[${type}]`, error.message);
	}
}

export default new ResponseHandler();
