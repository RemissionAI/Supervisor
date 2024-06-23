import TrainService from '~/services/train'

export const useTrainStore = defineStore('train', () => {
  const list = async (page?: number, limit?: number) => {
    return await TrainService.list(page, limit)
  }

  const listKnowledge = async (taskId: number, page?:number, limit?: number) => {
    return await TrainService.listKnowledge(taskId, page, limit)
  }

  const getCount = async () => {
    return await TrainService.getCount()
  }

  const getKnowledgeCount = async (taskId: number) => {
    return await TrainService.getKnowledgeCount(taskId)
  }

  return {
    list,
    getCount,
    listKnowledge,
    getKnowledgeCount
  }
})
