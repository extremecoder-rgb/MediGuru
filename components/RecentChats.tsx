"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Chat {
  chatId: string;
  updatedAt: string;
}

const RecentChats = ({ userId }: { userId: string }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`/api/getChats?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch chats");

        const data: Chat[] = await res.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>
      {chats.length === 0 ? (
        <p className="text-gray-500">No recent chats</p>
      ) : (
        chats.map((chat) => (
          <button key={chat.chatId} className="block w-full p-2 bg-background rounded" onClick={() => router.push(`/chat/${chat.chatId}`)}>
            {new Date(chat.updatedAt).toLocaleString()}
          </button>
        ))
      )}
    </div>
  );
};

export default RecentChats;