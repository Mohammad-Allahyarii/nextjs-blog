import type {
  UserAbilities,
  UserListItem,
} from "@/src/lib/types/user-management.types";

export const sampleUsers: UserListItem[] = [
  {
    id: "usr_01",
    name: "سارا احمدی",
    email: "sara.ahmadi@example.com",
    image: "https://i.pravatar.cc/160?img=47",
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2023-04-12T09:15:00.000Z",
  },
  {
    id: "usr_02",
    name: "محمد رضایی",
    email: "mohammad.rezaei@example.com",
    image: null,
    role: "editor",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2024-01-08T11:40:00.000Z",
  },
  {
    id: "usr_03",
    name: "نگار موسوی",
    email: "negar.mousavi@example.com",
    image: "https://i.pravatar.cc/160?img=32",
    role: "moderator",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2024-06-21T07:05:00.000Z",
  },
  {
    id: "usr_04",
    name: "امیرحسین کریمی",
    email: "amirhossein.karimi@example.com",
    image: null,
    role: "user",
    banned: true,
    banReason: "نقض مکرر قواعد نشر و بازنشر محتوای دیگران",
    banExpires: null,
    createdAt: "2024-09-02T16:25:00.000Z",
  },
  {
    id: "usr_05",
    name: "الهام شریفی",
    email: "elham.sharifi@example.com",
    image: null,
    role: "user",
    banned: true,
    banReason: "ارسال نظرهای توهین‌آمیز در بخش دیدگاه‌ها",
    banExpires: "2026-12-01T10:00:00.000Z",
    createdAt: "2025-02-17T13:50:00.000Z",
  },
  {
    id: "usr_06",
    name: "رضا نیک‌پور",
    email: "reza.nikpour@example.com",
    image: "https://i.pravatar.cc/160?img=12",
    role: "editor",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2023-11-30T08:10:00.000Z",
  },
  {
    id: "usr_07",
    name: "مریم حسینی",
    email: "maryam.hosseini@example.com",
    image: null,
    role: "moderator",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2025-07-05T18:30:00.000Z",
  },
  {
    id: "usr_08",
    name: "کاوه صادقی",
    email: "kaveh.sadeghi@example.com",
    image: null,
    role: "user",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: "2025-10-14T06:45:00.000Z",
  },
];

export const ADMIN_ABILITIES: UserAbilities = {
  canView: true,
  canBan: true,
  canSetRole: true,
  canRevokeSessions: true,
};

export const MODERATOR_ABILITIES: UserAbilities = {
  canView: true,
  canBan: false,
  canSetRole: false,
  canRevokeSessions: false,
};

export const EDITOR_ABILITIES: UserAbilities = {
  canView: false,
  canBan: false,
  canSetRole: false,
  canRevokeSessions: false,
};

export const USER_ABILITIES: UserAbilities = {
  canView: false,
  canBan: false,
  canSetRole: false,
  canRevokeSessions: false,
};
