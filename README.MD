# Tgpeetees.js - Telegram GPT Framework

## Overview

**Tgpeetees.js** is a framework for creating GPT-based chatbots in Telegram using Telegraf.js and OpenAI's GPT models. This framework simplifies the process of integrating OpenAI's language models into Telegram bots, providing a structure for managing chat sessions and interactions.

## Features

- Easy setup with Telegraf.js.
- Integration with OpenAI's GPT models.
- Session management for user interactions.
- Customizable bot commands and actions.

## Installation

1. Install the dependencies using npm:
   ```bash
   npm install tgpeetees
   ```

## Usage

### Example

```javascript
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

      const response = await tgpeetees.sendToChatGpt(userId, msg, {
        temperature: 0.5,
        max_tokens: 1000, 
      });

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
```

## Documentation

### Class: Tgpeetees

#### Constructor

```typescript
constructor(params: {
  botToken: string,
  openaiApiKey?: string,
  model?: string,
  callback: any
})
```

- `botToken`: The Telegram bot token.
- `openaiApiKey`: (Optional) OpenAI API key for GPT integration.
- `model`: (Optional) GPT model to use.
- `callback`: Callback function for bot start.

#### Methods

- `init()`: Initializes the bot and enables graceful stop.
- `addHelp(msg: string, keyboard?: any)`: Adds a help command with a specified message and optional keyboard.
- `addBotAction(action: { name: string, callback: any })`: Adds a bot action with a specified name and callback.
- `addBotCommand(command: { name: string, callback: any })`: Adds a bot command with a specified name and callback.
- `addChatGpt(token: string)`: Initializes OpenAI with the provided API key.
- `startGptSession(userId: string, systemMsg: string)`: Starts a GPT session for a user with an initial system message.
- `sendToChatGpt(userId: string, msg: string, queryParams: any)`: Sends a message to GPT and returns the response.
- `closeGptSession(userId: string)`: Closes the GPT session for a user.
- `getUserId(ctx: any)`: Retrieves the user ID from the context.

### Environment Variables

- `BOT_TOKEN`: Your Telegram bot token.
- `OPENAI_API_KEY`: Your OpenAI API key.

## Contributing

Feel free to submit issues, fork the repository and send pull requests!

## License

MIT License. See `LICENSE` file for details.

---

This documentation provides an overview of the Tgpeetees.js framework, along with example usage and detailed method descriptions. For more detailed information, refer to the source code and comments within the implementation files.