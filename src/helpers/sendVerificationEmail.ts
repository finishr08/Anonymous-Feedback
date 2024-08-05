import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  secure: process.env.MAILTRAP_SECURE === "true",
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailContent = render(
      VerificationEmail({ username, otp: verifyCode })
    );

    // Send the email
    const info = await transporter.sendMail({
      from: '"Anonymous Feedback" <onboarding@demomailtrap.com>', // Ensure this address is valid
      to: email,
      subject: "Anonymous Feedback Verification Code",
      html: emailContent,
    });

    console.log("Email response:", info);

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);

    return { success: false, message: "Failed to send verification email." };
  }
}
