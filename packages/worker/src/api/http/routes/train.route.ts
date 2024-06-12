import { Hono } from 'hono'
import type { Environment } from '~/common/interfaces/common.interface'
import * as TrainController from '~/api/http/controllers/train.controller'

export const route = new Hono<Environment>()

route.post('/load', TrainController.load)
route.get('/list', TrainController.list)
