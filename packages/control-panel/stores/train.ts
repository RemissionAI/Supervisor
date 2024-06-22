import TrainService from "~/services/train";

export const useTrainStore = defineStore("train", () => {
  const list = async (page?: number, limit?: number) => {
    return await TrainService.list(page, limit);
  };

  return {
    list,
  };
});
