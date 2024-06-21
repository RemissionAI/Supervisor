import type { Context } from 'hono'
import * as TrainService from '~/core/services/train.service'
import ResponseHandler from '~/lib/utils/response-handler'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'
import DataLoader from '~/lib/utils/ai/data-loader'

export async function load(c: Context) {
  const body = await c.req.json()

  await TrainService.queueTask(c.env, body)

  return ResponseHandler.success(c, {
    message: 'task queued',
  })
}

export async function loadFile(c: Context) {
  const body = await c.req.parseBody()

  await TrainService.trainWithSinglePdf(c.env, { source: body.file, type: 'pdf' })

  return ResponseHandler.success(c, {
    message: 'Noice',
  })
}

export async function loadSitemap(c: Context) {
  const data = (await DataLoader.sitemap('https://www.lupus.org/sitemap.xml')).map(link => link.loc)

  return ResponseHandler.success(c, data)
}

export async function list(c: Context) {
  const trainingRepo = new TrainingTaskRepository(c.env)

  const data = await trainingRepo.list(1, 100)

  return ResponseHandler.success(c, data)
}
