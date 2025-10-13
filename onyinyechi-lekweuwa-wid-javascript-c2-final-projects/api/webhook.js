const { Telegraf } = require('telegraf');
const { RemindersService } = require('../src/services/reminders');
const { QuotesService } = require('../src/services/quotes');
const { AssignmentsService } = require('../src/services/assignments');
const { PromptsService } = require('../src/services/prompts');
const { saveResponse } = require('../src/storage/responses');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize services
const remindersService = new RemindersService();
const quotesService = new QuotesService();
const assignmentsService = new AssignmentsService();
const promptsService = new PromptsService();

// Bot commands
bot.start((ctx) => {
    ctx.reply('Welcome to the Training Engagement Bot! I will help you stay engaged and accountable.');
});

bot.command('quote', async (ctx) => {
    const quote = quotesService.getRandomQuote();
    ctx.reply(quote);
});

bot.command('assign', (ctx) => {
    const assignment = ctx.message.text.split(' ').slice(1).join(' ');
    assignmentsService.addAssignment(assignment);
    ctx.reply(`Assignment added: ${assignment}`);
});

bot.command('list_assignments', (ctx) => {
    const assignments = assignmentsService.listAssignments();
    ctx.reply(assignments.length > 0 ? assignments.join('\n') : 'No assignments found.');
});

bot.command('remind', (ctx) => {
    const [time, ...messageParts] = ctx.message.text.split(' ').slice(1);
    const message = messageParts.join(' ');
    remindersService.scheduleReminder(ctx.chat.id.toString(), time, message);
    ctx.reply(`Reminder set for ${time}: ${message}`);
});

bot.command('daily_prompt', (ctx) => {
    const prompt = promptsService.sendDailyPrompt(ctx.chat.id.toString());
    ctx.reply(prompt);
});

bot.on('text', (ctx) => {
    const userResponse = ctx.message.text;
    saveResponse(ctx.chat.id.toString(), userResponse);
    ctx.reply('Response recorded. Thank you!');
});

// Vercel serverless function handler
module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
            res.status(200).json({ ok: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};