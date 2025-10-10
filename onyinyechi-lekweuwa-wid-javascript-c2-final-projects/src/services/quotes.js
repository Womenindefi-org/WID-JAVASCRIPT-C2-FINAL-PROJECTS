class QuotesService {
    constructor() {
        this.quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson"
        ];
    }

    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }
}

module.exports = { QuotesService };