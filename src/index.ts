import express from "express";
import { EnvironmentVariableService } from "./service/environmentVariableService";
import { TelegramBotService } from "./service/telegramBotService";

const app = express();
const environmentVariableService = new EnvironmentVariableService();
const bot = new TelegramBotService(environmentVariableService);
bot.start(app);

const PORT = environmentVariableService.get("PORT");

app.listen(PORT, () => console.log("Listening on port", PORT));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
