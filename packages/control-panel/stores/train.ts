import type { LoadWebKnowledge } from '~/lib/validation/train'
import TrainService from '~/services/train'

export const useTrainStore = defineStore('train', () => {
  const loadWebKnowledge = async (payload: LoadWebKnowledge) => {
    return await TrainService.loadWeb(payload)
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

  const retrainKnowledge = async (knowledgeId: number) => {
    return await TrainService.retrainKnowledge(knowledgeId)
  }

  const batchDeleteKnowledge = async (ids: number[]) => {
    return await TrainService.batchDeleteKnowlege(ids)
  }

  return {
    loadWebKnowledge,
    list,
    getCount,
    listKnowledge,
    getKnowledgeCount,
    getTask,
    retrainKnowledge,
    batchDeleteKnowledge
  }
})
