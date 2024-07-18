import { Telegraf, Context } from "telegraf";
import OpenAI from "openai";
import path from "path";
import { Store } from "fs-json-store";

export class Tgpeetees {
    bot: any
    openai: any
    model: string
    chatGptConfig: any
    chatHistory: any = {}
    isSessionStart: any = {}
    dbName: string = "db.json"
    db: any

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
        openaiApiKey?: string
        model?: string
        databaseName?: string
        callback: any
    }) {
        this.bot = new Telegraf(params.botToken);

        if (params.model) {
            this.model = params.model
        }

        if (params.openaiApiKey) {
            this.addChatGpt(params.openaiApiKey)
        }

        if (params.databaseName) {
            this.dbName = params.databaseName
        }


        this.db = new Store({
            file: path.join(process.cwd(), this.dbName)
        });

        this.bot.start(params.callback);
    }

    public async init() {
        // Enable graceful stop
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

        const store = await this.db.read()

        if (!store?.isSessionStart && !store?.chatHistory) {
            await this.db.write({
                chatHistory: {},
                isSessionStart: {}
            });
        }

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
        if (!this.openai) {
            throw new Error("OpenAI API key not set");
        }

        this.closeGptSession(userId)

        const store = await this.db.read()

        if (!store.chatHistory?.[userId]) {
            store.chatHistory[userId] = []
        }

        store.chatHistory[userId].push({
            role: "system",
            content: systemMsg
        })

        store.isSessionStart[userId] = true

        await this.db.write(store)
    }

    public async sendToChatGpt(userId: string, msg: string, queryParams: any = {}) {
        const store = await this.db.read()

        if (!store.isSessionStart[userId] && !store.chatHistory[userId]?.length) {
            return false
        }

        store.chatHistory[userId].push({
            role: "user",
            content: msg
        })

        const params = {
            ...this.DEFAULT_CHAT_GPT_CONFIG,
            ...queryParams,
            messages: store.chatHistory[userId]
        }

        if (this.model) {
            params.model = this.model
        }

        const response = await this.openai.chat.completions.create(
            params
        );

        store.chatHistory[userId].push(response.choices[0].message);

        await this.db.write(store)

        return response
    }

    public async closeGptSession(userId: string) {
        const store = await this.db.read()

        delete store.chatHistory[userId]
        delete store.isSessionStart[userId]

        await this.db.write(store)
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