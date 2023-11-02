import { Telegraf, session } from "telegraf";
import {} from "dotenv/config";
import { Stage } from "./Stage.js";
import { VPN } from "./outline.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
const admins = process.env.ADMIN_ID.split(";").map(Number);

bot.use(session());
bot.use(Stage.middleware());

bot.start(
  async (ctx) => await ctx.reply("Введи /newuser и, если ты избран...")
);

//Создание нового ключа с именем и ограничение по трафику
bot.command(["newUser", "newuser"], async (ctx) => {
  if (admins.includes(ctx.message.from.id)) {
    await ctx.scene.enter("userName");
  }
});

//Создание нового дефолтного ключа
bot.command(["newKey", "newkey"], async (ctx) => {
  if (admins.includes(ctx.message.from.id)) {
    await VPN.createNewKey()
      .then(async (res) => {
        let text = `Вот твой ключик ${res.data.id}\n`;
        await ctx.reply(text + `${res.data.accessUrl}`, {
          entities: [
            {
              offset: text.length,
              length: res.data.accessUrl.length,
              type: "code",
            },
          ],
        });
        return res;
      })
      .catch(async (err) => {
        await ctx.reply("Что-то пошло не так...\n" + err);
      });
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
