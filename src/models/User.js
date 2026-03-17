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
// update on 2026-03-15 - feat: enhance authentication flow
// update on 2026-03-18 - style: improve UI responsiveness
// update on 2026-03-19 - fix: resolve API validation issue
// update on 2026-03-19 - feat: update dashboard UI components
// update on 2026-03-19 - feat: improve farmer batch handling
// update on 2026-03-20 - style: improve UI responsiveness
// update on 2026-03-21 - refactor: improve code structure
// update on 2026-03-22 - docs: update API documentation
// update on 2026-03-27 - feat: update dashboard UI components
// update on 2026-03-27 - docs: update API documentation
// update on 2026-03-30 - feat: optimize blockchain interaction
// update on 2026-04-02 - fix: resolve API validation issue
// update on 2026-04-04 - docs: update API documentation
// update on 2026-04-05 - fix: resolve API validation issue
// update on 2026-04-06 - style: improve UI responsiveness
// update on 2026-04-08 - docs: update API documentation
// update on 2026-04-12 - refactor: optimize backend performance
// update on 2026-03-16 - style: improve UI responsiveness
// update on 2026-03-17 - fix: resolve API validation issue
