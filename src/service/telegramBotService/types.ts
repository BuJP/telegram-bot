import { Telegraf } from "telegraf";

export type HandlerConfiguration = {
  basicChatId: string;
  premiumChatIds: string[];
  requiredChildrens: number;
};

export type TelegramActionConstructor = {
  bot: Telegraf;
  configuration: HandlerConfiguration;
};
