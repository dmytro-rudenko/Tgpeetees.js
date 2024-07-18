"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tgpeetees = void 0;
const telegraf_1 = require("telegraf");
const openai_1 = __importDefault(require("openai"));
const path_1 = __importDefault(require("path"));
const fs_json_store_1 = require("fs-json-store");
class Tgpeetees {
    constructor(params) {
        this.chatHistory = {};
        this.isSessionStart = {};
        this.dbName = "db.json";
        this.DEFAULT_CHAT_GPT_CONFIG = {
            model: "gpt-3.5-turbo-1106",
            temperature: 0.75,
            max_tokens: 745,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };
        this.bot = new telegraf_1.Telegraf(params.botToken);
        if (params.model) {
            this.model = params.model;
        }
        if (params.openaiApiKey) {
            this.addChatGpt(params.openaiApiKey);
        }
        if (params.databaseName) {
            this.dbName = params.databaseName;
        }
        this.db = new fs_json_store_1.Store({
            file: path_1.default.join(process.cwd(), this.dbName)
        });
        this.bot.start(params.callback);
    }
    async init() {
        // Enable graceful stop
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
        const store = await this.db.read();
        if (!(store === null || store === void 0 ? void 0 : store.isSessionStart) && !(store === null || store === void 0 ? void 0 : store.chatHistory)) {
            await this.db.write({
                chatHistory: {},
                isSessionStart: {}
            });
        }
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
        if (!this.openai) {
            throw new Error("OpenAI API key not set");
        }
        const store = await this.db.read();
        if (!((_a = store.chatHistory) === null || _a === void 0 ? void 0 : _a[userId])) {
            store.chatHistory[userId] = [];
        }
        store.chatHistory[userId].push({
            role: "system",
            content: systemMsg
        });
        store.isSessionStart[userId] = true;
        await this.db.write(store);
    }
    async sendToChatGpt(userId, msg, queryParams = {}) {
        const store = await this.db.read();
        if (!store.isSessionStart[userId] && !store.chatHistory[userId].length) {
            return false;
        }
        store.chatHistory[userId].push({
            role: "user",
            content: msg
        });
        const params = Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CHAT_GPT_CONFIG), queryParams), { messages: store.chatHistory[userId] });
        if (this.model) {
            params.model = this.model;
        }
        const response = await this.openai.chat.completions.create(params);
        store.chatHistory[userId].push(response.choices[0].message);
        await this.db.write(store);
        return response;
    }
    async closeGptSession(userId) {
        const store = await this.db.read();
        store.chatHistory[userId] = [];
        store.isSessionStart[userId] = false;
        await this.db.write(store);
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
