import { Gender, Language } from "@/types/user";

export const AVAILABLE_GENDERS: Gender[] = [
  { value: "boy", emoji: "🧑🏻‍🦱", label: "Boy" },
  { value: "girl", emoji: "👩🏻", label: "Girl" },
];

export const AVAILABLE_GRADES = [1, 2, 3, 4, 5, 6];

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ru", name: "Russian", nativeName: "русский", flag: "🇷🇺" },
  { code: "ky", name: "Kyrgyz", nativeName: "кыргыз", flag: "🇰🇬" },
  { code: "uz", name: "Uzbek", nativeName: "oʻzbek", flag: "🇺🇿" },
  { code: "kk", name: "Kazakh", nativeName: "қазақ", flag: "🇰🇿" },
];

export const AVAILABLE_AVATARS: Record<string, string[]> = {
  boy: [
    "🏈",
    "🏀",
    "⚽",
    "🏎️",
    "🏏",
    "🏒",
    "🥊",
    "🏆", // Sports
    "🚗",
    "🚕",
    "🚙",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚜",
    "🚚",
    "🚁",
    "🚀",
    "🚤",
    "🚂",
    "🛸", // Vehicles
    "🦖",
    "🦕",
    "🐍",
    "🐉",
    "🦅",
    "🦈",
    "🦍",
    "🐅", // Animals/Dinos
    "🤖",
    "⚡",
    "💥",
    "🚨",
    "🛡️",
    "🕹️",
    "🦾", // Tech/Action
    "🏰",
    "🏜️",
    "🏝️",
    "🏞️",
    "⛺", // Adventure/Misc
  ],
  girl: [
    "🦄",
    "🦋",
    "🐱",
    "🐰",
    "🐶",
    "🦜",
    "🐥",
    "🦩",
    "🦚",
    "🐼",
    "🦦",
    "🐨", // Animals
    "🧚‍♀️",
    "🧜‍♀️",
    "🧝‍♀️",
    "🧞‍♀️",
    "👸",
    "🏰", // Fantasy/Princess
    "🎨",
    "🎀",
    "💄",
    "🩰",
    "🎤",
    "🎼",
    "🎹",
    "🎻", // Arts & Fun
    "🌸",
    "🌷",
    "🌼",
    "🌺",
    "🌹",
    "🌻",
    "🍄",
    "🍓",
    "🍉",
    "🌈", // Nature
    "💖",
    "💗",
    "💜",
    "💙",
    "💚",
    "💛",
    "💝",
    "💎",
    "🌟",
    "✨",
    "🧁",
    "🍦", // Hearts/Misc
  ],
};
