import { Express } from "express";
import { EnvironmentVariableService } from "../environmentVariableService";
import { Telegraf } from "telegraf";
import { TelegramAction } from "./action";
import { ChatMemberHandler } from "./handlers/chatMember";
import { InfoCommand } from "./commands/info";
import { LinksCommand } from "./commands/links";
import { HandlerConfiguration } from "./types";

export class TelegramBotService {
  private readonly bot: Telegraf;
  private readonly actions: TelegramAction[];

  constructor(
    private readonly environmentVariableService: EnvironmentVariableService
  ) {
    this.bot = new Telegraf(
      this.environmentVariableService.get("TELEGRAM_BOT_TOKEN")
    );

    const actionsConfiguration: HandlerConfiguration = {
      basicChatId: this.environmentVariableService.get("BASIC_CHAT_ID"),
      premiumChatIds: this.environmentVariableService
        .get("PREMIUM_CHAT_IDS")
        .split(", "),
      requiredChildrens:
        this.environmentVariableService.get("REQUIRED_CHILDREN"),
    };

    this.actions = [
      new ChatMemberHandler(this.bot, actionsConfiguration),
      new InfoCommand(this.bot, actionsConfiguration),
      new LinksCommand(this.bot, actionsConfiguration),
    ];
  }

  public async start(server: Express) {
    const webhook = await this.bot.createWebhook({
      domain: this.environmentVariableService.get("TELEGRAM_WEBHOOK_DOMAIN"),
      allowed_updates: ["chat_member", "message"],
    });

    server.use(webhook);

    for (const action of this.actions) {
      action.init();
    }
  }

  public stop(signal?: string) {
    this.bot.stop(signal);
  }
}
