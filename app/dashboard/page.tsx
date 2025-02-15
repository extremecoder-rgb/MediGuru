"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MessageSquare, DoorClosedIcon, Settings } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ModeToggle } from "@/components/modetoggle";
import { useToast } from "@/components/ui/use-toast";
import { useClerk } from "@clerk/nextjs";
import ReportComponent from "@/components/ReportComponent";
import ChatComponent from "../../components/chatcomponent";
import ReminderComponent from "@/components/ReminderComponent";
import { useRouter } from "next/navigation";
import "regenerator-runtime/runtime";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const Home = () => {
  const { toast } = useToast();
  const { signOut } = useClerk();
  const router = useRouter();
  const [reportData, setReportData] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatComponentRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        toast({ description: `Error: ${event.error}`, variant: "destructive" });
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const newTranscript = event.results[0][0].transcript;
        setTranscript(newTranscript);
        toast({ description: `Voice input captured: "${newTranscript}"` });
        handleVoiceSubmit(newTranscript);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ description: "Your browser does not support speech recognition.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      toast({ description: "Listening... Speak now." });
    }
  };

  const handleVoiceSubmit = (voiceInput: string) => {
    if (chatComponentRef.current) {
      chatComponentRef.current.handleVoiceSubmit(voiceInput);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-auto">
      {/* Navbar */}
      <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-2 border-b px-4">
        <h1 className="text-xl font-semibold text-[#D90013]">MediGuru</h1>
        
        {/* Buttons Section */}
        <div className="w-full flex flex-row justify-end gap-2">
          

          <ModeToggle />

          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <DoorClosedIcon className="w-4 h-4 mr-2" /> Logout
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] overflow-auto">
              <ReportComponent onReportConfirmation={setReportData} />
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 overflow-auto">
        <div className="hidden md:flex flex-col gap-4">
          <ReportComponent onReportConfirmation={setReportData} />
          <ReminderComponent />
        </div>

        <div className="lg:col-span-2 flex flex-col overflow-auto">
          <ChatComponent 
            ref={chatComponentRef}
            reportData={reportData} 
            voiceInput={transcript} 
          />

          
        </div>
      </main>
    </div>
  );
};

export default Home;
