import type { VectorStore } from '@langchain/core/vectorstores'
import type { BaseLanguageModel } from '@langchain/core/language_models/base'
import type { Document } from '@langchain/core/documents'
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { RunnableBranch, RunnableSequence } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'

const CONDENSE_QUESTION_SYSTEM_TEMPLATE = `You are an experienced AI health supervisor, expert at interpreting and answering questions based on provided sources.
Your job is to remove references to chat history from incoming questions, rephrasing them as standalone questions.`

const CONDENSE_QUESTION_HUMAN_TEMPLATE = `Using only previous conversation as context, rephrase the following question to be a standalone question.

Do not respond with anything other than a rephrased standalone question. Be concise, but complete and resolve all references to the chat history.

Always answer with the language of the question

<question>
  {question}
</question>`

const condenseQuestionPrompt = ChatPromptTemplate.fromMessages([
  ['system', CONDENSE_QUESTION_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('chat_history'),
  ['human', CONDENSE_QUESTION_HUMAN_TEMPLATE],
])

const ANSWER_SYSTEM_TEMPLATE = `Your name is Flupus, You are an AI Health supervisor researcher.`

const ANSWER_HUMAN_TEMPLATE = `Answer the following question to the best of your ability:

{standalone_question}`

const answerPrompt = ChatPromptTemplate.fromMessages([
  ['system', ANSWER_SYSTEM_TEMPLATE],
  // Adding chat history as part of the final answer generation is distracting for a small model like Llama 2-7B.
  // If using a more powerful model, you can re-enable to better support meta-questions about the conversation.
  // new MessagesPlaceholder("chat_history"),
  ['human', ANSWER_HUMAN_TEMPLATE],
])

function formatDocuments(docs: Document[]) {
  return docs
    .map((doc, i) => {
      return `<doc>\n${doc.pageContent}\n</doc>`
    })
    .join('\n')
}

export function createConversationalRetrievalChain({
  model,
  aiKnowledgeVectorstore,
}: {
  model: BaseLanguageModel
  aiKnowledgeVectorstore: VectorStore
}) {
  const aiKnowledgeRetriever = aiKnowledgeVectorstore
		.asRetriever()
		.withConfig({ runName: "AIKnowledgeRetriever" })

  const retrievalChain = RunnableSequence.from([
    RunnableSequence.from([
      input => input.standalone_question,
      aiKnowledgeRetriever,
    ]),
    formatDocuments,
  ]).withConfig({ runName: 'RetrievalChain' })

  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]).withConfig({ runName: 'RephraseQuestionChain' })

  const answerChain = RunnableSequence.from([
    {
      standalone_question: input => input.standalone_question,
      chat_history: input => input.chat_history,
      context: retrievalChain,
    },
    answerPrompt,
    model,
  ]).withConfig({ runName: 'AnswerGenerationChain' })

  return RunnableSequence.from([
    {
      standalone_question: RunnableBranch.from([
        [input => input.chat_history.length > 0, standaloneQuestionChain],
        input => input.question,
      ]),
      chat_history: input => input.chat_history,
    },
    answerChain,
  ]).withConfig({ runName: 'ConversationalRetrievalChain' })
}
