import client from '~/helpers/http'

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

class TrainService {
  private resource = '/train'
  private client = client

  async list(page: number = 1, limit: number = 10) {
    return await this.client.get<TrainingTask[]>(`${this.resource}/list?page=${page}&size=${limit}`)
  }

  async getCount() {
    return await this.client.get<{ count: number }>(`${this.resource}/list/count`)
  }
}

export default new TrainService()
