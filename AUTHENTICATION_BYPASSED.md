# Authentication Bypass - Development Mode

## ⚠️ WARNING
**All authentication middleware has been disabled for development purposes.**
**Do NOT deploy this configuration to production!**

## Changes Made

### Backend Routes - Authentication Removed

All routes now bypass token validation and are publicly accessible:

#### 1. **Auth Routes** (`/backend/src/routes/auth.js`)
- ✅ `GET /api/auth/me` - Now returns null if token invalid (no error)

#### 2. **Users Routes** (`/backend/src/routes/users.js`)
- ✅ `GET /api/users` - No authentication required
- ✅ `GET /api/users/:id` - No authentication required
- ✅ `POST /api/users` - No authentication required
- ✅ `PUT /api/users/:id` - No authentication required
- ✅ `DELETE /api/users/:id` - No authentication required
- ✅ `PATCH /api/users/:id/toggle-status` - No authentication required

#### 3. **Juzgados Routes** (`/backend/src/routes/juzgados.js`)
- ✅ `GET /api/juzgados` - No authentication required
- ✅ `GET /api/juzgados/:id` - No authentication required
- ✅ `POST /api/juzgados` - No authentication required
- ✅ `PUT /api/juzgados/:id` - No authentication required
- ✅ `DELETE /api/juzgados/:id` - No authentication required

#### 4. **Perfiles Routes** (`/backend/src/routes/perfiles.js`)
- ✅ `GET /api/perfiles` - No authentication required
- ✅ `GET /api/perfiles/:id` - No authentication required
- ✅ `POST /api/perfiles` - No authentication required
- ✅ `PUT /api/perfiles/:id` - No authentication required
- ✅ `DELETE /api/perfiles/:id` - No authentication required

#### 5. **Catalogs Routes** (`/backend/src/routes/catalogs.js`)
- ✅ Already public (no changes needed)

## Impact

### What Works Now:
- ✅ All API endpoints accessible without login
- ✅ Frontend can make requests without valid tokens
- ✅ No 401/403 authentication errors
- ✅ Development and testing is easier

### Security Implications:
- ⚠️ Anyone can access all endpoints
- ⚠️ Anyone can create, edit, delete users
- ⚠️ Anyone can modify catalogs
- ⚠️ No role-based access control
- ⚠️ No protection against unauthorized access

## How to Re-enable Authentication

To restore authentication, you need to add back the middleware:

### For Admin Routes:
```javascript
const adminAuth = require('../middleware/adminAuth');

router.get('/', adminAuth, async (req, res) => {
  // route handler
});
```

### For Authenticated Routes:
```javascript
const { authenticateToken, requireRole } = require('../middleware/auth');

// For any authenticated user
router.get('/', authenticateToken, async (req, res) => {
  // route handler
});

// For admin only
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  // route handler
});
```

## Frontend

No changes needed to frontend services - they continue to send tokens if available in localStorage.

## Date Modified
$(date)

---

**Remember to re-enable authentication before deploying to production!**
