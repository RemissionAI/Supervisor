import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { ChatOpenAI } from "@langchain/openai";

import {
  ChatCloudflareWorkersAI,
  CloudflareVectorizeStore,
  CloudflareWorkersAIEmbeddings,
} from '@langchain/cloudflare'
import type { Context } from 'hono'
import { createConversationalRetrievalChain } from '~/lib/utils/conversation'
import ResponseHandler from '~/lib/utils/response-handler'

function formatChatHistory(chatHistory: { type: 'ai' | 'human', content: string }[]) {
  const messages = chatHistory.map((message) => {
    if (message.type === 'ai') {
      return new AIMessage({ content: message.content })
    }
    else {
      return new HumanMessage({ content: message.content })
    }
  })

  return messages
}

export async function ask(c: Context) {
  const body = await c.req.json()

  const { messages } = body
  const history = messages.slice(0, -1)
  const currentMessage = messages[messages.length - 1]

  const embeddings = new CloudflareWorkersAIEmbeddings({
		binding: c.env.AI,
		modelName: "@cf/baai/bge-small-en-v1.5",
	});

  const aiKnowledgeVectorstore = new CloudflareVectorizeStore(embeddings, {
    index: c.env.KNOWLEDGE_INDEX,
  })

  console.log(`Default llm: `, c.env.DEFAULT_LLM)
  console.log(`Account ID: `, c.env.CLOUDFLARE_ACCOUNT_ID);
  console.log(`CF Token: `, c.env.CLOUDFLARE_API_TOKEN);
  console.log(`OpenAI: `, c.env.OPENAI_KEY);

  const cloudflareModel = new ChatCloudflareWorkersAI({
		model: c.env.DEFAULT_LLM,
		cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
		cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
		verbose: true,
	});

  const openAImodel = new ChatOpenAI({
    model: 'gpt-4o',
		temperature: 0.9,
		apiKey: c.env.OPENAI_KEY,
	});

  const chain = createConversationalRetrievalChain({
		model: cloudflareModel,
		aiKnowledgeVectorstore,
	});

  // let runIdResolver: (runId: string) => void
  // const runIdPromise = new Promise<string>((resolve) => {
  //   runIdResolver = resolve
  // })

  const answer = await chain.invoke({
    chat_history: formatChatHistory(history),
    question: currentMessage.content,
  })

  return ResponseHandler.success(c, answer)

  // const stream = await chain
  //   .pipe(new HttpResponseOutputParser({ contentType: 'text/event-stream' }))
  //   .stream(
  //     {
  //       chat_history: formatChatHistory(history),
  //       question: currentMessage.content,
  //     },
  //     {
  //       callbacks: [
  //         {
  //           handleChainStart(_llm, _prompts, runId) {
  //             runIdResolver(runId)
  //           },
  //         },
  //       ],
  //     },
  //   )

  // const runId = await runIdPromise
  // return new Response(stream, {
  //   headers: {
  //     'Content-Type': 'text/event-stream',
  //     'X-Langsmith-Run-Id': runId,
  //   },
  // })
}
