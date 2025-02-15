import React, { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2, TextSearch } from "lucide-react";
import { Badge } from "./ui/badge";
import Messages from "./messages";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Markdown from "./markdown";
import { franc } from "franc-min";

type Props = {
  reportData?: string;
  voiceInput?: string;
};

const ChatComponent = forwardRef(({ reportData, voiceInput }: Props, ref) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "api/medichatgemini",
    });
   
  const [detectedLanguage, setDetectedLanguage] = useState("en");

  // Language detection function
  const detectLanguage = (text: string) => {
    const langCode = franc(text);
    return langCode !== "und" ? langCode : "en"; // Default to English if uncertain
  };

  // Detect language when input changes
  useEffect(() => {
    if (input) {
      setDetectedLanguage(detectLanguage(input));
    }
  }, [input]);

  // Handle voice input
  useImperativeHandle(ref, () => ({
    handleVoiceSubmit: (voiceInput: string) => {
      const lang = detectLanguage(voiceInput);
      setDetectedLanguage(lang);
      handleInputChange({ target: { value: voiceInput } } as React.ChangeEvent<HTMLTextAreaElement>);
      handleSubmit(new Event("submit") as any, {
        data: {
          reportData: reportData as string,
          userLang: lang, // Pass detected language
        },
      });
    },
  }));
 
  return (
    <div className="h-full bg-muted/50 relative flex flex-col max-h-[100vh] rounded-xl p-4 gap-4">
      {/* Report Badge */}
      <Badge
        variant={"outline"}
        className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>

      {/* Scrollable Chat Messages */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      {/* Relevant Info Section */}
      {data?.length !== undefined && data.length > 0 && (
        <Accordion type="single" className="text-sm" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="flex flex-row items-center gap-2">
                <TextSearch /> Relevant Info
              </span>
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-wrap">
              <Markdown text={(data[data.length - 1] as any).retrievals as string} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Chat Input Form */}
      <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
              userLang: detectedLanguage, // Pass detected language to backend
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => {
            setDetectedLanguage(detectLanguage(e.target.value));
            handleInputChange(e);
          }}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button disabled={isLoading} type="submit" size="sm" className="ml-auto">
            {isLoading ? "Analysing..." : "Ask"}
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <CornerDownLeft className="size-3.5" />}
          </Button>
         
        </div>
        
      </form>
    </div>
  );
});

export default ChatComponent;
