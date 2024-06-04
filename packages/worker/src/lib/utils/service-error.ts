import type { StatusCode } from 'hono/utils/http-status'
import { ErrorCodes } from '~/common/interfaces/common.interface'

const ErrorMessages = {
  [ErrorCodes.BAD_REQUEST]: 'Bad Request',
  [ErrorCodes.NOT_FOUND]: '404 Not Found',
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [ErrorCodes.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCodes.NOT_IMPLEMENTED]: 'Not Implemented',
}

export class ServiceError extends Error {
  name: string = 'ServiceError'
  statusCode: StatusCode

  constructor(message: string, statusCode: StatusCode) {
    super(message)
    this.statusCode = statusCode
  }

  static badRequest(message: string = ErrorMessages[ErrorCodes.BAD_REQUEST]) {
    return new ServiceError(message, ErrorCodes.BAD_REQUEST)
  }

  static unauthorized(
		message: string = ErrorMessages[ErrorCodes.UNAUTHORIZED],
  ) {
    return new ServiceError(message, ErrorCodes.UNAUTHORIZED)
  }

  static notFound(message: string = ErrorMessages[ErrorCodes.NOT_FOUND]) {
    return new ServiceError(message, ErrorCodes.NOT_FOUND)
  }

  static internalServerError(
		message: string = ErrorMessages[ErrorCodes.INTERNAL_SERVER_ERROR],
  ) {
    return new ServiceError(message, ErrorCodes.INTERNAL_SERVER_ERROR)
  }

  static serviceUnavailable(
		message: string = ErrorMessages[ErrorCodes.SERVICE_UNAVAILABLE],
  ) {
    return new ServiceError(message, ErrorCodes.SERVICE_UNAVAILABLE)
  }

  static notImplemented(
		message: string = ErrorMessages[ErrorCodes.NOT_IMPLEMENTED],
  ) {
    return new ServiceError(message, ErrorCodes.NOT_IMPLEMENTED)
  }
}
