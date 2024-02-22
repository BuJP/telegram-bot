import express from "express";
import { Telegraf } from "telegraf";

const token = "";
const webhookDomain = "";
const port = 3000;

const bot = new Telegraf("");
const app = express();

bot.createWebhook({ domain: webhookDomain }).then(app.use);

app.listen(port, () => console.log("Listening on port", port));
