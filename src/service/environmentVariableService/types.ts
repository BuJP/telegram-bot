import { z } from "zod";

export const EnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_WEBHOOK_DOMAIN: z.string(),
  REQUIRED_CHILDREN: z.number().default(3),
  PREMIUM_CHAT_IDS: z.string(),
  BASIC_CHAT_ID: z.number(),
  PORT: z.number().default(3000),
});

export type EnvVariables = z.infer<typeof EnvSchema>;
