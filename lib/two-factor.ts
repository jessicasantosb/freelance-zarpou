import QRCode from "qrcode";

// Caracteres válidos para Base32 (RFC 4648)
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Converte uma string Base32 em Uint8Array
 */
export function base32ToBuffer(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean.charAt(i));
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

/**
 * Gera uma chave secreta Base32 aleatória de 16 ou 32 caracteres
 */
export function generateBase32Secret(length = 16): string {
  let secret = "";
  const randomBytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < length; i++) {
    secret += BASE32_ALPHABET.charAt(randomBytes[i] % BASE32_ALPHABET.length);
  }
  return secret;
}

/**
 * Gera a URI padrão otpauth:// para aplicativos como Google Authenticator, Microsoft Authenticator e Authy
 */
export function generateOtpauthUri(email: string, secret: string, issuer = "Zarpou Viagens"): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Gera o QR Code em DataURL (imagem base64 PNG) para leitura no app autenticador
 */
export async function generateQrCodeDataUrl(otpauthUri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(otpauthUri, {
      width: 240,
      margin: 1.5,
      color: {
        dark: "#05345b", // Azul corporativo Zarpou
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("[2FA] Erro ao gerar QR Code:", err);
    return "";
  }
}

/**
 * HMAC-SHA1 compatível com browser (SubtleCrypto) e Node.js
 */
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key as unknown as BufferSource,
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, message as unknown as BufferSource);
    return new Uint8Array(signature);
  }

  // Fallback para Node.js puro em server components
  try {
    const nodeCrypto = await import("crypto");
    const hmac = nodeCrypto.createHmac("sha1", Buffer.from(key));
    hmac.update(Buffer.from(message));
    return new Uint8Array(hmac.digest());
  } catch {
    throw new Error("Ambiente criptográfico não disponível para HMAC-SHA1.");
  }
}

/**
 * Gera o código TOTP de 6 dígitos para uma determinada época/timestamp (RFC 6238)
 */
export async function generateTotpCode(secret: string, timestamp = Date.now()): Promise<string> {
  const key = base32ToBuffer(secret);
  const epoch = Math.floor(timestamp / 1000);
  const timeStep = Math.floor(epoch / 30);

  // Buffer de 8 bytes em Big-Endian
  const timeBuffer = new Uint8Array(8);
  let temp = timeStep;
  for (let i = 7; i >= 0; i--) {
    timeBuffer[i] = temp & 0xff;
    temp = Math.floor(temp / 256);
  }

  const hmac = await hmacSha1(key, timeBuffer);

  // Truncamento dinâmico (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Valida o token TOTP com tolerância de janela (±1 passo de 30s para contornar relógio dessincronizado)
 */
export async function verifyTotpCode(secret: string, token: string): Promise<boolean> {
  const cleanToken = token.trim().replace(/\D/g, "");
  if (cleanToken.length !== 6) return false;

  const now = Date.now();
  const windows = [-1, 0, 1]; // -30s, agora, +30s

  for (const windowOffset of windows) {
    const checkTime = now + windowOffset * 30 * 1000;
    const expected = await generateTotpCode(secret, checkTime);
    if (expected === cleanToken) {
      return true;
    }
  }

  return false;
}

/**
 * Gera 5 códigos de recuperação descartáveis (Backup Codes)
 */
export function generateBackupCodes(count = 5): string[] {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Sem 0, 1, O, I para evitar ambiguidade visual
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    let part1 = "";
    let part2 = "";
    for (let j = 0; j < 4; j++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(`${part1}-${part2}`);
  }

  return codes;
}

/**
 * Gera código numérico de 6 dígitos para envio por E-mail
 */
export function generateEmailPin(): string {
  const pin = Math.floor(100000 + Math.random() * 900000);
  return pin.toString();
}

/**
 * Mascara o e-mail para exibição segura na tela (ex: j***a@zarpou.com.br)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local.charAt(0)}***@${domain}`;
  }
  const first = local.charAt(0);
  const last = local.charAt(local.length - 1);
  return `${first}${"*".repeat(Math.max(local.length - 2, 3))}${last}@${domain}`;
}
