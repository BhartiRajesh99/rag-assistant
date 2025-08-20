import { NextResponse, NextRequest } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const metadata = formData.get("metadata") as string;
    const newSource = metadata ? JSON.parse(metadata) : null;

    const filename = newSource.name;
    const fileExtension = filename.split(".")[1].toLowerCase()

    let loader;
    if(fileExtension === "pdf"){
     loader = new PDFLoader(file);
    } else if(fileExtension === "txt"){
      loader = new TextLoader(file)
    } else if(fileExtension === "docx") {
      loader = new DocxLoader(file)
    } else if(fileExtension === "csv"){
      loader = new CSVLoader(file)
    } else {
      return NextResponse.json({message: "unsupported file"},{status: 400})
    }
    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.VECTOR_URL,
      collectionName: "rag-collection",
    });

    const updatedResponse = { ...newSource, status: "indexed" };

    console.log("✅Indexing of file done");
    return NextResponse.json(
      { message: "File Indexing Done", updatedResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
