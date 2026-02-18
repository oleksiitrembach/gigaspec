# ENVIRONMENT.md - Secrets & Configuration

> **Project**: Gigaspec  

---

## 🔑 Required Variables

| Variable | Purpose | How to Obtain |
|----------|---------|---------------|
| `SECRET_KEY_BASE` | Session encryption | `openssl rand -hex 48` |
| `DATABASE_URL` | Database connection | From Railway dashboard |
| `REDIS_URL` | Cache connection | From Railway dashboard |


---

## 🖥️ Local Development

```bash
# Copy example environment
cp .env.example .env

# Edit with your values
nano .env
```

---

## 🚀 Production

Railway handles secrets securely. Never commit `.env` to git.

---

## ⚠️ Security

- NEVER commit secrets to git
- Rotate API keys every 90 days
- Use different keys for each environment
