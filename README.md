# SMART FOOD SAFETY LAMPUNG — PLATFORM PENGAWASAN KEAMANAN PANGAN PASAR TRADISIONAL

> **Sistem Terintegrasi Balai Besar Pengawas Obat dan Makanan (BBPOM) di Bandar Lampung & Dinas Ketahanan Pangan Provinsi Lampung**  
> **Versi:** 2.0 (Refined Regional Master)  
> **Tahun:** 2026

---

## 📌 Identitas Wajib Aplikasi

### 1. Header Visual & Atribut Logo
* **Pojok Kiri Header:** Logo Resmi Pemerintah Provinsi Lampung / Kota Bandar Lampung (`public/LOGO_KOTA_BANDAR_LAMPUNG_BARU.png`).
* **Pojok Kanan Header:** Logo Resmi Universitas Teknokrat Indonesia (`public/UNIVERSITASTEKNOKRAT.png`).
* **Tengah / Identity Banner:** Judul Sistem & Badge *"Smart Food Safety Lampung — Terintegrasi BBPOM & Dinas Ketahanan Pangan"*.

### 2. Atribut Hak Cipta Footer (MANDATORY & PERMANENT)
Teks hak cipta berikut terpasang secara permanen di seluruh antarmuka web portal, aplikasi mobile inspector, modal pop-up, stiker QR code, dan dokumen cetak resmi PDF:

