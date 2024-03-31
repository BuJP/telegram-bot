import prisma from "../../../lib/prisma";
import { TelegramAction } from "../action";
import { TelegramActionConstructor } from "../types";

export class LinksCommand extends TelegramAction {
  constructor(constructor: TelegramActionConstructor) {
    super(constructor);
  }

  public async init() {
    this.bot.command("links", async (ctx) => {
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: {
          telegram_id: ctx.message.from.id.toString(),
        },
        select: {
          invitation_link: true,
          invitationsSent: true,
          premium_links: true,
          id: true,
        },
      });

      if (!user) {
        ctx.reply("Utilisateur inconnu");

        return;
      }

      if (
        user.invitationsSent.length <
        this.configuration.numberOfInvitationsRequired
      ) {
        ctx.reply(
          `Veuillez inviter ${
            this.configuration.numberOfInvitationsRequired -
            user.invitationsSent.length
          } utilisateurs pour accéder aux liens premium.`
        );

        return;
      }

      const premiumChannels = await prisma.premium_channel.findMany({
        where: {
          isEnabled: true,
        },
      });

      const userChannelLinks: Array<{ link: string; name: string }> = [];

      for (const channel of premiumChannels) {
        let userLink = user.premium_links.find(
          (userLink) => channel.id === userLink.channel_id
        );

        if (!userLink) {
          //Generate a premium chat invite link
          const link = await ctx.telegram.createChatInviteLink(channel.id, {
            member_limit: 1,
          });

          userLink = await prisma.premium_link.create({
            data: {
              user_id: user.id,
              link: link.invite_link,
              channel_id: channel.id,
            },
          });
        }

        userChannelLinks.push({
          name: channel.name,
          link: userLink.link,
        });
      }

      ctx.reply(
        `Voici vos liens pour accéder aux cannaux premium. Veuillez noter que ces liens ne seront utilisables qu'une seule fois. Assurez-vous de l'utiliser avec précaution \n\n ${userChannelLinks
          .map(({ link, name }) => `${name} : ${link}`)
          .join("\n\n")}`
      );
    });
  }
}
