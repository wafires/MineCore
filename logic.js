const { Client, Authenticator } = require('minecraft-launcher-core');
const { ipcRenderer } = require('electron'); 
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
const admZip = require('adm-zip');
const tar = require('tar');
const launcher = new Client();

const translations = {
    en: {
        modal_off_title: "Add Offline Account", modal_off_desc: "Enter the username that will appear in-game.",
        ph_username: "Username", ph_packname: "Pack Name",
        btn_cancel: "Cancel", btn_add_system: "Add to System", btn_save: "Save", btn_download: "Download",
        modal_pack_title: "Create New Modpack", modal_pack_desc: "Select version and loader to create an isolated pack.",
        label_version: "Game Version:", label_loader: "Mod Loader:", pack_isolated_label: "Isolated pack — worlds, settings, and screenshots are stored in this pack's own folder instead of the original .minecraft.",
        modal_ver_title: "Select Version", modal_ver_desc: "Compatible versions are listed below.", modal_ver_desc_manual: "All available versions are listed — pick the one matching your MC version and loader.", modal_ver_gameversion_label: "Game version", modal_ver_loader_label: "Platform",
        modal_ver_desc_fallback: "No exact match found. Showing all available versions.",
        panel_user_info: "USER ACCOUNT INFO", btn_offline: "Offline", btn_ms_login: "Microsoft",
        nav_home: "HOME", nav_mods: "MOD CENTER", nav_installs: "INSTALLATIONS", nav_settings: "SETTINGS",
        banner_desc: "Maximum Performance with MineCore", status_ready: "System ready...", status_loading: "Loading versions...",
        tab_packs: "My Packs", btn_new_pack: "NEW PACK", def_folder: "Default Folder",
        tab_mods: "Mods", tab_resourcepacks: "Texture Packs", tab_modpacks: "Modpacks",
        title_trend_mods: "Trending Mods", title_trend_rp: "Trending Texture Packs", title_trend_mp: "Popular Modpacks",
        search_mod: "Search Mod...", search_rp: "Search Texture Pack...", search_mp: "Search Modpack...",
        btn_search: "SEARCH", no_result: "No results found.", loading: "Loading...", searching: "Searching...",
        btn_select_pack: "SELECT PACK", btn_delete: "DELETE", btn_install_pack: "INSTALL PACK",
        set_lang: "Language / Dil", set_min_ram: "Min RAM", set_max_ram: "Max RAM", set_java: "Custom Java Path", set_dir: "Game Directory",
        set_bg_img: "Select Background Image", btn_save_settings: "SAVE SETTINGS", set_theme_title: "INTERFACE THEME", set_theme_desc: "New interface (turn off to return to the classic look)", msg_saved: "Settings saved!",
        panel_version: "ACTIVE VERSION PROFILE", play_btn: "PLAY",
        btn_show_installed: "Installed Files", select_pack_first: "Please select a Custom Pack from the left first.",
        startup_settings: "Startup Settings", set_fs_desc: "Run in Windowed Fullscreen",
        opacity_label: "Background Darkness", btn_reset_bg: "Reset Background",
        downloading: "DOWNLOADING...", ver_none: "No versions found.", ver_error: "Error loading versions.",
        modpack_ver_title: "Modpack Version",
        grp_favorites: "⭐ FAVORITES", grp_my_packs: "MY CUSTOM PACKS", grp_installed: "INSTALLED LOADERS", grp_vanilla: "OFFICIAL VERSIONS",
        mp_installing: "Installing Modpack...", mp_reading: "Reading pack files...", mp_progress: "Installing mods", mp_done: "Modpack installed!", mp_err: "Installation failed.", mp_cancelled: "Installation cancelled.",
        status_no_account: "Please add an account first!", status_downloading: "downloading", status_fabric_err: "Fabric install error.", status_forge_err: "Forge install error.", status_not_installed: "not installed!", status_java_check: "Checking Java...", status_java_err: "Java download error!", status_launching: "Launching...", status_dl_progress: "Downloading", status_opened: "Launched!", status_error: "Error: ",
        btn_manage_accounts: "Manage Accounts", acc_type_ms: "Microsoft", acc_type_offline: "Offline", accmgr_title: "Accounts", accmgr_sub: "Pick the account to use, or add a new one.", accmgr_empty: "No accounts yet.", accmgr_active: "ACTIVE",
        btn_elyby: "Sign in with Ely.by", elyby_title: "Ely.by Login", elyby_desc: "The Ely.by login page will open in your browser. You'll return here automatically once signed in.", elyby_email_label: "Email or username", elyby_pass_label: "Password", btn_login: "Sign In", acc_type_elyby: "Ely.by", elyby_connecting: "Waiting for browser...", elyby_success: "Signed in as", btn_elyby_open: "Open in Browser", elyby_waiting_browser: "Complete the login in your browser...",
        toast_mod_updated: "Mod updated!", toast_settings_saved: "Settings saved!", toast_pack_exported: "Pack exported!", toast_pack_imported: "Pack imported!", toast_icon_changed: "Icon changed!",
        btn_check_updates: "Check Updates", updating: "Checking...", up_to_date: "All up to date!", mods_updated: "mods updated",
        confirm_delete_pack: "Delete Pack", confirm_delete_msg: "Are you sure? This cannot be undone.", confirm_delete_files: "Also delete all files (mods, worlds, configs)", btn_delete_pack: "Delete",
        playtime_label: "Playtime", playtime_hours: "h", playtime_mins: "m",
        btn_change_icon: "Change Icon", btn_open_folder: "Open Folder", btn_export_pack: "Export", btn_import_pack: "Import Pack",
        console_title: "GAME CONSOLE", console_empty: "Console will appear here when game starts...", btn_close_console: "CLOSE",
        console_search_ph: "Search logs...", console_filter_all: "ALL", console_autoscroll: "Auto-scroll", console_copy: "Copy", console_save: "Save to file", console_clear: "CLR", console_copied: "Logs copied!", console_saved: "Log file saved!", console_no_match: "No matching lines.",
        search_packs: "Search packs...",
        crash_title: "CRASH REPORT DETECTED", crash_desc: "A crash report was found from the last session.", btn_view_crash: "View Report", btn_close_crash: "Dismiss",
        update_available: "New version available!", update_download: "Download", update_dismiss: "Dismiss",
        no_mods_to_update: "No tracked mods found.", checking_mod: "Checking",
        screenshots_title: "SCREENSHOTS", screenshots_empty: "No screenshots yet.", screenshot_delete: "Delete", screenshot_open: "Open Folder",
        mod_downloads: "Downloads", mod_follows: "Followers", mod_updated: "Updated", mod_created: "Created", mod_versions: "Versions", mod_categories: "Categories", mod_open_modrinth: "Open on Modrinth", mod_back: "← Back",
        status_ms_connecting: "Connecting to Microsoft...", status_ms_success: "Login Successful", status_ms_cancelled: "Microsoft login cancelled.",
        installed_empty: "No installed content found.", installed_local_file: "Local File", installed_file_desc: "Physically installed file in pack.", btn_delete_file: "DELETE FILE", installed_version: "Installed", installed_latest: "Latest", btn_update: "Update",
    },
    tr: {
        modal_off_title: "Çevrimdışı Hesap Ekle", modal_off_desc: "Oyun içinde görünecek kullanıcı adını girin.",
        ph_username: "Kullanıcı Adı", ph_packname: "Paket Adı",
        btn_cancel: "İptal", btn_add_system: "Sisteme Ekle", btn_save: "Kaydet", btn_download: "İndir",
        modal_pack_title: "Yeni Modpack Oluştur", modal_pack_desc: "Sürümünü ve motorunu seç, izole bir paket yarat.",
        label_version: "Oyun Sürümü:", label_loader: "Mod Yükleyici:", pack_isolated_label: "İzole paket — dünyalar, ayarlar ve ekran görüntüleri orijinal .minecraft yerine bu paketin kendi klasöründe saklanır.",
        modal_ver_title: "Sürüm Seç", modal_ver_desc: "Bu içeriğe uygun sürümler listelendi.", modal_ver_desc_manual: "Tüm sürümler listelendi — kendi MC sürümün ve loader'ına uygun olanı seç.", modal_ver_gameversion_label: "Oyun sürümü", modal_ver_loader_label: "Platform",
        modal_ver_desc_fallback: "Tam eşleşme bulunamadı. Tüm mevcut sürümler gösteriliyor.",
        panel_user_info: "KULLANICI HESAP BİLGİLERİ", btn_offline: "Çevrimdışı", btn_ms_login: "Microsoft",
        nav_home: "ANA SAYFA", nav_mods: "MOD MERKEZİ", nav_installs: "YÜKLEMELER", nav_settings: "AYARLAR",
        banner_desc: "MineCore ile Maksimum Performans", status_ready: "Sistem hazır...", status_loading: "Sürümler yükleniyor...",
        tab_packs: "Paketlerim", btn_new_pack: "YENİ PAKET", def_folder: "Varsayılan Klasör",
        tab_mods: "Modlar", tab_resourcepacks: "Doku Paketleri", tab_modpacks: "Mod Paketleri",
        title_trend_mods: "Trend Modlar", title_trend_rp: "Trend Doku Paketleri", title_trend_mp: "Popüler Mod Paketleri",
        search_mod: "Mod Ara...", search_rp: "Doku Paketi Ara...", search_mp: "Mod Paketi Ara...",
        btn_search: "ARA", no_result: "Sonuç bulunamadı.", loading: "Yükleniyor...", searching: "Aranıyor...",
        btn_select_pack: "PAKET SEÇİN", btn_delete: "SİL", btn_install_pack: "PAKETİ KUR",
        set_lang: "Dil / Language", set_min_ram: "Minimum RAM", set_max_ram: "Maksimum RAM", set_java: "Özel Java Yolu", set_dir: "Ana Oyun Dizini",
        set_bg_img: "Arka Plan Resmi Seç", btn_save_settings: "AYARLARI KAYDET", set_theme_title: "ARAYÜZ TEMASI", set_theme_desc: "Yeni arayüz (kapatınca klasik görünüme döner)", msg_saved: "Ayarlar başarıyla kaydedildi!",
        panel_version: "AKTİF SÜRÜM PROFİLİ", play_btn: "OYNA",
        btn_show_installed: "Yüklenen Dosyalar", select_pack_first: "Lütfen önce sol taraftan bir Özel Paket seçin.",
        startup_settings: "Başlangıç Ayarları", set_fs_desc: "Pencereli Tam Ekran Modunda Çalıştır",
        opacity_label: "Arka Plan Karartma", btn_reset_bg: "Arka Planı Sıfırla",
        downloading: "İNDİRİLİYOR...", ver_none: "Sürüm bulunamadı.", ver_error: "Sürümler yüklenirken hata oluştu.",
        modpack_ver_title: "Modpack Sürümü",
        grp_favorites: "⭐ FAVORİLER", grp_my_packs: "ÖZEL PAKETLERİM", grp_installed: "KURULU MOTORLAR", grp_vanilla: "RESMİ SÜRÜMLER",
        mp_installing: "Mod Paketi Yükleniyor...", mp_reading: "Paket dosyaları okunuyor...", mp_progress: "Mod yükleniyor", mp_done: "Mod paketi kuruldu!", mp_err: "Kurulum başarısız oldu.", mp_cancelled: "Kurulum iptal edildi.",
        status_no_account: "Lütfen önce hesap ekleyin!", status_downloading: "indiriliyor", status_fabric_err: "Fabric kurulum hatası.", status_forge_err: "Forge kurulum hatası.", status_not_installed: "kurulu değil!", status_java_check: "Java kontrol ediliyor...", status_java_err: "Java indirme hatası!", status_launching: "Başlatılıyor...", status_dl_progress: "İndiriliyor", status_opened: "Açıldı!", status_error: "Hata: ",
        btn_manage_accounts: "Hesapları Yönet", acc_type_ms: "Microsoft", acc_type_offline: "Çevrimdışı", accmgr_title: "Hesaplar", accmgr_sub: "Kullanılacak hesabı seç veya yeni bir hesap ekle.", accmgr_empty: "Henüz hesap yok.", accmgr_active: "AKTİF",
        btn_elyby: "Ely.by ile Giriş", elyby_title: "Ely.by ile Giriş", elyby_desc: "Tarayıcıda Ely.by giriş sayfası açılacak. Giriş yaptıktan sonra otomatik olarak launcher'a döneceksiniz.", elyby_email_label: "E-posta veya kullanıcı adı", elyby_pass_label: "Şifre", btn_login: "Giriş Yap", acc_type_elyby: "Ely.by", elyby_connecting: "Tarayıcı bekleniyor...", elyby_success: "Giriş yapıldı:", btn_elyby_open: "Tarayıcıda Aç", elyby_waiting_browser: "Tarayıcıda girişi tamamlayın...",
        toast_mod_updated: "Mod güncellendi!", toast_settings_saved: "Ayarlar kaydedildi!", toast_pack_exported: "Paket dışa aktarıldı!", toast_pack_imported: "Paket içe aktarıldı!", toast_icon_changed: "İkon değiştirildi!",
        btn_check_updates: "Güncelleme Kontrol Et", updating: "Kontrol ediliyor...", up_to_date: "Tüm modlar güncel!", mods_updated: "mod güncellendi",
        confirm_delete_pack: "Paketi Sil", confirm_delete_msg: "Emin misin? Bu işlem geri alınamaz.", confirm_delete_files: "Tüm dosyaları da sil (modlar, dünyalar, config)", btn_delete_pack: "Sil",
        playtime_label: "Oynanış Süresi", playtime_hours: "s", playtime_mins: "dk",
        btn_change_icon: "İkon Değiştir", btn_open_folder: "Klasörü Aç", btn_export_pack: "Dışa Aktar", btn_import_pack: "Paket İçe Aktar",
        console_title: "OYUN KONSOLU", console_empty: "Oyun başladığında konsol burada görünecek...", btn_close_console: "KAPAT",
        console_search_ph: "Loglarda ara...", console_filter_all: "TÜMÜ", console_autoscroll: "Otomatik kaydır", console_copy: "Kopyala", console_save: "Dosyaya kaydet", console_clear: "TEMİZLE", console_copied: "Loglar kopyalandı!", console_saved: "Log dosyası kaydedildi!", console_no_match: "Eşleşen satır yok.",
        search_packs: "Paket ara...",
        crash_title: "ÇÖKME RAPORU TESPİT EDİLDİ", crash_desc: "Son oturumdan bir çökme raporu bulundu.", btn_view_crash: "Raporu Gör", btn_close_crash: "Kapat",
        update_available: "Yeni sürüm mevcut!", update_download: "İndir", update_dismiss: "Kapat",
        no_mods_to_update: "Takip edilen mod bulunamadı.", checking_mod: "Kontrol ediliyor",
        screenshots_title: "EKRAN GÖRÜNTÜLERI", screenshots_empty: "Henüz ekran görüntüsü yok.", screenshot_delete: "Sil", screenshot_open: "Klasörü Aç",
        mod_downloads: "İndirme", mod_follows: "Takipçi", mod_updated: "Güncellendi", mod_created: "Oluşturuldu", mod_versions: "Sürümler", mod_categories: "Kategoriler", mod_open_modrinth: "Modrinth'te Aç", mod_back: "← Geri",
        status_ms_connecting: "Microsoft bağlantısı açılıyor...", status_ms_success: "Premium Giriş Başarılı", status_ms_cancelled: "Microsoft girişi iptal edildi.",
        installed_empty: "Yüklü içerik bulunamadı.", installed_local_file: "Sistem Dosyası", installed_file_desc: "Pakete kurulmuş fiziksel dosya.", btn_delete_file: "DOSYAYI SİL", installed_version: "Yüklü", installed_latest: "En Güncel", btn_update: "Güncelle",
    },
    es: {
        modal_off_title: "Añadir Cuenta Offline", modal_off_desc: "Introduce el nombre que aparecerá en el juego.",
        ph_username: "Usuario", ph_packname: "Nombre del Pack",
        btn_cancel: "Cancelar", btn_add_system: "Añadir", btn_save: "Guardar", btn_download: "Descargar",
        modal_pack_title: "Crear Modpack", modal_pack_desc: "Selecciona versión y cargador para crear un pack aislado.",
        label_version: "Versión del juego:", label_loader: "Cargador de mods:", pack_isolated_label: "Pack aislado — mundos, ajustes y capturas se guardan en la carpeta propia del pack en lugar del .minecraft original.",
        modal_ver_title: "Seleccionar versión", modal_ver_desc: "Versiones compatibles listadas abajo.", modal_ver_desc_manual: "Se listan todas las versiones — elige la que coincida con tu versión de MC y loader.", modal_ver_gameversion_label: "Versión del juego", modal_ver_loader_label: "Plataforma",
        modal_ver_desc_fallback: "Sin coincidencia exacta. Mostrando todas las versiones disponibles.",
        panel_user_info: "INFO DE CUENTA", btn_offline: "Sin conexión", btn_ms_login: "Microsoft",
        nav_home: "INICIO", nav_mods: "MODS", nav_installs: "INSTALACIONES", nav_settings: "AJUSTES",
        banner_desc: "Máximo rendimiento con MineCore", status_ready: "Sistema listo...", status_loading: "Cargando versiones...",
        tab_packs: "Mis Packs", btn_new_pack: "NUEVO PACK", def_folder: "Carpeta por defecto",
        tab_mods: "Mods", tab_resourcepacks: "Texturas", tab_modpacks: "Modpacks",
        title_trend_mods: "Mods populares", title_trend_rp: "Texturas populares", title_trend_mp: "Modpacks populares",
        search_mod: "Buscar mod...", search_rp: "Buscar textura...", search_mp: "Buscar modpack...",
        btn_search: "BUSCAR", no_result: "Sin resultados.", loading: "Cargando...", searching: "Buscando...",
        btn_select_pack: "SELECCIONAR PACK", btn_delete: "ELIMINAR", btn_install_pack: "INSTALAR",
        set_lang: "Idioma / Language", set_min_ram: "RAM mínima", set_max_ram: "RAM máxima", set_java: "Ruta Java personalizada", set_dir: "Directorio del juego",
        set_bg_img: "Seleccionar fondo", btn_save_settings: "GUARDAR", set_theme_title: "TEMA DE LA INTERFAZ", set_theme_desc: "Nueva interfaz (desactívala para volver al aspecto clásico)", msg_saved: "¡Ajustes guardados!",
        panel_version: "PERFIL DE VERSIÓN ACTIVO", play_btn: "JUGAR",
        btn_show_installed: "Archivos Instalados", select_pack_first: "Por favor, selecciona primero un Pack personalizado a la izquierda.",
        startup_settings: "Ajustes de inicio", set_fs_desc: "Ejecutar en pantalla completa con ventana",
        opacity_label: "Oscuridad del fondo", btn_reset_bg: "Restablecer fondo",
        downloading: "DESCARGANDO...", ver_none: "No se encontraron versiones.", ver_error: "Error al cargar versiones.",
        modpack_ver_title: "Versión del Modpack",
        grp_favorites: "⭐ FAVORITOS", grp_my_packs: "MIS PACKS", grp_installed: "CARGADORES INSTALADOS", grp_vanilla: "VERSIONES OFICIALES",
        mp_installing: "Instalando modpack...", mp_reading: "Leyendo archivos...", mp_progress: "Instalando mods", mp_done: "¡Modpack instalado!", mp_err: "Instalación fallida.", mp_cancelled: "Instalación cancelada.",
        status_no_account: "¡Añade una cuenta primero!", status_downloading: "descargando", status_fabric_err: "Error al instalar Fabric.", status_forge_err: "Error al instalar Forge.", status_not_installed: "¡no instalado!", status_java_check: "Verificando Java...", status_java_err: "¡Error al descargar Java!", status_launching: "Iniciando...", status_dl_progress: "Descargando", status_opened: "¡Iniciado!", status_error: "Error: ",
        btn_manage_accounts: "Gestionar cuentas", acc_type_ms: "Microsoft", acc_type_offline: "Sin conexión", accmgr_title: "Cuentas", accmgr_sub: "Elige la cuenta a usar o añade una nueva.", accmgr_empty: "Aún no hay cuentas.", accmgr_active: "ACTIVA",
        btn_elyby: "Iniciar con Ely.by", elyby_title: "Inicio Ely.by", elyby_desc: "Se abrirá la página de inicio de sesión de Ely.by en tu navegador. Volverás aquí automáticamente.", elyby_email_label: "Correo o usuario", elyby_pass_label: "Contraseña", btn_login: "Iniciar sesión", acc_type_elyby: "Ely.by", elyby_connecting: "Esperando al navegador...", elyby_success: "Sesión iniciada como", btn_elyby_open: "Abrir en el navegador", elyby_waiting_browser: "Completa el inicio de sesión en tu navegador...",
        toast_mod_updated: "¡Mod actualizado!", toast_settings_saved: "¡Ajustes guardados!", toast_pack_exported: "¡Pack exportado!", toast_pack_imported: "¡Pack importado!", toast_icon_changed: "¡Icono cambiado!",
        btn_check_updates: "Buscar Actualizaciones", updating: "Comprobando...", up_to_date: "¡Todo actualizado!", mods_updated: "mods actualizados",
        confirm_delete_pack: "Eliminar Pack", confirm_delete_msg: "¿Seguro? No se puede deshacer.", confirm_delete_files: "También eliminar todos los archivos (mods, mundos, configs)", btn_delete_pack: "Eliminar",
        playtime_label: "Tiempo jugado", playtime_hours: "h", playtime_mins: "m",
        btn_change_icon: "Cambiar Icono", btn_open_folder: "Abrir Carpeta", btn_export_pack: "Exportar", btn_import_pack: "Importar Pack",
        console_title: "CONSOLA DE JUEGO", console_empty: "La consola aparecerá aquí cuando el juego inicie...", btn_close_console: "CERRAR",
        console_search_ph: "Buscar en logs...", console_filter_all: "TODO", console_autoscroll: "Auto-desplazar", console_copy: "Copiar", console_save: "Guardar archivo", console_clear: "LIMPIAR", console_copied: "¡Logs copiados!", console_saved: "¡Archivo guardado!", console_no_match: "Sin coincidencias.",
        search_packs: "Buscar packs...",
        crash_title: "INFORME DE CRASH DETECTADO", crash_desc: "Se encontró un informe de crash de la última sesión.", btn_view_crash: "Ver Informe", btn_close_crash: "Descartar",
        update_available: "¡Nueva versión disponible!", update_download: "Descargar", update_dismiss: "Descartar",
        no_mods_to_update: "No se encontraron mods rastreados.", checking_mod: "Comprobando",
        screenshots_title: "CAPTURAS", screenshots_empty: "Aún no hay capturas.", screenshot_delete: "Eliminar", screenshot_open: "Abrir carpeta",
        mod_downloads: "Descargas", mod_follows: "Seguidores", mod_updated: "Actualizado", mod_created: "Creado", mod_versions: "Versiones", mod_categories: "Categorías", mod_open_modrinth: "Abrir en Modrinth", mod_back: "← Volver",
        status_ms_connecting: "Conectando con Microsoft...", status_ms_success: "Inicio de sesión exitoso", status_ms_cancelled: "Inicio de sesión cancelado.",
        installed_empty: "No se encontró contenido instalado.", installed_local_file: "Archivo local", installed_file_desc: "Archivo instalado físicamente en el pack.", btn_delete_file: "ELIMINAR ARCHIVO", installed_version: "Instalado", installed_latest: "Último", btn_update: "Actualizar",
    },
    de: {
        modal_off_title: "Offline-Konto hinzufügen", modal_off_desc: "Gib den Benutzernamen ein, der im Spiel angezeigt wird.",
        ph_username: "Benutzername", ph_packname: "Pack-Name",
        btn_cancel: "Abbrechen", btn_add_system: "Hinzufügen", btn_save: "Speichern", btn_download: "Herunterladen",
        modal_pack_title: "Neues Modpack erstellen", modal_pack_desc: "Version und Loader wählen, um ein isoliertes Pack zu erstellen.",
        label_version: "Spielversion:", label_loader: "Mod-Loader:", pack_isolated_label: "Isoliertes Paket — Welten, Einstellungen und Screenshots werden im eigenen Ordner dieses Pakets statt im originalen .minecraft gespeichert.",
        modal_ver_title: "Version wählen", modal_ver_desc: "Kompatible Versionen sind unten aufgeführt.", modal_ver_desc_manual: "Alle verfügbaren Versionen werden angezeigt — wähle die passende für deine MC-Version und Loader.", modal_ver_gameversion_label: "Spielversion", modal_ver_loader_label: "Plattform",
        modal_ver_desc_fallback: "Keine genaue Übereinstimmung. Alle verfügbaren Versionen werden angezeigt.",
        panel_user_info: "KONTOINFORMATIONEN", btn_offline: "Offline", btn_ms_login: "Microsoft",
        nav_home: "START", nav_mods: "MOD-CENTER", nav_installs: "INSTALLATIONEN", nav_settings: "EINSTELLUNGEN",
        banner_desc: "Maximale Leistung mit MineCore", status_ready: "System bereit...", status_loading: "Versionen laden...",
        tab_packs: "Meine Packs", btn_new_pack: "NEUES PACK", def_folder: "Standardordner",
        tab_mods: "Mods", tab_resourcepacks: "Texturen", tab_modpacks: "Modpacks",
        title_trend_mods: "Beliebte Mods", title_trend_rp: "Beliebte Texturen", title_trend_mp: "Beliebte Modpacks",
        search_mod: "Mod suchen...", search_rp: "Textur suchen...", search_mp: "Modpack suchen...",
        btn_search: "SUCHEN", no_result: "Keine Ergebnisse.", loading: "Laden...", searching: "Suchen...",
        btn_select_pack: "PACK WÄHLEN", btn_delete: "LÖSCHEN", btn_install_pack: "INSTALLIEREN",
        set_lang: "Sprache / Language", set_min_ram: "Min RAM", set_max_ram: "Max RAM", set_java: "Benutzerdefinierter Java-Pfad", set_dir: "Spielverzeichnis",
        set_bg_img: "Hintergrundbild wählen", btn_save_settings: "SPEICHERN", set_theme_title: "OBERFLÄCHENDESIGN", set_theme_desc: "Neue Oberfläche (ausschalten für das klassische Aussehen)", msg_saved: "Einstellungen gespeichert!",
        panel_version: "AKTIVES VERSIONSPROFIL", play_btn: "SPIELEN",
        btn_show_installed: "Installierte Dateien", select_pack_first: "Bitte zuerst ein benutzerdefiniertes Paket links auswählen.",
        startup_settings: "Starteinstellungen", set_fs_desc: "Im Fenster-Vollbildmodus ausführen",
        opacity_label: "Hintergrund-Abdunklung", btn_reset_bg: "Hintergrund zurücksetzen",
        downloading: "HERUNTERLADEN...", ver_none: "Keine Versionen gefunden.", ver_error: "Fehler beim Laden der Versionen.",
        modpack_ver_title: "Modpack-Version",
        grp_favorites: "⭐ FAVORITEN", grp_my_packs: "MEINE PACKS", grp_installed: "INSTALLIERTE LOADER", grp_vanilla: "OFFIZIELLE VERSIONEN",
        mp_installing: "Modpack wird installiert...", mp_reading: "Paketdateien werden gelesen...", mp_progress: "Mod wird installiert", mp_done: "Modpack installiert!", mp_err: "Installation fehlgeschlagen.", mp_cancelled: "Installation abgebrochen.",
        status_no_account: "Bitte zuerst ein Konto hinzufügen!", status_downloading: "wird heruntergeladen", status_fabric_err: "Fabric-Installationsfehler.", status_forge_err: "Forge-Installationsfehler.", status_not_installed: "nicht installiert!", status_java_check: "Java wird geprüft...", status_java_err: "Java-Download-Fehler!", status_launching: "Wird gestartet...", status_dl_progress: "Herunterladen", status_opened: "Gestartet!", status_error: "Fehler: ",
        btn_manage_accounts: "Konten verwalten", acc_type_ms: "Microsoft", acc_type_offline: "Offline", accmgr_title: "Konten", accmgr_sub: "Wähle das zu verwendende Konto oder füge ein neues hinzu.", accmgr_empty: "Noch keine Konten.", accmgr_active: "AKTIV",
        btn_elyby: "Mit Ely.by anmelden", elyby_title: "Ely.by Anmeldung", elyby_desc: "Die Ely.by-Anmeldeseite wird in deinem Browser geöffnet. Du kehrst automatisch hierher zurück.", elyby_email_label: "E-Mail oder Benutzername", elyby_pass_label: "Passwort", btn_login: "Anmelden", acc_type_elyby: "Ely.by", elyby_connecting: "Warte auf Browser...", elyby_success: "Angemeldet als", btn_elyby_open: "Im Browser öffnen", elyby_waiting_browser: "Schließe die Anmeldung im Browser ab...",
        toast_mod_updated: "Mod aktualisiert!", toast_settings_saved: "Einstellungen gespeichert!", toast_pack_exported: "Pack exportiert!", toast_pack_imported: "Pack importiert!", toast_icon_changed: "Symbol geändert!",
        btn_check_updates: "Updates prüfen", updating: "Wird geprüft...", up_to_date: "Alles aktuell!", mods_updated: "Mods aktualisiert",
        confirm_delete_pack: "Pack löschen", confirm_delete_msg: "Sicher? Dies kann nicht rückgängig gemacht werden.", confirm_delete_files: "Alle Dateien löschen (Mods, Welten, Configs)", btn_delete_pack: "Löschen",
        playtime_label: "Spielzeit", playtime_hours: "Std", playtime_mins: "Min",
        btn_change_icon: "Symbol ändern", btn_open_folder: "Ordner öffnen", btn_export_pack: "Exportieren", btn_import_pack: "Pack importieren",
        console_title: "SPIELKONSOLE", console_empty: "Die Konsole erscheint hier, wenn das Spiel startet...", btn_close_console: "SCHLIESSEN",
        console_search_ph: "Logs durchsuchen...", console_filter_all: "ALLE", console_autoscroll: "Auto-Scroll", console_copy: "Kopieren", console_save: "In Datei speichern", console_clear: "LÖSCHEN", console_copied: "Logs kopiert!", console_saved: "Log-Datei gespeichert!", console_no_match: "Keine Treffer.",
        search_packs: "Packs suchen...",
        crash_title: "ABSTURZBERICHT ERKANNT", crash_desc: "Ein Absturzbericht der letzten Sitzung wurde gefunden.", btn_view_crash: "Bericht ansehen", btn_close_crash: "Schließen",
        update_available: "Neue Version verfügbar!", update_download: "Herunterladen", update_dismiss: "Schließen",
        no_mods_to_update: "Keine verfolgten Mods gefunden.", checking_mod: "Wird geprüft",
        screenshots_title: "SCREENSHOTS", screenshots_empty: "Noch keine Screenshots.", screenshot_delete: "Löschen", screenshot_open: "Ordner öffnen",
        mod_downloads: "Downloads", mod_follows: "Follower", mod_updated: "Aktualisiert", mod_created: "Erstellt", mod_versions: "Versionen", mod_categories: "Kategorien", mod_open_modrinth: "Auf Modrinth öffnen", mod_back: "← Zurück",
        status_ms_connecting: "Verbindung zu Microsoft...", status_ms_success: "Anmeldung erfolgreich", status_ms_cancelled: "Microsoft-Anmeldung abgebrochen.",
        installed_empty: "Kein installierter Inhalt gefunden.", installed_local_file: "Lokale Datei", installed_file_desc: "Physisch im Pack installierte Datei.", btn_delete_file: "DATEI LÖSCHEN", installed_version: "Installiert", installed_latest: "Neueste", btn_update: "Aktualisieren",
    },
    fr: {
        modal_off_title: "Ajouter un compte hors ligne", modal_off_desc: "Entrez le nom d'utilisateur qui apparaîtra dans le jeu.",
        ph_username: "Nom d'utilisateur", ph_packname: "Nom du Pack",
        btn_cancel: "Annuler", btn_add_system: "Ajouter", btn_save: "Enregistrer", btn_download: "Télécharger",
        modal_pack_title: "Créer un Modpack", modal_pack_desc: "Sélectionnez la version et le chargeur pour créer un pack isolé.",
        label_version: "Version du jeu :", label_loader: "Chargeur de mods :", pack_isolated_label: "Pack isolé — mondes, paramètres et captures sont stockés dans le dossier propre du pack au lieu du .minecraft original.",
        modal_ver_title: "Sélectionner une version", modal_ver_desc: "Les versions compatibles sont listées ci-dessous.", modal_ver_desc_manual: "Toutes les versions sont listées — choisissez celle qui correspond à votre version MC et loader.", modal_ver_gameversion_label: "Version du jeu", modal_ver_loader_label: "Plateforme",
        modal_ver_desc_fallback: "Aucune correspondance exacte. Toutes les versions disponibles sont affichées.",
        panel_user_info: "INFOS DU COMPTE", btn_offline: "Hors ligne", btn_ms_login: "Microsoft",
        nav_home: "ACCUEIL", nav_mods: "MODS", nav_installs: "INSTALLATIONS", nav_settings: "PARAMÈTRES",
        banner_desc: "Performance maximale avec MineCore", status_ready: "Système prêt...", status_loading: "Chargement des versions...",
        tab_packs: "Mes Packs", btn_new_pack: "NOUVEAU", def_folder: "Défaut",
        tab_mods: "Mods", tab_resourcepacks: "Textures", tab_modpacks: "Modpacks",
        title_trend_mods: "Mods populaires", title_trend_rp: "Textures populaires", title_trend_mp: "Modpacks populaires",
        search_mod: "Rechercher un mod...", search_rp: "Rechercher une texture...", search_mp: "Rechercher un modpack...",
        btn_search: "CHERCHER", no_result: "Aucun résultat.", loading: "Chargement...", searching: "Recherche...",
        btn_select_pack: "CHOISIR UN PACK", btn_delete: "SUPPRIMER", btn_install_pack: "INSTALLER",
        set_lang: "Langue / Language", set_min_ram: "RAM min", set_max_ram: "RAM max", set_java: "Chemin Java personnalisé", set_dir: "Répertoire du jeu",
        set_bg_img: "Choisir une image de fond", btn_save_settings: "ENREGISTRER", set_theme_title: "THÈME DE L'INTERFACE", set_theme_desc: "Nouvelle interface (désactivez pour revenir à l'apparence classique)", msg_saved: "Paramètres enregistrés !",
        panel_version: "PROFIL DE VERSION ACTIF", play_btn: "JOUER",
        btn_show_installed: "Fichiers Installés", select_pack_first: "Veuillez d'abord sélectionner un Pack personnalisé à gauche.",
        startup_settings: "Paramètres de démarrage", set_fs_desc: "Exécuter en plein écran fenêtré",
        opacity_label: "Assombrissement de l'arrière-plan", btn_reset_bg: "Réinitialiser le fond",
        downloading: "TÉLÉCHARGEMENT...", ver_none: "Aucune version trouvée.", ver_error: "Erreur lors du chargement des versions.",
        modpack_ver_title: "Version du Modpack",
        grp_favorites: "⭐ FAVORIS", grp_my_packs: "MES PACKS", grp_installed: "CHARGEURS INSTALLÉS", grp_vanilla: "VERSIONS OFFICIELLES",
        mp_installing: "Installation du modpack...", mp_reading: "Lecture des fichiers...", mp_progress: "Installation des mods", mp_done: "Modpack installé !", mp_err: "Échec de l'installation.", mp_cancelled: "Installation annulée.",
        status_no_account: "Veuillez d'abord ajouter un compte !", status_downloading: "en téléchargement", status_fabric_err: "Erreur d'installation Fabric.", status_forge_err: "Erreur d'installation Forge.", status_not_installed: "non installé !", status_java_check: "Vérification de Java...", status_java_err: "Erreur de téléchargement Java !", status_launching: "Lancement...", status_dl_progress: "Téléchargement", status_opened: "Lancé !", status_error: "Erreur : ",
        btn_manage_accounts: "Gérer les comptes", acc_type_ms: "Microsoft", acc_type_offline: "Hors ligne", accmgr_title: "Comptes", accmgr_sub: "Choisissez le compte à utiliser ou ajoutez-en un nouveau.", accmgr_empty: "Aucun compte pour le moment.", accmgr_active: "ACTIF",
        btn_elyby: "Se connecter avec Ely.by", elyby_title: "Connexion Ely.by", elyby_desc: "La page de connexion Ely.by s'ouvrira dans votre navigateur. Vous reviendrez ici automatiquement.", elyby_email_label: "E-mail ou nom d'utilisateur", elyby_pass_label: "Mot de passe", btn_login: "Se connecter", acc_type_elyby: "Ely.by", elyby_connecting: "En attente du navigateur...", elyby_success: "Connecté en tant que", btn_elyby_open: "Ouvrir dans le navigateur", elyby_waiting_browser: "Terminez la connexion dans votre navigateur...",
        toast_mod_updated: "Mod mis à jour !", toast_settings_saved: "Paramètres enregistrés !", toast_pack_exported: "Pack exporté !", toast_pack_imported: "Pack importé !", toast_icon_changed: "Icône changée !",
        btn_check_updates: "Vérifier les mises à jour", updating: "Vérification...", up_to_date: "Tout est à jour !", mods_updated: "mods mis à jour",
        confirm_delete_pack: "Supprimer le Pack", confirm_delete_msg: "Sûr ? Cette action est irréversible.", confirm_delete_files: "Supprimer aussi tous les fichiers (mods, mondes, configs)", btn_delete_pack: "Supprimer",
        playtime_label: "Temps de jeu", playtime_hours: "h", playtime_mins: "m",
        btn_change_icon: "Changer l'icône", btn_open_folder: "Ouvrir le dossier", btn_export_pack: "Exporter", btn_import_pack: "Importer un Pack",
        console_title: "CONSOLE DE JEU", console_empty: "La console apparaîtra ici au démarrage du jeu...", btn_close_console: "FERMER",
        console_search_ph: "Rechercher dans les logs...", console_filter_all: "TOUS", console_autoscroll: "Défilement auto", console_copy: "Copier", console_save: "Enregistrer", console_clear: "EFFACER", console_copied: "Logs copiés !", console_saved: "Fichier enregistré !", console_no_match: "Aucune correspondance.",
        search_packs: "Rechercher des packs...",
        crash_title: "RAPPORT DE CRASH DÉTECTÉ", crash_desc: "Un rapport de crash de la dernière session a été trouvé.", btn_view_crash: "Voir le rapport", btn_close_crash: "Ignorer",
        update_available: "Nouvelle version disponible !", update_download: "Télécharger", update_dismiss: "Ignorer",
        no_mods_to_update: "Aucun mod suivi trouvé.", checking_mod: "Vérification",
        screenshots_title: "CAPTURES D'ÉCRAN", screenshots_empty: "Pas encore de captures.", screenshot_delete: "Supprimer", screenshot_open: "Ouvrir le dossier",
        mod_downloads: "Téléchargements", mod_follows: "Abonnés", mod_updated: "Mis à jour", mod_created: "Créé", mod_versions: "Versions", mod_categories: "Catégories", mod_open_modrinth: "Ouvrir sur Modrinth", mod_back: "← Retour",
        status_ms_connecting: "Connexion à Microsoft...", status_ms_success: "Connexion réussie", status_ms_cancelled: "Connexion Microsoft annulée.",
        installed_empty: "Aucun contenu installé trouvé.", installed_local_file: "Fichier local", installed_file_desc: "Fichier physiquement installé dans le pack.", btn_delete_file: "SUPPRIMER LE FICHIER", installed_version: "Installé", installed_latest: "Dernière version", btn_update: "Mettre à jour",
    },
    ru: {
        modal_off_title: "Добавить офлайн аккаунт", modal_off_desc: "Введите имя пользователя, которое будет отображаться в игре.",
        ph_username: "Имя пользователя", ph_packname: "Имя сборки",
        btn_cancel: "Отмена", btn_add_system: "Добавить", btn_save: "Сохранить", btn_download: "Скачать",
        modal_pack_title: "Создать Modpack", modal_pack_desc: "Выберите версию и загрузчик для создания изолированного пака.",
        label_version: "Версия игры:", label_loader: "Загрузчик модов:", pack_isolated_label: "Изолированный пак — миры, настройки и скриншоты хранятся в собственной папке пака, а не в оригинальной .minecraft.",
        modal_ver_title: "Выбор версии", modal_ver_desc: "Ниже перечислены совместимые версии.", modal_ver_desc_manual: "Показаны все версии — выберите подходящую для вашей версии MC и загрузчика.", modal_ver_gameversion_label: "Версия игры", modal_ver_loader_label: "Платформа",
        modal_ver_desc_fallback: "Точного совпадения нет. Показаны все доступные версии.",
        panel_user_info: "ДАННЫЕ АККАУНТА", btn_offline: "Офлайн", btn_ms_login: "Microsoft",
        nav_home: "ГЛАВНАЯ", nav_mods: "МОДЫ", nav_installs: "УСТАНОВКИ", nav_settings: "НАСТРОЙКИ",
        banner_desc: "Максимальная производительность с MineCore", status_ready: "Система готова...", status_loading: "Загрузка версий...",
        tab_packs: "Мои сборки", btn_new_pack: "НОВАЯ СБОРКА", def_folder: "По умолчанию",
        tab_mods: "Моды", tab_resourcepacks: "Текстуры", tab_modpacks: "Сборки",
        title_trend_mods: "Популярные моды", title_trend_rp: "Популярные текстуры", title_trend_mp: "Популярные сборки",
        search_mod: "Поиск мода...", search_rp: "Поиск текстуры...", search_mp: "Поиск сборки...",
        btn_search: "ПОИСК", no_result: "Ничего не найдено.", loading: "Загрузка...", searching: "Поиск...",
        btn_select_pack: "ВЫБРАТЬ ПАК", btn_delete: "УДАЛИТЬ", btn_install_pack: "УСТАНОВИТЬ",
        set_lang: "Язык / Language", set_min_ram: "Мин ОЗУ", set_max_ram: "Макс ОЗУ", set_java: "Путь к Java", set_dir: "Директория игры",
        set_bg_img: "Выбрать фон", btn_save_settings: "СОХРАНИТЬ", set_theme_title: "ТЕМА ИНТЕРФЕЙСА", set_theme_desc: "Новый интерфейс (отключите, чтобы вернуться к классическому виду)", msg_saved: "Настройки сохранены!",
        panel_version: "АКТИВНЫЙ ПРОФИЛЬ ВЕРСИИ", play_btn: "ИГРАТЬ",
        btn_show_installed: "Установленные файлы", select_pack_first: "Пожалуйста, сначала выберите пользовательский пакет слева.",
        startup_settings: "Настройки запуска", set_fs_desc: "Запускать в оконном полноэкранном режиме",
        opacity_label: "Затемнение фона", btn_reset_bg: "Сбросить фон",
        downloading: "ЗАГРУЗКА...", ver_none: "Версии не найдены.", ver_error: "Ошибка загрузки версий.",
        modpack_ver_title: "Версия Modpack",
        grp_favorites: "⭐ ИЗБРАННОЕ", grp_my_packs: "МОИ ПАКИ", grp_installed: "УСТАНОВЛЕННЫЕ ЗАГРУЗЧИКИ", grp_vanilla: "ОФИЦИАЛЬНЫЕ ВЕРСИИ",
        mp_installing: "Установка модпака...", mp_reading: "Чтение файлов...", mp_progress: "Установка модов", mp_done: "Модпак установлен!", mp_err: "Ошибка установки.", mp_cancelled: "Установка отменена.",
        status_no_account: "Сначала добавьте аккаунт!", status_downloading: "загружается", status_fabric_err: "Ошибка установки Fabric.", status_forge_err: "Ошибка установки Forge.", status_not_installed: "не установлен!", status_java_check: "Проверка Java...", status_java_err: "Ошибка загрузки Java!", status_launching: "Запуск...", status_dl_progress: "Загрузка", status_opened: "Запущено!", status_error: "Ошибка: ",
        btn_manage_accounts: "Управление аккаунтами", acc_type_ms: "Microsoft", acc_type_offline: "Оффлайн", accmgr_title: "Аккаунты", accmgr_sub: "Выберите аккаунт для использования или добавьте новый.", accmgr_empty: "Аккаунтов пока нет.", accmgr_active: "АКТИВЕН",
        btn_elyby: "Войти через Ely.by", elyby_title: "Вход Ely.by", elyby_desc: "Страница входа Ely.by откроется в браузере. Вы автоматически вернётесь сюда после входа.", elyby_email_label: "Email или имя пользователя", elyby_pass_label: "Пароль", btn_login: "Войти", acc_type_elyby: "Ely.by", elyby_connecting: "Ожидание браузера...", elyby_success: "Выполнен вход как", btn_elyby_open: "Открыть в браузере", elyby_waiting_browser: "Завершите вход в браузере...",
        toast_mod_updated: "Мод обновлён!", toast_settings_saved: "Настройки сохранены!", toast_pack_exported: "Пак экспортирован!", toast_pack_imported: "Пак импортирован!", toast_icon_changed: "Иконка изменена!",
        btn_check_updates: "Проверить обновления", updating: "Проверяется...", up_to_date: "Всё актуально!", mods_updated: "модов обновлено",
        confirm_delete_pack: "Удалить Пак", confirm_delete_msg: "Уверены? Это действие нельзя отменить.", confirm_delete_files: "Удалить все файлы (моды, миры, конфиги)", btn_delete_pack: "Удалить",
        playtime_label: "Время в игре", playtime_hours: "ч", playtime_mins: "м",
        btn_change_icon: "Сменить иконку", btn_open_folder: "Открыть папку", btn_export_pack: "Экспорт", btn_import_pack: "Импорт Пака",
        console_title: "КОНСОЛЬ ИГРЫ", console_empty: "Консоль появится здесь при запуске игры...", btn_close_console: "ЗАКРЫТЬ",
        console_search_ph: "Поиск в логах...", console_filter_all: "ВСЕ", console_autoscroll: "Автопрокрутка", console_copy: "Копировать", console_save: "Сохранить в файл", console_clear: "ОЧИСТИТЬ", console_copied: "Логи скопированы!", console_saved: "Файл сохранён!", console_no_match: "Совпадений нет.",
        search_packs: "Поиск паков...",
        crash_title: "ОБНАРУЖЕН ОТЧЁТ О СБОЕ", crash_desc: "Найден отчёт о сбое последней сессии.", btn_view_crash: "Посмотреть отчёт", btn_close_crash: "Закрыть",
        update_available: "Доступна новая версия!", update_download: "Скачать", update_dismiss: "Закрыть",
        no_mods_to_update: "Отслеживаемые моды не найдены.", checking_mod: "Проверяется",
        screenshots_title: "СКРИНШОТЫ", screenshots_empty: "Скриншотов пока нет.", screenshot_delete: "Удалить", screenshot_open: "Открыть папку",
        mod_downloads: "Загрузок", mod_follows: "Подписчики", mod_updated: "Обновлено", mod_created: "Создано", mod_versions: "Версии", mod_categories: "Категории", mod_open_modrinth: "Открыть на Modrinth", mod_back: "← Назад",
        status_ms_connecting: "Подключение к Microsoft...", status_ms_success: "Вход выполнен", status_ms_cancelled: "Вход через Microsoft отменён.",
        installed_empty: "Установленный контент не найден.", installed_local_file: "Локальный файл", installed_file_desc: "Физически установленный файл в паке.", btn_delete_file: "УДАЛИТЬ ФАЙЛ", installed_version: "Установлена", installed_latest: "Последняя", btn_update: "Обновить",
    }
};

