import React from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();

type Props = {
  text?: string; // Allow undefined to avoid crashes
};

const Markdown = ({ text }: Props) => {
  if (!text || typeof text !== "string") {
    return <p className="text-muted">No relevant information available.</p>; 
  }

  const htmlcontent = md.render(text);
  const sanitized = DOMPurify.sanitize(htmlcontent);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export default Markdown;