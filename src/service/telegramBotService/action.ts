import { Telegraf } from "telegraf";
import { HandlerConfiguration, TelegramActionConstructor } from "./types";

export abstract class TelegramAction {
  protected readonly bot: Telegraf;
  protected readonly configuration;

  constructor(constructor: TelegramActionConstructor) {
    this.bot = constructor.bot;
    this.configuration = constructor.configuration;
  }

  abstract init(): void;
}
