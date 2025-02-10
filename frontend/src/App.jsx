import { useState } from "react"
import {mistral} from "../../backend/apiMistral.js"
function App() {
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Comment puis-je vous aider ?", sender: "bot" },
  ]);
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false);

  
  const sendMessage = async() => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]); 
    setInput("");
    setLoading(true); 

    try {
      const data = await mistral(input);
      console.log(data['message']['content']); 

      const botMessage = {
        text: data['message']['content'] || "Je n'ai pas compris votre demande.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]); 
    } catch (error) {
      console.error("Erreur API :", error);
      setMessages((prev) => [
        ...prev,
        { text: "Erreur lors de la récupération de la réponse.", sender: "bot" },
      ]);
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white text-center p-4 text-xl font-bold">Chatbot</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-fit max-w-xs ${
              msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
          placeholder="Écrivez un message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 ml-2 rounded-lg"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default App
