# MineCore

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## English

An Electron-based Minecraft launcher with Modrinth integration, automatic Fabric/Forge installation, and multi-account support (Microsoft, Ely.by, offline).

> MineCore is not affiliated with Mojang or Microsoft. This is an independent launcher project.

### Features

- 🧩 **Modrinth integration** — search and install mods, resource packs, and modpacks from inside the launcher
- ⚙️ **Automatic setup** — Fabric, Forge, and the required Java version are detected and installed automatically
- 📦 **Isolated modpacks** — each pack can optionally keep its own worlds/config/screenshots folder
- 👤 **Multi-account support** — Microsoft, Ely.by (browser-based OAuth2), offline
- 🌐 **6 languages** — Turkish, English, German, French, Spanish, Russian
- 🖥️ **Detailed console** — filtering, search, save to file
- ⏱️ **Playtime tracking**, ⭐ **favorite versions**, 🔄 **mod update checker**, 📸 **screenshot gallery**, and more

### Requirements

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)
- Windows for building/testing (current config targets `win`)

### Setup (development)

```bash
git clone https://github.com/wafires/MineCore.git
cd MineCore
npm install
```

#### Create the `.env` file

To enable Ely.by login, you need to register an OAuth2 application:

1. Go to [account.ely.by/dev/applications](https://account.ely.by/dev/applications) and sign in with your Ely.by account
2. Create a new application, type **"Website"**
3. Set the **Redirect URI** to: `http://localhost:23847/callback`
4. Note down the generated **Client ID** and **Client Secret**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
ELYBY_CLIENT_ID=your_client_id
ELYBY_CLIENT_SECRET=your_client_secret
ELYBY_REDIRECT_PORT=23847
```

> `.env` is protected by `.gitignore` — it is never committed. If you don't need Ely.by login, you can skip this step; every other feature works without it.

#### Run

```bash
npm start
```

### Building (producing a distributable `.exe`)

```bash
npm run build
```

This automatically:

1. Runs `scripts/prebuild.js` — reads `.env` and generates `config.generated.json` (so Ely.by credentials get baked into the packaged app). If `.env` is missing or `ELYBY_CLIENT_ID`/`SECRET` are empty, the build stops with an error.
2. Runs `electron-builder` to package the app — output goes to `dist/`.

End users running the `.exe` do **not** need to set up any `.env` file themselves — the required configuration is embedded at build time.

> **Security note:** this approach (build-time injection) embeds the Ely.by Client Secret inside the compiled `.exe`. A technically skilled person could extract it from the binary — this is a commonly accepted risk level for open-source desktop apps. For stronger guarantees, proxy the OAuth token exchange through your own backend server instead.

### Project structure

```
minecore/
├── main.js              # Electron main process (window mgmt, IPC, Ely.by/MS auth)
├── logic.js               # Renderer process logic (UI, mod management, pack system)
├── index.html              # UI markup
├── style.css               # Styles
├── package.json            # Dependencies and electron-builder config
├── scripts/
│   └── prebuild.js         # .env → config.generated.json converter (pre-build step)
├── assets/                 # Icons, default background, logo
├── .env.example             # Environment variable template (no real secrets)
└── .gitignore
```

### Troubleshooting

**Ely.by login says "configuration missing"**
You haven't created `.env`, or `ELYBY_CLIENT_ID`/`ELYBY_CLIENT_SECRET` are empty. Follow the setup steps above.

**`npm run build` stops with "`.env` file not found"**
The build script requires `.env` to exist. Copy `.env.example` and fill it in (if you're not using Ely.by, the file just needs to exist — leave the values empty, but Ely.by login won't work in the packaged app in that case).

**Java or Minecraft files won't download**
On first launch, the launcher automatically downloads the required Java version and Minecraft files; this needs an internet connection and write access to the `.minecraft` folder.

### License / Disclaimer

This project is not officially affiliated with Mojang Studios, Microsoft, or Ely.by. Minecraft is a trademark of Mojang Studios.

---

<a name="türkçe"></a>
## Türkçe

Modrinth entegrasyonu, otomatik Fabric/Forge kurulumu ve çoklu hesap desteğine (Microsoft, Ely.by, çevrimdışı) sahip, Electron tabanlı bir Minecraft launcher'ı.

> MineCore, Mojang veya Microsoft ile bağlantılı değildir. Bağımsız bir launcher projesidir.

### Özellikler

- 🧩 **Modrinth entegrasyonu** — mod, doku paketi ve modpack arama/indirme, launcher içinden
- ⚙️ **Otomatik kurulum** — Fabric, Forge ve gerekli Java sürümü otomatik tespit edilip indirilir
- 📦 **İzole modpack'ler** — her paket isteğe bağlı olarak kendi dünya/config/ekran görüntüsü klasörüne sahip olabilir
- 👤 **Çoklu hesap desteği** — Microsoft, Ely.by (OAuth2, tarayıcı üzerinden), çevrimdışı
- 🌐 **6 dil** — Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Rusça
- 🖥️ **Detaylı konsol** — filtreleme, arama, dosyaya kaydetme
- ⏱️ **Oynanış takibi**, ⭐ **favori sürümler**, 🔄 **mod güncelleme kontrolü**, 📸 **ekran görüntüsü galerisi** ve daha fazlası

### Gereksinimler

- [Node.js](https://nodejs.org/) 18 veya üzeri
- npm (Node.js ile birlikte gelir)
- Windows üzerinde derleme/test (mevcut yapılandırma `win` hedefine göredir)

### Kurulum (geliştirme ortamı)

```bash
git clone https://github.com/wafires/MineCore.git
cd MineCore
npm install
```

#### `.env` dosyasını oluştur

Ely.by ile giriş özelliğinin çalışması için bir OAuth2 uygulaması kaydetmen gerekiyor:

1. [account.ely.by/dev/applications](https://account.ely.by/dev/applications) adresine git, Ely.by hesabınla giriş yap
2. Yeni bir uygulama oluştur, tipini **"Website"** seç
3. **Redirect URI** alanına şunu yaz: `http://localhost:23847/callback`
4. Oluşturulan **Client ID** ve **Client Secret** değerlerini not al

`.env.example` dosyasını kopyala, adını `.env` yap:

```bash
cp .env.example .env
```

`.env` dosyasını aç, değerleri doldur:

```env
ELYBY_CLIENT_ID=senin_client_id
ELYBY_CLIENT_SECRET=senin_client_secret
ELYBY_REDIRECT_PORT=23847
```

> `.env` dosyası `.gitignore` ile korunuyor — asla repoya commit edilmez. Ely.by girişini kullanmayacaksan bu adımı atlayabilirsin, diğer tüm özellikler `.env` olmadan da çalışır.

#### Çalıştır

```bash
npm start
```

### Derleme (dağıtım için `.exe` üretme)

```bash
npm run build
```

Bu komut otomatik olarak:

1. `scripts/prebuild.js` çalışır — `.env` dosyasını okuyup `config.generated.json` üretir (Ely.by bilgilerini derlenmiş uygulamanın içine gömmek için). `.env` eksikse veya `ELYBY_CLIENT_ID`/`SECRET` boşsa build burada durur ve hata gösterir.
2. `electron-builder` paketlemeyi yapar, çıktı `dist/` klasörüne yazılır.

Kullanıcıların `.exe`'yi çalıştırması için herhangi bir `.env` kurulumu yapmasına **gerek yoktur** — gerekli yapılandırma derleme sırasında pakete gömülür.

> **Güvenlik notu:** Bu yöntem (build-time injection) Ely.by Client Secret'ını derlenmiş `.exe` içine gömer. Teknik bilgisi olan biri bu değeri dosyadan çıkarabilir — bu, açık kaynak masaüstü uygulamalarında kabul edilen standart bir risktir. Daha yüksek güvenlik gerekiyorsa, OAuth token değişimini kendi backend sunucunuz üzerinden proxy'lemeniz önerilir.

### Proje yapısı

```
minecore/
├── main.js              # Electron ana süreç (pencere yönetimi, IPC, Ely.by/MS auth)
├── logic.js               # Renderer süreç mantığı (UI, mod yönetimi, pack sistemi)
├── index.html              # Arayüz
├── style.css               # Stiller
├── package.json            # Bağımlılıklar ve electron-builder yapılandırması
├── scripts/
│   └── prebuild.js         # .env → config.generated.json dönüştürücü (build öncesi)
├── assets/                 # İkonlar, varsayılan arka plan, logo
├── .env.example             # Ortam değişkeni şablonu (gerçek anahtar içermez)
└── .gitignore
```

### Sık karşılaşılan sorunlar

**Ely.by girişi "yapılandırma eksik" hatası veriyor**
`.env` dosyasını oluşturmadın veya `ELYBY_CLIENT_ID`/`ELYBY_CLIENT_SECRET` boş. Yukarıdaki kurulum adımlarını takip et.

**`npm run build` "`.env` dosyası bulunamadı" hatasıyla duruyor**
Build script'i `.env` dosyasını zorunlu kılıyor. `.env.example`'ı kopyalayıp doldurman gerekiyor (Ely.by kullanmayacaksan bile dosya var olmalı, içini boş bırakabilirsin — ama bu durumda Ely.by girişi paketlenmiş uygulamada çalışmaz).

**Java veya Minecraft dosyaları indirilemiyor**
İlk açılışta launcher gerekli Java sürümünü ve Minecraft dosyalarını otomatik indirir; bu, internet bağlantısı ve `.minecraft` klasörüne yazma izni gerektirir.

### Lisans / Sorumluluk Reddi

Bu proje Mojang Studios, Microsoft veya Ely.by ile resmi olarak ilişkili değildir. Minecraft, Mojang Studios'un ticari markasıdır.