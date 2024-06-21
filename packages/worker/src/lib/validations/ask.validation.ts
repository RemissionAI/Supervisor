import z from 'zod'

export const askQuestionSchema = z.object({
  question: z.string(),
})

export const chatQuestionSchema = z.object({
  prompt: z.string(),
})
