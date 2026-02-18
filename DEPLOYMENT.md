# DEPLOYMENT.md - Production Deployment

> **Project**: MyProject  
> **Platform**: Railway  

---

## 🚀 Deployment


```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## ⚙️ Configuration


```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

---

## 🔐 Environment Variables

```bash
# Set secrets
railway variables set SECRET_KEY_BASE="$(openssl rand -hex 48)"
railway variables set DATABASE_URL="[your-db-url]"
```

---

## ↩️ Rollback

```bash
# Rollback to previous version
railway rollback
```

---

## 💰 Cost Estimates

| Resource | Monthly Cost |
|----------|--------------|
| Compute | ~$20-50 |
| Database | ~$15-30 |
| **Total** | **~$35-80** |
