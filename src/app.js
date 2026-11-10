/**
 * Smart Food Safety Lampung — Master Application Controller
 * Wilayah: Provinsi Lampung
 * Mengintegrasikan:
 * 1. Mobile Inspector (Offline-First, Live Camera, GPS Watermark, Rapid Test 5 Parameter)
 * 2. AI Freshness & Anomaly Engine (Spesifikasi skill.md)
 * 3. Dynamic QR Code "Lapak Aman Pangan" Generator & Public Scanner
 * 4. CITO Red Alert Engine (<10 detik WhatsApp & Audio Siren)
 * 5. Web Portal Publik & Interactive Map Pasar se-Lampung
 * 6. Executive Dashboard Analitik Dinas Ketahanan Pangan & BBPOM
 *
 * Header: Logo Pemda Lampung di kiri, Logo Univ Teknokrat Indonesia di kanan, Badge SFS di tengah.
 * Footer: Copyright©2026 by M. Andri Junaidi dan Dr. Erliyan Redy Susanto, M.Kom
 */

class SmartFoodSafetyApp {
  constructor() {
    this.currentRole = 'inspector'; // 'inspector' | 'public' | 'dashboard' | 'trader' | 'scanner'
    this.mobileFrameMode = true; // true = iPhone mockup frame, false = full width
    this.isOnline = navigator.onLine !== undefined ? navigator.onLine : true;
    this.offlineQueue = [];
    this.cameraStream = null;
    this.currentGps = { lat: -5.40932, lng: 105.25364, accuracy: 3.2, address: "Pasar Pasir Gintung, Bandar Lampung" };
    this.currentCapturedImage = null;
    this.leafletMap = null;
    this.mapMarkers = [];
    this.audioCtx = null;
    this.sirenOscillator = null;
    this.isSirenPlaying = false;
    this.citoTimerInterval = null;
    this.citoCountdown = 10;

    // Load initial persistent state
    this.initStorage();
  }

