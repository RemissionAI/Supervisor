type Value = string | ReadableStream | ArrayBuffer

type KVNamespaceGetType = 'text' | 'json' | 'arrayBuffer' | 'stream'

export class KvCache {
  private namespace: KVNamespace

  constructor(namespace: KVNamespace) {
    if (!namespace) {
      throw new Error('Namespace is required')
    }
    this.namespace = namespace
  }

  async write(
    key: string,
    value: Value,
    options?: KVNamespacePutOptions,
  ): Promise<void> {
    try {
      await this.namespace.put(key, value, options)
    }
    catch (error) {
      this.handleError(`Failed to write key ${key}`, error)
    }
  }

  async read<T>(
    key: string,
    type: KVNamespaceGetType = 'text',
  ): Promise<T | null> {
    try {
      switch (type) {
        case 'json':
          return await this.namespace.get<T>(key, 'json')
        case 'arrayBuffer':
          return (await this.namespace.get(key, 'arrayBuffer')) as unknown as T
        case 'stream':
          return (await this.namespace.get(key, 'stream')) as unknown as T
        default:
          return (await this.namespace.get(key, 'text')) as unknown as T
      }
    }
    catch (error) {
      this.logError(`Failed to read key ${key}`, error)
      return null
    }
  }

  async getWithMetadata<T, Metadata>(
    key: string,
    type: KVNamespaceGetType = 'text',
  ): Promise<{ value: T | null, metadata: Metadata | null }> {
    try {
      switch (type) {
        case 'json':
          return await this.namespace.getWithMetadata<T, Metadata>(key, 'json')
        case 'arrayBuffer':
          return (await this.namespace.getWithMetadata(
            key,
            'arrayBuffer',
          )) as unknown as { value: T | null, metadata: Metadata | null }
        case 'stream':
          return (await this.namespace.getWithMetadata(
            key,
            'stream',
          )) as unknown as { value: T | null, metadata: Metadata | null }
        default:
          return (await this.namespace.getWithMetadata(
            key,
            'text',
          )) as unknown as { value: T | null, metadata: Metadata | null }
      }
    }
    catch (error) {
      this.logError(`Failed to read key ${key} with metadata`, error)
      return {
        value: null,
        metadata: null,
      }
    }
  }

  async list<T>(
    options?: KVNamespaceListOptions,
  ): Promise<KVNamespaceListResult<T, string>> {
    try {
      return await this.namespace.list<T>(options)
    }
    catch (error) {
      this.handleError('Failed to list keys', error)
    }
  }

  private handleError(message: string, error: unknown): never {
    if (error instanceof Error) {
      throw new TypeError(`${message}: ${error.message}`)
    }
    else {
      throw new TypeError(message)
    }
  }

  private logError(message: string, error: unknown): void {
    if (error instanceof Error) {
      console.error(`${message}:`, error.message)
    }
    else {
      console.error(message)
    }
  }
}
