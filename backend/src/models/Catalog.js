const { getPool, sql } = require('../config/database');

class Catalog {
  // Get all judicial courts (Cat_Juzgados)
  static async getJuzgados() {
    const pool = getPool();
    const request = pool.request();

    const result = await request.query(`
      SELECT id, nombre, descripcion, activo
      FROM Cat_Juzgados 
      WHERE activo = 1
      ORDER BY nombre
    `);

    return result.recordset;
  }

  // Get all user profiles (Cat_Perfil)
  static async getPerfiles() {
    const pool = getPool();
    const request = pool.request();

    const result = await request.query(`
      SELECT id, nombre, descripcion, activo
      FROM Cat_Perfil 
      WHERE activo = 1
      ORDER BY nombre
    `);

    return result.recordset;
  }

  // Get judicial court by ID
  static async getJuzgadoById(id) {
    const pool = getPool();
    const request = pool.request();
    request.input('id', sql.Int, id);

    const result = await request.query(`
      SELECT id, nombre, descripcion, activo
      FROM Cat_Juzgados 
      WHERE id = @id AND activo = 1
    `);

    return result.recordset[0] || null;
  }

  // Get profile by ID
  static async getPerfilById(id) {
    const pool = getPool();
    const request = pool.request();
    request.input('id', sql.Int, id);

    const result = await request.query(`
      SELECT id, nombre, descripcion, activo
      FROM Cat_Perfil 
      WHERE id = @id AND activo = 1
    `);

    return result.recordset[0] || null;
  }
}

module.exports = Catalog;
