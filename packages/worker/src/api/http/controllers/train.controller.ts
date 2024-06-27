import type { Context } from 'hono'
import * as TrainService from '~/core/services/train.service'
import ResponseHandler from '~/lib/utils/response-handler'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'
import { getPagination } from '~/lib/utils/pagination'
import type { TrainingTask } from '~/common/interfaces/train.interface'
import { KnowledgeRepository } from '~/core/repositories/knowledge.repository'
import type { Knowledge } from '~/common/interfaces/knowledge.interface'
import { BatchDeleteKnowledgeSchema, idSchema } from '~/lib/validations/train.validation'

export async function loadWeb(c: Context) {
  const body = await c.req.json()

  await TrainService.processWeb(c.env, body)

  return ResponseHandler.success(c, {
    message: 'task queued',
  })
}

export async function loadFile(c: Context) {
  const body = await c.req.parseBody()

  await TrainService.processFile(c.env, { source: body.file, type: 'pdf' })

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

  const pagination = getPagination(c)

  const data = (await trainingRepo.list(pagination.page, pagination.limit)).map(task => task.toJSON<TrainingTask>())

  return ResponseHandler.success(c, data)
}

export async function listTaskKnowledge(c: Context) {
  const id = c.req.param('task_id')

  const taskId = idSchema.parse(id)

  const knowledgeRepo = new KnowledgeRepository(c.env)

  const pagination = getPagination(c)

  const data = (await knowledgeRepo.list(taskId, pagination.page, pagination.limit)).map(knowledge => knowledge.toJSON<Knowledge>())

  return ResponseHandler.success(c, data)
}

export async function getTaskKnowledgeItemsCount(c: Context) {
  const knowledgeRepo = new KnowledgeRepository(c.env)
  const id = c.req.param('task_id')

  const taskId = idSchema.parse(id)

  const count = await knowledgeRepo.getCount(taskId)

  return ResponseHandler.success(c, count)
}

export async function getTask(c: Context) {
  const trainingRepo = new TrainingTaskRepository(c.env)
  const id = c.req.param('task_id')

  const taskId = idSchema.parse(id)
  const task = await trainingRepo.get(taskId)

  return ResponseHandler.success(c, task)
}

export async function getTrainingTasksCount(c: Context) {
  const trainingRepo = new TrainingTaskRepository(c.env)

  const count = await trainingRepo.getCount()

  return ResponseHandler.success(c, count)
}

export async function batchDeleteKnowledge(c: Context) {
  const body = await c.req.json()

  const { ids } = BatchDeleteKnowledgeSchema.parse(body)

  await TrainService.batchDeleteKnowledge(c.env, ids)

  return ResponseHandler.success(c, { message: 'knowledge deleted' })
}

export async function retrainKnowledge(c: Context) {
  const id = c.req.param('knowledge_id')

  const knowledgeId = idSchema.parse(id)

  await TrainService.retrainKnowledge(c.env, knowledgeId)

  return ResponseHandler.success(c, { message: 'success' })
}
