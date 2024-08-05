import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";

// Create a transporter object using the Gmail SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
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
      from: '"Anonymous Feedback" <your-email@gmail.com>',
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
