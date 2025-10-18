const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Login validation rules
const loginValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Register validation rules
const registerValidation = [
  body('Nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('APaterno')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('AMaterno')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Mother\'s last name must be between 2 and 100 characters'),
  body('Usuario')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('Clave')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.Clave) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  body('Correo')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('Telefono')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('Extension')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Extension must be maximum 10 characters'),
  body('id_perfil')
    .isInt({ min: 1 })
    .withMessage('Profile is required'),
  body('organo_impartidor_justicia')
    .isInt({ min: 1 })
    .withMessage('Judicial organ is required')
];

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // Find user by username or email
    const user = await User.findByUsernameOrEmail(identifier);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const userInstance = new User(user);
    const isPasswordValid = await userInstance.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.IdUsuario);

    // Return user data (without password) and token
    res.json({
      message: 'Login successful',
      token,
      user: userInstance.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      Nombre,
      APaterno,
      AMaterno,
      Usuario,
      Clave,
      Correo,
      Telefono,
      Extension,
      id_perfil,
      organo_impartidor_justicia
    } = req.body;

    // Check if username already exists
    const usernameExists = await User.usernameExists(Usuario);
    if (usernameExists) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const emailExists = await User.emailExists(Correo);
    if (emailExists) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // Create user
    const userId = await User.create({
      Nombre,
      APaterno,
      AMaterno,
      Usuario,
      Clave,
      Correo,
      Telefono,
      Extension,
      id_perfil,
      organo_impartidor_justicia
    });

    // Generate token
    const token = generateToken(userId);

    // Get created user data
    const newUser = await User.findById(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Public (authentication bypassed)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (jwtError) {
      // If token verification fails, still return success for development
      res.json({ user: null });
    }

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

module.exports = router;