let currentLang = localStorage.getItem('minecore_lang') || 'en';
function t(key) { return translations[currentLang][key] || key; }

function updateUILanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) el.placeholder = t(key);
        else el.innerText = t(key);
    });
    const setLang = document.getElementById('set-language');
    if(setLang) setLang.value = currentLang;
    updateSearchPlaceholder();
    loadPacks();
    loadAllVersions();
    renderAccounts();
    if(opacitySlider) updateOpacityEffects(opacitySlider.value);
}

document.getElementById('set-language')?.addEventListener('change', (e) => {
    currentLang = e.target.value; localStorage.setItem('minecore_lang', currentLang); updateUILanguage();
});

const launcherBg = document.getElementById('launcher-bg');
const bgOverlay = document.getElementById('bg-overlay');
const opacitySlider = document.getElementById('opacity-slider');
const opacityLabel = document.getElementById('opacity-label');
const bgUpload = document.getElementById('bg-upload');
const bgResetBtn = document.getElementById('bg-reset-btn');

const DEFAULT_BG = 'assets/default_bg.png';

function loadBackgroundSettings() {
    const savedBg = localStorage.getItem('minecore_bg');
    if (launcherBg) launcherBg.style.backgroundImage = `url(${savedBg || DEFAULT_BG})`;
    
    let savedOpacity = localStorage.getItem('minecore_opacity');
    if(savedOpacity === null) savedOpacity = 75; 
    if(opacitySlider) opacitySlider.value = savedOpacity;
    updateOpacityEffects(savedOpacity);
}

