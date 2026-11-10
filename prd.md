# PRODUCT REQUIREMENT DOCUMENT (PRD)

# PLATFORM PENGAWASAN KEAMANAN PANGAN PASAR TRADISIONAL PROVINSI LAMPUNG (SMART FOOD SAFETY LAMPUNG)

**Nama Produk:** Smart Food Safety Lampung — Platform Inspeksi & Digitalisasi Keamanan Pangan Pasar Tradisional  
**Kategori:** Government Tech / Public Health & Agriculture Oversight  
**Jenis Produk:** Mobile App (Petugas Pengawas & Pedagang Pasar), Web Portal (Dinas Ketahanan Pangan & Admin), Public Web Dashboard (Masyarakat)  
**Wilayah Implementasi:** Provinsi Lampung / Kota Bandar Lampung (Pasar Pasir Gintung, Bambu Kuning, Panjang, Tugu, Smep, dll.)  
**Target Pengguna:** Petugas Pengawas Pangan, Pengelola Pasar (UPTD/PD Pasar), Pedagang Pasar Tradisional, Masyarakat Umum, Dinas Ketahanan Pangan & Kesehatan  
**Status Dokumen:** Master Product Requirement Document  
**Versi:** 2.0 (Refined Regional Master)  
**Tanggal:** 11 November 2026  

---

## 1. BRANDING, ATRIBUT, & IDENTITAS VISUAL APLIKASI

### 1.1 Header Visual & Logo
 Seluruh antarmuka aplikasi (Mobile App, Web Portal Admin/Pengawas, Layar Kiosk, maupun Dashboard Publik) **WAJIB** menerapkan tata letak header sebagai berikut:
* **Pojok Kiri Header:** Logo Resmi Pemerintah Provinsi Lampung / Kota Bandar Lampung.
* **Pojok Kanan Header:** Logo Resmi Universitas Teknokrat Indonesia.
* **Tengah / Identity Banner:** Judul Sistem & Badge *"Smart Food Safety Lampung — Terintegrasi BBPOM & Dinas Ketahanan Pangan"*

### 1.2 Footer Requirements (MANDATORY & PERMANENT)
Setiap halaman web portal, antarmuka aplikasi mobile, laporan cetak PDF/Excel, dan layar publik **WAJIB** menampilkan teks hak cipta permanen pada bagian *footer* paling bawah:

> **Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom**

---

## 2. PENDAHULUAN & LATAR BELAKANG

### 2.1 Problem Statement
1. **Pencatatan Sidak Masih Manual & Lambat:** Pengujian kandungan bahan berbahaya (Formalin, Boraks, Rhodamin B, Metanil Yellow, dan Residu Pestisida) di pasar tradisional kerap dicatat pada formulir kertas, berisiko hilang, dan memakan waktu berhari-hari untuk direkap.
2. **Keterlambatan Penelusuran Sumber Bahan Berbahaya:** Ketika ditemukan bahan pokok mengandung racun/zat berbahaya, petugas kesulitan melacak rantai pasok distributor/pemasok asal barang secara cepat.
3. **Ketidaktransparanan Informasi Pangan bagi Publik:** Masyarakat di Provinsi Lampung tidak memiliki akses informasi harian mengenai status keamanan komoditas dan lapak pasar tradisional tempat mereka berbelanja.

### 2.2 Tujuan Utama & Visi Produk
* **Visi:** Mewujudkan ekosistem pasar tradisional di Provinsi Lampung yang bersih, sehat, dan bebas bahan berbahaya melalui inspeksi digital terpadu dan keterlacakan (*traceability*) berbasis data.
* **Tujuan Utama:** Memangkas waktu pencatatan & publisitas hasil sidak lapangan menjadi *real-time* (< 3 menit), menerbitkan QR Code sertifikasi digital *"Lapak Aman Pangan"*, serta memberikan sistem peringatan dini (CITO Red Alert) bagi Dinas terkait saat ditemukan racun/kimia berbahaya.

