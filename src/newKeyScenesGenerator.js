import { Scenes, session } from "telegraf";
import { VPN } from "./outline.js";

class newKeyScenesGenerator {

  // async getUserId() {
  //   const userId = new Scenes.BaseScene("userId");

  //   userId.enter(async (ctx) => {
  //     ctx.session.myData = {};
  //     await ctx.reply(
  //       "Напиши идентификатор пользователя(номер телефона или id в телеграмме): "
  //     );
  //   });

  //   userId.on("text", async (ctx) => {
  //     if (Number(ctx.message.text) >= 0) {
  //       ctx.session.myData.userId = ctx.message.text;
  //       await ctx.scene.enter("userName");
  //     } else {
  //       await ctx.reply("Введи число, пожалуйста");
  //       await ctx.scene.reenter();
  //     }
  //   });

  //   userId.on("message", async (ctx) => {
  //     await ctx.reply("Введи число, пожалуйста");
  //     await ctx.scene.reenter();
  //   });

  //   return userId;
  // }
  
  async getUserName() {
    const userName = new Scenes.BaseScene("userName");

    userName.enter(async (ctx) => {
      ctx.session.myData = {};
      await ctx.reply("Напиши имя пользователя:");
    });

    userName.on("text", async (ctx) => {
      ctx.session.myData.userName = ctx.message.text;
      await ctx.scene.enter("userDataLimit");
    });
    userName.on("message", async (ctx) => {
      await ctx.reply("Введи текст, пожалуйста");
      await ctx.scene.reenter();
    });

    return userName;
  }
  async getUserDataLimit() {
    const userDataLimit = new Scenes.BaseScene("userDataLimit");

    userDataLimit.enter(async (ctx) => {
      await ctx.reply("Напиши количество доступного в месяц объёма трафика: ");
    });

    userDataLimit.on("text", async (ctx) => {
      if (Number(ctx.message.text) >= 0) {
        ctx.session.myData.userDataLimit = ctx.message.text;
        await ctx.scene.enter("valid");
      } else {
        await ctx.reply("Введи число, пожалуйста");
        await ctx.scene.reenter();
      }
    });
    userDataLimit.on("message", async (ctx) => {
      await ctx.reply("Введи текст, пожалуйста");
      await ctx.scene.reenter();
    });

    return userDataLimit;
  }

  async valid() {
    const valid = new Scenes.BaseScene("valid");

    valid.enter(async (ctx) => {
      await ctx.reply(
        "Эти данные верны? (д\\н или y\\n): " +
          "\n" +
          "1) userName - " +
          ctx.session.myData.userName +
          "\n" +
          // "2) userId - " +
          // ctx.session.myData.userId +
          // "\n" +
          "3) userDataLimit: " +
          ctx.session.myData.userDataLimit
      );
    });

    valid.on("text", async (ctx) => {
      let userAnswer = ctx.message.text.toLowerCase();
      if (userAnswer === "д" || userAnswer === "y") {
        const { data } = await VPN.createNewKey()
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
            await VPN.renameKey(res.data.id, ctx.session.myData.userName)
              .then(() =>
                console.log(
                  "Key with id=" +
                    res.data.id +
                    " rename to " +
                    ctx.session.myData.userName +
                    " successfully"
                )
              )
              .catch((err) =>
                console.log(
                  "Can't rename key with id=" + res.data.id + "\n" + err
                )
              );
            await VPN.changeDataLimit(
              res.data.id,
              ctx.session.myData.userDataLimit
            )
              .then(() =>
                console.log(
                  "Key with id=" +
                    res.data.id +
                    " resize to " +
                    ctx.session.myData.userDataLimit +
                    "GB successfully"
                )
              )
              .catch((err) =>
                console.log(
                  "Can't rename key with id=" + res.data.id + "\n" + err
                )
              );
            return res;
          })
          .catch(async (err) => {
            await ctx.reply("Что-то пошло не так...\n" + err);
          });
        await ctx.scene.leave();
      } else if (userAnswer === "н" || userAnswer === "n") {
        await ctx.reply("Миша, давай по новой, всё ...");
        await ctx.scene.enter("userId");
      } else {
        await ctx.scene.reenter();
      }
    });

    valid.on("message", async (ctx) => {
      await ctx.scene.reenter();
    });

    return valid;
  }
}

export const newKeyGenScene = new newKeyScenesGenerator();