  initStorage() {
    // Muat data dari localStorage jika ada, fallback ke SFS_DATA
    try {
      const storedInspections = localStorage.getItem('sfs_inspections');
      if (storedInspections) {
        this.inspections = JSON.parse(storedInspections);
      } else {
        this.inspections = [...SFS_DATA.inspections];
        localStorage.setItem('sfs_inspections', JSON.stringify(this.inspections));
      }

      const storedTraders = localStorage.getItem('sfs_traders');
      if (storedTraders) {
        this.traders = JSON.parse(storedTraders);
      } else {
        this.traders = [...SFS_DATA.traders];
        localStorage.setItem('sfs_traders', JSON.stringify(this.traders));
      }

      const storedComplaints = localStorage.getItem('sfs_complaints');
      if (storedComplaints) {
        this.complaints = JSON.parse(storedComplaints);
      } else {
        this.complaints = [...SFS_DATA.complaints];
        localStorage.setItem('sfs_complaints', JSON.stringify(this.complaints));
      }

      const storedQueue = localStorage.getItem('sfs_offline_queue');
      if (storedQueue) {
        this.offlineQueue = JSON.parse(storedQueue);
      }

      const storedLogs = localStorage.getItem('sfs_audit_logs');
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      } else {
        this.auditLogs = [...SFS_DATA.auditLogs];
        localStorage.setItem('sfs_audit_logs', JSON.stringify(this.auditLogs));
      }
    } catch (e) {
      console.warn("Storage fallback error:", e);
      this.inspections = [...SFS_DATA.inspections];
      this.traders = [...SFS_DATA.traders];
      this.complaints = [...SFS_DATA.complaints];
      this.auditLogs = [...SFS_DATA.auditLogs];
    }
  }

  saveStorage() {
    try {
      localStorage.setItem('sfs_inspections', JSON.stringify(this.inspections));
      localStorage.setItem('sfs_traders', JSON.stringify(this.traders));
      localStorage.setItem('sfs_complaints', JSON.stringify(this.complaints));
      localStorage.setItem('sfs_offline_queue', JSON.stringify(this.offlineQueue));
      localStorage.setItem('sfs_audit_logs', JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn("Save storage error:", e);
    }
  }

  init() {
    this.setupNetworkListeners();
    this.requestGpsLocation();
    this.renderRoleView(this.currentRole);
    this.updateOfflineBadge();
    this.initRoleSwitcherButtons();
    console.log("Smart Food Safety Lampung Initialized.");
  }

  // --- Network & Offline-First Sync Engine ---
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateNetworkUI();
      this.autoSyncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateNetworkUI();
    });
  }

  toggleNetworkSimulation() {
    this.isOnline = !this.isOnline;
    this.updateNetworkUI();
    this.showToast(this.isOnline ? "Status Jaringan: ONLINE (Terhubung ke BBPOM Cloud)" : "Status Jaringan: OFFLINE (Mode Lokal Aktif)", this.isOnline ? "success" : "warning");
    if (this.isOnline) {
      this.autoSyncOfflineData();
    }
  }

  updateNetworkUI() {
    const statusBadges = document.querySelectorAll('.network-status-badge');
    statusBadges.forEach(badge => {
      if (this.isOnline) {
        badge.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span> ONLINE (BBPOM Cloud)`;
        badge.className = "network-status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200";
      } else {
        badge.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> OFFLINE (Local SQLite/IndexedDB)`;
        badge.className = "network-status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200";
      }
    });
    this.updateOfflineBadge();
  }

  updateOfflineBadge() {
    const count = this.offlineQueue.length;
    const badgeElements = document.querySelectorAll('.offline-queue-count');
    badgeElements.forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.parentElement.classList.remove('hidden');
      } else {
        el.parentElement.classList.add('hidden');
      }
    });
  }

  async autoSyncOfflineData() {
    if (!this.isOnline || this.offlineQueue.length === 0) return;

    this.showToast(`Menyinkronkan ${this.offlineQueue.length} data sidak offline ke server pusat...`, "info");
    
    // Simulasi pengiriman data
    setTimeout(() => {
      const syncedCount = this.offlineQueue.length;
      while (this.offlineQueue.length > 0) {
        const item = this.offlineQueue.shift();
        item.syncedWithServer = true;
        this.inspections.unshift(item);
      }
      this.saveStorage();
      this.updateOfflineBadge();
      this.renderInspectionHistoryList();
      this.showToast(`Berhasil menyinkronkan ${syncedCount} data sidak lapangan!`, "success");
      
      // Catat audit log
      this.addAuditLog(
        "OFFLINE_QUEUE_SYNC_COMPLETE",
        `Sinkronisasi otomatis ${syncedCount} rekap sidak ke Cloud BBPOM`,
        "USR-INSP-01",
        "Andri Junaidi, S.Tr.Kes"
      );
    }, 1200);
  }

  // --- GPS Geofencing ---
  requestGpsLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentGps = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy * 10) / 10,
            address: "Terdeteksi Koordinat Akurat Lampung"
          };
          this.updateGpsDisplay();
        },
        (err) => {
          console.log("Using baseline Lampung GPS:", err.message);
          this.updateGpsDisplay();
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      this.updateGpsDisplay();
    }
  }

  updateGpsDisplay() {
    const gpsInputs = document.querySelectorAll('.inspector-gps-coords');
    gpsInputs.forEach(el => {
      el.value = `${this.currentGps.lat.toFixed(5)}, ${this.currentGps.lng.toFixed(5)} (Akurasi: ±${this.currentGps.accuracy}m)`;
    });
  }

  // --- Camera Live Capture & Watermarking ---
  async startCameraStream() {
    const video = document.getElementById('camera-stream-video');
    const container = document.getElementById('camera-preview-container');
    const captureBtn = document.getElementById('btn-capture-photo');
    const resetBtn = document.getElementById('btn-retake-photo');

    if (!video) return;

    try {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }

      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      video.srcObject = this.cameraStream;
      video.classList.remove('hidden');
      if (container) container.classList.add('hidden');
      if (captureBtn) captureBtn.classList.remove('hidden');
      if (resetBtn) resetBtn.classList.add('hidden');
      
      this.showToast("Kamera Live Pengawas Aktif.", "info");
    } catch (err) {
      console.warn("Camera stream unavailable, using simulation live capture mode:", err);
      this.simulateCameraStream();
    }
  }

  simulateCameraStream() {
    const video = document.getElementById('camera-stream-video');
    const container = document.getElementById('camera-preview-container');
    const captureBtn = document.getElementById('btn-capture-photo');

    if (video) video.classList.add('hidden');
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `
        <div class="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center text-white border-2 border-dashed border-emerald-500">
          <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-80" alt="Live Feed Preview" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          <div class="relative z-10 flex flex-col items-center text-center p-3">
            <span class="inline-flex items-center px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold tracking-wider uppercase mb-1">
              <span class="w-2 h-2 rounded-full bg-white animate-ping mr-1.5"></span> LIVE FEED CAMERA
            </span>
            <p class="text-xs text-white/90">Kamera Pengawas Siap Mengambil Sampel</p>
            <p class="text-[10px] text-emerald-300 font-mono mt-1">GPS Lock: ${this.currentGps.lat.toFixed(4)}, ${this.currentGps.lng.toFixed(4)}</p>
          </div>
        </div>
      `;
    }
    if (captureBtn) captureBtn.classList.remove('hidden');
  }

  captureLivePhoto() {
    const video = document.getElementById('camera-stream-video');
    const canvas = document.getElementById('camera-capture-canvas');
    const previewImg = document.getElementById('captured-photo-preview');
    const container = document.getElementById('camera-preview-container');
    const captureBtn = document.getElementById('btn-capture-photo');
    const retakeBtn = document.getElementById('btn-retake-photo');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;

    const marketSelect = document.getElementById('inspector-market-select');
    const marketName = marketSelect ? marketSelect.options[marketSelect.selectedIndex].text : "Pasar Tradisional Lampung";
    const traderName = document.getElementById('inspector-trader-name')?.value || "Pedagang Terdaftar";
    const stallNo = document.getElementById('inspector-stall-no')?.value || "Blok Utama";
    const commodity = document.getElementById('inspector-commodity-select')?.value || "Komoditas Pangan";

    const now = new Date();
    const timeString = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + " " +
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB";

    const drawWatermark = () => {
      // Overlay Dark Banner Bawah
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, canvas.height - 110, canvas.width, 110);

      // Garis Aksen Emas Lampung
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, canvas.height - 110, canvas.width, 3);

      // Teks Watermark
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("SMART FOOD SAFETY LAMPUNG — PEMPROV & BBPOM", 16, canvas.height - 84);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`📍 ${marketName} — ${stallNo} (${traderName})`, 16, canvas.height - 62);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px monospace";
      ctx.fillText(`🕒 ${timeString} | GPS: ${this.currentGps.lat.toFixed(5)}, ${this.currentGps.lng.toFixed(5)} (±${this.currentGps.accuracy}m)`, 16, canvas.height - 40);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px sans-serif";
      ctx.fillText(`Petugas: Andri Junaidi, S.Tr.Kes | ANTI-MANIPULASI LIVE CAPTURE OK`, 16, canvas.height - 20);

      // Timestamp hash
      const hash = "SIG-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 10px monospace";
      ctx.fillText(hash, canvas.width - 110, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      this.currentCapturedImage = dataUrl;

      if (previewImg) {
        previewImg.src = dataUrl;
        previewImg.classList.remove('hidden');
      }
      if (video) video.classList.add('hidden');
      if (container) container.classList.add('hidden');
      if (captureBtn) captureBtn.classList.add('hidden');
      if (retakeBtn) retakeBtn.classList.remove('hidden');

      this.showToast("Foto Ber-Watermark & GPS Berhasil Diambil!", "success");

      // Jalankan AI Freshness Vision Check jika AI Engine aktif
      this.triggerLiveAiVisionCheck(canvas);
    };

    if (this.cameraStream && video && !video.paused) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      drawWatermark();
      // Matikan stream setelah capture
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    } else {
      // Gunakan image mock realistis untuk snapshot simulasi
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawWatermark();
      };
      img.src = "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=640&q=80";
    }
  }

  retakePhoto() {
    this.currentCapturedImage = null;
    const previewImg = document.getElementById('captured-photo-preview');
    if (previewImg) previewImg.classList.add('hidden');
    this.startCameraStream();
  }

  // --- AI Freshness & Anomaly Evaluation ---
  async triggerLiveAiVisionCheck(canvas) {
    if (!window.sfsAIEngine) return;

    try {
      const categorySelect = document.getElementById('inspector-commodity-category');
      const foodCategory = categorySelect ? categorySelect.value : "raw_meat";
      const tempVal = parseFloat(document.getElementById('ai-input-temp')?.value || 4.2);
      const humidityVal = parseFloat(document.getElementById('ai-input-humidity')?.value || 75);
      const vocVal = parseFloat(document.getElementById('ai-input-voc')?.value || 0.35);
      const storageDurationVal = parseFloat(document.getElementById('ai-input-duration')?.value || 3);

      const canvasMetrics = await window.sfsAIEngine.analyzeCanvasImage(canvas);

      const aiResult = await window.sfsAIEngine.evaluateFreshness({
        sensor_data: {
          temperature: tempVal,
          humidity: humidityVal,
          gas_voc_ppm: vocVal
        },
        image_payload: this.currentCapturedImage,
        food_category: foodCategory,
        storage_duration_hrs: storageDurationVal,
        image_clarity: canvasMetrics.clarity
      });

      this.lastAiResult = aiResult;
      this.renderAiEvaluationResult(aiResult);
    } catch (err) {
      console.warn("AI analysis error:", err);
    }
  }

  async runManualAiEvaluation() {
    if (!window.sfsAIEngine) return;

    const foodCategory = document.getElementById('ai-input-category')?.value || "raw_meat";
    const temp = parseFloat(document.getElementById('ai-input-temp')?.value || 3.5);
    const humidity = parseFloat(document.getElementById('ai-input-humidity')?.value || 70);
    const voc = parseFloat(document.getElementById('ai-input-voc')?.value || 0.25);
    const duration = parseFloat(document.getElementById('ai-input-duration')?.value || 4);

    const btn = document.getElementById('btn-run-ai-eval');
    if (btn) {
      btn.innerHTML = `<span class="inline-block animate-spin mr-2">⚙️</span> Menganalisis Sensor & Vision...`;
      btn.disabled = true;
    }

    try {
      const result = await window.sfsAIEngine.evaluateFreshness({
        sensor_data: { temperature: temp, humidity: humidity, gas_voc_ppm: voc },
        image_payload: this.currentCapturedImage || "sample_image_data",
        food_category: foodCategory,
        storage_duration_hrs: duration,
        image_clarity: 88
      });

      this.lastAiResult = result;
      this.renderAiEvaluationResult(result);
      this.showToast(`AI Evaluasi Selesai (${result.meta.latency_ms}ms) — Skor: ${result.freshness_score}/100`, "success");
    } finally {
      if (btn) {
        btn.innerHTML = `🔍 Jalankan Evaluasi AI Skill`;
        btn.disabled = false;
      }
    }
  }

  renderAiEvaluationResult(result) {
    const container = document.getElementById('ai-result-display-card');
    if (!container) return;

    container.classList.remove('hidden');

    const scoreColor = result.freshness_score >= 80 ? 'text-emerald-600' :
      result.freshness_score >= 60 ? 'text-amber-600' : 'text-rose-600';

    const riskBadge = {
      LOW: '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">LOW RISK (Sangat Segar)</span>',
      MEDIUM: '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">MEDIUM RISK (Waspada)</span>',
      HIGH: '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">HIGH RISK (Mendekati Batas)</span>',
      CRITICAL: '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">CRITICAL (Bahaya / Rusak)</span>'
    }[result.risk_level] || result.risk_level;

    const anomaliesHtml = result.detected_anomalies.length > 0
      ? result.detected_anomalies.map(a => `
        <li class="flex items-start text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
          <span class="mr-1.5 font-bold">⚠️ [${a.type}]:</span>
          <span>${a.description} <i class="text-[10px] text-rose-500 font-mono">(${(a.confidence * 100).toFixed(0)}% conf)</i></span>
        </li>
      `).join('')
      : `<li class="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">✅ Tidak terdeteksi anomali bau, jamur, atau suhu berbahaya.</li>`;

    const actionsHtml = result.recommended_actions.map(act => `
      <li class="flex items-start text-xs text-slate-700">
        <span class="text-emerald-500 mr-1.5 font-bold">👉</span>
        <span>${act}</span>
      </li>
    `).join('');

    container.innerHTML = `
      <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-lg border border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🤖</span>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Freshness Engine v2.0</h4>
              <p class="text-[11px] text-slate-400">Komoditas: <span class="capitalize text-white font-semibold">${result.item_category.replace('_', ' ')}</span></p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 font-mono">SLA: ${result.meta.latency_ms}ms</span>
            <div class="mt-0.5">${riskBadge}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
            <span class="text-[11px] text-slate-400 block mb-0.5">Skor Kesegaran Terpadu</span>
            <span class="text-3xl font-extrabold ${scoreColor}">${result.freshness_score}<span class="text-sm text-slate-400 font-normal">/100</span></span>
            <div class="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="h-full ${result.freshness_score >= 80 ? 'bg-emerald-500' : result.freshness_score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}" style="width: ${result.freshness_score}%"></div>
            </div>
          </div>
          <div class="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
            <span class="text-[11px] text-slate-400 block mb-0.5">Estimasi Sisa Umur Simpan</span>
            <span class="text-3xl font-extrabold text-cyan-400">${result.estimated_remaining_shelf_life_hours}<span class="text-sm text-slate-400 font-normal"> jam</span></span>
            <span class="text-[10px] text-slate-400 block mt-1">Model Kinetik Arrhenius</span>
          </div>
        </div>

        <div class="space-y-2 mb-3">
          <span class="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Anomali Terdeteksi:</span>
          <ul class="space-y-1.5">${anomaliesHtml}</ul>
        </div>

        <div class="space-y-1.5 pt-2 border-t border-slate-700">
          <span class="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Rekomendasi Tindakan:</span>
          <ul class="space-y-1">${actionsHtml}</ul>
        </div>
      </div>
    `;

    // Auto update hidden field if available
    const hiddenScore = document.getElementById('inspector-ai-score-field');
    if (hiddenScore) hiddenScore.value = result.freshness_score;
  }

  // --- Rapid Test Form Submission & CITO Red Alert Engine ---
  submitInspectionForm(e) {
    if (e) e.preventDefault();

    const marketSelect = document.getElementById('inspector-market-select');
    const marketId = marketSelect ? marketSelect.value : "MKT-01";
    const marketName = marketSelect ? marketSelect.options[marketSelect.selectedIndex].text : "Pasar Pasir Gintung";
    const stallNumber = document.getElementById('inspector-stall-no')?.value || "Lapak #01";
    const traderName = document.getElementById('inspector-trader-name')?.value || "Pedagang";
    const commodity = document.getElementById('inspector-commodity-select')?.value || "Daging Sapi";
    const category = document.getElementById('inspector-commodity-category')?.value || "raw_meat";
    const supplierId = document.getElementById('inspector-supplier-select')?.value || "SUP-01";

    // 5 Parameter Uji Cepat
    const formalinStatus = document.querySelector('input[name="test_formalin"]:checked')?.value || "NEGATIF";
    const formalinPpm = parseFloat(document.getElementById('input-ppm-formalin')?.value || 0);

    const boraksStatus = document.querySelector('input[name="test_boraks"]:checked')?.value || "NEGATIF";
    const boraksPpm = parseFloat(document.getElementById('input-ppm-boraks')?.value || 0);

    const rhodaminBStatus = document.querySelector('input[name="test_rhodamin"]:checked')?.value || "NEGATIF";
    const metanilYellowStatus = document.querySelector('input[name="test_metanil"]:checked')?.value || "NEGATIF";
    const pestisidaStatus = document.querySelector('input[name="test_pestisida"]:checked')?.value || "NEGATIF";
    const pestisidaPpm = parseFloat(document.getElementById('input-ppm-pestisida')?.value || 0);

    // Cek apakah ada zat berbahaya POSITIF
    const hasHazardPositive = (
      formalinStatus === "POSITIF" ||
      boraksStatus === "POSITIF" ||
      rhodaminBStatus === "POSITIF" ||
      metanilYellowStatus === "POSITIF" ||
      pestisidaPpm > 0.2
    );

    const inspectionId = "INSP-" + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const now = new Date();
    const timestampStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " +
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";

    const aiScore = this.lastAiResult ? this.lastAiResult.freshness_score : (hasHazardPositive ? 25.0 : 95.0);
    const shelfLife = this.lastAiResult ? this.lastAiResult.estimated_remaining_shelf_life_hours : (hasHazardPositive ? 0 : 36);

    const inspectionRecord = {
      id: inspectionId,
      traderId: "TRD-GEN-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      traderName: traderName,
      marketId: marketId,
      marketName: marketName,
      stallNumber: stallNumber,
      commodity: commodity,
      category: category,
      sampleCode: "SMP-" + marketId.slice(4) + "-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      inspectorName: "Andri Junaidi, S.Tr.Kes",
      inspectorNip: "199507142021021003",
      timestamp: timestampStr,
      gpsLat: this.currentGps.lat,
      gpsLng: this.currentGps.lng,
      gpsAccuracy: this.currentGps.accuracy + "m",
      photoUrl: this.currentCapturedImage || "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80",
      isLiveCapture: true,
      tests: {
        formalin: { status: formalinStatus, ppm: formalinPpm, verified: true },
        boraks: { status: boraksStatus, ppm: boraksPpm, verified: true },
        rhodaminB: { status: rhodaminBStatus, ppm: 0, verified: true },
        metanilYellow: { status: metanilYellowStatus, ppm: 0, verified: true },
        residuPestisida: { status: pestisidaStatus, ppm: pestisidaPpm, verified: true }
      },
      aiAnalysis: {
        freshnessScore: aiScore,
        riskLevel: hasHazardPositive ? "CRITICAL" : (aiScore > 80 ? "LOW" : "MEDIUM"),
        estimatedShelfLifeHours: shelfLife,
        detectedAnomalies: hasHazardPositive ? [{ type: "CHEMICAL_HAZARD_POSITIVE", confidence: 0.99, description: "Terdeteksi racun kimia berbahaya." }] : [],
        recommendations: hasHazardPositive ? ["Sita seluruh sampel segera!", "Kirim CITO Red Alert."] : ["Terbitkan QR Bebas Bahan Berbahaya."]
      },
      overallResult: hasHazardPositive ? "POSITIF_RACUN" : "LOLOS_AMAN",
      citoTriggered: hasHazardPositive,
      syncedWithServer: this.isOnline
    };

    // Update / tambah data pedagang
    let targetTrader = this.traders.find(t => t.stallNumber === stallNumber && t.marketId === marketId);
    if (!targetTrader) {
      targetTrader = {
        id: inspectionRecord.traderId,
        marketId: marketId,
        marketName: marketName,
        stallNumber: stallNumber,
        traderName: traderName,
        category: category,
        categoryLabel: commodity,
        supplierId: supplierId,
        supplierName: SFS_DATA.suppliers.find(s => s.id === supplierId)?.name || "Distributor Terdaftar",
        qrCodeToken: "SFS-LPG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: hasHazardPositive ? "CITO_ALERT" : "VERIFIED_SAFE",
        statusBadge: hasHazardPositive ? "DIBEKUKAN / PERINGATAN BBPOM" : "Lapak Aman Pangan (Bebas Bahan Berbahaya)",
        foodSafetyScore: aiScore,
        lastInspectionDate: timestampStr,
        inspectorName: "Andri Junaidi, S.Tr.Kes",
        testResults: {
          formalin: formalinStatus + ` (${formalinPpm} ppm)`,
          boraks: boraksStatus + ` (${boraksPpm} ppm)`,
          rhodaminB: rhodaminBStatus,
          metanilYellow: metanilYellowStatus,
          residuPestisida: pestisidaStatus + ` (${pestisidaPpm} ppm)`,
          aiFreshnessScore: aiScore,
          shelfLifeHours: shelfLife
        },
        positiveViolationsCount: hasHazardPositive ? 1 : 0,
        photoUrl: inspectionRecord.photoUrl
      };
      this.traders.unshift(targetTrader);
    } else {
      targetTrader.foodSafetyScore = aiScore;
      targetTrader.lastInspectionDate = timestampStr;
      if (hasHazardPositive) {
        targetTrader.positiveViolationsCount += 1;
        targetTrader.status = "CITO_ALERT";
        // Rule 5.1.3: jika 3x positif otomatis dilarang beroperasi
        if (targetTrader.positiveViolationsCount >= 3) {
          targetTrader.statusBadge = "IZIN DICABUT / DILARANG BEROPERASI (3x Positif Racun)";
        } else {
          targetTrader.statusBadge = `DIBEKUKAN SEMENTARA (${targetTrader.positiveViolationsCount}x Pelanggaran Positif)`;
        }
      } else {
        targetTrader.status = "VERIFIED_SAFE";
        targetTrader.statusBadge = "Lapak Aman Pangan (Bebas Bahan Berbahaya)";
      }
    }

    if (this.isOnline) {
      this.inspections.unshift(inspectionRecord);
      this.saveStorage();
      this.showToast("Hasil Sidak Berhasil Disimpan & Tersinkronisasi ke Cloud BBPOM!", "success");
    } else {
      // Masukkan ke offline queue
      this.offlineQueue.push(inspectionRecord);
      this.saveStorage();
      this.updateOfflineBadge();
      this.showToast("Jaringan Offline: Data Sidak Disimpan di Cache Lokal IndexedDB Device!", "warning");
    }

    // Tambah Audit Log
    this.addAuditLog(
      hasHazardPositive ? "INSPECTION_POSITIVE_HAZARD" : "INSPECTION_SUBMITTED",
      `Sidak di ${marketName} (${stallNumber} - ${traderName}) [${inspectionRecord.overallResult}]`,
      "USR-INSP-01",
      "Andri Junaidi, S.Tr.Kes"
    );

    // Jika POSITIF, picu CITO RED ALERT (< 10 Detik)
    if (hasHazardPositive) {
      this.triggerCitoRedAlert(inspectionRecord);
    } else {
      // Tampilkan Modal QR Sukses Lapak Aman
      this.showQrSuccessModal(targetTrader);
    }

    // Refresh UI
    this.renderInspectionHistoryList();
    this.resetInspectorForm();
  }

  // --- CITO Red Alert Engine (<10 detik WhatsApp & Siren) ---
  triggerCitoRedAlert(record) {
    this.playEmergencySiren();

    const modal = document.getElementById('cito-alert-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    // Suara getar di perangkat mobile jika didukung
    if (navigator.vibrate) {
      navigator.vibrate([400, 200, 400, 200, 600]);
    }

    // Set countdown timer
    this.citoCountdown = 10;
    const counterEl = document.getElementById('cito-countdown-display');
    const progressBar = document.getElementById('cito-countdown-progress');

    if (this.citoTimerInterval) clearInterval(this.citoTimerInterval);

    this.citoTimerInterval = setInterval(() => {
      this.citoCountdown -= 1;
      if (counterEl) counterEl.textContent = this.citoCountdown + " detik";
      if (progressBar) progressBar.style.width = ((this.citoCountdown / 10) * 100) + "%";

      if (this.citoCountdown <= 0) {
        clearInterval(this.citoTimerInterval);
        this.autoSendWhatsAppAlert(record);
      }
    }, 1000);

    // Render detail pelanggaran di modal
    const detailContainer = document.getElementById('cito-modal-details');
    if (detailContainer) {
      const positives = [];
      if (record.tests.formalin.status === "POSITIF") positives.push(`Formalin (${record.tests.formalin.ppm} ppm)`);
      if (record.tests.boraks.status === "POSITIF") positives.push(`Boraks (${record.tests.boraks.ppm} ppm)`);
      if (record.tests.rhodaminB.status === "POSITIF") positives.push(`Rhodamin B`);
      if (record.tests.metanilYellow.status === "POSITIF") positives.push(`Metanil Yellow`);
      if (record.tests.residuPestisida.ppm > 0.2) positives.push(`Residu Pestisida (${record.tests.residuPestisida.ppm} ppm)`);

      detailContainer.innerHTML = `
        <div class="bg-rose-950/70 border border-rose-600/80 rounded-xl p-4 text-left text-white space-y-2">
          <div class="flex items-center justify-between border-b border-rose-800 pb-2">
            <span class="text-xs font-bold text-rose-300">LOKASI & LAPAK:</span>
            <span class="text-xs font-mono font-bold text-amber-300">${record.marketName} (${record.stallNumber})</span>
          </div>
          <div class="flex items-center justify-between border-b border-rose-800 pb-2">
            <span class="text-xs font-bold text-rose-300">PEDAGANG & KOMODITAS:</span>
            <span class="text-xs font-semibold text-white">${record.traderName} — ${record.commodity}</span>
          </div>
          <div class="border-b border-rose-800 pb-2">
            <span class="text-xs font-bold text-rose-300 block mb-1">KIMIA BERBAHAYA TERDETEKSI:</span>
            <div class="flex flex-wrap gap-1.5">
              ${positives.map(p => `<span class="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-xs shadow">${p}</span>`).join('')}
            </div>
          </div>
          <div class="text-[11px] text-slate-300 font-mono">
            GPS Lock: ${record.gpsLat.toFixed(5)}, ${record.gpsLng.toFixed(5)} | Waktu: ${record.timestamp}
          </div>
        </div>
      `;
    }

    // Siapkan link WhatsApp manual
    this.prepareWhatsAppButton(record);
  }

  prepareWhatsAppButton(record) {
    const waBtn = document.getElementById('btn-send-whatsapp-blast');
    if (!waBtn) return;

    const msg = encodeURIComponent(
      `🚨 *CITO RED ALERT — KEAMANAN PANGAN PROVINSI LAMPUNG*\n` +
      `--------------------------------------------------\n` +
      `⚠️ *TEMUAN ZAT BERBAHAYA (POSITIF RAPID TEST)*\n\n` +
      `📍 *Pasar:* ${record.marketName}\n` +
      `🏪 *Nomor Lapak:* ${record.stallNumber}\n` +
      `👤 *Pedagang:* ${record.traderName}\n` +
      `🐟 *Komoditas:* ${record.commodity}\n` +
      `🧪 *Hasil Uji:* Formalin: ${record.tests.formalin.status} | Boraks: ${record.tests.boraks.status}\n` +
      `🗺️ *Koordinat GPS:* ${record.gpsLat}, ${record.gpsLng}\n` +
      `⏰ *Waktu Sidak:* ${record.timestamp}\n` +
      `👮 *Pengawas:* ${record.inspectorName} (${record.inspectorNip})\n\n` +
      `*INSTRUKSI DARURAT:* Segera lakukan penarikan barang bukti & koordinasi Satpol PP PPNS untuk penyegelan lapak.\n` +
      `_Sistem Terintegrasi BBPOM & Dinas Ketahanan Pangan Provinsi Lampung_`
    );

    waBtn.href = `https://wa.me/6281273119921?text=${msg}`;
    waBtn.onclick = () => {
      this.stopEmergencySiren();
      this.showToast("WhatsApp Blast Terkirim ke Command Center BBPOM!", "success");
    };
  }

  autoSendWhatsAppAlert(record) {
    this.showToast("⚡ CITO Alert Auto-Dispatched ke BBPOM & Dinas Ketahanan Pangan (<10s)!", "warning");
    this.addAuditLog(
      "CITO_AUTO_DISPATCH_TIMEOUT_OK",
      `Pesan darurat terkirim otomatis ke BBPOM & Dinas Ketahanan Pangan Prov. Lampung`,
      "SYS-ALERT-DAEMON",
      "Otomatisasi Sistem CITO"
    );
  }

  closeCitoModal() {
    this.stopEmergencySiren();
    if (this.citoTimerInterval) clearInterval(this.citoTimerInterval);
    const modal = document.getElementById('cito-alert-modal');
    if (modal) modal.classList.add('hidden');
  }

  playEmergencySiren() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.isSirenPlaying) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.audioCtx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(650, this.audioCtx.currentTime + 0.8);

      // LFO modulation untuk sirine berulang
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.value = 2.5; // 2.5 Hz siren cycle
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      this.sirenOscillator = { osc, lfo, gain };
      this.isSirenPlaying = true;
    } catch (e) {
      console.warn("Audio Context Siren Error:", e);
    }
  }

  stopEmergencySiren() {
    if (this.isSirenPlaying && this.sirenOscillator) {
      try {
        this.sirenOscillator.osc.stop();
        this.sirenOscillator.lfo.stop();
      } catch (e) {}
      this.isSirenPlaying = false;
      this.sirenOscillator = null;
    }
  }

  // --- Dynamic QR Code Generator & Modal ---
  showQrSuccessModal(trader) {
    const modal = document.getElementById('qr-success-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    const qrContainer = document.getElementById('qr-canvas-container');
    const traderNameEl = document.getElementById('qr-modal-trader-name');
    const stallInfoEl = document.getElementById('qr-modal-stall-info');
    const scoreEl = document.getElementById('qr-modal-safety-score');
    const tokenEl = document.getElementById('qr-modal-token');

    if (traderNameEl) traderNameEl.textContent = trader.traderName;
    if (stallInfoEl) stallInfoEl.textContent = `${trader.marketName} — ${trader.stallNumber} (${trader.categoryLabel})`;
    if (scoreEl) scoreEl.textContent = trader.foodSafetyScore + "/100";
    if (tokenEl) tokenEl.textContent = trader.qrCodeToken;

    // Render QR Code secara dinamis menggunakan SVG / Canvas
    if (qrContainer) {
      this.renderDynamicQrCode(qrContainer, `https://sfs-lampung.go.id/verify?token=${trader.qrCodeToken}`);
    }

    // Trigger Confetti efek perayaan lapak aman
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }

  renderDynamicQrCode(container, text) {
    container.innerHTML = "";
    if (window.QRCode) {
      new QRCode(container, {
        text: text,
        width: 180,
        height: 180,
        colorDark: "#044e45",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      // SVG Fallback QR Pattern Generator
      container.innerHTML = `
        <div class="w-44 h-44 bg-white p-2 border-2 border-emerald-600 rounded-lg flex flex-col items-center justify-center shadow-inner">
          <svg class="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M50 20h5v15h-5z M60 50h10v10h-10z M75 60h15v10h-15z M50 70h10v20h-10z M70 80h20v10h-20z M45 45h10v10h-10z M80 40h10v10h-10z" fill="#044e45" />
          </svg>
          <span class="text-[9px] font-mono text-emerald-800 font-bold mt-1">VERIFIED SFS LAMPUNG</span>
        </div>
      `;
    }
  }

  closeQrModal() {
    const modal = document.getElementById('qr-success-modal');
    if (modal) modal.classList.add('hidden');
  }

  // --- Public Interactive Map (Leaflet) ---
  initLeafletMap() {
    const mapContainer = document.getElementById('lampung-interactive-map');
    if (!mapContainer || this.leafletMap) return;

    // Titik tengah: Bandar Lampung (-5.4093, 105.2536)
    this.leafletMap = L.map('lampung-interactive-map', {
      center: [-5.38, 105.26],
      zoom: 11,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.leafletMap);

    this.renderMapMarkers('ALL');
  }

  renderMapMarkers(filterStatus = 'ALL') {
    if (!this.leafletMap) return;

    // Hapus marker lama
    this.mapMarkers.forEach(m => this.leafletMap.removeLayer(m));
    this.mapMarkers = [];

    SFS_DATA.markets.forEach(mkt => {
      if (filterStatus !== 'ALL' && mkt.status !== filterStatus) return;

      const markerColor = mkt.status === 'HIJAU' ? '#10b981' :
        mkt.status === 'KUNING' ? '#f59e0b' : '#ef4444';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xs" style="background-color: ${markerColor}">
              ${mkt.status === 'HIJAU' ? '✓' : mkt.status === 'KUNING' ? '!' : '✕'}
            </span>
            <span class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${markerColor}"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([mkt.lat, mkt.lng], { icon: customIcon }).addTo(this.leafletMap);

      const statusBadge = mkt.status === 'HIJAU' ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Zona Aman</span>' :
        mkt.status === 'KUNING' ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Zona Waspada</span>' :
        '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Zona Merah (CITO)</span>';

      const popupContent = `
        <div class="p-1 max-w-[220px]">
          <h4 class="font-bold text-sm text-slate-800">${mkt.name}</h4>
          <p class="text-xs text-slate-500 mb-1">${mkt.city} (${mkt.district})</p>
          <div class="my-1.5">${statusBadge}</div>
          <div class="text-xs space-y-0.5 mt-2 text-slate-700">
            <div>Skor Kepatuhan: <b class="text-emerald-700">${mkt.complianceScore}%</b></div>
            <div>Lapak Terverifikasi: <b>${mkt.verifiedCleanTraders}/${mkt.totalTraders}</b></div>
            <div class="text-[10px] text-slate-400 mt-1">Sidak Terakhir: ${mkt.lastInspection}</div>
          </div>
          <button onclick="window.sfsApp.openMarketDetailModal('${mkt.id}')" class="mt-2 w-full py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold">
            Lihat Daftar Lapak Aman
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.mapMarkers.push(marker);
    });
  }

  filterMap(status) {
    this.renderMapMarkers(status);
  }

  openMarketDetailModal(marketId) {
    const mkt = SFS_DATA.markets.find(m => m.id === marketId);
    if (!mkt) return;

    const modal = document.getElementById('market-detail-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    const titleEl = document.getElementById('market-modal-title');
    const subtitleEl = document.getElementById('market-modal-subtitle');
    const contentEl = document.getElementById('market-modal-content');

    if (titleEl) titleEl.textContent = mkt.name;
    if (subtitleEl) subtitleEl.textContent = `${mkt.classLevel} — ${mkt.address}`;

    // Ambil pedagang di pasar ini
    const tradersInMarket = this.traders.filter(t => t.marketId === marketId);

    const tradersHtml = tradersInMarket.length > 0 ? tradersInMarket.map(t => `
      <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-800">${t.stallNumber} — ${t.traderName}</span>
          <p class="text-[11px] text-slate-500">${t.categoryLabel} | Pemasok: ${t.supplierName}</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${t.status === 'VERIFIED_SAFE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            ${t.statusBadge}
          </span>
        </div>
        <div class="text-right">
          <span class="text-base font-extrabold ${t.foodSafetyScore >= 80 ? 'text-emerald-700' : 'text-rose-600'}">${t.foodSafetyScore}</span>
          <span class="text-[10px] text-slate-400 block">Skor Keamanan</span>
          <button onclick="window.sfsApp.openTraderQrModal('${t.id}')" class="mt-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-bold underline">
            Lihat QR Lapak
          </button>
        </div>
      </div>
    `).join('') : `<p class="text-xs text-slate-500 text-center py-4">Belum ada data lapak yang tercatat di pasar ini.</p>`;

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span class="text-[10px] text-slate-400 block">Kepatuhan</span>
              <span class="text-lg font-bold text-emerald-700">${mkt.complianceScore}%</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Lapak Bersih</span>
              <span class="text-lg font-bold text-slate-800">${mkt.verifiedCleanTraders}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Total Lapak</span>
              <span class="text-lg font-bold text-slate-800">${mkt.totalTraders}</span>
            </div>
          </div>
          <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Lapak Terdaftar di Pasar Ini:</h5>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            ${tradersHtml}
          </div>
        </div>
      `;
    }
  }

  closeMarketDetailModal() {
    const modal = document.getElementById('market-detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  openTraderQrModal(traderId) {
    const trader = this.traders.find(t => t.id === traderId);
    if (trader) {
      this.showQrSuccessModal(trader);
    }
  }

  // --- Public Complaint Submission (Form Aduan Warga) ---
  submitComplaintForm(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('complaint-name')?.value || "Masyarakat Anonim";
    const phone = document.getElementById('complaint-phone')?.value || "0812-XXXX-XXXX";
    const marketSelect = document.getElementById('complaint-market-select');
    const marketId = marketSelect ? marketSelect.value : "MKT-01";
    const marketName = marketSelect ? marketSelect.options[marketSelect.selectedIndex].text : "Pasar Pasir Gintung";
    const stall = document.getElementById('complaint-stall')?.value || "Lapak di lorong tengah";
    const commodity = document.getElementById('complaint-commodity')?.value || "Bahan Makanan";
    const desc = document.getElementById('complaint-desc')?.value || "";

    const newComplaint = {
      id: "ADV-" + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 8) + "-" + Math.random().toString(36).substring(2, 5).toUpperCase(),
      residentName: name,
      phone: phone,
      marketId: marketId,
      marketName: marketName,
      stallDesc: stall,
      suspectedCommodity: commodity,
      description: desc,
      photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
      submittedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " +
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB",
      status: "TERKIRIM_MENUNGGU_VERIFIKASI",
      statusLabel: "Terkirim ke Command Center BBPOM",
      assignedInspector: "Pengawas Wilayah " + marketName
    };

    this.complaints.unshift(newComplaint);
    this.saveStorage();
    this.showToast("Aduan Anda Telah Diterima BBPOM & Dinas Ketahanan Pangan!", "success");

    // Catat audit log
    this.addAuditLog(
      "CITIZEN_COMPLAINT_SUBMITTED",
      `Laporan warga: ${commodity} mencurigakan di ${marketName}`,
      "PUBLIC-USER",
      name
    );

    // Reset Form & Render list
    e.target.reset();
    this.renderComplaintsList();
  }

  // --- Executive Dashboard Charts (Chart.js) ---
  initDashboardCharts() {
    this.initCommodityRiskChart();
    this.initRegionalComplianceChart();
    this.initInspectionTrendChart();
  }

  initCommodityRiskChart() {
    const ctx = document.getElementById('chart-commodity-risk');
    if (!ctx || this.chartCommodity) return;

    this.chartCommodity = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ikan Teri/Asin', 'Tahu Basah', 'Daging Sapi/Ayam', 'Mie Basah', 'Kerupuk/Terasi', 'Sayuran Daun'],
        datasets: [{
          label: 'Persentase Temuan Zat Berbahaya (%)',
          data: [18.4, 12.2, 8.5, 7.8, 6.2, 3.1],
          backgroundColor: [
            '#e11d48', // Formalin di Ikan Asin
            '#f59e0b', // Metanil Yellow di Tahu
            '#10b981', // Daging
            '#ec4899', // Rhodamin B di Mie/Kerupuk
            '#8b5cf6', // Boraks
            '#06b6d4'  // Residu Pestisida
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Risiko Temuan: ${context.parsed.y}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 25,
            ticks: { callback: v => v + '%' }
          }
        }
      }
    });
  }

  initRegionalComplianceChart() {
    const ctx = document.getElementById('chart-regional-compliance');
    if (!ctx || this.chartRegional) return;

    this.chartRegional = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bandar Lampung (94.5%)', 'Kota Metro (97.7%)', 'Lampung Selatan (87.6%)', 'Lampung Tengah (91.9%)', 'Kabupaten Lain (86.2%)'],
        datasets: [{
          data: [94.5, 97.7, 87.6, 91.9, 86.2],
          backgroundColor: ['#047857', '#059669', '#f59e0b', '#10b981', '#3b82f6'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        }
      }
    });
  }

  initInspectionTrendChart() {
    const ctx = document.getElementById('chart-inspection-trend');
    if (!ctx || this.chartTrend) return;

    this.chartTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [
          {
            label: 'Sampel Bebas Bahan Berbahaya (Aman)',
            data: [42, 58, 64, 55, 72, 85, 92],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Temuan Positif Racun (CITO)',
            data: [0, 1, 0, 0, 1, 0, 0],
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.15)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // --- Official PDF / Print View Export ---
  openOfficialReportPrintView() {
    const modal = document.getElementById('official-report-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    const dateEl = document.getElementById('report-print-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    }

    const tbody = document.getElementById('report-table-body');
    if (tbody) {
      tbody.innerHTML = this.inspections.slice(0, 8).map((insp, idx) => `
        <tr class="border-b border-slate-300 text-xs text-slate-800">
          <td class="p-2 text-center font-mono">${idx + 1}</td>
          <td class="p-2 font-mono">${insp.id}</td>
          <td class="p-2 font-semibold">${insp.marketName}</td>
          <td class="p-2">${insp.stallNumber} (${insp.traderName})</td>
          <td class="p-2">${insp.commodity}</td>
          <td class="p-2 text-center font-bold ${insp.overallResult === 'LOLOS_AMAN' ? 'text-emerald-700' : 'text-rose-700'}">
            ${insp.overallResult === 'LOLOS_AMAN' ? 'AMAN (NEGATIF)' : 'POSITIF ZAT BERBAHAYA'}
          </td>
          <td class="p-2 text-center">${insp.tests.formalin.status}</td>
          <td class="p-2 text-center">${insp.tests.boraks.status}</td>
          <td class="p-2 text-right font-mono">${insp.aiAnalysis.freshnessScore}/100</td>
        </tr>
      `).join('');
    }
  }

  closeOfficialReportPrintView() {
    const modal = document.getElementById('official-report-modal');
    if (modal) modal.classList.add('hidden');
  }

  triggerPrint() {
    window.print();
  }

  // --- UI Switching & Rendering ---
  switchRole(role) {
    this.currentRole = role;
    this.renderRoleView(role);
    this.updateRoleSwitcherUI(role);
  }

  renderRoleView(role) {
    const views = ['inspector', 'public', 'dashboard', 'trader', 'scanner'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === role) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    if (role === 'public') {
      setTimeout(() => {
        this.initLeafletMap();
        if (this.leafletMap) this.leafletMap.invalidateSize();
      }, 200);
      this.renderComplaintsList();
    } else if (role === 'dashboard') {
      setTimeout(() => {
        this.initDashboardCharts();
      }, 200);
      this.renderAuditLogsTable();
      this.renderCitoDashboardFeed();
    } else if (role === 'inspector') {
      this.renderInspectionHistoryList();
    } else if (role === 'trader') {
      this.renderTraderPortalView();
    }
  }

  updateRoleSwitcherUI(activeRole) {
    const buttons = document.querySelectorAll('.role-switcher-btn');
    buttons.forEach(btn => {
      const role = btn.getAttribute('data-role');
      if (role === activeRole) {
        btn.className = "role-switcher-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow transition";
      } else {
        btn.className = "role-switcher-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition";
      }
    });
  }

  toggleMobileFrame() {
    this.mobileFrameMode = !this.mobileFrameMode;
    const frame = document.getElementById('mobile-inspector-frame');
    const toggleBtn = document.getElementById('btn-toggle-mobile-frame');

    if (frame) {
      if (this.mobileFrameMode) {
        frame.className = "max-w-md mx-auto bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-700 transition-all duration-300";
        if (toggleBtn) toggleBtn.innerHTML = `📱 Tampilan Penuh`;
      } else {
        frame.className = "w-full max-w-4xl mx-auto bg-transparent p-0 shadow-none border-0 transition-all duration-300";
        if (toggleBtn) toggleBtn.innerHTML = `📱 Mode iPhone Mockup`;
      }
    }
  }

  initRoleSwitcherButtons() {
    const buttons = document.querySelectorAll('.role-switcher-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        if (role) this.switchRole(role);
      });
    });
  }

  renderInspectionHistoryList() {
    const container = document.getElementById('inspector-history-list');
    if (!container) return;

    container.innerHTML = this.inspections.slice(0, 5).map(insp => `
      <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between text-left">
        <div>
          <div class="flex items-center space-x-1.5">
            <span class="text-xs font-bold text-slate-800">${insp.stallNumber}</span>
            <span class="text-[10px] text-slate-500">• ${insp.marketName}</span>
          </div>
          <p class="text-xs text-slate-600 font-medium">${insp.traderName} (${insp.commodity})</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${insp.overallResult === 'LOLOS_AMAN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            ${insp.overallResult === 'LOLOS_AMAN' ? '✓ LOLOS BEBAS RACUN' : '🚨 POSITIF RACUN (CITO)'}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono font-bold ${insp.aiAnalysis.freshnessScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}">
            ${insp.aiAnalysis.freshnessScore}/100
          </span>
          <span class="text-[10px] text-slate-400 block">${insp.timestamp.split(',')[1] || ''}</span>
          <span class="text-[10px] font-mono ${insp.syncedWithServer ? 'text-emerald-600' : 'text-amber-600'}">
            ${insp.syncedWithServer ? '☁️ Synced' : '💾 Local Queue'}
          </span>
        </div>
      </div>
    `).join('');
  }

  renderComplaintsList() {
    const container = document.getElementById('public-complaints-list');
    if (!container) return;

    container.innerHTML = this.complaints.map(comp => `
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-left">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ${comp.residentName.charAt(0)}
            </span>
            <div>
              <h5 class="text-xs font-bold text-slate-800">${comp.residentName}</h5>
              <span class="text-[10px] text-slate-400">${comp.submittedAt}</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            ${comp.statusLabel}
          </span>
        </div>
        <p class="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
          <b class="text-emerald-800">[${comp.marketName} — ${comp.suspectedCommodity}]:</b> "${comp.description}"
        </p>
        <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Lokasi: ${comp.stallDesc}</span>
          <span class="font-medium text-emerald-700">Ditangani: ${comp.assignedInspector}</span>
        </div>
      </div>
    `).join('');
  }

  renderAuditLogsTable() {
    const tbody = document.getElementById('audit-logs-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.auditLogs.slice(0, 10).map(log => `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50">
        <td class="p-2.5 font-mono text-slate-500">${log.timestamp}</td>
        <td class="p-2.5 font-semibold text-slate-800">${log.userName} <span class="text-[10px] text-slate-400 font-normal block">${log.role}</span></td>
        <td class="p-2.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${log.action.includes('POSITIVE') || log.action.includes('CITO') ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
            ${log.action}
          </span>
        </td>
        <td class="p-2.5 text-slate-700 truncate max-w-xs">${log.resource}</td>
        <td class="p-2.5 font-mono text-[10px] text-slate-400 truncate max-w-[100px]">${log.hashSha256 || 'SHA-256 Valid'}</td>
      </tr>
    `).join('');
  }

  renderCitoDashboardFeed() {
    const container = document.getElementById('cito-dashboard-live-feed');
    if (!container) return;

    const positiveInspections = this.inspections.filter(i => i.overallResult === 'POSITIF_RACUN');
    if (positiveInspections.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-xs text-emerald-700 bg-emerald-50 rounded-lg">✅ Tidak ada CITO Red Alert aktif hari ini. Seluruh komoditas aman.</div>`;
      return;
    }

    container.innerHTML = positiveInspections.map(item => `
      <div class="bg-rose-50 border-l-4 border-rose-600 p-3.5 rounded-r-lg shadow-sm flex items-start justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded uppercase tracking-wider">CITO ACTIVE</span>
            <h5 class="text-xs font-bold text-rose-900">${item.marketName} — ${item.stallNumber}</h5>
          </div>
          <p class="text-xs text-rose-800 mt-1">
            <b>${item.traderName}</b> menjual <b>${item.commodity}</b> dengan temuan:
            ${item.tests.formalin.status === 'POSITIF' ? `Formalin (${item.tests.formalin.ppm} ppm)` : ''}
            ${item.tests.boraks.status === 'POSITIF' ? `Boraks (${item.tests.boraks.ppm} ppm)` : ''}
          </p>
          <div class="text-[10px] text-rose-600 mt-1 font-mono">
            Terekam: ${item.timestamp} | Pengawas: ${item.inspectorName}
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <button onclick="window.sfsApp.openEnforcementModal('${item.id}')" class="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold shadow">
            Tindak Lanjut Sanksi
          </button>
        </div>
      </div>
    `).join('');
  }

  openEnforcementModal(inspId) {
    const insp = this.inspections.find(i => i.id === inspId);
    if (!insp) return;

    alert(
      `PENINDAKAN HUKUM BBPOM & DINAS KETAHANAN PANGAN PROV. LAMPUNG:\n\n` +
      `Nomor Sampel: ${insp.sampleCode}\n` +
      `Pedagang: ${insp.traderName} (${insp.marketName})\n` +
      `Temuan: Formalin ${insp.tests.formalin.ppm} ppm\n\n` +
      `Tindakan yang Diterbitkan:\n` +
      `1. Surat Perintah Sita Barang Bukti Nomor: SP-SITA/11/BBPOM/2026\n` +
      `2. Pembekuan Izin Lapak Digital Lapak Aman\n` +
      `3. Investigasi Sumber Distributor: CV Samudera Jaya Teluk Betung`
    );

    this.addAuditLog(
      "ADMIN_ENFORCEMENT_SANCTION",
      `Penerbitan sanksi penutupan lapak ${insp.traderName} di ${insp.marketName}`,
      "USR-ADMIN-01",
      "Dr. Ir. Fitria Hidayah, M.M"
    );
  }

  renderTraderPortalView() {
    const container = document.getElementById('trader-portal-card');
    if (!container) return;

    const trader = this.traders[0]; // Pedagang contoh
    container.innerHTML = `
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Kartu Digital Lapak Pedagang</span>
            <h3 class="text-xl font-bold text-slate-800">${trader.traderName}</h3>
            <p class="text-xs text-slate-500">${trader.marketName} — ${trader.stallNumber}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ${trader.statusBadge}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span class="text-xs text-slate-500 block">Skor Keamanan Pangan</span>
            <span class="text-3xl font-extrabold text-emerald-700">${trader.foodSafetyScore}</span>
            <span class="text-[10px] text-slate-400 block mt-0.5">Lolos Uji Formalin & Boraks</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span class="text-xs text-slate-500 block">Sertifikasi Rantai Pasok</span>
            <span class="text-sm font-bold text-slate-800 block mt-1">${trader.supplierName}</span>
            <span class="text-[10px] text-emerald-600 block mt-0.5">Tersertifikasi Higienis</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span class="text-xs text-slate-500 block">Sidak Terakhir</span>
            <span class="text-sm font-bold text-slate-800 block mt-1">${trader.lastInspectionDate.split(',')[0]}</span>
            <span class="text-[10px] text-slate-400 block mt-0.5">${trader.inspectorName.split(',')[0]}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <div class="text-left mb-3 sm:mb-0">
            <h5 class="text-sm font-bold text-emerald-900">QR Code Lapak Aman Pangan</h5>
            <p class="text-xs text-emerald-700">Cetak dan pajang di etalase lapak agar pembeli dapat memindai status keamanan secara transparan.</p>
          </div>
          <button onclick="window.sfsApp.openTraderQrModal('${trader.id}')" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5">
            <span>🖨️ Cetak Stiker QR Lapak</span>
          </button>
        </div>
      </div>
    `;
  }

  // --- Public QR Scanner Viewport Simulation ---
  simulateScanToken(token) {
    const input = document.getElementById('scanner-token-input');
    if (input) input.value = token;
    this.executeScanVerification();
  }

  executeScanVerification() {
    const token = document.getElementById('scanner-token-input')?.value.trim();
    const resultContainer = document.getElementById('scanner-result-container');
    if (!resultContainer) return;

    if (!token) {
      this.showToast("Masukkan token atau pilih simulasi scan!", "warning");
      return;
    }

    const trader = this.traders.find(t => t.qrCodeToken === token);
    resultContainer.classList.remove('hidden');

    if (trader) {
      const isClean = trader.status === 'VERIFIED_SAFE';
      resultContainer.innerHTML = `
        <div class="bg-white p-5 rounded-2xl shadow-lg border-2 ${isClean ? 'border-emerald-500' : 'border-rose-500'} text-left">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span class="text-[10px] font-mono text-slate-400">TOKEN: ${trader.qrCodeToken}</span>
              <h4 class="text-lg font-bold text-slate-800">${trader.stallNumber} — ${trader.traderName}</h4>
              <p class="text-xs text-slate-500">${trader.marketName} (${trader.categoryLabel})</p>
            </div>
            <div class="text-right">
              <span class="px-2.5 py-1 rounded-full text-xs font-extrabold ${isClean ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'}">
                ${trader.statusBadge}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 my-3">
            <div class="p-2.5 bg-slate-50 rounded-lg">
              <span class="text-[10px] text-slate-400 block">Skor Keamanan Pangan</span>
              <span class="text-2xl font-black ${isClean ? 'text-emerald-700' : 'text-rose-600'}">${trader.foodSafetyScore}/100</span>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg">
              <span class="text-[10px] text-slate-400 block">Sidak Terakhir</span>
              <span class="text-xs font-bold text-slate-700 block">${trader.lastInspectionDate}</span>
              <span class="text-[10px] text-slate-400">${trader.inspectorName}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs">
            <span class="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Hasil Pengujian Laboratorium/Kit:</span>
            <div class="flex justify-between"><span>Formalin:</span><b class="${trader.testResults.formalin.includes('POSITIF') ? 'text-rose-600' : 'text-emerald-600'}">${trader.testResults.formalin}</b></div>
            <div class="flex justify-between"><span>Boraks:</span><b class="${trader.testResults.boraks.includes('POSITIF') ? 'text-rose-600' : 'text-emerald-600'}">${trader.testResults.boraks}</b></div>
            <div class="flex justify-between"><span>Rhodamin B:</span><b>${trader.testResults.rhodaminB}</b></div>
            <div class="flex justify-between"><span>Metanil Yellow:</span><b>${trader.testResults.metanilYellow}</b></div>
            <div class="flex justify-between"><span>Pemasok Terdaftar:</span><b>${trader.supplierName}</b></div>
          </div>
        </div>
      `;
    } else {
      resultContainer.innerHTML = `
        <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-rose-700 text-xs">
          ⚠️ Token Lapak Tidak Valid atau Belum Terdaftar di Sistem Smart Food Safety Lampung.
        </div>
      `;
    }
  }

  // --- Audit Log Tracker ---
  addAuditLog(action, resource, userId, userName) {
    const newLog = {
      id: "LOG-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " +
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB",
      userId: userId,
      userName: userName,
      role: "System Actor",
      action: action,
      resource: resource,
      ipAddress: "180.252.88." + Math.floor(10 + Math.random() * 80) + " (Lampung Network)",
      hashSha256: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
    this.auditLogs.unshift(newLog);
    this.saveStorage();
  }

  resetInspectorForm() {
    this.currentCapturedImage = null;
    const preview = document.getElementById('captured-photo-preview');
    if (preview) preview.classList.add('hidden');
    const streamVideo = document.getElementById('camera-stream-video');
    if (streamVideo) streamVideo.classList.remove('hidden');
    const retakeBtn = document.getElementById('btn-retake-photo');
    if (retakeBtn) retakeBtn.classList.add('hidden');
    const captureBtn = document.getElementById('btn-capture-photo');
    if (captureBtn) captureBtn.classList.remove('hidden');

    const form = document.getElementById('inspector-sidak-form');
    if (form) form.reset();
  }

  showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: "bg-emerald-800 text-white border-emerald-600",
      warning: "bg-amber-800 text-white border-amber-600",
      info: "bg-slate-900 text-white border-slate-700",
      error: "bg-rose-900 text-white border-rose-600"
    };

    toast.className = `px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xl border flex items-center space-x-2 transition-all transform duration-300 opacity-0 translate-y-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `<span>🔔</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    }, 50);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.sfsApp = new SmartFoodSafetyApp();
  window.sfsApp.init();
});

