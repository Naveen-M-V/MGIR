import React, { useState } from "react";
import BackButton from "../components/BackButton";

export default function PersonalCuratorForm({ onNext }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    whatsappAvailable: "No",
    email: "",
    preferredCommunication: "WhatsApp",
    travelType: "Family",
    totalVisitors: "",
    localCompanion: false,
    itineraryLength: "1 day - 75e",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Passing formData to parent or next step handler
    onNext(formData);
  };

  return (
    <>
      <BackButton variant="default" />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label htmlFor="firstName" className="block font-semibold mb-1">First Name:</label>
          <input 
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block font-semibold mb-1">Last Name:</label>
          <input 
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="contactNumber" className="block font-semibold mb-1">Contact Number:</label>
        <input 
          id="contactNumber"
          name="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <fieldset className="mb-4">
        <legend className="font-semibold mb-1">Are you available for a WhatsApp Call or Chat?</legend>
        <label className="mr-6">
          <input
            type="radio"
            name="whatsappAvailable"
            value="Yes"
            checked={formData.whatsappAvailable === "Yes"}
            onChange={handleChange}
            className="mr-1"
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="whatsappAvailable"
            value="No"
            checked={formData.whatsappAvailable === "No"}
            onChange={handleChange}
            className="mr-1"
          />
          No
        </label>
      </fieldset>

      <div className="mb-4">
        <label htmlFor="email" className="block font-semibold mb-1">E-mail Address:</label>
        <input 
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="preferredCommunication" className="block font-semibold mb-1">What is your preferred way of communication?</label>
        <select
          id="preferredCommunication"
          name="preferredCommunication"
          value={formData.preferredCommunication}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>WhatsApp</option>
          <option>Email</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="travelType" className="block font-semibold mb-1">Type of travel:</label>
        <select
          id="travelType"
          name="travelType"
          value={formData.travelType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>Family</option>
          <option>Couple</option>
          <option>Friends</option>
          <option>Solo trip</option>
          <option>Others</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="totalVisitors" className="block font-semibold mb-1">How many people in total are visiting to Rome?</label>
        <input
          type="number"
          id="totalVisitors"
          name="totalVisitors"
          min="1"
          value={formData.totalVisitors}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-6 flex items-start space-x-3">
        <input
          type="checkbox"
          id="localCompanion"
          name="localCompanion"
          checked={formData.localCompanion}
          onChange={handleChange}
          className="mt-1"
        />
        <label htmlFor="localCompanion" className="text-gray-700">
          Would you like to have your local companion with you during your stay?
          <br />
          <small className="text-sm text-gray-500">
            Note: Our guides will stay with you all day, tell you about the city, local culture, give you advice and translate for you when needed. The guide will stay at a separate table while you are having your meal so you can be undisturbed after they helped you order.
          </small>
        </label>
      </div>

      <div className="mb-6">
        <label htmlFor="itineraryLength" className="block font-semibold mb-1">How long would you like your personalized itinerary for?</label>
        <select
          id="itineraryLength"
          name="itineraryLength"
          value={formData.itineraryLength}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>1 day - 75e</option>
          <option>City Break [2 - 3 days] - 150e</option>
          <option>Long City Break [3 - 5 days] - 300e</option>
          <option>Roman explorer [5 - 10 days] - 500e</option>
        </select>
      </div>

      <button
        type="submit"
        className="
          bg-gradient-to-r from-[#fcc266] to-[#dfa70d]
          text-black font-bold rounded-lg
          px-6 py-3 shadow-md
          hover:scale-105 hover:-translate-y-1
          transition-transform duration-300
        "
      >
        Next
      </button>
    </form>
    </>
  );
}
