require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Auth, tokenUtils } = require('msmc');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

let mainWindow;
let windowedFullscreen = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1150,
        height: 750,
        minWidth: 1000,
        minHeight: 700,
        autoHideMenuBar: true,
        frame: false,
        icon: path.join(__dirname, 'assets/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            backgroundThrottling: false
        }
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`localStorage.getItem('minecore_windowed_fullscreen')`)
            .then(result => {
                windowedFullscreen = result === 'true';
                if (windowedFullscreen) {
                    mainWindow.maximize();
                }
            }).catch(err => console.log("Pencere modu okuma hatası:", err));
    });

    mainWindow.on('maximize', () => mainWindow.webContents.send('win-maximized', true));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('win-maximized', false));
    mainWindow.webContents.on('did-finish-load', () => mainWindow.webContents.send('win-maximized', mainWindow.isMaximized()));

    mainWindow.loadFile('index.html');
    remoteMain.enable(mainWindow.webContents);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('win-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.on('win-toggle-maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize();
});
ipcMain.on('win-close', () => { if (mainWindow) mainWindow.close(); });

ipcMain.on('hide-window', () => {
    if (mainWindow) mainWindow.hide();
});

ipcMain.on('show-window', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        if (windowedFullscreen && !mainWindow.isMaximized()) mainWindow.maximize();
        mainWindow.show();
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(true);
        setTimeout(() => { if(mainWindow) mainWindow.setAlwaysOnTop(false); }, 500);
    }
});

ipcMain.on('toggle-windowed-fullscreen', (event, enabled) => {
    windowedFullscreen = !!enabled;
    if (!mainWindow) return;
    if (enabled) {
        mainWindow.maximize();
    } else {
        mainWindow.unmaximize();
    }
});


function loadElybyConfig() {
    const fs = require('fs');
    const path = require('path');

    const packagedConfigPath = path.join(__dirname, 'config.generated.json');
    if (fs.existsSync(packagedConfigPath)) {
        try {
            const cfg = JSON.parse(fs.readFileSync(packagedConfigPath, 'utf-8'));
            return {
                id: cfg.ELYBY_CLIENT_ID || '',
                secret: cfg.ELYBY_CLIENT_SECRET || '',
                port: parseInt(cfg.ELYBY_REDIRECT_PORT) || 23847
            };
        } catch (e) {
            console.error('config.generated.json okunamadı:', e.message);
        }
    }

    return {
        id: process.env.ELYBY_CLIENT_ID || '',
        secret: process.env.ELYBY_CLIENT_SECRET || '',
        port: parseInt(process.env.ELYBY_REDIRECT_PORT) || 23847
    };
}

const _elybyCfg = loadElybyConfig();
const ELYBY_CLIENT_ID = _elybyCfg.id;
const ELYBY_CLIENT_SECRET = _elybyCfg.secret;
const ELYBY_REDIRECT_PORT = _elybyCfg.port;
const ELYBY_REDIRECT_URI = `http://localhost:${ELYBY_REDIRECT_PORT}/callback`;

if (!ELYBY_CLIENT_ID || !ELYBY_CLIENT_SECRET) {
    console.warn('UYARI: Ely.by yapılandırması bulunamadı (config.generated.json veya .env). Ely.by girişi çalışmayacak.');
}