### 2.3 Target KPIs (Key Performance Indicators)
* **Kecepatan Input Sidak:** Proses rekapitulasi sidak & pendaftaran sampel di lapangan $< 3$ menit per sampel.
* **Cakupan Pasar:** $100\%$ pasar tradisional utama di Kota Bandar Lampung dan kabupaten/kota se-Lampung terdaftar secara digital.
* **Respons CITO Alert:** Notifikasi darurat temuan bahan berbahaya terkirim ke Dinas Ketahanan Pangan & BBPOM dalam waktu $< 10$ detik.
* **Partisipasi Pedagang:** $> 85\%$ lapak bahan pokok terpasang label QR Code *"Status Keamanan Pangan"*.

---

## 3. TARGET PENGGUNA & MATRIKS HAK AKSES (RBAC)

### 3.1 Personas
1. **Petugas Pengawas Pangan (Inspector):** Mengambil sampel, menguji dengan *Rapid Test Kit*, menginput data hasil tes, mengunggah foto bukti ber-GPS, dan memverifikasi lapak.
2. **Masyarakat / Konsumen Pasar:** Memindai QR Code di lapak pedagang, melihat peta keamanan pasar, serta mengirimkan laporan/aduan dugaan pangan berbahaya.
3. **Pedagang Pasar:** Menampilkan QR Code status lapak, menerima sertifikat digital "Lapak Aman", dan memperbarui data distributor/pemasok.
4. **Pengelola Pasar (UPTD / PD Pasar):** Memantau peta zona keamanan di dalam area pasar dan mendampingi pelaksanaan sidak.
5. **Dinas Ketahanan Pangan & BBPOM (Admin / Validator):** Memvalidasi laporan temuan racun (CITO Alert), menerbitkan sanksi administratif, dan memantau dashboard analitik se-Provinsi Lampung.

### 3.2 Matriks Hak Akses (Role-Based Access Control)

| Modul / Fitur | Masyarakat Publik | Pedagang Pasar | Petugas Pengawas | Pengelola Pasar | Dinas & Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Portal Peta Keamanan Pasar | **R** | **R** | **R** | **R** | **R** |
| Scan QR Status Lapak Pedagang | **R** | **R** | **R** | **R** | **R** |
| Input Form Inspeksi & Rapid Test | - | - | **W/R** | - | - |
| Live Photo Capture & Geo-Tagging | - | - | **W/R** | - | - |
| Verifikasi CITO Alert & Sanksi | - | - | **W (Draft)** | **R** | **W/R (Approve)** |
| Kelola Profil Lapak & Pemasok | - | **W/R** | **R** | **R** | **R** |
| Form Aduan Pangan Masyakarat | **W** | - | **R** | **R** | **W/R** |
| Executive Dashboard & Audit Log | - | - | - | **R (Lokal)** | **W/R (System)** |

*Keterangan: W (Write/Edit), R (Read Only), - (No Access).*

---

## 4. CAKUPAN FITUR FUNGSIONAL (FUNCTIONAL REQUIREMENTS)

### 4.1 Modul Inspeksi & Digital Rapid Test (Mobile Inspector)
* **FR-01 Form Sidak Digital Interaktif:** Input data lokasi pasar (Pilihan pasar se-Lampung), nomor lapak, nama pedagang, dan jenis komoditas (Daging, Ikan, Sayur, Olahan, Bumbu, dll.).
* **FR-02 Rapid Test Result Checklist:** Logger parameter uji kimia kualitatif & kuantitatif:
  * Formalin (Positif / Negatif)
  * Boraks (Positif / Negatif)
  * Rhodamin B (Positif / Negatif)
  * Metanil Yellow (Positif / Negatif)
  * Residu Pestisida & Nitrit (Kualitatif / ppm)
