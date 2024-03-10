import prisma from "../../../lib/prisma";
import { TelegramAction } from "../action";

export class LinksCommand extends TelegramAction {
  public async init() {
    this.bot.command("links", async (ctx) => {
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: {
          telegram_id: ctx.message.from.id.toString(),
        },
        select: {
          invitation_link: true,
          childrens: true,
          premium_links: true,
          id: true,
        },
      });

      if (!user) {
        ctx.reply("Utilisateur inconnu");

        return;
      }

      if (user.childrens.length < this.configuration.requiredChildrens) {
        ctx.reply(
          `Veuillez inviter ${
            this.configuration.requiredChildrens - user.childrens.length
          } utilisateurs pour accéder aux liens premium.`
        );

        return;
      }

      const userLinks = user.premium_links.filter((premiumLink) =>
        this.configuration.premiumChatIds.includes(premiumLink.chat_id)
      );

      const missingChatIdLinks = this.configuration.premiumChatIds.filter(
        (chatId) => {
          return userLinks.find((userLink) => userLink.chat_id === chatId);
        }
      );

      for (const chatId of missingChatIdLinks) {
        //Generate a premium chat invite link
        const link = await ctx.telegram.createChatInviteLink(chatId, {
          member_limit: 1,
        });

        const createdLink = await prisma.premium_link.create({
          data: {
            user_id: user.id,
            link: link.invite_link,
            chat_id: chatId,
          },
        });

        userLinks.push(createdLink);
      }

      ctx.reply(
        `Voici vos liens pour accéder aux cannaux premium. Veuillez noter que ces liens ne seront utilisables qu'une seule fois. Assurez-vous de l'utiliser avec précaution \n\n ${userLinks
          .map(({ link }) => link)
          .join("\n")}`
      );
    });
  }
}
