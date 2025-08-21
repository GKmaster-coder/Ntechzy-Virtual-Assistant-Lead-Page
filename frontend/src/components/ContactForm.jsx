import React, { useState } from "react";
import { createUser } from "../api/userApi"; // adjust path if needed
import toast from "react-hot-toast";

const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zip: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createUser(formData);
      console.log("User saved:", response);

      toast.success("✅ Your details have been submitted!");
      setFormData({ name: "", phone: "", email: "", zip: "", agree: false }); // reset form

      if (onSuccess) onSuccess(); // optional callback
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone (10 digits)"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="text"
        name="zip"
        placeholder="ZIP Code"
        value={formData.zip}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />
        <span>I agree to the terms</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
