class ContentManager {
  constructor(db) {
    this.db = db;
    this.quotes = [
      "Success is not final; failure is not fatal: It is the courage to continue that counts.",
      "Don’t watch the clock; do what it does. Keep going.",
      "The secret of getting ahead is getting started.",
    ];

    this.tasks = [
      "Write your top 3 goals for today.",
      "Review yesterday’s progress and note one improvement.",
      "Take 10 minutes to organize your workspace.",
    ];

    this.assignments = [
      "Create a 2-slide summary of your learning this week.",
      "Find one article related to your project topic and summarize it.",
      "Complete the practice quiz for module 2.",
    ];
  }

  getRandomQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  getRandomTask() {
    return this.tasks[Math.floor(Math.random() * this.tasks.length)];
  }

  getRandomAssignment() {
    return this.assignments[Math.floor(Math.random() * this.assignments.length)];
  }
}

module.exports = ContentManager;
