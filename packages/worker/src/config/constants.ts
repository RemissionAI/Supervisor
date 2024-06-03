import { TaskStatus } from '~/common/interfaces/train.interface'

export const ALLOWED_TRAINING_SOURCES = ['url', 'sitemap', 'pdf'] as const
export const TASK_STATUS = Object.values(TaskStatus) as [string, ...string[]]
