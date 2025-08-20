"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { ChangeEvent, KeyboardEvent, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Link,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Brain,
  Database,
  User,
  Sun,
  Moon,
} from "lucide-react";
import toast from "react-hot-toast";

interface DataSource {
  id: string;
  name: string;
  type: "text" | "file" | "url";
  status: "processing" | "indexed";
  content?: string | FormData;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function RAGAssistant() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your RAG Assistant. Upload some data sources and I'll help you find information from them.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const bottomRef = useRef<HTMLParagraphElement | null>(null);
  const bottomRefDataSources = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addTextSource = async () => {
    if (!textInput.trim()) return;

    const newSource: DataSource = {
      id: Date.now().toString(),
      name: `Text Input ${dataSources.length + 1}`,
      type: "text",
      status: "processing",
      content: textInput.trim(),
    };

    const updatedDataSource: DataSource[] = [...dataSources, newSource];

    setDataSources(updatedDataSource);
    setTextInput("");

    try {
      const response = await axios.post("/api/text-index", newSource);

      if (response.status === 200) {
        setDataSources((prev) =>
          prev.map((source) =>
            source.id !== response.data.updatedResponse.id
              ? source
              : response.data.updatedResponse
          )
        );
      }
      toast.success(`${response.data.updatedResponse.name} Indexed`);
    } catch (error: any) {
      toast.error(error.message);
      console.log("Error in add text");
    }
  };

