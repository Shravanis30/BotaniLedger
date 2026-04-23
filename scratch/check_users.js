const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({ role: 'lab' });
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}
check();