ipcMain.handle('elyby-login', async () => {
    if (!ELYBY_CLIENT_ID || !ELYBY_CLIENT_SECRET) {
        return { ok: false, error: 'Ely.by yapılandırması eksik. .env dosyasında ELYBY_CLIENT_ID ve ELYBY_CLIENT_SECRET tanımlanmalı.' };
    }
    try {
        const { shell, net } = require('electron');
        const http = require('http');
        const crypto = require('crypto');

        const state = crypto.randomBytes(12).toString('hex');
        const authUrl = `https://account.ely.by/oauth2/v1?client_id=${ELYBY_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(ELYBY_REDIRECT_URI)}` +
            `&response_type=code&scope=account_info%20minecraft_server_session&state=${state}`;

        const code = await new Promise((resolve, reject) => {
            let settled = false;
            const server = http.createServer((req, res) => {
                const url = new URL(req.url, ELYBY_REDIRECT_URI);
                const returnedState = url.searchParams.get('state');
                const returnedCode = url.searchParams.get('code');
                const error = url.searchParams.get('error');

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                if (error) {
                    res.end(`<html><body style="font-family:sans-serif;background:#0d1117;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>Giriş iptal edildi, bu sekmeyi kapatabilirsiniz.</h2></body></html>`);
                    if (!settled) { settled = true; server.close(); reject(new Error(error)); }
                    return;
                }
                if (returnedState !== state) {
                    res.end(`<html><body style="font-family:sans-serif;background:#0d1117;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>Güvenlik doğrulaması başarısız.</h2></body></html>`);
                    if (!settled) { settled = true; server.close(); reject(new Error('State mismatch')); }
                    return;
                }
                res.end(`<html><body style="font-family:sans-serif;background:#0d1117;color:#0f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>✓ Giriş başarılı! Bu sekmeyi kapatıp launcher'a dönebilirsiniz.</h2></body></html>`);
                if (!settled) { settled = true; server.close(); resolve(returnedCode); }
            });
            server.listen(ELYBY_REDIRECT_PORT, '127.0.0.1');
            server.on('error', (err) => {
                if (!settled) { settled = true; reject(err); }
            });

            shell.openExternal(authUrl);

            setTimeout(() => {
                if (!settled) {
                    settled = true;
                    try { server.close(); } catch(_) {}
                    reject(new Error('Zaman aşımı — giriş tamamlanmadı.'));
                }
            }, 180000);
        });

        const tokenData = await new Promise((resolve, reject) => {
            const req = net.request({ method: 'POST', url: 'https://account.ely.by/api/oauth2/v1/token' });
            req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            let body = '';
            req.on('response', (res) => {
                res.on('data', c => body += c.toString());
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); } catch(e) { reject(new Error('Token parse hatası: ' + body)); }
                });
            });
            req.on('error', reject);
            const params = new URLSearchParams({
                client_id: ELYBY_CLIENT_ID, client_secret: ELYBY_CLIENT_SECRET, grant_type: 'authorization_code',
                code, redirect_uri: ELYBY_REDIRECT_URI
            }).toString();
            req.write(params);
            req.end();
        });

        if (tokenData.error) return { ok: false, error: tokenData.error_description || tokenData.error };

        const profile = await new Promise((resolve, reject) => {
            const req = net.request({ method: 'GET', url: 'https://account.ely.by/api/account/v1/info' });
            req.setHeader('Authorization', `Bearer ${tokenData.access_token}`);
            let body = '';
            req.on('response', (res) => {
                res.on('data', c => body += c.toString());
                res.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(new Error('Profil parse hatası')); } });
            });
            req.on('error', reject);
            req.end();
        });

        return {
            ok: true,
            data: {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                uuid: profile.uuid,
                name: profile.username
            }
        };
    } catch(e) {
        return { ok: false, error: e.message };
    }
});
ipcMain.handle('ms-login', async () => {
    try {
        const authManager = new Auth("select_account");
        const xboxManager = await authManager.launch("electron");
        const token = await xboxManager.getMinecraft();
        return token.mclc(true);
    } catch (error) {
        console.error("Giriş iptal edildi veya hata:", error);
        return null;
    }
});

ipcMain.handle('ms-refresh', async (event, storedMclcToken) => {
    try {
        if (!storedMclcToken) return { ok: false, error: 'Token bulunamadı.' };
        const authManager = new Auth("select_account");
        let mc = tokenUtils.fromMclcToken(authManager, storedMclcToken);
        mc = await mc.refresh(false);
        return { ok: true, data: mc.mclc(true) };
    } catch (error) {
        console.error("MS token yenileme hatası:", error);
        return { ok: false, error: error?.message || String(error) };
    }
});