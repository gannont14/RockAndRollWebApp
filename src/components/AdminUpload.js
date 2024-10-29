import React, { useState } from "react";
import axios from "axios";

const AdminUpload = () => {
  // State to store the number of units
  const [unitCount, setUnitCount] = useState(0);
  // State to store the array of link inputs
  const [links, setLinks] = useState([]);
  // State to store the uploaded file
  const [file, setFile] = useState(null);
  // State to store the class name
  const [className, setClassName] = useState("");

  const baseURL = "http://127.0.0.1:5000";

  // Handle change in number of units input
  const handleUnitCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setUnitCount(count);

    // Adjust the length of the links array based on the number of units
    const newLinks = [...links];
    while (newLinks.length < count) {
      newLinks.push(""); // Add empty strings for new units
    }
    setLinks(newLinks.slice(0, count)); // Adjust the array size
  };

  // Handle the change in link input
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle class name input change
  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file); // Append the file
    //formData.append("links", JSON.stringify(links)); // Append links array as JSON string
    formData.append("className", className); // Append the class name

    links.forEach((link) => formData.append("links", link));
    try {
      // Send data to the backend
      //@app.route('/upload/class', methods = ['POST'])
      const response = await axios.post(`${baseURL}/upload/class`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Submission successful:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div>
      <h1>Admin Upload Page</h1>
      <form onSubmit={handleSubmit}>
        {/* Class Name Input */}
        <div>
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={handleClassNameChange}
            required
          />
        </div>

        {/* Number of Units Input */}
        <div>
          <label htmlFor="unitCount">Number of Units:</label>
          <input
            type="number"
            id="unitCount"
            value={unitCount}
            onChange={handleUnitCountChange}
            min="0"
            required
          />
        </div>

        {/* Dynamically generate input fields based on the number of units */}
        {Array.from({ length: unitCount }, (_, index) => (
          <div key={index}>
            <label htmlFor={`link-${index}`}>Link for Unit {index + 1}:</label>
            <input
              type="text"
              id={`link-${index}`}
              value={links[index] || ""}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        {/* File upload field for .docx file */}
        <div>
          <label htmlFor="fileUpload">Upload .docx file:</label>
          <input
            type="file"
            id="fileUpload"
            accept=".docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminUpload;
