# SQL Server Setup Guide for AmparosApp

## Current Status
✅ Configuration files updated correctly  
✅ SQL Server is running  
✅ Port 1433 is listening  
❌ Connection is being refused (`ECONNRESET`)

## Root Cause
The error `ECONNRESET` means SQL Server is **actively refusing** the connection. This happens when:
1. SQL Server Authentication (Mixed Mode) is **NOT enabled**, OR
2. The `sa` account is **disabled** or has an incorrect password

## Solution: Enable SQL Server Authentication

### Step 1: Enable Mixed Mode Authentication

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Right-click the **server name** (at the top) → **Properties**
4. Click **Security** on the left panel
5. Under **Server authentication**, select:
   - ✅ **SQL Server and Windows Authentication mode** (Mixed Mode)
6. Click **OK**
7. **You will see a message** saying you need to restart SQL Server

### Step 2: Enable SA Account and Set Password

In SSMS, run this SQL:

```sql
USE [master]
GO

-- Enable the sa login
ALTER LOGIN [sa] ENABLE
GO

-- Set the sa password
ALTER LOGIN [sa] WITH PASSWORD = 'StrongPass123!', CHECK_POLICY = OFF
GO

-- Verify the sa account is enabled
SELECT 
    name, 
    type_desc, 
    is_disabled,
    create_date,
    modify_date
FROM sys.sql_logins 
WHERE name = 'sa'
GO

-- Result should show: is_disabled = 0 (meaning enabled)
```

### Step 3: Restart SQL Server

**Option A: Using Services**
1. Press `Win + R`, type `services.msc`, press Enter
2. Find **SQL Server (MSSQLSERVER)**
3. Right-click → **Restart**

**Option B: Using PowerShell (Run as Administrator)**
```powershell
Restart-Service MSSQLSERVER
```

### Step 4: Verify TCP/IP is Enabled

1. Press `Win + R`
2. Type `SQLServerManager15.msc` (SQL Server 2019) or `SQLServerManager16.msc` (SQL Server 2022)
3. Press Enter
4. Expand **SQL Server Network Configuration**
5. Click **Protocols for MSSQLSERVER**
6. **TCP/IP** should show as **Enabled**
7. If not, right-click **TCP/IP** → **Enable**
8. Right-click **TCP/IP** → **Properties**
9. Go to **IP Addresses** tab
10. Scroll to **IPAll** section:
    - **TCP Dynamic Ports**: Leave **BLANK**
    - **TCP Port**: Set to **1433**
11. Click **OK**
12. **Restart SQL Server again**

### Step 5: Test Connection

After completing all steps above:

```bash
cd backend
node test-connection.js
```

**Expected Output:**
```
✅ Connected to SQL Server successfully!
✅ Query executed successfully!
Current Database: PJF_Amparos
```

### Step 6: Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server running on port 3000
📊 Environment: development
🔗 Health check: http://localhost:3000/api/health
```

### Step 7: Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

Then open: http://localhost:4200

## Current Configuration

**backend/config/database.js:**
```javascript
const config = {
  user: 'sa',
  password: 'StrongPass123!',
  server: 'localhost',
  database: 'PJF_Amparos',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};
```

**backend/.env:**
```env
DB_USER=sa
DB_PASSWORD=StrongPass123!
DB_SERVER=localhost
DB_DATABASE=PJF_Amparos

JWT_SECRET=your-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development

CORS_ORIGIN=http://localhost:4200
```

## Troubleshooting

### If you still get ECONNRESET:
- The `sa` account is disabled
- Mixed Mode is not enabled
- SQL Server was not restarted after changes

### If you get "Login failed for user 'sa'":
- Password is incorrect
- Run the ALTER LOGIN command again

### If you get ETIMEOUT:
- TCP/IP is not enabled
- Check SQL Server Configuration Manager

### If connection works but backend crashes:
- Check if database `PJF_Amparos` exists
- Run the `30092025.sql` script to create tables

## Quick Verification Checklist

- [ ] Mixed Mode Authentication enabled
- [ ] SA account enabled
- [ ] SA password set to `StrongPass123!`
- [ ] SQL Server restarted after auth changes
- [ ] TCP/IP enabled in Configuration Manager
- [ ] Port 1433 set in IPAll section
- [ ] SQL Server restarted after TCP/IP changes
- [ ] `test-connection.js` runs successfully
- [ ] Backend starts without errors
- [ ] Frontend can access API endpoints

## Next Steps After Connection Works

1. Login with super admin: `admin@admin.com` / `admin123`
2. Navigate to **Juzgados** or **Perfiles** pages
3. Test CRUD operations
4. Create/Edit/Delete catalog entries

## Need More Help?

If you're still having issues after following all steps:

1. Check SQL Server Error Log:
   - Location: `C:\Program Files\Microsoft SQL Server\MSSQL[VERSION]\MSSQL\Log\ERRORLOG`

2. Enable detailed logging in Node.js by setting:
   ```env
   DEBUG=mssql,tedious*
   ```

3. Test connection from SSMS using SQL Authentication:
   - Server: `localhost`
   - Authentication: **SQL Server Authentication**
   - Login: `sa`
   - Password: `StrongPass123!`
