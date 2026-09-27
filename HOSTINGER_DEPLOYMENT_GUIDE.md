# Hostinger Deployment & MySQL Integration Guide
**OpsDesk: Multi-Department Operations & Ticketing Portal**

---

## Executive Summary

OpsDesk has been deeply audited and configured specifically for **Hostinger Hosted Environments**:
- **Hostinger Node.js Application** (Cloud Startup, Business Hosting with Node.js, VPS)
- **Hostinger Shared Web Hosting** (Apache/LiteSpeed + PHP PDO + MySQL)
- **Hostinger MySQL 8.0 Database** (phpMyAdmin & Remote MySQL)

Two pre-built, ready-to-deploy ZIP packages are generated and available in the root and in the portal (**Administration → Database Management**):
1. `hostinger-nodejs-deploy.zip` (~222 KB) — For Hostinger Node.js plans.
2. `hostinger-shared-hosting.zip` (~207 KB) — For Hostinger Shared Hosting (PHP & Apache).

---

## Why the "Unsupported Framework or Invalid Project Structure" Error Occurred & How It Is Solved

### The Root Cause
1. **GitHub Nested Subfolder:**
   When downloading a ZIP from GitHub (or zipping an outer folder), all files sit inside a wrapper folder (e.g. `opsdesk-main/...`). When uploaded to Hostinger, Hostinger looks at the archive's root for `index.html` or `package.json`. Finding only a subfolder causes Hostinger to display:
   > *"Unsupported framework or invalid project structure"*
2. **Uploading Raw Source to "Import Website" Wizard:**
   Hostinger's "Import Website" wizard is intended for WordPress or static HTML exports, not raw TypeScript development files.

### The Permanent Solution
- **Never use the automated "Import Website" wizard.**
- Always upload the pre-built flat ZIP directly via **Hostinger File Manager** into `public_html`, and extract in place.
- Our build script `npm run package:hostinger` builds packages where all required files are located directly at the root of the ZIP file.

---

## Step 1: Create Hostinger MySQL Database in hPanel

