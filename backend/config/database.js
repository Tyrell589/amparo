const config = {
  user: 'SA',
  password: 'Basketball@0615', // your SA password
  server: 'localhost',          // since SQL Server is on the same host
  port: 1433,
  database: 'PJF_Amparos',      // replace with your database
  options: {
    encrypt: false,              // true if using Azure
    trustServerCertificate: true, // required for local dev
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

module.exports = config;
