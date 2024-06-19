import {
  ChatCloudflareWorkersAI,
} from '@langchain/cloudflare'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import type { Context } from 'hono'
import { askQuestionSchema } from '~/lib/validations/ask.validation'
import { createConversationalRetrievalChain } from '~/lib/utils/conversation'
import VectoreStore from '~/lib/utils/ai/store'
import type { Bindings } from '~/common/interfaces/common.interface'

function createCloudflareModel(env: Bindings): ChatCloudflareWorkersAI {
  return new ChatCloudflareWorkersAI({
    model: env.DEFAULT_LLM,
    cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: env.CLOUDFLARE_API_TOKEN,
    verbose: true,
    // baseUrl: `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.GATEWAY_NAME}/workers-ai/`,
  })
}

function createChain(
  env: Bindings,
): ReturnType<typeof createConversationalRetrievalChain> {
  const knowledgeStore = VectoreStore(env)
  const cloudflareModel = createCloudflareModel(env)

  return createConversationalRetrievalChain({
    model: cloudflareModel,
    aiKnowledgeVectorstore: knowledgeStore,
  })
}

export async function ask(c: Context, body: unknown) {
  const data = askQuestionSchema.parse(body)
  const chain = createChain(c.env)

  const answer = await chain.invoke({
    chat_history: [],
    question: data.question,
  })

  return answer.content
}

export async function askSSE(c: Context, body: unknown) {
  const data = askQuestionSchema.parse(body)
  const chain = createChain(c.env)

  const stream = await chain
    .pipe(new HttpResponseOutputParser({ contentType: 'text/event-stream' }))
    .stream(
      {
        chat_history: [],
        question: data.question,
      },
    )

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