function updateOpacityEffects(value) {
    const alpha = (value) / 100;
    if(bgOverlay) bgOverlay.style.backgroundColor = `rgba(8, 9, 10, ${alpha})`;
    if(opacityLabel) opacityLabel.innerText = `${t('opacity_label')}: ${value}%`;
}

opacitySlider?.addEventListener('input', (e) => updateOpacityEffects(e.target.value));
opacitySlider?.addEventListener('change', (e) => localStorage.setItem('minecore_opacity', e.target.value));

bgUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const bgUrl = event.target.result;
            if(launcherBg) launcherBg.style.backgroundImage = `url(${bgUrl})`;
            localStorage.setItem('minecore_bg', bgUrl);
        };
        reader.readAsDataURL(file);
    }
});

bgResetBtn?.addEventListener('click', () => {
    localStorage.removeItem('minecore_bg');
    if(launcherBg) launcherBg.style.backgroundImage = `url(${DEFAULT_BG})`;
});

const playButton = document.getElementById('play-button');
const statusText = document.getElementById('status-text');
const accountModal = document.getElementById('account-modal');
const newOfflineNameInput = document.getElementById('new-offline-name');
const customSelect = document.getElementById('main-version-select');
const customTrigger = document.getElementById('main-version-trigger');
const customOptions = document.getElementById('main-version-options');
const customIcon = document.getElementById('main-version-icon');
const customText = document.getElementById('main-version-text');
const packModal = document.getElementById('pack-modal');
const newPackNameInput = document.getElementById('new-pack-name-input');
const modalVersionSelect = document.getElementById('modal-version-select');
const modalLoaderSelect = document.getElementById('modal-loader-select');
const modVersionModal = document.getElementById('mod-version-modal');
const modVersionSelect = document.getElementById('mod-version-select');
const modVersionConfirm = document.getElementById('mod-version-confirm');
const packsList = document.getElementById('packs-list');
const modSearchInput = document.getElementById('mod-search-input');
const modResultsGrid = document.getElementById('mod-results');
const installsGrid = document.getElementById('installs-grid');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

let activePack = 'Varsayılan';
let isEditingPack = false;
let editingPackName = '';
let currentModDownloadId = null; 
let selectedVersionValue = ''; 

let currentModrinthType = 'mod'; 
let currentQuery = '';
let currentModPage = 0;
const MODS_PER_PAGE = 20;
const mrTabs = document.querySelectorAll('.mr-tab');
const pagePrevBtn = document.getElementById('page-prev-btn');
const pageNextBtn = document.getElementById('page-next-btn');
const pageIndicator = document.getElementById('page-indicator');

let accounts = [];
try {
    const saved = JSON.parse(localStorage.getItem('minecore_accounts'));
    if (Array.isArray(saved)) accounts = saved;
} catch(e) {}

let activeAccountId = localStorage.getItem('minecore_active_account');
if (accounts.length > 0 && !accounts.find(a => a.id === activeAccountId)) {
    activeAccountId = accounts[0].id;
}

function getDefaultMinecraftPath() {
    switch (os.platform()) {
        case 'win32': return path.join(process.env.APPDATA, '.minecraft');
        case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support', 'minecraft');
        default: return path.join(os.homedir(), '.minecraft');
    }
}

let savedRoot = localStorage.getItem('minecore_root_path');
const originalPath = (savedRoot && savedRoot.trim() !== '') ? savedRoot : getDefaultMinecraftPath();
const packsDir = path.join(originalPath, 'minecore_packs');
if (!fs.existsSync(packsDir)) fs.mkdirSync(packsDir, { recursive: true });

function getIconForVersion(vName) {
    const v = vName.toLowerCase();
    if(v.includes('forge')) return 'assets/forge.png';
    if(v.includes('fabric')) return 'assets/fabric.png';
    if(v.includes('optifine')) return 'assets/optifine.png';
    return 'assets/vanilla.png';
}

function getIconForPackLoader(loader) {
    if(loader === 'forge') return 'assets/forge.png';
    if(loader === 'neoforge') return 'assets/neoforge.png';
    if(loader === 'fabric') return 'assets/fabric.png';
    return 'assets/vanilla.png';
}

function getPackConfig(packName) {
    if (packName === 'Varsayılan') return { version: '1.20.1', loader: 'vanilla' };
    const configPath = path.join(packsDir, packName, 'minecore_config.json');
    if (fs.existsSync(configPath)) return JSON.parse(fs.readFileSync(configPath));
    return { version: '1.20.1', loader: 'vanilla' };
}

function getInstalledMods() {
    if (activePack === 'Varsayılan') return {};
    const tracker = path.join(packsDir, activePack, 'minecore_mods.json');
    if (fs.existsSync(tracker)) return JSON.parse(fs.readFileSync(tracker));
    return {};
}

function saveInstalledMod(projId, filename) {
    if (activePack === 'Varsayılan') return;
    const trackerPath = path.join(packsDir, activePack, 'minecore_mods.json');
    let mods = getInstalledMods();
    mods[projId] = filename;
    fs.writeFileSync(trackerPath, JSON.stringify(mods));
}

function removeInstalledMod(projId) {
    if (activePack === 'Varsayılan') return;
    let mods = getInstalledMods();
    const filename = mods[projId];
    if (filename) {
        const filePath = path.join(packsDir, activePack, 'mods', filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        delete mods[projId];
        const trackerPath = path.join(packsDir, activePack, 'minecore_mods.json');
        fs.writeFileSync(trackerPath, JSON.stringify(mods));
    }
}

function syncSettings(packDir) {
    const config = (() => { try { return JSON.parse(fs.readFileSync(path.join(packDir, 'minecore_config.json'))); } catch(e) { return {}; } })();
    const isIsolated = config.isolated === true;

    if (!isIsolated) {
        const filesToSync = ['options.txt', 'optionsof.txt', 'servers.dat', 'hotbar.nbt'];
        filesToSync.forEach(file => {
            const sourceFile = path.join(originalPath, file);
            const destFile = path.join(packDir, file);
            if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
                try { fs.copyFileSync(sourceFile, destFile); } catch (e) { console.error(e); }
            }
        });
    }

    const foldersToLink   = ['saves', 'resourcepacks', 'shaderpacks', 'schematics'];
    const foldersToIsolate = ['saves', 'resourcepacks', 'shaderpacks', 'schematics', 'config', 'screenshots'];

    if (isIsolated) {
        foldersToIsolate.forEach(folder => {
            const destFolder = path.join(packDir, folder);
            if (fs.existsSync(destFolder) && fs.lstatSync(destFolder).isSymbolicLink()) {
                fs.unlinkSync(destFolder);
            }
            if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
        });
    } else {
        foldersToLink.forEach(folder => {
            const sourceFolder = path.join(originalPath, folder);
            const destFolder = path.join(packDir, folder);
            if (!fs.existsSync(sourceFolder)) fs.mkdirSync(sourceFolder, { recursive: true });
            try {
                if (fs.existsSync(destFolder)) {
                    if (fs.lstatSync(destFolder).isSymbolicLink()) return;
                    fs.rmSync(destFolder, { recursive: true, force: true });
                }
                const linkType = os.platform() === 'win32' ? 'junction' : 'dir';
                fs.symlinkSync(sourceFolder, destFolder, linkType);
            } catch (e) { console.error(`${folder} köprülenemedi:`, e); }
        });
    }
}

const ELYBY_LOGO_PATH = 'assets/elyby.png';

function getAccountIcon(acc) {
    if (acc.type === 'ms') return 'assets/microsoft.png';
    if (acc.type === 'elyby') return ELYBY_LOGO_PATH;
    return 'assets/steve.png';
}

function getElybyAvatarUrl(name) {
    return `https://skinsystem.ely.by/avatars/${encodeURIComponent(name)}/32`;
}

function getAccountIconFallback(acc) {
    if (acc.type === 'elyby') return ELYBY_LOGO_PATH;
    return 'assets/steve.png';
}

function getAccountTypeName(acc) {
    if (acc.type === 'ms') return t('acc_type_ms');
    if (acc.type === 'elyby') return t('acc_type_elyby');
    return t('acc_type_offline');
}

function renderAccounts() {
    const summaryIcon = document.getElementById('account-summary-icon');
    const summaryName = document.getElementById('account-summary-name');
    const summaryType = document.getElementById('account-summary-type');
    const listContainer = document.getElementById('account-manager-list');

    if (!accounts.some(a => a.id === activeAccountId) && accounts.length > 0) activeAccountId = accounts[0].id;

    const active = accounts.find(a => a.id === activeAccountId);
    if (!active) {
        if(summaryIcon) summaryIcon.src = 'assets/steve.png';
        if(summaryName) { summaryName.innerText = t('status_no_account'); summaryName.style.color = '#ff4757'; }
        if(summaryType) summaryType.innerText = '';
    } else {
        if(summaryName) { summaryName.innerText = active.name; summaryName.style.color = '#fff'; }
        if(summaryType) summaryType.innerText = getAccountTypeName(active);
        if(summaryIcon) {
            summaryIcon.src = getAccountIcon(active);
            if (active.type === 'elyby') {
                const avatarUrl = getElybyAvatarUrl(active.name);
                const img = new Image();
                img.onload = () => { summaryIcon.src = avatarUrl; };
                img.src = avatarUrl;
            }
            if (active.type === 'ms') {
                const msAvatarUrl = `https://minotar.net/helm/${encodeURIComponent(active.data?.uuid || active.name)}/64.png`;
                const msImg = new Image();
                msImg.onload = () => { if (accounts.find(a => a.id === activeAccountId) === active) summaryIcon.src = msAvatarUrl; };
                msImg.src = msAvatarUrl;
            }
        }
    }

    if (listContainer) {
        listContainer.innerHTML = '';
        if (accounts.length === 0) {
            listContainer.innerHTML = `<div class="account-manager-empty">${t('accmgr_empty')}</div>`;
        } else {
            accounts.forEach(acc => {
                const iconSrc = getAccountIcon(acc);
                const fallbackSrc = getAccountIconFallback(acc);
                const isActive = acc.id === activeAccountId;
                const badge = acc.type === 'elyby'
                    ? `<span class="acc-badge" style="background:rgba(30,136,229,0.2);color:#64b5f6;">${t('acc_type_elyby')}</span>`
                    : acc.type === 'ms'
                        ? `<span class="acc-badge ms">${t('acc_type_ms')}</span>`
                        : `<span class="acc-badge offline">${t('acc_type_offline')}</span>`;
                const item = document.createElement('div');
                item.className = 'account-manager-item' + (isActive ? ' active' : '');
                item.innerHTML = `
                    <img src="${iconSrc}" class="account-manager-avatar" onerror="this.onerror=null;this.src='${fallbackSrc}'">
                    <div class="account-manager-info">
                        <span class="acc-name">${acc.name}</span>
                        ${badge}
                    </div>
                    ${isActive ? `<span class="acc-active-tag">${t('accmgr_active')}</span>` : ''}
                    <button class="account-manager-del" title="${t('btn_delete')}">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
                    </button>`;

                if (acc.type === 'elyby') {
                    const avatarUrl = getElybyAvatarUrl(acc.name);
                    const img = new Image();
                    const imgEl = item.querySelector('.account-manager-avatar');
                    img.onload = () => { if(imgEl) imgEl.src = avatarUrl; };
                    img.src = avatarUrl;
                }
                item.addEventListener('click', () => { activeAccountId = acc.id; saveAccounts(); });
                item.querySelector('.account-manager-del').addEventListener('click', (e) => {
                    e.stopPropagation();
                    accounts = accounts.filter(a => a.id !== acc.id);
                    if (activeAccountId === acc.id) activeAccountId = accounts.length > 0 ? accounts[0].id : null;
                    saveAccounts();
                });
                listContainer.appendChild(item);
            });
        }
    }
}

function saveAccounts() {
    localStorage.setItem('minecore_accounts', JSON.stringify(accounts));
    localStorage.setItem('minecore_active_account', activeAccountId);
    renderAccounts();
}

const accountManagerModal = document.getElementById('account-manager-modal');
document.getElementById('open-account-manager-btn')?.addEventListener('click', () => { if(accountManagerModal) accountManagerModal.style.display = 'flex'; });
document.getElementById('account-summary-trigger')?.addEventListener('click', () => { if(accountManagerModal) accountManagerModal.style.display = 'flex'; });
document.getElementById('account-manager-close')?.addEventListener('click', () => { if(accountManagerModal) accountManagerModal.style.display = 'none'; });
accountManagerModal?.addEventListener('click', (e) => { if (e.target === accountManagerModal) accountManagerModal.style.display = 'none'; });

document.getElementById('accmgr-add-offline-btn')?.addEventListener('click', () => {
    if(accountModal) accountModal.style.display = 'flex';
    if(newOfflineNameInput) { newOfflineNameInput.value = ''; newOfflineNameInput.focus(); }
});
document.getElementById('acc-cancel-btn')?.addEventListener('click', () => { if(accountModal) accountModal.style.display = 'none'; });
document.getElementById('acc-confirm-btn')?.addEventListener('click', () => {
    const name = newOfflineNameInput?.value?.trim();
    if(name) {
        accounts.push({ id: Date.now().toString(), type: 'offline', name, data: null });
        activeAccountId = accounts[accounts.length - 1].id;
        saveAccounts();
        if(accountModal) accountModal.style.display = 'none';
    }
});

const elybyModal = document.getElementById('elyby-modal');
document.getElementById('accmgr-elyby-btn')?.addEventListener('click', () => {
    if(elybyModal) elybyModal.style.display = 'flex';
    const statusEl = document.getElementById('elyby-status');
    if(statusEl) statusEl.style.display = 'none';
});
document.getElementById('elyby-cancel-btn')?.addEventListener('click', () => { if(elybyModal) elybyModal.style.display = 'none'; });
document.getElementById('elyby-confirm-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('elyby-confirm-btn');
    const statusEl = document.getElementById('elyby-status');
    const orig = btn.innerText;
    btn.innerText = t('elyby_connecting'); btn.disabled = true;
    if(statusEl) { statusEl.innerText = t('elyby_waiting_browser'); statusEl.style.display = 'block'; }
    try {
        const res = await ipcRenderer.invoke('elyby-login');
        if (!res.ok) { showToast(res.error || 'Ely.by giriş hatası.', 'error', 5000); return; }
        const data = res.data;
        accounts.push({
            id: Date.now().toString(), type: 'elyby', name: data.name,
            data: { access_token: data.access_token, refresh_token: data.refresh_token, uuid: data.uuid, name: data.name }
        });
        activeAccountId = accounts[accounts.length - 1].id;
        saveAccounts();
        if(elybyModal) elybyModal.style.display = 'none';
        showToast(`${t('elyby_success')} ${data.name}`, 'success');
    } catch(e) {
        showToast(e.message, 'error', 5000);
    } finally {
        btn.innerText = orig; btn.disabled = false;
        if(statusEl) statusEl.style.display = 'none';
    }
});

document.getElementById('accmgr-ms-login-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('accmgr-ms-login-btn');
    const origHtml = btn.innerHTML; btn.innerHTML = `<span>${t('status_ms_connecting')}</span>`; btn.disabled = true;
    try {
        const mclcData = await ipcRenderer.invoke('ms-login');
        accounts.push({ id: Date.now().toString(), type: 'ms', name: mclcData.name, data: mclcData });
        activeAccountId = accounts[accounts.length - 1].id;
        saveAccounts();
        showToast(`${t('status_ms_success')}: ${mclcData.name}`, 'success');
    } catch(e) { showToast(t('status_ms_cancelled'), 'warn'); }
    finally { btn.innerHTML = origHtml; btn.disabled = false; }
});

customTrigger?.addEventListener('click', () => customSelect?.classList.toggle('open'));
document.addEventListener('click', (e) => { if (customSelect && !customSelect.contains(e.target)) customSelect.classList.remove('open'); });

window.selectCustomOption = function(value, text, iconSrc) {
    selectedVersionValue = value; 
    if(customText) customText.innerText = text; 
    if(customIcon) { customIcon.src = iconSrc; customIcon.style.display = 'block'; }
    customSelect?.classList.remove('open'); localStorage.setItem('minecore_version', value);

    const ptKey = value.startsWith('PACK:') ? value.replace('PACK:', '') : value;
    const pt = getPlaytime(ptKey);
    let ptEl = document.getElementById('version-playtime');
    if (!ptEl) {
        ptEl = document.createElement('div');
        ptEl.id = 'version-playtime';
        ptEl.style.cssText = 'font-size:12px;color:#9aa4af;margin-top:8px;letter-spacing:0.3px;display:flex;align-items:center;gap:6px;';
        const trigger = document.getElementById('main-version-trigger');
        if (trigger) trigger.parentElement.appendChild(ptEl);
    }
    if (pt) {
        ptEl.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#00e676" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg><span>${t('playtime_label')}:</span><span style="color:#e6edf3;font-weight:700;">${pt}</span>`;
        ptEl.style.display = 'flex';
    } else {
        ptEl.style.display = 'none';
    }
};

document.getElementById('nav-home')?.addEventListener('click', () => document.getElementById('nav-play')?.click());

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pages.forEach(p => p.classList.remove('active'));
        const target = btn.id.replace('nav-', 'page-');
        const targetEl = document.getElementById(target);
        if(targetEl) targetEl.classList.add('active');
        
        if (target === 'page-mods') { loadPacks(); if(modSearchInput && modSearchInput.value.trim() === '') document.getElementById('mod-search-btn')?.click(); }
        if (target === 'page-installs') renderInstallations();
    });
});

window.onload = () => {
    updateUILanguage();
    loadBackgroundSettings();
    const minRam = document.getElementById('set-min-ram'); if(minRam) minRam.value = localStorage.getItem('minecore_min_ram') || '2G';
    const maxRam = document.getElementById('set-max-ram'); if(maxRam) maxRam.value = localStorage.getItem('minecore_max_ram') || '4G';
    const javaPath = document.getElementById('set-java-path'); if(javaPath) javaPath.value = localStorage.getItem('minecore_java_path') || '';
    const rootPath = document.getElementById('set-root-path'); if(rootPath) rootPath.value = localStorage.getItem('minecore_root_path') || getDefaultMinecraftPath();
    renderAccounts();
    injectPackSearch();

    if (!fs.existsSync(originalPath)) {
        showSetupWizard();
    }

    checkForUpdates();
};

const CURRENT_VERSION = require('./package.json').version || '1.0.0';
const GITHUB_REPO = 'wafires/MineCore';

async function checkForUpdates() {
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        if (!res.ok) return;
        const data = await res.json();
        const latestVersion = (data.tag_name || '').replace(/^v/, '');
        if (!latestVersion) return;

        if (compareVersions(latestVersion, CURRENT_VERSION) > 0) {
            showUpdateBanner(latestVersion, data.html_url);
        }
    } catch (e) {
        appendConsole(`Güncelleme kontrolü başarısız: ${e.message}`, 'info');
    }
}

function compareVersions(a, b) {
    const pa = a.split('.').map(n => parseInt(n) || 0);
    const pb = b.split('.').map(n => parseInt(n) || 0);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i]||0) - (pb[i]||0);
        if (diff !== 0) return diff > 0 ? 1 : -1;
    }
    return 0;
}

