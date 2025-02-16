"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ChatPage = () => {
  const { id } = useParams();
  const [chat, setChat] = useState<any>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();
      setChat(data);
    };

    fetchChat();
  }, [id]);

  const handleSendMessage = async () => {
    const res = await fetch("/api/savechat", {
      method: "POST",
      body: JSON.stringify({ message: input, response: "AI response..." }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setChat((prev: any) => ({
        ...prev,
        messages: [...prev.messages, { role: "user", content: input }],
      }));
      setInput("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Chat History</h1>
      <div className="mt-4">
        {chat?.messages.map((msg: any, index: number) => (
          <p key={index} className={`p-2 ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"} rounded`}>
            {msg.content}
          </p>
        ))}
      </div>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask again..." />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
};

export default ChatPage;