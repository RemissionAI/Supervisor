import { TaskStatus } from '~/common/interfaces/train.interface'

export const ALLOWED_TRAINING_SOURCES = ['url', 'sitemap', 'pdf'] as const
export const TASK_STATUS = Object.values(TaskStatus)

export const EMBEDDINGS_MODEL = '@cf/baai/bge-base-en-v1.5'
