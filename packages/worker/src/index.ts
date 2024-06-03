import type { Context } from 'hono'
import { Hono } from 'hono'
import { ZodError } from 'zod'
import { WorkerEntrypoint } from 'cloudflare:workers'
import { RpcController } from './api/rpc/RpcController'
import { ServiceError } from '~/lib/utils/ServiceError'
import ResponseHandler from '~/lib/utils/ResponseHandler'
import { defaultRoutes } from '~/api/http'
import type {
  Bindings,
  Environment,
} from '~/common/interfaces/common.interface'

const app = new Hono<Environment>()

app.options('*', (c) => {
  return ResponseHandler.success(c, 'ok')
})

app.notFound((c) => {
  throw ServiceError.notFound(`404: ${c.req.url}`)
})

app.onError((err: any, c) => {
  console.error(err)
  if (err instanceof ZodError)
    return ResponseHandler.validationErr(c, err)
  else if (err instanceof ServiceError)
    return ResponseHandler.genericError(c, err.message, err.statusCode)
  else return ResponseHandler.serverError(c, 'internal server error')
})

defaultRoutes.forEach((route: any) => {
  app.route(`${route.path}`, route.route)
})

app.get('/whoami', (c: Context) => {
  return ResponseHandler.success(c, {
    name: 'Supervisor service',
  })
})

export class SupervisorService extends WorkerEntrypoint<Bindings> {
  async target() {
    return new RpcController()
  }
}

export default {
  fetch: app.fetch,
}
