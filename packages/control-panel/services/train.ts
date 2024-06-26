import client from '~/helpers/http'
import type { LoadWebKnowledge } from '~/lib/validation/train'

export interface TrainingTaskDetails {
  error?: string
  failedLinks?: { url: string, reason?: string }[]
  batchesCompleted?: string[]
  totalBatches?: number
}

export interface TrainingTask {
  data: (
    | {
      type: 'sitemap'
      source: string
    }
    | {
      type: 'url'
      source: string
    }
    | {
      type: 'pdf'
      source: File
    }
  )[]
  status: 'queued' | 'processing' | 'completed' | 'failed'
  id: number
  details: TrainingTaskDetails | null
  startedAt: Date
  finishedAt: Date | null
}

export interface Knowledge {
  id: number
  type: string
  source: string
  taskId: number
  content: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

class TrainService {
  private resource = '/train'
  private client = client

  async loadWeb(payload: LoadWebKnowledge) {
    return await this.client.post<{ message: string }>(`${this.resource}/load/web`, payload)
  }

  async loadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return await this.client.post<{ message: string }>(`${this.resource}/load/file`, formData)
  }

  async list(page: number = 1, limit: number = 10) {
    return await this.client.get<TrainingTask[]>(`${this.resource}/list?page=${page}&size=${limit}`)
  }

  async listKnowledge(taskId: number, page: number = 1, limit: number = 10) {
    return await this.client.get<Knowledge[]>(`${this.resource}/${taskId}/knowledge?page=${page}&size=${limit}`)
  }

  async getTask(taskId: number) {
    return await this.client.get<TrainingTask>(`${this.resource}/${taskId}`)
  }

  async getCount() {
    return await this.client.get<{ count: number }>(`${this.resource}/list/count`)
  }

  async getKnowledgeCount(taskId: number) {
    return await this.client.get<{ count: number }>(`${this.resource}/${taskId}/count`)
  }
}

export default new TrainService()
