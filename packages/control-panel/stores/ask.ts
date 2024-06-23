import AskService from '~/services/ask'

export const useAskStore = defineStore('ask', () => {
  const question = async (question: string) => {
    return await AskService.question({ question })
  }

  return {
    question,
  }
})
