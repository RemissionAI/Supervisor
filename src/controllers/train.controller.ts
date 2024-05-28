import type { Context } from 'hono'
import * as TrainService from '~/services/train.service'

export async function train(c: Context) {
  return await TrainService.train()
}
