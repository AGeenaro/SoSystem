import { randomBytes } from "node:crypto";

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SPECIAL = "!@#$%&*";

export const PASSWORD_HINT = "A senha precisa ter 8 caracteres, uma maiúscula, um número e um caractere especial.";

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
    && password.length <= 72
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

export function generateProvisionalPassword(): string {
  const bytes = randomBytes(12);
  const pick = (alphabet: string, index: number) => alphabet[bytes[index] % alphabet.length];
  const chars = [pick(UPPER, 0), pick(LOWER, 1), pick(DIGITS, 2), pick(SPECIAL, 3)];
  const all = UPPER + LOWER + DIGITS + SPECIAL;
  for (let index = 4; index < 12; index += 1) chars.push(pick(all, index));
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = bytes[index % bytes.length] % (index + 1);
    const current = chars[index];
    chars[index] = chars[swap];
    chars[swap] = current;
  }
  return chars.join("");
}
