const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// GET /api/juzgados - Get all juzgados with pagination and filtering
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
        FROM Cat_Juzgados 
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
        FROM Cat_Juzgados 
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
    console.error('Error fetching juzgados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// GET /api/juzgados/:id - Get single juzgado
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getConnection();
    
    const result = await pool.request()
      .input('id', db.Int, id)
      .query(`
        SELECT id, nombre, descripcion, activo, fecha_creacion, fecha_actualizacion
        FROM Cat_Juzgados 
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Juzgado no encontrado' 
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error fetching juzgado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// POST /api/juzgados - Create new juzgado
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
      .query('SELECT id FROM Cat_Juzgados WHERE nombre = @nombre');
    
    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un juzgado con este nombre' 
      });
    }

    const result = await pool.request()
      .input('nombre', db.VarChar, nombre.trim())
      .input('descripcion', db.VarChar, descripcion.trim())
      .input('activo', db.Bit, activo ? 1 : 0)
      .query(`
        INSERT INTO Cat_Juzgados (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.descripcion, INSERTED.activo, INSERTED.fecha_creacion, INSERTED.fecha_actualizacion
        VALUES (@nombre, @descripcion, @activo, GETDATE(), GETDATE())
      `);

    res.status(201).json({
      success: true,
      message: 'Juzgado creado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error creating juzgado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// PUT /api/juzgados/:id - Update juzgado
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
    
    // Check if juzgado exists
    const existingResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Juzgados WHERE id = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Juzgado no encontrado' 
      });
    }

    // Check if nombre already exists (excluding current record)
    const duplicateResult = await pool.request()
      .input('nombre', db.VarChar, nombre.trim())
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Juzgados WHERE nombre = @nombre AND id != @id');
    
    if (duplicateResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un juzgado con este nombre' 
      });
    }

    const result = await pool.request()
      .input('id', db.Int, id)
      .input('nombre', db.VarChar, nombre.trim())
      .input('descripcion', db.VarChar, descripcion.trim())
      .input('activo', db.Bit, activo ? 1 : 0)
      .query(`
        UPDATE Cat_Juzgados 
        SET nombre = @nombre, descripcion = @descripcion, activo = @activo, fecha_actualizacion = GETDATE()
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.descripcion, INSERTED.activo, INSERTED.fecha_creacion, INSERTED.fecha_actualizacion
        WHERE id = @id
      `);

    res.json({
      success: true,
      message: 'Juzgado actualizado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error updating juzgado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// DELETE /api/juzgados/:id - Delete juzgado
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getConnection();
    
    // Check if juzgado exists
    const existingResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT id FROM Cat_Juzgados WHERE id = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Juzgado no encontrado' 
      });
    }

    // Check if juzgado is being used by users
    const usageResult = await pool.request()
      .input('id', db.Int, id)
      .query('SELECT COUNT(*) as count FROM Usuario WHERE organo_impartidor_justicia = @id');
    
    if (usageResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar el juzgado porque está siendo utilizado por usuarios' 
      });
    }

    await pool.request()
      .input('id', db.Int, id)
      .query('DELETE FROM Cat_Juzgados WHERE id = @id');

    res.json({
      success: true,
      message: 'Juzgado eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting juzgado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

module.exports = router;
