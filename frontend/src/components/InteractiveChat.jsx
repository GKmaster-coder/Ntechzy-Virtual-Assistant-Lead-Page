import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveChat = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
  const [inputError, setInputError] = useState('');

  // Chat flow configuration
  const chatSteps = [
    {
      type: 'welcome',
      message:
        "Welcome! We'll help determine if you qualify for our program. This will only take a few moments. All information is confidential.",
      controls: [{ type: 'button', label: 'Start Assessment', value: 'start' }]
    },
    {
      type: 'question',
      message: "Were you exposed to the substance between 1990-2010?",
      controls: [
        { type: 'button', label: 'Yes', value: 'yes' },
        { type: 'button', label: 'No', value: 'no' }
      ]
    },
    {
      type: 'question',
      message: "When did the exposure occur?",
      controls: [
        { type: 'button', label: 'Before 2005', value: 'pre-2005' },
        { type: 'button', label: '2005-2015', value: '2005-2015' },
        { type: 'button', label: 'After 2015', value: 'post-2015' }
      ]
    },
    {
      type: 'question',
      message: "Have you received a medical diagnosis related to this exposure?",
      controls: [
        { type: 'button', label: 'Yes, I have a diagnosis', value: 'diagnosed' },
        { type: 'button', label: 'No official diagnosis', value: 'undiagnosed' },
        { type: 'button', label: 'I suspect but not confirmed', value: 'suspected' }
      ]
    },
    {
      type: 'question',
      message: "Have you already hired a lawyer for this case?",
      controls: [
        { type: 'button', label: 'Yes', value: 'already-lawyer' },
        { type: 'button', label: 'No', value: 'no-lawyer' }
      ]
    },
    {
      type: 'message',
      message:
        "Based on your answers, you may qualify! Let’s get your contact details so our legal team can review your case.",
      controls: [{ type: 'button', label: 'Continue', value: 'continue' }]
    },
    {
      type: 'form',
      message: "Please provide your contact information:",
      fields: [
        { type: 'text', name: 'name', label: 'Full Name', required: true },
        { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
        { type: 'email', name: 'email', label: 'Email Address', required: true },
        { type: 'text', name: 'zip', label: 'Zip Code', required: true },
        {
          type: 'checkbox',
          name: 'agree',
          label:
            'I agree to be contacted and provide my consent for audio/video verification if needed',
          required: true
        }
      ]
    },
    {
      type: 'failure',
      message:
        "It looks like you may already be represented, so we cannot proceed."
    }
  ];

  // Typing effect
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle responses
  const handleResponse = (value, stepType) => {
    if (stepType === 'welcome' && value === 'start') {
      setCurrentStep(1);
      return;
    }

    if (stepType === 'question') {
      setUserResponses({ ...userResponses, [currentStep]: value });

      // Branching logic
      if (currentStep === 1 && value === 'no') {
        return setCurrentStep(chatSteps.findIndex(s => s.type === 'failure'));
      }
      if (currentStep === 3 && value === 'undiagnosed') {
        // Restart if "No official diagnosis"
        setUserResponses({});
        setInputError('');
        return setCurrentStep(0);
      }
      if (currentStep === 4 && value === 'already-lawyer') {
        return setCurrentStep(chatSteps.findIndex(s => s.type === 'failure'));
      }
      if (currentStep === 4 && value === 'no-lawyer') {
        return setCurrentStep(5); // go to eligibility result
      }

      setCurrentStep(currentStep + 1);
    }

    if (stepType === 'message' && value === 'continue') {
      setCurrentStep(6); // go to form
    }
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserResponses({
      ...userResponses,
      [name]: type === 'checkbox' ? checked : value
    });
    if (inputError) setInputError('');
  };

  // Submit form
  const handleFormSubmit = () => {
    const currentFields = chatSteps[6].fields;
    const emptyField = currentFields.find((field) => {
      if (field.type === 'checkbox') {
        return field.required && !userResponses[field.name];
      }
      return field.required && !userResponses[field.name];
    });
    if (emptyField) {
      setInputError(
        emptyField.type === "checkbox"
          ? `Please check "${emptyField.label}"`
          : `Please enter ${emptyField.label}`
      );
      return;
    }
    alert('Thank you for your information! We will be in touch soon.');
  };

  // Controls UI
  const renderControls = () => {
    const step = chatSteps[currentStep];
    if (!step || isTyping) return null;

    if (
      step.type === 'welcome' ||
      step.type === 'question' ||
      step.type === 'message'
    ) {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {step.controls?.map((control, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => handleResponse(control.value, step.type)}
            >
              {control.label}
            </motion.button>
          ))}
        </div>
      );
    }

    if (step.type === 'form') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-4"
        >
          {step.fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-0 ">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.name}
                  className="mr-2"
                  checked={!!userResponses[field.name]}
                  onChange={handleInputChange}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={userResponses[field.name] || ''}
                  onChange={handleInputChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
          <motion.button
            whileHover={{ scale: 0.97 }}
            whileTap={{ scale: 0.93 }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all mt-4 md:mt-10 pb-3"
            onClick={handleFormSubmit}
          >
            Submit Information
          </motion.button>
        </motion.div>
      );
    }

    if (step.type === 'failure') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mt-4"
          onClick={() => {
            setCurrentStep(0);
            setUserResponses({});
            setInputError('');
          }}
        >
          Start Over
        </motion.button>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-lg mx-auto p-2 px-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-[1rem] shadow-lg flex flex-col h-full">
      {/* Progress */}
      {currentStep > 0 && currentStep <= 4 && (
        <>
          <div className="text-sm text-gray-500 mb-2">Step {currentStep} of 4</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4">
        <AnimatePresence>
          {currentStep < chatSteps.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3 overflow-hidden">
                <img
                  src="/avtar.png"
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow max-w-[80%]">
                {isTyping ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
                  </div>
                ) : (
                  <p>{chatSteps[currentStep].message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {Object.entries(userResponses).map(([step, response]) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div className="bg-blue-100 px-4 py-3 rounded-2xl rounded-tr-none shadow max-w-[80%]">
              {response}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div>{renderControls()}</div>
    </div>
  );
};

export default InteractiveChat;
