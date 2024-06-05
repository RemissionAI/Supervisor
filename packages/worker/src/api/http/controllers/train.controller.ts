import type { Context } from 'hono'
import * as TrainService from '~/core/services/train.service'
import ResponseHandler from '~/lib/utils/response-handler'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'

export async function train(c: Context) {
  const body = await c.req.parseBody()

  const res = await TrainService.loadKnowledge(c.env, body)

  return ResponseHandler.success(c, res)
}


export async function insert(c: Context) {
  const trainingRepo = new TrainingTaskRepository(c.env)

  const data = await trainingRepo.insertTrainingTask({
		type: "url",
		source: "https://kaleidoscopefightinglupus.org",
    status: 'queued',
    details: {
      "err": "hi"
    },
    startedAt: new Date()
	});

  return ResponseHandler.success(c, data)
}

export async function list(c: Context) {
	const trainingRepo = new TrainingTaskRepository(c.env);

	const data = await trainingRepo.listTrainingTasks(1, 10)

	return ResponseHandler.success(c, data);
}