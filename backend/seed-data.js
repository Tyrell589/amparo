const sql = require('mssql');

// Database configuration
const config = {
  user: 'SA',
  password: 'Basketball@0615',
  server: 'localhost',
  port: 1433,
  database: 'PJF_Amparos',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

async function seedData() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    console.log('1️⃣ Connecting to PJF_Amparos database...');
    const pool = await sql.connect(config);
    console.log('✅ Connected\n');

    // Seed Cat_Perfil (User Profiles)
    console.log('2️⃣ Seeding Cat_Perfil (User Profiles)...');
    const profilesData = [
      { nombre: 'Administrador', descripcion: 'Administrador del sistema' },
      { nombre: 'Secretario', descripcion: 'Secretario judicial' },
      { nombre: 'Oficial de Partes', descripcion: 'Oficial de partes' },
      { nombre: 'Consulta', descripcion: 'Usuario de consulta' }
    ];

    for (const profile of profilesData) {
      const exists = await pool.request()
        .input('nombre', sql.NVarChar(200), profile.nombre)
        .query('SELECT id_perfil FROM Cat_Perfil WHERE Nombre = @nombre');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar(200), profile.nombre)
          .input('descripcion', sql.NVarChar(200), profile.descripcion || '')
          .query(`
            INSERT INTO Cat_Perfil (Nombre, Eliminado) 
            VALUES (@nombre, 0)
          `);
        console.log(`   ✅ Created profile: ${profile.nombre}`);
      } else {
        console.log(`   ⏭️  Profile already exists: ${profile.nombre}`);
      }
    }
    console.log('');

    // Seed Cat_Distritos
    console.log('3️⃣ Seeding Cat_Distritos...');
    const distritosData = [
      { IdDistrito: 1, Distrito: 'D001', Nombre: 'Distrito Judicial 1', Tipo: 'J' },
      { IdDistrito: 2, Distrito: 'D002', Nombre: 'Distrito Judicial 2', Tipo: 'J' }
    ];

    for (const distrito of distritosData) {
      const exists = await pool.request()
        .input('IdDistrito', sql.Int, distrito.IdDistrito)
        .query('SELECT IdDistrito FROM Cat_Distritos WHERE IdDistrito = @IdDistrito');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('IdDistrito', sql.Int, distrito.IdDistrito)
          .input('Distrito', sql.VarChar(10), distrito.Distrito)
          .input('Nombre', sql.VarChar(100), distrito.Nombre)
          .input('Tipo', sql.Char(1), distrito.Tipo)
          .query(`
            INSERT INTO Cat_Distritos (IdDistrito, Distrito, Nombre, Tipo, Eliminado) 
            VALUES (@IdDistrito, @Distrito, @Nombre, @Tipo, 0)
          `);
        console.log(`   ✅ Created distrito: ${distrito.Nombre}`);
      } else {
        console.log(`   ⏭️  Distrito already exists: ${distrito.Nombre}`);
      }
    }
    console.log('');

    // Seed Cat_Juzgados (Judicial Courts)
    console.log('4️⃣ Seeding Cat_Juzgados (Judicial Courts)...');
    const juzgadosData = [
      { 
        IdJuzgadoPJHGO: 1, 
        Clave: 'J001', 
        Nombre: 'Juzgado Primero de Distrito', 
        TipoJuicio: 'A',
        IdDistrito: 1,
        organo_impartidor_justicia: 1,
        Correo: 'juzgado1@tribunal.gob.mx'
      },
      { 
        IdJuzgadoPJHGO: 2, 
        Clave: 'J002', 
        Nombre: 'Juzgado Segundo de Distrito', 
        TipoJuicio: 'A',
        IdDistrito: 1,
        organo_impartidor_justicia: 2,
        Correo: 'juzgado2@tribunal.gob.mx'
      },
      { 
        IdJuzgadoPJHGO: 3, 
        Clave: 'TC01', 
        Nombre: 'Tribunal Colegiado Primero', 
        TipoJuicio: 'A',
        IdDistrito: 2,
        organo_impartidor_justicia: 3,
        Correo: 'tribunal1@tribunal.gob.mx'
      }
    ];

    for (const juzgado of juzgadosData) {
      const exists = await pool.request()
        .input('organo', sql.Int, juzgado.organo_impartidor_justicia)
        .query('SELECT organo_impartidor_justicia FROM Cat_Juzgados WHERE organo_impartidor_justicia = @organo');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('IdJuzgadoPJHGO', sql.Int, juzgado.IdJuzgadoPJHGO)
          .input('Clave', sql.VarChar(4), juzgado.Clave)
          .input('Nombre', sql.VarChar(200), juzgado.Nombre)
          .input('TipoJuicio', sql.VarChar(1), juzgado.TipoJuicio)
          .input('IdDistrito', sql.Int, juzgado.IdDistrito)
          .input('organo', sql.Int, juzgado.organo_impartidor_justicia)
          .input('Correo', sql.VarChar(255), juzgado.Correo)
          .query(`
            INSERT INTO Cat_Juzgados (IdJuzgadoPJHGO, Clave, Nombre, TipoJuicio, IdDistrito, organo_impartidor_justicia, Correo, Eliminado) 
            VALUES (@IdJuzgadoPJHGO, @Clave, @Nombre, @TipoJuicio, @IdDistrito, @organo, @Correo, 0)
          `);
        console.log(`   ✅ Created juzgado: ${juzgado.Nombre}`);
      } else {
        console.log(`   ⏭️  Juzgado already exists: ${juzgado.Nombre}`);
      }
    }
    console.log('');

    // Seed Cat_TipoAsunto
    console.log('5️⃣ Seeding Cat_TipoAsunto...');
    const tiposAsunto = [
      { id: 1, nombre: 'Amparo Directo' },
      { id: 2, nombre: 'Amparo Indirecto' },
      { id: 3, nombre: 'Revisión' }
    ];

    for (const tipo of tiposAsunto) {
      const exists = await pool.request()
        .input('id', sql.Int, tipo.id)
        .query('SELECT id_tipoAsunto FROM Cat_TipoAsunto WHERE id_tipoAsunto = @id');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('id', sql.Int, tipo.id)
          .input('nombre', sql.VarChar(200), tipo.nombre)
          .query(`
            INSERT INTO Cat_TipoAsunto (id_tipoAsunto, Nombre, Eliminado) 
            VALUES (@id, @nombre, 0)
          `);
        console.log(`   ✅ Created tipo asunto: ${tipo.nombre}`);
      } else {
        console.log(`   ⏭️  Tipo asunto already exists: ${tipo.nombre}`);
      }
    }
    console.log('');

    // Seed Cat_TipoCuaderno
    console.log('6️⃣ Seeding Cat_TipoCuaderno...');
    const tiposCuaderno = [
      { id: 1, nombre: 'Principal' },
      { id: 2, nombre: 'Incidental' },
      { id: 3, nombre: 'Administrativo' }
    ];

    for (const tipo of tiposCuaderno) {
      const exists = await pool.request()
        .input('id', sql.Int, tipo.id)
        .query('SELECT id_tipoCuaderno FROM Cat_TipoCuaderno WHERE id_tipoCuaderno = @id');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('id', sql.Int, tipo.id)
          .input('nombre', sql.VarChar(200), tipo.nombre)
          .query(`
            INSERT INTO Cat_TipoCuaderno (id_tipoCuaderno, Nombre, Eliminado) 
            VALUES (@id, @nombre, 0)
          `);
        console.log(`   ✅ Created tipo cuaderno: ${tipo.nombre}`);
      } else {
        console.log(`   ⏭️  Tipo cuaderno already exists: ${tipo.nombre}`);
      }
    }
    console.log('');

    // Seed Cat_ClasificacionArchivo
    console.log('7️⃣ Seeding Cat_ClasificacionArchivo...');
    const clasificaciones = [
      { id: 1, nombre: 'Acuerdo' },
      { id: 2, nombre: 'Sentencia' },
      { id: 3, nombre: 'Auto' },
      { id: 4, nombre: 'Promoción' },
      { id: 5, nombre: 'Anexo' }
    ];

    for (const clasif of clasificaciones) {
      const exists = await pool.request()
        .input('id', sql.Int, clasif.id)
        .query('SELECT id_clasificacionArchivo FROM Cat_ClasificacionArchivo WHERE id_clasificacionArchivo = @id');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('id', sql.Int, clasif.id)
          .input('nombre', sql.VarChar(200), clasif.nombre)
          .query(`
            INSERT INTO Cat_ClasificacionArchivo (id_clasificacionArchivo, Nombre, Eliminado) 
            VALUES (@id, @nombre, 0)
          `);
        console.log(`   ✅ Created clasificación: ${clasif.nombre}`);
      } else {
        console.log(`   ⏭️  Clasificación already exists: ${clasif.nombre}`);
      }
    }
    console.log('');

    await pool.close();

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ 4 User Profiles');
    console.log('   ✅ 2 Districts');
    console.log('   ✅ 3 Judicial Courts');
    console.log('   ✅ 3 Case Types');
    console.log('   ✅ 3 Notebook Types');
    console.log('   ✅ 5 File Classifications\n');
    
    console.log('🚀 You can now start the application:');
    console.log('   Backend: npm start');
    console.log('   Frontend: cd ../frontend && npm start\n');

  } catch (error) {
    console.error('\n❌ Error during database seeding:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the seeding
seedData();

