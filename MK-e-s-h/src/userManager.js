class UserManager {
    constructor(db) {
        this.db = db;
    }

    addUser(userId, username) {
        console.log(`Adding user: ${username} (${userId})`);
        // You can later add database logic here
    }

    getUser(userId) {
        console.log(`Fetching user with ID: ${userId}`);
        // Return fake user data for now
        return { id: userId, name: "Test User" };
    }

    listUsers() {
        console.log("Listing all users...");
        // Simulate list
        return [];
    }
}

module.exports = UserManager;
