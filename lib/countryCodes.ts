export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  nameAr: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // Primary Gulf / GCC
  { code: "OM", dialCode: "+968", name: "Oman", nameAr: "عُمان", flag: "🇴🇲" },
  { code: "AE", dialCode: "+971", name: "UAE", nameAr: "الإمارات", flag: "🇦🇪" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", nameAr: "السعودية", flag: "🇸🇦" },
  { code: "QA", dialCode: "+974", name: "Qatar", nameAr: "قطر", flag: "🇶🇦" },
  { code: "KW", dialCode: "+965", name: "Kuwait", nameAr: "الكويت", flag: "🇰🇼" },
  { code: "BH", dialCode: "+973", name: "Bahrain", nameAr: "البحرين", flag: "🇧🇭" },

  // Key International & Expat Markets
  { code: "GB", dialCode: "+44", name: "United Kingdom", nameAr: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "US", dialCode: "+1", name: "USA / Canada", nameAr: "أمريكا / كندا", flag: "🇺🇸" },
  { code: "IN", dialCode: "+91", name: "India", nameAr: "الهند", flag: "🇮🇳" },
  { code: "PK", dialCode: "+92", name: "Pakistan", nameAr: "باكستان", flag: "🇵🇰" },
  { code: "EG", dialCode: "+20", name: "Egypt", nameAr: "مصر", flag: "🇪🇬" },
  { code: "JO", dialCode: "+962", name: "Jordan", nameAr: "الأردن", flag: "🇯🇴" },
  { code: "LB", dialCode: "+961", name: "Lebanon", nameAr: "لبنان", flag: "🇱🇧" },
  { code: "TR", dialCode: "+90", name: "Turkey", nameAr: "تركيا", flag: "🇹🇷" },
  { code: "DE", dialCode: "+49", name: "Germany", nameAr: "ألمانيا", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", nameAr: "فرنسا", flag: "🇫🇷" },
  { code: "IT", dialCode: "+39", name: "Italy", nameAr: "إيطاليا", flag: "🇮🇹" },
  { code: "CH", dialCode: "+41", name: "Switzerland", nameAr: "سويسرا", flag: "🇨🇭" },
  { code: "NL", dialCode: "+31", name: "Netherlands", nameAr: "هولندا", flag: "🇳🇱" },
  { code: "ES", dialCode: "+34", name: "Spain", nameAr: "إسبانيا", flag: "🇪🇸" },
  { code: "RU", dialCode: "+7", name: "Russia", nameAr: "روسيا", flag: "🇷🇺" },
  { code: "CN", dialCode: "+86", name: "China", nameAr: "الصين", flag: "🇨🇳" },
  { code: "SG", dialCode: "+65", name: "Singapore", nameAr: "سنغافورة", flag: "🇸🇬" },
  { code: "MY", dialCode: "+60", name: "Malaysia", nameAr: "ماليزيا", flag: "🇲🇾" },
  { code: "AU", dialCode: "+61", name: "Australia", nameAr: "أستراليا", flag: "🇦🇺" },
  { code: "ZA", dialCode: "+27", name: "South Africa", nameAr: "جنوب أفريقيا", flag: "🇿🇦" },
];
