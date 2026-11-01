
const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app.js');
const connection = require('./src/config/database.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connection();

        // Start server after successful DB connection
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

startServer();
