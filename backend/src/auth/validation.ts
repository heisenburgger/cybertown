import { z } from "zod";

export const userInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string()
})

// TODO: how to get this enum from schema?
export const callbackParamsSchema = z.object({
  provider: z.enum(["google", "github"])
})
