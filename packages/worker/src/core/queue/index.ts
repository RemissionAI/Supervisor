import type { Bindings } from '~/common/interfaces/common.interface'
import type { PushQueueTrainingTask } from '~/common/interfaces/train.interface'

export default async function queue(
  batch: MessageBatch<PushQueueTrainingTask>,
  env: Bindings,
): Promise<void> {
  for (const message of batch.messages) {
    const body = message.body

    try {
		    console.log('processing queue')
      message.ack()
    }
    catch (err) {
      message.retry()
    }
  }
}
