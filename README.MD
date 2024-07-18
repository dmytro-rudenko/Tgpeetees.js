# Tgpeetees.js

Tgpeetees.js is a framework based on [Telegraf.js](https://telegraf.js.org/) designed for creating GPTs in Telegram. It leverages the capabilities of the OpenAI GPT models to enable advanced conversational bots within the Telegram platform.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [Constructor](#constructor)
  - [init](#init)
  - [addHelp](#addhelp)
  - [addBotAction](#addbotaction)
  - [addBotCommand](#addbotcommand)
  - [botTyping](#bottyping)
  - [getUserId](#getuserid)
  - [sendToGpt](#sendtogpt)
  - [addChatGpt](#addchatgpt)

## Installation

To install Tgpeetees.js, use npm:

```bash
npm install telegraf openai tgpeetees
```

## Usage

Here is a basic example of how to use Tgpeetees.js:

```javascript
import { Tgpeetees } from 'tgpeetees';

const bot = new Tgpeetees({
  botToken: 'YOUR_TELEGRAM_BOT_TOKEN',
  openaiApiKey: 'YOUR_OPENAI_API_KEY',
  model: 'gpt-4'
});

bot.addHelp('This is a help message');

bot.addBotCommand({
  name: 'start',
  callback: (ctx) => ctx.reply('Hello, I am your GPT bot!')
});

bot.init();
```

## API Documentation

### Constructor

```typescript
constructor(params: {
  botToken: string,
  openaiApiKey?: string,
  model?: string,
})
```

- **botToken**: *string* - Your Telegram bot token.
- **openaiApiKey**: *string (optional)* - Your OpenAI API key.
- **model**: *string (optional)* - The OpenAI model to use (default is `gpt-4`).

### init

```typescript
public async init()
```

Initializes and starts the bot. It also sets up graceful stop handlers.

### addHelp

```typescript
public async addHelp(msg: string, keyboard?: any)
```

Adds a help message that is shown when the `/help` command is used.

- **msg**: *string* - The help message to display.
- **keyboard**: *any (optional)* - Custom keyboard layout.

### addBotAction

```typescript
public addBotAction(action: {
  name: string,
  callback: any,
})
```

Adds a custom action for the bot.

- **name**: *string* - The name of the action.
- **callback**: *any* - The callback function to execute when the action is triggered.

### addBotCommand

```typescript
public addBotCommand(command: {
  name: string,
  callback: any,
})
```

Adds a custom command for the bot.

- **name**: *string* - The name of the command.
- **callback**: *any* - The callback function to execute when the command is used.

### botTyping

```typescript
public async botTyping(ctx: any)
```

Sends a "typing" action to the chat to indicate the bot is processing.

- **ctx**: *any* - The context object from Telegraf.

### getUserId

```typescript
public getUserId(ctx: any)
```

Gets the user ID from the context.

- **ctx**: *any* - The context object from Telegraf.

### sendToGpt

```typescript
public async sendToGpt(messages: any[], params?: any)
```

Sends messages to the GPT model and returns the response.

- **messages**: *any[]* - The array of messages to send to the GPT model.
- **params**: *any (optional)* - Additional parameters for the GPT model.

### addChatGpt

```typescript
private async addChatGpt(token: string)
```

Sets up the OpenAI integration.

- **token**: *string* - Your OpenAI API key.

## Example

Here is a more detailed example showing how to create a GPT-enabled Telegram bot:

```javascript
import { Tgpeetees } from 'tgpeetees';

const bot = new Tgpeetees({
  botToken: 'YOUR_TELEGRAM_BOT_TOKEN',
  openaiApiKey: 'YOUR_OPENAI_API_KEY',
  model: 'gpt-4'
});

bot.addHelp('This bot can chat with you using OpenAI GPT-4.');

bot.addBotCommand({
  name: 'start',
  callback: async (ctx) => {
    await bot.botTyping(ctx);
    ctx.reply('Hello, I am your GPT bot!');
  }
});


bot.init();
```