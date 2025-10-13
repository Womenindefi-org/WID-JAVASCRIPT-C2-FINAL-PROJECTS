require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🧩 Store users who start the bot
const users = new Set();

// 🌞 Array of motivational quotes
const motivationalQuotes = [
  "Believe you can and you’re halfway there. 💪",
  "Every day is a new chance to grow. 🌱",
  "Small progress is still progress. Keep going!",
  "Discipline beats motivation every time. ⚡",
  "Push yourself — no one else will do it for you.",
  "You don’t need to be perfect, just consistent.",
  "Dream big, start small, act now. 🚀",
  "You’re building the person you’ll be proud of.",
  "Success is built on small daily actions.",
  "The secret of getting ahead is getting started. 🔥"
];

//Reminders
const reminders = [
  "Don’t forget to review your training notes today",
  "Check your task list for today.",
  "Are you keeping up with your learning goals?",
  "Don’t forget to push your code to GitHub today",
]
// Evening check-in questions
const checkInQuestions = [
  "What did you learn today?",
  "What’s one thing you accomplished today that made you proud?",
  "What challenged you the most today?",
  "If you could redo today, what would you do differently?",
  "What was the highlight of your day?",
  "Did you stay consistent with your goals today?",
  "What’s one thing you’re grateful for today?",
  "What skill did you practice or improve today?",
  "What new thing did you try or discover today?",
  "What’s one thing you’ll focus on tomorrow?"
];

//  Track the current position for each type
let quoteIndex = 0;
let reminderIndex = 0;
let questionIndex = 0;

// 👋 When user starts the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);

  bot.sendMessage(chatId, "👋 Welcome to the WID_TRAINA BOT\n\nYou’ll start getting daily motivation and evening reflection prompts to keep you consistent!");
});

// 🕗 Morning Motivation (8 AM)
cron.schedule('0 8 * * *', () => {
  const quote = motivationalQuotes[quoteIndex];

  users.forEach(chatId => {
    bot.sendMessage(chatId, `🌞 Good morning!\n\n${quote}`);
  });

  // Move to next quote, loop back if at end
  quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;

}, { timezone: "Africa/Lagos" });

// Afternoon Reminder (2 PM)
cron.schedule('0 14 * * *', () => {
  const reminder = reminders[reminderIndex];

  users.forEach(chatId => {
    bot.sendMessage(chatId, ` Reminder:\n\n${reminder}`);
  });

  reminderIndex = (reminderIndex + 1) % reminders.length;
}, { timezone: "Africa/Lagos" });

// Evening Check-in (8 PM)
cron.schedule('0 20 * * *', () => {
  const question = checkInQuestions[questionIndex];

  users.forEach(chatId => {
    bot.sendMessage(chatId, ` Evening check-in:\n\n${question}`);
  });

  // Move to next question, loop back if at end
  questionIndex = (questionIndex + 1) % checkInQuestions.length;

}, { timezone: "Africa/Lagos" });

console.log("✅ WID_TRAINA BOT is running...");