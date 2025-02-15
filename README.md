# MediGuru: AI-Powered Chatbot

MediGuru is an AI-powered chatbot designed to provide intelligent and context-aware interactions using Retrieval-Augmented Generation (RAG). It leverages a cutting-edge tech stack to ensure fast, accurate, and reliable responses.

## 🚀 Features

- **Context-Aware Conversations**: AI remembers past interactions for a seamless experience.
- **Retrieval-Augmented Generation (RAG)**: Enhances response accuracy using external knowledge sources.
- **Vector-Based Search**: Uses Pinecone for fast and efficient similarity searches.
- **Real-time AI Responses**: Powered by Langchain and Transformers.js.
- **Modern & Responsive UI**: Built with Next.js, Tailwind CSS, and Shadcn UI.
- **Secure Authentication**: Integrated with Clerk for seamless user authentication.
- **Chat History Management**: Users can revisit and continue past conversations.
- **Muliti-Lingual support: User can interact with our AI agent in any language.
- **Medication Reminder: users can have a reminder feature if he/she forgets to take medicines in time.

## 🛠 Tech Stack

- **Frontend**: Next.js (React Framework), Tailwind CSS, Shadcn UI
- **Backend**: Langchain (LLM Framework)
- **Vector Database**: Pinecone
- **AI Models**: Transformers.js (Hugging Face)
- **Authentication**: Clerk
- **State Management**: Context API / Zustand (if applicable)

## 📂 Project Structure
```
/medi-guru
│── /app                 # Next.js app directory
│── /components          # UI Components
│── /lib                 # Utility functions
│── /pages               # Next.js page routes
│── /public              # Static assets
│── /styles              # Global styles (Tailwind)
│── /utils               # Helper functions
│── pinecone.js          # Pinecone setup
│── langchain.js         # Langchain configuration
│── clerk.js             # Clerk authentication setup
│── package.json         # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js 18+
- Yarn or npm
- Pinecone API Key
- Clerk API Key

### Installation
```bash
git clone https://github.com/extremecoder-rgb/MediGuru.git
cd MediGuru
npm install  # or yarn install
```

### Environment Variables
Create a `.env.local` file and add:
```
NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-api>
CLERK_API_KEY=<your-clerk-backend-api>
PINECONE_API_KEY=<your-pinecone-api>
PINECONE_ENV=<your-pinecone-environment>
```

### Run the App
```bash
npm run dev  # or yarn dev
```
The app will be available at `http://localhost:3000`

## 📌 Usage
- **Sign Up / Login** via Clerk.
- **Start a New Conversation** or continue from recent chats.
- **Upload Documents** to improve AI responses.
- **Interact with AI** using natural language queries.

## 📜 License
This project is open-source and available under the MIT License.

## 🌟 Contributing
We welcome contributions! Feel free to open issues or submit pull requests.

## 📬 Contact
For queries, reach out at [your-email@example.com](mailto:hsuswiowkskow@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/subhranil-mondal-537433318/).

---
⭐ Star this repo if you find it useful!

