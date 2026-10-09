# Product Requirements Document (PRD)
## Basecamp Lite — Platform Manajemen Acara Komunitas Anti-Ribet

---

### 1. Informasi Dokumen
| Atribut | Keterangan |
| :--- | :--- |
| **Nama Produk** | Basecamp Lite |
| **Versi Dokumen** | 1.0.0 (Release Draft) |
| **Status** | Approved / Ready for Development |
| **Target Rilis** | Q4 2026 / V1 Public Beta |
| **Target Platform** | Web App (Desktop & Mobile Responsive) |
| **Klasifikasi** | Internal Community Productivity Tool |

---

### 2. Ringkasan Eksekutif & Filosofi Produk
**Basecamp Lite** adalah platform manajemen acara berbasis web yang dirancang khusus untuk panitia komunitas mahasiswa, *developer circles* (misal: GDG on Campus, FOSS clubs), dan event teknologi non-korporat. 

Berbeda dengan platform enterprise (seperti Jira, Asana, atau ClickUp) yang memiliki kurva belajar curam dan birokrasi status yang kaku, Basecamp Lite mengedepankan filosofi:
1. **Zero Setup Friction:** Buat acara dan langsung bagikan tautan ruang kerja dalam < 1 menit.
2. **Context-Driven Clarity:** Memisahkan data operasional krusial (logistik, konsumsi, *run-down*) dari obrolan kasual yang biasanya tenggelam di grup WhatsApp/Discord.
3. **Casual Accountability:** Mengingatkan tugas secara santai tanpa menciptakan ketegangan sosial antar-panitia sebaya.

---

### 3. Problem Statement & Peluang Solusi

| Masalah Utama | Realitas di Lapangan | Solusi Basecamp Lite |
| :--- | :--- | :--- |
| **Chat Flood & Informasi Tenggelam** | Link Drive sertifikat, PIC konsumsi, dan status kabel HDMI tertimbun ratusan chat meme dan obrolan santai di WhatsApp. | **Quick Asset Hub** & **Dedicated Logistics Board** yang terisolasi dari ruang obrolan. |
| **Jira/Enterprise Fatigue** | Panitia malas mengupdate status tiket karena form terlalu rumit, workflow bertingkat, dan UI kaku. | Tampilan kasual bergaya *dark glassmorphism*, micro-interaction intuitif, dan aksi 1-klik. |
| **Kepanikan & "Ngaret" Hari-H** | Waktu molor tidak terprediksi; divisi acara bingung memotong sesi yang mana; panitia tidak tahu siapa yang bertugas saat masalah muncul. | **Live Run-down Sync** dengan *Dynamic Overtime Recalculator* & **Role Matrix**. |
| **Kecanggungan Menagih Tugas** | Sungkan mengejar progres teman sejawat di grup WA karena terkesan menggurui atau *bossy*. | **Task Nudge (Sistem Ping Kasual)** menggunakan animasi, stiker, dan preset meme interaktif. |

---

### 4. Target Pengguna (User Personas)

#### Persona 1: Rian (Project Officer / Ketua Pelaksana)
* **Karakter:** Mahasiswa tingkat 3, memimpin 25 panitia untuk *Tech Talk & Hackathon*.
* **Pain Point:** Stress memantau apakah semua divisi sudah jalan tanpa harus melakukan *micromanagement* atau spam di grup.
* **Kebutuhan:** Tampilan *dashboard* terpusat (bird-eye view) untuk memantau kelengkapan aset, logistik, dan jadwal.

#### Persona 2: Alya (Lead Konsumsi & Logistik)
* **Karakter:** Mengurus vendor katering, proyektor, kabel roll, dan merchandise pembicara.
* **Pain Point:** Sering disalahkan ketika pesanan terlambat, padahal status vendor belum jelas; barang pinjaman kampus rawan hilang.
* **Kebutuhan:** Papan inventaris khusus dengan penanda status penjemputan barang, nama peminjam, dan bukti foto barang.

