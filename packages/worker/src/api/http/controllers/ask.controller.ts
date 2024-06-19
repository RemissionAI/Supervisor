import type { Context } from 'hono'
import ResponseHandler from '~/lib/utils/response-handler'
import * as AskService from '~/core/services/ask.service'

export async function ask(c: Context) {
  const body = await c.req.json()

  const answer = await AskService.ask(c, body)

  return ResponseHandler.success(c, { answer })
}

export async function askSSE(c: Context) {
  const body = await c.req.json()

  return await AskService.askSSE(c, body)
}
