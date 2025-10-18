const express = require('express');
const Catalog = require('../models/Catalog');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/catalogs/juzgados
// @desc    Get all judicial courts
// @access  Public
router.get('/juzgados', async (req, res) => {
  try {
    const juzgados = await Catalog.getJuzgados();
    res.json({
      message: 'Judicial courts retrieved successfully',
      data: juzgados
    });
  } catch (error) {
    console.error('Get juzgados error:', error);
    res.status(500).json({
      message: 'Server error retrieving judicial courts'
    });
  }
});

// @route   GET /api/catalogs/perfiles
// @desc    Get all user profiles
// @access  Public
router.get('/perfiles', async (req, res) => {
  try {
    const perfiles = await Catalog.getPerfiles();
    res.json({
      message: 'User profiles retrieved successfully',
      data: perfiles
    });
  } catch (error) {
    console.error('Get perfiles error:', error);
    res.status(500).json({
      message: 'Server error retrieving user profiles'
    });
  }
});

// @route   GET /api/catalogs/juzgados/:id
// @desc    Get judicial court by ID
// @access  Public
router.get('/juzgados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const juzgado = await Catalog.getJuzgadoById(parseInt(id));

    if (!juzgado) {
      return res.status(404).json({
        message: 'Judicial court not found'
      });
    }

    res.json({
      message: 'Judicial court retrieved successfully',
      data: juzgado
    });
  } catch (error) {
    console.error('Get juzgado by ID error:', error);
    res.status(500).json({
      message: 'Server error retrieving judicial court'
    });
  }
});

// @route   GET /api/catalogs/perfiles/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/perfiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await Catalog.getPerfilById(parseInt(id));

    if (!perfil) {
      return res.status(404).json({
        message: 'User profile not found'
      });
    }

    res.json({
      message: 'User profile retrieved successfully',
      data: perfil
    });
  } catch (error) {
    console.error('Get perfil by ID error:', error);
    res.status(500).json({
      message: 'Server error retrieving user profile'
    });
  }
});

module.exports = router;
