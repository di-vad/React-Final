import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./StockChat.css";

const socket = io("http://localhost:4000");

const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);

const renderMessage = (text, index) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <p key={index}>
      {parts.map((part, i) => {
        if (urlRegex.test(part)) {
          return isImageUrl(part) ? (
            <div key={i}>
              <a href={part} target="_blank" rel="noreferrer">
                <img
                  src={part}
                  alt="shared"
                  style={{ maxWidth: "100%", marginTop: 8 }}
                />
              </a>
            </div>
          ) : (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#007bff" }}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
};

function StockChat({ room }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

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
    <div className="stock-chat-box">
      <div className="stock-chat-log">
        {messages.map((msg, i) => renderMessage(msg, i))}
      </div>
      <div className="stock-chat-input">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default StockChat;
