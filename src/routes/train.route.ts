import { Hono } from 'hono'
import type { Environment } from '~/interfaces/common.interface'
import * as TrainController from '~/controllers/train.controller'

export const route = new Hono<Environment>()

route.post('/', TrainController.train)
