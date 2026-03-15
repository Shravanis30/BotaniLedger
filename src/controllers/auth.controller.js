const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organization, phone, address, licenseNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 400, 'User already exists');
    }

    const user = await User.create({
      name, email, password, role, organization, phone, address, licenseNumber
    });

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        isActive: user.isActive
      }
    }, 'Registration successful. Your account is pending verification by the AYUSH Ministry Admin.');
  } catch (err) {
    logger.error('Registration error:', err);
    errorResponse(res, 500, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return errorResponse(res, 401, 'Account is inactive');
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      },
      accessToken,
      refreshToken
    }, 'Login successful');
  } catch (err) {
    logger.error('Login error:', err);
    errorResponse(res, 500, err.message);
  }
};

exports.getMe = async (req, res) => {
  successResponse(res, { user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    successResponse(res, { user }, 'Profile updated successfully');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
// update on 2026-03-16 - fix: correct edge case in service logic
// update on 2026-03-19 - fix: correct edge case in service logic
// update on 2026-03-24 - refactor: improve code structure
// update on 2026-03-26 - fix: resolve API validation issue
// update on 2026-03-27 - 
// update on 2026-03-28 - 
// update on 2026-03-29 - docs: update API documentation
// update on 2026-03-31 - feat: enhance authentication flow
// update on 2026-03-31 - feat: update dashboard UI components
// update on 2026-04-01 - feat: optimize blockchain interaction
// update on 2026-04-01 - refactor: improve code structure
// update on 2026-04-01 - refactor: optimize backend performance
// update on 2026-04-07 - feat: update dashboard UI components
// update on 2026-04-10 - feat: optimize blockchain interaction
// update on 2026-04-13 - 
// update on 2026-03-15 - style: improve UI responsiveness
// update on 2026-03-15 - refactor: optimize backend performance
