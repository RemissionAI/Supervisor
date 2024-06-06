export type Bindings = {
	ENVIRONMENT: "dev" | "staging" | "production";
	SUPERVISOR_KV: KVNamespace;
	SUPERVISOR_BUCKET: R2Bucket;
	KNOWLEDGE_INDEX: VectorizeIndex;
	AI: Fetcher;
  SUPERVISOR_DB: D1Database
  SUPERVISOR_TRAINING_QUEUE: Queue<any>
};

export type Environment = {
  Bindings: Bindings
}

export enum ErrorCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  NOT_IMPLEMENTED = 501,
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  errors?: Array<{ code?: string, message: string, field?: string }>
}
