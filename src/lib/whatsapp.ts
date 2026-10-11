import { SITE } from "./site";
import type { Artwork } from "./types";

/**
 * Builds the canonical collector enquiry message for a specific piece.
 * Kept in one place so the card, the lightbox and the admin preview all
 * produce an identical, cleanly-encoded payload.
 */
export function buildArtworkMessage(artwork: Artwork, artworkUrl?: string): string {
  const url = artworkUrl ?? `${SITE.url}/works/${artwork.id}`;
  const parts = [
    `Greetings Muhsingraphy, I would like to inquire about acquiring the piece:`,
    `'${artwork.title}'`,
    `| Script: ${artwork.script_style}`,
    `| Medium: ${artwork.medium}`,
    `| Dimensions: ${artwork.dimensions}`,
    `| Ref ID: #${artwork.id}`,
    `View: ${url}`,
  ];
  return parts.join(" ");
}

export function buildGeneralMessage(topic = "a private commission"): string {
  return `Greetings Muhsingraphy, I would like to inquire about ${topic}.`;
}

export function whatsappLink(message: string, phone: string = SITE.whatsappNumber): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp for a bare phone number with no pre-filled message.
 * Used where the number is the affordance itself (e.g. the footer credit).
 */
export function whatsappPhoneLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

export function artworkWhatsappLink(artwork: Artwork, artworkUrl?: string, phone?: string): string {
  return whatsappLink(buildArtworkMessage(artwork, artworkUrl), phone ?? SITE.whatsappNumber);
}
