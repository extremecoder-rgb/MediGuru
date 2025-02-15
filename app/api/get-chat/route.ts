import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Ensure this exists
import Chat from "@/models/chat"; // Your Chat model

export async function GET(req: Request) {
  try {
    await connectDB(); // Ensure MongoDB connection

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}