import type { Context } from 'hono'
import { Hono } from 'hono'
import { ZodError } from 'zod'
import { WorkerEntrypoint } from 'cloudflare:workers'
import * as TrainService from '~/services/train.service'
import { ServiceError } from '~/utils/ServiceError'
import ResponseHandler from '~/utils/ResponseHandler'
import { defaultRoutes } from '~/routes'
import type { Bindings, Environment } from '~/interfaces/common.interface'

const app = new Hono<Environment>()

app.options('*', (c) => {
  return ResponseHandler.success(c, 'ok')
})

app.notFound((c) => {
  throw ServiceError.notFound(`404: ${c.req.url}`)
})

app.onError((err: any, c) => {
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

export default class extends WorkerEntrypoint<Bindings> {
  async fetch(req: Request) {
    return app.fetch(req)
  }

  async train() {
    return TrainService.train()
  }
}
