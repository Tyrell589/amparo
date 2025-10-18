const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getPool, sql } = require('../config/database');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination and search
// @access  Public (authentication bypassed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', estado = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = getPool();
    
    // Build WHERE clause
    let whereClause = 'WHERE u.Eliminado = 0';
    if (search) {
      whereClause += ' AND (u.Nombre LIKE @search OR u.APaterno LIKE @search OR u.AMaterno LIKE @search OR u.Usuario LIKE @search OR u.Correo LIKE @search)';
    }
    if (estado !== '') {
      whereClause += ' AND u.Estado = @estado';
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Usuarios u ${whereClause}`;
    const countRequest = pool.request();
    if (search) {
      countRequest.input('search', sql.VarChar, `%${search}%`);
    }
    if (estado !== '') {
      countRequest.input('estado', sql.Char, estado);
    }
    const countResult = await countRequest.query(countQuery);

    // Get paginated data with related info
    const dataQuery = `
      SELECT 
        u.IdUsuario,
        u.Nombre,
        u.APaterno,
        u.AMaterno,
        u.Usuario,
        u.Correo,
        u.Telefono,
        u.Extensión as Extension,
        u.id_perfil,
        p.Nombre as perfil_nombre,
        u.organo_impartidor_justicia,
        j.Nombre as juzgado_nombre,
        u.Estado,
        u.Eliminado
      FROM Usuarios u
      LEFT JOIN Cat_Perfil p ON u.id_perfil = p.id_perfil
      LEFT JOIN Cat_Juzgados j ON u.organo_impartidor_justicia = j.organo_impartidor_justicia
      ${whereClause}
      ORDER BY u.Nombre, u.APaterno
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const dataRequest = pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));
      
    if (search) {
      dataRequest.input('search', sql.VarChar, `%${search}%`);
    }
    if (estado !== '') {
      dataRequest.input('estado', sql.Char, estado);
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public (authentication bypassed)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      message: 'Server error retrieving user'
    });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Public (authentication bypassed)
router.post('/', async (req, res) => {
  try {
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

    // Validation
    if (!Nombre || !APaterno || !AMaterno || !Usuario || !Clave || !Correo || !id_perfil || !organo_impartidor_justicia) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if username already exists
    const usernameExists = await User.usernameExists(Usuario);
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const emailExists = await User.emailExists(Correo);
    if (emailExists) {
      return res.status(400).json({
        success: false,
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

    // Get created user data
    const newUser = await User.findById(userId);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error creating user',
      error: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Public (authentication bypassed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Nombre,
      APaterno,
      AMaterno,
      Usuario,
      Correo,
      Telefono,
      Extension,
      id_perfil,
      organo_impartidor_justicia,
      Estado
    } = req.body;

    const pool = getPool();

    // Check if user exists
    const existingUser = await User.findById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username is being changed and if it already exists
    if (Usuario && Usuario !== existingUser.Usuario) {
      const usernameExists = await User.usernameExists(Usuario);
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (Correo && Correo !== existingUser.Correo) {
      const emailExists = await User.emailExists(Correo);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('Nombre', sql.VarChar, Nombre)
      .input('APaterno', sql.VarChar, APaterno)
      .input('AMaterno', sql.VarChar, AMaterno)
      .input('Usuario', sql.VarChar, Usuario)
      .input('Correo', sql.VarChar, Correo)
      .input('Telefono', sql.VarChar, Telefono || '')
      .input('Extension', sql.VarChar, Extension || '')
      .input('id_perfil', sql.Int, id_perfil)
      .input('organo_impartidor_justicia', sql.Int, organo_impartidor_justicia)
      .input('Estado', sql.Char, Estado || 'A')
      .query(`
        UPDATE Usuarios 
        SET 
          Nombre = @Nombre,
          APaterno = @APaterno,
          AMaterno = @AMaterno,
          Usuario = @Usuario,
          Correo = @Correo,
          Telefono = @Telefono,
          Extensión = @Extension,
          id_perfil = @id_perfil,
          organo_impartidor_justicia = @organo_impartidor_justicia,
          Estado = @Estado
        WHERE IdUsuario = @id
      `);

    // Get updated user data
    const updatedUser = await User.findById(parseInt(id));

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Public (authentication bypassed)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Check if user exists
    const existingUser = await User.findById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('UPDATE Usuarios SET Eliminado = 1 WHERE IdUsuario = @id');

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// @route   PATCH /api/users/:id/toggle-status
// @desc    Toggle user active/inactive status
// @access  Public (authentication bypassed)
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get current status
    const user = await User.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Toggle status
    const newStatus = user.Estado === 'A' ? 'I' : 'A';
    
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('estado', sql.Char, newStatus)
      .query('UPDATE Usuarios SET Estado = @estado WHERE IdUsuario = @id');

    // Get updated user
    const updatedUser = await User.findById(parseInt(id));

    res.json({
      success: true,
      message: `User ${newStatus === 'A' ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling user status'
    });
  }
});

module.exports = router;
