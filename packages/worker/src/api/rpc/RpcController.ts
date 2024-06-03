import { RpcTarget } from 'cloudflare:workers'
import { ServiceError } from '~/lib/utils/ServiceError'

export class RpcController extends RpcTarget {
  train() {
    throw ServiceError.notImplemented()
  }
}
