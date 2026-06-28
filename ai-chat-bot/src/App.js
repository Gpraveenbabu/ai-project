import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I can help you study!" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", text: input };
  setMessages(prev => [...prev, userMsg]);

  const userInput = input;
  setInput("");

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();

    const botMsg = {
      role: "bot",
      text: data.reply || "No response from AI",
    };

    setMessages(prev => [...prev, botMsg]);

  } catch (error) {
    const botMsg = {
      role: "bot",
      text: "Error connecting to backend ❌",
    };

    setMessages(prev => [...prev, botMsg]);
  }
};

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#343541",
      color: "white"
    }}>

      {/* Header */}
      <div style={{
        padding: "10px",
        textAlign: "center",
        borderBottom: "1px solid gray"
      }}>
        AI Study Assistant
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: "10px"
          }}>
            <div style={{
              background: msg.role === "user" ? "#2563eb" : "#444654",
              padding: "10px",
              borderRadius: "8px",
              maxWidth: "70%"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid gray"
      }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}