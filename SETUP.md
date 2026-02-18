# SETUP.md - Local Development Guide

> **Project**: Gigaspec  
> **Stack**: Node.js/Express  

---

## 📋 Prerequisites

- Node.js 
- PostgreSQL
- Redis
- Git

---

## 🚀 Installation


### macOS/Linux
```bash
# Install Node.js 18+
nvm install 18
nvm use 18
```

---

## ✅ Verification


```bash
# Verify installation
node --version
# Expected: v18.x.x

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development
npm run dev
```

Visit http://localhost:3000

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill process
lsof -i :4000  # or :3000, :8000
kill -9 <PID>
```

### Database connection failed
```bash
# Check database is running
pg_isready
```
