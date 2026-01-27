# LegalGenie — AI Legal Research Platform

An AI-powered legal research platform for semantic case search, structured AI briefs, and document analysis.

## Features

- **Semantic Precedent Search**: Find cases by meaning using Pinecone vectors
- **AI Case Briefs**: Generate structured briefs (Facts, Issues, Verdict, Reasoning)
- **Citation Extraction**: Automatically extract IPC sections, Constitution articles, and case references
- **Chat with Case**: Interactive Q&A with paragraph citations
- **Counter-Argument Simulator**: Generate opposing counsel arguments

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Pinecone Vector Database
- Google Gemini AI
- Multer (file uploads)
- pdf-parse

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Pinecone account
- Google AI Studio API key

### Setup

1. **Clone and install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

2. **Configure environment variables**
```bash
# In server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legalgenie
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=legalgenie-index
```

3. **Seed sample data (optional)**
```bash
cd server
node seeds/seedCases.js
```

4. **Start development servers**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

5. **Open the app**
Navigate to `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List all cases |
| GET | `/api/cases/:id` | Get case details |
| POST | `/api/cases` | Create case |
| DELETE | `/api/cases/:id` | Delete case |
| POST | `/api/upload` | Upload PDF/Text |
| POST | `/api/search` | Semantic search |
| POST | `/api/ai/brief` | Generate AI brief |
| POST | `/api/ai/counter` | Generate counter-arguments |
| POST | `/api/ai/chat` | Chat with case |

## Project Structure

```
LegalGenie/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── services/       # API service
│   └── ...
├── server/                 # Express backend
│   ├── config/             # DB, Pinecone, Gemini config
│   ├── controllers/        # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middlewares/        # Express middleware
│   └── utils/              # Prompt templates, helpers
└── sample_judgments/       # Demo PDFs
```

## RAG Pipeline

1. **Ingestion**: Upload → Parse → Chunk → Embed → Store in Pinecone
2. **Retrieval**: Query → Embed → Vector search → Get context
3. **Generation**: Context + Prompt → Gemini → Structured output

## License

MIT
