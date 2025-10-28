class RemindersService {
    constructor() {
        this.reminders = [];
    }

    scheduleReminder(userId, time, message) {
        const reminder = { userId, message, time };
        this.reminders.push(reminder);
        // Logic to schedule the reminder using a timer or a scheduling library
        console.log(`Reminder scheduled for user ${userId}: ${message} at ${time}`);
    }

    cancelReminder(userId, message) {
        this.reminders = this.reminders.filter(reminder => 
            reminder.userId !== userId || reminder.message !== message
        );
        // Logic to cancel the scheduled reminder
        console.log(`Reminder canceled for user ${userId}: ${message}`);
    }

    getRemindersForUser(userId) {
        return this.reminders.filter(reminder => reminder.userId === userId);
    }
}

module.exports = { RemindersService };