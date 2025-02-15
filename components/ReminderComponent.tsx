import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Reminder {
  id: string;
  medicineName: string;
  time: string;
}

const ReminderComponent: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    console.log("Component mounted");
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
      console.log("Loaded reminders:", JSON.parse(storedReminders));
    }

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }

    // Set up interval to check reminders every 10 seconds (for testing purposes)
    const intervalId = setInterval(checkReminders, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    console.log("Updated reminders:", reminders);
  }, [reminders]);

  const addReminder = () => {
    if (!medicineName || !reminderTime) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineName,
      time: reminderTime,
    };

    setReminders(prevReminders => [...prevReminders, newReminder]);
    setMedicineName('');
    setReminderTime('');
    toast({ description: `Reminder set for ${medicineName} at ${reminderTime}` });
    console.log("Added reminder:", newReminder);
  };

  const checkReminders = () => {
    console.log("Checking reminders...");
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    console.log("Current time:", currentTime);

    reminders.forEach(reminder => {
      console.log("Checking reminder:", reminder);
      if (reminder.time === currentTime) {
        console.log("Reminder match found!");
        showNotification(reminder.medicineName);
      }
    });
  };

  const showNotification = (medicineName: string) => {
    console.log("Showing notification for:", medicineName);
    if (Notification.permission === 'granted') {
      new Notification('Medicine Reminder', {
        body: `Time to take your medicine: ${medicineName}`,
      });
    }
    toast({
      title: "Medicine Reminder",
      description: `Time to take your medicine: ${medicineName}`,
      duration: 10000, // Display for 10 seconds
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Medication Reminders</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="Medicine Name"
        />
        <Input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <Button onClick={addReminder}>Add Reminder</Button>
      </div>
      <ul>
        {reminders.map((reminder) => (
          <li key={reminder.id} className="mb-2">
            {reminder.medicineName} - {reminder.time}
          </li>
        ))}
      </ul>
      <Button onClick={checkReminders}>Check Reminders Now</Button>
    </div>
  );
};

export default ReminderComponent;
