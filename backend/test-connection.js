const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'StrongPass123!',
  server: 'localhost',
  database: 'PJF_Amparos',
  options: {
    encrypt: true,              // required for modern SQL Server
    trustServerCertificate: true // allow self-signed certs
  }
};

console.log('Testing SQL Server connection...');
console.log('Configuration:', {
  server: config.server,
  port: config.port,
  database: config.database,
  user: config.user
});

sql.connect(config)
  .then(pool => {
    console.log('✅ Connected to SQL Server successfully!');
    
    // Test a simple query
    return pool.request().query('SELECT DB_NAME() AS CurrentDatabase, @@VERSION AS Version');
  })
  .then(result => {
    console.log('✅ Query executed successfully!');
    console.log('Current Database:', result.recordset[0].CurrentDatabase);
    console.log('SQL Server Version:', result.recordset[0].Version.substring(0, 100) + '...');
    
    sql.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
    console.error('Error number:', err.number);
    
    if (err.code === 'ELOGIN') {
      console.log('\n💡 Suggestions:');
      console.log('1. Check if SQL Server Authentication is enabled (Mixed Mode)');
      console.log('2. Verify the sa account is enabled');
      console.log('3. Verify the password is correct');
      console.log('4. Check if the database "PJF_Amparos" exists');
    } else if (err.code === 'ETIMEOUT' || err.code === 'ESOCKET') {
      console.log('\n💡 Suggestions:');
      console.log('1. Check if SQL Server is running');
      console.log('2. Check if TCP/IP is enabled in SQL Server Configuration Manager');
      console.log('3. Check if Windows Firewall is blocking port 1433');
      console.log('4. Try using 127.0.0.1 instead of localhost');
    }
    
    sql.close();
    process.exit(1);
  });

