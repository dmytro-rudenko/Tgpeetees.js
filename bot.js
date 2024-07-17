const { Tgpeetees } = require("tgpeetees");
const { Markup } = require("telegraf");
const dotenv = require("dotenv");

dotenv.config();

const main = async () => {
  const startCallback = async (ctx) => {
    const params = {
      start: {
        msg: "Hello",
        keyboard: [
          [
            {
              text: "Start Chat Session",
              callback_data: "START_CHAT_SESSION",
            },
            { text: "End Chat Session", callback_data: "END_CHAT_SESSION" },
          ],
          [{ text: "Help", callback_data: "HELP" }],
        ],
      },
    };
    const userId = tgpeetees.getUserId(ctx);

    tgpeetees.bot.on("message", async (ctx) => {
      if (
        !tgpeetees.isSessionStart[userId] ||
        !tgpeetees.chatHistory?.[userId]?.length
      ) {
        ctx.reply(
          "Session don't started. Call Start chat session before sendToChatGpt"
        );

        return;
      }
      const msg = ctx.message.text;

      const response = await tgpeetees.sendToChatGpt(userId, msg);

      if (!response) {
        ctx.reply(
          "Session don't started. Call Start chat session before sendToChatGpt"
        );
        return;
      }

      ctx.reply(response.choices[0].message.content);
    });

    ctx.reply(params.start.msg, Markup.inlineKeyboard(params.start?.keyboard));
  };

  const tgpeetees = new Tgpeetees({
    botToken: process.env.BOT_TOKEN,
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo-1106",
    callback: startCallback,
  });

  tgpeetees.addBotAction({
    name: "START_CHAT_SESSION",
    callback: (ctx) => {
      const userId = tgpeetees.getUserId(ctx);

      tgpeetees.startGptSession(
        userId,
        "Imagine that you're a person who answers everything with poetry. Respond in the language in which the message arrives."
      );

      ctx.reply("Session starts");
    },
  });

  tgpeetees.addBotAction({
    name: "END_CHAT_SESSION",
    callback: (ctx) => {
      const userId = tgpeetees.getUserId(ctx);

      tgpeetees.closeGptSession(userId);

      ctx.reply("Session end");
    },
  });

  const HELP_REPLY = `Info: 
For start working bot call /start
If bot don't work call /restart
Hello, for help call /help`;

  tgpeetees.addHelp(HELP_REPLY);

  tgpeetees.addBotAction({
    name: "HELP",
    callback: (ctx) => {
      ctx.reply(HELP_REPLY);
    },
  });

  tgpeetees.addBotCommand({
    name: "restart",
    callback: startCallback,
  });

  tgpeetees.init();
};

main();
