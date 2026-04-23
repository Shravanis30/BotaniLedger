require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const user = await User.findOne({ email: 'sulakshanasalunke85@gmail.com' });
        if (user) {
            console.log('User found:', {
                id: user._id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                organization: user.organization
            });
        } else {
            console.log('User not found');
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUser();
