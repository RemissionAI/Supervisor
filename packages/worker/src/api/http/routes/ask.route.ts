import { Hono } from "hono";
import type { Environment } from "~/common/interfaces/common.interface";
import * as AskController from "~/api/http/controllers/ask.controller";

export const route = new Hono<Environment>();

route.post("/", AskController.ask);
