import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "booksstore.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7200';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/book': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/order': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/Order': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/User': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/auth/login': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/Book': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/Order': {
                target,
                changeOrigin: true,
                secure: false
            },
            '/images': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/auth/register': {
                target,
                changeOrigin: true,
                secure: false
            },
        },
        port: parseInt(env.DEV_SERVER_PORT || '59211'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