1. Log into your **Hostinger Control Panel (hPanel)**: [https://hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Go to **Databases** → **MySQL Databases**.
3. Under **Create a New MySQL Database and User**:
   - **MySQL Database Name**: e.g. `u178364571_surveillance` (or `u123456789_opsdesk`)
   - **MySQL Username**: e.g. `u178364571_surveillance`
   - **Password**: Create a strong password (e.g. `Adm!n9102` or `SecurePass2026!#`)
4. Click **Create**.
5. Note the connection details:
   - **Host**: `localhost` (when app and MySQL are on the same Hostinger server) or Hostinger server IP
   - **Database Name**: e.g. `u178364571_surveillance`
   - **Database User**: e.g. `u178364571_surveillance`
   - **Port**: `3306`

---

## Step 2: Import MySQL Schema & Seed Data via phpMyAdmin

1. In hPanel → **MySQL Databases**, find your database and click **Enter phpMyAdmin**.
2. Select your database in the left sidebar.
3. Click the **Import** tab in the top navigation bar.
4. Under **File to import**, click **Choose File**:
   - Choose `database/schema.sql` (or download it directly from the app under Administration → Database Management).
   - Click **Go** at the bottom.
5. Repeat the import for `database/seed.sql` to populate:
   - 4 Core Departments (Surveillance, Security, Admin, HVAC)
   - 5 Operational Regions (Central, HQ, Ideas Cafe, North, South)
   - 95 Real Branches & Locations across Pakistan
   - Default Administrator and Supervisor accounts
   - SLA Matrix & Audit Trail
6. Verify in phpMyAdmin that the tables (`tickets`, `locations`, `users`, `departments`, `regions`, `audit_logs`, `sla_rules`, `system_settings`) appear.

---

## Step 3: Choose Your Hostinger Deployment Path

### Path A: Hostinger Node.js Web Hosting (Cloud Startup / Business / VPS)

1. **Upload Package:**
   - In Hostinger hPanel, navigate to **Files** → **File Manager**.
   - Open the **`public_html`** directory.
   - Delete any default placeholder files (e.g. `default.php`).
   - Click **Upload** and select `hostinger-nodejs-deploy.zip`.
   - Right-click the uploaded ZIP → click **Extract** → set target to `.` (extract directly into `public_html`).
2. **Configure Environment Variables (`.env`):**
   - In File Manager inside `public_html`, copy `.env.example` to `.env`.
   - Edit `.env` and fill in your Hostinger MySQL details:
     ```env
     MYSQL_HOST="localhost"
     MYSQL_PORT="3306"
     MYSQL_USER="u178364571_surveillance"
     MYSQL_PASSWORD="YourHostingerPasswordHere"
     MYSQL_DATABASE="u178364571_surveillance"
     MYSQL_SSL="false"
     PORT=3000
     NODE_ENV=production
     ```
3. **Configure Node.js in hPanel:**
   - In hPanel, go to **Advanced** / **Website** → **Node.js**.
   - Click **Create Application** (or manage existing).
   - Set **Node.js version**: `20.x` or `22.x`
   - Set **Application Root**: `/public_html`
   - Set **Application Startup File**: `server.js`
   - Set **Application Mode**: `Production`
4. **Start the App:**
   - Click **Start / Restart Application**.
   - Open your domain URL in your browser.

---

### Path B: Hostinger Shared Web Hosting (Apache + PHP + MySQL)

*Use this path if your Hostinger plan does not have Node.js enabled.*

1. **Upload Package:**
   - In Hostinger hPanel, go to **Files** → **File Manager**.
   - Open **`public_html`**.
   - Delete any existing `default.php`.
   - Click **Upload** and upload `hostinger-shared-hosting.zip`.
   - Right-click `hostinger-shared-hosting.zip` → click **Extract** into `.` (public_html).
2. **Configure Database Connection in `.env`:**
   - Create or edit `.env` in `public_html`:
     ```env
     MYSQL_HOST=localhost
     MYSQL_PORT=3306
     MYSQL_USER=u178364571_surveillance
     MYSQL_PASSWORD=YourHostingerPasswordHere
     MYSQL_DATABASE=u178364571_surveillance
     ```
3. **Done!**
   - Apache / LiteSpeed immediately serves the React SPA via `index.html` and `.htaccess`.
   - All `/api/*` requests are processed by the native PHP PDO gateway at `api/index.php`.

---

## Step 4: Verification & Login

Open your domain in your browser. Use the default master credentials:

| Account | Email | Default Password | Role |
| :--- | :--- | :--- | :--- |
| **Surveillance Super Admin** | `admin.surveillance@ideas.com.pk` | `Password123!` | Full Administrative Control |
| **Super Admin** | `admin@ideas.com.pk` | `Password123!` | Executive Management |
| **Security Supervisor Lead** | `supervisor.security@ideas.com.pk` | `Password123!` | Dispatch & Field Supervision |
| **HVAC Field Specialist** | `hvac.tech@ideas.com.pk` | `Password123!` | Technical Field Operations |

In the portal, navigate to **Administration** → **Database Management**:
- Click **Hostinger MySQL Sync** to test the live connection.
- Download complete database JSON backups at any time.

---

## Hostinger GitHub Import & "Red Highlighted Command" Guide

If using Hostinger's **Git Deployment** feature in hPanel:
1. **Scenario 1: SSH Deploy Key (Red text starting with `ssh-ed25519` or `ssh-rsa`):**
   - Copy the red text.
   - Go to your GitHub repository → **Settings** → **Deploy keys** → **Add deploy key**.
   - Paste the key, title it "Hostinger", and click **Add key**.
2. **Scenario 2: Webhook URL (Red link `https://hpanel.hostinger.com/api/deploy/git/...`):**
   - Copy the URL.
   - Go to GitHub repo → **Settings** → **Webhooks** → **Add webhook**.
   - Paste URL into **Payload URL**, set content type to `application/json`, select **Just the push event**, and click **Add webhook**.
3. **Scenario 3: Git Remote Command (e.g. `git remote add hostinger ...`):**
   - Run this in your computer's terminal inside the project directory:
     ```bash
     git remote add hostinger <PASTE_YOUR_RED_COMMAND>
     git push hostinger main
     ```