#### Persona 3: Dimas (Stage Manager / Divisi Acara)
* **Karakter:** Berdiri di dekat operator panggung selama hari-H dengan headset/HT.
* **Pain Point:** Pemateri molor 15 menit, panitia lain masih memakai jadwal lama di PDF kertas yang sudah usang.
* **Kebutuhan:** Layar *run-down* interaktif yang otomatis tersinkronisasi di HP seluruh panitia saat durasi disesuaikan.

---

### 5. Arsitektur Teknis & Stack

```
+------------------------------------------------------------------+
|                            FRONTEND                              |
|  - Next.js (App Router, Server & Client Components)              |
|  - TypeScript (Strict Type Safety)                               |
|  - Styling: Tailwind CSS (Custom Dark Glassmorphic Tokens)       |
|  - State & UI: TanStack Query, Zustand, Lucide React, Framer Motion|
+------------------------------------------------------------------+
                                 │
                                 ▼
+------------------------------------------------------------------+
|                            BACKEND                               |
|  - Next.js Route Handlers / Server Actions                       |
|  - Prisma ORM (Type-safe schema management)                      |
|  - Auth: Supabase Auth / NextAuth (Magic Link & Discord OAuth)   |
+------------------------------------------------------------------+
                                 │
                                 ▼
+------------------------------------------------------------------+
|                   DATABASE & REALTIME LAYER                      |
|  - PostgreSQL (Supabase Hosted)                                  |
|  - Supabase Realtime (WebSocket pub/sub untuk Run-down & Nudges) |
|  - Storage: Supabase Storage (Bukti invoice & logistik ringan)   |
+------------------------------------------------------------------+
```

---

### 6. Desain Sistem & Antarmuka (UI/UX Guidelines)

* **Mode Tema:** Default Dark Theme murni dengan nuansa modern:
  * *Background Base:* `#0B0D13` (Deep Obsidian Void).
  * *Surface/Cards:* `rgba(22, 27, 38, 0.65)` dengan `backdrop-blur-md` dan garis tepi halus `border-white/10`.
  * *Aksen Utama:* Violet Glow (`#8B5CF6`) dan Electric Cyan (`#06B6D4`).
  * *Status Alerts:* Amber Pulse (`#F59E0B`) untuk *warning/ngaret*, Emerald Glow (`#10B981`) untuk *ready/on-track*, Rose Crimson (`#F43F5E`) untuk *SOS/blocker*.
* **Prinsip Interaksi:**
  * Responsif di layar *mobile* (prioritas tinggi untuk kepanitiaan di lapangan).
  * *Tap targets* besar ($\ge 44\text{ px}$) untuk memudahkan akses saat panitia sedang bergerak cepat di lokasi.
  * Haptic-like visual feedback dengan micro-animation (Framer Motion).

---

### 7. Fitur Utama & Spesifikasi Fungsional (V1 Scope)

#### 7.1. Workspace & Access Control
* **Public/Private Event Switcher:**
  * **Private Space:** Memerlukan login/undangan khusus panitia via link rahasia atau kode token 6 digit.
  * **Public Hub View:** Halaman read-only tanpa login untuk peserta umum/volunteer lepas. Menampilkan deskripsi acara, FAQ, rundown publik, dan denah ruangan.
* **Role & Divisi Tags:**
  * Tag siap pakai: *BPH (Ketua/Sekretaris/Bendahara), Acara, Logistik, Konsumsi, Humas/Medpar, PDD (Dokumentasi)*.
  * Kartu panitia instan: Klik nama panitia $\rightarrow$ langsung menampilkan nomor WhatsApp, tugas aktif, dan barang yang sedang dibawa.

#### 7.2. Real-Time Logistics & Catering Radar
* **Tiga Tab Pengawasan:**
  1. *Perlengkapan Fisik (Gear & Tools):* Mengawasi aset pinjaman kampus/sewaan vendor (misal: pointer, mic wireless, kabel HDMI). Dilengkapi kolom PIC peminjam dan tenggat pengembalian.
  2. *Konsumsi & Vendor:* Melacak status pesanan: `Belum Diambil` $\rightarrow$ `Sedang Menuju Lokasi` $\rightarrow$ `Tiba di Tempat` $\rightarrow$ `Dibagikan`.
  3. *Quick Verification:* Fitur unggah foto cepat via kamera HP sebagai bukti serah terima logistik.

