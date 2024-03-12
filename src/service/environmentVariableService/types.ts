import { z } from "zod";

export const EnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_WEBHOOK_DOMAIN: z.string(),
  REQUIRED_CHILDREN: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "REQUIRED_CHILDREN must be a valid number",
    })
    .transform((value) => Number(value))
    .default("3"),
  PREMIUM_CHAT_IDS: z
    .string()
    .transform((value) => value.split(",").map((id) => id.trim())),
  BASIC_CHAT_ID: z.string(),
  PORT: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "PORT must be a valid number",
    })
    .transform((value) => Number(value))
    .default("3000"),
});

export type EnvVariables = z.infer<typeof EnvSchema>;
