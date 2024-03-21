import { Context, NarrowedContext } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { TelegramAction } from "../action";
import prisma from "../../../lib/prisma";
import { TelegramActionConstructor } from "../types";

export class ChatMemberHandler extends TelegramAction {
  constructor(constructor: TelegramActionConstructor) {
    super(constructor);
  }

  public async init() {
    this.bot.on("chat_member", this.handle.bind(this));
  }

  private async handle(
    ctx: NarrowedContext<Context<Update>, Update.ChatMemberUpdate>
  ) {
    // Check if the update is from the correct chat and if the user is a new member
    if (
      ctx.chat.id.toString() !== this.configuration.basicChatId ||
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
    await prisma.invitation.create({
      data: {
        inviteeId: newUser.id,
        inviterId: linkedUser?.id || "",
      },
    });
  }
}
