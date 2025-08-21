# 🧠 RAGify

RAGify is a **Retrieval-Augmented Generation (RAG)** based chatbot that allows users to upload documents or provide raw text, and then interact with an intelligent assistant capable of answering questions based on that content.  

It supports multiple document formats such as **PDF, DOCX, TXT, CSV, URL**, and even **direct text input**, making it versatile for different use cases.

---

## 🚀 Introduction  

Large Language Models (LLMs) are powerful but often limited by their training data and knowledge cutoff.  
The RAG Assistant bridges this gap by combining **retrieval (from user-provided documents)** with **generation (LLM responses)**.  

This means the chatbot doesn’t just rely on what it "knows" but can **refer to your uploaded documents** to provide **context-aware answers**.

---

## ✨ Features  

✅ **Multi-file support** – Upload documents in:  
- 📄 **PDF**  
- 📄 **DOCX**  
- 📜 **TXT**  
- 📊 **CSV**  
- 📝 **Raw text input**
- 🌐 **URL**  

✅ **Smart Indexing** – Each document is split into smaller chunks and stored in a **vector database (Qdrant)** for efficient retrieval.  

✅ **Context-aware Chatbot** – Ask questions based on the uploaded files, and the chatbot uses **retrieved content + LLM** to generate answers.  

✅ **Embeddings Powered** – Uses **Google Generative AI Embeddings** for document vectorization.  

✅ **Scalable** – Backend built with **Next.js API Routes** and **Qdrant Vector Database** for efficient search.  

✅ **File Status Tracking** – Know whether your file has been successfully indexed.  

---

## ⚙️ How It Works  

1. **Upload/Enter Text**  
   - User uploads a file (`.pdf`, `.docx`, `.txt`, `.csv`), url or types in raw text.  

2. **Indexing**  
   - The file is parsed and split into chunks.  
   - Each chunk is vectorized into embeddings using **Google Generative AI Embeddings**.  
   - The vectors are stored in **Qdrant** (a vector database).  

3. **Retrieval**  
   - When a user asks a question, relevant chunks are retrieved from Qdrant.  

4. **Generation**  
   - The chatbot combines retrieved content with LLM capabilities to generate a **context-rich answer**.  

---


## 🔑 Tech Stack  

- **Frontend**: Next.js (App Router) + TailwindCSS  
- **Backend**: Next.js API Routes  
- **Vector Database**: Qdrant (self-hosted or Qdrant Cloud)  
- **Embeddings**: Google Generative AI (text-embedding-004)  
- **LLM**: OpenAI/Google Generative AI for response generation  

---


