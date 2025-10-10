const { Telegraf } = require('telegraf');

async function setupWebhook() {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const webhookUrl = process.env.WEBHOOK_URL || `https://${process.env.VERCEL_URL}/api/webhook`;
    
    try {
        await bot.telegram.setWebhook(webhookUrl);
        console.log(`Webhook set to: ${webhookUrl}`);
        
        // Get webhook info to verify
        const webhookInfo = await bot.telegram.getWebhookInfo();
        console.log('Webhook info:', webhookInfo);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

setupWebhook();