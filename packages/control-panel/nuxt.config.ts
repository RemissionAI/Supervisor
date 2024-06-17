// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:4242/supervisor/v1",
    },
  },
});