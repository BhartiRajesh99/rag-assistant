import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile, htmlToText } from "html-to-text";

export async function POST(request: NextRequest) {
  try {
    const response = await request.json();

    const compiledConvert = compile({ wordwrap: 130 });
    const loader = new RecursiveUrlLoader(response.content, {
      extractor: compiledConvert,
      maxDepth: 0,
      timeout: 3000
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
