import { Hono } from 'hono'
import type { Environment } from '~/common/interfaces/common.interface'
import * as TrainController from '~/api/http/controllers/train.controller'

export const route = new Hono<Environment>()

route.post('/load', TrainController.load)
route.post('/load-file', TrainController.loadFile)
route.get('/sitemap', TrainController.loadSitemap)
route.get('/list', TrainController.list)
route.get('/list/count', TrainController.getTrainingTasksCount)
route.get('/:task_id', TrainController.getTask)
route.get('/:task_id/count', TrainController.getTaskKnowledgeItemsCount)
route.get('/:task_id/knowledge', TrainController.listTaskKnowledge)
