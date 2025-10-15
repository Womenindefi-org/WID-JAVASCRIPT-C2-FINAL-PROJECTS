require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment-timezone');
const cron = require('node-cron');
const Database = require('./src/database');
const ContentManager = require('./src/contentManager');
const UserManager = require('./src/userManager');
const Scheduler = require('./src/scheduler');
const MessageHandler = require('./src/messageHandler');

// --- Load Token ---
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN not found in .env file");
  process.exit(1);
}

// --- Initialize Bot ---
const bot = new TelegramBot(token, { polling: true });
console.log("🤖 Bot polling started...");

// --- Initialize Core Modules ---
const db = new Database(process.env.DATABASE_PATH);
const contentManager = new ContentManager(db);
const userManager = new UserManager(db);
const scheduler = new Scheduler(bot, contentManager, userManager);
const messageHandler = new MessageHandler(bot, userManager, contentManager);

// --- Command Handlers ---
bot.onText(/\/start/, (msg) => messageHandler.handleStart(msg));
bot.onText(/\/help/, (msg) => messageHandler.handleHelp(msg));
bot.onText(/\/profile/, (msg) => messageHandler.handleProfile(msg));
bot.onText(/\/today/, (msg) => messageHandler.handleToday(msg));

// Quote / Task / Assignment
bot.onText(/\/quote/, (msg) => {
  const quote = contentManager.getRandomQuote();
  bot.sendMessage(msg.chat.id, `💬 ${quote}`);
});

bot.onText(/\/task/, (msg) => {
  const task = contentManager.getRandomTask();
  bot.sendMessage(msg.chat.id, `📝 ${task}`);
});

bot.onText(/\/assignment/, (msg) => {
  const assignment = contentManager.getRandomAssignment();
  bot.sendMessage(msg.chat.id, `📚 ${assignment}`);
});

// --- Message Logs ---
bot.on('message', (msg) => {
  console.log(`💡 Message from ${msg.chat.first_name} (chat_id: ${msg.chat.id})`);
  if (!msg.text.startsWith('/')) {
    messageHandler.handleTextMessage(msg);
  }
});

// --- Inline Button Callback ---
bot.on('callback_query', (query) => messageHandler.handleCallbackQuery(query));

// --- Daily Scheduler ---
scheduler.startDailyTasks();

console.log("✅ Training Engagement Bot is running...");
