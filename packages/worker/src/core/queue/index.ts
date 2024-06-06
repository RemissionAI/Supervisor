import type { Bindings } from "~/common/interfaces/common.interface";

export default async function queue(
	batch: MessageBatch<any>,
	env: Bindings
): Promise<void> {
	for (const message of batch.messages) {
		const body = message.body;

		try {
		    console.log("processing queue");
			message.ack();
		} catch (err) {
			message.retry();
		}
	}
}
