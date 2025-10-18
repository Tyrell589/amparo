const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// GET /api/perfiles - Get all perfiles with pagination and filtering
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', activo = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = {};
    
    if (search) {
      whereClause += ' AND (nombre LIKE @search OR descripcion LIKE @search)';
      params.search = `%${search}%`;
    }
    
    if (activo !== '') {
      whereClause += ' AND activo = @activo';
      params.activo = activo === 'true' ? 1 : 0;
    }

    const pool = await db.getConnection();
    
    // Get total count
    const countResult = await pool.request()
      .input('search', db.VarChar, params.search || '')
      .input('activo', db.Int, params.activo !== undefined ? params.activo : null)
      .query(`
        SELECT COUNT(*) as total 
        FROM Cat_Perfil 
        ${whereClause.replace('@search', '@search').replace('@activo', '@activo')}
      `);

    // Get paginated data
    const dataResult = await pool.request()
      .input('search', db.VarChar, params.search || '')
      .input('activo', db.Int, params.activo !== undefined ? params.activo : null)
      .input('offset', db.Int, offset)
      .input('limit', db.Int, parseInt(limit))
      .query(`
        SELECT id, nombre, descripcion, activo, fecha_creacion, fecha_actualizacion
        FROM Cat_Perfil 
        ${whereClause.replace('@search', '@search').replace('@activo', '@activo')}
        ORDER BY nombre
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

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
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getConnection();
    
    const result = await pool.request()
      .input('id', db.Int, id)
      .query(`
        SELECT id, nombre, descripcion, activo, fecha_creacion, fecha_actualizacion
        FROM Cat_Perfil 
        WHERE id = @id
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
router.post('/', adminAuth, async (req, res) => {
  try {
    const { nombre, descripcion = '', activo = true } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = await db.getConnection();
    
    // Check if nombre already exists
    const existingResult = await pool.request()
      .input('nombre', db.VarChar, nombre.trim())
      .query('SELECT id FROM Cat_Perfil WHERE nombre = @nombre');
    
    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un perfil con este nombre' 
      });
    }

    const result = await pool.request()
      .input('nombre', db.VarChar, nombre.trim())
      .input('descripcion', db.VarChar, descripcion.trim())
      .input('activo', db.Bit, activo ? 1 : 0)
      .query(`
        INSERT INTO Cat_Perfil (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.descripcion, INSERTED.activo, INSERTED.fecha_creacion, INSERTED.fecha_actualizacion
        VALUES (@nombre, @descripcion, @activo, GETDATE(), GETDATE())
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
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion = '', activo = true } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = await db.getConnection();
    
    // Check if perfil exists
    const existingResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Perfil WHERE id = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil no encontrado' 
      });
    }

    // Check if nombre already exists (excluding current record)
    const duplicateResult = await pool.request()
      .input('nombre', db.VarChar, nombre.trim())
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Perfil WHERE nombre = @nombre AND id != @id');
    
    if (duplicateResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un perfil con este nombre' 
      });
    }

    const result = await pool.request()
      .input('id', db.Int, id)
      .input('nombre', db.VarChar, nombre.trim())
      .input('descripcion', db.VarChar, descripcion.trim())
      .input('activo', db.Bit, activo ? 1 : 0)
      .query(`
        UPDATE Cat_Perfil 
        SET nombre = @nombre, descripcion = @descripcion, activo = @activo, fecha_actualizacion = GETDATE()
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.descripcion, INSERTED.activo, INSERTED.fecha_creacion, INSERTED.fecha_actualizacion
        WHERE id = @id
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

// DELETE /api/perfiles/:id - Delete perfil
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getConnection();
    
    // Check if perfil exists
    const existingResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Perfil WHERE id = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil no encontrado' 
      });
    }

    // Check if perfil is being used by users
    const usageResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT COUNT(*) as count FROM Usuario WHERE id_perfil = @id');
    
    if (usageResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar el perfil porque está siendo utilizado por usuarios' 
      });
    }

    await pool.request()
      .input('id', db.Int, id)
      .query('DELETE FROM Cat_Perfil WHERE id = @id');

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