function showUpdateBanner(version, url) {
    if (document.getElementById('update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:9996;background:rgba(0,230,118,0.1);border-bottom:2px solid rgba(0,230,118,0.4);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(10px);';
    banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#00e676" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span style="color:#00e676;font-weight:800;font-size:13px;letter-spacing:0.5px;">${t('update_available')}</span>
            <span style="color:#aaa;font-size:12px;">v${version}</span>
        </div>
        <div style="display:flex;gap:10px;">
            <button class="ms-btn vyra-btn" style="font-size:11px;padding:6px 14px;" onclick="require('electron').shell.openExternal('${url}')">${t('update_download')}</button>
            <button class="ms-btn logout-btn" style="font-size:11px;padding:6px 12px;" onclick="document.getElementById('update-banner').style.display='none'">${t('update_dismiss')}</button>
        </div>`;
    document.body.appendChild(banner);
}

function showSetupWizard() {
    const defaultPath = getDefaultMinecraftPath();
    const overlay = document.createElement('div');
    overlay.id = 'setup-wizard';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.97);backdrop-filter:blur(20px);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
        <div style="width:520px;background:rgba(15,17,20,0.98);border:1px solid rgba(0,230,118,0.2);border-radius:16px;padding:40px;box-shadow:0 30px 80px rgba(0,0,0,0.8);">
            <div style="text-align:center;margin-bottom:32px;">
                <div style="font-size:36px;font-weight:900;letter-spacing:3px;color:#fff;margin-bottom:8px;">MineCore</div>
                <div style="font-size:13px;color:#666;letter-spacing:1px;">KURULUM SİHİRBAZI</div>
            </div>

            <div id="wizard-steps" style="display:flex;gap:8px;margin-bottom:28px;">
                <div class="wstep active" data-step="0" style="flex:1;height:3px;border-radius:2px;background:#00e676;transition:0.3s;"></div>
                <div class="wstep" data-step="1" style="flex:1;height:3px;border-radius:2px;background:#222;transition:0.3s;"></div>
                <div class="wstep" data-step="2" style="flex:1;height:3px;border-radius:2px;background:#222;transition:0.3s;"></div>
                <div class="wstep" data-step="3" style="flex:1;height:3px;border-radius:2px;background:#222;transition:0.3s;"></div>
            </div>

            <div id="wizard-content"></div>
        </div>`;
    document.body.appendChild(overlay);
    showWizardStep(0);
}

function showWizardStep(step) {
    const content = document.getElementById('wizard-content');
    document.querySelectorAll('.wstep').forEach(el => {
        el.style.background = parseInt(el.dataset.step) <= step ? '#00e676' : '#222';
    });

    if (step === 0) {
        content.innerHTML = `
            <h3 style="font-size:18px;font-weight:800;color:#fff;margin-bottom:10px;">Önemli Bilgilendirme ⚠️</h3>
            <div style="background:rgba(255,179,0,0.06);border:1px solid rgba(255,179,0,0.2);border-radius:10px;padding:16px;margin-bottom:20px;">
                <p style="color:#ccc;font-size:13px;line-height:1.7;margin:0;">
                    MineCore, <strong style="color:#fff">Mojang Studios</strong> veya <strong style="color:#fff">Microsoft</strong> ile bağlantılı değildir.
                    Bağımsız, topluluk tarafından geliştirilen bir Minecraft launcher'ıdır.
                </p>
            </div>
            <p style="color:#888;font-size:12.5px;line-height:1.7;margin-bottom:24px;">
                Bu uygulamayı kullanarak; Minecraft'ı oynamak için geçerli bir hesaba (Microsoft veya çevrimdışı) sahip olman gerektiğini,
                launcher'ın mod/modpack indirme işlemlerinin üçüncü taraf Modrinth API'si üzerinden yapıldığını ve
                MineCore geliştiricilerinin oyun içeriğinden sorumlu olmadığını kabul etmiş olursun.
            </p>
            <div style="display:flex;align-items:flex-start;gap:10px;background:rgba(0,0,0,0.3);border:1px solid #222;border-radius:8px;padding:14px;margin-bottom:24px;">
                <input type="checkbox" id="wizard-disclaimer-check" style="width:16px;height:16px;margin-top:2px;accent-color:#00e676;cursor:pointer;flex-shrink:0;">
                <label for="wizard-disclaimer-check" style="font-size:12.5px;color:#aaa;cursor:pointer;line-height:1.5;">Yukarıdaki bilgilendirmeyi okudum ve kabul ediyorum.</label>
            </div>
            <div style="display:flex;gap:10px;">
                <button id="wizard-disclaimer-next" class="ms-btn vyra-btn" style="flex:1;padding:14px;font-size:14px;font-weight:800;opacity:0.5;" disabled onclick="showWizardStep(1)">Devam Et →</button>
            </div>`;
        const check = document.getElementById('wizard-disclaimer-check');
        const nextBtn = document.getElementById('wizard-disclaimer-next');
        check?.addEventListener('change', () => {
            nextBtn.disabled = !check.checked;
            nextBtn.style.opacity = check.checked ? '1' : '0.5';
        });
        return;
    }

    if (step === 1) {
        content.innerHTML = `
            <h3 style="font-size:18px;font-weight:800;color:#fff;margin-bottom:10px;">Hoş Geldin! 👋</h3>
            <p style="color:#888;font-size:13px;line-height:1.7;margin-bottom:24px;">
                Bilgisayarında <strong style="color:#fff">.minecraft</strong> klasörü bulunamadı.<br>
                MineCore, Minecraft'ı ve Java'yı otomatik olarak kuracak.<br>
                Önce Minecraft'ın nereye kurulacağını seç.
            </p>
            <div style="margin-bottom:16px;">
                <label style="display:block;color:#aaa;font-size:12px;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Kurulum Klasörü</label>
                <div style="display:flex;gap:8px;">
                    <input type="text" id="wizard-path" value="${getDefaultMinecraftPath()}" 
                        style="flex:1;padding:12px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;outline:none;font-size:13px;">
                    <button class="ms-btn" style="padding:12px 16px;flex-shrink:0;" onclick="window._wizardBrowse()">📁</button>
                </div>
                <p style="color:#555;font-size:11px;margin-top:6px;">Öneri: ${getDefaultMinecraftPath()}</p>
            </div>
            <div style="display:flex;gap:10px;margin-top:24px;">
                <button class="ms-btn" style="flex:1;padding:14px;font-size:13px;" onclick="showWizardStep(0)">← Geri</button>
                <button class="ms-btn vyra-btn" style="flex:2;padding:14px;font-size:14px;font-weight:800;" onclick="window._wizardNext(1)">Devam Et →</button>
            </div>`;
    } else if (step === 2) {
        content.innerHTML = `
            <h3 style="font-size:18px;font-weight:800;color:#fff;margin-bottom:10px;">Dil & RAM Ayarları</h3>
            <p style="color:#888;font-size:13px;margin-bottom:24px;">Başlamadan önce birkaç temel ayar yapalım.</p>
            <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px;">
                <div>
                    <label style="display:block;color:#aaa;font-size:12px;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Dil / Language</label>
                    <select id="wizard-lang" class="modal-select" style="margin-bottom:0;">
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="ru">🇷🇺 Русский</option>
                    </select>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div>
                        <label style="display:block;color:#aaa;font-size:12px;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Min RAM</label>
                        <select id="wizard-min-ram" class="modal-select" style="margin-bottom:0;">
                            <option value="512M">512 MB</option>
                            <option value="1G">1 GB</option>
                            <option value="2G" selected>2 GB</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block;color:#aaa;font-size:12px;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Max RAM</label>
                        <select id="wizard-max-ram" class="modal-select" style="margin-bottom:0;">
                            <option value="2G">2 GB</option>
                            <option value="3G">3 GB</option>
                            <option value="4G" selected>4 GB</option>
                            <option value="6G">6 GB</option>
                            <option value="8G">8 GB</option>
                            <option value="12G">12 GB</option>
                            <option value="16G">16 GB</option>
                        </select>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:10px;margin-top:24px;">
                <button class="ms-btn" style="flex:1;padding:14px;font-size:13px;" onclick="showWizardStep(1)">← Geri</button>
                <button class="ms-btn vyra-btn" style="flex:2;padding:14px;font-size:14px;font-weight:800;" onclick="window._wizardNext(2)">Devam Et →</button>
            </div>`;
    } else if (step === 3) {
        const installPath = localStorage.getItem('minecore_root_path') || getDefaultMinecraftPath();
        content.innerHTML = `
            <h3 style="font-size:18px;font-weight:800;color:#fff;margin-bottom:10px;">Hazır! 🎮</h3>
            <p style="color:#888;font-size:13px;line-height:1.7;margin-bottom:20px;">Her şey ayarlandı. İlk oyun başlatmada Minecraft dosyaları otomatik indirilecek.</p>
            <div style="background:rgba(0,230,118,0.05);border:1px solid rgba(0,230,118,0.15);border-radius:8px;padding:16px;margin-bottom:24px;">
                <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#666;">Kurulum yolu</span>
                        <span style="color:#aaa;max-width:280px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${installPath}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#666;">Min / Max RAM</span>
                        <span style="color:#aaa;">${localStorage.getItem('minecore_min_ram')||'2G'} / ${localStorage.getItem('minecore_max_ram')||'4G'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#666;">Dil</span>
                        <span style="color:#aaa;">${({'tr':'Türkçe','en':'English','de':'Deutsch','fr':'Français','es':'Español','ru':'Русский'})[currentLang]}</span>
                    </div>
                    <div style="border-top:1px solid #1a1a1a;padding-top:8px;margin-top:4px;">
                        <div style="display:flex;align-items:center;gap:8px;color:#00e676;font-size:12px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                            Java ilk oyun başlatmada otomatik indirilecek
                        </div>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:10px;">
                <button class="ms-btn" style="flex:1;padding:14px;font-size:13px;" onclick="showWizardStep(2)">← Geri</button>
                <button class="ms-btn vyra-btn" style="flex:2;padding:14px;font-size:15px;font-weight:900;letter-spacing:2px;" onclick="window._wizardFinish()">BAŞLAT 🚀</button>
            </div>`;
    }
}

window._wizardBrowse = function() {
    try {
        const { dialog } = require('@electron/remote');
        const result = dialog.showOpenDialogSync({ properties: ['openDirectory', 'createDirectory'] });
        if (result && result[0]) document.getElementById('wizard-path').value = result[0];
    } catch(e) { showToast('Klasör seçimi açılamadı', 'error'); }
};

window._wizardNext = function(step) {
    if (step === 1) {
        const p = document.getElementById('wizard-path')?.value?.trim();
        if (!p) { showToast('Lütfen bir klasör seçin', 'warn'); return; }
        localStorage.setItem('minecore_root_path', p);
        const rootInput = document.getElementById('set-root-path');
        if (rootInput) rootInput.value = p;
        showWizardStep(2);
    } else if (step === 2) {
        const lang = document.getElementById('wizard-lang')?.value || 'tr';
        const minRam = document.getElementById('wizard-min-ram')?.value || '2G';
        const maxRam = document.getElementById('wizard-max-ram')?.value || '4G';
        localStorage.setItem('minecore_lang', lang);
        localStorage.setItem('minecore_min_ram', minRam);
        localStorage.setItem('minecore_max_ram', maxRam);
        currentLang = lang;
        updateUILanguage();
        const minRamInput = document.getElementById('set-min-ram'); if(minRamInput) minRamInput.value = minRam;
        const maxRamInput = document.getElementById('set-max-ram'); if(maxRamInput) maxRamInput.value = maxRam;
        showWizardStep(3);
    }
};

window._wizardFinish = function() {
    const installPath = localStorage.getItem('minecore_root_path') || getDefaultMinecraftPath();
    if (!fs.existsSync(installPath)) fs.mkdirSync(installPath, { recursive: true });
    const pDir = path.join(installPath, 'minecore_packs');
    if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });
    document.getElementById('setup-wizard')?.remove();
    showToast('Kurulum tamamlandı! İlk oyunda dosyalar indirilecek.', 'success', 5000);
    appendConsole('İlk kurulum tamamlandı. Oyun başlatıldığında Minecraft dosyaları otomatik indirilecek.', 'success');
    loadAllVersions();
};

function showToast(msg, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const colors = { success: '#00e676', error: '#ff4757', info: '#3498db', warn: '#ffb300' };
    toast.style.cssText = `pointer-events:all;background:rgba(15,17,20,0.95);border:1px solid ${colors[type]||colors.success};border-left:4px solid ${colors[type]||colors.success};color:#fff;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;backdrop-filter:blur(10px);box-shadow:0 8px 24px rgba(0,0,0,0.5);transform:translateX(120%);transition:transform 0.3s ease;max-width:280px;`;
    toast.innerText = msg;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => { toast.style.transform = 'translateX(120%)'; setTimeout(() => toast.remove(), 320); }, duration);
}

function showDeletePackConfirm(packName) {
    const config = getPackConfig(packName);
    const isIsolated = config.isolated === true;
    let modal = document.getElementById('delete-pack-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'delete-pack-modal'; modal.className = 'modal-overlay'; document.body.appendChild(modal); }
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content">
        <h3 style="color:#ff4757;">${t('confirm_delete_pack')}: "${packName}"</h3>
        <p style="color:#aaa;font-size:13px;margin:10px 0 15px;">${t('confirm_delete_msg')}</p>
        ${isIsolated ? `<div style="display:flex;align-items:center;gap:10px;background:rgba(255,71,87,0.08);border:1px solid rgba(255,71,87,0.2);padding:12px;border-radius:8px;margin-bottom:15px;">
            <input type="checkbox" id="delete-files-check" style="width:16px;height:16px;accent-color:#ff4757;cursor:pointer;">
            <label for="delete-files-check" style="font-size:13px;color:#ff7675;cursor:pointer;">${t('confirm_delete_files')}</label>
        </div>` : ''}
        <div class="modal-buttons">
            <button class="ms-btn" onclick="document.getElementById('delete-pack-modal').style.display='none'">${t('btn_cancel')}</button>
            <button class="ms-btn logout-btn" onclick="window._confirmDeletePack('${packName}')">${t('btn_delete_pack')}</button>
        </div></div>`;
}

window._confirmDeletePack = function(packName) {
    const packPath = path.join(packsDir, packName);
    if (fs.existsSync(packPath)) fs.rmSync(packPath, { recursive: true, force: true });
    if (activePack === packName) activePack = 'Varsayılan';
    document.getElementById('delete-pack-modal').style.display = 'none';
    loadPacks(); loadAllVersions();
    showToast(`"${packName}" silindi.`, 'warn');
};
window.deletePack = showDeletePackConfirm;

let _sessionStart = null, _sessionPack = null;
function startPlaytimeTracking(packName) { _sessionStart = Date.now(); _sessionPack = packName; }
function stopPlaytimeTracking() {
    if (!_sessionStart || !_sessionPack) return;
    const mins = Math.round((Date.now() - _sessionStart) / 60000);
    if (mins >= 1) { const k = `minecore_playtime_${_sessionPack}`; localStorage.setItem(k, (parseInt(localStorage.getItem(k)||'0')) + mins); }
    _sessionStart = null; _sessionPack = null;
}
function getPlaytime(packName) {
    const mins = parseInt(localStorage.getItem(`minecore_playtime_${packName}`) || '0');
    if (mins < 1) return '';
    if (mins < 60) return `${mins}${t('playtime_mins')}`;
    return `${Math.floor(mins/60)}${t('playtime_hours')} ${mins%60}${t('playtime_mins')}`;
}

function getPackIcon(packName, loader) {
    const customIcon = path.join(packsDir, packName, 'icon.png');
    if (fs.existsSync(customIcon)) {
        const mtime = fs.statSync(customIcon).mtimeMs;
        return `${customIcon}?v=${mtime}`;
    }
    return getIconForPackLoader(loader);
}
window.changePackIcon = function(packName, e) {
    e.stopPropagation();
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => {
        const file = input.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            fs.writeFileSync(path.join(packsDir, packName, 'icon.png'), Buffer.from(ev.target.result.split(',')[1], 'base64'));
            loadPacks(); showToast(t('toast_icon_changed'), 'success');
        };
        reader.readAsDataURL(file);
    };
    input.click();
};

let _consoleLines = [];
let _consoleFilter = 'all';
let _consoleAutoScroll = true;

function createConsoleOverlay() {
    if (document.getElementById('console-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'console-overlay';
    overlay.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:380px;background:rgba(5,5,5,0.97);backdrop-filter:blur(10px);border-top:2px solid rgba(0,230,118,0.2);z-index:8888;display:none;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,0.5);';
    overlay.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:12px;font-weight:800;color:#00e676;letter-spacing:2px;">${t('console_title')}</span>
                <span id="console-line-count" style="font-size:10px;color:#555;background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:10px;">0</span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <input id="console-search" type="text" placeholder="${t('console_search_ph')}" style="background:rgba(255,255,255,0.05);border:1px solid #2a2a2a;color:#ccc;font-size:11px;padding:5px 10px;border-radius:5px;width:140px;outline:none;">
                <div id="console-filters" style="display:flex;gap:3px;background:rgba(255,255,255,0.03);padding:3px;border-radius:6px;">
                    <button data-filter="all" class="console-filter-btn active" style="background:rgba(0,230,118,0.15);color:#00e676;border:none;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;">${t('console_filter_all')}</button>
                    <button data-filter="error" class="console-filter-btn" style="background:none;color:#666;border:none;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;">ERR</button>
                    <button data-filter="warn" class="console-filter-btn" style="background:none;color:#666;border:none;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;">WARN</button>
                    <button data-filter="success" class="console-filter-btn" style="background:none;color:#666;border:none;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;">OK</button>
                </div>
                <button id="console-autoscroll-btn" title="${t('console_autoscroll')}" style="background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.3);color:#00e676;padding:5px 8px;border-radius:5px;cursor:pointer;font-size:11px;display:flex;align-items:center;">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><polyline points="19 12 12 19 5 12"/><line x1="12" y1="19" x2="12" y2="5"/></svg>
                </button>
                <button id="console-copy-btn" title="${t('console_copy')}" style="background:none;border:1px solid #333;color:#888;padding:5px 8px;border-radius:5px;cursor:pointer;font-size:11px;display:flex;align-items:center;">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button id="console-save-btn" title="${t('console_save')}" style="background:none;border:1px solid #333;color:#888;padding:5px 8px;border-radius:5px;cursor:pointer;font-size:11px;display:flex;align-items:center;">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </button>
                <button id="console-clear-btn" style="background:none;border:1px solid #333;color:#888;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:700;">${t('console_clear')}</button>
                <button id="console-close-btn" style="background:none;border:1px solid rgba(255,71,87,0.3);color:#ff4757;padding:5px 12px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:700;">${t('btn_close_console')}</button>
            </div>
        </div>
        <div id="console-log" style="flex:1;overflow-y:auto;padding:12px 20px;font-family:Consolas,'Courier New',monospace;font-size:11px;color:#aaa;line-height:1.7;"><span style="color:#555;">${t('console_empty')}</span></div>`;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('.console-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _consoleFilter = btn.dataset.filter;
            overlay.querySelectorAll('.console-filter-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.style.background = b === btn ? 'rgba(0,230,118,0.15)' : 'none';
                b.style.color = b === btn ? '#00e676' : '#666';
            });
            renderConsoleLines();
        });
    });

    document.getElementById('console-search')?.addEventListener('input', () => renderConsoleLines());

    document.getElementById('console-autoscroll-btn')?.addEventListener('click', (e) => {
        _consoleAutoScroll = !_consoleAutoScroll;
        const btn = e.currentTarget;
        btn.style.background = _consoleAutoScroll ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.03)';
        btn.style.color = _consoleAutoScroll ? '#00e676' : '#666';
        btn.style.borderColor = _consoleAutoScroll ? 'rgba(0,230,118,0.3)' : '#333';
        if (_consoleAutoScroll) { const log = document.getElementById('console-log'); if(log) log.scrollTop = log.scrollHeight; }
    });

    document.getElementById('console-copy-btn')?.addEventListener('click', () => {
        const text = _consoleLines.map(l => `[${l.time}] ${l.text}`).join('\n');
        navigator.clipboard.writeText(text).then(() => showToast(t('console_copied'), 'success', 1500));
    });

    document.getElementById('console-save-btn')?.addEventListener('click', () => {
        try {
            const { dialog } = require('@electron/remote');
            const savePath = dialog.showSaveDialogSync({ defaultPath: `minecore-log-${Date.now()}.txt`, filters: [{ name: 'Text', extensions: ['txt'] }] });
            if (!savePath) return;
            const text = _consoleLines.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
            fs.writeFileSync(savePath, text);
            showToast(t('console_saved'), 'success');
        } catch(e) { showToast('Kaydetme hatası: ' + e.message, 'error'); }
    });

    document.getElementById('console-clear-btn')?.addEventListener('click', () => {
        _consoleLines = [];
        renderConsoleLines();
    });

    document.getElementById('console-close-btn')?.addEventListener('click', () => { overlay.style.display = 'none'; });
}

