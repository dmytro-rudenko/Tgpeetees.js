const { Telegraf, Markup } = require("telegraf");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Translations = require("./translate");

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const LIMIT = 5;
let lang = "EN";
let Language = Translations[lang];

const main = async () => {
  const bot = new Telegraf(BOT_TOKEN);
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  // Обработка команды /start
  bot.start((ctx) => {
    ctx.reply(
      Language.hi + "\n\n" + Language.help,
      Markup.inlineKeyboard([Markup.button.callback(Language.share, "CONFESS")])
    );
  });

  // Обработка команды /help
  bot.help((ctx) => {
    ctx.reply(Language.help);
  });

  const LanguageKeyboard = [
    {
      text: "EN 🇺🇸",
      callback_data: "EN",
    },
    {
      text: "UA 🇺🇦",
      callback_data: "UA",
    },
  ];

  bot.action(
    LanguageKeyboard.map((key) => key.callback_data),
    (ctx) => {
      lang = ctx.match[0]; // get the selected language code
      Language = Translations[lang]; // update the language
      ctx.reply(Translations.selectedLanguage(lang));
    }
  );

  // Обработка команды /Language
  bot.command("language", (ctx) => {
    const keyboard = [
      Markup.button.callback("EN 🇺🇸", "EN"),
      Markup.button.callback("UA 🇺🇦", "UA"),
    ];

    // Select Language from keyboard
    ctx.reply(Language.selectLanguage, Markup.inlineKeyboard(keyboard));
  });
  const share = async (ctx) => {
    const userId = ctx?.update?.callback_query
      ? ctx.update.callback_query.from.id
      : ctx.message.from.id;
    let soul = await Soul.findOne({ userId });

    if (soul) {
      soul.limit++;
      soul.state = true;
      soul.usedAt = new Date();
      await soul.save();
    } else {
      soul = new Soul({
        userId,
        state: true,
        limit: 0,
        usedAt: new Date(),
      });
      await soul.save();
    }

    if (soul?.limit > LIMIT) {
      ctx.reply(Language.limit);

      soul.state = false;
      await soul.save();

      return;
    }

    ctx.reply(Language.youCanShare);
  };
  // Обработка нажатия на кнопку "Исповедаться"
  bot.action("CONFESS", share);
  bot.command("share", share);

  // Обработка текстовых сообщений
  bot.on("text", async (ctx) => {
    const userId = ctx.message.from.id;
    let soul = await Soul.findOne({ userId });

    if (!soul.state) {
      ctx.reply(
        Language.sorry,
        Markup.inlineKeyboard([
          Markup.button.callback(Language.share, "CONFESS"),
        ])
      );
      return;
    }

    const userMessage = ctx.message.text;

    // send message with please wait
    bot.telegram.sendMessage(ctx.message.from.id, Language.pleaseWait);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: Language.prompt,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage,
            },
          ],
        },
      ],
      temperature: 0.75,
      max_tokens: 745,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseText = response.choices[0].message.content;

    soul.state = false;
    await soul.save();

    ctx.reply(
      responseText,
      Markup.inlineKeyboard([
        Markup.button.callback(
          `${Language.shareMore}${
            soul.limit > 0 && soul.limit < LIMIT
              ? " (" + (LIMIT - soul.limit) + ")"
              : ""
          }`,
          "CONFESS"
        ),
      ])
    );
  });

  // Запуск бота
  bot.launch();

};

main();
