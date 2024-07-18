const { Tgpeetees } = require("./index.js"); // Import the Tgpeetees class from the local index file
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
      tgpeetees.closeGptSession(userId);

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

  // Handle incoming messages
  tgpeetees.bot.on("message", async (ctx) => {
    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const userId = tgpeetees.getUserId(ctx); // Get the user ID from the context
    const store = await tgpeetees.db.read();

    if (!store.isSessionStart[userId] || !store.chatHistory?.[userId]?.length) {
      ctx.reply(
        "Session don't started. Call Start chat session before sendToChatGpt",
        Markup.inlineKeyboard([
          {
            text: "Start Chat Session",
            callback_data: "START_CHAT_SESSION", // Callback data for starting a chat session
          },
        ])
        // Callback data for help
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
        "Session don't started. Call Start session",
        Markup.inlineKeyboard([
          {
            text: "Start Chat Session",
            callback_data: "START_CHAT_SESSION", // Callback data for starting a chat session
          },
        ])
      );
      return;
    }

    ctx.reply(
      response.choices[0].message.content,
      Markup.inlineKeyboard([
        {
          text: "End Chat Session",
          callback_data: "END_CHAT_SESSION", // Callback data for starting a chat session
        },
      ])
    ); // Reply with the ChatGPT response
  });

  await tgpeetees.init(); // Initialize the bot

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
    ctx.reply(params.start.msg, Markup.inlineKeyboard(params.start?.keyboard)); // Send the start message with an inline keyboard
  }
};

main(); // Call the main function to start the bot
