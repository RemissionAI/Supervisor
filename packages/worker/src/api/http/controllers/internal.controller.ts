import type { Context } from 'hono'
import ResponseHandler from '~/lib/utils/response-handler'
import * as InternalService from '~/core/services/internal.service'

export async function getSettings(c: Context) {
  const settings = await InternalService.getSettings(c.env)

  return ResponseHandler.success(c, settings)
}

export async function updateSettings(c: Context) {
  const body = await c.req.json()

  await InternalService.updateSettings(c.env, body)

  return ResponseHandler.success(c, 'updated')
}
