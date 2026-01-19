# GitHub Actions - Email Notification on Commit

Este workflow automático envia um email aos clientes sempre que há um commit nas branches `main` ou `develop`.

## Setup

### 1. Configure os Secrets no GitHub

Acesse: **Settings → Secrets and variables → Actions → New repository secret**

Crie dois secrets:

| Nome | Valor |
|------|-------|
| `EMAIL_SENDER` | Seu email (ex: seu-email@gmail.com) |
| `EMAIL_PASSWORD` | Sua senha ou App Password do Gmail |

### 2. Obter App Password do Gmail

Se usar autenticação de dois fatores no Gmail (recomendado):

1. Acesse: https://myaccount.google.com/security
2. Em "Signing in to Google" selecione "App passwords"
3. Crie uma senha do app para "Mail" e copie os 16 caracteres
4. Use essa senha como `EMAIL_PASSWORD` no secret

### 3. Testar

Faça um commit e push para `main` ou `develop`:

```bash
git add .
git commit -m "test: testar workflow de email"
git push origin main
```

Verifique a execução em: **GitHub → Actions → Send Email on Commit**

## Customizações

### Alterar destinatários

No arquivo `.github/workflows/send-email-on-commit.yml`, linha `to:`:

```yaml
to: email1@example.com,email2@example.com
```

### Disparar em outras branches

Modifique a seção `on.push.branches`:

```yaml
branches:
  - main
  - develop
  - production
```

### Adicionar mais informações no email

Edite a seção `body:` do step "Send email notification" para incluir arquivos modificados, etc.