  const addUrlSource = async () => {
    if (!urlInput.trim()) return;

    const newSource: DataSource = {
      id: Date.now().toString(),
      name: new URL(urlInput).hostname,
      type: "url",
      status: "processing",
      content: urlInput,
    };

    const updatedDataSource: DataSource[] = [...dataSources, newSource];

    setDataSources(updatedDataSource);
    setUrlInput("");

    try {
      const response = await axios.post("/api/url-index", newSource);

      if (response.status === 200) {
        setDataSources((prev) =>
          prev.map((source) =>
            source.id !== response.data.updatedResponse.id
              ? source
              : response.data.updatedResponse
          )
        );
      }
      toast.success(`${response.data.updatedResponse.name} Indexed`);
    } catch (error: any) {
      toast.error(error.message);
      console.log("Error in add url");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();

    const newSource: DataSource = {
      id: Date.now().toString() + Math.random(),
      name: files[0]?.name,
      type: "file",
      status: "processing",
    };

    formData.append("file", files[0]);
    formData.append("metadata", JSON.stringify(newSource));

    const updatedDataSource: DataSource[] = [...dataSources, newSource];

    setDataSources(updatedDataSource);

    try {
      const response = await axios.post("/api/file-index", formData, {
        headers: {
          "Content-Type": "multipart/formData",
        },
      });

      if (response.status === 200) {
        setDataSources((prev) =>
          prev.map((source) =>
            source.id !== response.data.updatedResponse.id
              ? source
              : response.data.updatedResponse
          )
        );
        toast.success(`${response.data.updatedResponse.name} Indexed`);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log("Error in add file");
    }
  };

  const removeDataSource = (id: string) => {
    setDataSources((prev) => prev.filter((source) => source.id !== id));
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    setTimeout(() => setIsloading(true), 1000);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      const response = await axios.post("/api/chat", { query: chatInput });
      if (response.status === 200) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.message,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.log("Error sendMessage");
    } finally {
      setIsloading(false);
    }
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (bottomRefDataSources.current) {
      bottomRefDataSources.current.scrollTop =
        bottomRefDataSources.current.scrollHeight;
    }
  }, [dataSources]);

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div
        className={`absolute inset-0 animate-pulse-slow ${
          isDarkMode
            ? "bg-gradient-to-r from-amber-400/5 via-transparent to-orange-400/5"
            : "bg-gradient-to-r from-amber-200/20 via-transparent to-orange-200/20"
        }`}
      />
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDarkMode
            ? "bg-gradient-radial from-amber-400/10 to-transparent"
            : "bg-gradient-radial from-amber-300/30 to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed ${
          isDarkMode
            ? "bg-gradient-radial from-orange-400/10 to-transparent"
            : "bg-gradient-radial from-orange-300/30 to-transparent"
        }`}
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-b sticky top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 ${
          isDarkMode
            ? "border-gradient-to-r from-amber-200/20 via-gray-700/40 to-orange-200/20 bg-black/70 shadow-amber-500/5"
            : "border-gradient-to-r from-amber-300/30 via-gray-300/40 to-orange-300/30 bg-white/70 shadow-amber-500/10"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 shadow-amber-500/25"
                      : "bg-gradient-to-br from-amber-500 via-orange-600 to-amber-600 shadow-amber-500/30"
                  }`}
                >
                  <Brain className="h-6 w-6 text-white animate-pulse-slow" />
                </div>
                <Sparkles
                  className={`h-4 w-4 absolute -top-1 -right-1 animate-float ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold bg-clip-text text-transparent font-serif transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400"
                      : "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700"
                  }`}
                >
                  RAG Assistant
                </h1>
                <p
                  className={`text-sm transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Upload data and chat with your documents
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className={`rounded-xl transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-600/50 hover:bg-amber-500/20 hover:border-amber-400/50 text-gray-300 hover:text-amber-400"
                    : "bg-white/50 border-gray-300/50 hover:bg-amber-100/50 hover:border-amber-400/50 text-gray-700 hover:text-amber-600"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className={`rounded-2xl shadow-xl border-0 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/40 hover:shadow-amber-500/10 border border-gray-700/50"
                    : "bg-gradient-to-br from-white/80 via-gray-50/60 to-white/40 hover:shadow-amber-500/20 border border-gray-200/50"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-500/5 to-transparent"
                      : "bg-gradient-to-br from-amber-200/20 to-transparent"
                  }`}
                />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle
                    className={`text-lg font-serif flex items-center gap-2 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      }`}
                    >
                      <Database className="h-4 w-4 text-white" />
                    </div>
                    Text Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <Textarea
                    placeholder="Paste or type your text here..."
                    value={textInput}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setTextInput(e.target.value)
                    }
                    className={`min-h-[150px] resize-none rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                      isDarkMode
                        ? "border-gray-700/50 focus:border-amber-400/50 bg-gray-800/50 text-white placeholder:text-gray-400"
                        : "border-gray-300/50 focus:border-amber-500/50 bg-white/50 text-gray-900 placeholder:text-gray-500"
                    }`}
                  />
                  <Button
                    onClick={addTextSource}
                    disabled={!textInput.trim()}
                    className={`w-full cursor-pointer rounded-xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg text-white border-0 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:via-orange-600 hover:to-amber-600 shadow-amber-500/25"
                        : "bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:via-orange-700 hover:to-amber-700 shadow-amber-500/30"
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2"
                    >
                      Add Text Source
                      <Sparkles className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className={`rounded-2xl shadow-xl border-0 backdrop-blur-sm flex flex-col relative overflow-hidden transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/40 border border-gray-700/50"
                    : "bg-gradient-to-br from-white/80 via-gray-50/60 to-white/40 border border-gray-200/50"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-orange-400/5 to-transparent"
                      : "bg-gradient-to-br from-orange-200/20 to-transparent"
                  }`}
                />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle
                    className={`text-lg font-serif flex items-center gap-2 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? "bg-gradient-to-br from-orange-400 to-amber-500"
                          : "bg-gradient-to-br from-orange-500 to-amber-600"
                      }`}
                    >
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                    File Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className={`border-2 cursor-pointer border-dashed rounded-xl p-10 text-center transition-all duration-300 backdrop-blur-sm group relative overflow-hidden ${
                      isDarkMode
                        ? "border-gray-600/60 hover:border-orange-400/60 bg-gradient-to-br from-gray-800/30 via-black/20 to-gray-800/30"
                        : "border-gray-300/60 hover:border-orange-500/60 bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-50/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/5"
                          : "bg-gradient-to-br from-orange-200/20 via-transparent to-orange-200/20"
                      }`}
                    />
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                      className="relative z-10"
                    >
                      <Upload
                        className={`mx-auto h-14 w-14 transition-colors duration-300 mb-4 ${
                          isDarkMode
                            ? "text-gray-400 group-hover:text-orange-400"
                            : "text-gray-500 group-hover:text-orange-500"
                        }`}
                      />
                    </motion.div>
                    <p
                      className={`text-sm mb-4 relative z-10 transition-colors duration-500 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Drag and drop files here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.csv,.txt,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      className={`rounded-xl cursor-pointer bg-transparent active:scale-95 transition-all duration-300 relative z-10 ${
                        isDarkMode
                          ? "border-gray-600/60 hover:bg-gradient-to-r hover:from-orange-900/50 hover:to-orange-800/50 hover:border-orange-400/60 text-gray-300 hover:text-white"
                          : "border-gray-300/60 hover:bg-gradient-to-r hover:from-orange-100/50 hover:to-orange-200/50 hover:border-orange-500/60 text-gray-700 hover:text-orange-700"
                      }`}
                    >
                      Choose Files
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className={`rounded-2xl min-h-[152px] shadow-xl border-0 backdrop-blur-sm flex flex-col relative overflow-hidden transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/40 border border-gray-700/50"
                    : "bg-gradient-to-br from-white/80 via-gray-50/60 to-white/40 border border-gray-200/50"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-500/5 to-transparent"
                      : "bg-gradient-to-br from-amber-200/20 to-transparent"
                  }`}
                />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle
                    className={`text-lg font-serif flex items-center gap-2 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-amber-600 to-orange-600"
                      }`}
                    >
                      <Link className="h-4 w-4 text-white" />
                    </div>
                    Website URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex mt-3 gap-2">
                    <div className="relative flex-1">
                      <Link
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-500 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <Input
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setUrlInput(e.target.value)
                        }
                        className={`pl-10 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                          isDarkMode
                            ? "border-gray-700/50 focus:border-amber-400/50 bg-gray-800/50 text-white placeholder:text-gray-400"
                            : "border-gray-300/50 focus:border-amber-500/50 bg-white/50 text-gray-900 placeholder:text-gray-500"
                        }`}
                      />
                    </div>
                    <Button
                      onClick={addUrlSource}
                      disabled={!urlInput.trim()}
                      className={`rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg text-white border-0 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 shadow-amber-500/25"
                          : "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 shadow-amber-500/30"
                      }`}
                    >
                      Add URL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex gap-6 flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card
                className={`rounded-2xl shadow-xl min-h-[224px] border-0 hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50 hover:shadow-amber-500/10 border border-gray-700/50"
                    : "bg-gradient-to-br from-white/50 via-gray-50/30 to-white/50 hover:shadow-amber-500/20 border border-gray-200/50"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-500/5 to-transparent"
                      : "bg-gradient-to-br from-gray-200/20 to-transparent"
                  }`}
                />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle
                    className={`text-lg font-serif flex items-center gap-2 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-500 to-orange-600"
                          : "bg-gradient-to-br from-amber-600 to-orange-600"
                      }`}
                    >
                      <Database className="h-4 w-4 text-white" />
                    </div>
                    Data Sources ({dataSources.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div
                    ref={bottomRefDataSources}
                    className="space-y-2 max-h-[142px] overflow-y-auto"
                  >
                    {dataSources.length === 0 ? (
                      <motion.p
                        className={`text-sm text-center py-8 transition-colors duration-500 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        No data sources added yet
                      </motion.p>
                    ) : (
                      <AnimatePresence>
                        {dataSources.map((source, index) => (
                          <motion.div
                            key={source.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm ${
                              isDarkMode
                                ? "bg-gradient-to-r from-gray-800/50 via-black/30 to-gray-800/50 hover:from-gray-700/60 hover:via-black/50 hover:to-gray-700/60 border border-gray-700/30"
                                : "bg-gradient-to-r from-gray-100/50 via-white/30 to-gray-100/50 hover:from-gray-200/60 hover:via-white/50 hover:to-gray-200/60 border border-gray-200/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {source.status === "indexed" ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                >
                                  <Clock
                                    className={`h-4 w-4 ${
                                      isDarkMode
                                        ? "text-amber-400"
                                        : "text-amber-500"
                                    }`}
                                  />
                                </motion.div>
                              )}
                              <div>
                                <p
                                  className={`text-sm font-medium transition-colors duration-500 ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {source.name}
                                </p>
                                <p
                                  className={`text-xs capitalize transition-colors duration-500 ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {source.status === "indexed"
                                    ? "Indexed"
                                    : "Processing..."}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDataSource(source.id)}
                              className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* chat */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className={`rounded-2xl shadow-xl border-0 backdrop-blur-sm flex flex-col min-h-[580px] lg:sticky lg:top-24 relative overflow-hidden transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/90 via-black/70 to-gray-800/30 border border-gray-700/50"
                    : "bg-gradient-to-br from-white/90 via-gray-50/70 to-white/30 border border-gray-200/50"
                }`}
              >
                <div
                  className={`absolute inset-0 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-500/3 via-transparent to-orange-400/3"
                      : "bg-gradient-to-br from-amber-200/10 via-transparent to-orange-200/10"
                  }`}
                />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle
                    className={`text-lg font-serif flex items-center gap-2 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      }`}
                    >
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    Chat
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Sparkles
                        className={`h-4 w-4 ml-auto ${
                          isDarkMode ? "text-orange-400" : "text-orange-500"
                        }`}
                      />
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex gap-2 flex-col relative z-10">
                  <div
                    ref={bottomRef}
                    className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 pb-6 max-h-[400px]"
                  >
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            delay: index * 0.1,
                          }}
                          className={`flex items-start gap-3 ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.sender === "bot" && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                delay: index * 0.1 + 0.2,
                              }}
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                isDarkMode
                                  ? "bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-amber-500/25"
                                  : "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/30"
                              }`}
                            >
                              <Brain className="h-4 w-4 text-white" />
                            </motion.div>
                          )}

                          <motion.div
                            whileHover={{ scale: 1.008 }}
                            className={`max-w-[70%] p-4 rounded-2xl shadow-md backdrop-blur-sm ${
                              message.sender === "user"
                                ? isDarkMode
                                  ? "bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 text-white shadow-orange-400/25"
                                  : "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-500 text-white shadow-orange-500/30"
                                : isDarkMode
                                ? "bg-gradient-to-r from-gray-800/80 via-gray-700/60 to-gray-800/80 text-gray-100 border border-gray-600/50"
                                : "bg-gradient-to-r from-gray-100/80 via-white/60 to-gray-100/80 text-gray-900 border border-gray-300/50"
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          </motion.div>

                          {message.sender === "user" && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "tween",
                                stiffness: 300,
                                delay: index * 0.1 + 0.2,
                              }}
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                isDarkMode
                                  ? "bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 shadow-orange-400/25"
                                  : "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-orange-500/30"
                              }`}
                            >
                              <User className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          className="flex items-start gap-3 justify-start"
                        >
                          {/* Bot avatar */}
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                              isDarkMode
                                ? "bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-amber-500/25"
                                : "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/30"
                            }`}
                          >
                            <Brain className="h-4 w-4 text-white" />
                          </motion.div>

                          {/* Bot loading bubble */}
                          <motion.div
                            className={`max-w-[70%] p-4 rounded-2xl shadow-md backdrop-blur-sm ${
                              isDarkMode
                                ? "bg-gradient-to-r from-gray-800/80 via-gray-700/60 to-gray-800/80 text-gray-100 border border-gray-600/50"
                                : "bg-gradient-to-r from-gray-100/80 via-white/60 to-gray-100/80 text-gray-900 border border-gray-300/50"
                            }`}
                          >
                            <div ref={bottomRef} className="flex items-center gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    isDarkMode ? "bg-amber-400" : "bg-amber-600"
                                  }`}
                                  animate={{ y: [0, -6, 0] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      placeholder="Ask a question about your data..."
                      value={chatInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setChatInput(e.target.value)
                      }
                      onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && sendMessage()
                      }
                      className={`flex-1 rounded-xl border-1 transition-all duration-200 backdrop-blur-sm ${
                        isDarkMode
                          ? "border-gray-700/50 focus:border-amber-400/50 bg-gray-800/50 text-white placeholder:text-gray-400"
                          : "border-gray-300/50 focus:border-amber-500/50 bg-white/50 text-gray-900 placeholder:text-gray-500"
                      }`}
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={sendMessage}
                        disabled={!chatInput.trim()}
                        className={`rounded-xl cursor-pointer shadow-lg text-white border-0 ${
                          isDarkMode
                            ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 shadow-amber-500/25"
                            : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 shadow-amber-500/30"
                        }`}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
