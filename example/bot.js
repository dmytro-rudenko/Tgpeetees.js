const { Tgpeetees } = require("../index"); // Import the Tgpeetees class from the local index file
const dotenv = require("dotenv"); // Import dotenv for loading environment variables from a .env file

dotenv.config(); // Load environment variables from the .env file

const main = async () => {
  // Main function to run the bot
  const tgpeetees = new Tgpeetees({
    botToken: process.env.BOT_TOKEN, // Get the bot token from the environment variables
    openaiApiKey: process.env.OPENAI_API_KEY, // Get the OpenAI API key from the environment variables
    model: "gpt-3.5-turbo-1106", // Set the OpenAI model to use
  });

  // Add an action to start a chat session
  tgpeetees.addBotAction({
    name: "START_CHAT_SESSION",
    callback: (ctx) => {
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
  }

  // Handle incoming messages
  tgpeetees.bot.on("message", async (ctx) => {
    ctx.reply("you send message");
  }); // Send the start message with an inline keyboard
};

main(); // Call the main function to start the bot
