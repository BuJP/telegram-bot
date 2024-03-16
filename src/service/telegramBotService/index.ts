import { Express } from "express";
import { EnvironmentVariableService } from "../environmentVariableService";
import { Telegraf } from "telegraf";
import { TelegramAction } from "./action";
import { ChatMemberHandler } from "./handlers/chatMember";
import { InfoCommand } from "./commands/info";
import { LinksCommand } from "./commands/links";
import { HandlerConfiguration, TelegramActionConstructor } from "./types";

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
      premiumChatIds: this.environmentVariableService.get("PREMIUM_CHAT_IDS"),
      requiredChildrens:
        this.environmentVariableService.get("REQUIRED_CHILDREN"),
    };

    const actionsConstructor: TelegramActionConstructor = {
      bot: this.bot,
      configuration: actionsConfiguration,
    };

    this.actions = [
      new ChatMemberHandler(actionsConstructor),
      new InfoCommand(actionsConstructor),
      new LinksCommand(actionsConstructor),
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
