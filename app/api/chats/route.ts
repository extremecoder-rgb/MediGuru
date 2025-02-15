import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";  
import Chat from "../../../models/chat";

// Fetch recent chats (GET)
export async function GET() {
  await dbConnect();  // ✅ FIXED HERE
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

// Save new chat (POST)
export async function POST(req: Request) {
  await dbConnect();  // ✅ FIXED HERE
  try {
    const { title, messages } = await req.json();
    const newChat = new Chat({ title, messages });
    await newChat.save();
    return NextResponse.json({ message: "Chat saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}