function renderConsoleLines() {
    const log = document.getElementById('console-log');
    const countEl = document.getElementById('console-line-count');
    if (!log) return;
    const searchVal = (document.getElementById('console-search')?.value || '').toLowerCase();

    const filtered = _consoleLines.filter(l => {
        if (_consoleFilter !== 'all' && l.type !== _consoleFilter) return false;
        if (searchVal && !l.text.toLowerCase().includes(searchVal)) return false;
        return true;
    });

    if (countEl) countEl.innerText = `${filtered.length} / ${_consoleLines.length}`;

    if (filtered.length === 0) {
        log.innerHTML = `<span style="color:#555;">${_consoleLines.length === 0 ? t('console_empty') : t('console_no_match')}</span>`;
        return;
    }

    const colors = { info: '#aaa', warn: '#ffb300', error: '#ff4757', success: '#00e676' };
    log.innerHTML = filtered.map(l => {
        const color = colors[l.type] || '#aaa';
        let text = l.text.replace(/</g, '&lt;');
        if (searchVal) {
            const re = new RegExp(`(${searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
            text = text.replace(re, '<mark style="background:rgba(0,230,118,0.35);color:#fff;border-radius:2px;">$1</mark>');
        }
        return `<div style="color:${color};"><span style="color:#444;">[${l.time}]</span> ${text}</div>`;
    }).join('');

    if (_consoleAutoScroll) log.scrollTop = log.scrollHeight;
}

function appendConsole(line, type = 'info') {
    createConsoleOverlay();
    const str = typeof line === 'string' ? line : JSON.stringify(line);
    _consoleLines.push({ text: str, type, time: new Date().toLocaleTimeString() });
    if (_consoleLines.length > 2000) _consoleLines.shift();
    renderConsoleLines();
}

function showConsole() { createConsoleOverlay(); document.getElementById('console-overlay').style.display = 'flex'; renderConsoleLines(); }

const _logBtn = document.createElement('button');
_logBtn.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:8887;background:rgba(15,17,20,0.9);border:1px solid rgba(0,230,118,0.25);color:#00e676;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;backdrop-filter:blur(10px);letter-spacing:1px;transition:0.2s;display:flex;align-items:center;gap:6px;';
_logBtn.id = 'log-btn';
_logBtn.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>LOG`;
_logBtn.onclick = () => { createConsoleOverlay(); const o = document.getElementById('console-overlay'); o.style.display = o.style.display === 'none' ? 'flex' : 'none'; if(o.style.display === 'flex') renderConsoleLines(); };
document.body.appendChild(_logBtn);

let packSearchQuery = '';
function injectPackSearch() {
    const packsPanel = document.querySelector('.packs-panel.glass-panel-inner');
    if (!packsPanel || document.getElementById('pack-search-input')) return;
    const input = document.createElement('input');
    input.type = 'text'; input.id = 'pack-search-input'; input.placeholder = t('search_packs');
    input.className = 'settings-input'; input.style.cssText = 'margin-bottom:10px;font-size:12px;padding:8px 12px;';
    input.addEventListener('input', (e) => { packSearchQuery = e.target.value.toLowerCase(); loadPacks(); });
    const createBtn = document.getElementById('create-pack-btn');
    if (createBtn) packsPanel.insertBefore(input, createBtn.nextSibling);
}

async function checkModUpdates() {
    if (!activePack || activePack === 'Varsayılan') { showToast(t('no_mods_to_update'), 'warn'); return; }
    const mods = getInstalledMods(); const ids = Object.keys(mods);
    if (ids.length === 0) { showToast(t('no_mods_to_update'), 'warn'); return; }
    const config = getPackConfig(activePack);
    const updateBtn = document.getElementById('btn-check-updates');
    if (updateBtn) { updateBtn.disabled = true; updateBtn.innerText = t('updating'); }
    let updated = 0;
    for (let i = 0; i < ids.length; i++) {
        const projId = ids[i];
        if (projId.startsWith('local__')) continue;
        if (updateBtn) updateBtn.innerText = `${t('checking_mod')} ${i+1}/${ids.length}`;
        try {
            const allVersions = await (await fetch(`https://api.modrinth.com/v2/project/${projId}/version?limit=100`)).json();
            if (!allVersions || allVersions.length === 0) continue;

            let candidates = allVersions.filter(v =>
                v.game_versions.includes(config.version) &&
                (config.loader === 'vanilla' || v.loaders.includes(config.loader) || (config.loader === 'neoforge' && v.loaders.includes('forge')) || (config.loader === 'forge' && v.loaders.includes('neoforge')))
            );
            if (candidates.length === 0) {
                candidates = allVersions.filter(v => v.game_versions.includes(config.version));
            }
            if (candidates.length === 0 && config.loader !== 'vanilla') {
                candidates = allVersions.filter(v => v.loaders.includes(config.loader));
            }
            if (candidates.length === 0) continue;

            const latest = candidates[0];
            const latestFile = latest.files.find(f => f.primary) || latest.files[0];
            if (!latestFile) continue;

            if (latestFile.filename !== mods[projId]) {
                const oldPath = path.join(packsDir, activePack, 'mods', mods[projId]);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                const buf = Buffer.from(await (await fetch(latestFile.url)).arrayBuffer());
                fs.writeFileSync(path.join(packsDir, activePack, 'mods', latestFile.filename), buf);
                saveInstalledMod(projId, latestFile.filename);
                updated++; appendConsole(`Updated: ${mods[projId]} → ${latestFile.filename}`, 'success');
            }
        } catch(e) { appendConsole(`Update check failed: ${projId} — ${e.message}`, 'warn'); }
    }
    if (updateBtn) { updateBtn.disabled = false; updateBtn.innerText = t('btn_check_updates'); }
    showToast(updated > 0 ? `${updated} ${t('mods_updated')}` : t('up_to_date'), updated > 0 ? 'success' : 'info');
    if (updated > 0) fetchMods();
}

window.exportPack = function(packName, e) {
    if(e) e.stopPropagation();
    try {
        const { dialog } = require('@electron/remote');
        const savePath = dialog.showSaveDialogSync({ defaultPath: `${packName}.mcpack`, filters: [{ name: 'MineCore Pack', extensions: ['mcpack'] }] });
        if (!savePath) return;
        const zip = new admZip();
        zip.addLocalFolder(path.join(packsDir, packName), packName);
        zip.writeZip(savePath);
        showToast(t('toast_pack_exported'), 'success');
    } catch(err) { showToast('Export error: ' + err.message, 'error'); }
};
window.importPack = function() {
    try {
        const { dialog } = require('@electron/remote');
        const files = dialog.showOpenDialogSync({ filters: [{ name: 'Modpack', extensions: ['mcpack', 'zip'] }], properties: ['openFile'] });
        if (!files || files.length === 0) return;
        const filePath = files[0];
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(filePath);

        const manifestEntry = zip.getEntry('manifest.json');
        if (manifestEntry) {
            let manifest;
            try { manifest = JSON.parse(zip.readAsText(manifestEntry)); } catch(_) { manifest = null; }
            if (manifest && manifest.manifestType === 'minecraftModpack') {
                importCurseForgePack(zip, manifest);
                return;
            }
        }

        const topDir = zip.getEntries()[0]?.entryName.split('/')[0] || 'ImportedPack';
        let destName = topDir; let c = 1;
        while (fs.existsSync(path.join(packsDir, destName))) { destName = `${topDir}_${c}`; c++; }
        zip.extractAllTo(packsDir, true);
        if (destName !== topDir && fs.existsSync(path.join(packsDir, topDir))) fs.renameSync(path.join(packsDir, topDir), path.join(packsDir, destName));
        loadPacks(); loadAllVersions();
        showToast(t('toast_pack_imported'), 'success');
    } catch(err) { showToast('Import error: ' + err.message, 'error'); }
};

async function importCurseForgePack(zip, manifest) {
    const rawName = manifest.name || 'CurseForge_Pack';
    let destName = rawName.replace(/[\\/:*?"<>|]/g, '_').trim() || 'CurseForge_Pack';
    let c = 1;
    while (fs.existsSync(path.join(packsDir, destName))) { destName = `${rawName}_${c}`; c++; }
    const newPackPath = path.join(packsDir, destName);
    fs.mkdirSync(newPackPath, { recursive: true });
    fs.mkdirSync(path.join(newPackPath, 'mods'), { recursive: true });

    const mcVersion = manifest.minecraft?.version || '1.20.1';
    const loaderEntry = (manifest.minecraft?.modLoaders || []).find(l => l.primary) || manifest.minecraft?.modLoaders?.[0];
    let loader = 'forge';
    if (loaderEntry?.id) {
        if (loaderEntry.id.startsWith('fabric')) loader = 'fabric';
        else if (loaderEntry.id.startsWith('neoforge')) loader = 'neoforge';
        else if (loaderEntry.id.startsWith('forge')) loader = 'forge';
        else if (loaderEntry.id.startsWith('quilt')) loader = 'fabric';
    }
    fs.writeFileSync(path.join(newPackPath, 'minecore_config.json'), JSON.stringify({ version: mcVersion, loader, isolated: true }));

    zip.getEntries().forEach(entry => {
        if (entry.entryName.startsWith('overrides/') && !entry.isDirectory) {
            const rel = entry.entryName.replace('overrides/', '');
            const dest = path.join(newPackPath, rel);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, entry.getData());
        }
    });

    let modal = document.getElementById('mp-progress-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'mp-progress-modal'; modal.className = 'modal-overlay'; document.body.appendChild(modal); }
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content" style="width:420px;text-align:center;">
        <h3 id="mp-progress-title">${t('mp_reading')}</h3>
        <div style="background:#111;border-radius:8px;height:10px;margin:18px 0 8px;overflow:hidden;">
            <div id="mp-progress-bar" style="background:#00e676;height:100%;width:0%;transition:width 0.2s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#888;">
            <span id="mp-progress-sub">CurseForge</span>
            <span id="mp-progress-pct">0%</span>
        </div>
    </div>`;
    const setProgress = (pct, sub) => {
        const bar = document.getElementById('mp-progress-bar');
        const pctEl = document.getElementById('mp-progress-pct');
        const subEl = document.getElementById('mp-progress-sub');
        if(bar) bar.style.width = pct + '%';
        if(pctEl) pctEl.innerText = Math.round(pct) + '%';
        if(subEl && sub) subEl.innerText = sub;
    };

    const modFiles = manifest.files || [];
    const total = modFiles.length;
    let failed = 0;

    for (let i = 0; i < modFiles.length; i++) {
        const { projectID, fileID } = modFiles[i];
        setProgress((i / total) * 100, `${t('mp_progress')}: ${i + 1} / ${total}`);
        try {
            const idStr = String(fileID);
            const part1 = idStr.substring(0, 4).replace(/^0+/, '');
            const part2 = idStr.substring(4).replace(/^0+/, '') || '0';
            const cdnUrl = `https://mediafilez.forgecdn.net/files/${part1}/${part2}/`;

            const res = await fetch(cdnUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            let filename = `mod_${projectID}_${fileID}.jar`;
            const disposition = res.headers.get('content-disposition');
            if (disposition) {
                const match = disposition.match(/filename="?([^";]+)"?/);
                if (match) filename = decodeURIComponent(match[1]);
            } else if (res.url && res.url.includes('/')) {
                const urlName = decodeURIComponent(res.url.split('/').pop());
                if (urlName && urlName.includes('.')) filename = urlName;
            }

            const buf = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(path.join(newPackPath, 'mods', filename), buf);
        } catch(e) {
            failed++;
            appendConsole(`CurseForge mod indirilemedi (project ${projectID}, file ${fileID}): ${e.message}`, 'warn');
        }
    }

    setProgress(100, t('mp_done'));
    if (modal) modal.style.display = 'none';
    loadPacks(); loadAllVersions();
    activePack = destName;

    if (failed > 0) {
        showToast(`${t('toast_pack_imported')} (${failed} mod indirilemedi, manuel eklemen gerekebilir)`, 'warn', 6000);
    } else {
        showToast(t('toast_pack_imported'), 'success');
    }
}

function snapshotCrashReports(gameDir) {
    const crashDir = path.join(gameDir, 'crash-reports');
    const key = `minecore_known_crashes_${gameDir.replace(/[^a-z0-9]/gi,'_')}`;
    if (!fs.existsSync(crashDir)) { localStorage.setItem(key, '[]'); return; }
    const files = fs.readdirSync(crashDir).filter(f => f.endsWith('.txt'));
    localStorage.setItem(key, JSON.stringify(files));
}

function isRealCrashReport(gameDir, filename) {
    try {
        const content = fs.readFileSync(path.join(gameDir, 'crash-reports', filename), 'utf8');

        if (/ClientShutdownWatchdog|Client shutdown watchdog|ServerWatchdog\.createWatchdogCrashReport/i.test(content)) {
            return false;
        }

        const hasDescription = /^Description:/m.test(content);
        const hasThrowable = /Caused by:|^java\.[a-zA-Z.]*(Exception|Error)/m.test(content);

        return hasDescription || hasThrowable;
    } catch (e) {
        return false;
    }
}

function checkCrashReports(gameDir) {
    const crashDir = path.join(gameDir, 'crash-reports');
    if (!fs.existsSync(crashDir)) return;
    const key = `minecore_known_crashes_${gameDir.replace(/[^a-z0-9]/gi,'_')}`;
    const known = JSON.parse(localStorage.getItem(key) || '[]');
    const current = fs.readdirSync(crashDir).filter(f => f.endsWith('.txt'));
    const newFiles = current.filter(f => !known.includes(f));
    localStorage.setItem(key, JSON.stringify(current));

    const newCrashes = newFiles.filter(f => isRealCrashReport(gameDir, f));
    if (newCrashes.length === 0) return;

    const lastCrash = newCrashes.sort().reverse()[0];
    let banner = document.getElementById('crash-banner');
    if (!banner) { banner = document.createElement('div'); banner.id = 'crash-banner'; banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:9997;background:rgba(255,71,87,0.12);border-bottom:2px solid rgba(255,71,87,0.4);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(10px);'; document.body.appendChild(banner); }
    banner.style.display = 'flex';
    banner.innerHTML = `
        <div><span style="color:#ff4757;font-weight:800;font-size:13px;letter-spacing:1px;">⚠️ ${t('crash_title')}</span><span style="color:#aaa;font-size:12px;margin-left:12px;">${t('crash_desc')}</span></div>
        <div style="display:flex;gap:10px;">
            <button class="ms-btn" style="font-size:11px;padding:6px 14px;" onclick="viewCrashReport('${gameDir.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}','${lastCrash}')">${t('btn_view_crash')}</button>
            <button class="ms-btn logout-btn" style="font-size:11px;padding:6px 12px;" onclick="document.getElementById('crash-banner').style.display='none'">${t('btn_close_crash')}</button>
        </div>`; 
}
window.viewCrashReport = function(gameDir, filename) {
    const content = fs.readFileSync(path.join(gameDir, 'crash-reports', filename), 'utf8');
    let modal = document.getElementById('crash-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'crash-modal'; modal.className = 'modal-overlay'; document.body.appendChild(modal); }
    modal.style.display = 'flex';
    const lines = content.split('\n').slice(0, 80).join('\n');
    modal.innerHTML = `<div class="modal-content" style="width:700px;max-width:95vw;">
        <h3 style="color:#ff4757;">⚠️ ${filename}</h3>
        <pre style="background:#050505;border:1px solid #222;border-radius:6px;padding:16px;font-size:11px;color:#ccc;max-height:400px;overflow-y:auto;margin:15px 0;white-space:pre-wrap;word-break:break-all;">${lines.replace(/</g,'&lt;')}</pre>
        <div class="modal-buttons"><button class="ms-btn" onclick="document.getElementById('crash-modal').style.display='none'">${t('btn_cancel')}</button></div>
    </div>`;
};

loadPacks = function() {
    if(!packsList) return;
    packsList.innerHTML = '';
    injectPackSearch();
    if (!packSearchQuery || t('def_folder').toLowerCase().includes(packSearchQuery)) {
        const def = document.createElement('div');
        def.className = 'pack-item' + (activePack === 'Varsayılan' ? ' active' : '');
        def.innerHTML = `<div style="display:flex;align-items:center;gap:8px;" onclick="activePack='Varsayılan';loadPacks();fetchMods()"><img src="assets/vanilla.png" style="width:20px;height:20px;" onerror="this.style.display='none'"><span>${t('def_folder')}</span></div>`;
        packsList.appendChild(def);
    }
    if (fs.existsSync(packsDir)) {
        fs.readdirSync(packsDir).forEach(f => {
            if (packSearchQuery && !f.toLowerCase().includes(packSearchQuery)) return;
            const config = getPackConfig(f); const iconSrc = getPackIcon(f, config.loader);
            const pt = getPlaytime(f); const ptBadge = '';
            const isolatedBadge = config.isolated ? `<span style="font-size:9px;background:rgba(0,230,118,0.15);color:#00e676;border:1px solid rgba(0,230,118,0.3);border-radius:4px;padding:1px 5px;margin-left:4px;font-weight:700;">MP</span>` : '';
            const item = document.createElement('div'); item.className = 'pack-item' + (activePack === f ? ' active' : '');
            const eSvg=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
            const dSvg=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
            const iSvg=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
            const xSvg=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
            item.innerHTML = `
                <div style="display:flex;align-items:center;flex:1;min-width:0;gap:6px;cursor:pointer;" onclick="window.selectPack('${f}')">
                    <img src="${iconSrc}" style="width:20px;height:20px;border-radius:3px;object-fit:cover;flex-shrink:0;" onerror="this.src='assets/vanilla.png'">
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;">${f}</span>${isolatedBadge}${ptBadge}
                </div>
                <div class="pack-actions">
                    <button class="pack-action-btn" title="${t('btn_open_folder')}" onclick="require('electron').shell.openPath(require('path').join('${packsDir.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}','${f.replace(/'/g,"\\'")}'));event.stopPropagation()">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </button>
                    <button class="pack-action-btn" title="${t('btn_change_icon')}" onclick="window.changePackIcon('${f}',event)">${iSvg}</button>
                    <button class="pack-action-btn" title="${t('btn_export_pack')}" onclick="window.exportPack('${f}',event)">${xSvg}</button>
                    <button class="pack-action-btn" onclick="editPack('${f}');event.stopPropagation()">${eSvg}</button>
                    <button class="pack-action-btn del-btn" onclick="window.deletePack('${f}');event.stopPropagation()">${dSvg}</button>
                </div>`;
            packsList.appendChild(item);
        });
    }
    let extraBtns = packsList.parentElement.querySelector('#pack-extra-btns');
    if (!extraBtns) {
        extraBtns = document.createElement('div');
        extraBtns.id = 'pack-extra-btns';
        extraBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px;';
        packsList.parentElement.appendChild(extraBtns);
    }
    extraBtns.innerHTML = `
        <button id="btn-check-updates" class="ms-btn" style="flex:1;font-size:11px;padding:9px 6px;" onclick="checkModUpdates()">${t('btn_check_updates')}</button>
        <button class="ms-btn" style="flex:1;font-size:11px;padding:9px 6px;" onclick="window.importPack()">${t('btn_import_pack')}</button>`;
};

launcher.on('data', (line) => { appendConsole(typeof line === 'string' ? line : String(line), 'info'); });

document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    setTimeout(() => showToast(t('toast_settings_saved'), 'success'), 300);
});

window.openScreenshots = function() {
    const packName = activePack;
    const config = packName !== 'Varsayılan' ? getPackConfig(packName) : null;
    const ssDir = (config && config.isolated === true)
        ? path.join(packsDir, packName, 'screenshots')
        : path.join(originalPath, 'screenshots');
    if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

    let modal = document.getElementById('ss-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ss-modal';
        modal.className = 'modal-overlay';
        modal.style.alignItems = 'flex-start';
        modal.style.paddingTop = '40px';
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';

    const allImages = fs.existsSync(ssDir)
        ? fs.readdirSync(ssDir)
            .filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f))
            .sort((a, b) => {
                const sa = fs.statSync(path.join(ssDir, a)).mtimeMs;
                const sb = fs.statSync(path.join(ssDir, b)).mtimeMs;
                return sb - sa;
            })
        : [];

    const PAGE_SIZE = 24;
    let currentPage = 0;

    function renderGallery(page) {
        const start = page * PAGE_SIZE;
        const images = allImages.slice(start, start + PAGE_SIZE);
        const total = allImages.length;
        const totalPages = Math.ceil(total / PAGE_SIZE);

        const safeDirForJs = ssDir.replace(/\\/g, '/');
        const safeDirForAttr = ssDir.replace(/\\/g,'\\\\').replace(/'/g,"\\'");

        modal.innerHTML = `
            <div class="modal-content" style="width:820px;max-width:95vw;max-height:88vh;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-shrink:0;">
                    <div>
                        <h3 style="letter-spacing:2px;margin-bottom:3px;">${t('screenshots_title')} — ${packName}</h3>
                        <span style="color:#666;font-size:12px;">${total} görüntü</span>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button class="ms-btn" style="font-size:12px;" onclick="window._openSsFolder('${safeDirForAttr}')">${t('screenshot_open')}</button>
                        <button class="ms-btn logout-btn" style="font-size:12px;" onclick="document.getElementById('ss-modal').style.display='none'">${t('btn_cancel')}</button>
                    </div>
                </div>

                ${total === 0
                    ? `<p style="color:#666;text-align:center;padding:40px 0;">${t('screenshots_empty')}</p>`
                    : `<div id="ss-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;overflow-y:auto;flex:1;padding-right:4px;min-height:0;">
                        ${images.map(f => {
                            const filePath = `file:///${safeDirForJs}/${f}`.replace(/\/+/g, '/').replace('file:/', 'file:///');
                            const safeFile = f.replace(/'/g, "\\'");
                            return `<div class="ss-card" style="position:relative;border-radius:8px;overflow:hidden;background:#0a0a0a;border:1px solid #1a1a1a;cursor:pointer;aspect-ratio:16/9;" onclick="window._expandSs('${safeDirForAttr}','${safeFile}')">
                                <img loading="lazy" src="${filePath}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.2s;" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#444;font-size:11px;\\'>?</div>'">
                                <div class="ss-card-overlay" style="position:absolute;bottom:0;left:0;right:0;padding:5px 7px;background:linear-gradient(transparent,rgba(0,0,0,0.85));display:flex;justify-content:space-between;align-items:center;opacity:0;transition:opacity 0.15s;">
                                    <span style="font-size:9px;color:#bbb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;" title="${f}">${f}</span>
                                    <button class="ms-btn logout-btn" style="font-size:9px;padding:2px 6px;flex-shrink:0;" onclick="event.stopPropagation();window._deleteSs('${safeDirForAttr}','${safeFile}')">${t('screenshot_delete')}</button>
                                </div>
                            </div>`;
                        }).join('')}
                       </div>
                       ${totalPages > 1 ? `<div style="display:flex;justify-content:center;align-items:center;gap:12px;padding-top:12px;flex-shrink:0;">
                           <button class="ms-btn" ${page === 0 ? 'disabled' : ''} onclick="window._ssPage(${page-1})" style="padding:6px 14px;">◀</button>
                           <span style="color:#aaa;font-size:13px;">${page+1} / ${totalPages}</span>
                           <button class="ms-btn" ${page >= totalPages-1 ? 'disabled' : ''} onclick="window._ssPage(${page+1})" style="padding:6px 14px;">▶</button>
                       </div>` : ''}`}
            </div>`;

        modal.querySelectorAll('.ss-card').forEach(card => {
            const overlay = card.querySelector('.ss-card-overlay');
            const img = card.querySelector('img');
            card.addEventListener('mouseenter', () => { if(overlay) overlay.style.opacity='1'; if(img) img.style.transform='scale(1.04)'; });
            card.addEventListener('mouseleave', () => { if(overlay) overlay.style.opacity='0'; if(img) img.style.transform='scale(1)'; });
        });
    }

    window._ssPage = (p) => { currentPage = p; renderGallery(p); };
    renderGallery(0);
};

window._openSsFolder = function(dir) {
    const { shell } = require('electron');
    shell.openPath(dir);
};

window._expandSs = function(dir, filename) {
    if (!filename) return;
    let viewer = document.getElementById('ss-viewer');
    if (!viewer) {
        viewer = document.createElement('div');
        viewer.id = 'ss-viewer';
        viewer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);z-index:10001;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
        viewer.onclick = () => viewer.style.display = 'none';
        document.body.appendChild(viewer);
    }
    const filePath = `file:///${dir.replace(/\\/g,'/')}/${filename}`.replace(/\/+/g,'/').replace('file:/','file:///');
    viewer.innerHTML = `<img src="${filePath}" style="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:4px;box-shadow:0 20px 60px rgba(0,0,0,0.8);">`;
    viewer.style.display = 'flex';
};

window._deleteSs = function(dir, filename) {
    fs.unlinkSync(path.join(dir, filename));
    showToast(`${filename} silindi.`, 'warn');
    window.openScreenshots();
};

(function injectScreenshotBtn() {
    const nav = document.querySelector('.side-nav.glass-panel');
    if (!nav || document.getElementById('nav-screenshots')) return;
    const btn = document.createElement('button');
    btn.id = 'nav-screenshots';
    btn.className = 'nav-btn';
    btn.setAttribute('data-i18n-html', 'screenshots_title');
    btn.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span data-i18n="screenshots_title">${t('screenshots_title')}</span>`;
    btn.onclick = () => window.openScreenshots();
    nav.appendChild(btn);
})();

window.openModDetail = async function(projectId, modTitle) {
    let modal = document.getElementById('mod-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mod-detail-modal';
        modal.className = 'modal-overlay';
        modal.style.alignItems = 'flex-start';
        modal.style.paddingTop = '30px';
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content" style="width:760px;max-width:95vw;max-height:88vh;overflow-y:auto;">
        <p style="color:#666;text-align:center;padding:30px;">${t('loading')}</p></div>`;

    try {
        const [project, members] = await Promise.all([
            fetch(`https://api.modrinth.com/v2/project/${projectId}`).then(r => r.json()),
            fetch(`https://api.modrinth.com/v2/project/${projectId}/members`).then(r => r.json()).catch(() => [])
        ]);

        const formatNum = n => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n;
        const formatDate = d => new Date(d).toLocaleDateString();
        const cats = (project.categories || []).map(c => `<span style="background:rgba(0,230,118,0.1);color:#00e676;border:1px solid rgba(0,230,118,0.2);padding:2px 8px;border-radius:4px;font-size:11px;">${c}</span>`).join(' ');
        const gallery = (project.gallery || []).slice(0, 4).map(g =>
            `<img src="${g.url}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px;cursor:zoom-in;border:1px solid #222;" onclick="window._expandSs('','');" onerror="this.style.display='none'">`
        ).join('');

        const installedMods = getInstalledMods();
        const isInstalled = !!installedMods[projectId];
        const actionBtn = currentModrinthType === 'modpack'
            ? `<button class="ms-btn vyra-btn" style="flex:1;" onclick="installModpack('${projectId}','${(project.title||'').replace(/'/g,"\\'")}');document.getElementById('mod-detail-modal').style.display='none'">${t('btn_install_pack')}</button>`
            : activePack === 'Varsayılan'
                ? `<button class="ms-btn" disabled style="flex:1;background:rgba(255,255,255,0.05);color:#555;">${t('btn_select_pack')}</button>`
                : isInstalled
                    ? `<button class="ms-btn logout-btn" style="flex:1;" onclick="deleteMod('${projectId}');document.getElementById('mod-detail-modal').style.display='none'">${t('btn_delete')}</button>`
                    : `<button class="ms-btn vyra-btn" style="flex:1;" onclick="openModVersionModal('${projectId}');document.getElementById('mod-detail-modal').style.display='none'">${t('btn_download')}</button>`;

        modal.innerHTML = `
            <div class="modal-content" style="width:760px;max-width:95vw;max-height:88vh;overflow-y:auto;">
                <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:20px;">
                    <img src="${project.icon_url||''}" style="width:72px;height:72px;border-radius:10px;object-fit:cover;background:#111;border:1px solid #222;flex-shrink:0;" onerror="this.style.display='none'">
                    <div style="flex:1;min-width:0;">
                        <h3 style="margin-bottom:4px;font-size:20px;">${project.title}</h3>
                        <p style="color:#888;font-size:13px;margin-bottom:8px;">${project.description}</p>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">${cats}</div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
                    ${[
                        ['⬇', formatNum(project.downloads||0), t('mod_downloads')],
                        ['❤', formatNum(project.followers||0), t('mod_follows')],
                        ['🕒', formatDate(project.updated), t('mod_updated')],
                        ['📅', formatDate(project.published), t('mod_created')]
                    ].map(([icon,val,label]) => `
                        <div style="background:rgba(0,0,0,0.4);border:1px solid #222;border-radius:8px;padding:12px;text-align:center;">
                            <div style="font-size:18px;margin-bottom:4px;">${icon}</div>
                            <div style="font-weight:800;color:#fff;font-size:15px;">${val}</div>
                            <div style="font-size:11px;color:#666;margin-top:2px;">${label}</div>
                        </div>`).join('')}
                </div>

                ${gallery ? `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;">${gallery}</div>` : ''}

                ${project.body ? `<div style="background:rgba(0,0,0,0.3);border:1px solid #222;border-radius:8px;padding:16px;margin-bottom:20px;font-size:13px;color:#aaa;line-height:1.7;max-height:200px;overflow-y:auto;">
                    ${project.body.replace(/<[^>]*>/g,'').slice(0,1200)}${project.body.length>1200?'...':''}
                </div>` : ''}

                <div style="display:flex;gap:10px;">
                    ${actionBtn}
                    <button class="ms-btn" style="flex:0 0 auto;" onclick="window.open && require('electron').shell.openExternal('https://modrinth.com/mod/${projectId}')">${t('mod_open_modrinth')}</button>
                    <button class="ms-btn logout-btn" style="flex:0 0 auto;" onclick="document.getElementById('mod-detail-modal').style.display='none'">${t('btn_cancel')}</button>
                </div>
            </div>`;

        modal.querySelectorAll('img[style*="zoom-in"]').forEach((img, i) => {
            const url = (project.gallery||[])[i]?.url;
            if (url) img.onclick = () => {
                let v = document.getElementById('ss-viewer');
                if (!v) { v = document.createElement('div'); v.id='ss-viewer'; v.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10002;display:flex;align-items:center;justify-content:center;cursor:zoom-out;'; v.onclick=()=>v.style.display='none'; document.body.appendChild(v); }
                v.innerHTML=`<img src="${url}" style="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:4px;">`;
                v.style.display='flex';
            };
        });

    } catch(e) {
        modal.innerHTML = `<div class="modal-content"><p style="color:#ff4757;">Yüklenemedi: ${e.message}</p><div class="modal-buttons"><button class="ms-btn" onclick="document.getElementById('mod-detail-modal').style.display='none'">${t('btn_cancel')}</button></div></div>`;
    }
};

document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    const minRam = document.getElementById('set-min-ram'); if(minRam) localStorage.setItem('minecore_min_ram', minRam.value);
    const maxRam = document.getElementById('set-max-ram'); if(maxRam) localStorage.setItem('minecore_max_ram', maxRam.value);
    const javaPath = document.getElementById('set-java-path'); if(javaPath) localStorage.setItem('minecore_java_path', javaPath.value);
    const rootPath = document.getElementById('set-root-path'); if(rootPath) localStorage.setItem('minecore_root_path', rootPath.value.trim());
    const statusMsg = document.getElementById('settings-status');
    if(statusMsg) { statusMsg.style.display = 'block'; setTimeout(() => { statusMsg.style.display = 'none'; }, 2000); }
});


document.getElementById('create-pack-btn')?.addEventListener('click', () => {
    isEditingPack = false; 
    const titleEl = document.getElementById('pack-modal-title');
    if(titleEl) titleEl.innerText = t('modal_pack_title');
    if(newPackNameInput) newPackNameInput.value = ''; 
    const isolatedCheck = document.getElementById('modal-isolated-check');
    if(isolatedCheck) isolatedCheck.checked = false;
    if(packModal) packModal.style.display = 'flex'; 
    setTimeout(() => { if(newPackNameInput) newPackNameInput.focus(); }, 100);
});

document.getElementById('modal-cancel-btn')?.addEventListener('click', () => { if(packModal) packModal.style.display = 'none'; });
document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
    const name = newPackNameInput?.value?.trim();
    const ver = modalVersionSelect?.value;
    const loader = modalLoaderSelect?.value || 'vanilla';
    const isolatedCheck = document.getElementById('modal-isolated-check');
    const wantIsolated = isolatedCheck ? isolatedCheck.checked : false;
    if (!name) { showToast('Paket adı boş olamaz.', 'error'); return; }
    if (!ver) { showToast('Sürüm seçiniz.', 'error'); return; }
    const newPackPath = path.join(packsDir, name);

    if (isEditingPack) {
        const oldPackPath = path.join(packsDir, editingPackName);
        if (name !== editingPackName) {
            if (fs.existsSync(newPackPath)) { showToast(`"${name}" zaten var.`, 'error'); return; }
            fs.renameSync(oldPackPath, newPackPath);
            if (activePack === editingPackName) activePack = name;
            const savedVer = localStorage.getItem('minecore_version');
            if (savedVer === `PACK:${editingPackName}`) localStorage.setItem('minecore_version', `PACK:${name}`);
        }
    } else {
        if (fs.existsSync(newPackPath)) { showToast(`"${name}" zaten var.`, 'error'); return; }
        fs.mkdirSync(newPackPath, { recursive: true }); fs.mkdirSync(path.join(newPackPath, 'mods'), { recursive: true }); fs.mkdirSync(path.join(newPackPath, 'resourcepacks'), { recursive: true });
    }
    
    fs.writeFileSync(path.join(newPackPath, 'minecore_config.json'), JSON.stringify({ version: ver, loader: loader, isolated: wantIsolated }));
    activePack = name; loadPacks(); loadAllVersions(); 
    if(packModal) packModal.style.display = 'none';
    showToast(isEditingPack ? 'Paket güncellendi.' : 'Paket oluşturuldu.', 'success');
});

window.editPack = function(packName) {
    isEditingPack = true; editingPackName = packName; const config = getPackConfig(packName);
    const titleEl = document.getElementById('pack-modal-title');
    if(titleEl) titleEl.innerText = "MODPACK DÜZENLE";
    if(newPackNameInput) newPackNameInput.value = packName;
    const isolatedCheck = document.getElementById('modal-isolated-check');
    if(isolatedCheck) isolatedCheck.checked = config.isolated === true;
    if(packModal) packModal.style.display = 'flex';

    const setVersion = () => {
        if (modalVersionSelect && modalVersionSelect.options.length > 0) {
            const exists = Array.from(modalVersionSelect.options).some(o => o.value === config.version);
            if (!exists && config.version) {
                const opt = document.createElement('option');
                opt.value = config.version; opt.text = config.version;
                modalVersionSelect.insertBefore(opt, modalVersionSelect.firstChild);
            }
            modalVersionSelect.value = config.version;
        } else {
            setTimeout(setVersion, 100);
        }
        if (modalLoaderSelect) modalLoaderSelect.value = config.loader;
    };
    setTimeout(() => { setVersion(); if(newPackNameInput) newPackNameInput.focus(); }, 80);
};


window.toggleFavorite = function(e, val) {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('minecore_favorites')) || [];
    if(favs.includes(val)) {
        favs = favs.filter(v => v !== val);
    } else {
        favs.push(val);
    }
    localStorage.setItem('minecore_favorites', JSON.stringify(favs));
    loadAllVersions();
};

async function loadAllVersions() {
    let modded = [];
    const vDir = path.join(originalPath, 'versions');
    if (fs.existsSync(vDir)) {
        fs.readdirSync(vDir).forEach(f => {
            if (fs.statSync(path.join(vDir, f)).isDirectory() && f.toLowerCase().match(/forge|fabric|optifine|neoforge/))
                modded.push(f);
        });
    }

    let vanillaList = [];
    try {
        const data = await (await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')).json();
        vanillaList = data.versions.filter(v => v.type === 'release').map(v => v.id);
        localStorage.setItem('minecore_version_cache', JSON.stringify(vanillaList));
    } catch(_) {
        const cached = localStorage.getItem('minecore_version_cache');
        if (cached) {
            try { vanillaList = JSON.parse(cached); } catch(_) {}
        }
        if (vanillaList.length === 0 && fs.existsSync(vDir)) {
            vanillaList = fs.readdirSync(vDir)
                .filter(f => fs.statSync(path.join(vDir, f)).isDirectory() && !f.toLowerCase().match(/forge|fabric|optifine|neoforge/))
                .sort((a, b) => {
                    const pa = a.split('.').map(n => parseInt(n)||0);
                    const pb = b.split('.').map(n => parseInt(n)||0);
                    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                        const diff = (pb[i]||0)-(pa[i]||0);
                        if (diff !== 0) return diff;
                    }
                    return 0;
                });
        }
    }

    if(modalVersionSelect) modalVersionSelect.innerHTML = vanillaList.map(v => `<option value="${v}">${v}</option>`).join('');
    if(customOptions) customOptions.innerHTML = '';

    let favs = JSON.parse(localStorage.getItem('minecore_favorites')) || [];
    let favHtml = ''; let packsHtml = ''; let moddedHtml = ''; let vanillaHtml = '';
    let firstVal = null, firstIco = null, firstTxt = null;

    function createOpt(val, txt, icon) {
        if(!firstVal) { firstVal = val; firstIco = icon; firstTxt = txt; }
        const isFav = favs.includes(val);
        const starCol = isFav ? '#f1c40f' : '#444';
        const html = `<div class="select-option" style="display:flex; justify-content:space-between; align-items:center;" onclick="selectCustomOption('${val}', '${txt}', '${icon}')">
            <div style="display:flex; align-items:center; gap:10px;"><img src="${icon}" onerror="this.src='https://via.placeholder.com/20'"> ${txt}</div>
            <span onclick="toggleFavorite(event, '${val}')" style="color:${starCol}; font-size:20px; padding:0 5px; transition:0.2s;" onmouseover="this.style.color='#f1c40f'" onmouseout="this.style.color='${starCol}'">★</span>
        </div>`;
        if(isFav) favHtml += html;
        return html;
    }

    if (fs.existsSync(packsDir)) {
        const packs = fs.readdirSync(packsDir).filter(f => fs.statSync(path.join(packsDir, f)).isDirectory());
        if (packs.length > 0) packs.forEach(p => { packsHtml += createOpt(`PACK:${p}`, p, getIconForPackLoader(getPackConfig(p).loader)); });
    }

    if (modded.length > 0) modded.forEach(v => { moddedHtml += createOpt(v, v, getIconForVersion(v)); });
    vanillaList.forEach(v => { vanillaHtml += createOpt(v, v, 'assets/vanilla.png'); });

    let finalHtml = '';
    if(favHtml) finalHtml += `<div class="select-optgroup" style="color:#f1c40f;">${t('grp_favorites')}</div>` + favHtml;
    if(packsHtml) finalHtml += `<div class="select-optgroup">${t('grp_my_packs')}</div>` + packsHtml;
    if(moddedHtml) finalHtml += `<div class="select-optgroup">${t('grp_installed')}</div>` + moddedHtml;
    if(vanillaHtml) finalHtml += `<div class="select-optgroup">${t('grp_vanilla')}</div>` + vanillaHtml;

    if(customOptions) customOptions.innerHTML = finalHtml;

    const savedVal = localStorage.getItem('minecore_version') || firstVal;
    if(savedVal) { let txt = savedVal.replace('PACK:', ''), ico = savedVal.startsWith('PACK:') ? getIconForPackLoader(getPackConfig(txt).loader) : getIconForVersion(savedVal); selectCustomOption(savedVal, txt, ico); }
    if(playButton && !window._gameRunning) playButton.disabled = false;
}

function renderInstallations() {
    if(!installsGrid) return;
    installsGrid.innerHTML = ''; 
    const vDir = path.join(originalPath, 'versions');
    if (fs.existsSync(vDir)) {
        fs.readdirSync(vDir).filter(f => fs.statSync(path.join(vDir, f)).isDirectory()).forEach(folder => {
            const card = document.createElement('div'); card.className = 'install-card';
            card.innerHTML = `<img src="${getIconForVersion(folder)}" class="install-icon-img" onerror="this.style.display='none'"><div class="install-info"><h4 style="color:#fff; margin-bottom:5px;">${folder}</h4><p style="color:#aaa; font-size:12px;">Yerel Dosya</p></div>`;
            installsGrid.appendChild(card);
        });
    }
}

window.selectPack = function(packName) { activePack = packName; loadPacks(); document.getElementById('mod-search-btn')?.click(); startModsWatcher(packName); };

let _modsWatcher = null;
let _watcherDebounce = null;
let _lastModsSnapshot = null;

function startModsWatcher(packName) {
    if (_modsWatcher) { clearInterval(_modsWatcher); _modsWatcher = null; }
    _lastModsSnapshot = null;
    if (!packName || packName === 'Varsayılan') return;

    const modsDir = path.join(packsDir, packName, 'mods');
    if (!fs.existsSync(modsDir)) fs.mkdirSync(modsDir, { recursive: true });

    const poll = () => {
        try {
            const files = fs.readdirSync(modsDir).sort().join('|');
            if (_lastModsSnapshot !== null && files !== _lastModsSnapshot) {
                clearTimeout(_watcherDebounce);
                _watcherDebounce = setTimeout(() => syncModsFolder(packName), 200);
            }
            _lastModsSnapshot = files;
        } catch (e) {
        }
    };
    poll();
    _modsWatcher = setInterval(poll, 1500);
    syncModsFolder(packName);
}

function syncModsFolder(packName) {
    if (!packName || packName === 'Varsayılan') return;
    const modsDir = path.join(packsDir, packName, 'mods');
    if (!fs.existsSync(modsDir)) return;

    const trackerPath = path.join(packsDir, packName, 'minecore_mods.json');
    let tracked = {};
    try { tracked = JSON.parse(fs.readFileSync(trackerPath)); } catch(_) {}

    const trackedFiles = new Set(Object.values(tracked));

    const diskFiles = fs.readdirSync(modsDir).filter(f => f.endsWith('.jar') || f.endsWith('.zip'));

    let changed = false;

    diskFiles.forEach(filename => {
        if (!trackedFiles.has(filename)) {
            const fakeId = 'local__' + filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
            if (!tracked[fakeId]) {
                tracked[fakeId] = filename;
                changed = true;
                appendConsole(`Yeni mod tespit edildi: ${filename}`, 'success');
            }
        }
    });

    const diskSet = new Set(diskFiles);
    Object.keys(tracked).forEach(id => {
        if (!diskSet.has(tracked[id])) {
            const removedName = tracked[id];
            delete tracked[id];
            changed = true;
            appendConsole(`Mod kaldırıldı: ${removedName}`, 'warn');
        }
    });

    if (changed) {
        fs.writeFileSync(trackerPath, JSON.stringify(tracked));
        if (document.getElementById('btn-show-installed')?.dataset.active === 'true') {
            document.getElementById('btn-show-installed')?.click();
        }
        showToast(`Mod klasörü senkronize edildi`, 'info', 2000);
    }
}

function updateSearchPlaceholder() {
    const titleEl = document.getElementById('mod-center-title');
    if(!modSearchInput || !titleEl) return;
    if(currentModrinthType === 'mod') { modSearchInput.placeholder = t('search_mod'); titleEl.innerText = t('title_trend_mods'); } 
    else if(currentModrinthType === 'resourcepack') { modSearchInput.placeholder = t('search_rp'); titleEl.innerText = t('title_trend_rp'); } 
    else { modSearchInput.placeholder = t('search_mp'); titleEl.innerText = t('title_trend_mp'); }
}

let selectedCategories = new Set();
let modrinthCategoriesCache = null;
const modCategoriesContainer = document.getElementById('mod-categories');

let strictLoaderMode = localStorage.getItem('minecore_strict_loader') === 'true';
const strictLoaderToggle = document.getElementById('strict-loader-toggle');
const strictLoaderWrap = document.getElementById('strict-loader-wrap');
if (strictLoaderToggle) strictLoaderToggle.checked = strictLoaderMode;
strictLoaderToggle?.addEventListener('change', () => {
    strictLoaderMode = strictLoaderToggle.checked;
    localStorage.setItem('minecore_strict_loader', String(strictLoaderMode));
    currentModPage = 0;
    fetchMods();
});

function capitalizeCategory(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

async function ensureModrinthCategories() {
    if (modrinthCategoriesCache) return modrinthCategoriesCache;
    try {
        const res = await fetch('https://api.modrinth.com/v2/tag/category');
        modrinthCategoriesCache = await res.json();
    } catch (e) {
        modrinthCategoriesCache = [];
    }
    return modrinthCategoriesCache;
}

async function renderModCategories() {
    if (!modCategoriesContainer) return;
    const all = await ensureModrinthCategories();
    const relevant = all.filter(c => c.project_type === currentModrinthType && c.header === 'categories');

    if (relevant.length === 0) {
        modCategoriesContainer.innerHTML = '';
        modCategoriesContainer.style.display = 'none';
        return;
    }

    modCategoriesContainer.style.display = 'flex';
    const clearBtn = selectedCategories.size > 0
        ? `<button class="cat-chip cat-chip-clear" id="cat-clear-btn">✕ Temizle</button>`
        : '';

    modCategoriesContainer.innerHTML = clearBtn + relevant.map(c => `
        <button class="cat-chip${selectedCategories.has(c.name) ? ' active' : ''}" data-cat="${c.name}">
            ${c.icon ? `<span class="cat-chip-icon">${c.icon}</span>` : ''}
            <span>${capitalizeCategory(c.name)}</span>
        </button>
    `).join('');

    document.getElementById('cat-clear-btn')?.addEventListener('click', () => {
        selectedCategories.clear();
        currentModPage = 0;
        renderModCategories();
        fetchMods();
    });

    modCategoriesContainer.querySelectorAll('.cat-chip[data-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            if (selectedCategories.has(cat)) selectedCategories.delete(cat);
            else selectedCategories.add(cat);
            currentModPage = 0;
            renderModCategories();
            fetchMods();
        });
    });
}

mrTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        mrTabs.forEach(tb => tb.classList.remove('active')); tab.classList.add('active');
        currentModrinthType = tab.getAttribute('data-type');
        currentModPage = 0; currentQuery = ''; selectedCategories.clear();
        if(modSearchInput) modSearchInput.value = '';
        const btn = document.getElementById('btn-show-installed');
        if (btn) btn.dataset.active = 'false';
        updateSearchPlaceholder(); renderModCategories(); fetchMods();
    });
});
renderModCategories();

document.getElementById('mod-search-btn')?.addEventListener('click', () => { currentQuery = modSearchInput?.value?.trim() || ''; currentModPage = 0; fetchMods(); });
modSearchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { currentQuery = modSearchInput.value.trim(); currentModPage = 0; fetchMods(); } });
pagePrevBtn?.addEventListener('click', () => { if (currentModPage > 0) { currentModPage--; fetchMods(); } });
pageNextBtn?.addEventListener('click', () => { currentModPage++; fetchMods(); });

async function fetchMods() {
    const scrollPos = modResultsGrid ? modResultsGrid.scrollTop : 0;
    if(modResultsGrid) modResultsGrid.innerHTML = `<p style="color: #aaa;">${t('loading')}</p>`;
    if(pageIndicator) pageIndicator.innerText = currentModPage + 1;
    if(pagePrevBtn) pagePrevBtn.disabled = currentModPage === 0;

    const offset = currentModPage * MODS_PER_PAGE;

    let facets;
    const facetGroups = [`["project_type:${currentModrinthType}"]`];
    let appliedLoader = null;
    const loaderFamilies = { forge: ['forge'], neoforge: ['neoforge'], fabric: ['fabric', 'quilt'] };
    const allLoaderTags = ['forge', 'neoforge', 'fabric', 'quilt'];
    if (currentModrinthType === 'mod' && activePack && activePack !== 'Varsayılan') {
        const config = getPackConfig(activePack);
        if (config.loader && config.loader !== 'vanilla') {
            appliedLoader = config.loader;
            let loaderFacet;
            if (config.loader === 'forge') {
                loaderFacet = `["categories:forge"]`;
            } else if (config.loader === 'neoforge') {
                loaderFacet = `["categories:neoforge"]`;
            } else if (config.loader === 'fabric') {
                loaderFacet = `["categories:fabric","categories:quilt"]`;
            } else {
                loaderFacet = `["categories:${config.loader}"]`;
            }
            facetGroups.push(loaderFacet);

            if (strictLoaderMode) {
                const allowedFamily = new Set(loaderFamilies[config.loader] || [config.loader]);
                allLoaderTags.filter(l => !allowedFamily.has(l)).forEach(l => {
                    facetGroups.push(`["categories!=${l}"]`);
                });
            }
        }
    }
    if (strictLoaderWrap) strictLoaderWrap.style.display = appliedLoader ? 'flex' : 'none';
    selectedCategories.forEach(cat => {
        facetGroups.push(`["categories:${cat}"]`);
    });
    facets = `[${facetGroups.join(',')}]`;

    const contextBadge = document.getElementById('mod-context-badge');
    if (contextBadge) {
        if (currentModrinthType !== 'mod') {
            contextBadge.innerText = '';
        } else if (activePack === 'Varsayılan' || !activePack) {
            contextBadge.innerHTML = `Paket seçilmedi — filtresiz genel arama`;
        } else if (appliedLoader) {
            const strictNote = strictLoaderMode ? ` <span style="color:#666;">(kesin)</span>` : '';
            contextBadge.innerHTML = `📦 <span style="color:#00e676;">${activePack}</span> · Loader filtresi: <span style="color:#00e676;text-transform:capitalize;">${appliedLoader}</span>${strictNote}`;
        } else {
            contextBadge.innerHTML = `📦 <span style="color:#00e676;">${activePack}</span> · Loader: Vanilla (filtre uygulanmadı)`;
        }
    }

    let url = `https://api.modrinth.com/v2/search?limit=${MODS_PER_PAGE}&offset=${offset}&facets=${encodeURIComponent(facets)}`;
    if (currentQuery) url += `&query=${encodeURIComponent(currentQuery)}`; else url += `&index=downloads`;

    try {
        const res = await fetch(url); const data = await res.json(); renderMods(data.hits);
        if(pageNextBtn) pageNextBtn.disabled = data.hits.length < MODS_PER_PAGE;
        if(modResultsGrid) modResultsGrid.scrollTop = scrollPos;
    } catch (e) { if(modResultsGrid) modResultsGrid.innerHTML = `<p style="color: #ff4757;">API Error.</p>`; }
}

function getLoaderBadges(categories) {
    if (!Array.isArray(categories)) return '';
    const known = { fabric: '#dbb69b', forge: '#909590', neoforge: '#d7837f', quilt: '#a674e4' };
    const found = Object.keys(known).filter(l => categories.includes(l));
    if (found.length === 0) return '';
    return `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:-6px;">${found.map(l =>
        `<span style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:2px 6px;border-radius:4px;background:${known[l]}22;color:${known[l]};border:1px solid ${known[l]}44;">${l}</span>`
    ).join('')}</div>`;
}

function renderMods(mods) {
    if(!modResultsGrid) return;
    modResultsGrid.innerHTML = '';
    if(mods.length === 0) { modResultsGrid.innerHTML = `<p style="color: #aaa;">${t('no_result')}</p>`; return; }
    const installedMods = getInstalledMods();
    mods.forEach(mod => {
        const card = document.createElement('div'); card.className = 'mod-card';
        const isInstalled = !!installedMods[mod.project_id];
        
        let btnHtml = '';
        if (currentModrinthType === 'modpack') {
            btnHtml = `<button class="ms-btn vyra-btn" onclick="installModpack('${mod.project_id}', '${mod.title.replace(/'/g, "\\'")}')">${t('btn_install_pack')}</button>`;
        } else {
            if (activePack === 'Varsayılan') btnHtml = `<button class="ms-btn" disabled style="background:rgba(255,255,255,0.05); color:#555;">${t('btn_select_pack')}</button>`;
            else if (isInstalled && currentModrinthType === 'mod') btnHtml = `<button class="ms-btn logout-btn" onclick="deleteMod('${mod.project_id}')">${t('btn_delete')}</button>`;
            else btnHtml = `<button class="ms-btn vyra-btn" onclick="openModVersionModal('${mod.project_id}')">${t('btn_download')}</button>`;
        }

        const loaderBadges = currentModrinthType === 'mod' ? getLoaderBadges(mod.categories) : '';
                
        card.innerHTML = `
            <div class="mod-header" style="cursor:pointer;" onclick="window.openModDetail('${mod.project_id}','${mod.title.replace(/'/g,"\\'")}')">
                <img src="${mod.icon_url || 'https://via.placeholder.com/48'}" class="mod-icon">
                <div>
                    <div class="mod-title" style="text-decoration:underline dotted;text-underline-offset:3px;">${mod.title}</div>
                    <div class="mod-author">${mod.author}</div>
                </div>
            </div>
            <div class="mod-desc">${mod.description}</div>
            ${loaderBadges}
            ${btnHtml}`;
        modResultsGrid.appendChild(card);
    });
}

const modViewToggle = document.getElementById('mod-view-toggle');
let modViewMode = localStorage.getItem('minecore_mod_view') || 'grid';
function applyModViewMode() {
    if (!modResultsGrid) return;
    modResultsGrid.classList.toggle('list-view', modViewMode === 'list');
    modViewToggle?.querySelectorAll('.view-toggle-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.view === modViewMode);
    });
}
modViewToggle?.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        modViewMode = btn.dataset.view;
        localStorage.setItem('minecore_mod_view', modViewMode);
        applyModViewMode();
    });
});
applyModViewMode();

