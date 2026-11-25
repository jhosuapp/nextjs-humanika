import { WHATSAPP_NUMBER } from "@/src/config/site";

/** WhatsApp deep link with a pre-filled demo request naming the source
 *  product, so the sales team knows which ficha the lead came from. */
const buildDemoWhatsappUrl = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export { buildDemoWhatsappUrl };
