import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);



export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: "subhranil.com", // Replace with your verified sender email
      to: email,
      subject: "Welcome to MediGuru!",
      html: "<p>Thank you for subscribing to MediGuru! 🚀</p>",
    });

    return NextResponse.json({ message: "Email sent successfully", response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send email", error }, { status: 500 });
  }
}