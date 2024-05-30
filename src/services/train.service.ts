import { AddKnowledgeSchema } from '~/lib/validations/train.validation'
import { ServiceError } from '~/lib/utils/ServiceError'
import KnowledgeLoader from '~/lib/utils/KnowledgeLoader'

export async function train(data: unknown) {
  const knowledge = AddKnowledgeSchema.parse(data)

  switch (knowledge.type) {
    case 'url':
      return await KnowledgeLoader.loadUrl(knowledge.source)
    default:
      throw ServiceError.notImplemented()
  }
}
