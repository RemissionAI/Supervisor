import { ChatCloudflareWorkersAI } from '@langchain/cloudflare'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import type { Context } from 'hono'
import { ChatOpenAI } from '@langchain/openai'
import { askQuestionSchema } from '~/lib/validations/ask.validation'
import { createConversationalRetrievalChain } from '~/lib/utils/conversation'
import VectoreStore from '~/lib/utils/ai/store'
import { KvCache } from '~/lib/utils/kv-cache'
import { KV_SETTINGS_KEY } from '~/config/constants'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { ModelSettings } from '~/common/interfaces/internal.interface'

async function getModelSettings(cache: KvCache): Promise<ModelSettings | null> {
  return await cache.read<ModelSettings>(KV_SETTINGS_KEY, 'json')
}

function initializeModel(
  env: Bindings,
  modelSettings: ModelSettings | null,
): ChatCloudflareWorkersAI | ChatOpenAI {
  if (modelSettings?.model?.provider === 'openai' && modelSettings.openaiKey) {
    return new ChatOpenAI({
      model: modelSettings.model.id,
      openAIApiKey: modelSettings.openaiKey,
    })
  }
  else {
    return new ChatCloudflareWorkersAI({
      model: modelSettings?.model?.provider === 'workers-ai' && modelSettings.model.id ? modelSettings.model.id : env.DEFAULT_LLM,
      cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
      cloudflareApiToken: env.CLOUDFLARE_API_TOKEN,
      verbose: true,
    })
  }
}

async function createChain(
  env: Bindings,
): Promise<ReturnType<typeof createConversationalRetrievalChain>> {
  const knowledgeStore = VectoreStore(env)
  const cache = new KvCache(env.SUPERVISOR_KV)
  const modelSettings = await getModelSettings(cache)
  const model = initializeModel(env, modelSettings)

  return createConversationalRetrievalChain({
    model,
    aiKnowledgeVectorstore: knowledgeStore,
    systemPrompt: modelSettings?.systemPrompt,
  })
}

export async function ask(c: Context, body: unknown) {
  const data = askQuestionSchema.parse(body)
  const chain = await createChain(c.env)

  const answer = await chain.invoke({
    chat_history: [],
    question: data.question,
  })

  return answer.content
}

export async function askSSE(c: Context, body: unknown) {
  const data = askQuestionSchema.parse(body)
  const chain = await createChain(c.env)

  const stream = await chain
    .pipe(new HttpResponseOutputParser({ contentType: 'text/event-stream' }))
    .stream({
      chat_history: [],
      question: data.question,
    })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
