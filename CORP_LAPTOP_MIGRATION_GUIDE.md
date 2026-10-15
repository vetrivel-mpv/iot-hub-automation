# 🚀 Corporate Laptop Migration & Setup Guide

This guide provides step-by-step instructions for transferring and running the **IoT Hub Enterprise Automation & Quality Intelligence Platform** on your corporate laptop.

---

## 📦 1. Pre-Packaged Clean Bundle
A clean, sanitized migration bundle has been prepared for you:
- **Location**: `corp-migration/iot-hub-automation-clean.zip`
- **Bundle Size**: **~1.5 MB** (compressed down from 13.3 GB by excluding local videos, historical traces, git packfiles, and node_modules).
- **Sanitization**: All plaintext corporate passwords have been wiped from config files to protect against DLP / secret scanning (GitGuardian / Symantec).

---

## 🚚 2. How to Transfer to Your Corporate Laptop

Choose whichever method your company policy allows:
- **Option A (AirDrop / USB / Local Transfer)**: Transfer `corp-migration/iot-hub-automation-clean.zip` directly to your corp laptop.
- **Option B (Corporate Cloud / Drive)**: Upload `iot-hub-automation-clean.zip` to your corporate OneDrive, Google Drive, Box, or SharePoint and download it on your corp laptop.
- **Option C (Corporate Git Repository)**: 
  If you have an enterprise GitLab / GitHub / Bitbucket instance, simply push the repository:
  ```bash
  # On this machine:
  git remote add corp <YOUR_CORP_GIT_URL>
  git push corp master
  ```

---

## 💻 3. First-Time Setup on Corporate Laptop

Once you have extracted the project or cloned the repository on your corporate laptop:

### Step 3.1: Open Terminal in the Project Directory
```bash
cd /path/to/iot-hub-automation
```

### Step 3.2: Configure Environment Credentials (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your authorized corporate credentials for the target environment:
```env
# Target Environment URL
WDH_BASE_URL=https://wdh-sitstg2.nokiawing.com

# Your Corporate Test Credentials
WDH_USERNAME=your_corporate_username
WDH_PASSWORD=YourSecurePassword123!

# Environment Level: DEV / SIT / PROD
WDH_ENV=SIT

# Execution Settings
HEADLESS=true
DEFAULT_TIMEOUT=30000
WORKERS=4
```
> [!NOTE]
> `.env` is explicitly ignored by `.gitignore` and will never be committed to git.

### Step 3.3: Install Node.js Dependencies
```bash
npm install
```

### Step 3.4: Install Playwright Browsers (Chromium)
```bash
npx playwright install chromium
```
*(If your corporate proxy requires custom certificates or environment variables, set `HTTPS_PROXY` prior to running the above command).*

### Step 3.5: (Optional) Python Telecom Engines Setup
If you plan to execute the telecom CDR rating and bulk eSIM batch generation engines:
```bash
python3 -m pip install -r requirements.txt || true
```

---

## ⚡ 4. Launching the Enterprise Dashboard

Start the application server:
```bash
npm start
```
The executive platform will launch on:
👉 **`http://localhost:3030`**

---

## 🎯 5. Multi-Stage Quality Gate Workflow

The dashboard features real-time, synchronized promotion stage tracking:
1. **Stage 1 (Dev → QA)**: Fast Smoke & Keycloak SSO verification on Azure FrontDoor / Dev clusters.
2. **Stage 2 (QA → Stag)**: Full Accounts, Subscriptions, SIMs, and Provisioning suites on SIT STG-2.
3. **Stage 3 (Stag → Prod)**: Production Release Sign-off with strict read-only safety guardrails (`AUDIT PENDING` until triggered).

---

## 🛡️ 6. Built-in Enterprise Safety Guardrails
- **Production Safety Gate**: Prevents accidental mutations, writes, or deletions on STG-2 and PROD clusters.
- **Zero Mock Fallbacks**: All metrics, RCA defect breakdowns, and SLA progress bars are driven by actual test execution history.
