# Amparos Backend API

Backend API for the Amparos Legal Management System.

## Features

- User authentication (login/register)
- JWT token-based authentication
- MSSQL database integration
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting and security middleware
- Catalog management (Judicial courts and user profiles)

## Prerequisites

- Node.js (v14 or higher)
- Microsoft SQL Server
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_SERVER=localhost
DB_DATABASE=PJF_Amparos
DB_USER=DESKTOP-J11VKH3\Administrator
DB_PASSWORD=root
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:4200
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Catalogs
- `GET /api/catalogs/juzgados` - Get all judicial courts
- `GET /api/catalogs/perfiles` - Get all user profiles
- `GET /api/catalogs/juzgados/:id` - Get judicial court by ID
- `GET /api/catalogs/perfiles/:id` - Get user profile by ID

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID

### Health Check
- `GET /api/health` - Server health status

## Database Schema

The API expects the following tables in your MSSQL database:

### Usuarios Table
- IdUsuario (int, primary key, auto increment)
- Nombre (nvarchar(100))
- APaterno (nvarchar(100))
- AMaterno (nvarchar(100))
- Usuario (nvarchar(50), unique)
- Clave (nvarchar(255), hashed)
- Correo (nvarchar(100), unique)
- Telefono (nvarchar(20))
- Extension (nvarchar(10))
- id_perfil (int, foreign key)
- organo_impartidor_justicia (int, foreign key)
- Estado (char(1), default 'A')
- Eliminado (bit, default 0)

### Cat_Juzgados Table
- id (int, primary key)
- nombre (nvarchar(100))
- descripcion (nvarchar(255))
- activo (bit, default 1)

### Cat_Perfil Table
- id (int, primary key)
- nombre (nvarchar(100))
- descripcion (nvarchar(255))
- activo (bit, default 1)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
```