const modDiscoverPanel = document.querySelector('.discover-main');
const modDropzoneOverlay = document.getElementById('mod-dropzone-overlay');
let _modDragDepth = 0;

function installDroppedFiles(fileList) {
    if (currentModrinthType === 'modpack') {
        showToast("Modpack'ler sürükle-bırak ile değil, İndir butonuyla kurulur.", 'error');
        return;
    }
    if (activePack === 'Varsayılan') {
        showToast(t('select_pack_first'), 'error');
        return;
    }

    const wantExt = currentModrinthType === 'resourcepack' ? '.zip' : '.jar';
    const targetFolder = currentModrinthType === 'resourcepack' ? 'resourcepacks' : 'mods';
    const targetDir = path.join(packsDir, activePack, targetFolder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    let installedCount = 0, skippedCount = 0;
    for (const file of fileList) {
        const srcPath = file.path;
        if (!srcPath) continue;
        if (path.extname(srcPath).toLowerCase() !== wantExt) { skippedCount++; continue; }
        try {
            fs.copyFileSync(srcPath, path.join(targetDir, path.basename(srcPath)));
            installedCount++;
        } catch (e) {
            appendConsole(`Kopyalama hatası (${file.name}): ${e.message}`, 'error');
        }
    }

    if (installedCount > 0) {
        showToast(`${installedCount} dosya yüklendi!`, 'success');
        if (document.getElementById('btn-show-installed')?.dataset.active === 'true') {
            document.getElementById('btn-show-installed')?.click();
        }
    }
    if (skippedCount > 0 && installedCount === 0) {
        showToast(`Sadece ${wantExt} dosyaları buraya bırakılabilir.`, 'error');
    } else if (skippedCount > 0) {
        showToast(`${skippedCount} dosya uzantısı uyumsuz olduğu için atlandı.`, 'warn');
    }
}

if (modDiscoverPanel) {
    ['dragenter', 'dragover'].forEach(evt => {
        modDiscoverPanel.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            if (evt === 'dragenter') _modDragDepth++;
            modDropzoneOverlay?.classList.add('active');
        });
    });
    modDiscoverPanel.addEventListener('dragleave', (e) => {
        e.preventDefault(); e.stopPropagation();
        _modDragDepth--;
        if (_modDragDepth <= 0) { _modDragDepth = 0; modDropzoneOverlay?.classList.remove('active'); }
    });
    modDiscoverPanel.addEventListener('drop', (e) => {
        e.preventDefault(); e.stopPropagation();
        _modDragDepth = 0;
        modDropzoneOverlay?.classList.remove('active');
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) installDroppedFiles(files);
    });
}

