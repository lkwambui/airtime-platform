# Airtime Platform

Admin airtime sales platform with M-Pesa integration.

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Admin Panel
```bash
cd frontend/admin
npm install
npm run dev
```

### Client App
```bash
cd frontend/client
npm install
npm run dev
```

## Environment Variables

Backend requires:
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT tokens

## Deployment

Deploy to Render using the included `render.yaml` configuration.

### Database Setup
1. Create a MySQL database on Render or external provider
2. Run migrations from `backend/src/database/migrations/`
3. Run seeds from `backend/src/database/seeds/`

### Admin Credentials
Default admin login:
- Username: `admin`
- Password: `admin123`

**Change these credentials after first login!**
