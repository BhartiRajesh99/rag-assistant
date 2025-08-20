import { NextResponse, NextRequest } from "next/server";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function POST(request: NextRequest) {
  try {
    const response = await request.json();
    
    const loader = new PlaywrightWebBaseLoader(response.content, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
    });

    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.VECTOR_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "rag-collection",
    });

    const updatedResponse = {...response, status: "indexed"}

    console.log("✅Indexing of url done");
    return NextResponse.json(
      { message: "Url Indexing Done", updatedResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
