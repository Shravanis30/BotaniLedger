require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const user = await User.findOne({ email: 'sulakshanasalunke85@gmail.com' });
        if (user) {
            user.password = 'Password123';
            await user.save();
            console.log('Password reset to: Password123');
        } else {
            console.log('User not found');
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

resetPassword();
