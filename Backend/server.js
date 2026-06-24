const app = require('./src/app.js');
const dotenv = require('dotenv');
const connection = require('./src/config/database.js');
dotenv.config();
connection();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