* **FR-03 Live Photo & Geofencing Tagging:** Pengambilan foto sampel/lapak wajib menggunakan kamera langsung (*live capture*) dengan penguncian titik koordinat GPS dan *watermark timestamp*.
* **FR-04 Offline-First Sync Engine:** Data sidak tersimpan di *local database* HP saat tidak ada sinyal di dalam pasar dan otomatis tersinkronisasi ketika terhubung internet.

### 4.2 Modul Sertifikasi & QR Code Lapak Pedagang
* **FR-05 Dynamic QR Code Generator:** Pembuatan QR Code unik bagi pedagang yang lolos uji sidak sebagai penanda *"Lapak Bebas Bahan Berbahaya"*.
* **FR-06 Public Scan Status:** Masyarakat dapat memindai QR Code lapak menggunakan kamera smartphone tanpa aplikasi khusus untuk melihat skor keamanan, tanggal sidak terakhir, dan komoditas terdaftar.

### 4.3 Modul Tracking Rantai Pasok & CITO Red Alert
* **FR-07 Red Flag CITO Alert System:** Jika ditemukan sampel `POSITIF` bahan berbahaya, sistem secara otomatis mengirimkan pesan Push Alert & WhatsApp Blast ke Dinas Ketahanan Pangan, BBPOM, dan Pengelola Pasar dalam $<10$ detik.
* **FR-08 Traceability Pemasok:** Pendataan asal distributor/pemasok bahan pokok guna mengisolasi dan menghentikan peredaran barang berbahaya dari sumbernya.

### 4.4 Portal Publik & Dashboard Transparansi
* **FR-09 Web Portal Publik Keamanan Pangan:** Halaman terbuka untuk masyarakat yang menyajikan:
  * Peta Interaktif Pasar se-Lampung (Zona Hijau = Aman, Kuning = Waspada, Merah = Temuan Bahan Berbahaya).
  * Laporan Rekapitulasi Sidak Berkala.
  * Daftar Lapak Terverifikasi Aman.
* **FR-10 Layanan Aduan Pangan Warga:** Form pelaporan masyarakat jika menemukan bahan makanan mencurigakan, disertai unggah foto dan titik lokasi pasar.

### 4.5 Executive Dashboard & Reporting
* **FR-11 Analitik Dinas Ketahanan Pangan:** Visualisasi grafik tren komoditas paling rawan racun, skor kepatuhan pasar per kabupaten/kota, dan histori penindakan.
* **FR-12 Export Laporan Resmi:** Generasi otomatis laporan sidak ke format PDF/Excel resmi lengkap dengan kop surat Dinas dan watermark keamanan.

---

## 5. ATURAN BISNIS & BATASAN SISTEM (BUSINESS RULES & LIMITATIONS)

### 5.1 Business Rules Utama
1. **Anti-Manipulasi Foto:** Foto sampel wajib diambil secara *live capture* dari kamera aplikasi; sistem menolak foto yang diunggah dari galeri HP.
2. **Kunci Perubahan Data Temuan:** Data uji `POSITIF` bahan berbahaya tidak dapat diubah atau dihapus oleh pengawas lapangan. Perubahan status hanya dapat dilakukan oleh Kepala Dinas / Validator BBPOM melalui *Approval Workflow* ber-audit log.
3. **Pencabutan Izin Lapak Digital:** Lapak yang terbukti `POSITIF` bahan berbahaya sebanyak $3\times$ berturut-turut otomatis berstatus `Status Dicabut / Dilarang Beroperasi` pada portal publik hingga dilakukan pembinaan ulang.
4. **Prinsip Transparansi Publik:** Seluruh hasil pengujian bersifat terbuka bagi publik untuk perlindungan konsumen, kecuali data pribadi sensitif pedagang yang berada dalam proses hukum.

