// Bu script `npm run build` öncesinde otomatik çalışır (package.json -> scripts.prebuild).
// .env dosyasındaki gizli değerleri okuyup config.generated.json'a yazar.
// electron-builder bu dosyayı paketin içine gömer, böylece dağıttığın .exe
// kullanıcı tarafında hiçbir .env kurulumu gerektirmeden çalışır.

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const outPath = path.join(__dirname, 'config.generated.json');

if (!fs.existsSync(envPath)) {
    console.error('\n[HATA] .env dosyası bulunamadı!');
    console.error('Build almadan önce proje kök dizinine bir .env dosyası oluştur.');
    console.error('Şablon için .env.example dosyasına bak.\n');
    process.exit(1);
}

// Basit .env parse — dış paket gerektirmez (dotenv zaten runtime'da kullanılıyor,
// burada sadece build script'i için minik bir parser yeterli)
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    env[key] = value;
});

const required = ['ELYBY_CLIENT_ID', 'ELYBY_CLIENT_SECRET'];
const missing = required.filter(k => !env[k]);
if (missing.length > 0) {
    console.error(`\n[HATA] .env dosyasında eksik değerler: ${missing.join(', ')}\n`);
    process.exit(1);
}

const config = {
    ELYBY_CLIENT_ID: env.ELYBY_CLIENT_ID,
    ELYBY_CLIENT_SECRET: env.ELYBY_CLIENT_SECRET,
    ELYBY_REDIRECT_PORT: env.ELYBY_REDIRECT_PORT || '23847'
};

fs.writeFileSync(outPath, JSON.stringify(config, null, 2));
console.log(`[OK] config.generated.json oluşturuldu — build paketine dahil edilecek.`);