```
Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibangun dengan arsitektur **Zero-Dependency Native Stack** yang dapat dijalankan secara instan di sistem operasi Windows tanpa perlu instalasi Node.js atau dependensi runtime berat:

### Cara 1: Menggunakan File Batch (1-Klik Otomatis)
1. Buka folder `D:\UTS_Andri\`.
2. Klik ganda file **`JALANKAN_LOCALHOST.bat`**.
3. Server lokal PowerShell berbasis `System.Net.HttpListener` akan otomatis aktif pada port `8080` dan membuka browser sistem di alamat:
   ```
   http://localhost:8080/
   ```

### Cara 2: Menjalankan Server via PowerShell
Buka terminal PowerShell di folder proyek dan jalankan:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

### Cara 3: Buka Langsung di Web Browser
Anda juga dapat langsung membuka file **`index.html`** menggunakan Google Chrome, Microsoft Edge, atau Mozilla Firefox.

---

## 🌟 5 Antarmuka Utama & Matriks Hak Akses (RBAC)

Aplikasi dilengkapi dengan **Role Switcher** interaktif di bagian navigasi atas:

### 1. 📱 Mobile Inspector (Petugas Pengawas Pangan — Offline-First)
* **Form Sidak Rapid Test (5 Parameter Wajib):**
  1. **Formalin (Formaldehida):** Pilihan Negatif / Positif + input kadar ppm (Ambang batas 0 ppm).
  2. **Boraks / Asam Borat (Bleng):** Pilihan Negatif / Positif + input kadar ppm (Ambang batas 0 ppm).
  3. **Rhodamin B:** Pewarna merah tekstil sintetis karsinogenik (Negatif / Positif).
  4. **Metanil Yellow:** Pewarna kuning tekstil sintetis (Negatif / Positif).
  5. **Residu Pestisida & Nitrit:** Analisis ppm dengan batas maksimum residu (BMR) < 0.20 ppm.
* **Live Camera Capture & GPS Geofencing (Anti-Manipulasi):**
  * Akses kamera langsung (*live video stream*) via WebRTC `navigator.mediaDevices`.
  * Watermark otomatis berstempel waktu permanen di atas canvas foto:
    * *Nama Pasar & Nomor Lapak*
    * *Koordinat GPS Akurat (Lat/Long & akurasi meter)*
    * *Timestamp Real-Time WIB*
    * *Nama Petugas Pengawas & Kode Tanda Tangan Kriptografi*
* **Offline-First Sync Engine:**
  * Penyimpanan data sidak ke cache lokal saat petugas berada di dalam pasar tanpa sinyal seluler.
  * Indikator status jaringan (**ONLINE / OFFLINE**) yang dapat diuji dengan 1-klik tombol simulasi.
  * Antrean sidak (*offline queue*) otomatis tersinkronisasi ke server cloud BBPOM saat internet kembali terhubung.
* **Viewport Switcher:**
  * Tombol pengalih antara bingkai realistis *iPhone 16 Mockup Frame* dan tampilan responsif layar penuh.

---

### 2. 🤖 AI Freshness & Anomaly Engine (Sesuai Spesifikasi `skill.md`)
* **Telemetri IoT Lingkungan & Ambang Batas:**
  * Suhu Cold Chain Storage (°C)
  * Kelembaban Relatif (% RH)
  * Konsentrasi Gas Dekomposisi / Volatile Organic Compounds (VOC) ppm
  * Durasi Waktu Pajang di Lapak (Jam)
* **Analisis Multi-Faktor:**
  * **Pelanggaran Rantai Dingin (*Temperature Excursion*):** Mendeteksi kenaikan suhu penyimpanan daging/ikan di atas 4°C.
  * **Deteksi Gas & Pembusukan:** Mengidentifikasi lonjakan etilen dan amina volatil (> 1.2 ppm).
  * **Computer Vision Freshness:** Evaluasi diskolorasi, mata ikan keruh, lendir bakteri, dan spora jamur daun.
* **Penanganan Kasus Khusus (Edge Cases):**
  * *Low-Lighting Conditions (< 30% clarity):* AI beralih ke mode `LOW_CONFIDENCE` dan mengutamakan data sensor lingkungan.
  * *Sensor Drift / Faults (> 50°C):* Menerbitkan peringatan anomali probe sensor IoT tanpa salah mendiagnosis makanan busuk.
  * *Latency SLA:* Eksekusi komputasi selesai dalam **< 800ms**.
* **Output Schema Sesuai PRD Section 3.2:**
  * `freshness_score` (Skor 0.0 - 100.0)
  * `risk_level` (`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`)
  * `estimated_remaining_shelf_life_hours` (Model Kinetik Arrhenius)
  * `detected_anomalies` (Array jenis anomali, deskripsi, dan tingkat keyakinan)
  * `recommended_actions` (Panduan tindakan korektif langsung untuk pengawas dan pedagang)

---

### 3. 🚨 CITO Red Alert System (< 10 Detik WhatsApp & Sirine Darurat)
* **Pemicu Otomatis:**
  * Bila salah satu dari 5 zat berbahaya dinyatakan `POSITIF` (atau residu pestisida > 0.2 ppm), sistem langsung memicu status CITO Tingkat 1.
* **Fitur CITO Alert:**
  * **Sirine Audio Darurat:** Sintesis suara frekuensi sirine realistis via Web Audio API.
  * **Modal Peringatan Darurat Merah:** Menampilkan ringkasan pasar, pedagang, koordinat GPS, dan zat racun yang ditemukan.
  * **SLA Countdown Timer (< 10 Detik):** Penghitung mundur batas waktu 10 detik pengiriman peringatan dini.
  * **WhatsApp Blast Dispatcher:** Membuka tautan resmi WhatsApp Blast (`wa.me`) dengan format pesan darurat terstruktur ke ponsel pimpinan BBPOM, Kepala Dinas Ketahanan Pangan, dan UPTD Pasar.
  * **Isolasi Rantai Pasok:** Pembekuan izin lapak digital dan penelusuran gudang distributor pemasok barang.

---

### 4. 🌐 Web Portal Publik & Peta Interaktif Pasar se-Lampung
* **Peta Interaktif Pasar Tradisional (Leaflet.js):**
  * Memetakan pasar-pasar utama di Provinsi Lampung:
    * *Pasar Pasir Gintung (Kota Bandar Lampung) — Hijau (97.6%)*
    * *Pasar Bambu Kuning (Kota Bandar Lampung) — Hijau (93.8%)*
    * *Pasar Panjang (Kota Bandar Lampung) — Merah (CITO Formalin)*
    * *Pasar Tugu (Kota Bandar Lampung) — Kuning (Waspada Pestisida)*
    * *Pasar Smep (Kota Bandar Lampung) — Hijau (93.1%)*
    * *Pasar Kangkung (Kota Bandar Lampung) — Kuning (Waspada Tahu)*
    * *Pasar Koga (Kota Bandar Lampung) — Hijau (96.1%)*
    * *Pasar Natar (Kabupaten Lampung Selatan) — Kuning (87.6%)*
    * *Pasar Kopindo Metro (Kota Metro) — Hijau (97.7%)*
    * *Pasar Bandar Jaya Plaza (Kabupaten Lampung Tengah) — Hijau (91.9%)*
  * Filter status zona (*Semua, Hijau, Kuning, Merah*).
  * Klik pin marker menampilkan skor kepatuhan, persentase lapak aman, dan daftar pedagang terverifikasi.
* **Layanan Aduan Pangan Warga (Citizen Complaint):**
  * Form aduan masyarakat: Nama, No. HP, Pasar, Blok Lapak, Komoditas yang Dicurigai, Deskripsi Temuan, dan Foto Bukti.
  * Feed transparansi aduan publik dengan pelacakan status penanganan (*Sedang Diinvestigasi, Terjadwal Sidak, Selesai*).

---

### 5. 🏷️ Dynamic QR Code & Verifikasi Lapak Pedagang
* **Generator QR Code Dinamis:**
  * Diterbitkan otomatis untuk pedagang yang lolos uji sidak.
  * Menghasilkan stiker cetak lapak beresolusi tinggi lengkap dengan badge *"Lapak Bebas Bahan Berbahaya"*, logo Pemda Lampung, logo Teknokrat, nomor lapak, dan token digital.
* **Pemindai QR Publik:**
  * Konsumen dapat memindai kode QR lapak tanpa aplikasi khusus.
  * Menampilkan skor keamanan pangan (misal: 98.5/100), tanggal sidak terakhir, nama pengawas ber-NIP, hasil detail 5 parameter lab, dan sertifikasi distributor asal daging/ikan/tahu.

---

### 6. 📊 Executive Dashboard Dinas Ketahanan Pangan & BBPOM
* **5 Indikator Kinerja Utama (KPIs):**
  * Total Pasar Terdaftar (12 Pasar se-Lampung)
  * Total Sampel Sidak Bulan Ini (412 Sampel)
  * Rasio Bebas Bahan Berbahaya (94.8% Aman)
  * Total Lapak Terpasang QR Aman (388 Lapak)
  * Temuan Kasus Positif Aktif (1 Kasus di Pasar Panjang)
* **Grafik Analitik Interaktif (Chart.js):**
  1. *Grafik Batang Komoditas Paling Rawan Racun Kimia* (Ikan Asin, Tahu, Daging, Mie Basah, Kerupuk, Sayur).
  2. *Grafik Donat Kepatuhan Pasar per Kabupaten/Kota se-Lampung* (Bandar Lampung, Metro, Lamsel, Lamteng).
  3. *Grafik Garis Tren Sidak Mingguan* (Sampel Aman vs Temuan Positif CITO).
* **Audit Trail Terenkripsi:**
  * Tabel riwayat aktivitas sistem (*immutable & non-deletable*) mematuhi UU No. 27 Tahun 2022 (UU PDP) dan UU No. 18 Tahun 2012 (UU Pangan) berstempel hash SHA-256.
* **Cetak Berita Acara & Laporan Resmi (PDF):**
  * Kop resmi Pemerintah Provinsi Lampung & Balai Besar POM di Bandar Lampung.
  * Rekapitulasi tabel hasil inspeksi, tanda tangan digital BSrE Kepala Dinas & Kepala BBPOM, dan teks copyright permanen.

---

## 🧪 Skenario Pengujian Cepat (Quick Test)

Gunakan tombol **"⚡ Preset Pengujian"** pada bilah navigasi atas:

1. **Kasus Lapak Bersih & Terverifikasi:**
   * Klik `[Lapak Daging Pasir Gintung]` -> Buka status scan lapak H. Syamsul Arifin dengan skor 98.5/100 dan status *Lolos Bebas Racun*.
2. **Kasus CITO Red Alert (Temuan Formalin):**
   * Klik `[Lapak Teri Pasar Panjang (CITO)]` -> Buka status lapak yang dibekukan karena temuan Formalin 28.4 ppm.
   * Atau pada form Mobile Inspector, pilih opsi `Formalin: POSITIF (28.4 ppm)` lalu klik simpan untuk menguji pemicuan otomatis CITO Sirine dan WhatsApp Dispatcher.
3. **Cetak Dokumen Laporan Resmi:**
   * Klik `[Cetak Laporan Resmi Sidak (PDF)]` untuk membuka pratinjau cetak berita acara resmi.

---

## 🏛️ Struktur Berkas Proyek

```
D:\UTS_Andri\
├── public\
│   ├── LOGO_KOTA_BANDAR_LAMPUNG_BARU.png   # Logo Resmi Pemda Lampung / Bandar Lampung
│   └── UNIVERSITASTEKNOKRAT.png            # Logo Resmi Universitas Teknokrat Indonesia
├── src\
│   ├── data.js                             # Master Entity Store (Pasar Lampung, Lapak, Pemasok, Sidak, Audit Log)
│   ├── ai-skill.js                         # AI Freshness & Anomaly Engine (Arrhenius + CV Model Sesuai skill.md)
│   └── app.js                              # Master App Controller (Offline Sync, Camera, Leaflet, CITO Siren, QR)
├── index.html                              # Antarmuka Utama Web & Mobile PWA Responsive
├── server.ps1                              # Native PowerShell HTTP Server (Zero Dependency)
├── JALANKAN_LOCALHOST.bat                  # 1-Klik Launcher Server Localhost
├── prd.md                                  # Product Requirement Document (PRD Master)
├── skill.md                                # Spesifikasi Teknis AI Skill
└── README.md                               # Panduan Lengkap Sistem
```

---

## ⚖️ Hak Cipta & Pengesahan

> **Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom**  
> *Sistem Pengawasan Keamanan Pangan Pasar Tradisional Terpadu Provinsi Lampung*

