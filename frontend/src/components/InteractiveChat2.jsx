import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';   // ✅ import form

const InteractiveChat2 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
  const [inputError, setInputError] = useState('');
  const [conversation, setConversation] = useState([]);

  const messagesEndRef = useRef(null);

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

  // Typing effect & bot message appending
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      const step = chatSteps[currentStep];
      setConversation(prev => {
        if (
          prev.length &&
          prev[prev.length - 1].from === 'bot' &&
          prev[prev.length - 1].text === step.message
        ) {
          return prev;
        }
        return [...prev, { from: 'bot', text: step.message }];
      });
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [currentStep]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, currentStep]);

  // Handle responses
  const handleResponse = (value, stepType) => {
    const step = chatSteps[currentStep];

    if (stepType === 'question' || stepType === 'welcome' || stepType === 'message') {
      setConversation(prev => [...prev, { from: 'user', text: value }]);
    }

    if (stepType === 'welcome' && value === 'start') {
      setCurrentStep(1);
      return;
    }

    if (stepType === 'question') {
      setUserResponses({ ...userResponses, [currentStep]: value });

      if (currentStep === 1 && value === 'no') {
        return setCurrentStep(chatSteps.findIndex(s => s.type === 'failure'));
      }
      if (currentStep === 3 && value === 'undiagnosed') {
        setUserResponses({});
        setInputError('');
        setConversation([]);
        return setCurrentStep(0);
      }
      if (currentStep === 4 && value === 'already-lawyer') {
        return setCurrentStep(chatSteps.findIndex(s => s.type === 'failure'));
      }
      if (currentStep === 4 && value === 'no-lawyer') {
        return setCurrentStep(5);
      }

      setCurrentStep(currentStep + 1);
    }

    if (stepType === 'message' && value === 'continue') {
      setCurrentStep(6);
    }
  };

  // Input change
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
        <ContactForm
          fields={step.fields}
          userResponses={userResponses}
          handleInputChange={handleInputChange}
          inputError={inputError}
          handleFormSubmit={handleFormSubmit}
        />
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
            setConversation([]);
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
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4 scrollbar-hide">
        {conversation.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: msg.from === 'bot' ? 20 : 0, x: msg.from === 'user' ? 20 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            className={`flex ${msg.from === 'bot' ? 'items-start' : 'justify-end'}`}
          >
            {msg.from === 'bot' && (
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3 overflow-hidden">
                <img src="/avtar.png" alt="icon" className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl shadow max-w-[80%] ${
                msg.from === 'bot'
                  ? 'bg-gray-100 rounded-tl-none'
                  : 'bg-blue-100 rounded-tr-none'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3 overflow-hidden">
              <img src="/avtar.png" alt="icon" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow max-w-[80%]">
              <p>Typing...</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div>{renderControls()}</div>
    </div>
  );
};

export default InteractiveChat2;
