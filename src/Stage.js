import { session, Scenes } from "telegraf";
import { newKeyGenScene } from "./newKeyScenesGenerator.js";

export const Stage = new Scenes.Stage([
  // Сцены генерации нового ключа для админа
  // await newKeyGenScene.getUserId(),
  await newKeyGenScene.getUserName(),
  await newKeyGenScene.getUserDataLimit(),
  await newKeyGenScene.valid(),
]);
