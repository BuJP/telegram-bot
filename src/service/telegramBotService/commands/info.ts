import prisma from "../../../lib/prisma";
import { TelegramAction } from "../action";
import { TelegramActionConstructor } from "../types";

export class InfoCommand extends TelegramAction {
  constructor(constructor: TelegramActionConstructor) {
    super(constructor);
  }

  public async init() {
    this.bot.command("info", async (ctx) => {
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: {
          telegram_id: ctx.message.from.id.toString(),
        },
        select: {
          invitation_link: true,
          childrens: true,
        },
      });

      if (!user) {
        ctx.reply("Utilisateur inconnu");

        return;
      }

      if (user.childrens.length < this.configuration.requiredChildrens) {
        ctx.reply(
          `Votre lien a permis à ${
            user.childrens.length
          } utilisateurs de rejoindre le canal. Il ne vous manque plus que ${
            this.configuration.requiredChildrens - user.childrens.length
          } utilisateurs pour débloquer l'accès au canal premium. Continuez à partager votre lien d'invitation unique : ${
            user.invitation_link
          }`
        );

        return;
      }

      ctx.reply(
        `Votre lien a permis à ${user.childrens.length} utilisateurs de rejoindre le canal. Pour accéder à vos liens premium, veuillez envoyer "/links".`
      );
    });
  }
}
