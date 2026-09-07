import { customAlphabet } from "nanoid";

// Alphabet without ambiguous characters (0/O, 1/I) so codes are easy to read aloud/retype.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generate = customAlphabet(ALPHABET, 8);

export function generateTrackingCode(): string {
  return `LOG-${generate()}`;
}
