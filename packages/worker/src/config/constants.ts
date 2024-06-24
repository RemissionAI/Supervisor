import { TaskStatus } from '~/common/interfaces/train.interface'

export const ALLOWED_TRAINING_SOURCES = ['url', 'sitemap', 'pdf'] as const
export const TASK_STATUS = Object.values(TaskStatus)

export const EMBEDDINGS_MODEL = '@cf/baai/bge-small-en-v1.5'

export const JINA_READER_PREFIX = 'https://r.jina.ai/'

export const KV_SETTINGS_KEY = 'internal:model-settings'

export const SUPPORTED_TEXT_GENERATION_MODELS = [
  {
    provider: 'workers-ai',
    id: '@cf/meta/llama-2-7b-chat-fp16',
    label: 'llama-2-7b-chat-fp16',
  },
  {
    provider: 'workers-ai',
    id: '@hf/google/gemma-7b-it',
    label: 'gemma-7b-it',
  },
  {
    provider: 'workers-ai',
    id: '@cf/meta/llama-3-8b-instruct',
    label: 'llama-3-8b-instruct',
  },
  {
    provider: 'workers-ai',
    id: '@hf/mistral/mistral-7b-instruct-v0.2',
    label: 'mistral-7b-instruct-v0.2',
  },
  {
    provider: 'openai',
    id: 'gpt-4o',
    label: 'GPT4-o',
  },
  {
    provider: 'openai',
    id: 'gpt-4-turbo',
    label: 'GPT-4 Turbo',
  },
  {
    provider: 'openai',
    id: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
  },
  {
    provider: 'anthropic',
    id: 'claude-3-5-sonnet-20240620',
    label: 'Claude 3.5 Sonnet',
  },
]
