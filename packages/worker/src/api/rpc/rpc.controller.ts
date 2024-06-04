import { RpcTarget } from 'cloudflare:workers'
import { ServiceError } from '~/lib/utils/service-error'

export class RpcController extends RpcTarget {
  train() {
    throw ServiceError.notImplemented()
  }
}
