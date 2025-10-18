const express = require('express');
const { getPool, sql } = require('../config/database');

const router = express.Router();

// @route   GET /api/catalogs/juzgados
// @desc    Get all active judicial courts (public access for registration)
// @access  Public
router.get('/juzgados', async (req, res) => {
  try {
    const pool = getPool();
    
    const result = await pool.request().query(`
      SELECT 
        organo_impartidor_justicia as id,
        Nombre as nombre,
        Clave,
        TipoJuicio,
        Correo
      FROM Cat_Juzgados 
      WHERE Eliminado = 0
      ORDER BY Nombre
    `);

    res.json({
      message: 'Judicial courts retrieved successfully',
      data: result.recordset
    });
  } catch (error) {
    console.error('Get juzgados error:', error);
    res.status(500).json({
      message: 'Server error retrieving judicial courts'
    });
  }
});

// @route   GET /api/catalogs/perfiles
// @desc    Get all active user profiles (public access for registration)
// @access  Public
router.get('/perfiles', async (req, res) => {
  try {
    const pool = getPool();
    
    const result = await pool.request().query(`
      SELECT 
        id_perfil as id,
        Nombre as nombre
      FROM Cat_Perfil 
      WHERE Eliminado = 0
      ORDER BY Nombre
    `);

    res.json({
      message: 'User profiles retrieved successfully',
      data: result.recordset
    });
  } catch (error) {
    console.error('Get perfiles error:', error);
    res.status(500).json({
      message: 'Server error retrieving user profiles'
    });
  }
});

// @route   GET /api/catalogs/juzgados/:id
// @desc    Get judicial court by ID (public)
// @access  Public
router.get('/juzgados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT 
          organo_impartidor_justicia as id,
          Nombre as nombre,
          Clave,
          TipoJuicio,
          IdDistrito,
          Correo
        FROM Cat_Juzgados 
        WHERE organo_impartidor_justicia = @id AND Eliminado = 0
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Judicial court not found'
      });
    }

    res.json({
      message: 'Judicial court retrieved successfully',
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Get juzgado by ID error:', error);
    res.status(500).json({
      message: 'Server error retrieving judicial court'
    });
  }
});

// @route   GET /api/catalogs/perfiles/:id
// @desc    Get user profile by ID (public)
// @access  Public
router.get('/perfiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT 
          id_perfil as id,
          Nombre as nombre
        FROM Cat_Perfil 
        WHERE id_perfil = @id AND Eliminado = 0
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'User profile not found'
      });
    }

    res.json({
      message: 'User profile retrieved successfully',
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Get perfil by ID error:', error);
    res.status(500).json({
      message: 'Server error retrieving user profile'
    });
  }
});

module.exports = router;
