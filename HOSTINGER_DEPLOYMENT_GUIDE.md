# Hostinger MySQL Database & Application Deployment Guide
**OpsDesk: Multi-Department Operations & Ticketing Portal (Surveillance, Security, Admin, HVAC)**

---

## Overview

OpsDesk is engineered to run seamlessly on **Hostinger Hosting** (Business Web Hosting, Cloud Startup, or VPS) with **Hostinger MySQL** as its primary persistent database.

This guide provides end-to-end instructions for:
1. Creating your MySQL database on Hostinger hPanel.
2. Importing the database schema (`database/schema.sql`) and seed data (`database/seed.sql`).
3. Configuring remote or local MySQL connection settings.
4. Deploying the Node.js application to Hostinger.
5. Verifying live database synchronization.

---

## Step 1: Create MySQL Database in Hostinger hPanel

1. Log in to your **Hostinger Control Panel (hPanel)**: [https://hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Go to **Databases** → **MySQL Databases**.
3. Under **Create a New MySQL Database and User**, enter:
   - **MySQL Database Name**: e.g. `u123456789_opsdesk`
   - **MySQL Username**: e.g. `u123456789_admin`
   - **Password**: Generate a strong password (e.g. `SecurePass2026!#`)
4. Click **Create**.
5. Note the values provided:
   - **Host**: Usually `localhost` when the app runs on the same server, or `srvXXXX.hstgr.io` / IP address for remote access.
   - **Database Name**: `u123456789_opsdesk`
   - **Database User**: `u123456789_admin`
   - **Port**: `3306`

---

## Step 2: Import Database Schema & Seed Data

1. In hPanel, under **MySQL Databases**, locate your database and click **Enter phpMyAdmin**.
2. Select your newly created database in the left sidebar.
3. Click the **Import** tab in the top navigation bar.
4. Under **File to import**, click **Choose File** and select `database/schema.sql` from this project.
5. Click **Go** at the bottom to execute the DDL script.
6. Once completed, repeat the import for `database/seed.sql` to populate initial master data (95 branches, 4 departments, SLA rules, and default administrative users).

*Alternatively, via SSH/CLI:*
```bash
mysql -u u123456789_admin -p u123456789_opsdesk < database/schema.sql
mysql -u u123456789_admin -p u123456789_opsdesk < database/seed.sql
```

---

## Step 3: Remote MySQL Access (If connecting from outside Hostinger)

If running the application server outside Hostinger while utilizing Hostinger MySQL:
1. In hPanel, navigate to **Databases** → **Remote MySQL**.
2. Under **Add IP Address**:
   - Enter your server IP or enter `%` (wildcard) to allow connections from any authorized IP with valid credentials.
3. Select your database: `u123456789_opsdesk`.
4. Click **Create**.

---

## Step 4: Configure Application Environment (.env)

Create or update your `.env` file in the project root:

```env
# Hostinger MySQL Connection
MYSQL_HOST=localhost            # Use 'localhost' on Hostinger server or Hostinger server IP
MYSQL_PORT=3306
MYSQL_USER=u123456789_admin
MYSQL_PASSWORD=SecurePass2026!#
MYSQL_DATABASE=u123456789_opsdesk
MYSQL_SSL=false

# App Settings
PORT=3000
NODE_ENV=production
JWT_SECRET=your-enterprise-jwt-token-signing-key
```

You can also test and update this directly inside the running portal in **Administration** → **Database & Backup** → **Hostinger MySQL Sync**!

---

## Step 5: Deploy to Hostinger

### Option A: Hostinger Node.js Application (Cloud / Business Hosting)
1. In hPanel, search for **Node.js** under **Advanced** or **Website**.
2. Click **Create Application**.
3. Set:
   - **Node.js version**: 20.x or 22.x
   - **Application root**: `public_html` or subfolder
   - **Application startup file**: `dist-server/server.js` or `server.ts`
4. Upload project files via Git or FTP.
5. In the terminal / SSH console on Hostinger:
   ```bash
   npm install --production=false
   npm run build
   ```
6. Start or restart the Node.js application in hPanel.

### Option B: Hostinger VPS (Ubuntu / Debian with PM2 & NGINX)
1. Connect to VPS via SSH:
   ```bash
   ssh root@your-hostinger-vps-ip
   ```
2. Clone repository & install dependencies:
   ```bash
   git clone <your-repo-url> /var/www/opsdesk
   cd /var/www/opsdesk
   npm install
   npm run build
   ```
3. Run with PM2 Process Manager:
   ```bash
   npm install -g pm2
   pm2 start server.ts --name "opsdesk" --interpreter tsx
   pm2 save
   pm2 startup
   ```
4. Configure Nginx reverse proxy to port 3000 with Let's Encrypt SSL:
   ```nginx
   server {
       server_name ops.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Step 6: Hostinger GitHub Import & Red-Highlighted Command Guide

When importing this repository into Hostinger via **hPanel** → **Git** or **Deploy from GitHub**, follow these exact steps:

### Where to Use the Red-Highlighted Command
Hostinger displays a red-highlighted command or URL in one of three common scenarios:

1. **Scenario A: If Hostinger gave you an SSH Deploy Key (Red text starting with `ssh-ed25519` or `ssh-rsa`):**
   - **Where to paste:** Go to your **GitHub Repository** → **Settings** (tab at top of GitHub) → **Deploy keys** (left sidebar) → Click **Add deploy key** → Paste the key, check *Allow write access* if prompted, and click **Add key**.

2. **Scenario B: If Hostinger gave you a Webhook URL (Red highlighted link like `https://hpanel.hostinger.com/api/deploy/git/...`):**
   - **Where to use:** Go to your **GitHub Repository** → **Settings** → **Webhooks** → Click **Add webhook** → In **Payload URL**, paste the red highlighted URL → Set *Content type* to `application/json` → Under *Which events would you like to trigger this webhook?*, select **Just the push event** → Click **Add webhook**.

3. **Scenario C: If Hostinger gave you a Git Remote Command (e.g. `git remote add hostinger ssh://...` or `git push hostinger main`):**
   - **Where to run:** Run this command on your **local computer terminal** inside this repository's folder, OR in Hostinger's **SSH Console** (`hPanel -> Advanced -> SSH Access`).
   ```bash
   # 1. Add Hostinger remote (paste the exact red command from Hostinger)
   git remote add hostinger <PASTE_YOUR_RED_COMMAND_HERE>

   # 2. Push to Hostinger
   git push -u hostinger main
   ```

### How to Fix Common Hostinger GitHub Import Errors

#### Error 1: "The directory is not empty" / "Destination path already exists"
- **Cause:** Hostinger's `public_html` directory has default files (such as `default.php` or `index.html`).
- **Fix:**
  1. In hPanel, go to **Files** → **File Manager**.
  2. Open `public_html`.
  3. Delete the default placeholder files (e.g., `default.php`).
  4. Return to **Git** in hPanel and re-run the repository clone/deployment.

#### Error 2: "Hostinger Node.js Application Startup File Not Found"
- **Cause:** Hostinger needs to know which file starts the server.
- **Fix:**
  - In hPanel **Node.js**:
    - Set **Application Root**: `/public_html`
    - Set **Application Startup File**: `server.js` (generated by `npm run build`) or `server.ts`
    - In the terminal: run `npm install && npm run build`
    - Click **Start / Restart** in Hostinger Node.js manager.

---

## Step 7: Default Credentials for First Login

| User Role | Email | Password |
| :--- | :--- | :--- |
| **Surveillance Super Admin** | `admin.surveillance@ideas.com.pk` | `Password123!` |
| **Super Admin** | `admin@ideas.com.pk` | `Password123!` |
| **Security Supervisor Lead** | `supervisor.security@ideas.com.pk` | `Password123!` |
| **HVAC Field Specialist** | `hvac.tech@ideas.com.pk` | `Password123!` |

*(Admins can change passwords, add technicians, configure SLA policies, and manage locations in the **Administration** tab.)*
