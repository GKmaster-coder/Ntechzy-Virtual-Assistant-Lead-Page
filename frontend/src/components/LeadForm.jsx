import React, { useState } from "react";
import { motion } from "framer-motion";

const LeadForm = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [inputError, setInputError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (inputError) setInputError("");
  };

  const handleFormSubmit = () => {
    const emptyField = fields.find(
      (field) => field.required && !formData[field.name]
    );
    if (emptyField) {
      setInputError(`Please fill in the ${emptyField.label} field`);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="mt-6 space-y-4">
      {fields.map((field, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            name={field.name}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            required={field.required}
          />
        </div>
      ))}
      {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        onClick={handleFormSubmit}
      >
        Submit Information
      </motion.button>
    </div>
  );
};

export default LeadForm;