window.deleteMod = function(projectId) { removeInstalledMod(projectId); fetchMods(); };

window.installModpack = async function(projectId, title) {
    currentModDownloadId = projectId; window.currentModpackTitle = title; 
    const titleEl = document.getElementById('mod-version-title');
    const gvSelect = document.getElementById('mod-version-gv-select');
    const loaderSelect = document.getElementById('mod-version-loader-select');
    if(gvSelect) gvSelect.style.display = 'none';
    if(loaderSelect) loaderSelect.style.display = 'none';
    document.querySelectorAll('.modal-select-label').forEach(l => l.style.display = 'none');
    if(modVersionSelect) modVersionSelect.style.display = 'block';

    if(titleEl) titleEl.innerText = t('modpack_ver_title');
    if(modVersionSelect) modVersionSelect.innerHTML = `<option>${t('loading')}</option>`; 
    if(modVersionModal) modVersionModal.style.display = 'flex'; 
    if(modVersionConfirm) modVersionConfirm.disabled = true;
    try {
        const versions = await (await fetch(`https://api.modrinth.com/v2/project/${projectId}/version?limit=100`)).json();
        window.currentModpackVersions = versions; 
        if (versions.length === 0) { if(modVersionSelect) modVersionSelect.innerHTML = `<option value="">${t('ver_none')}</option>`; } 
        else {
            if(modVersionSelect) modVersionSelect.innerHTML = versions.map(v => `<option value="${v.id}">${v.name} (MC: ${v.game_versions[0]} - ${v.loaders.join(', ')})</option>`).join('');
            if(modVersionConfirm) modVersionConfirm.disabled = false;
        }
    } catch (e) { if(modVersionSelect) modVersionSelect.innerHTML = `<option value="">${t('ver_error')}</option>`; }
}

let _allProjectVersions = [];

window.openModVersionModal = async function(projectId) {
    if (activePack === 'Varsayılan') return; currentModDownloadId = projectId; const config = getPackConfig(activePack);
    const titleEl = document.getElementById('mod-version-title');
    const descEl = document.getElementById('mod-version-desc');
    const gvSelect = document.getElementById('mod-version-gv-select');
    const loaderSelect = document.getElementById('mod-version-loader-select');

    if(gvSelect) gvSelect.style.display = 'block';
    if(loaderSelect) loaderSelect.style.display = 'block';
    document.querySelectorAll('.modal-select-label').forEach(l => l.style.display = 'block');
    if(modVersionSelect) modVersionSelect.style.display = 'none';

    if(titleEl) titleEl.innerText = t('modal_ver_title');
    if(descEl) { descEl.innerText = t('modal_ver_desc'); descEl.style.color = ''; }
    if(gvSelect) gvSelect.innerHTML = `<option>${t('loading')}</option>`;
    if(loaderSelect) loaderSelect.innerHTML = '';
    if(modVersionSelect) modVersionSelect.innerHTML = '';
    if(modVersionModal) modVersionModal.style.display = 'flex';
    if(modVersionConfirm) modVersionConfirm.disabled = true;

    try {
        const urlAll = `https://api.modrinth.com/v2/project/${projectId}/version?limit=100`;
        _allProjectVersions = await (await fetch(urlAll)).json();

        if (_allProjectVersions.length === 100) {
            try {
                const urlTargeted = `https://api.modrinth.com/v2/project/${projectId}/version?game_versions=["${config.version}"]`;
                const targeted = await (await fetch(urlTargeted)).json();
                const existingIds = new Set(_allProjectVersions.map(v => v.id));
                targeted.forEach(v => { if (!existingIds.has(v.id)) _allProjectVersions.push(v); });
            } catch(_) {}
        }

        if (!_allProjectVersions || _allProjectVersions.length === 0) {
            if(gvSelect) gvSelect.innerHTML = `<option value="">${t('ver_none')}</option>`;
            return;
        }

        const allGameVersions = [...new Set(_allProjectVersions.flatMap(v => v.game_versions))];
        allGameVersions.sort((a, b) => {
            const pa = a.split('.').map(n => parseInt(n) || 0);
            const pb = b.split('.').map(n => parseInt(n) || 0);
            for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                const diff = (pb[i]||0) - (pa[i]||0);
                if (diff !== 0) return diff;
            }
            return 0;
        });

        if(gvSelect) {
            gvSelect.innerHTML = allGameVersions.map(gv => `<option value="${gv}">${gv}</option>`).join('');
            if (allGameVersions.includes(config.version)) gvSelect.value = config.version;
        }

        _updateLoaderOptions(config);
    } catch (e) {
        if(gvSelect) gvSelect.innerHTML = `<option value="">${t('ver_error')}</option>`;
    }
};

function _updateLoaderOptions(config) {
    const gvSelect = document.getElementById('mod-version-gv-select');
    const loaderSelect = document.getElementById('mod-version-loader-select');
    if (!gvSelect || !loaderSelect) return;
    const selectedGv = gvSelect.value;

    const matching = _allProjectVersions.filter(v => v.game_versions.includes(selectedGv));
    const allLoaders = [...new Set(matching.flatMap(v => v.loaders))];

    if (allLoaders.length === 0) {
        loaderSelect.innerHTML = `<option value="">${t('ver_none')}</option>`;
        _updateFinalVersion();
        return;
    }

    loaderSelect.innerHTML = allLoaders.map(l => `<option value="${l}">${l.charAt(0).toUpperCase()+l.slice(1)}</option>`).join('');
    if (config && allLoaders.includes(config.loader)) loaderSelect.value = config.loader;

    _updateFinalVersion();
}

function _updateFinalVersion() {
    const gvSelect = document.getElementById('mod-version-gv-select');
    const loaderSelect = document.getElementById('mod-version-loader-select');
    if (!gvSelect || !loaderSelect || !modVersionSelect) return;
    const selectedGv = gvSelect.value;
    const selectedLoader = loaderSelect.value;

    const matching = _allProjectVersions.filter(v =>
        v.game_versions.includes(selectedGv) && (!selectedLoader || v.loaders.includes(selectedLoader))
    );

    if (matching.length === 0) {
        modVersionSelect.innerHTML = `<option value="">${t('ver_none')}</option>`;
        if(modVersionConfirm) modVersionConfirm.disabled = true;
    } else {
        modVersionSelect.innerHTML = matching.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
        if(modVersionConfirm) modVersionConfirm.disabled = false;
    }
}

document.getElementById('mod-version-gv-select')?.addEventListener('change', () => {
    const config = activePack !== 'Varsayılan' ? getPackConfig(activePack) : null;
    _updateLoaderOptions(config);
});
document.getElementById('mod-version-loader-select')?.addEventListener('change', _updateFinalVersion);

document.getElementById('mod-version-cancel')?.addEventListener('click', () => { if(modVersionModal) modVersionModal.style.display = 'none'; });

document.getElementById('mod-version-confirm')?.addEventListener('click', async () => {
    if(!modVersionSelect || !modVersionConfirm) return;
    const versionId = modVersionSelect.value; if (!versionId) return;
    modVersionConfirm.innerText = t('downloading'); modVersionConfirm.disabled = true;
    
    if (currentModrinthType === 'modpack') {
        let newPackPath = null;
        let cancelled = false;
        let abortController = new AbortController();

        window._mpCancelInstall = () => {
            cancelled = true;
            abortController.abort();
        };

        try {
            const versionData = window.currentModpackVersions.find(v => v.id === versionId);
            const mcVersion = versionData.game_versions[0];
            let loader = 'vanilla';
            if (versionData.loaders.includes('fabric')) loader = 'fabric';
            else if (versionData.loaders.includes('neoforge')) loader = 'neoforge';
            else if (versionData.loaders.includes('forge')) loader = 'forge';
            else if (versionData.loaders.includes('quilt')) loader = 'fabric';

            let safeTitle = (window.currentModpackTitle || 'Modpack').replace(/[^a-zA-Z0-9 \-_]/g, '').trim() || 'Modpack';
            let packName = safeTitle; let counter = 1;
            while (fs.existsSync(path.join(packsDir, packName))) { packName = `${safeTitle} ${counter}`; counter++; }
            newPackPath = path.join(packsDir, packName);
            fs.mkdirSync(newPackPath, { recursive: true });
            fs.writeFileSync(path.join(newPackPath, 'minecore_config.json'), JSON.stringify({ version: mcVersion, loader, isolated: true }));

            let progressOverlay = document.getElementById('mp-progress-overlay');
            if (!progressOverlay) {
                progressOverlay = document.createElement('div');
                progressOverlay.id = 'mp-progress-overlay';
                progressOverlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;`;
                document.body.appendChild(progressOverlay);
            }
            progressOverlay.style.display = 'flex';
            progressOverlay.innerHTML = `
                <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:2px;" id="mp-progress-title">${t('mp_installing')}</div>
                <div style="font-size:13px;color:#aaa;max-width:400px;text-align:center;" id="mp-progress-sub"></div>
                <div style="width:400px;background:rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">
                    <div id="mp-progress-bar" style="height:10px;background:#00e676;width:0%;transition:width 0.2s ease;box-shadow:0 0 12px rgba(0,230,118,0.5);"></div>
                </div>
                <div style="font-size:13px;color:#00e676;font-weight:700;" id="mp-progress-pct">0%</div>
                <button id="mp-cancel-btn" onclick="window._mpCancelInstall()"
                    style="margin-top:8px;background:rgba(255,71,87,0.1);color:#ff4757;border:1px solid rgba(255,71,87,0.3);padding:10px 30px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:1px;text-transform:uppercase;transition:0.2s;"
                    onmouseover="this.style.background='rgba(255,71,87,0.25)'" onmouseout="this.style.background='rgba(255,71,87,0.1)'"
                >${t('btn_cancel')}</button>
            `;

            const setProgress = (pct, sub) => {
                const bar = document.getElementById('mp-progress-bar');
                const pctEl = document.getElementById('mp-progress-pct');
                const subEl = document.getElementById('mp-progress-sub');
                if(bar) bar.style.width = pct + '%';
                if(pctEl) pctEl.innerText = Math.round(pct) + '%';
                if(subEl && sub) subEl.innerText = sub;
            };

            if(modVersionModal) modVersionModal.style.display = 'none';

            const mrpackFile = versionData.files.find(f => f.filename.endsWith('.mrpack')) || versionData.files[0];
            setProgress(5, t('mp_reading'));
            const mrpackBuf = Buffer.from(await (await fetch(mrpackFile.url, { signal: abortController.signal })).arrayBuffer());

            if (cancelled) throw new Error('CANCELLED');

            const AdmZip = require('adm-zip');
            const zip = new AdmZip(mrpackBuf);
            const indexEntry = zip.getEntry('modrinth.index.json');
            if (!indexEntry) throw new Error('modrinth.index.json not found');
            const index = JSON.parse(zip.readAsText(indexEntry));

            const overrideDir = path.join(newPackPath);
            zip.getEntries().forEach(entry => {
                if (entry.entryName.startsWith('overrides/') && !entry.isDirectory) {
                    const rel = entry.entryName.replace('overrides/', '');
                    const dest = path.join(overrideDir, rel);
                    fs.mkdirSync(path.dirname(dest), { recursive: true });
                    fs.writeFileSync(dest, entry.getData());
                }
            });

            const files = (index.files || []).filter(f => f.downloads && f.downloads.length > 0);
            const total = files.length;
            setProgress(10, `${t('mp_progress')}: 0 / ${total}`);
            for (let i = 0; i < files.length; i++) {
                if (cancelled) throw new Error('CANCELLED');
                const f = files[i];
                const destPath = path.join(newPackPath, f.path);
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
                try {
                    const buf = Buffer.from(await (await fetch(f.downloads[0], { signal: abortController.signal })).arrayBuffer());
                    fs.writeFileSync(destPath, buf);
                } catch (_) { if (cancelled) throw new Error('CANCELLED'); }
                const pct = 10 + ((i + 1) / total) * 88;
                setProgress(pct, `${t('mp_progress')}: ${i + 1} / ${total}`);
            }

            setProgress(100, t('mp_done'));
            document.getElementById('mp-progress-title').innerText = t('mp_done');
            document.getElementById('mp-progress-title').style.color = '#00e676';
            document.getElementById('mp-cancel-btn').style.display = 'none';
            window._mpCancelInstall = null;
            setTimeout(() => {
                progressOverlay.style.display = 'none';
                document.getElementById('mp-progress-title').style.color = '#fff';
            }, 2200);

            activePack = packName; loadPacks(); loadAllVersions();
            startModsWatcher(packName);
            modVersionConfirm.innerText = t('btn_download'); modVersionConfirm.disabled = false;
        } catch (e) {
            const overlay = document.getElementById('mp-progress-overlay');
            const isCancelled = e.message === 'CANCELLED' || e.name === 'AbortError';
            if (newPackPath && fs.existsSync(newPackPath)) {
                try { fs.rmSync(newPackPath, { recursive: true, force: true }); } catch(_) {}
            }
            window._mpCancelInstall = null;
            if (overlay) {
                const titleEl = document.getElementById('mp-progress-title');
                const subEl = document.getElementById('mp-progress-sub');
                if (titleEl) {
                    titleEl.innerText = isCancelled ? t('mp_cancelled') : t('mp_err');
                    titleEl.style.color = isCancelled ? '#ffb300' : '#ff4757';
                }
                if (subEl) subEl.innerText = isCancelled ? '' : (e.message || '');
                const cancelBtn = document.getElementById('mp-cancel-btn');
                if (cancelBtn) cancelBtn.style.display = 'none';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    if (titleEl) titleEl.style.color = '#fff';
                }, isCancelled ? 1500 : 3000);
            }
            modVersionConfirm.innerText = t('btn_download'); modVersionConfirm.disabled = false;
        }
    } else {
        try {
            const file = (await (await fetch(`https://api.modrinth.com/v2/version/${versionId}`)).json()).files[0];
            let targetFolder = currentModrinthType === 'resourcepack' ? 'resourcepacks' : 'mods';
            const dir = path.join(packsDir, activePack, targetFolder); 
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            
            fs.writeFileSync(path.join(dir, file.filename), Buffer.from(await (await fetch(file.url)).arrayBuffer()));
            if(currentModrinthType === 'mod') saveInstalledMod(currentModDownloadId, file.filename); 
            
            if(modVersionModal) modVersionModal.style.display = 'none'; 
            modVersionConfirm.innerText = t('btn_download');
            fetchMods();
        } catch (e) { modVersionConfirm.innerText = t('btn_download'); modVersionConfirm.disabled = false; }
    }
});

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(downloadFile(res.headers.location, dest));
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`İndirme başarısız. Kodu: ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', (err) => { 
            fs.unlink(dest, ()=>{}); 
            reject(err); 
        });
    });
}

function findJavaRecursively(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const result = findJavaRecursively(fullPath);
            if (result) return result;
        } else if (file === 'java.exe' || file === 'java') {
            return fullPath;
        }
    }
    return null;
}

function getRequiredJavaVersion(mcVersion) {
    const newFormatMatch = mcVersion.match(/^(\d{2})\.(\d+)/);
    if (newFormatMatch) {
        const year = parseInt(newFormatMatch[1]);
        if (year >= 26) return 25; 
    }

    const oldFormatMatch = mcVersion.match(/1\.(\d+)(\.(\d+))?/);
    if (!oldFormatMatch) return 8; 
    
    const minor = parseInt(oldFormatMatch[1]);
    const patch = parseInt(oldFormatMatch[3]) || 0;
    
    if (minor >= 20 && patch >= 5) return 21; 
    if (minor >= 21) return 21; 
    if (minor >= 17) return 17; 
    return 8; 
}
async function ensureJava(targetJavaVer) {
    const runtimesDir = path.join(originalPath, 'runtimes');
    if (!fs.existsSync(runtimesDir)) fs.mkdirSync(runtimesDir, { recursive: true });
    
    const osName = os.platform() === 'win32' ? 'windows' : (os.platform() === 'darwin' ? 'mac' : 'linux');
    const arch = os.arch() === 'arm64' ? 'aarch64' : (os.arch() === 'x64' ? 'x64' : 'x32');
    const ext = osName === 'windows' ? 'zip' : 'tar.gz';
    
    const javaDir = path.join(runtimesDir, `jre-${targetJavaVer}`);
    
    if (fs.existsSync(javaDir)) {
       const foundExe = findJavaRecursively(javaDir);
       if(foundExe) return foundExe;
       fs.rmSync(javaDir, { recursive: true, force: true });
    }

    if(statusText) statusText.innerText = `Java ${targetJavaVer} İndiriliyor...`;
    
    const archivePath = path.join(runtimesDir, `jre-${targetJavaVer}.${ext}`);
    const jreUrl = `https://api.adoptium.net/v3/binary/latest/${targetJavaVer}/ga/${osName}/${arch}/jre/hotspot/normal/eclipse?project=jdk`;
    
    try {
        await downloadFile(jreUrl, archivePath);
    } catch (e) {
        if(statusText) statusText.innerText = `JRE bulunamadı, JDK indiriliyor...`;
        const jdkUrl = `https://api.adoptium.net/v3/binary/latest/${targetJavaVer}/ga/${osName}/${arch}/jdk/hotspot/normal/eclipse?project=jdk`;
        await downloadFile(jdkUrl, archivePath);
    }
    
    if(statusText) statusText.innerText = `Java ${targetJavaVer} Kuruluyor...`;
    
    try {
        if (osName === 'windows') {
            const zip = new admZip(archivePath);
            zip.extractAllTo(javaDir, true);
        } else {
            if (!fs.existsSync(javaDir)) fs.mkdirSync(javaDir);
            await tar.x({ file: archivePath, cwd: javaDir });
        }
    } catch (extractErr) {
        if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);
        if (fs.existsSync(javaDir)) fs.rmSync(javaDir, { recursive: true, force: true });
        throw new Error("Arşivden çıkarma hatası.");
    }
    
    if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath); 
    
    const finalExe = findJavaRecursively(javaDir);
    if (osName !== 'windows' && finalExe) fs.chmodSync(finalExe, 0o755); 
    
    return finalExe || 'java';
}


async function autoInstallFabric(gameVersion) {
    try {
        let loaderData = await (await fetch(`https://meta.fabricmc.net/v2/versions/loader/${gameVersion}`)).json();

        if (!loaderData || loaderData.length === 0) {
            if(statusText) statusText.innerText = `Fabric: ${gameVersion} için uyumlu sürüm aranıyor...`;

            const manifest = await (await fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')).json();
            
            const parts = gameVersion.split('.');
            const majorMinor = parts.slice(0, 2).join('.');
            
            const candidates = manifest.versions
                .filter(v => v.type === 'release' && v.id.startsWith(majorMinor))
                .map(v => v.id)
                .sort((a, b) => {
                    const pa = a.split('.').map(Number);
                    const pb = b.split('.').map(Number);
                    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                        const diff = (pb[i] || 0) - (pa[i] || 0);
                        if (diff !== 0) return diff;
                    }
                    return 0;
                });

            for (const candidate of candidates) {
                const check = await (await fetch(`https://meta.fabricmc.net/v2/versions/loader/${candidate}`)).json();
                if (check && check.length > 0) {
                    gameVersion = candidate;
                    loaderData = check;
                    if(statusText) statusText.innerText = `Fabric: ${gameVersion} sürümü kullanılıyor...`;
                    break;
                }
            }
        }

        if (!loaderData || loaderData.length === 0) throw new Error(`Fabric için uyumlu MC sürümü bulunamadı.`);

        const latestEntry = loaderData.find(e => e.loader && e.loader.stable) || loaderData[0];
        const loaderVer = latestEntry.loader.version;
        const fName = `fabric-loader-${loaderVer}-${gameVersion}`;
        const tDir = path.join(originalPath, 'versions', fName);
        const jsonPath = path.join(tDir, `${fName}.json`);
        if (fs.existsSync(jsonPath)) return fName;
        if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
        const profileJson = await (await fetch(`https://meta.fabricmc.net/v2/versions/loader/${gameVersion}/${loaderVer}/profile/json`)).json();
        fs.writeFileSync(jsonPath, JSON.stringify(profileJson, null, 2));
        appendConsole(`Fabric Loader ${loaderVer} kuruldu.`, 'info');
        return fName;
    } catch (e) { throw e; }
}

async function autoInstallForge(gameVersion) {
    if(statusText) statusText.innerText = `Forge ${gameVersion} ${t('status_downloading')}...`;

    let forgeVersion = null;
    let resolvedMcVersion = gameVersion;

    const findForgeVersion = async (mcVer) => {
        try {
            const xml = await (await fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml`)).text();
            const matches = [...xml.matchAll(/<version>([^<]+)<\/version>/g)].map(m => m[1]);
            const compatible = matches.filter(v => v.startsWith(mcVer + '-'));
            if (compatible.length === 0) return null;
            compatible.sort((a, b) => {
                const na = a.split('-')[1]?.split('.').map(Number) || [];
                const nb = b.split('-')[1]?.split('.').map(Number) || [];
                for (let i = 0; i < Math.max(na.length, nb.length); i++) {
                    const diff = (nb[i]||0) - (na[i]||0);
                    if (diff !== 0) return diff;
                }
                return 0;
            });
            return compatible[0];
        } catch(_) { return null; }
    };

    let fullForgeVer = await findForgeVersion(gameVersion);

    if (!fullForgeVer) {
        if(statusText) statusText.innerText = `Forge: ${gameVersion} için uyumlu sürüm aranıyor...`;
        try {
            const manifest = await (await fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')).json();
            const parts = gameVersion.split('.');
            const majorMinor = parts.slice(0, 2).join('.');
            const candidates = manifest.versions
                .filter(v => v.type === 'release' && v.id.startsWith(majorMinor))
                .map(v => v.id)
                .sort((a, b) => {
                    const pa = a.split('.').map(Number);
                    const pb = b.split('.').map(Number);
                    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                        const diff = (pb[i]||0) - (pa[i]||0);
                        if (diff !== 0) return diff;
                    }
                    return 0;
                });
            for (const candidate of candidates) {
                const ver = await findForgeVersion(candidate);
                if (ver) { fullForgeVer = ver; resolvedMcVersion = candidate; break; }
            }
        } catch(_) {}
    }

    if (!fullForgeVer) throw new Error(`Forge ${resolvedMcVersion} için sürüm bulunamadı.`);

    const mcPart = fullForgeVer.split('-')[0];
    const forgePart = fullForgeVer.split('-').slice(1).join('-');
    if(statusText) statusText.innerText = `Forge ${fullForgeVer} kuruluyor...`;

    const installerName = `forge-${fullForgeVer}-installer.jar`;
    const installerUrl = `https://maven.minecraftforge.net/net/minecraftforge/forge/${fullForgeVer}/${installerName}`;
    const installerPath = path.join(originalPath, installerName);

    await downloadFile(installerUrl, installerPath);

    const requiredJava = getRequiredJavaVersion(mcPart || resolvedMcVersion);
    if(statusText) statusText.innerText = `Java ${requiredJava} kontrol ediliyor...`;
    const javaExe = await ensureJava(requiredJava);

    if(statusText) statusText.innerText = `Forge kuruluyor... (bu biraz sürebilir)`;
    await new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const proc = spawn(javaExe, [
            '-Djava.awt.headless=true',
            '-jar', installerPath,
            '--installClient'
        ], {
            cwd: originalPath, stdio: ['ignore', 'pipe', 'pipe']
        });
        proc.stdout?.on('data', (d) => appendConsole(`[Forge] ${d.toString().trim()}`, 'info'));
        proc.stderr?.on('data', (d) => appendConsole(`[Forge] ${d.toString().trim()}`, 'warn'));
        proc.on('close', (code) => {
            if (fs.existsSync(installerPath)) fs.unlinkSync(installerPath);
            if (code === 0) resolve();
            else reject(new Error(`Forge installer hata kodu: ${code}`));
        });
        proc.on('error', (err) => {
            if (fs.existsSync(installerPath)) fs.unlinkSync(installerPath);
            reject(err);
        });
    });

    const escapedMc = (mcPart||resolvedMcVersion).replace(/\./g,'\\.');
    const forgeRegex = new RegExp(`(forge[^\\d]*${escapedMc}[-_]|${escapedMc}[-_]forge[-_])`);
    if (!installed) throw new Error('Forge kuruldu ama version klasörü bulunamadı.');
    return installed;
}

async function autoInstallNeoForge(gameVersion) {
    if(statusText) statusText.innerText = `NeoForge ${gameVersion} ${t('status_downloading')}...`;

    let neoVersion = null;
    let resolvedMcVersion = gameVersion;

    const tryGetNeoVersion = async (mcVer) => {
        try {
            const meta = await (await fetch(`https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml`)).text();
            const matches = [...meta.matchAll(/<version>([^<]+)<\/version>/g)].map(m => m[1]);
            const mcShort = mcVer.split('.').slice(1).join('.');
            const compatible = matches.filter(v => v.startsWith(mcShort + '.'));
            return compatible.length > 0 ? compatible[compatible.length - 1] : null;
        } catch(_) { return null; }
    };

    neoVersion = await tryGetNeoVersion(gameVersion);

    if (!neoVersion) throw new Error(`NeoForge ${gameVersion} için sürüm bulunamadı.`);

    if(statusText) statusText.innerText = `NeoForge ${neoVersion} kuruluyor...`;

    const installerName = `neoforge-${neoVersion}-installer.jar`;
    const installerUrl = `https://maven.neoforged.net/releases/net/neoforged/neoforge/${neoVersion}/${installerName}`;
    const installerPath = path.join(originalPath, installerName);

    await downloadFile(installerUrl, installerPath);

    const requiredJava = getRequiredJavaVersion(resolvedMcVersion);
    if(statusText) statusText.innerText = `Java ${requiredJava} kontrol ediliyor...`;
    const javaExe = await ensureJava(requiredJava);

    if(statusText) statusText.innerText = `NeoForge kuruluyor... (bu biraz sürebilir)`;
    await new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const proc = spawn(javaExe, [
            '-Djava.awt.headless=true',
            '-jar', installerPath,
            '--installClient'
        ], {
            cwd: originalPath, stdio: ['ignore', 'pipe', 'pipe']
        });
        proc.stdout?.on('data', (d) => appendConsole(`[NeoForge] ${d.toString().trim()}`, 'info'));
        proc.stderr?.on('data', (d) => appendConsole(`[NeoForge] ${d.toString().trim()}`, 'warn'));
        proc.on('close', (code) => {
            if (fs.existsSync(installerPath)) fs.unlinkSync(installerPath);
            if (code === 0) resolve();
            else reject(new Error(`NeoForge installer hata kodu: ${code}`));
        });
        proc.on('error', (err) => {
            if (fs.existsSync(installerPath)) fs.unlinkSync(installerPath);
            reject(err);
        });
    });

    const neoRegex = new RegExp(`neoforge[^\\d]*${neoVersion.replace(/\./g,'\\.')}`);
    const installed = fs.readdirSync(path.join(originalPath, 'versions')).find(f => neoRegex.test(f));
    if (!installed) throw new Error('NeoForge kuruldu ama version klasörü bulunamadı.');
    return installed;
}

