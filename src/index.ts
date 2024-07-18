import { Telegraf, Context } from "telegraf";
import OpenAI from "openai";

export class Tgpeetees {
    bot: Telegraf<Context>;
    openai: any;
    botToken: string;
    openaiApiKey: string;
    model: string;
    constructor(params: {
        botToken: string,
        openaiApiKey?: string,
        model?: string,
    }) {
        const { botToken, openaiApiKey, model } = params;

        this.bot = new Telegraf(botToken);

        if (model) {
            this.model = model
        }

        if (openaiApiKey) {
            this.addChatGpt(params.openaiApiKey)
        }
    }

    public async init() {
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

    public async botTyping(ctx: any) {
        await ctx.telegram.sendChatAction(ctx.chat.id, "typing");
    }

    public getUserId(ctx: any) {
        return ctx?.update?.callback_query
            ? ctx.update.callback_query.from.id
            : ctx.message.from.id
    }

    public async sendToGpt(messages: any[], params?: any) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages,
            ...params,
        })

        return response.choices[0].message
    }

    private async addChatGpt(token: string) {
        this.openai = new OpenAI({
            apiKey: token
        });
    }
}
