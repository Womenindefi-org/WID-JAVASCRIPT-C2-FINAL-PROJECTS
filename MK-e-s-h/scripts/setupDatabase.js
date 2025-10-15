// scripts/setupDatabase.js
console.log('Starting database setup...');

try {
   const Database = require('../src/database.js');
    console.log('✓ Database module loaded');
   console.log('Database type:', typeof Database);
    
    const ContentManager = require('../src/contentManager');
    console.log('✓ ContentManager module loaded');

    async function setupDatabase() {
        console.log('Initializing database...');
        
        const db = new Database();
        await db.initialize();
        console.log('✓ Database initialized');

        // Insert sample assignments
        console.log('Inserting sample assignments...');
        const assignments = ContentManager.getSampleAssignments();
        
        for (const assignment of assignments) {
            await db.run(`
                INSERT INTO assignments (title, description, category, difficulty, estimated_time_minutes)
                VALUES (?, ?, ?, ?, ?)
            `, [assignment.title, assignment.description, assignment.category, assignment.difficulty, assignment.estimated_time]);
        }
        
        console.log(`✓ Inserted ${assignments.length} sample assignments`);
        console.log('✓ Database setup completed successfully!');
        
        await db.close();
        console.log('✓ Database connection closed');
    }

    setupDatabase().catch(error => {
        console.error('❌ Setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    });

} catch (error) {
    console.error('❌ Failed to load modules:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}
