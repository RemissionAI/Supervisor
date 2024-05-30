import type { Context } from 'hono'
import * as TrainService from '~/services/train.service'
import ResponseHandler from '~/lib/utils/ResponseHandler'

export async function train(c: Context) {
  const body = await c.req.json()

  const res = await TrainService.train(body)

  return ResponseHandler.success(c, { data: res })
}
