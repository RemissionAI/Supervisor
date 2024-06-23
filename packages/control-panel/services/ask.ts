import client from '~/helpers/http'

export interface AskQuestionParams { question: string }
export interface AskQuestionResponse { answer: string }

class AskService {
  private resource = '/ask'
  private client = client

  async question(payload: AskQuestionParams) {
    return await this.client.post<AskQuestionResponse>(this.resource, payload)
  }
}

export default new AskService()