### 5.2 Batasan Sistem (System Scope Limitations)
1. **Pengujian Kualitatif Lapangan:** Rapid test kit bersifat kualitatif awal. Untuk keperluan pembuktian yuridis di pengadilan, sampel wajib diteruskan ke laboratorium uji definitif BBPOM.
2. **Sanksi Yustisi:** Penindakan fisik (penyitaan/penutupan lapak) tetap menjadi kewenangan Satpol PP & PPNS.

---

## 6. KEBUTUHAN NON-FUNGSIONAL & KEAMANAN

### 6.1 Performa & Skalabilitas
* **Waktu Muat Portal:** Halaman publik dimuat dalam $< 2$ detik pada jaringan 4G.
* **Ketersediaan Sistem:** Minimum $99.5\%$ *uptime* per bulan.
* **Kapasitas Offline:** Aplikasi mobile pengawas mampu menyimpan hingga 200 data sidak secara offline.

### 6.2 Keamanan & Privasi Data
* **Enkripsi:** Enkripsi AES-256 untuk data hasil inspeksi & data pelapor, serta TLS 1.3 untuk transmisi API.
* **Kepatuhan Hukum:** Memenuhi UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan UU No. 18 Tahun 2012 tentang Pangan.
* **Audit Log:** Log pencatatan permanen (*non-deletable*) untuk setiap aktivitas pembacaan, edit, dan approval data.

---

## 7. SKEMA DATA UTAMA (DATABASE ENTITIES OVERVIEW)

| Nama Tabel / Entitas | Atribut Utama | Fungsi Utama |
|---|---|---|
| `users` | `user_id` (PK), `nama`, `nip_nik`, `email`, `role_id`, `no_hp` | Akun pengawas, admin, & pedagang |
| `markets` | `market_id` (PK), `nama_pasar`, `kabupaten_kota`, `lat`, `long`, `kelas` | Master pasar tradisional di Lampung |
| `traders` | `trader_id` (PK), `market_id`, `nomor_lapak`, `nama_pedagang`, `jenis_komoditas` | Master data pedagang & lapak |
| `inspections` | `inspection_id` (PK), `trader_id`, `inspector_id`, `tgl_inspeksi`, `status_keseluruhan` | Transaksi kegiatan inspeksi |
| `test_results` | `result_id` (PK), `inspection_id`, `parameter_uji`, `hasil_status`, `kadar_ppm` | Hasil pengujian kimia/biologi |
| `suppliers` | `supplier_id` (PK), `nama_distributor`, `asal_daerah`, `komoditas_disuplai` | Rantai pasok pemasok bahan pokok |
| `complaints` | `complaint_id` (PK), `nama_pelapor`, `market_id`, `deskripsi_aduan`, `foto_url`, `status` | Laporan/aduan warga |
| `audit_logs` | `log_id` (PK), `user_id`, `action`, `resource_target`, `timestamp`, `ip_address` | Log jejak keamanan sistem |

---

## 8. ACCEPTANCE CRITERIA (KRITERIA PENERIMAAN PRODUK)

1. **Atribut Header & Footer:** Logo Pemda Lampung di pojok kiri header, Logo Universitas Teknokrat Indonesia di pojok kanan header, serta teks copyright `Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom` tampil permanen di footer seluruh halaman/layar.
2. **Efisiensi Input Field:** Pengawas dapat menyelesaikan input sidak 5 parameter uji beserta foto live GPS dalam waktu $< 3$ menit per sampel.
3. **Ketahanan Offline:** Data sidak offline tersimpan aman dan tersinkronisasi otomatis $100\%$ tanpa duplikasi saat terhubung kembali ke internet.
4. **Responsif CITO Alert:** Notifikasi pesan WhatsApp Alert temuan positif terkirim ke ponsel Admin dalam waktu $< 10$ detik setelah data di-submit.
5. **Aksesibilitas Scan QR:** QR Code lapak dapat dipindai oleh browser smartphone standar dan menampilkan status keamanan lapak secara transparan.

---

**Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom**