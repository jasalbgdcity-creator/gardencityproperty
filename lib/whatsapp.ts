/**
 * Centralized WhatsApp Configuration & Link Generation for Garden City Properties.
 *
 * Official verified business phone: +968 97300200 (international format: 96897300200)
 * Verified business shortlink: https://wa.me/message/BACRFFVZ3LOXH1
 *
 * Uses the official click-to-chat format: https://wa.me/{phone}?text={encoded_message}
 * which reliably delivers custom pre-filled inquiry messages on both mobile and desktop.
 */

export const DEFAULT_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "96897300200";

export const DEFAULT_WHATSAPP_SHORTLINK = "https://wa.me/message/BACRFFVZ3LOXH1";

/**
 * Normalizes phone number into international digits-only format for wa.me links.
 */
export function normalizeWhatsAppNumber(rawPhone?: string): string {
  if (!rawPhone) return DEFAULT_WHATSAPP_PHONE;
  const digits = rawPhone.replace(/[^0-9]/g, "");
  return digits || DEFAULT_WHATSAPP_PHONE;
}

/**
 * Builds a reliable wa.me URL with clean URL encoding.
 */
export function buildWhatsAppLink(message: string, customPhone?: string): string {
  const phone = normalizeWhatsAppNumber(customPhone);
  if (!phone) {
    return DEFAULT_WHATSAPP_SHORTLINK;
  }
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * General inquiry message across header, nav, floating button, and footer.
 */
export function getGeneralWhatsAppUrl(
  optionsOrLocale?:
    | "en"
    | "ar"
    | {
        locale?: "en" | "ar";
        message?: string;
        phone?: string;
        whatsapp_number?: string;
        whatsappNumber?: string;
      },
): string {
  const customPhone =
    typeof optionsOrLocale === "object"
      ? optionsOrLocale.whatsapp_number ||
        optionsOrLocale.whatsappNumber ||
        optionsOrLocale.phone
      : undefined;

  if (typeof optionsOrLocale === "object" && optionsOrLocale?.message) {
    return buildWhatsAppLink(optionsOrLocale.message, customPhone);
  }
  const isAr =
    optionsOrLocale === "ar" ||
    (typeof optionsOrLocale === "object" && optionsOrLocale?.locale === "ar");
  const message = isAr
    ? "مرحباً جاردن سيتي بروبرتيز، أود معرفة المزيد عن خدماتكم والفرص الاستثمارية العقارية المتاحة في سلطنة عمان."
    : "Hello Garden City Properties, I would like to know more about your properties and available investment opportunities.";

  return buildWhatsAppLink(message, customPhone);
}

/**
 * Project-level inquiry message for showcase cards and project hero/action bars.
 */
export function getProjectWhatsAppUrl(params: {
  projectName: string;
  location?: string;
  price?: string;
  startingPrice?: string;
  developer?: string;
  locale?: "en" | "ar";
  language?: "en" | "ar";
  phone?: string;
  whatsapp_number?: string;
  whatsappNumber?: string;
}): string {
  const isAr = params.locale === "ar" || params.language === "ar";
  const { projectName, location, developer } = params;
  const price = params.price || params.startingPrice;
  const targetPhone =
    params.whatsapp_number || params.whatsappNumber || params.phone;

  let message = "";
  if (isAr) {
    message = `مرحباً جاردن سيتي بروبرتيز،

أود الاستفسار عن تفاصيل مشروع "${projectName}".
${location ? `الموقع: ${location}\n` : ""}${price ? `السعر الابتدائي: ${price}\n` : ""}${developer ? `المطور: ${developer}\n` : ""}
يرجى تزويدي بالكتيب التعريفي وقائمة الوحدات المتاحة وخطط السداد.`;
  } else {
    message = `Hello Garden City Properties,

I am interested in ${projectName}.
${location ? `Location: ${location}\n` : ""}${price ? `Starting Price: ${price}\n` : ""}${developer ? `Developer: ${developer}\n` : ""}
Please share more details regarding availability, brochure and payment plans.`;
  }

  return buildWhatsAppLink(message, targetPhone);
}

/**
 * Specific property configuration inquiry message.
 * Triggered when a visitor clicks "Enquire on WhatsApp" on an apartment, villa, townhouse, etc.
 */
export function getConfigurationWhatsAppUrl(params: {
  projectName: string;
  propertyType?: string;
  configurationName: string;
  price?: string;
  area?: string;
  bua?: string | number;
  bedrooms?: number | string;
  locale?: "en" | "ar";
  language?: "en" | "ar";
  phone?: string;
  whatsapp_number?: string;
  whatsappNumber?: string;
}): string {
  const isAr = params.locale === "ar" || params.language === "ar";
  const { projectName, configurationName, price } = params;
  const propertyType = params.propertyType || (isAr ? "نموذج الوحدة" : "Unit");
  const area = params.area || (params.bua ? `${params.bua} sqm` : undefined);
  const bedrooms = params.bedrooms;
  const targetPhone =
    params.whatsapp_number || params.whatsappNumber || params.phone;

  let message = "";
  if (isAr) {
    message = `مرحباً جاردن سيتي بروبرتيز،

أود الاستفسار عن مشروع "${projectName}".

نوع العقار: ${propertyType}
النموذج: ${configurationName}
${price ? `السعر: ${price}\n` : ""}${area ? `المساحة: ${area}\n` : ""}${bedrooms !== undefined ? `عدد الغرف: ${Number(bedrooms) === 0 ? "استوديو" : bedrooms}\n` : ""}
يرجى مشاركة تفاصيل التوافر وخطط السداد وإجراءات الحجز.`;
  } else {
    message = `Hello Garden City Properties,

I am interested in ${projectName}.

Property type: ${propertyType}
Configuration: ${configurationName}
${price ? `Price: ${price}\n` : ""}${area ? `Area: ${area}\n` : ""}${bedrooms !== undefined ? `Bedrooms: ${Number(bedrooms) === 0 ? "Studio" : bedrooms}\n` : ""}
Please share more details about availability, payment plans and booking.`;
  }

  return buildWhatsAppLink(message, targetPhone);
}
