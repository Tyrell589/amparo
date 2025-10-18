const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Database configuration
const config = {
  user: 'SA',
  password: 'Basketball@0615',
  server: 'localhost',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 60000,
    requestTimeout: 60000
  }
};

async function setupDatabase() {
  console.log('🔧 Starting database setup...\n');
  
  try {
    // Step 1: Connect to master database to check/create PJF_Amparos
    console.log('1️⃣ Connecting to SQL Server...');
    const masterConfig = { ...config, database: 'master' };
    const masterPool = await sql.connect(masterConfig);
    console.log('✅ Connected to SQL Server\n');

    // Step 2: Check if database exists
    console.log('2️⃣ Checking if PJF_Amparos database exists...');
    const dbCheckResult = await masterPool.request()
      .query(`SELECT database_id FROM sys.databases WHERE name = 'PJF_Amparos'`);

    if (dbCheckResult.recordset.length === 0) {
      console.log('📦 Database does not exist. Creating PJF_Amparos...');
      await masterPool.request().query('CREATE DATABASE PJF_Amparos');
      console.log('✅ Database PJF_Amparos created successfully\n');
    } else {
      console.log('✅ Database PJF_Amparos already exists\n');
    }

    await masterPool.close();

    // Step 3: Connect to PJF_Amparos database
    console.log('3️⃣ Connecting to PJF_Amparos database...');
    const dbConfig = { ...config, database: 'PJF_Amparos' };
    const pool = await sql.connect(dbConfig);
    console.log('✅ Connected to PJF_Amparos\n');

    // Step 4: Read SQL file
    console.log('4️⃣ Reading SQL schema file...');
    const sqlFilePath = path.join(__dirname, '..', '30092025_utf8.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at: ${sqlFilePath}`);
    }

    let sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(`✅ SQL file loaded (${sqlScript.length} characters)\n`);

    // Step 5: Split script into batches (GO statement separates batches)
    console.log('5️⃣ Executing SQL script...');
    console.log('⏳ This may take a few moments...\n');

    // Remove the USE [PJF_Amparos] line since we're already connected to it
    sqlScript = sqlScript.replace(/USE \[PJF_Amparos\]/gi, '');
    
    // Remove any BOM or special characters
    sqlScript = sqlScript.replace(/^\uFEFF/, '');

    // Split by GO statements - handle different line endings
    const batches = sqlScript
      .split(/\r?\nGO\r?\n/gi)
      .map(batch => batch.trim())
      .filter(batch => batch.length > 0 && !batch.match(/^\/\*+.*\*+\/$/));

    console.log(`📋 Found ${batches.length} SQL batches to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Skip empty batches or comments
      if (!batch || batch.startsWith('/*') || batch.startsWith('--')) {
        continue;
      }

      try {
        await pool.request().query(batch);
        successCount++;
        
        // Show progress every 10 batches
        if ((i + 1) % 10 === 0) {
          console.log(`   Executed ${i + 1}/${batches.length} batches...`);
        }
      } catch (error) {
        errorCount++;
        // Some errors are expected (like user already exists, etc.)
        if (error.message.includes('already exists') || 
            error.message.includes('Cannot drop') ||
            error.message.includes('There is already an object')) {
          console.log(`   ⚠️  Batch ${i + 1}: ${error.message.substring(0, 80)}...`);
        } else {
          console.error(`   ❌ Error in batch ${i + 1}: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Script execution completed!`);
    console.log(`   ✔️  Successful: ${successCount} batches`);
    console.log(`   ⚠️  Skipped/Errors: ${errorCount} batches\n`);

    // Step 6: Verify tables were created
    console.log('6️⃣ Verifying tables...');
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    console.log(`\n📊 Tables created in PJF_Amparos database:\n`);
    tablesResult.recordset.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.TABLE_NAME}`);
    });

    console.log(`\n✅ Total tables: ${tablesResult.recordset.length}\n`);

    // Step 7: Check stored procedures
    const procsResult = await pool.request().query(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_TYPE = 'PROCEDURE'
      ORDER BY ROUTINE_NAME
    `);

    if (procsResult.recordset.length > 0) {
      console.log(`📋 Stored procedures created:\n`);
      procsResult.recordset.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.ROUTINE_NAME}`);
      });
      console.log(`\n✅ Total procedures: ${procsResult.recordset.length}\n`);
    }

    await pool.close();

    console.log('🎉 Database setup completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Start the frontend: cd ../frontend && npm start');
    console.log('   3. Access the app at: http://localhost:4200\n');

  } catch (error) {
    console.error('\n❌ Error during database setup:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();

