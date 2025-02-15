import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/chat";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  // Check if user is authenticated
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Parsing the request body
    const { message, response } = await req.json();

    // Find the latest chat for the user
    let chat = await Chat.findOne({ userId: user.id }).sort({ createdAt: -1 });

    // If no previous chat, create a new one
    if (!chat) {
      chat = new Chat({ userId: user.id, messages: [] });
    }

    // Push the new messages to the chat
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    chat.messages.push({
      role: "ai",
      content: response,
      timestamp: new Date(),
    });

    // Save the updated chat
    await chat.save();

    // Return a success response
    return NextResponse.json({ success: true, chatId: chat._id });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}