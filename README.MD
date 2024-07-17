# Tgpeetees.js Framework Documentation

### Tgpeetees.js

Tgpeetees is a framework built on top of Telegraf.js, enabling seamless integration with OpenAI's models. This framework facilitates the creation of Telegram bots that can interact with users and leverage the capabilities of OpenAI's language model.

### Features

- Simple integration with Telegraf.js.
- Supports gpt models for natural language processing.
- Easy-to-use API for adding bot commands and actions.
- Session management for ChatGPT interactions.
- Customizable help messages and inline keyboards.

### Installation

To install Tgpeetees, use npm:

```sh
npm install tgpeetees
```

### Usage

Below is an example of how to use the Tgpeetees framework to create a Telegram bot:

```javascript
const { Tgpeetees } = require("./index.js");
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

  const HELP_REPLY = `
Info:
For start working bot call /start
If bot don't work call /restart
Hello, for help call /help
  `;

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
```

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```
BOT_TOKEN=your-telegram-bot-token
OPENAI_API_KEY=your-openai-api-key
```

### API

#### Constructor

```typescript
constructor(params: {
    botToken: string,
    openaiApiKey: string,
    model?: string,
    callback: any
})
```

- `botToken`: The token for your Telegram bot.
- `openaiApiKey`: The API key for OpenAI.
- `model`: The model to use for OpenAI (optional), by default used gpt-3.5-turbo-1106.
- `callback`: The callback function to execute when the bot starts.

#### Methods

##### `init()`

Initializes and launches the bot.

##### `addHelp(msg: string, keyboard?: any)`

Adds a help message and optional keyboard to the bot.

##### `addBotAction(action: { name: string, callback: any })`

Adds a bot action with a name and callback function.

##### `addBotCommand(command: { name: string, callback: any })`

Adds a bot command with a name and callback function.

##### `addChatGpt(token: string)`

Adds OpenAI API integration using the provided token.

##### `startGptSession(userId: string, systemMsg: string)`

Starts a ChatGPT session for the specified user.

##### `sendToChatGpt(userId: string, msg: string, queryParams: any = {})`

Sends a message to ChatGPT and returns the response.

##### `closeGptSession(userId: string)`

Closes the ChatGPT session for the specified user.

##### `getUserId(ctx: any)`

Retrieves the user ID from the context.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

### License

This project is licensed under the MIT License.