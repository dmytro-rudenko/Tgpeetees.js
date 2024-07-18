const { Tgpeetees } = require("./index");
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv"); // Import dotenv for loading environment variables from a .env file

dotenv.config();

const main = async () => {
  console.log("main init");
  const tgpeetees = new Tgpeetees({
    botToken: process.env.BOT_TOKEN,
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o",
  });

  const startCallback = (ctx) => {
    ctx.reply(
      "Привіт. Цей бот допоможе тобі текст з будь-якого зображення перекласти на українську. Надійшли посилання на зображення та отримай переклад тексту з нього."
    );
  };

  tgpeetees.bot.start(startCallback);

  tgpeetees.bot.on("message", async (ctx) => {
    tgpeetees.botTyping(ctx);
    const msg = ctx.message.text;
    // const userId = tgpeetees.getUserId(ctx);

    if (!msg) {
      console.log("no msg", ctx.message);

      if (ctx.message.forward_from_chat) {
        const message = ctx.message;
        const postUrl = `https://t.me/${message.forward_from_chat.username}/${message.forward_from_message_id}`;

        const res = await axios.get(postUrl);

        const $ = cheerio.load(res.data);
        const metaImage =
          $('meta[property="og:image"]').attr("content") ||
          $('meta[name="twitter:image"]').attr("content") ||
          $('link[rel="image_src"]').attr("href");

        const response = await tgpeetees.sendToGpt(
          getMessagesWithImage(metaImage)
        );

        return ctx.reply(response.content);
      }

      if (ctx.message?.photo?.length) {
        console.log("has photo");
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        const downloadLink = await tgpeetees.bot.telegram.getFileLink(fileId);

        // download image and transform to base64 url
        console.log("downloadLink", downloadLink);
        const respImage = await axios({
          url: downloadLink,
          method: "GET",
          responseType: "arraybuffer",
        });

        const data = respImage.data;
        const base64String = data.toString("base64");

        const mimeType = "image/jpeg"; // Assuming the file is a JPEG image
        const base64Url = `data:${mimeType};base64,${base64String}`;

        const response = await tgpeetees.sendToGpt(
          getMessagesWithImage(base64Url)
        );

        return ctx.reply(response.content);
      }
      return;
    }

    const isUrl = isURL(msg);

    if (!isUrl) {
      console.log("is translate text");

      const response = await tgpeetees.sendToGpt(getMessagesWithText(msg));

      ctx.reply(response.content);
    }

    const isImageUrlLink = await isImageURL(msg);

    if (isImageUrlLink) {
      console.log("is image url");

      const response = await tgpeetees.sendToGpt(getMessagesWithImage(msg));

      // console.log(response.content);

      ctx.reply(response.content);
      return;
    }

    if (!isImageUrlLink && isUrl) {
      console.log("is url");
      const previewImage = await getPreviewImage(msg);

      if (previewImage) {
        const response = await tgpeetees.sendToGpt(
          getMessagesWithImage(previewImage)
        );

        ctx.reply(response.content);
        return;
      }
    }
  });

  tgpeetees.init();
};

function isURL(string) {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[^\s]*)?$/;
  return regex.test(string);
}

const SYSTEM_PROMPT =
  "Ти профейсійний перекладач тексту на українську мову. Нормалізуй текст який отримаєшь та переклади його";

function getMessagesWithText(msg) {
  return [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: msg,
        },
      ],
    },
  ];
}

function getMessagesWithImage(msg) {
  return [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: msg,
          },
        },
      ],
    },
  ];
}

async function isImageURL(url) {
  try {
    const response = await axios.head(url);
    const contentType = response.headers["content-type"];
    return contentType.startsWith("image/");
  } catch (error) {
    return false;
  }
}

async function getPreviewImage(url) {
  try {
    // Проверка, является ли URL изображением
    const headResponse = await axios.head(url);
    const contentType = headResponse.headers["content-type"];

    if (contentType.startsWith("image/")) {
      return url;
    }

    // Если URL не является изображением, получаем HTML страницы
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Пытаемся найти изображение превью через мета-теги Open Graph или другие теги
    const metaImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('link[rel="image_src"]').attr("href");

    if (metaImage) {
      return metaImage;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching the URL:", error);
    return null;
  }
}

main();
