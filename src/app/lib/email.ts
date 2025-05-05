import nodemailer from "nodemailer";

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, BASE_URL } = process.env;
if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD || !BASE_URL) {
  throw new Error("Missing environment variables for email configuration.");
}
// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || "gmail",
  port: parseInt(process.env.EMAIL_PORT || "2525"),
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  try {
    const verifyUrl = `${BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;

    await transporter.sendMail({
      from: `"HAKI System" <${EMAIL_USER}>`,
      to,
      subject: "Verifikasi Email Akun HKI Anda",
      html: `<a href="${verifyUrl}">Klik untuk verifikasi</a>`,
    });
  } catch (error) {
    console.error("gagal mengirim email verifikasi", error);
    throw new Error("Gagal mengirim email verifikasi. Silakan coba lagi.");
  }
};
