export const getRecentChats = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/recent-chats");
      if (!response.ok) throw new Error("Failed to fetch recent chats");
      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  };
  