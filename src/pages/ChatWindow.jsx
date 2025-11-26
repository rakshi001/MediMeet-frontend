import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import FileUploadButton from "../components/FileUploadButton";

const socket = io("https://medifypro-backend.onrender.com");

const ChatWindow = ({ room, userId, userName, onClose }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll chat to bottom when chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Join room and setup socket listeners on mount and when room changes
  useEffect(() => {
    socket.emit("joinRoom", { room });

    socket.on("previousMessages", (messages) => {
      setChat(messages);
      setLoading(false);
    });

    socket.on("recievedMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // socket.on("typing", ({ senderName }) => {
    //   if (senderName !== userName) {
        
    //     setTypingUser(senderName);
    //     setIsTyping(true);
    //     const timeout = setTimeout(() => setIsTyping(false), 2000);
    //     return () => clearTimeout(timeout);
    //   }
    // });
    socket.on("typing", ({ senderName }) => {
      if (senderName !== userName) {
        setTypingUser(senderName);
        setIsTyping(true);

        // Clear previous timeout if exists
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 2000);
      }
    });

   

    return () => {
      socket.off("previousMessages");
      socket.off("recievedMessage");
      socket.off("typing");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [room, userName]);

  // Send text message handler
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      room,
      message,
      sender: userId,
      senderName: userName,
    };

    socket.emit("sendMessage", newMsg);
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:max-w-2xl md:mx-auto md:my-10 md:rounded-2xl md:shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-400 to-violet-500 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat with Doctor</h2>
        <button
          onClick={onClose}
          className="text-white text-xl hover:scale-110 transition"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-violet-50 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500 mt-4">Loading chat...</div>
        ) : (
          chat.map((msg, idx) => {
            const isCurrentUser = msg.sender === userId;
            return (
              <div
                key={idx}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs shadow ${
                    isCurrentUser ? "bg-violet-200 text-black" : "bg-white"
                  }`}
                >
                  <div className="text-xs text-gray-600 mb-1 font-medium">
                    {isCurrentUser ? "You" : msg.senderName || msg.sender}
                  </div>
                  <div className="text-sm break-words">
                    {msg.message && <div>{msg.message}</div>}
                    {msg.file && (
                      <div className="mt-1">
                        <a
                          href={msg.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-700 underline"
                        >
                          📎 {msg.file.originalname}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && typingUser && (
          <div className="text-sm text-gray-500 italic">
            {typingUser} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input and File Upload */}
      <form
        onSubmit={sendMessage}
        className="p-4 flex gap-2 bg-white border-t border-gray-200"
      >
        <FileUploadButton
          room={room}
          userId={userId}
          userName={userName}
          onFileUploaded={(newFileMessage) => {
            setChat((prev) => [...prev, newFileMessage]);
          }}
          
        />

        <input
          type="text"
          className="flex-1 border border-violet-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-violet-300"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", { room, senderName: userName });
          }}
          placeholder="Type your message..."
          aria-label="Type your message"
          autoComplete="off"
        />

        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