#### 7.3. Live Run-down Sync & Stage Mode
* **"Now Playing" Broadcast Engine:**
  * Penanda sesi aktif dengan garis neon bergerak yang disinkronisasi ke seluruh layar panitia secara *real-time* via Supabase Realtime.
  * Sesi berikutnya ditandai dengan badge *Up Next*.
* **Dynamic Overtime Recalculator (Fitur Tambahan):**
  * Jika sesi pemateri molor ($+10$ menit), Stage Manager dapat mengklik tombol `+5m` atau `+10m`. Sistem otomatis menghitung ulang sisa jadwal ke bawah tanpa perlu mengedit run-down secara manual.
* **Stage Cue Sticky:**
  * Catatan teknis khusus per sesi (misal: *"Matikan lampu utama di menit ke-15 saat video teaser diputar"*).

#### 7.4. Task Nudge (Sistem Ping Kasual)
* **Koleksi Nudge Kasual:**
  * Tombol aksi cepat: `☕ Kopi Dulu Bos` (pengingat santai), `👀 Any Update?` (tanya progres), `🔥 Api Asap` (mendesak), dan meme reaction sticker.
* **Audit Trail Ringan:**
  * Menampilkan waktu kirim terakhir (misal: *"Dinudge oleh Rian 15 menit lalu"*), mencegah spam berlebihan dengan *cooldown timer* 10 menit per tugas.

#### 7.5. Quick Asset Hub & D-Day Pinned Board
* **Akses Tautan Sekali Klik:**
  * Papan pinned card berisi tautan: Folder Google Drive Desain, Sheet Presensi Peserta, Akun Zoom/Streamyard, Link Slido Tanya-Jawab, dan Akses Wi-Fi Lokasi (SSID & Password).
  * Tombol 1-klik `Copy to Clipboard` untuk memudahkan panitia menyalin teks pengumuman penting.

#### 7.6. Fitur Eksplorasi Baru (V1 Additions)
* **D-Day SOS Emergency Beacon:**
  * Tombol panik darurat untuk masalah mendesak di lapangan (misal: *"Kabel HDMI rusak di panggung utama"*, *"Token listrik bunyi"*).
  * Memunculkan banner merah mencolok di bagian atas aplikasi semua panitia dalam hitungan detik.
* **Post-Event Debrief & LPJ Snapshot:**
  * Begitu status acara diubah menjadi `Selesai`, sistem mengkompilasi ringkasan kegiatan: jumlah tugas selesai tepat waktu, daftar logistik yang berhasil dikembalikan, dan catatan evaluasi cepat.
  * Dapat diekspor menjadi dokumen Markdown/PDF untuk bahan Laporan Pertanggungjawaban (LPJ).

---

### 8. Skema Basis Data Konseptual (Prisma Schema Reference)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum RoleType {
  LEAD
  LOGISTICS
  CONSUMPTION
  STAGE_EVENT
  MEDIA_DOCS
  PUBLIC_RELATIONS
  VOLUNTEER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  BLOCKED
  DONE
}

enum ItemStatus {
  NOT_PICKED_UP
  ON_THE_WAY
  DELIVERED
  RETURNED
}

