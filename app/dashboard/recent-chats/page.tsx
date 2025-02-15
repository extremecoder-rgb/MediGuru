"use client"; // ✅ Mark this as a Client Component

import { useEffect, useState } from "react";

interface Chat {
  _id: string;
  messages: { role: string; content: string }[]; // Each chat has messages with roles (user/ai)
}

export default function RecentChats() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("/api/recent-chats");
        const data = await res.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
      {chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id} className="p-2 border rounded mb-2">
              {chat.messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.role === "user" ? "User" : "AI"}:</strong> {message.content}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}