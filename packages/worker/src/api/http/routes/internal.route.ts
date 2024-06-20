import { Hono } from 'hono'
import type { Environment } from '~/common/interfaces/common.interface'
import * as InternalController from '~/api/http/controllers/internal.controller'

export const route = new Hono<Environment>()

route.get('/settings', InternalController.getSettings)
route.get('/settings/models', InternalController.getModels)
route.put('/settings', InternalController.updateSettings)
