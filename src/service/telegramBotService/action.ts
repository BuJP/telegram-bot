import { Telegraf } from "telegraf";
import { HandlerConfiguration } from "./types";

export abstract class TelegramAction {
  constructor(
    protected readonly bot: Telegraf,
    protected readonly configuration: HandlerConfiguration
  ) {}

  abstract init(): void;
}
