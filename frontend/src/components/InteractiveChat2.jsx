import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createUser } from "../api/userApi"; // backend API

const InteractiveChat2 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const chatSteps = [
    {
      type: "welcome",
      message:
        "Welcome! We'll help determine if you qualify for our program. This will only take a few moments. All information is confidential.",
      controls: [{ type: "button", label: "Start Assessment", value: "start" }],
    },
    {
      type: "question",
      message: "Were you exposed to the substance between 1990-2010?",
      controls: [
        { type: "button", label: "Yes", value: "yes" },
        { type: "button", label: "No", value: "no" },
      ],
    },
    {
      type: "question",
      message: "When did the exposure occur?",
      controls: [
        { type: "button", label: "Before 2005", value: "pre-2005" },
        { type: "button", label: "2005-2015", value: "2005-2015" },
        { type: "button", label: "After 2015", value: "post-2015" },
      ],
    },
    {
      type: "question",
      message: "Have you received a medical diagnosis related to this exposure?",
      controls: [
        { type: "button", label: "Yes, I have a diagnosis", value: "diagnosed" },
        { type: "button", label: "No official diagnosis", value: "undiagnosed" },
        { type: "button", label: "I suspect but not confirmed", value: "suspected" },
      ],
    },
    {
      type: "question",
      message: "Have you already hired a lawyer for this case?",
      controls: [
        { type: "button", label: "Yes", value: "already-lawyer" },
        { type: "button", label: "No", value: "no-lawyer" },
      ],
    },
    {
      type: "message",
      message:
        "Based on your answers, you may qualify! Let’s get your contact details so our legal team can review your case.",
      controls: [{ type: "button", label: "Continue", value: "continue" }],
    },
    // Conversational form fields
    { type: "form-field", field: "name", message: "What’s your full name?" },
    { type: "form-field", field: "phone", message: "Please share your phone number." },
    { type: "form-field", field: "email", message: "What’s your email address?" },
    { type: "form-field", field: "zip", message: "Enter your ZIP code." },
    { type: "form-field", field: "agree", message: "Do you agree to be contacted? (yes/no)" },
    { type: "success", message: "✅ Thanks! Your details have been submitted successfully." },
    {
      type: "failure",
      message: "It looks like you may already be represented, so we cannot proceed.",
    },
  ];

  // Typing + message display
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      const step = chatSteps[currentStep];
      setConversation((prev) => [...prev, { from: "bot", text: step.message }]);
    }, 800); // faster typing duration

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Auto scroll to bottom on conversation update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Handle user response
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
      if (step.field === "agree") {
        cleaned = cleaned.toLowerCase() === "yes";
      }
      setUserResponses((prev) => ({ ...prev, [step.field]: cleaned }));

      setInputValue(""); // Clear input for next field

      // If last field → submit details
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

  // Enter key handler on input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() && !loading) {
      handleResponse(inputValue, "form-field");
    }
  };

  // Controls UI based on step
  const renderControls = () => {
    const step = chatSteps[currentStep];
    if (!step || isTyping) return null;

    if (
      step.type === "welcome" ||
      step.type === "question" ||
      step.type === "message"
    ) {
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

    if (step.type === "form-field") {
      return (
        <input
          type={step.field === "phone" ? "tel" : "text"}
          placeholder="Type your answer..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full border p-2 rounded"
          disabled={loading}
          autoFocus
        />
      );
    }

    // success or failure buttons
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
            className={`flex ${msg.from === "bot" ? "items-start" : "justify-end"}`}
          >
            {msg.from === "bot" && (
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3">
                <img src="/avtar.png" alt="bot" className="w-full h-full rounded-full" />
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl shadow max-w-[80%] ${
                msg.from === "bot" ? "bg-gray-100 rounded-tl-none" : "bg-blue-100 rounded-tr-none"
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
