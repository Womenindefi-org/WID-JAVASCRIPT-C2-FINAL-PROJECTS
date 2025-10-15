class MessageHandler {
    constructor(bot, userManager, contentManager) {
        this.bot = bot;
        this.userManager = userManager;
        this.contentManager = contentManager;
    }

    async handleStart(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, "👋 Welcome to the Training Engagement Bot! Type /help to see available commands.");
    }

    async handleHelp(msg) {
        const chatId = msg.chat.id;
        const helpText = `
Available commands:
/start - Start interacting with the bot
/help - Show this help message
/profile - View your profile
/today - View today's tasks
/quote - Get an inspirational quote
`;
        await this.bot.sendMessage(chatId, helpText);
    }

    async handleProfile(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, "📋 Your profile feature is under development!");
    }

    async handleToday(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, "🗓️ Today's training schedule will be available soon!");
    }

    async handleQuote(msg) {
        const chatId = msg.chat.id;
        const quote = this.contentManager.getRandomQuote?.() || "Keep going! You're doing great.";
        await this.bot.sendMessage(chatId, `💬 ${quote}`);
    }

    async handleTextMessage(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, "💡 Please use a command (e.g., /help) to interact with me.");
    }

    async handleCallbackQuery(query) {
        const chatId = query.message.chat.id;
        await this.bot.answerCallbackQuery(query.id, { text: "✅ Button clicked!" });
        await this.bot.sendMessage(chatId, "You clicked a button!");
    }
}

module.exports = MessageHandler;
