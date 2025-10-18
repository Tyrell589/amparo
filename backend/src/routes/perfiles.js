const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// GET /api/perfiles - Get all perfiles with pagination and filtering
// @access  Public (authentication bypassed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = getPool();
    
    // Build WHERE clause
    let whereClause = 'WHERE Eliminado = 0';
    if (search) {
      whereClause += ' AND Nombre LIKE @search';
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Cat_Perfil ${whereClause}`;
    const countRequest = pool.request();
    if (search) {
      countRequest.input('search', sql.VarChar, `%${search}%`);
    }
    const countResult = await countRequest.query(countQuery);

    // Get paginated data
    const dataQuery = `
      SELECT 
        id_perfil as id,
        Nombre as nombre,
        CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
      FROM Cat_Perfil 
      ${whereClause}
      ORDER BY Nombre
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const dataRequest = pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));
      
    if (search) {
      dataRequest.input('search', sql.VarChar, `%${search}%`);
    }
    
    const dataResult = await dataRequest.query(dataQuery);

    const total = countResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: dataResult.recordset,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching perfiles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// GET /api/perfiles/:id - Get single perfil
// @access  Public (authentication bypassed)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          id_perfil as id,
          Nombre as nombre,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Perfil 
        WHERE id_perfil = @id AND Eliminado = 0
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil no encontrado' 
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error fetching perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// POST /api/perfiles - Create new perfil
// @access  Public (authentication bypassed)
router.post('/', async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = getPool();
    
    // Check if nombre already exists
    const existingResult = await pool.request()
      .input('nombre', sql.VarChar, nombre.trim())
      .query('SELECT id_perfil FROM Cat_Perfil WHERE Nombre = @nombre AND Eliminado = 0');
    
    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un perfil con este nombre' 
      });
    }

    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre.trim())
      .query(`
        INSERT INTO Cat_Perfil (Nombre, Eliminado)
        VALUES (@nombre, 0);
        
        SELECT 
          id_perfil as id,
          Nombre as nombre,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Perfil 
        WHERE id_perfil = SCOPE_IDENTITY()
      `);

    res.status(201).json({
      success: true,
      message: 'Perfil creado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error creating perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// PUT /api/perfiles/:id - Update perfil
// @access  Public (authentication bypassed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activo = true } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = getPool();
    
    // Check if perfil exists
    const existingResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id_perfil FROM Cat_Perfil WHERE id_perfil = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil no encontrado' 
      });
    }

    // Check if nombre already exists (excluding current record)
    const duplicateResult = await pool.request()
      .input('nombre', sql.VarChar, nombre.trim())
      .input('id', sql.Int, id)
      .query('SELECT id_perfil FROM Cat_Perfil WHERE Nombre = @nombre AND id_perfil != @id AND Eliminado = 0');
    
    if (duplicateResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un perfil con este nombre' 
      });
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre.trim())
      .input('eliminado', sql.Bit, activo ? 0 : 1)
      .query(`
        UPDATE Cat_Perfil 
        SET Nombre = @nombre, Eliminado = @eliminado
        WHERE id_perfil = @id;
        
        SELECT 
          id_perfil as id,
          Nombre as nombre,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Perfil 
        WHERE id_perfil = @id
      `);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error updating perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// DELETE /api/perfiles/:id - Delete perfil (soft delete)
// @access  Public (authentication bypassed)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    // Check if perfil exists
    const existingResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id_perfil FROM Cat_Perfil WHERE id_perfil = @id AND Eliminado = 0');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil no encontrado' 
      });
    }

    // Check if perfil is being used by users
    const usageResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT COUNT(*) as count FROM Usuarios WHERE id_perfil = @id AND Eliminado = 0');
    
    if (usageResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar el perfil porque está siendo utilizado por usuarios' 
      });
    }

    // Soft delete
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Cat_Perfil SET Eliminado = 1 WHERE id_perfil = @id');

    res.json({
      success: true,
      message: 'Perfil eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

module.exports = router;
