import React, { useContext, useState, useRef } from "react";
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

  function speak(message) {
    let utter = new SpeechSynthesisUtterance(message);
    utter.rate = 1.2;
    window.speechSynthesis.speak(utter);
  }

  if (!recognitionRef.current) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
  }

  const recognition = recognitionRef.current;

  recognition.onstart = () => {
    speak("Hello! How can I help you?");
  };

  recognition.onresult = (event) => {
    let transcript = event.results[event.results.length - 1][0].transcript
      .trim()
      .toLowerCase();

    console.log("Heard:", transcript);

    const stopWords = [
      "the",
      "please",
      "a",
      "for",
      "me",
      "want",
      "to",
      "show",
      "search",
      "open",
      "some",
    ];
    const allowedKeywords = [
      "shirt",
      "tshirt",
      "t-shirt",
      "pant",
      "pants",
      "jeans",
      "jacket",
      "men",
      "women",
      "kid",
      "kids",
      "girl",
      "boy",
      "kurta",
      "saree",
      "dress",
    ];

    let words = transcript.split(" ").filter((w) => !stopWords.includes(w));
    let matchedWords = words.filter((w) =>
      allowedKeywords.some((k) => w.includes(k))
    );

    // ✅ FIXED SEARCH MODE (Ends fully after search)
    if (isSearchMode) {
      if (matchedWords.length > 0) {
        let finalSearch = matchedWords.join(" ");
        setSearch(finalSearch);
        setIsSearchMode(false);
        // ✅ IMPORTANT: allow navigation again
        setShowSearch(true);
      } else {
        speak("Please say product names like shirt, pant, jeans etc.");
      }
      return;
    }

    // ✅ OPEN SEARCH
    if (transcript.includes("open search") || transcript.includes("search")) {
      speak("Search activated. Tell me what product you need.");
      setShowSearch(true);
      navigate("/collection");
      setIsSearchMode(true);
      return;
    }

    // ✅ CLOSE SEARCH
    if (transcript.includes("close search") || transcript.includes("close")) {
      speak("Closing search.");
      setShowSearch(false);
      setIsSearchMode(false);
      return;
    }

    // ✅ PAGE NAVIGATION ALWAYS WORKS
    const routes = [
      { keywords: ["home"], path: "/" },
      { keywords: ["collection", "products"], path: "/collection" },
      { keywords: ["about"], path: "/about" },
      { keywords: ["cart"], path: "/cart" },
      { keywords: ["contact"], path: "/contact" },
      { keywords: ["orders", "my order"], path: "/order" },
    ];

    for (let r of routes) {
      if (r.keywords.some((k) => transcript.includes(k))) {
        if (r.keywords.includes("home")) speak("Opening home page");
        else if (
          r.keywords.includes("collection") ||
          r.keywords.includes("products")
        )
          speak("Opening collection page");
        else speak(`Opening ${r.keywords[0]} page`);

        navigate(r.path);
        setShowSearch(false);
        setIsSearchMode(false);
        return;
      }
    }

    toast.error(
      "I didn't understand. Say commands like home, cart, search, etc."
    );
  };

  recognition.onend = () => {
    setActiveAi(false);
  };

  const toggleAI = () => {
    if (!activeAi) {
      openingSound.play();
      setActiveAi(true);
      recognition.start();
    } else {
      recognition.stop();
      setActiveAi(false);
      setIsSearchMode(false);
      speak("Thank you. If you need help again, just tap me.");
    }
  };

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={toggleAI}
    >
      <img
        src={ai}
        alt="AI Assistant"
        className={`w-[60px] md:w-[80px] lg:w-[100px] cursor-pointer ${
          activeAi ? "scale-125" : "scale-100"
        } transition-transform`}
        style={{
          filter: `${
            activeAi
              ? "drop-shadow(0px 0px 35px #00d2fc)"
              : "drop-shadow(0px 0px 15px black)"
          }`,
        }}
      />
    </div>
  );
}

export default Ai;
