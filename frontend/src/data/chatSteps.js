import { DecimalsArrowLeft } from "lucide-react";

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

  export default chatSteps;