import type { VectorStore } from '@langchain/core/vectorstores'
import type { BaseLanguageModel } from '@langchain/core/language_models/base'
import type { Document } from '@langchain/core/documents'

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { RunnableBranch, RunnableSequence } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ANSWER_HUMAN_TEMPLATE, ANSWER_SYSTEM_TEMPLATE, CONDENSE_QUESTION_HUMAN_TEMPLATE, CONDENSE_QUESTION_SYSTEM_TEMPLATE } from './ai/templates'

const condenseQuestionPrompt = ChatPromptTemplate.fromMessages([
  ['system', CONDENSE_QUESTION_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('chat_history'),
  ['human', CONDENSE_QUESTION_HUMAN_TEMPLATE],
])

function answerPrompt(answerSystemPrompt?: string) {
  return ChatPromptTemplate.fromMessages([
    ['system', answerSystemPrompt || ANSWER_SYSTEM_TEMPLATE],
    ['human', ANSWER_HUMAN_TEMPLATE],
  ])
}

function formatDocuments(docs: Document[]): string {
  return docs.map(doc => `<doc>\n${doc.pageContent}\n</doc>`).join('\n')
}

function createAIKnowledgeRetriever(aiKnowledgeVectorstore: VectorStore) {
  return aiKnowledgeVectorstore
    .asRetriever({ k: 5 })
    .withConfig({ runName: 'AIKnowledgeRetriever' })
}

function createStandaloneQuestionChain(model: BaseLanguageModel) {
  return RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]).withConfig({ runName: 'RephraseQuestionChain' })
}

function createRetrievalChain(aiKnowledgeRetriever: any) {
  return RunnableSequence.from([
    RunnableSequence.from([
      (input: any) => input.standalone_question,
      aiKnowledgeRetriever,
    ]),
    formatDocuments,
  ]).withConfig({ runName: 'RetrievalChain' })
}

function createAnswerChain(model: BaseLanguageModel, retrievalChain: any, systemPrompt?: string) {
  return RunnableSequence.from([
    {
      standalone_question: (input: any) => input.standalone_question,
      chat_history: (input: any) => input.chat_history,
      context: retrievalChain,
    },
    answerPrompt(systemPrompt),
    model,
  ]).withConfig({ runName: 'AnswerGenerationChain' })
}

export function createConversationalRetrievalChain({
  model,
  aiKnowledgeVectorstore,
  systemPrompt,
}: {
  model: BaseLanguageModel
  aiKnowledgeVectorstore: VectorStore
  systemPrompt?: string
}) {
  const aiKnowledgeRetriever = createAIKnowledgeRetriever(
    aiKnowledgeVectorstore,
  )
  const retrievalChain = createRetrievalChain(aiKnowledgeRetriever)
  const standaloneQuestionChain = createStandaloneQuestionChain(model)
  const answerChain = createAnswerChain(model, retrievalChain, systemPrompt)

  return RunnableSequence.from([
    {
      standalone_question: RunnableBranch.from([
        [
          (input: any) => input.chat_history.length > 0,
          standaloneQuestionChain,
        ],
        (input: any) => input.question,
      ]),
      chat_history: (input: any) => input.chat_history,
    },
    answerChain,
  ]).withConfig({ runName: 'ConversationalRetrievalChain' })
}
