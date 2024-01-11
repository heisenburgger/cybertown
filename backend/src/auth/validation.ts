import { z } from "zod";

export const userInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string()
})
