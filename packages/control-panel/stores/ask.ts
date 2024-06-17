import AskSerivce, { type AskQuestionParams } from "~/services/ask";

export const useAskStore = defineStore("ask", () => {
  const question = async (question: string) => {
    return await AskSerivce.question({ question });
  };

  return {
    question
  };
});
