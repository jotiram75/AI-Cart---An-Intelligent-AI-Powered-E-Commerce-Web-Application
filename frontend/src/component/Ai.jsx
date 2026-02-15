import React, { useContext, useState, useEffect, useRef } from "react";
import ai from "../assets/ai.png";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import open from "../assets/open.mp3";
import { toast } from "react-toastify";

function Ai() {
  const { showSearch, setShowSearch, setSearch } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const recognitionRef = useRef(null);
  const openingSound = new Audio(open);

  const speak = (message) => {
    // Cancel any ongoing speech to avoid overlap
    window.speechSynthesis.cancel();
    let utter = new SpeechSynthesisUtterance(message);
    utter.rate = 1.0;
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
      // If we want it to stay active until manually toggled, we might need to restart it here
      // But for a toggle-based UI, stopping is fine, just update state if needed
      // Note: We don't set activeAi(false) here automatically to avoid UI flickering if it stops briefly
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
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        
        console.log("Heard:", transcript);

        handleCommand(transcript);
    };

    // We don't put handleCommand in dependecy to avoid re-binding too often, 
    // but handleCommand needs access to latest state (which it gets via closures if defined inside component or via refs)
  }, [isSearchMode, activeAi]); // Re-bind onResult when mode changes to capture correct closure

  const handleCommand = (transcript) => {
    const stopWords = ["the", "please", "a", "for", "me", "want", "to", "show", "search", "open", "some", "i", "need"];
    const allowedKeywords = [
      "shirt", "tshirt", "t-shirt", "pant", "pants", "jeans", "jacket",
      "men", "women", "kid", "kids", "girl", "boy", "kurta", "saree", "dress",
      "shoes", "top", "fashion"
    ];

    // --- SEARCH MODE ---
    if (isSearchMode) {
      if (transcript.includes("cancel") || transcript.includes("stop")) {
        speak("Search cancelled.");
        setIsSearchMode(false);
        return;
      }

      let words = transcript.split(" ").filter((w) => !stopWords.includes(w));
      let matchedWords = words.filter((w) => allowedKeywords.some((k) => w.includes(k)));
      
      // If found keywords or long enough phrase, assume it's a search query
      if (matchedWords.length > 0 || words.length > 0) {
        let finalSearch = matchedWords.length > 0 ? matchedWords.join(" ") : words.join(" ");
        speak("Searching for " + finalSearch);
        setSearch(finalSearch);
        setShowSearch(true);
        navigate("/collection"); // Ensure we are on collection page to see results
        setIsSearchMode(false);
      } else {
        speak("I didn't catch that. Please say the product name.");
      }
      return;
    }

    // --- STANDARD COMMANDS ---

    // 1. Activate Search
    if (transcript.includes("search") || transcript.includes("find")) {
      speak("What are you looking for?");
      setShowSearch(true);
      navigate("/collection");
      setIsSearchMode(true);
      return;
    }

    // 2. Navigation
    const routes = [
      { keywords: ["home"], path: "/", message: "Opening home page" },
      { keywords: ["collection", "product", "shop", "store"], path: "/collection", message: "Opening collection" },
      { keywords: ["about"], path: "/about", message: "Opening about page" },
      { keywords: ["cart", "basket"], path: "/cart", message: "Opening cart" },
      { keywords: ["contact", "support"], path: "/contact", message: "Opening contact page" },
      { keywords: ["orders", "my order"], path: "/order", message: "Opening your orders" },
      { keywords: ["login", "sign in"], path: "/login", message: "Opening login page" },
    ];

    for (const route of routes) {
      if (route.keywords.some((k) => transcript.includes(k))) {
        speak(route.message);
        navigate(route.path);
        return;
      }
    }

    // 3. Close/Stop
    if (transcript.includes("close") || transcript.includes("stop") || transcript.includes("exit")) {
        speak("Goodbye!");
        toggleAI(); // Use the function to stop
        return;
    }

    // Fallback
    // Only speak "didn't understand" if we are consistently confident it was a command directed at us
    // For now, maybe just ignore valid noise or give a generic prompt
    // speak("Sorry, I didn't understand. You can say Home, Cart, or Search.");
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
      setTimeout(()=> speak("Hello! How can I help?"), 1000); // Slight delay to not record itself
    }
  };

  return (
    <div
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50"
      onClick={toggleAI}
    >
      <img
        src={ai}
        alt="AI Assistant"
        className={`w-14 sm:w-16 cursor-pointer ${
          activeAi ? "scale-105" : "scale-100"
        } transition-transform duration-300 ease-in-out hover:scale-110`}
        style={{
          filter: activeAi
            ? "drop-shadow(0px 0px 20px #00d2fc)"
            : "drop-shadow(0px 0px 5px black)",
        }}
      />
    </div>
  );
}

export default Ai;
