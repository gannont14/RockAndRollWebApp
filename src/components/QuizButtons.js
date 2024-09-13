import { React, useEffect, useState } from "react";

const QuizButtons = ({ index, unitNumber }) => {
  const [artists, setArtists] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctArtist, setCorrectArtist] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null); // Track the selected artist

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";
  const filePath = `${baseURL}/unit${unitNumber}.json`;

  useEffect(() => {
    setSelectedArtist(null);
    // Fetch the JSON file for the current unit
    const fetchUnitData = async () => {
      try {
        const response = await fetch(filePath);
        const data = await response.json(); // Assume data is an array of song objects

        const song = data[index]; // Get the current song based on the index
        setCorrectArtist(song.author); // Set the correct artist

        const allArtists = data.map((song) => song.author); // Get all artists from the unit
        setArtists(allArtists);

        // Get 3 random incorrect artists
        const incorrectArtists = allArtists
          .filter((artist) => artist !== song.author) // Exclude the correct artist
          .sort(() => 0.5 - Math.random()) // Shuffle the incorrect artists
          .slice(0, 3); // Select the first 3 artists from the shuffled array

        // Combine correct and incorrect artists and shuffle them
        const quizOptions = [...incorrectArtists, song.author].sort(
          () => 0.5 - Math.random()
        );
        setOptions(quizOptions);
      } catch (error) {
        console.error("Error fetching unit data:", error);
      }
    };

    fetchUnitData();
  }, [filePath, index]);

  const handleClick = (artist) => {
    setSelectedArtist(artist); // Update the selected artist
  };

  return (
    <div>
      <h3>Select the correct artist:</h3>
      <div className="flex flex-col">
        {options.map((artist, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(artist)}
            className={`btn btn-outline my-3 
              ${
                selectedArtist
                  ? artist === correctArtist
                    ? "bg-green-500" // Correct answer: green
                    : selectedArtist === artist
                    ? "bg-red-500" // Incorrect answer: red
                    : ""
                  : ""
              }
            `}
          >
            {artist}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizButtons;
