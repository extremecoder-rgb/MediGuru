import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/chat";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch ALL chats sorted by createdAt in descending order
    const chats = await Chat.find().sort({ createdAt: -1 });

    // Debugging: log chats to check data format
    console.log("Fetched Chats:", chats);

    // Return the chats or an empty array if no chats exist
    if (!chats || chats.length === 0) {
      return NextResponse.json({ message: "No chats found", chats: [] }, { status: 200 });
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}