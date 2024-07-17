"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tgpeetees = void 0;
const telegraf_1 = require("telegraf");
const openai_1 = __importDefault(require("openai"));
class Tgpeetees {
    constructor(params) {
        this.chatHistory = {};
        this.isSessionStart = {};
        this.DEFAULT_CHAT_GPT_CONFIG = {
            model: "gpt-3.5-turbo-1106",
            temperature: 0.75,
            max_tokens: 745,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };
        this.bot = new telegraf_1.Telegraf(params.botToken);
        this.addChatGpt(params.openaiApiKey);
        if (params.model) {
            this.model = params.model;
        }
        this.bot.start(params.callback);
    }
    init() {
        // Enable graceful stop
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
        console.log("Bot started");
        return this.bot.launch();
    }
    async addHelp(msg, keyboard) {
        this.bot.help((ctx) => {
            ctx.reply(msg, keyboard);
        });
    }
    addBotAction(action) {
        this.bot.action(action.name, action.callback);
    }
    addBotCommand(command) {
        this.bot.command(command.name, command.callback);
    }
    async startGptSession(userId, systemMsg) {
        var _a;
        if (!((_a = this.chatHistory) === null || _a === void 0 ? void 0 : _a[userId])) {
            this.chatHistory[userId] = [];
        }
        this.chatHistory[userId].push({
            role: "system",
            content: systemMsg
        });
        this.isSessionStart[userId] = true;
    }
    async sendToChatGpt(userId, msg, queryParams = {}) {
        if (this.chatHistory.length === 0) {
            return false;
        }
        this.chatHistory[userId].push({
            role: "user",
            content: msg
        });
        const params = Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CHAT_GPT_CONFIG), queryParams), { messages: this.chatHistory[userId] });
        if (this.model) {
            params.model = this.model;
        }
        const response = await this.openai.chat.completions.create(params);
        // console.log("chatgpt answer:", response.choices[0].message)
        this.chatHistory[userId].push(response.choices[0].message);
        return response;
    }
    closeGptSession(userId) {
        this.chatHistory = [];
        this.isSessionStart[userId] = false;
    }
    getUserId(ctx) {
        var _a;
        return ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query)
            ? ctx.update.callback_query.from.id
            : ctx.message.from.id;
    }
    async addChatGpt(token) {
        this.openai = new openai_1.default({
            apiKey: token
        });
    }
}
exports.Tgpeetees = Tgpeetees;
