# Amparos App - Complete Setup Guide

## 🚀 Project Overview

This is a legal case management system for handling "Amparos" (constitutional protection cases) with a modern Angular frontend and Node.js backend.

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Microsoft SQL Server** (2016 or higher)
- **npm** or **yarn**
- **Angular CLI** (v19+)

## 🗄️ Database Setup

### 1. SQL Server Configuration
- **Server:** localhost
- **Database:** PJF_Amparos
- **Username:** DESKTOP-J11VKH3\Administrator
- **Password:** root

### 2. Create Required Tables

Run the following SQL scripts in your SQL Server Management Studio:

```sql
-- Create Usuarios table
CREATE TABLE Usuarios (
    IdUsuario int IDENTITY(1,1) PRIMARY KEY,
    Nombre nvarchar(100) NOT NULL,
    APaterno nvarchar(100) NOT NULL,
    AMaterno nvarchar(100) NOT NULL,
    Usuario nvarchar(50) NOT NULL UNIQUE,
    Clave nvarchar(255) NOT NULL,
    Correo nvarchar(100) NOT NULL UNIQUE,
    Telefono nvarchar(20),
    Extension nvarchar(10),
    id_perfil int NOT NULL,
    organo_impartidor_justicia int NOT NULL,
    Estado char(1) DEFAULT 'A',
    Eliminado bit DEFAULT 0
);

-- Create Cat_Juzgados table
CREATE TABLE Cat_Juzgados (
    id int IDENTITY(1,1) PRIMARY KEY,
    nombre nvarchar(100) NOT NULL,
    descripcion nvarchar(255),
    activo bit DEFAULT 1
);

-- Create Cat_Perfil table
CREATE TABLE Cat_Perfil (
    id int IDENTITY(1,1) PRIMARY KEY,
    nombre nvarchar(100) NOT NULL,
    descripcion nvarchar(255),
    activo bit DEFAULT 1
);

-- Insert sample data for Cat_Juzgados
INSERT INTO Cat_Juzgados (nombre, descripcion) VALUES
('Juzgado Primero de Distrito', 'Juzgado de primera instancia'),
('Tribunal Colegiado', 'Tribunal colegiado de circuito');

-- Insert sample data for Cat_Perfil
INSERT INTO Cat_Perfil (nombre, descripcion) VALUES
('Administrador', 'Administrador del sistema'),
('Secretario', 'Secretario judicial'),
('Oficial de Partes', 'Oficial de partes'),
('Consulta', 'Usuario de consulta');
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the `backend` directory with:

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

### 4. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:3000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

## 🔐 Authentication Features

### Login Page (`/login`)
- **Email/Username** and **Password** authentication
- Form validation with error messages
- JWT token-based authentication
- Redirect to dashboard on success

### Registration Page (`/register`)
- **Required fields:** Nombre, Apellido Paterno, Apellido Materno, Usuario, Contraseña, Correo, Órgano Impartidor de Justicia, Perfil
- **Optional fields:** Teléfono, Extensión
- Password confirmation validation
- Dropdown menus populated from database catalogs
- Real-time form validation

### Navigation
- Login page has "Regístrate aquí" link to registration
- Registration page has "Inicia sesión aquí" link to login
- Both pages redirect to dashboard after successful authentication

## 🗂️ Project Structure

```
amparosapp/
├── backend/                    # Node.js API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Data models (User, Catalog)
│   │   ├── routes/            # API routes (auth, catalogs, users)
│   │   ├── middleware/        # Authentication middleware
│   │   └── app.js             # Main application file
│   ├── config/                # Database config
│   ├── package.json
│   └── start.js               # Server startup
├── frontend/                   # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── gifs/          # Main application modules
│   │   │   │   ├── pages/     # Page components
│   │   │   │   │   ├── login-page/
│   │   │   │   │   ├── register-page/
│   │   │   │   │   └── dashboard-page/
│   │   │   │   ├── services/  # API services
│   │   │   │   └── interfaces/ # TypeScript interfaces
│   │   │   └── utils/         # Utility functions
│   │   └── environments/      # Environment configs
│   └── package.json
└── 30092025.sql               # Database schema
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Catalogs
- `GET /api/catalogs/juzgados` - Get judicial courts
- `GET /api/catalogs/perfiles` - Get user profiles

### Health Check
- `GET /api/health` - Server status

## 🛡️ Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** Server-side validation with express-validator
- **Rate Limiting:** 100 requests per 15 minutes
- **CORS Protection:** Configured for frontend origin
- **SQL Injection Protection:** Parameterized queries

## 🚦 Testing the Application

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && ng serve
   ```

2. **Access the application:**
   - Open `http://localhost:4200`
   - You should be redirected to the login page

3. **Test registration:**
   - Click "Regístrate aquí" on login page
   - Fill out the registration form
   - Submit and verify user is created

4. **Test login:**
   - Use the credentials from registration
   - Login and verify redirect to dashboard

## 🐛 Troubleshooting

### Backend Issues
- **Database Connection:** Verify SQL Server is running and credentials are correct
- **Port Conflicts:** Change PORT in .env if 3000 is occupied
- **CORS Errors:** Ensure CORS_ORIGIN matches frontend URL

### Frontend Issues
- **API Connection:** Verify backend is running on port 3000
- **Build Errors:** Run `ng build` to check for compilation errors
- **Dependencies:** Run `npm install` if modules are missing

### Database Issues
- **Table Not Found:** Run the SQL scripts provided above
- **Connection Refused:** Check SQL Server service status
- **Authentication Failed:** Verify username/password in .env

## 📝 Next Steps

1. **Add more validation rules** as needed
2. **Implement user management** features
3. **Add more catalog management** functionality
4. **Implement file upload** for documents
5. **Add email notifications**
6. **Create admin dashboard** for user management

## 🤝 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure database tables are created properly
4. Check that both servers are running on correct ports
