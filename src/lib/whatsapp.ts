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

export function artworkWhatsappLink(artwork: Artwork, artworkUrl?: string): string {
  return whatsappLink(buildArtworkMessage(artwork, artworkUrl));
}
