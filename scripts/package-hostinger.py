#!/usr/bin/env python3
"""
OpsDesk - Hostinger Deployment Package Generator
Creates clean, flat ZIP archives ready for instant extraction in Hostinger hPanel File Manager.
Eliminates the "Unsupported framework or invalid project structure" error.
"""

import os
import sys
import zipfile
import shutil

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def add_file_to_zip(zf, file_path, arcname):
    if os.path.exists(file_path):
        zf.write(file_path, arcname)
        print(f"  + {arcname}")
    else:
        print(f"  ! Missing file: {file_path}")

def add_dir_to_zip(zf, dir_path, arc_prefix=""):
    if not os.path.exists(dir_path):
        print(f"  ! Missing directory: {dir_path}")
        return
    for root, dirs, files in os.walk(dir_path):
        # Skip node_modules and .git
        if 'node_modules' in root or '.git' in root or 'downloads' in root:
            continue
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dir_path)
            arcname = os.path.join(arc_prefix, rel_path) if arc_prefix else rel_path
            zf.write(full_path, arcname)
            print(f"  + {arcname}")

def create_packages():
    print("=" * 60)
    print("OpsDesk: Packaging for Hostinger Hosted Environment")
    print("=" * 60)

    # 1. Create downloads directories
    public_dl = os.path.join(ROOT_DIR, "public", "downloads")
    dist_dl = os.path.join(ROOT_DIR, "dist", "downloads")
    os.makedirs(public_dl, exist_ok=True)
    os.makedirs(dist_dl, exist_ok=True)

    # Copy public/api/ to dist/api/ if dist exists
    dist_dir = os.path.join(ROOT_DIR, "dist")
    public_api = os.path.join(ROOT_DIR, "public", "api")
    dist_api = os.path.join(dist_dir, "api")
    if os.path.exists(public_api) and os.path.exists(dist_dir):
        os.makedirs(dist_api, exist_ok=True)
        for f in os.listdir(public_api):
            shutil.copy2(os.path.join(public_api, f), os.path.join(dist_api, f))

    # =========================================================================
    # Package 1: Hostinger Node.js Application Package (Cloud / Business / VPS)
    # =========================================================================
    nodejs_zip_path = os.path.join(ROOT_DIR, "hostinger-nodejs-deploy.zip")
    print(f"\n[1/2] Creating Node.js Package: {nodejs_zip_path}")
    with zipfile.ZipFile(nodejs_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Crucial root files
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "server.js"), "server.js")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "package.json"), "package.json")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, ".env.example"), ".env.example")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "public", ".htaccess"), ".htaccess")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "HOSTINGER_DEPLOYMENT_GUIDE.md"), "HOSTINGER_DEPLOYMENT_GUIDE.md")
        # Include database SQL scripts
        add_dir_to_zip(zf, os.path.join(ROOT_DIR, "database"), "database")
        # Include compiled frontend in dist/
        add_dir_to_zip(zf, os.path.join(ROOT_DIR, "dist"), "dist")

    # =========================================================================
    # Package 2: Hostinger Shared Hosting Package (Apache + PHP + MySQL)
    # =========================================================================
    shared_zip_path = os.path.join(ROOT_DIR, "hostinger-shared-hosting.zip")
    print(f"\n[2/2] Creating Shared Hosting Package: {shared_zip_path}")
    with zipfile.ZipFile(shared_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Static files directly at archive root
        add_file_to_zip(zf, os.path.join(dist_dir, "index.html"), "index.html")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "public", ".htaccess"), ".htaccess")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, ".env.example"), ".env.example")
        add_file_to_zip(zf, os.path.join(ROOT_DIR, "HOSTINGER_DEPLOYMENT_GUIDE.md"), "HOSTINGER_DEPLOYMENT_GUIDE.md")
        # Assets folder
        add_dir_to_zip(zf, os.path.join(dist_dir, "assets"), "assets")
        # PHP API gateway
        add_dir_to_zip(zf, os.path.join(ROOT_DIR, "public", "api"), "api")
        # Database SQL scripts
        add_dir_to_zip(zf, os.path.join(ROOT_DIR, "database"), "database")

    # Copy archives into downloads folders for in-app download
    shutil.copy2(nodejs_zip_path, os.path.join(public_dl, "hostinger-nodejs-deploy.zip"))
    shutil.copy2(shared_zip_path, os.path.join(public_dl, "hostinger-shared-hosting.zip"))
    shutil.copy2(nodejs_zip_path, os.path.join(dist_dl, "hostinger-nodejs-deploy.zip"))
    shutil.copy2(shared_zip_path, os.path.join(dist_dl, "hostinger-shared-hosting.zip"))

    print("\n" + "=" * 60)
    print("SUCCESS: Hostinger Deployment Packages Created!")
    print(f"1. {nodejs_zip_path} ({os.path.getsize(nodejs_zip_path) // 1024} KB)")
    print(f"2. {shared_zip_path} ({os.path.getsize(shared_zip_path) // 1024} KB)")
    print("=" * 60)

if __name__ == '__main__':
    create_packages()
