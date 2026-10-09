import { prisma } from "../lib/db";

async function main() {
  console.log("Seeding Supabase PostgreSQL with demo event data...");

  const existing = await prisma.event.findUnique({
    where: { slug: "tech-talk-hackathon-2026" },
  });

  if (existing) {
    console.log("Event already exists, skipping seed.");
    return;
  }

  const event = await prisma.event.create({
    data: {
      id: "evt-techtalk-2026",
      slug: "tech-talk-hackathon-2026",
      title: "Tech Talk & Hackathon 2026",
      description: "Platform kolaborasi panitia GDG & FOSS Club untuk memantau hari-H tanpa ribet dan bebas spam WA.",
      isPublic: true,
      passcode: "260426",
      date: new Date("2026-10-15T08:00:00.000Z"),
      location: "Auditorium Lantai 4, Gedung Riset & Inovasi",
      wifiSSID: "Auditorium-Event-5G",
      wifiPass: "HackathonKeren2026!",
      members: {
        create: [
          {
            id: "mbr-rian",
            name: "Rian (Lead)",
            phone: "+6281234567890",
            role: "LEAD",
            customTag: "Project Officer",
          },
          {
            id: "mbr-dimas",
            name: "Dimas",
            phone: "+6281355551234",
            role: "STAGE_EVENT",
            customTag: "Stage Manager",
          },
          {
            id: "mbr-alya",
            name: "Alya",
            phone: "+6281298765432",
            role: "LOGISTICS",
            customTag: "Lead Logistik & Katering",
          },
          {
            id: "mbr-nabila",
            name: "Nabila",
            phone: "+6281788889999",
            role: "MEDIA_DOCS",
            customTag: "PDD & Fotografer",
          },
          {
            id: "mbr-farhan",
            name: "Farhan",
            phone: "+6281900001111",
            role: "PUBLIC_RELATIONS",
            customTag: "Humas & Tamu VIP",
          },
        ],
      },
      rundowns: {
        create: [
          {
            id: "rd-1",
            order: 1,
            title: "Registrasi & Open Gate Peserta",
            speaker: "Tim BPH & Volunteer",
            startTime: new Date("2026-10-15T08:30:00.000Z"),
            endTime: new Date("2026-10-15T09:00:00.000Z"),
            cueNotes: "Pastikan barcode scanner dan lanyard siap di meja registrasi depan lift.",
            isCurrent: false,
          },
          {
            id: "rd-2",
            order: 2,
            title: "Opening Ceremony & Sambutan Ketua Pelaksana",
            speaker: "Rian (Lead) & MC",
            startTime: new Date("2026-10-15T09:00:00.000Z"),
            endTime: new Date("2026-10-15T09:15:00.000Z"),
            cueNotes: "Play video bumper opening saat MC menghitung mundur 3, 2, 1.",
            isCurrent: false,
          },
          {
            id: "rd-3",
            order: 3,
            title: "Keynote: Scalable Microservices with Event-Driven Architecture",
            speaker: "Dr. Irfan Pratama (Principal Architect)",
            startTime: new Date("2026-10-15T09:15:00.000Z"),
            endTime: new Date("2026-10-15T10:15:00.000Z"),
            cueNotes: "Matikan lampu utama di menit ke-15 saat presentasi demo arsitektur cloud dimulai. Mic wireless cadangan standby di meja operator.",
            isCurrent: true,
          },
          {
            id: "rd-4",
            order: 4,
            title: "Coffee Break & Networking Session",
            speaker: "Dipandu MC",
            startTime: new Date("2026-10-15T10:15:00.000Z"),
            endTime: new Date("2026-10-15T10:30:00.000Z"),
            cueNotes: "Tim konsumsi pastikan snack box VIP sudah tersaji di ruang narasumber.",
            isCurrent: false,
          },
          {
            id: "rd-5",
            order: 5,
            title: "Hackathon Sprint Kickoff: Problem Statement Release",
            speaker: "Tech Lead & Juri Hackathon",
            startTime: new Date("2026-10-15T10:30:00.000Z"),
            endTime: new Date("2026-10-15T12:30:00.000Z"),
            cueNotes: "Rilis link repository GitHub template ke Slido dan channel Discord.",
            isCurrent: false,
          },
        ],
      },
      logistics: {
        create: [
          {
            id: "log-1",
            name: "Pointer Presenter + Baterai Cadangan AAA",
            category: "Elektronik",
            status: "DELIVERED",
            picId: "mbr-alya",
            vendorPhone: "+6281298765432",
            photoProof: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "log-2",
            name: "Mic Wireless + Receiver 2 Set (Sound Rental Indo)",
            category: "Elektronik",
            status: "DELIVERED",
            picId: "mbr-dimas",
            vendorPhone: "+6281122334455",
            photoProof: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "log-3",
            name: "Snack Box VIP Pembicara (25 Kotak - Dapoer Bunda)",
            category: "Konsumsi",
            status: "ON_THE_WAY",
            picId: "mbr-alya",
            vendorPhone: "+6281277778888",
          },
          {
            id: "log-4",
            name: "Nasi Box Makan Siang Panitia & Peserta (120 Porsi)",
            category: "Konsumsi",
            status: "NOT_PICKED_UP",
            picId: "mbr-alya",
            vendorPhone: "+6281277778888",
          },
          {
            id: "log-5",
            name: "Kabel Roll 25 Meter & Kabel HDMI 15 Meter",
            category: "Elektronik",
            status: "DELIVERED",
            picId: "mbr-dimas",
          },
        ],
      },
      tasks: {
        create: [
          {
            id: "tsk-1",
            title: "Pastikan kabel roll cadangan tersambung di belakang panggung",
            assigneeId: "mbr-dimas",
            status: "DONE",
            deadline: new Date("2026-10-15T08:00:00.000Z"),
            lastNudgeAt: new Date("2026-10-15T07:30:00.000Z"),
          },
          {
            id: "tsk-2",
            title: "Briefing MC mengenai penyesuaian durasi keynote Dr. Irfan",
            assigneeId: "mbr-dimas",
            status: "IN_PROGRESS",
            deadline: new Date("2026-10-15T08:45:00.000Z"),
            lastNudgeAt: new Date("2026-10-15T08:15:00.000Z"),
          },
          {
            id: "tsk-3",
            title: "Konfirmasi estimasi kedatangan kurir Snack Box VIP",
            assigneeId: "mbr-alya",
            status: "IN_PROGRESS",
            deadline: new Date("2026-10-15T09:30:00.000Z"),
          },
          {
            id: "tsk-4",
            title: "Kirim teaser foto opening speech ke Instagram Story & Twitter",
            assigneeId: "mbr-nabila",
            status: "TODO",
            deadline: new Date("2026-10-15T09:15:00.000Z"),
          },
        ],
      },
      assets: {
        create: [
          {
            id: "ast-1",
            title: "Folder Google Drive Desain, Backdrop & Sertifikat",
            url: "https://drive.google.com",
            category: "Drive",
          },
          {
            id: "ast-2",
            title: "Sheet Presensi & Check-in Peserta Hari-H",
            url: "https://docs.google.com/spreadsheets",
            category: "Form",
          },
          {
            id: "ast-3",
            title: "Room Tanya-Jawab Slido (#TECHO26)",
            url: "https://app.sli.do",
            category: "Slides",
          },
          {
            id: "ast-4",
            title: "Studio Streaming Operator YouTube",
            url: "https://studio.youtube.com",
            category: "Streaming",
          },
        ],
      },
      sosAlerts: {
        create: [
          {
            id: "sos-1",
            message: "Kabel HDMI panggung kedip-kedip saat layar laptop narasumber resolusi 4K! Butuh kabel pengganti segera dari divisi logistik.",
            senderName: "Dimas (Stage Manager)",
            isResolved: false,
            createdAt: new Date("2026-10-15T09:20:00.000Z"),
          },
        ],
      },
    },
  });

  console.log("Seeding complete! Event created:", event.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
