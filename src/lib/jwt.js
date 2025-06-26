import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Generate token (untuk login)
export async function generateToken(payload) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1d").sign(secret);
}

// Verify token (untuk middleware/proteksi API)
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error("Token invalid");
  }
}
