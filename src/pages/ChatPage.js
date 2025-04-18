import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.css";

const socket = io("http://localhost:4000");

function ChatPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room = queryParams.get("room") || "general";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
  };

  const renderMessageContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        if (isImageUrl(part)) {
          return (
            <div key={index} style={{ margin: "0.5rem 0" }}>
              <a href={part} target="_blank" rel="noreferrer">
                <img
                  src={part}
                  alt="shared"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </a>
            </div>
          );
        } else {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#007bff" }}
            >
              {part}
            </a>
          );
        }
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  useEffect(() => {
    socket.emit("join-room", room);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      const fullMessage = `${new Date().toLocaleTimeString()} - ${message}`;
      socket.emit("send-message", { room, message: fullMessage });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat Room: {room}</h1>

      <div className="chat-box">
        <div className="chat-log">
          {messages.map((msg, i) => (
            <p key={i}>{renderMessageContent(msg)}</p>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
