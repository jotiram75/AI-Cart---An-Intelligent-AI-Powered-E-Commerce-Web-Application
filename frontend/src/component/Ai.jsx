import React, { useContext, useState, useEffect, useRef } from "react";
import ai from "../assets/ai.png";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import open from "../assets/open.mp3";
import { toast } from "react-toastify";
import axios from "axios";

function Ai() {
  const { showSearch, setShowSearch, setSearch } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  const recognitionRef = useRef(null);
  const openingSound = new Audio(open);

  useEffect(() => {
    // Fetch suggested questions on mount
    const fetchQuestions = async () => {
        try {
            const { data } = await axios.get(`${serverUrl}/api/ai/suggest-questions`);
            if (data.success) {
                setSuggestedQuestions(data.questions);
            }
        } catch (error) {
            console.error("Failed to fetch suggested questions", error);
        }
    };
    fetchQuestions();
  }, [serverUrl]);

  const isSpeakingRef = useRef(false);

  const speak = (message) => {
    // Cancel any ongoing speech to avoid overlap
    window.speechSynthesis.cancel();
    let utter = new SpeechSynthesisUtterance(message);
    utter.rate = 1.0;
    
    // Try to find an attractive/high-quality female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = 
      voices.find(v => v.name === 'Google UK English Female') ||
      voices.find(v => v.name === 'Google US English Female') ||
      voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.name.toLowerCase().includes('victoria'));
    
    if (femaleVoice) {
        utter.voice = femaleVoice;
    }
    
    utter.onstart = () => {
        isSpeakingRef.current = true;
    };
    
    utter.onend = () => {
        isSpeakingRef.current = false;
    };
    
    utter.onerror = () => {
        isSpeakingRef.current = false;
    };
    
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice assistant is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Voice Assistant Started");
    };

    recognition.onend = () => {
      console.log("Voice Assistant Stopped");
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied.");
        setActiveAi(false);
      }
    };

    return () => {
        if(recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, []);

  // Effect to handle recognition result separately to access latest state
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = (event) => {
        if (isSpeakingRef.current) {
            console.log("Ignored transcript while speaking to prevent loop.");
            return;
        }

        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        
        console.log("Heard:", transcript);

        handleCommand(transcript);
    };
  }, [isSearchMode, activeAi]); 


  const handleCommand = async (transcript) => {
    // 1. Defined Navigation Commands (Priority to minimize API calls)
    const navCommands = [
        { keywords: ["home"], path: "/", message: "Opening home page" },
        { keywords: ["collection", "product", "shop", "store", "new arrival"], path: "/collection", message: "Opening collection" },
        { keywords: ["visual search", "image search", "search by image"], path: "/visual-search", message: "Opening visual search" },
        { keywords: ["about"], path: "/about", message: "Opening about page" },
        { keywords: ["cart", "basket"], path: "/cart", message: "Opening cart" },
        { keywords: ["contact", "support"], path: "/contact", message: "Opening contact page" },
        { keywords: ["order", "track"], path: "/order", message: "Opening your orders" }, // Covers "Check my order status"
        { keywords: ["login", "sign in"], path: "/login", message: "Opening login page" },
        { keywords: ["policy", "return"], path: "/returns", message: "Opening return policy" },
    ];

    for (const route of navCommands) {
      if (route.keywords.some((k) => transcript.includes(k))) {
        speak(route.message);
        navigate(route.path);
        return;
      }
    }

    // 2. Stop/Close Command
    if (transcript.includes("close") || transcript.includes("stop") || transcript.includes("exit")) {
        speak("Goodbye!");
        toggleAI(); 
        return;
    }

    // 3. Fallback to Gemini AI for Dynamic intent handling
    try {
        const { data } = await axios.post(`${serverUrl}/api/ai/voice-command`, {
            message: transcript
        });
        
        if (data.success && data.result) {
            const { action, message, path, query } = data.result;
            
            if (message) {
                speak(message);
            }
            
            if (action === "navigate" && path) {
                navigate(path);
            } else if (action === "search" && query) {
                setSearch(query);
                setShowSearch(true);
                navigate("/collection"); 
                setIsSearchMode(false);
            } else if (action === "stop") {
                toggleAI(); 
            }
        } else {
             speak("I am not sure about that. Try asking for products or say 'Home'.");
        }
    } catch (error) {
        console.error("AI Voice Command Error:", error);
        speak("I'm having trouble connecting. Please try again.");
    }
  };


  const toggleAI = () => {
    if (!recognitionRef.current) return;

    if (activeAi) {
      recognitionRef.current.stop();
      setActiveAi(false);
      setIsSearchMode(false);
      window.speechSynthesis.cancel();
    } else {
      openingSound.play().catch(e => console.log("Audio play failed", e));
      recognitionRef.current.start();
      setActiveAi(true);
      setTimeout(()=> speak("Hello! How can I help?"), 1000); 
    }
  };

  const handleSuggestionClick = (question) => {
      // Treat clicks exactly like spoken commands
      handleCommand(question.toLowerCase());
  };



  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-center gap-2">
      
      {/* Suggestions Popover */}
      {activeAi && suggestedQuestions.length > 0 && (
          <div className="mb-2 flex flex-col gap-2 animate-fade-in">
              {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSuggestionClick(q)}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-md border border-gray-100 hover:bg-primary hover:text-white transition-all text-left whitespace-nowrap"
                  >
                      "{q}"
                  </button>
              ))}
          </div>
      )}

      {/* AI Button */}
      <div onClick={toggleAI}>
        <img
            src={ai}
            alt="AI Assistant"
            className={`w-18 sm:w-20 cursor-pointer ${
            activeAi ? "scale-105" : "scale-100"
            } transition-transform duration-300 ease-in-out hover:scale-110`}
            style={{
            filter: activeAi
                ? "drop-shadow(0px 0px 20px #00d2fc)"
                : "drop-shadow(0px 0px 5px black)",
            }}
        />
      </div>
    </div>
  );
}

export default Ai;
