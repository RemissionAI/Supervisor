import client from "~/helpers/http";

export interface TrainingTaskDetails {
  error?: string;
  failedLinks?: { url: string; reason?: string }[];
  batchesCompleted?: string[];
  totalBatches?: number;
}

export type TrainingTask = {
  data: (
    | {
        type: "sitemap";
        source: string;
      }
    | {
        type: "url";
        source: string;
      }
    | {
        type: "pdf";
        source: File;
      }
  )[];
  status: "queued" | "processing" | "completed" | "failed";
  id: number;
  details: TrainingTaskDetails | null;
  startedAt: Date;
  finishedAt: Date | null;
};


class TrainService {
  private resource = "/train";
  private client = client;

  async list(page: number = 1, limit: number = 10) {
    return await this.client.get<TrainingTask[]>(`${this.resource}/list?page=${page}&size=${limit}`);
  }
}

export default new TrainService();