playButton?.addEventListener('click', async () => {
    const activeAcc = accounts.find(a => a.id === activeAccountId);
    if (!activeAcc) {
        if(statusText) statusText.innerText = t('status_no_account');
        return;
    }

    if (activeAcc.type === 'ms') {
        if (statusText) statusText.innerText = 'Hesap doğrulanıyor...';
        try {
            const refreshed = await ipcRenderer.invoke('ms-refresh', activeAcc.data);
            if (refreshed?.ok) {
                activeAcc.data = refreshed.data;
                activeAcc.name = refreshed.data.name || activeAcc.name;
                localStorage.setItem('minecore_accounts', JSON.stringify(accounts));
            } else {
                if (statusText) statusText.innerText = t('status_error') + 'Microsoft oturumu sona erdi, lütfen hesabı yeniden ekleyin.';
                showToast('Microsoft oturumu sona erdi, lütfen hesabı yeniden ekleyin.', 'error', 6000);
                return;
            }
        } catch (e) {
            console.error('MS token yenileme başarısız:', e);
        }
    }

    let baseVer = selectedVersionValue, customLoader = null, gameDir = originalPath; 

    if (baseVer.startsWith('PACK:')) {
        const packName = baseVer.replace('PACK:', ''), config = getPackConfig(packName); baseVer = config.version; gameDir = path.join(packsDir, packName); 
        syncSettings(gameDir);
        const fabricRegex = new RegExp(`fabric[^\\d]*[\\d.]+[-_]${baseVer.replace(/\./g, '\\.')}$`);
        const escapedBaseVer = baseVer.replace(/\./g, '\\.');
        const forgeRegex = new RegExp(`(forge[^\\d]*${escapedBaseVer}[-_]|${escapedBaseVer}[-_]forge[-_])`);
        if (config.loader === 'fabric') {
            const fabricLoaderNum = (name) => (name.match(/fabric[^\d]*([\d.]+)[-_]/) || [])[1] || '0';
            const cmpVer = (a, b) => {
                const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
                for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                    const d = (pb[i] || 0) - (pa[i] || 0);
                    if (d !== 0) return d;
                }
                return 0;
            };
            const installedFabric = fs.readdirSync(path.join(originalPath, 'versions'))
                .filter(f => fabricRegex.test(f))
                .sort((a, b) => cmpVer(fabricLoaderNum(a), fabricLoaderNum(b)));
            if(statusText) statusText.innerText = `Fabric ${baseVer} güncellemeleri kontrol ediliyor...`;
            try {
                customLoader = await autoInstallFabric(baseVer);
                loadAllVersions();
            } catch (e) {
                if (installedFabric.length > 0) {
                    customLoader = installedFabric[0];
                    appendConsole('Fabric güncellemesi kontrol edilemedi, kurulu sürüm kullanılıyor: ' + customLoader, 'warn');
                } else {
                    if(statusText) statusText.innerText = t('status_fabric_err'); if(playButton) playButton.disabled = false; window._gameRunning = false; return;
                }
            }
        } else if (config.loader === 'forge') {
            customLoader = fs.readdirSync(path.join(originalPath, 'versions')).find(f => forgeRegex.test(f));
            if (customLoader) {
                const secureJarDir = path.join(originalPath, 'libraries', 'cpw', 'mods', 'securejarhandler');
                const hasJar = fs.existsSync(secureJarDir) &&
                    fs.readdirSync(secureJarDir).some(f => f.endsWith('.jar'));
                if (!hasJar) {
                    appendConsole('Forge kurulumu eksik (securejarhandler.jar bulunamadı), yeniden kuruluyor...', 'warn');
                    customLoader = null;
                }
            }
            if (!customLoader) {
                if(statusText) statusText.innerText = `Forge ${baseVer} ${t('status_downloading')}...`;
                try { customLoader = await autoInstallForge(baseVer); loadAllVersions(); } catch (e) {
                    appendConsole(`Forge kurulum hatası: ${e.message}`, 'error');
                    if(statusText) statusText.innerText = `Forge kurulum hatası: ${e.message}`;
                    if(playButton) playButton.disabled = false; window._gameRunning = false; return;
                }
            }
        } else if (config.loader === 'neoforge') {
            customLoader = fs.readdirSync(path.join(originalPath, 'versions')).find(f => neoforgeRegex.test(f));
            if (!customLoader) {
                if(statusText) statusText.innerText = `NeoForge ${baseVer} ${t('status_downloading')}...`;
                try { customLoader = await autoInstallNeoForge(baseVer); loadAllVersions(); } catch (e) {
                    appendConsole(`NeoForge kurulum hatası: ${e.message}`, 'error');
                    if(statusText) statusText.innerText = `NeoForge kurulum hatası: ${e.message}`;
                    if(playButton) playButton.disabled = false; window._gameRunning = false; return;
                }
            }
        }
    } else if (baseVer.toLowerCase().match(/forge|fabric|optifine|neoforge/)) {
        const jsonPath = path.join(originalPath, 'versions', baseVer, `${baseVer}.json`);
        if(fs.existsSync(jsonPath)) { baseVer = JSON.parse(fs.readFileSync(jsonPath)).inheritsFrom || baseVer; customLoader = selectedVersionValue; }
    }

    if(playButton) playButton.disabled = true;
    window._gameRunning = true;

    if(statusText) statusText.innerText = t('status_java_check');
    const javaPathInput = document.getElementById('set-java-path');
    let finalJavaPath = javaPathInput ? javaPathInput.value.trim() : '';
    
    if (finalJavaPath === '') {
         try {
             const requiredJavaVersion = getRequiredJavaVersion(baseVer);
             finalJavaPath = await ensureJava(requiredJavaVersion);
         } catch (e) {
             if(statusText) statusText.innerText = t('status_java_err');
             if(playButton) playButton.disabled = false; window._gameRunning = false;
             return;
         }
    }

    const minRamInput = document.getElementById('set-min-ram');
    const maxRamInput = document.getElementById('set-max-ram');

    let elybyJvmArgs = [];
    if (activeAcc.type === 'elyby') {
        try {
            if(statusText) statusText.innerText = 'Ely.by skin sistemi hazırlanıyor...';
            const injectorPath = path.join(originalPath, 'authlib-injector.jar');
            const injectorVerPath = path.join(originalPath, 'authlib-injector.version');
            const metaPath = path.join(originalPath, '_ai_meta.json');
            try {
                await downloadFile('https://authlib-injector.yushi.moe/artifact/latest.json', metaPath);
                const meta = JSON.parse(fs.readFileSync(metaPath));
                const installedVer = fs.existsSync(injectorVerPath) ? fs.readFileSync(injectorVerPath, 'utf8').trim() : '';
                if (!fs.existsSync(injectorPath) || installedVer !== String(meta.version)) {
                    appendConsole(`authlib-injector indiriliyor (v${meta.version})...`, 'info');
                    await downloadFile(meta.download_url, injectorPath);
                    fs.writeFileSync(injectorVerPath, String(meta.version));
                    appendConsole(`authlib-injector güncellendi: v${meta.version}`, 'success');
                }
            } catch (netErr) {
                if (!fs.existsSync(injectorPath)) throw netErr;
                appendConsole('authlib-injector güncellemesi kontrol edilemedi, mevcut sürüm kullanılıyor.', 'warn');
            } finally {
                try { if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath); } catch (_) {}
            }
            if (!fs.existsSync(injectorPath) || fs.statSync(injectorPath).size < 1000) {
                throw new Error('İndirilen authlib-injector.jar dosyası bozuk veya eksik.');
            }
            const ELY_API_ROOT = 'https://authserver.ely.by/api/authlib-injector';
            elybyJvmArgs = [`-javaagent:${injectorPath}=${ELY_API_ROOT}`, '-Dauthlibinjector.debug'];
            appendConsole(`JVM agent eklendi: -javaagent:${injectorPath}=${ELY_API_ROOT}`, 'success');

            try {
                const uuidNoDash = String(activeAcc.data.uuid || '').replace(/-/g, '');
                const pr = await fetch(`https://authserver.ely.by/session/profile/${uuidNoDash}`);
                if (pr.status === 200) {
                    const pj = await pr.json();
                    const texProp = (pj.properties || []).find(x => x.name === 'textures');
                    const texData = texProp ? JSON.parse(Buffer.from(texProp.value, 'base64').toString('utf8')) : null;
                    if (texData && texData.textures && texData.textures.SKIN) {
                        appendConsole('Ely.by skin bulundu, oyunda görünmesi gerekiyor: ' + texData.textures.SKIN.url, 'success');
                    } else {
                        appendConsole('Ely.by hesabında yüklü bir skin yok. Skini account.ely.by adresinden yükle.', 'warn');
                    }
                } else {
                    appendConsole(`Ely.by profil sorgusu başarısız (HTTP ${pr.status}). UUID: ${uuidNoDash}`, 'warn');
                }
            } catch (profErr) {
                appendConsole('Ely.by skin sorgusu yapılamadı: ' + profErr.message, 'warn');
            }
        } catch(e) {
            appendConsole(`authlib-injector hatası: ${e.message}`, 'error');
            showToast('Ely.by skin sistemi yüklenemedi: ' + e.message, 'error', 6000);
            if(playButton) playButton.disabled = false; window._gameRunning = false;
            showConsole();
            return;
        }
    }

    const isForgeLoader = customLoader && customLoader.toLowerCase().match(/forge|neoforge/);

    const opts = {
        authorization: activeAcc.type === 'ms' ? activeAcc.data :
                      activeAcc.type === 'elyby' ? { access_token: activeAcc.data.access_token, client_token: activeAcc.data.client_token || 'minecore-launcher', uuid: activeAcc.data.uuid, name: activeAcc.data.name, user_properties: '{}', meta: { type: 'legacy' } } :
                      Authenticator.getAuth(activeAcc.name),
        root: originalPath,
        version: { number: baseVer, type: isForgeLoader ? 'release' : 'release', custom: customLoader },
        memory: { max: maxRamInput ? maxRamInput.value : '4G', min: minRamInput ? minRamInput.value : '2G' },
        overrides: {
            gameDirectory: gameDir,
            jvm: [
                '-Djava.awt.headless=false',
                '-Dfml.ignoreInvalidMinecraftCertificates=true',
                '-Dfml.ignorePatchDiscrepancies=true',
                '--add-opens', 'java.base/java.lang.invoke=ALL-UNNAMED',
                '--add-opens', 'java.base/java.lang=ALL-UNNAMED',
                '--add-opens', 'java.base/java.util=ALL-UNNAMED',
                '--add-opens', 'java.base/java.net=ALL-UNNAMED',
                '--add-opens', 'java.base/sun.security.util=ALL-UNNAMED',
                '--add-exports', 'java.base/sun.security.util=ALL-UNNAMED',
                ...elybyJvmArgs
            ]
        },
        javaPath: finalJavaPath,
        customArgs: elybyJvmArgs
    };

    if(statusText) statusText.innerText = t('status_launching'); let gameStarted = false;
    window._lastGameDir = gameDir;
    window._sessionStartTime = Date.now();
    snapshotCrashReports(gameDir);
    appendConsole(`Oyun başlatılıyor: ${baseVer} (loader: ${customLoader || 'vanilla'})`, 'info');
    launcher.removeAllListeners();
    launcher.launch(opts);
    launcher.on('download-status', (e) => { if(statusText) statusText.innerText = `${t('status_dl_progress')}: ${e.type} - %${Math.round((e.current / e.total) * 100)}`; });
    launcher.on('data', (line) => {
        appendConsole(typeof line === 'string' ? line : String(line), 'info');
        if (!gameStarted) {
            gameStarted = true;
            if(statusText) statusText.innerText = t('status_opened');
            startPlaytimeTracking(selectedVersionValue.startsWith('PACK:') ? selectedVersionValue.replace('PACK:','') : selectedVersionValue);
            setTimeout(() => ipcRenderer.send('hide-window'), 1000);
        }
    });
    launcher.on('error', (e) => {
        appendConsole(`HATA: ${e}`, 'error');
        if(statusText) statusText.innerText = t('status_error') + e;
        if(playButton) playButton.disabled = false; window._gameRunning = false;
        ipcRenderer.send('show-window');
    });
    launcher.on('close', () => {
        stopPlaytimeTracking();
        if(statusText) statusText.innerText = t('status_ready');
        if(playButton) playButton.disabled = false; window._gameRunning = false;
        { const _co = document.getElementById('console-overlay'); if (_co) _co.style.display = 'none'; }
        ipcRenderer.send('show-window');
        loadPacks();
        if (selectedVersionValue) {
            const ptKey = selectedVersionValue.startsWith('PACK:') ? selectedVersionValue.replace('PACK:','') : selectedVersionValue;
            const ptEl = document.getElementById('version-playtime');
            const pt = getPlaytime(ptKey);
            if (ptEl) {
                if (pt) { ptEl.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#00e676" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg><span>${t('playtime_label')}:</span><span style="color:#e6edf3;font-weight:700;">${pt}</span>`; ptEl.style.display = 'flex'; }
                else ptEl.style.display = 'none';
            }
        }
        
        setTimeout(() => checkCrashReports(window._lastGameDir || originalPath), 1500);
    });
});

loadAllVersions(); fetchMods();
document.getElementById('btn-show-installed')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-show-installed');
    if (btn) btn.dataset.active = 'true';
    if (activePack === 'Varsayılan') {
        if(modResultsGrid) modResultsGrid.innerHTML = `<p style="color: #ff4757; padding: 10px;">${t('select_pack_first')}</p>`;
        return;
    }

    let targetFolder = currentModrinthType === 'resourcepack' ? 'resourcepacks' : 'mods';
    const targetDir = path.join(packsDir, activePack, targetFolder);

    if(modResultsGrid) modResultsGrid.innerHTML = `<p style="color:#aaa;padding:10px;">${t('loading')}</p>`;
    if(pageIndicator) pageIndicator.innerText = '-';

    if (!fs.existsSync(targetDir)) {
        modResultsGrid.innerHTML = `<p style="color:#aaa;padding:10px;">${t('installed_empty')}</p>`;
        return;
    }

    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.jar') || f.endsWith('.zip'));
    if (files.length === 0) {
        modResultsGrid.innerHTML = `<p style="color:#aaa;padding:10px;">${t('installed_empty')}</p>`;
        return;
    }

    modResultsGrid.innerHTML = '';
    const installedMods = getInstalledMods();
    const config = getPackConfig(activePack);

    for (const file of files) {
        const card = document.createElement('div');
        card.className = 'mod-card';
        const safeFile = file.replace(/'/g, "\\'");
        const safeDirEsc = targetDir.replace(/\\/g, '\\\\');

        const projId = Object.keys(installedMods).find(k => installedMods[k] === file && !k.startsWith('local__'));

        if (projId) {
            card.innerHTML = `
                <div class="mod-header">
                    <div class="mod-icon" style="display:flex;justify-content:center;align-items:center;font-size:18px;background:rgba(255,255,255,0.05);">⏳</div>
                    <div style="overflow:hidden;">
                        <div class="mod-title" style="font-size:13px;">${file}</div>
                        <div class="mod-author" style="color:#555;">${t('loading')}</div>
                    </div>
                </div>
                <div class="mod-desc" style="color:#555;">—</div>
                <button class="ms-btn logout-btn" onclick="deletePhysicalFile('${safeDirEsc}','${safeFile}')">${t('btn_delete_file')}</button>`;
            modResultsGrid.appendChild(card);

            (async () => {
                try {
                    const [project, allVersions] = await Promise.all([
                        fetch(`https://api.modrinth.com/v2/project/${projId}`).then(r => r.json()),
                        fetch(`https://api.modrinth.com/v2/project/${projId}/version?limit=100`).then(r => r.json())
                    ]);

                    let candidates = allVersions.filter(v =>
                        v.game_versions.includes(config.version) &&
                        (config.loader === 'vanilla' || v.loaders.includes(config.loader) || (config.loader === 'neoforge' && v.loaders.includes('forge')) || (config.loader === 'forge' && v.loaders.includes('neoforge')))
                    );
                    if (candidates.length === 0) candidates = allVersions.filter(v => v.game_versions.includes(config.version));
                    if (candidates.length === 0 && config.loader !== 'vanilla') candidates = allVersions.filter(v => v.loaders.includes(config.loader));

                    const latest = candidates[0];
                    const latestFile = latest?.files?.find(f => f.primary) || latest?.files?.[0];
                    const isUpToDate = latestFile?.filename === file;
                    const latestName = latest?.name || '—';

                    card.innerHTML = `
                        <div class="mod-header" style="cursor:pointer;" onclick="window.openModDetail('${projId}','${(project.title||file).replace(/'/g,"\\'")}')">
                            <img src="${project.icon_url||''}" class="mod-icon" onerror="this.src='https://via.placeholder.com/48';this.onerror=null;">
                            <div style="overflow:hidden;flex:1;">
                                <div class="mod-title" style="font-size:13px;">${project.title || file}</div>
                                <div class="mod-author">${(project.author || '')}</div>
                            </div>
                            ${isUpToDate
                                ? `<span style="font-size:10px;background:rgba(0,230,118,0.1);color:#00e676;border:1px solid rgba(0,230,118,0.25);padding:2px 7px;border-radius:4px;white-space:nowrap;">✓ Güncel</span>`
                                : `<span style="font-size:10px;background:rgba(255,179,0,0.1);color:#ffb300;border:1px solid rgba(255,179,0,0.25);padding:2px 7px;border-radius:4px;white-space:nowrap;">↑ Güncelle</span>`}
                        </div>
                        <div class="mod-desc" style="font-size:11px;color:#666;">
                            ${t('installed_version')}: <span style="color:#aaa;">${file}</span><br>
                            ${t('installed_latest')}: <span style="color:${isUpToDate ? '#00e676' : '#ffb300'};">${latestName}</span>
                        </div>
                        <div style="display:flex;gap:8px;">
                            ${!isUpToDate && latestFile ? `<button class="ms-btn vyra-btn" style="flex:1;font-size:11px;" onclick="(async()=>{
                                const oldP=path.join('${safeDirEsc}','${safeFile}');
                                if(fs.existsSync(oldP))fs.unlinkSync(oldP);
                                fs.writeFileSync(path.join('${safeDirEsc}','${latestFile.filename.replace(/'/g,"\\'")}'),Buffer.from(await(await fetch('${latestFile.url}')).arrayBuffer()));
                                saveInstalledMod('${projId}','${latestFile.filename.replace(/'/g,"\\'")}');
                                showToast('Güncellendi!','success');
                                document.getElementById('btn-show-installed').click();
                            })()">${t('btn_update')}</button>` : ''}
                            <button class="ms-btn logout-btn" style="flex:1;font-size:11px;" onclick="deletePhysicalFile('${safeDirEsc}','${safeFile}')">${t('btn_delete_file')}</button>
                        </div>`;
                } catch(e) {
                    card.innerHTML = `
                        <div class="mod-header">
                            <div class="mod-icon" style="display:flex;justify-content:center;align-items:center;font-size:18px;background:rgba(255,255,255,0.05);">📦</div>
                            <div style="overflow:hidden;"><div class="mod-title" style="font-size:13px;">${file}</div></div>
                        </div>
                        <button class="ms-btn logout-btn" onclick="deletePhysicalFile('${safeDirEsc}','${safeFile}')">${t('btn_delete_file')}</button>`;
                }
            })();
        } else {
            card.innerHTML = `
                <div class="mod-header">
                    <div class="mod-icon" style="display:flex;justify-content:center;align-items:center;font-size:24px;background:rgba(255,255,255,0.05);">📦</div>
                    <div style="overflow:hidden;">
                        <div class="mod-title" style="white-space:normal;word-break:break-all;font-size:13px;">${file}</div>
                        <div class="mod-author">${t('installed_local_file')}</div>
                    </div>
                </div>
                <div class="mod-desc">${t('installed_file_desc')}</div>
                <button class="ms-btn logout-btn" onclick="deletePhysicalFile('${safeDirEsc}','${safeFile}')">${t('btn_delete_file')}</button>`;
            modResultsGrid.appendChild(card);
        }
    }
});

window.deletePhysicalFile = function(dir, file) {
     try {
         fs.unlinkSync(path.join(dir, file));
         
         let mods = getInstalledMods();
         let projId = Object.keys(mods).find(k => mods[k] === file);
         if(projId) {
             delete mods[projId];
             fs.writeFileSync(path.join(packsDir, activePack, 'minecore_mods.json'), JSON.stringify(mods));
         }
         
         document.getElementById('btn-show-installed').click(); 
     } catch(e) {
         alert("Silinirken bir hata oluştu: " + e.message);
     }
};
const windowedFullscreenCheckbox = document.getElementById('set-windowed-fullscreen');
const isWindowedFullscreenEnabled = localStorage.getItem('minecore_windowed_fullscreen') === 'true';

if (windowedFullscreenCheckbox) {
    windowedFullscreenCheckbox.checked = isWindowedFullscreenEnabled;

    windowedFullscreenCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('minecore_windowed_fullscreen', e.target.checked);
        ipcRenderer.send('toggle-windowed-fullscreen', e.target.checked);
        showToast(e.target.checked ? 'Pencereli tam ekran açıldı.' : 'Pencereli tam ekran kapatıldı.', 'info', 2000);
    });
}