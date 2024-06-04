import app from '~/api/http/app'
import { RpcController } from './api/rpc/rpc.controller';
import { Bindings } from './common/interfaces/common.interface';
import { WorkerEntrypoint } from 'cloudflare:workers';

export class SupervisorService extends WorkerEntrypoint<Bindings> {
	async target() {
		return new RpcController();
	}
}

export default {
	fetch: app.fetch,
};
