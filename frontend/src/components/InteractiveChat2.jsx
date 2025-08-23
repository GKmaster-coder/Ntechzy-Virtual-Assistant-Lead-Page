import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createUser } from "../api/userApi"; // backend API
import chatSteps from "../data/chatSteps";

const InteractiveChat2 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Typing + message display
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      const step = chatSteps[currentStep];
      setConversation((prev) => [...prev, { from: "bot", text: step.message }]);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Handle response
  const handleResponse = async (value, stepType) => {
    const step = chatSteps[currentStep];
    setConversation((prev) => [...prev, { from: "user", text: value }]);

    if (stepType === "welcome" && value === "start") {
      setCurrentStep(1);
      return;
    }

    if (stepType === "question") {
      if (currentStep === 1 && value === "no")
        return setCurrentStep(chatSteps.findIndex((s) => s.type === "failure"));
      if (currentStep === 3 && value === "undiagnosed") {
        setUserResponses({});
        setConversation([]);
        return setCurrentStep(0);
      }
      if (currentStep === 4 && value === "already-lawyer")
        return setCurrentStep(chatSteps.findIndex((s) => s.type === "failure"));
      if (currentStep === 4 && value === "no-lawyer") return setCurrentStep(5);

      setCurrentStep(currentStep + 1);
      return;
    }

    if (stepType === "message" && value === "continue") {
      setCurrentStep(6);
      return;
    }

    if (stepType === "form-field") {
      let cleaned = value.trim();
      let isValid = true;

      // Validation rules
      if (step.field === "name" && cleaned.length < 3) isValid = false;
      if (step.field === "phone" && !/^\d{10}$/.test(cleaned)) isValid = false;
      if (step.field === "email" && !/^\S+@\S+\.\S+$/.test(cleaned)) isValid = false;
      if (step.field === "zip" && !/^\d{5,6}$/.test(cleaned)) isValid = false;
      if (step.field === "agree" && !["yes", "no"].includes(cleaned.toLowerCase()))
        isValid = false;

      if (!isValid) {
        setConversation((prev) => [
          ...prev,
          { from: "error", text: "⚠️ You entered a wrong Data." },
          { from: "bot", text: step.message },
        ]);
        setInputValue("");
        return;
      }

      // If valid
      if (step.field === "agree") {
        cleaned = cleaned.toLowerCase() === "yes";
      }
      setUserResponses((prev) => ({ ...prev, [step.field]: cleaned }));
      setInputValue("");

      if (step.field === "agree") {
        try {
          setLoading(true);
          await createUser({
            name: userResponses.name,
            phone: userResponses.phone,
            email: userResponses.email,
            zip: userResponses.zip,
            agree: cleaned,
          });
          toast.success("✅ Details submitted!");
          setCurrentStep(chatSteps.findIndex((s) => s.type === "success"));
        } catch (err) {
          toast.error("❌ Submission failed.");
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() && !loading) {
      handleResponse(inputValue, "form-field");
    }
  };

  // Controls
  const renderControls = () => {
    const step = chatSteps[currentStep];
    if (!step || isTyping) return null;

    if (step.type === "welcome" || step.type === "question" || step.type === "message") {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {step.controls?.map((control, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"
              onClick={() => handleResponse(control.value, step.type)}
              disabled={loading}
            >
              {control.label}
            </motion.button>
          ))}
        </div>
      );
    }

    // ✅ Updated: input + Next button
    if (step.type === "form-field") {
      return (
        <div className="flex items-center gap-2 mt-4">
          <input
            type={step.field === "phone" ? "tel" : "text"}
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border p-2 rounded"
            disabled={loading}
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (inputValue.trim() && !loading) {
                handleResponse(inputValue, "form-field");
              }
            }}
            disabled={loading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          >
            Next
          </motion.button>
        </div>
      );
    }

    if (step.type === "failure" || step.type === "success") {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow mt-4"
          onClick={() => {
            setCurrentStep(0);
            setUserResponses({});
            setConversation([]);
            setInputValue("");
          }}
          disabled={loading}
        >
          Restart
        </motion.button>
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-xl shadow-lg flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-hide">
        {conversation.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: msg.from === "bot" ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.from === "bot"
                ? "items-start"
                : msg.from === "error"
                ? "items-start"
                : "justify-end"
            }`}
          >
            {msg.from === "bot" && (
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3">
                <img src="/avtar.png" alt="bot" className="w-full h-full rounded-full" />
              </div>
            )}
            {msg.from === "error" && (
              <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full mr-3">
                ⚠️
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl shadow max-w-[80%] ${
                msg.from === "bot"
                  ? "bg-gray-100 rounded-tl-none"
                  : msg.from === "error"
                  ? "bg-red-100 text-red-700 rounded-tl-none"
                  : "bg-blue-100 rounded-tr-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 animate-pulse" />
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">Typing...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div>{renderControls()}</div>
    </div>
  );
};

export default InteractiveChat2;
