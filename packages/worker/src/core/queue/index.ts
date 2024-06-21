import { processQueueTask } from '../services/train.service'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { PushQueueTrainingTask } from '~/common/interfaces/train.interface'

export default async function queue(
  batch: MessageBatch<PushQueueTrainingTask>,
  env: Bindings,
): Promise<void> {
  for (const message of batch.messages) {
    const body = message.body

    try {
      await processQueueTask(env, body.taskId, body.links, body.batchIndex)

      message.ack()
    }
    catch (err) {
      message.retry()
    }
  }
}
