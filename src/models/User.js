const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['farmer', 'lab', 'manufacturer', 'admin', 'regulator'],
    required: true 
  },
  organization: { type: String, required: true },
  fabricIdentity: {
    certificate: String,
    privateKey: String,
    mspId: String
  },
  fcmToken: String,           // Firebase push notification token
  isActive: { type: Boolean, default: false },
  lastLogin: Date,
  profilePhoto: String,
  phone: String,
  address: String,
  licenseNumber: String,      // For labs and manufacturers
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
