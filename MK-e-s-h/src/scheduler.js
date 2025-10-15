const cron = require('node-cron');
const moment = require('moment-timezone');

class Scheduler {
    constructor(bot, contentManager, userManager) {
        this.bot = bot;
        this.contentManager = contentManager;
        this.userManager = userManager;
        this.jobs = [];
    }

    startDailyTasks() {
        console.log("📅 Scheduler started");

        // Example daily task
        cron.schedule('0 9 * * *', () => {
            console.log("⏰ Sending daily quote...");
            this.sendDailyQuote();
        }, {
            timezone: process.env.TIMEZONE || "America/New_York"
        });
    }

    sendDailyQuote() {
        const quote = this.contentManager.getRandomQuote?.() || "Keep pushing forward!";
        const users = this.userManager.listUsers();
        for (const user of users) {
            this.bot.sendMessage(user.id, quote);
        }
    }
}

module.exports = Scheduler;
