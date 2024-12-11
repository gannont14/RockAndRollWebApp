import { React, useEffect, useState } from "react";

const QuizButtons = ({
  index,
  unitNumber,
  classSelected,
  onCorrectAnswer,
  correctAnswer,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";
  const filePath = `${baseURL}/classes/${classSelected}/unit${unitNumber}.json`;

  useEffect(() => {
    setSelectedArtist(null);
    const fetchUnitData = async () => {
      try {
        const response = await fetch(filePath);
        const data = await response.json();

        const allArtists = data
          .map((song) => song.author)
          .filter((artist) => artist !== correctAnswer);

        const uniqueIncorrectArtists = Array.from(new Set(allArtists));
        const incorrectArtists = uniqueIncorrectArtists
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const quizOptions = [...incorrectArtists, correctAnswer].sort(
          () => 0.5 - Math.random(),
        );
        setOptions(quizOptions);
      } catch (error) {
        console.error("Error fetching unit data:", error);
      }
    };

    fetchUnitData();
  }, [filePath, index, correctAnswer]);

  const handleClick = (artist) => {
    setSelectedArtist(artist);
    if (artist === correctAnswer) {
      onCorrectAnswer("artist");
    }
  };

  return (
    <div>
      <h3>Select the correct artist:</h3>
      <div className="flex flex-col">
        {options.map((artist, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(artist)}
            className={`btn my-3 ${
              selectedArtist
                ? artist === correctAnswer
                  ? "bg-green-500 hover:bg-green-500"
                  : selectedArtist === artist
                    ? "bg-red-500 hover:bg-red-500"
                    : ""
                : ""
            }`}
          >
            {artist}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizButtons;
