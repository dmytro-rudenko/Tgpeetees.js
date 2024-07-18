<<<<<<< HEAD
export declare class Tgpeetees {
    bot: any;
    openai: any;
    model: string;
    chatGptConfig: any;
    chatHistory: any;
    isSessionStart: any;
    dbName: string;
    db: any;
    DEFAULT_CHAT_GPT_CONFIG: any;
=======
import { Telegraf, Context } from "telegraf";
export declare class Tgpeetees {
    bot: Telegraf<Context>;
    openai: any;
    botToken: string;
    openaiApiKey: string;
    model: string;
>>>>>>> fccaf26 (is-working)
    constructor(params: {
        botToken: string;
        openaiApiKey?: string;
        model?: string;
<<<<<<< HEAD
        databaseName?: string;
        callback: any;
    });
    init(): Promise<any>;
=======
    });
    init(): Promise<void>;
>>>>>>> fccaf26 (is-working)
    addHelp(msg: string, keyboard?: any): Promise<void>;
    addBotAction(action: {
        name: string;
        callback: any;
    }): void;
    addBotCommand(command: {
        name: string;
        callback: any;
    }): void;
<<<<<<< HEAD
    startGptSession(userId: string, systemMsg: string): Promise<void>;
    sendToChatGpt(userId: string, msg: string, queryParams?: any): Promise<any>;
    closeGptSession(userId: string): Promise<void>;
    getUserId(ctx: any): any;
=======
    botTyping(ctx: any): Promise<void>;
    getUserId(ctx: any): any;
    sendToGpt(messages: any[], params: any): Promise<any>;
>>>>>>> fccaf26 (is-working)
    private addChatGpt;
}
