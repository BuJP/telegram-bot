import express from "express";
import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";

/**
 * Load environment variables from the .env file.
 */
config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_WEBHOOK_DOMAIN = process.env.TELEGRAM_WEBHOOK_DOMAIN || "";
const REQUIERED_CHILDREN =
  parseInt(process.env.REQUIERED_CHILDREN + "", 10) || 3;
const PREMIUM_CHAT_ID = parseInt(process.env.PREMIUM_CHAT_ID + "", 10) || -100;
const BASIC_CHAT_ID = parseInt(process.env.BASIC_CHAT_ID + "", 10) || -100;

const PORT = process.env.PORT || 3000;

const app = express();
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const prisma = new PrismaClient();

const init = async () => {
  app.use(
    await bot.createWebhook({
      domain: TELEGRAM_WEBHOOK_DOMAIN,
      allowed_updates: ["chat_member", "message"],
    })
  );
};

init();

/**
 * Event handler for the "chat_member" event.
 */
bot.on("chat_member", async (ctx) => {
  // Check if the update is from the correct chat and if the user is a new member
  if (
    ctx.chat.id !== BASIC_CHAT_ID ||
    ctx.chatMember.new_chat_member.status !== "member"
  ) {
    return;
  }

  const userTelegramId = ctx.chatMember.from.id.toString();
  const linkedUserInvitationLink = ctx.chatMember.invite_link;

  // Check if the user is already in the database
  const user = await prisma.user.findUnique({
    where: {
      telegram_id: userTelegramId,
    },
  });

  // If the user is already in the database do nothing
  if (user) {
    return;
  }

  // Create a new chat invite link for the user
  const link = await ctx.createChatInviteLink();

  // Save the new user in the database
  const newUser = await prisma.user.create({
    data: {
      telegram_id: userTelegramId,
      invitation_link: link.invite_link,
    },
  });

  // Check if the new member was invited by another user
  if (linkedUserInvitationLink === undefined) {
    return;
  }
  // Find the user who invited the new member in the database
  const linkedUser = await prisma.user.findFirst({
    where: {
      invitation_link: linkedUserInvitationLink?.invite_link,
    },
  });

  if (!linkedUser) {
    return;
  }

  // Create a relation between the new user and the inviting user
  await prisma.relation.create({
    data: {
      children_id: newUser.id,
      parent_id: linkedUser?.id || "",
    },
  });
});

/**
 * Command handler for the "/info" command.
 */
bot.command("info", async (ctx) => {
  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      telegram_id: ctx.message.from.id.toString(),
    },
    select: {
      invitation_link: true,
      childrens: true,
      premium_link: true,
      id: true,
    },
  });

  if (!user) {
    return;
  }

  // Check if the user has enough referred users to generate a premium link
  if (
    user.childrens.length >= REQUIERED_CHILDREN &&
    user.premium_link === null
  ) {
    // Generate a premium chat invite link
    const link = await ctx.telegram.createChatInviteLink(PREMIUM_CHAT_ID, {
      member_limit: 1,
    });

    // Update the user's premium link in the database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        premium_link: link.invite_link,
      },
    });

    // Send the generated premium link to the user
    ctx.reply(
      `Voici votre lien pour accéder au canal premium. Veuillez noter que ce lien ne sera utilisable qu'une seule fois. Assurez-vous de l'utiliser avec précaution.\n ${link.invite_link}`
    );

    return;
  } else if (user.childrens.length >= REQUIERED_CHILDREN && user.premium_link) {
    // Inform the user that they have already generated a premium link
    ctx.reply("Vous avez déjà généré votre lien d'invitation au canal premium");

    return;
  }

  // Provide information about the user's referral link and the number of referred users needed
  ctx.reply(
    `Votre lien a permis à permis ${
      user.childrens.length
    } utilisateurs de rejoindre le canal. Il ne vous manque plus que ${
      REQUIERED_CHILDREN - user.childrens.length
    } utilisateurs pour débloquer l'accès au canal premium. Continuez à partager votre lien d'invitation unique : ${
      user.invitation_link
    }`
  );
});

app.listen(PORT, () => console.log("Listening on port", PORT));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
