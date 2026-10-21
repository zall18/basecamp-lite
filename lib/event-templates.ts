import { EventData, RoleType } from "@/types";

export type EventTemplateType = "workshop" | "hackathon" | "gathering" | "blank";

export interface CreateEventOptions {
  title: string;
  slug?: string;
  description?: string;
  date: string;
  location?: string;
  wifiSSID?: string;
  wifiPass?: string;
  passcode: string;
  creatorName: string;
  creatorPhone?: string;
  template: EventTemplateType;
}

export function buildEventFromTemplate(options: CreateEventOptions): EventData {
  const eventId = `evt-${Date.now()}`;
  const slug =
    options.slug ||
    options.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") ||
    "acara-baru";

  const baseDate = new Date(options.date || new Date().toISOString());
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  // Helper to make date at specific hour and minute
  const makeTime = (hour: number, minute: number) => {
    const d = new Date(year, month, day, hour, minute, 0, 0);
    return d.toISOString();
  };

  const creatorMember = {
    id: `mbr-${Date.now()}-lead`,
    eventId,
    name: options.creatorName.trim() || "Ketua Pelaksana",
    phone: options.creatorPhone?.trim() || "",
    role: "LEAD" as RoleType,
    customTag: "Project Leader",
  };

  if (options.template === "blank") {
    return {
      id: eventId,
      slug,
      title: options.title.trim(),
      description: options.description?.trim() || "Basecamp operasional hari-H acara.",
      isPublic: true,
      passcode: options.passcode.trim() || "260426",
      date: baseDate.toISOString(),
      location: options.location?.trim() || "Venue Acara",
      wifiSSID: options.wifiSSID?.trim() || null,
      wifiPass: options.wifiPass?.trim() || null,
      members: [creatorMember],
      tasks: [],
      logistics: [],
      rundowns: [],
      assets: [],
      sosAlerts: [],
      faqs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (options.template === "workshop") {
    const stageMember = {
      id: `mbr-${Date.now()}-stage`,
      eventId,
      name: "Tim Acara",
      phone: "+6281200001111",
      role: "STAGE_EVENT" as RoleType,
      customTag: "Stage Manager & MC",
    };
    const logMember = {
      id: `mbr-${Date.now()}-log`,
      eventId,
      name: "Tim Logistik",
      phone: "+6281200002222",
      role: "LOGISTICS" as RoleType,
      customTag: "Alat & Perlengkapan",
    };
    const konsumsiMember = {
      id: `mbr-${Date.now()}-cons`,
      eventId,
      name: "Tim Konsumsi",
      phone: "+6281200003333",
      role: "CONSUMPTION" as RoleType,
      customTag: "Katering & Snack",
    };

    return {
      id: eventId,
      slug,
      title: options.title.trim(),
      description:
        options.description?.trim() ||
        "Workshop interaktif & hands-on untuk peserta dan komunitas.",
      isPublic: true,
      passcode: options.passcode.trim() || "260426",
      date: baseDate.toISOString(),
      location: options.location?.trim() || "Auditorium Utama / Ruang Lab",
      wifiSSID: options.wifiSSID?.trim() || "Workshop-Guest-Wi-Fi",
      wifiPass: options.wifiPass?.trim() || "BelajarBareng2026",
      members: [creatorMember, stageMember, logMember, konsumsiMember],
      rundowns: [
        {
          id: `rd-${Date.now()}-1`,
          eventId,
          order: 1,
          title: "Registrasi Peserta & Morning Coffee",
          speaker: "Panitia Front-Desk",
          startTime: makeTime(8, 30),
          endTime: makeTime(9, 0),
          cueNotes: "Buka meja presensi, putar background music lofi santai.",
          isCurrent: true,
        },
        {
          id: `rd-${Date.now()}-2`,
          eventId,
          order: 2,
          title: "Opening MC & Sambutan Ketua Panitia",
          speaker: "MC & Project Officer",
          startTime: makeTime(9, 0),
          endTime: makeTime(9, 20),
          cueNotes: "Mic wireless MC on, siapkan slide sambutan.",
          isCurrent: false,
        },
        {
          id: `rd-${Date.now()}-3`,
          eventId,
          order: 3,
          title: "Sesi Materi 1: Teori & Best Practices",
          speaker: "Keynote Speaker",
          startTime: makeTime(9, 20),
          endTime: makeTime(10, 30),
          cueNotes: "Proyektor HDMI siap, timer pemateri standby di layar depan.",
          isCurrent: false,
        },
        {
          id: `rd-${Date.now()}-4`,
          eventId,
          order: 4,
          title: "Hands-on Workshop & Live Coding",
          speaker: "Instruktur & Mentor",
          startTime: makeTime(10, 30),
          endTime: makeTime(11, 45),
          cueNotes: "Pastikan Wi-Fi peserta lancar, volunteer keliling bantu yang error.",
          isCurrent: false,
        },
        {
          id: `rd-${Date.now()}-5`,
          eventId,
          order: 5,
          title: "Q&A, Doorprize & Foto Bersama",
          speaker: "MC & Seluruh Peserta",
          startTime: makeTime(11, 45),
          endTime: makeTime(12, 15),
          cueNotes: "Siapkan plakat pembicara & link form feedback e-sertifikat.",
          isCurrent: false,
        },
      ],
      logistics: [
        {
          id: `log-${Date.now()}-1`,
          eventId,
          name: "Proyektor HDMI & Kabel Konverter Type-C",
          category: "Elektronik / Alat",
          status: "DELIVERED",
          vendorPhone: "+6281200002222",
        },
        {
          id: `log-${Date.now()}-2`,
          eventId,
          name: "2 Mic Wireless & Sound Panggung",
          category: "Pinjaman Kampus",
          status: "DELIVERED",
          vendorPhone: "+6281200002222",
        },
        {
          id: `log-${Date.now()}-3`,
          eventId,
          name: "Snack Box & Kopi Peserta (100 Box)",
          category: "Konsumsi",
          status: "ON_THE_WAY",
          vendorPhone: "+6281399998888",
        },
        {
          id: `log-${Date.now()}-4`,
          eventId,
          name: "Plakat Akrilik Pembicara & Goodie Bag",
          category: "Perlengkapan",
          status: "DELIVERED",
          vendorPhone: "+6281200002222",
        },
      ],
      tasks: [
        {
          id: `tsk-${Date.now()}-1`,
          eventId,
          title: "Cek koneksi proyektor & mic wireless di panggung",
          status: "DONE",
          assigneeId: stageMember.id,
        },
        {
          id: `tsk-${Date.now()}-2`,
          eventId,
          title: "Standby di meja registrasi untuk QR code presensi",
          status: "IN_PROGRESS",
          assigneeId: creatorMember.id,
        },
        {
          id: `tsk-${Date.now()}-3`,
          eventId,
          title: "Konfirmasi kedatangan driver snack box katering",
          status: "IN_PROGRESS",
          assigneeId: konsumsiMember.id,
        },
        {
          id: `tsk-${Date.now()}-4`,
          eventId,
          title: "Sambut pembicara di lobby dan antarkan ke ruang transit",
          status: "TODO",
          assigneeId: stageMember.id,
        },
      ],
      assets: [
        {
          id: `ast-${Date.now()}-1`,
          eventId,
          title: "Google Drive Modul Workshop",
          url: "https://drive.google.com",
          category: "Drive & File",
        },
        {
          id: `ast-${Date.now()}-2`,
          eventId,
          title: "Room Slido Q&A Peserta",
          url: "https://slido.com",
          category: "Interaktif",
        },
        {
          id: `ast-${Date.now()}-3`,
          eventId,
          title: "Form Klaim E-Sertifikat Peserta",
          url: "https://forms.google.com",
          category: "Formulir",
        },
      ],
      sosAlerts: [],
      faqs: [
        {
          id: `faq-${Date.now()}-1`,
          question: "Apakah peserta wajib membawa laptop sendiri?",
          answer: "Ya, karena sesi hands-on praktikal memerlukan laptop dan text editor masing-masing.",
          order: 1,
        },
        {
          id: `faq-${Date.now()}-2`,
          question: "Kapan sertifikat kehadiran dibagikan?",
          answer: "Sertifikat digital akan dikirimkan via email maksimal H+2 setelah mengisi form feedback.",
          order: 2,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (options.template === "gathering") {
    const stageMember = {
      id: `mbr-${Date.now()}-stage`,
      eventId,
      name: "Tim Acara & Games",
      phone: "+6281200001111",
      role: "STAGE_EVENT" as RoleType,
      customTag: "Fun Master & MC",
    };
    const konsumsiMember = {
      id: `mbr-${Date.now()}-cons`,
      eventId,
      name: "Tim Konsumsi",
      phone: "+6281200003333",
      role: "CONSUMPTION" as RoleType,
      customTag: "Katering Makan Siang",
    };

    return {
      id: eventId,
      slug,
      title: options.title.trim(),
      description:
        options.description?.trim() ||
        "Gathering keakraban, rapat kerja, dan perayaan milestones komunitas.",
      isPublic: true,
      passcode: options.passcode.trim() || "260426",
      date: baseDate.toISOString(),
      location: options.location?.trim() || "Ruang Komunal / Kafe / Outdoor Area",
      wifiSSID: options.wifiSSID?.trim() || null,
      wifiPass: options.wifiPass?.trim() || null,
      members: [creatorMember, stageMember, konsumsiMember],
      rundowns: [
        {
          id: `rd-${Date.now()}-1`,
          eventId,
          order: 1,
          title: "Check-in Santai & Ice Breaking Games",
          speaker: "Fun Master MC",
          startTime: makeTime(10, 0),
          endTime: makeTime(10, 45),
          cueNotes: "Mulai games interaktif ringan untuk mencairkan suasana.",
          isCurrent: true,
        },
        {
          id: `rd-${Date.now()}-2`,
          eventId,
          order: 2,
          title: "Evaluasi & Kilas Balik Pencapaian Tim",
          speaker: "Ketua & Pengurus",
          startTime: makeTime(10, 45),
          endTime: makeTime(11, 45),
          cueNotes: "Tampilkan video rewind / slide foto kegiatan setahun terakhir.",
          isCurrent: false,
        },
        {
          id: `rd-${Date.now()}-3`,
          eventId,
          order: 3,
          title: "Makan Siang Bersama & Networking",
          speaker: "Seluruh Anggota",
          startTime: makeTime(11, 45),
          endTime: makeTime(13, 0),
          cueNotes: "Buka prasmanan / bagikan lunch box, putar playlist lagu komunitas.",
          isCurrent: false,
        },
        {
          id: `rd-${Date.now()}-4`,
          eventId,
          order: 4,
          title: "Rencana Strategis & Tukar Kado / Doorprize",
          speaker: "MC & Anggota",
          startTime: makeTime(13, 0),
          endTime: makeTime(14, 30),
          cueNotes: "Undian doorprize dan foto bersama seluruh panitia.",
          isCurrent: false,
        },
      ],
      logistics: [
        {
          id: `log-${Date.now()}-1`,
          eventId,
          name: "Sound System Portable & 2 Mic",
          category: "Elektronik / Alat",
          status: "DELIVERED",
          vendorPhone: "+6281200001111",
        },
        {
          id: `log-${Date.now()}-2`,
          eventId,
          name: "Prasmanan Katering Makan Siang (50 Porsi)",
          category: "Konsumsi",
          status: "ON_THE_WAY",
          vendorPhone: "+6281399998888",
        },
        {
          id: `log-${Date.now()}-3`,
          eventId,
          name: "Hadiah Doorprize & Papan Flipchart",
          category: "Perlengkapan",
          status: "DELIVERED",
          vendorPhone: "+6281200001111",
        },
      ],
      tasks: [
        {
          id: `tsk-${Date.now()}-1`,
          eventId,
          title: "Set playlist Spotify lagu santai di speaker bluetooth",
          status: "DONE",
          assigneeId: stageMember.id,
        },
        {
          id: `tsk-${Date.now()}-2`,
          eventId,
          title: "Pastikan meja katering makan siang tertata rapi",
          status: "IN_PROGRESS",
          assigneeId: konsumsiMember.id,
        },
        {
          id: `tsk-${Date.now()}-3`,
          eventId,
          title: "Kumpulkan kado silang / doorprize di meja depan",
          status: "TODO",
          assigneeId: creatorMember.id,
        },
      ],
      assets: [
        {
          id: `ast-${Date.now()}-1`,
          eventId,
          title: "Notulensi & Ide Program Kerja",
          url: "https://docs.google.com",
          category: "Dokumen",
        },
      ],
      sosAlerts: [],
      faqs: [
        {
          id: `faq-${Date.now()}-1`,
          question: "Apakah ada dresscode khusus untuk acara gathering?",
          answer: "Dresscode casual / bebas rapi atau memakai jaket/kaos angkatan komunitas.",
          order: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Default fallback: Hackathon / Competition
  return {
    id: eventId,
    slug,
    title: options.title.trim(),
    description:
      options.description?.trim() ||
      "Kompetisi hackathon intensif memecahkan tantangan dengan inovasi teknologi.",
    isPublic: true,
    passcode: options.passcode.trim() || "260426",
    date: baseDate.toISOString(),
    location: options.location?.trim() || "Gedung Riset & Inovasi",
    wifiSSID: options.wifiSSID?.trim() || "Hackathon-Ultra-5G",
    wifiPass: options.wifiPass?.trim() || "HackathonSuperCepat2026",
    members: [creatorMember],
    rundowns: [
      {
        id: `rd-${Date.now()}-1`,
        eventId,
        order: 1,
        title: "Check-in Tim & Technical Briefing",
        speaker: "Lead Panitia",
        startTime: makeTime(8, 0),
        endTime: makeTime(9, 0),
        cueNotes: "Cek colokan listrik setiap meja dan koneksi Wi-Fi tim.",
        isCurrent: true,
      },
      {
        id: `rd-${Date.now()}-2`,
        eventId,
        order: 2,
        title: "Hacking Kickoff & Sprint 1",
        speaker: "Semua Tim Peserta",
        startTime: makeTime(9, 0),
        endTime: makeTime(12, 0),
        cueNotes: "Timer hitung mundur hacking dimulai di layar proyektor.",
        isCurrent: false,
      },
      {
        id: `rd-${Date.now()}-3`,
        eventId,
        order: 3,
        title: "Sesi Mentoring 1-on-1 dengan Expert",
        speaker: "Mentor Industri & Tim",
        startTime: makeTime(13, 0),
        endTime: makeTime(15, 0),
        cueNotes: "Time keeper beri tanda lonceng per 15 menit pergantian mentor.",
        isCurrent: false,
      },
      {
        id: `rd-${Date.now()}-4`,
        eventId,
        order: 4,
        title: "Batas Akhir Submission Project (Code Freeze)",
        speaker: "Panitia Juri",
        startTime: makeTime(16, 0),
        endTime: makeTime(16, 30),
        cueNotes: "Kunci akses form repositori GitHub tepat waktu.",
        isCurrent: false,
      },
      {
        id: `rd-${Date.now()}-5`,
        eventId,
        order: 5,
        title: "Final Demo Pitching & Awarding",
        speaker: "Top 5 Tim & Dewan Juri",
        startTime: makeTime(16, 30),
        endTime: makeTime(18, 0),
        cueNotes: "Siapkan mic wireless untuk tanya jawab juri.",
        isCurrent: false,
      },
    ],
    logistics: [
      {
        id: `log-${Date.now()}-1`,
        eventId,
        name: "Terminal Colokan Listrik Kabel Panjang (15 Unit)",
        category: "Elektronik / Alat",
        status: "DELIVERED",
        vendorPhone: "+6281200001111",
      },
      {
        id: `log-${Date.now()}-2`,
        eventId,
        name: "Router Wi-Fi Backup 5G",
        category: "Elektronik / Alat",
        status: "DELIVERED",
        vendorPhone: "+6281200001111",
      },
      {
        id: `log-${Date.now()}-3`,
        eventId,
        name: "Snack & Kopi Malam Peserta",
        category: "Konsumsi",
        status: "NOT_PICKED_UP",
        vendorPhone: "+6281399998888",
      },
    ],
    tasks: [
      {
        id: `tsk-${Date.now()}-1`,
        eventId,
        title: "Uji kecepatan Wi-Fi dan colokan listrik tiap meja",
        status: "DONE",
        assigneeId: creatorMember.id,
      },
      {
        id: `tsk-${Date.now()}-2`,
        eventId,
        title: "Briefing dewan juri terkait rubrik penilaian scoring",
        status: "TODO",
        assigneeId: creatorMember.id,
      },
    ],
    assets: [
      {
        id: `ast-${Date.now()}-1`,
        eventId,
        title: "Pedoman & Rubrik Penjurian",
        url: "https://docs.google.com",
        category: "Dokumen",
      },
      {
        id: `ast-${Date.now()}-2`,
        eventId,
        title: "Form Submission GitHub & Video",
        url: "https://forms.google.com",
        category: "Formulir",
      },
    ],
    sosAlerts: [],
    faqs: [
      {
        id: `faq-${Date.now()}-1`,
        question: "Apakah peserta boleh menggunakan boilerplate / open-source library?",
        answer: "Boleh! Namun baris kode inti produk harus dikembangkan selama masa kompetisi berlangsung.",
        order: 1,
      },
      {
        id: `faq-${Date.now()}-2`,
        question: "Berapa menit durasi pitching demo di hadapan juri?",
        answer: "Setiap tim top 5 mendapat alokasi 3 menit presentasi demo dan 2 menit sesi tanya jawab dewan juri.",
        order: 2,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
