/**
 * Smart Food Safety Lampung — Master Data Store & Entities
 * Wilayah: Provinsi Lampung (Bandar Lampung, Metro, Lamsel, Lamteng, Tanggamus, dll.)
 * Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom
 */

const SFS_DATA = {
  // Master Pasar Tradisional di Lampung
  markets: [
    {
      id: "MKT-01",
      name: "Pasar Pasir Gintung",
      city: "Kota Bandar Lampung",
      district: "Tanjung Karang Pusat",
      address: "Jl. Pisang No. 12, Tanjung Karang Pusat, Bandar Lampung",
      lat: -5.4093,
      lng: 105.2536,
      classLevel: "Kelas 1 (Pasar Percontohan Aman BBPOM)",
      totalTraders: 142,
      inspectedTraders: 128,
      verifiedCleanTraders: 125,
      complianceScore: 97.6,
      status: "HIJAU", // HIJAU | KUNING | MERAH
      statusLabel: "Zona Sangat Aman (Bebas Bahan Berbahaya)",
      lastInspection: "11 Nov 2026, 06:30 WIB",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-02",
      name: "Pasar Bambu Kuning",
      city: "Kota Bandar Lampung",
      district: "Tanjung Karang Pusat",
      address: "Jl. Imam Bonjol, Tanjung Karang Pusat, Bandar Lampung",
      lat: -5.4128,
      lng: 105.2559,
      classLevel: "Kelas 1",
      totalTraders: 110,
      inspectedTraders: 98,
      verifiedCleanTraders: 92,
      complianceScore: 93.8,
      status: "HIJAU",
      statusLabel: "Zona Aman Pangan",
      lastInspection: "10 Nov 2026, 08:15 WIB",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-03",
      name: "Pasar Panjang",
      city: "Kota Bandar Lampung",
      district: "Panjang",
      address: "Jl. Yos Sudarso, Panjang Selatan, Bandar Lampung",
      lat: -5.4674,
      lng: 105.3195,
      classLevel: "Kelas 1 (Pesisir & Ikan)",
      totalTraders: 95,
      inspectedTraders: 82,
      verifiedCleanTraders: 64,
      complianceScore: 78.0,
      status: "MERAH",
      statusLabel: "Zona Merah (Ditemukan CITO Formalin pada Ikan Teri Asin)",
      lastInspection: "11 Nov 2026, 05:45 WIB",
      image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-04",
      name: "Pasar Tugu",
      city: "Kota Bandar Lampung",
      district: "Kedamaian",
      address: "Jl. Hayam Wuruk, Tanjung Karang Timur, Bandar Lampung",
      lat: -5.4121,
      lng: 105.2758,
      classLevel: "Kelas 2",
      totalTraders: 78,
      inspectedTraders: 70,
      verifiedCleanTraders: 62,
      complianceScore: 88.5,
      status: "KUNING",
      statusLabel: "Zona Waspada (Residu Pestisida Sedang pada Sayur)",
      lastInspection: "09 Nov 2026, 07:20 WIB",
      image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-05",
      name: "Pasar Smep",
      city: "Kota Bandar Lampung",
      district: "Tanjung Karang Barat",
      address: "Jl. Banten, Pasar Smep, Bandar Lampung",
      lat: -5.4110,
      lng: 105.2505,
      classLevel: "Kelas 2",
      totalTraders: 64,
      inspectedTraders: 58,
      verifiedCleanTraders: 54,
      complianceScore: 93.1,
      status: "HIJAU",
      statusLabel: "Zona Aman Pangan",
      lastInspection: "08 Nov 2026, 09:10 WIB",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-06",
      name: "Pasar Kangkung",
      city: "Kota Bandar Lampung",
      district: "Teluk Betung Selatan",
      address: "Jl. Ikan Bawal No. 3, Teluk Betung Selatan, Bandar Lampung",
      lat: -5.4412,
      lng: 105.2638,
      classLevel: "Kelas 2",
      totalTraders: 85,
      inspectedTraders: 75,
      verifiedCleanTraders: 66,
      complianceScore: 88.0,
      status: "KUNING",
      statusLabel: "Zona Waspada (Perhatian Khusus Tahu & Olahan)",
      lastInspection: "10 Nov 2026, 06:50 WIB",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-07",
      name: "Pasar Koga",
      city: "Kota Bandar Lampung",
      district: "Kedaton",
      address: "Jl. Teuku Umar, Kedaton, Bandar Lampung",
      lat: -5.3905,
      lng: 105.2612,
      classLevel: "Kelas 2",
      totalTraders: 56,
      inspectedTraders: 52,
      verifiedCleanTraders: 50,
      complianceScore: 96.1,
      status: "HIJAU",
      statusLabel: "Zona Sangat Aman",
      lastInspection: "07 Nov 2026, 08:30 WIB",
      image: "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-08",
      name: "Pasar Natar",
      city: "Kabupaten Lampung Selatan",
      district: "Natar",
      address: "Jl. Raya Lintas Sumatera KM 18, Natar, Lampung Selatan",
      lat: -5.3184,
      lng: 105.2014,
      classLevel: "Kelas 1 (Lintas Daerah)",
      totalTraders: 120,
      inspectedTraders: 105,
      verifiedCleanTraders: 92,
      complianceScore: 87.6,
      status: "KUNING",
      statusLabel: "Zona Waspada (Pengawasan Rantai Pasok Pesisir)",
      lastInspection: "09 Nov 2026, 07:00 WIB",
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-09",
      name: "Pasar Kopindo Metro",
      city: "Kota Metro",
      district: "Metro Pusat",
      address: "Jl. Agus Salim, Metro Pusat, Kota Metro",
      lat: -5.1136,
      lng: 105.3069,
      classLevel: "Kelas 1",
      totalTraders: 90,
      inspectedTraders: 88,
      verifiedCleanTraders: 86,
      complianceScore: 97.7,
      status: "HIJAU",
      statusLabel: "Zona Teladan Bersih & Aman BBPOM",
      lastInspection: "10 Nov 2026, 10:00 WIB",
      image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "MKT-10",
      name: "Pasar Bandar Jaya Plaza",
      city: "Kabupaten Lampung Tengah",
      district: "Terbanggi Besar",
      address: "Jl. Proklamator Raya, Bandar Jaya, Lampung Tengah",
      lat: -4.9542,
      lng: 105.2155,
      classLevel: "Kelas 1",
      totalTraders: 130,
      inspectedTraders: 112,
      verifiedCleanTraders: 103,
      complianceScore: 91.9,
      status: "HIJAU",
      statusLabel: "Zona Aman Terkendali",
      lastInspection: "06 Nov 2026, 09:30 WIB",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Rantai Pasok / Master Distributor Terdaftar
  suppliers: [
    {
      id: "SUP-01",
      name: "RPH Way Laga Kota Bandar Lampung",
      origin: "Jl. Soekarno Hatta KM 8, Panjang, Bandar Lampung",
      commodity: "Daging Sapi & Kerbau Segar",
      status: "TERSERTIFIKASI_HIGIENIS",
      statusLabel: "Tersertifikasi Halal & Higienis Dinas Pertanian",
      contact: "0812-7311-9921",
      lastAudit: "01 Nov 2026"
    },
    {
      id: "SUP-02",
      name: "Tempat Pelelangan Ikan (TPI) Lempasing",
      origin: "Kecamatan Teluk Pandan, Kabupaten Pesawaran",
      commodity: "Ikan Laut, Tongkol, Kembung, Cumi, Udang Segar",
      status: "TERSERTIFIKASI_HIGIENIS",
      statusLabel: "Bebas Formalin - Audit KKP & BBPOM",
      contact: "0821-8200-4411",
      lastAudit: "05 Nov 2026"
    },
    {
      id: "SUP-03",
      name: "Sentra Tahu & Tempe Murni Gunung Sulah",
      origin: "Way Halim, Kota Bandar Lampung",
      commodity: "Tahu Putih, Tahu Kuning, Tempe Kedelai",
      status: "TERSERTIFIKASI_HIGIENIS",
      statusLabel: "Kunyit Alami & Bebas Metanil Yellow",
      contact: "0853-6621-0033",
      lastAudit: "03 Nov 2026"
    },
    {
      id: "SUP-04",
      name: "Kelompok Tani Sayur Dataran Tinggi Sekincau",
      origin: "Kecamatan Sekincau, Kabupaten Lampung Barat",
      commodity: "Kubis, Wortel, Cabai Merah, Sawi Hijau, Kentang",
      status: "TERSERTIFIKASI_HIGIENIS",
      statusLabel: "Sertifikasi Prima-3 Bebas Residu Kimia Berbahaya",
      contact: "0813-7901-2244",
      lastAudit: "28 Okt 2026"
    },
    {
      id: "SUP-05",
      name: "CV Samudera Jaya (Distributor Teri Kering)",
      origin: "Gudang Lelang Teluk Betung, Bandar Lampung",
      commodity: "Ikan Asin, Teri Nasi, Cumi Kering",
      status: "BLACKLISTED",
      statusLabel: "DIBEKUKAN BBPOM — Temuan Formalin 28 ppm (Penyelidikan PPNS)",
      contact: "0819-5511-7788",
      lastAudit: "11 Nov 2026 (Disita Petugas)"
    }
  ],

  // Data Lapak Pedagang
  traders: [
    {
      id: "TRD-PG01",
      marketId: "MKT-01",
      marketName: "Pasar Pasir Gintung",
      stallNumber: "Blok A No. 01-02",
      traderName: "H. Syamsul Arifin",
      category: "raw_meat",
      categoryLabel: "Daging Sapi Segar & Tetelan",
      supplierId: "SUP-01",
      supplierName: "RPH Way Laga Kota Bandar Lampung",
      qrCodeToken: "SFS-LPG-PG01-SAFE-2026",
      status: "VERIFIED_SAFE", // VERIFIED_SAFE | UNDER_MONITORING | SUSPENDED | CITO_ALERT
      statusBadge: "Lapak Aman Pangan (Bebas Bahan Berbahaya)",
      foodSafetyScore: 98.5,
      lastInspectionDate: "11 Nov 2026, 06:40 WIB",
      inspectorName: "Andri Junaidi, S.Tr.Kes (NIP 199507142021021003)",
      testResults: {
        formalin: "NEGATIF (0 ppm)",
        boraks: "NEGATIF (0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (0 ppm)",
        residuPestisida: "AMAN (< 0.01 ppm)",
        aiFreshnessScore: 96.2,
        shelfLifeHours: 36
      },
      positiveViolationsCount: 0,
      photoUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "TRD-PG14",
      marketId: "MKT-01",
      marketName: "Pasar Pasir Gintung",
      stallNumber: "Blok Ikan No. 14-15",
      traderName: "Ibu Rohani",
      category: "seafood",
      categoryLabel: "Ikan Laut, Tongkol & Udang Segar",
      supplierId: "SUP-02",
      supplierName: "TPI Lempasing Pesawaran",
      qrCodeToken: "SFS-LPG-PG14-SAFE-2026",
      status: "VERIFIED_SAFE",
      statusBadge: "Lapak Aman Pangan (Bebas Bahan Berbahaya)",
      foodSafetyScore: 96.0,
      lastInspectionDate: "11 Nov 2026, 06:55 WIB",
      inspectorName: "Andri Junaidi, S.Tr.Kes (NIP 199507142021021003)",
      testResults: {
        formalin: "NEGATIF (0 ppm)",
        boraks: "NEGATIF (0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (0 ppm)",
        residuPestisida: "AMAN (< 0.01 ppm)",
        aiFreshnessScore: 94.0,
        shelfLifeHours: 24
      },
      positiveViolationsCount: 0,
      photoUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "TRD-PJ08",
      marketId: "MKT-03",
      marketName: "Pasar Panjang",
      stallNumber: "Blok Asin No. 08",
      traderName: "Pak Kasdi Wibowo",
      category: "seafood",
      categoryLabel: "Ikan Teri Nasi & Ikan Asin",
      supplierId: "SUP-05",
      supplierName: "CV Samudera Jaya (Distributor Teri Kering)",
      qrCodeToken: "SFS-LPG-PJ08-ALERT-2026",
      status: "CITO_ALERT", // Positif Bahan Berbahaya
      statusBadge: "DIBEKUKAN / SANKSI BBPOM (POSITIF FORMALIN)",
      foodSafetyScore: 24.0,
      lastInspectionDate: "11 Nov 2026, 06:10 WIB",
      inspectorName: "Rian Pratama, S.Si (Pengawas BBPOM Bandar Lampung)",
      testResults: {
        formalin: "POSITIF (28.4 ppm) 🚨 RACUN TINGGI",
        boraks: "POSITIF (12.0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (0 ppm)",
        residuPestisida: "AMAN",
        aiFreshnessScore: 31.0,
        shelfLifeHours: 0
      },
      positiveViolationsCount: 3, // Otomatis status dilarang beroperasi (PRD Rule 5.1.3)
      photoUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "TRD-BK22",
      marketId: "MKT-02",
      marketName: "Pasar Bambu Kuning",
      stallNumber: "Blok Olahan No. 22",
      traderName: "Mas Darmo",
      category: "processed_food",
      categoryLabel: "Tahu Putih, Tahu Kuning & Tempe",
      supplierId: "SUP-03",
      supplierName: "Sentra Tahu & Tempe Murni Gunung Sulah",
      qrCodeToken: "SFS-LPG-BK22-SAFE-2026",
      status: "VERIFIED_SAFE",
      statusBadge: "Lapak Aman Pangan (Kunyit Alami)",
      foodSafetyScore: 95.0,
      lastInspectionDate: "10 Nov 2026, 08:30 WIB",
      inspectorName: "Andri Junaidi, S.Tr.Kes (NIP 199507142021021003)",
      testResults: {
        formalin: "NEGATIF (0 ppm)",
        boraks: "NEGATIF (0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (Kunyit Alami Terverifikasi)",
        residuPestisida: "AMAN",
        aiFreshnessScore: 92.5,
        shelfLifeHours: 48
      },
      positiveViolationsCount: 0,
      photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "TRD-TG05",
      marketId: "MKT-04",
      marketName: "Pasar Tugu",
      stallNumber: "Blok Sayur No. 05",
      traderName: "Ibu Sumiyati",
      category: "leafy_greens",
      categoryLabel: "Sayuran Hijau & Cabai Merah",
      supplierId: "SUP-04",
      supplierName: "Kelompok Tani Dataran Tinggi Sekincau",
      qrCodeToken: "SFS-LPG-TG05-MONITOR-2026",
      status: "UNDER_MONITORING",
      statusBadge: "Dalam Pengawasan (Residu Pestisida Sedang)",
      foodSafetyScore: 82.0,
      lastInspectionDate: "09 Nov 2026, 07:45 WIB",
      inspectorName: "Siti Rahmawati, M.Sc (Pengawas Pangan Dinkes)",
      testResults: {
        formalin: "NEGATIF (0 ppm)",
        boraks: "NEGATIF (0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (0 ppm)",
        residuPestisida: "WASPADA (0.16 ppm mendekati BMR)",
        aiFreshnessScore: 84.0,
        shelfLifeHours: 18
      },
      positiveViolationsCount: 1,
      photoUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "TRD-SM11",
      marketId: "MKT-05",
      marketName: "Pasar Smep",
      stallNumber: "Blok Unggas No. 11",
      traderName: "Pak Joko Purwanto",
      category: "poultry",
      categoryLabel: "Daging Ayam Broiler & Kampung",
      supplierId: "SUP-01",
      supplierName: "RPA Hajimena Natar",
      qrCodeToken: "SFS-LPG-SM11-SAFE-2026",
      status: "VERIFIED_SAFE",
      statusBadge: "Lapak Aman Pangan (Bebas Bahan Berbahaya)",
      foodSafetyScore: 94.8,
      lastInspectionDate: "08 Nov 2026, 09:25 WIB",
      inspectorName: "Andri Junaidi, S.Tr.Kes (NIP 199507142021021003)",
      testResults: {
        formalin: "NEGATIF (0 ppm)",
        boraks: "NEGATIF (0 ppm)",
        rhodaminB: "NEGATIF (0 ppm)",
        metanilYellow: "NEGATIF (0 ppm)",
        residuPestisida: "AMAN",
        aiFreshnessScore: 95.0,
        shelfLifeHours: 20
      },
      positiveViolationsCount: 0,
      photoUrl: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80"
    }
  ],

  // Riwayat Sidak Lapangan Terakhir (Inspections)
  inspections: [
    {
      id: "INSP-20261111-001",
      traderId: "TRD-PG01",
      traderName: "H. Syamsul Arifin",
      marketId: "MKT-01",
      marketName: "Pasar Pasir Gintung",
      stallNumber: "Blok A No. 01-02",
      commodity: "Daging Sapi Segar",
      category: "raw_meat",
      sampleCode: "SMP-PG-20261111-01",
      inspectorName: "Andri Junaidi, S.Tr.Kes",
      inspectorNip: "199507142021021003",
      timestamp: "11 Nov 2026, 06:40 WIB",
      gpsLat: -5.40932,
      gpsLng: 105.25364,
      gpsAccuracy: "3.2 meter",
      isLiveCapture: true,
      tests: {
        formalin: { status: "NEGATIF", ppm: 0, verified: true },
        boraks: { status: "NEGATIF", ppm: 0, verified: true },
        rhodaminB: { status: "NEGATIF", ppm: 0, verified: true },
        metanilYellow: { status: "NEGATIF", ppm: 0, verified: true },
        residuPestisida: { status: "NEGATIF", ppm: 0.005, verified: true }
      },
      aiAnalysis: {
        freshnessScore: 96.2,
        riskLevel: "LOW",
        estimatedShelfLifeHours: 36,
        detectedAnomalies: [],
        recommendations: ["Suhu pendingin 2.4°C optimal.", "Kualitas daging sangat prima dan bebas pengawet."]
      },
      overallResult: "LOLOS_AMAN",
      citoTriggered: false,
      syncedWithServer: true
    },
    {
      id: "INSP-20261111-002",
      traderId: "TRD-PJ08",
      traderName: "Pak Kasdi Wibowo",
      marketId: "MKT-03",
      marketName: "Pasar Panjang",
      stallNumber: "Blok Asin No. 08",
      commodity: "Ikan Teri Nasi & Teri Asin",
      category: "seafood",
      sampleCode: "SMP-PJ-20261111-08",
      inspectorName: "Rian Pratama, S.Si",
      inspectorNip: "198804152014031002",
      timestamp: "11 Nov 2026, 06:10 WIB",
      gpsLat: -5.46745,
      gpsLng: 105.31952,
      gpsAccuracy: "4.1 meter",
      isLiveCapture: true,
      tests: {
        formalin: { status: "POSITIF", ppm: 28.4, verified: true },
        boraks: { status: "POSITIF", ppm: 12.0, verified: true },
        rhodaminB: { status: "NEGATIF", ppm: 0, verified: true },
        metanilYellow: { status: "NEGATIF", ppm: 0, verified: true },
        residuPestisida: { status: "NEGATIF", ppm: 0, verified: true }
      },
      aiAnalysis: {
        freshnessScore: 31.0,
        riskLevel: "CRITICAL",
        estimatedShelfLifeHours: 0,
        detectedAnomalies: [
          { type: "DISCOLORATION", confidence: 0.94, description: "Warna putih mengkilap tidak wajar pada teri tanpa lalat." },
          { type: "TEMPERATURE_EXCURSION", confidence: 0.88, description: "Suhu penyimpanan 28.5°C tanpa pendingin higienis." }
        ],
        recommendations: [
          "🚨 BAHAYA RACUN: Segera sita dan segel seluruh batch ikan teri di lapak ini!",
          "Kirim CITO Alert darurat ke BBPOM Lampung dan Satpol PP untuk penarikan barang.",
          "Isolasi supplier CV Samudera Jaya di Gudang Lelang Teluk Betung."
        ]
      },
      overallResult: "POSITIF_RACUN",
      citoTriggered: true,
      citoDetails: {
        sentAt: "11 Nov 2026, 06:10:07 WIB (< 8 detik)",
        recipients: ["BBPOM di Bandar Lampung", "Dinas Ketahanan Pangan Prov. Lampung", "UPTD Pasar Panjang"],
        whatsappStatus: "DELIVERED",
        adminAction: "PENUTUPAN LAPAK SEMENTARA & PENYITAAN BARANG BUKTI 14.5 KG"
      },
      syncedWithServer: true
    }
  ],

  // Form Aduan Warga (Complaints)
  complaints: [
    {
      id: "ADV-202611-001",
      residentName: "Maya Indriati",
      phone: "0813-7721-XXXX",
      marketId: "MKT-02",
      marketName: "Pasar Bambu Kuning",
      stallDesc: "Lapak Mie Basah dekat pintu timur lorong 3",
      suspectedCommodity: "Mie Kuning Basah",
      description: "Mie kuning basah sangat awet lebih dari 3 hari di suhu ruang, warna kuningnya menyala mencurigakan seperti pewarna tekstil metanil yellow, dan baunya agak menyengat.",
      photoUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80",
      submittedAt: "10 Nov 2026, 14:20 WIB",
      status: "SEDANG_DIINVESTIGASI",
      statusLabel: "Sedang Diinvestigasi Tim BBPOM & Dinas",
      assignedInspector: "Andri Junaidi, S.Tr.Kes"
    },
    {
      id: "ADV-202611-002",
      residentName: "Hendra Gunawan",
      phone: "0852-6910-XXXX",
      marketId: "MKT-06",
      marketName: "Pasar Kangkung",
      stallDesc: "Penjual Tahu Putih dekat jembatan",
      suspectedCommodity: "Tahu Putih Kotak",
      description: "Tahu putih sangat kenyal seperti karet, dijatuhkan membal dan tidak hancur. Curiga menggunakan formalin/boraks berlebih.",
      photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
      submittedAt: "11 Nov 2026, 06:30 WIB",
      status: "TERJADWAL_SIDAK",
      statusLabel: "Terjadwal Sidak Khusus Tim Lapangan Hari Ini",
      assignedInspector: "Tim Reaksi Cepat BBPOM"
    },
    {
      id: "ADV-202611-003",
      residentName: "Ahmad Rizki",
      phone: "0821-8844-XXXX",
      marketId: "MKT-01",
      marketName: "Pasar Pasir Gintung",
      stallDesc: "Lapak Daging Sapi Blok A No 01",
      suspectedCommodity: "Daging Sapi",
      description: "Apresiasi untuk pemda dan pengawas, label QR Lapak Aman Pangan sangat membantu, daging segar dan tidak bau, hasil scan jelas.",
      photoUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80",
      submittedAt: "09 Nov 2026, 11:15 WIB",
      status: "SELESAI_ARSIP",
      statusLabel: "Terverifikasi Positif (Laporan Konsumen Puas)",
      assignedInspector: "Dinas Ketahanan Pangan"
    }
  ],

  // Audit Log Sistem (Memenuhi UU PDP & UU Pangan)
  auditLogs: [
    {
      id: "LOG-9921",
      timestamp: "11 Nov 2026, 06:40:15 WIB",
      userId: "USR-INSP-01",
      userName: "Andri Junaidi, S.Tr.Kes",
      role: "Petugas Pengawas Pangan",
      action: "SUBMIT_INSPECTION_SUCCESS",
      resource: "INSP-20261111-001 (Pasar Pasir Gintung - Lapak PG-01)",
      ipAddress: "180.252.88.14 (Mobile LTE Telkomsel Lampung)",
      hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: "LOG-9920",
      timestamp: "11 Nov 2026, 06:10:07 WIB",
      userId: "USR-INSP-02",
      userName: "Rian Pratama, S.Si",
      role: "Pengawas BBPOM Bandar Lampung",
      action: "CITO_ALERT_AUTO_DISPATCH",
      resource: "INSP-20261111-002 (Pasar Panjang - Lapak PJ-08 POSITIF FORMALIN)",
      ipAddress: "180.252.88.92 (Mobile 4G Indosat Lampung)",
      hashSha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    },
    {
      id: "LOG-9919",
      timestamp: "11 Nov 2026, 06:11:30 WIB",
      userId: "USR-ADMIN-01",
      userName: "Dr. Ir. Fitria Hidayah, M.M",
      role: "Kepala Dinas Ketahanan Pangan Prov. Lampung",
      action: "APPROVE_CITO_SANCTION",
      resource: "Penerbitan Surat Sanksi Pembekuan Izin Lapak PJ-08 & Penyelidikan Supplier SUP-05",
      ipAddress: "36.68.192.40 (Jaringan Kantor Pemprov Lampung)",
      hashSha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    },
    {
      id: "LOG-9918",
      timestamp: "11 Nov 2026, 05:30:00 WIB",
      userId: "USR-SYS-SYNC",
      userName: "System Offline-First Worker",
      role: "Background Daemon",
      action: "OFFLINE_CACHE_VERIFIED",
      resource: "200 Slot Offline Storage IndexedDB Ready on Inspector Device",
      ipAddress: "127.0.0.1 (Local Client Storage)",
      hashSha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
    }
  ],

  // Parameter Kimia Uji Cepat (Rapid Test Kit)
  rapidTestParams: [
    {
      id: "param_formalin",
      name: "Formalin (Formaldehida)",
      hazardLevel: "TINGGI (Karsinogenik Golongan 1)",
      safeThreshold: "0 ppm (Harus NEGATIF)",
      reagentName: "Reagen Asam Kromotropat / Test Strip Merah Ungu",
      targetCommodities: "Ikan Basah, Daging Ayam, Mie Basah, Tahu Putih"
    },
    {
      id: "param_boraks",
      name: "Boraks / Asam Borat / Bleng",
      hazardLevel: "TINGGI (Toksik Ginjal & Hati)",
      safeThreshold: "0 ppm (Harus NEGATIF)",
      reagentName: "Kertas Curcuminoid / Ekstrak Kunyit Kimia",
      targetCommodities: "Bakso, Kerupuk Gendar, Lontong, Otak-otak"
    },
    {
      id: "param_rhodamin_b",
      name: "Rhodamin B (Pewarna Merah Tekstil)",
      hazardLevel: "TINGGI (Karsinogenik Kandung Kemih & Hati)",
      safeThreshold: "0 ppm (Harus NEGATIF)",
      reagentName: "Kit Rapid Uji Pewarna Tekstil",
      targetCommodities: "Terasi Udang, Kerupuk Merah, Sirup Curah, Gulali"
    },
    {
      id: "param_metanil_yellow",
      name: "Metanil Yellow (Pewarna Kuning Tekstil)",
      hazardLevel: "TINGGI (Karsinogenik Saluran Pencernaan)",
      safeThreshold: "0 ppm (Harus NEGATIF)",
      reagentName: "Reagen HCl Pekat / Acid Dye Spot",
      targetCommodities: "Tahu Kuning, Mie Kuning, Kerupuk Pasir Kuning"
    },
    {
      id: "param_pestisida",
      name: "Residu Pestisida & Nitrit",
      hazardLevel: "SEDANG - TINGGI (Neurotoksik Akumulatif)",
      safeThreshold: "< 0.20 ppm (Sesuai Batas Maksimum Residu BMR)",
      reagentName: "Cholinesterase Enzyme Inhibition Kit",
      targetCommodities: "Sayuran Daun, Cabai Merah, Buah-buahan Segar"
    }
  ]
};

// Make accessible to window or node environment
if (typeof window !== "undefined") {
  window.SFS_DATA = SFS_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SFS_DATA;
}

