const { getPool, sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.IdUsuario = data.IdUsuario;
    this.Nombre = data.Nombre;
    this.APaterno = data.APaterno;
    this.AMaterno = data.AMaterno;
    this.Usuario = data.Usuario;
    this.Clave = data.Clave;
    this.Correo = data.Correo;
    this.Telefono = data.Telefono;
    this.Extension = data.Extension;
    this.id_perfil = data.id_perfil;
    this.organo_impartidor_justicia = data.organo_impartidor_justicia;
    this.Estado = data.Estado || 'A';
    this.Eliminado = data.Eliminado || 0;
  }

  // Create a new user
  static async create(userData) {
    const pool = getPool();
    const { Nombre, APaterno, AMaterno, Usuario, Clave, Correo, Telefono, Extension, id_perfil, organo_impartidor_justicia } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(Clave, 12);
    
    const request = pool.request();
    request.input('Nombre', sql.NVarChar(100), Nombre);
    request.input('APaterno', sql.NVarChar(100), APaterno);
    request.input('AMaterno', sql.NVarChar(100), AMaterno);
    request.input('Usuario', sql.NVarChar(50), Usuario);
    request.input('Clave', sql.NVarChar(255), hashedPassword);
    request.input('Correo', sql.NVarChar(100), Correo);
    request.input('Telefono', sql.NVarChar(20), Telefono);
    request.input('Extension', sql.NVarChar(10), Extension);
    request.input('id_perfil', sql.Int, id_perfil);
    request.input('organo_impartidor_justicia', sql.Int, organo_impartidor_justicia);
    request.input('Estado', sql.Char(1), 'A');
    request.input('Eliminado', sql.Bit, 0);

    const result = await request.query(`
      INSERT INTO Usuarios (Nombre, APaterno, AMaterno, Usuario, Clave, Correo, Telefono, Extensión, id_perfil, organo_impartidor_justicia, Estado, Eliminado)
      OUTPUT INSERTED.IdUsuario
      VALUES (@Nombre, @APaterno, @AMaterno, @Usuario, @Clave, @Correo, @Telefono, @Extension, @id_perfil, @organo_impartidor_justicia, @Estado, @Eliminado)
    `);

    return result.recordset[0].IdUsuario;
  }

  // Find user by username/email
  static async findByUsernameOrEmail(identifier) {
    const pool = getPool();
    const request = pool.request();
    request.input('identifier', sql.NVarChar(100), identifier);

    const result = await request.query(`
      SELECT IdUsuario, Nombre, APaterno, AMaterno, Usuario, Clave, Correo, Telefono, Extensión AS Extension, 
             id_perfil, organo_impartidor_justicia, Estado, Eliminado
      FROM Usuarios 
      WHERE (Usuario = @identifier OR Correo = @identifier) 
      AND Estado = 'A' AND Eliminado = 0
    `);

    return result.recordset[0] || null;
  }

  // Find user by ID (including inactive users)
  static async findById(id) {
    const pool = getPool();
    const request = pool.request();
    request.input('IdUsuario', sql.Int, id);

    const result = await request.query(`
      SELECT IdUsuario, Nombre, APaterno, AMaterno, Usuario, Correo, Telefono, Extensión AS Extension, 
             id_perfil, organo_impartidor_justicia, Estado, Eliminado
      FROM Usuarios 
      WHERE IdUsuario = @IdUsuario AND Eliminado = 0
    `);

    return result.recordset[0] || null;
  }

  // Check if username exists
  static async usernameExists(username) {
    const pool = getPool();
    const request = pool.request();
    request.input('Usuario', sql.NVarChar(50), username);

    const result = await request.query(`
      SELECT COUNT(*) as count 
      FROM Usuarios 
      WHERE Usuario = @Usuario AND Eliminado = 0
    `);

    return result.recordset[0].count > 0;
  }

  // Check if email exists
  static async emailExists(email) {
    const pool = getPool();
    const request = pool.request();
    request.input('Correo', sql.NVarChar(100), email);

    const result = await request.query(`
      SELECT COUNT(*) as count 
      FROM Usuarios 
      WHERE Correo = @Correo AND Eliminado = 0
    `);

    return result.recordset[0].count > 0;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.Clave);
  }

  // Get user without password
  toJSON() {
    const { Clave, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
