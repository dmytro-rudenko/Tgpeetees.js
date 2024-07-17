import { Telegraf, Context, Markup } from "telegraf";
import OpenAI from "openai";

export class Tgpeetees {
    bot: any
    openai: any
    model: string
    chatGptConfig: any
    chatHistory: any = {}
    isSessionStart: any = {}

    DEFAULT_CHAT_GPT_CONFIG: any = {
        model: "gpt-3.5-turbo-1106",
        temperature: 0.75,
        max_tokens: 745,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }
    constructor(params: {
        botToken: string,
        openaiApiKey: string
        model?: string
        callback: any
    }) {
        this.bot = new Telegraf(params.botToken);

        this.addChatGpt(params.openaiApiKey);

        if (params.model) {
            this.model = params.model
        }

        this.bot.start(params.callback);
    }

    public init() {
        // Enable graceful stop
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

        console.log("Bot started")

        return this.bot.launch();
    }

    public async addHelp(msg: string, keyboard?: any) {
        this.bot.help((ctx: Context) => {
            ctx.reply(msg, keyboard);
        });
    }

    public addBotAction(action: {
        name: string
        callback: any
    }) {
        this.bot.action(action.name, action.callback)
    }

    public addBotCommand(command: {
        name: string
        callback: any
    }) {
        this.bot.command(command.name, command.callback)
    }

    public async startGptSession(userId: string, systemMsg: string) {
        if (!this.chatHistory?.[userId]) {
            this.chatHistory[userId] = []
        }

        this.chatHistory[userId].push({
            role: "system",
            content: systemMsg
        })

        this.isSessionStart[userId] = true


    }

    public async sendToChatGpt(userId: string, msg: string, queryParams: any = {}) {
        if (this.chatHistory.length === 0) {
            return false
        }

        this.chatHistory[userId].push({
            role: "user",
            content: msg
        })

        const params = {
            ...this.DEFAULT_CHAT_GPT_CONFIG,
            ...queryParams,
            messages: this.chatHistory[userId]
        }

        if (this.model) {
            params.model = this.model
        }

        const response = await this.openai.chat.completions.create(
            params
        );
        // console.log("chatgpt answer:", response.choices[0].message)

        this.chatHistory[userId].push(response.choices[0].message);

        return response
    }

    public closeGptSession(userId: string) {
        this.chatHistory = []
        this.isSessionStart[userId] = false
    }

    public getUserId(ctx: any) {
        return ctx?.update?.callback_query
            ? ctx.update.callback_query.from.id
            : ctx.message.from.id
    }

    private async addChatGpt(token: string) {
        this.openai = new OpenAI({
            apiKey: token
        });
    }
}