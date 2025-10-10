class PromptsService {
    constructor() {
        this.prompts = [
            "What did you learn today?",
            "What challenges did you face?",
            "What are you grateful for today?",
            "What is your goal for tomorrow?"
        ];
        this.responses = new Map();
    }

    sendDailyPrompt(userId) {
        const prompt = this.getRandomPrompt();
        // Logic to send the prompt to the user via the bot
        return prompt;
    }

    getPromptResponses(userId) {
        return this.responses.get(userId) || [];
    }

    saveResponse(userId, response) {
        if (!this.responses.has(userId)) {
            this.responses.set(userId, []);
        }
        this.responses.get(userId).push(response);
    }

    getRandomPrompt() {
        const randomIndex = Math.floor(Math.random() * this.prompts.length);
        return this.prompts[randomIndex];
    }
}

module.exports = { PromptsService };