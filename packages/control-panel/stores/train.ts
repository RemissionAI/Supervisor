import type { AddKnowledge } from '~/lib/validation/train'
import TrainService from '~/services/train'

export const useTrainStore = defineStore('train', () => {
  const addKnowledge = async (payload: AddKnowledge) => {
    return await TrainService.addKnowledge(payload)
  }

  const list = async (page?: number, limit?: number) => {
    return await TrainService.list(page, limit)
  }

  const listKnowledge = async (taskId: number, page?: number, limit?: number) => {
    return await TrainService.listKnowledge(taskId, page, limit)
  }

  const getCount = async () => {
    return await TrainService.getCount()
  }

  const getTask = async (taskId: number) => {
    return await TrainService.getTask(taskId)
  }

  const getKnowledgeCount = async (taskId: number) => {
    return await TrainService.getKnowledgeCount(taskId)
  }

  return {
    addKnowledge,
    list,
    getCount,
    listKnowledge,
    getKnowledgeCount,
    getTask,
  }
})
