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
const { Markup } = require("telegraf"); // Import the Markup class from telegraf for creating custom keyboards
const dotenv = require("dotenv"); // Import dotenv for loading environment variables from a .env file

dotenv.config(); // Load environment variables from the .env file

const main = async () => {
  // Main function to run the bot
  const tgpeetees = new Tgpeetees({
    botToken: process.env.BOT_TOKEN, // Get the bot token from the environment variables
    openaiApiKey: process.env.OPENAI_API_KEY, // Get the OpenAI API key from the environment variables
    model: "gpt-3.5-turbo-1106", // Set the OpenAI model to use
    callback: startCallback, // Set the startCallback function to be called on bot start
  });

  // Add an action to start a chat session
  tgpeetees.addBotAction({
    name: "START_CHAT_SESSION",
    callback: (ctx) => {
      const userId = tgpeetees.getUserId(ctx); // Get the user ID from the context

      // Start a GPT session for the user, setting the bot to respond in poetry
      tgpeetees.startGptSession(
        userId,
        "Imagine that you're a person who answers everything with poetry. Respond in the language in which the message arrives."
      );

      ctx.reply("Session starts"); // Reply to the user that the session has started
    },
  });

  // Add an action to end a chat session
  tgpeetees.addBotAction({
    name: "END_CHAT_SESSION",
    callback: (ctx) => {
      const userId = tgpeetees.getUserId(ctx); // Get the user ID from the context

      tgpeetees.closeGptSession(userId); // Close the GPT session for the user

      ctx.reply("Session end"); // Reply to the user that the session has ended
    },
  });

  const HELP_REPLY = `Info: 
For start working bot call /start
If bot don't work call /restart
Hello, for help call /help`; // Help message to be sent to the user

  tgpeetees.addHelp(HELP_REPLY); // Add the help message to the bot

  // Add an action to provide help
  tgpeetees.addBotAction({
    name: "HELP",
    callback: (ctx) => {
      ctx.reply(HELP_REPLY); // Reply with the help message
    },
  });

  // Add a command to restart the bot
  tgpeetees.addBotCommand({
    name: "restart",
    callback: startCallback, // Restart the bot using the startCallback function
  });

  tgpeetees.init(); // Initialize the bot

  function startCallback(ctx) {
    // Callback function to be called when the bot starts
    const params = {
      start: {
        msg: "Hello", // Start message
        keyboard: [
          [
            {
              text: "Start Chat Session",
              callback_data: "START_CHAT_SESSION", // Callback data for starting a chat session
            },
            {
              text: "End Chat Session",
              callback_data: "END_CHAT_SESSION", // Callback data for ending a chat session
            },
          ],
          [{ text: "Help", callback_data: "HELP" }], // Callback data for help
        ],
      },
    };
    const userId = tgpeetees.getUserId(ctx); // Get the user ID from the context

    // Handle incoming messages
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
      const msg = ctx.message.text; // Get the message text from the context

      const response = await tgpeetees.sendToChatGpt(userId, msg, {
        temperature: 0.5,
        max_tokens: 1000,
      }); // Send the message to ChatGPT and get the response

      if (!response) {
        ctx.reply(
          "Session don't started. Call Start chat session before sendToChatGpt"
        );
        return;
      }

      ctx.reply(response.choices[0].message.content); // Reply with the ChatGPT response
    });

    ctx.reply(params.start.msg, Markup.inlineKeyboard(params.start?.keyboard)); // Send the start message with an inline keyboard
  }
};

main(); // Call the main function to start the bot
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