model Event {
  id          String         @id @default(uuid())
  slug        String         @unique
  title       String
  description String?
  isPublic    Boolean        @default(false)
  passcode    String?        // Akses privat instan
  date        DateTime
  location    String?
  wifiSSID    String?
  wifiPass    String?
  members     EventMember[]
  tasks       Task[]
  logistics   LogisticsItem[]
  rundowns    RundownItem[]
  assets      QuickAsset[]
  sosAlerts   SosAlert[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model EventMember {
  id        String      @id @default(uuid())
  eventId   String
  name      String
  phone     String?     // Integrasi direct link WhatsApp
  role      RoleType    @default(VOLUNTEER)
  customTag String?
  event     Event       @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tasks     Task[]
  logistics LogisticsItem[]
}

model Task {
  id          String      @id @default(uuid())
  eventId     String
  title       String
  assigneeId  String?
  status      TaskStatus  @default(TODO)
  deadline    DateTime?
  lastNudgeAt DateTime?
  event       Event       @relation(fields: [eventId], references: [id], onDelete: Cascade)
  assignee    EventMember? @relation(fields: [assigneeId], references: [id])
}

model LogisticsItem {
  id          String      @id @default(uuid())
  eventId     String
  name        String
  category    String      // e.g. "Konsumsi", "Elektronik", "Dekorasi"
  status      ItemStatus  @default(NOT_PICKED_UP)
  picId       String?
  vendorPhone String?
  photoProof  String?     // URL foto serah terima
  event       Event       @relation(fields: [eventId], references: [id], onDelete: Cascade)
  pic         EventMember? @relation(fields: [picId], references: [id])
}

model RundownItem {
  id          String   @id @default(uuid())
  eventId     String
  order       Int
  title       String
  speaker     String?
  startTime   DateTime
  endTime     DateTime
  cueNotes    String?
  isCurrent   Boolean  @default(false)
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

model QuickAsset {
  id          String   @id @default(uuid())
  eventId     String
  title       String
  url         String
  category    String   // e.g. "Drive", "Streaming", "Form", "Slides"
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

model SosAlert {
  id          String   @id @default(uuid())
  eventId     String
  message     String
  senderName  String
  isResolved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

---

### 9. Batasan & Out of Scope (Versi 1)

Untuk menjaga performa aplikasi tetap gesit dan fokus pada MVP (*Minimum Viable Product*), batasan berikut diberlakukan pada V1:
* **Tidak Ada Ticketing / Gate Pendaftaran:** Pendaftaran peserta tetap memanfaatkan platform eksternal seperti Google Form, Dicoding Event, atau Loket.
* **Tidak Ada Dompet Digital / Direct In-App Payment:** Tidak mengelola arus kas bank secara langsung (pencatatan struk cukup via link file/catatan teks).
* **Tidak Ada Built-in Chat Engine:** Menghindari beban infrastruktur WebSocket berat; komunikasi percakapan panjang tetap dialihkan ke WhatsApp dengan tautan sekali klik.
* **Tidak Ada Hierarki Tim Bertingkat (Multi-organization Hierarchy):** Struktur hak akses dibuat seragam agar tidak memunculkan birokrasi *approval* yang rumit.

---

### 10. Indikator Keberhasilan (Metrics & OKRs)

1. **Setup Velocity:** Waktu pembuatan acara dari form awal hingga membagikan link ruang kerja $\le 90\text{ detik}$.
2. **D-Day Engagement:** Minimal $80\%$ panitia aktif membuka platform selama hari pelaksanaan acara untuk memantau *run-down* dan logistik.
3. **Penyusutan Keterlambatan (*Zero-Ngaret*):** Menurunkan deviasi keterlambatan acara rata-rata menjadi $< 15\text{ menit}$ berkat *Live Run-down Sync*.
4. **Stress Reduction Rate:** Mengurangi pesan teks konfirmasi logistik berulang di grup WhatsApp hingga $\ge 60\%$.

---

### 11. Rencana Peluncuran & Roadmap Masa Depan

* **Fase 1 (Bulan 1 - 2): MVP Core**
  * Setup arsitektur Next.js, Prisma, dan Supabase.
  * Implementasi *Logistics Board*, *Quick Asset Hub*, dan autentikasi sederhana.
* **Fase 2 (Bulan 3): Realtime & D-Day Engine**
  * Integrasi Supabase Realtime untuk *Live Run-down Sync* dan *SOS Beacon*.
  * Implementasi sistem interaktif *Task Nudge*.
* **Fase 3 (Bulan 4): Uji Coba Komunitas & Iterasi**
  * Uji coba lapangan langsung pada 3 acara komunitas kampus partner.
  * Optimasi rendering performa mobile dan PWA (*Progressive Web App*).
* **Masa Depan (V2 Pipeline):**
  * Webhook bot notifikasi ke Discord & Telegram.
  * Fitur PWA *Offline-first caching* jika koneksi internet di venue bermasalah.