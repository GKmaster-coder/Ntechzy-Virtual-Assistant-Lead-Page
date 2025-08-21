import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 0,
    type: "welcome",
    message: "👋 Hi there! Before we begin, please read this disclaimer.",
    options: ["Start"],
  },
  {
    id: 1,
    type: "buttons",
    message: "Were you exposed?",
    options: ["Yes", "No"],
  },
  {
    id: 2,
    type: "buttons",
    message: "When did this happen?",
    options: ["Before 2005", "2005–2015", "After 2015"],
  },
  {
    id: 3,
    type: "multi-choice",
    message: "Have you been diagnosed with any of the following?",
    options: ["Lung Disease", "Asbestosis", "Mesothelioma", "Other"],
  },
  {
    id: 4,
    type: "buttons",
    message: "Are you currently working with a lawyer?",
    options: ["Yes", "No"],
  },
];

export default function MainInteractionBox() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setShowMessage(false);
    const timer = setTimeout(() => setShowMessage(true), 1200); // typing delay
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentStep]: option });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Form complete! Data: " + JSON.stringify(answers, null, 2));
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto p-4 h-[100vh] bg-black rounded-2xl shadow-xl">
      {/* Progress */}
      <div className="flex justify-center items-center text-sm text-gray-500 mb-2">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded overflow-hidden">
        <motion.div
          className="h-2 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Chat Bubble */}
      <div className="mt-6 space-y-4">
        <AnimatePresence mode="wait">
          {!showMessage ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-100 px-4 py-2 rounded-lg inline-flex space-x-2"
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </motion.div>
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-100 px-4 py-2 rounded-lg inline-block max-w-xs"
            >
              {step.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Controls */}
        {showMessage && step.options && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {step.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
