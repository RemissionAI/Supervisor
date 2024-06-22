import type { Context } from 'hono'
import * as TrainService from '~/core/services/train.service'
import ResponseHandler from '~/lib/utils/response-handler'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'
import { paginated } from '~/lib/utils/pagination'
import { TrainingTask } from '~/common/interfaces/train.interface'

export async function load(c: Context) {
  const body = await c.req.json()

  await TrainService.process(c.env, body)

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
  const data = await TrainService.getSitemapBatches([{ type: 'sitemap', source: 'https://lupus.org/sitemap.xml' }], 100)

  return ResponseHandler.success(c, data)
}

export async function list(c: Context) {
  const trainingRepo = new TrainingTaskRepository(c.env)

  const pagination = paginated(c)
  
  console.log(pagination)

  const data = (await trainingRepo.list(pagination.page, pagination.limit)).map(task => task.toJSON<TrainingTask>())

  return ResponseHandler.success(c, data)
}
