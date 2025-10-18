const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// GET /api/juzgados - Get all juzgados with pagination and filtering
// @access  Public (authentication bypassed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = getPool();
    
    // Build WHERE clause
    let whereClause = 'WHERE Eliminado = 0';
    if (search) {
      whereClause += ' AND (Nombre LIKE @search OR Clave LIKE @search)';
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Cat_Juzgados ${whereClause}`;
    const countRequest = pool.request();
    if (search) {
      countRequest.input('search', sql.VarChar, `%${search}%`);
    }
    const countResult = await countRequest.query(countQuery);

    // Get paginated data
    const dataQuery = `
      SELECT 
        organo_impartidor_justicia as id,
        IdJuzgadoPJHGO,
        Clave,
        Nombre as nombre,
        TipoJuicio,
        IdDistrito,
        Correo,
        CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
      FROM Cat_Juzgados 
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
    console.error('Error fetching juzgados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// GET /api/juzgados/:id - Get single juzgado
// @access  Public (authentication bypassed)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          organo_impartidor_justicia as id,
          IdJuzgadoPJHGO,
          Clave,
          Nombre as nombre,
          TipoJuicio,
          IdDistrito,
          Correo,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Juzgados 
        WHERE organo_impartidor_justicia = @id AND Eliminado = 0
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
// @access  Public (authentication bypassed)
router.post('/', async (req, res) => {
  try {
    const { nombre, clave = '', tipoJuicio = 'A', idDistrito = 1, correo = '' } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = getPool();
    
    // Get next available organo_impartidor_justicia ID
    const maxIdResult = await pool.request()
      .query('SELECT ISNULL(MAX(organo_impartidor_justicia), 0) + 1 as nextId FROM Cat_Juzgados');
    const nextId = maxIdResult.recordset[0].nextId;
    
    // Get next IdJuzgadoPJHGO
    const maxJuzgadoIdResult = await pool.request()
      .query('SELECT ISNULL(MAX(IdJuzgadoPJHGO), 0) + 1 as nextJuzgadoId FROM Cat_Juzgados');
    const nextJuzgadoId = maxJuzgadoIdResult.recordset[0].nextJuzgadoId;

    // Check if nombre already exists
    const existingResult = await pool.request()
      .input('nombre', sql.VarChar, nombre.trim())
      .query('SELECT organo_impartidor_justicia FROM Cat_Juzgados WHERE Nombre = @nombre AND Eliminado = 0');
    
    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un juzgado con este nombre' 
      });
    }

    const result = await pool.request()
      .input('organo', sql.Int, nextId)
      .input('juzgadoId', sql.Int, nextJuzgadoId)
      .input('clave', sql.VarChar, clave.trim() || `J${String(nextJuzgadoId).padStart(3, '0')}`)
      .input('nombre', sql.VarChar, nombre.trim())
      .input('tipoJuicio', sql.VarChar, tipoJuicio)
      .input('idDistrito', sql.Int, idDistrito)
      .input('correo', sql.VarChar, correo.trim())
      .query(`
        INSERT INTO Cat_Juzgados (IdJuzgadoPJHGO, Clave, Nombre, TipoJuicio, IdDistrito, organo_impartidor_justicia, Correo, Eliminado)
        VALUES (@juzgadoId, @clave, @nombre, @tipoJuicio, @idDistrito, @organo, @correo, 0);
        
        SELECT 
          organo_impartidor_justicia as id,
          IdJuzgadoPJHGO,
          Clave,
          Nombre as nombre,
          TipoJuicio,
          IdDistrito,
          Correo,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Juzgados 
        WHERE organo_impartidor_justicia = @organo
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
// @access  Public (authentication bypassed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, clave, tipoJuicio, idDistrito, correo, activo = true } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre es requerido' 
      });
    }

    const pool = getPool();
    
    // Check if juzgado exists
    const existingResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT organo_impartidor_justicia FROM Cat_Juzgados WHERE organo_impartidor_justicia = @id');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Juzgado no encontrado' 
      });
    }

    // Check if nombre already exists (excluding current record)
    const duplicateResult = await pool.request()
      .input('nombre', sql.VarChar, nombre.trim())
      .input('id', sql.Int, id)
      .query('SELECT organo_impartidor_justicia FROM Cat_Juzgados WHERE Nombre = @nombre AND organo_impartidor_justicia != @id AND Eliminado = 0');
    
    if (duplicateResult.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un juzgado con este nombre' 
      });
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre.trim())
      .input('clave', sql.VarChar, clave || '')
      .input('tipoJuicio', sql.VarChar, tipoJuicio || 'A')
      .input('idDistrito', sql.Int, idDistrito || 1)
      .input('correo', sql.VarChar, correo || '')
      .input('eliminado', sql.Bit, activo ? 0 : 1)
      .query(`
        UPDATE Cat_Juzgados 
        SET 
          Nombre = @nombre,
          Clave = @clave,
          TipoJuicio = @tipoJuicio,
          IdDistrito = @idDistrito,
          Correo = @correo,
          Eliminado = @eliminado
        WHERE organo_impartidor_justicia = @id;
        
        SELECT 
          organo_impartidor_justicia as id,
          IdJuzgadoPJHGO,
          Clave,
          Nombre as nombre,
          TipoJuicio,
          IdDistrito,
          Correo,
          CASE WHEN Eliminado = 0 THEN 1 ELSE 0 END as activo
        FROM Cat_Juzgados 
        WHERE organo_impartidor_justicia = @id
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

// DELETE /api/juzgados/:id - Delete juzgado (soft delete)
// @access  Public (authentication bypassed)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    // Check if juzgado exists
    const existingResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT organo_impartidor_justicia FROM Cat_Juzgados WHERE organo_impartidor_justicia = @id AND Eliminado = 0');
    
    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Juzgado no encontrado' 
      });
    }

    // Check if juzgado is being used by users
    const usageResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT COUNT(*) as count FROM Usuarios WHERE organo_impartidor_justicia = @id AND Eliminado = 0');
    
    if (usageResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar el juzgado porque está siendo utilizado por usuarios' 
      });
    }

    // Soft delete
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Cat_Juzgados SET Eliminado = 1 WHERE organo_impartidor_justicia = @id');

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
