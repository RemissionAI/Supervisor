import { WorkerEntrypoint } from 'cloudflare:workers'
import { RpcController } from './api/rpc/rpc.controller'
import type { Bindings } from './common/interfaces/common.interface'
import app from '~/api/http/app'

export class SupervisorService extends WorkerEntrypoint<Bindings> {
  async target() {
    return new RpcController()
  }
}

export default {
  fetch: app.fetch,
}
