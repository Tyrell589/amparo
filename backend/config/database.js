const config = {
  user: 'sa',
  password: 'StrongPass123!',
  server: '127.0.0.1',      // Force IPv4
  port: 1433,
  database: 'PJF_Amparos',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

module.exports = config;
