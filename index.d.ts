export declare class Tgpeetees {
    bot: any;
    openai: any;
    chatGptConfig: any;
    chatHistory: any;
    isSessionStart: any;
    DEFAULT_CHAT_GPT_CONFIG: any;
    constructor(params: {
        token: string;
        callback: any;
    });
    init(): any;
    addHelp(msg: string, keyboard?: any): Promise<void>;
    addBotAction(action: {
        name: string;
        callback: any;
    }): void;
    addBotCommand(command: {
        name: string;
        callback: any;
    }): void;
    addChatGpt(token: string): Promise<void>;
    startGptSession(userId: string, systemMsg: string): Promise<void>;
    sendToChatGpt(userId: string, msg: string, queryParams?: any): Promise<any>;
    closeGptSession(userId: string): void;
    getUserId(ctx: any): any;
}
