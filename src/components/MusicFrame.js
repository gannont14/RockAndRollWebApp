import React, { useEffect, useState } from "react";
import QuizButtons from "./QuizButtons";

const MusicFrame = ({
  index,
  title,
  artist,
  genre,
  ID,
  studyType,
  unitNumber,
  classSelected,
}) => {
  const [titleShowing, setTitleShowing] = useState(false);
  const [artistShowing, setArtistShowing] = useState(false);
  const [genreShowing, setGenreShowing] = useState(false);
  const [frameContent, setFrameContent] = useState(null);

  useEffect(() => {
    setTitleShowing(false);
    setArtistShowing(false);
    setGenreShowing(false);
  }, [title, artist]);

  const handleCorrectAnswer = (answerType) => {
    switch (answerType) {
      case "title":
        setTitleShowing(true);
        break;
      case "artist":
        setTitleShowing(true);
        setArtistShowing(true);
        setGenreShowing(true);
        break;
      case "genre":
        setGenreShowing(true);
        break;
      case "all":
        setTitleShowing(true);
        setArtistShowing(true);
        setGenreShowing(true);
        break;
    }
  };

  useEffect(() => {
    switch (studyType) {
      case "study":
        setFrameContent(
          <div>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={() => setTitleShowing(!titleShowing)}
            >
              Show Title
            </button>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={() => setArtistShowing(!artistShowing)}
            >
              Show Artist
            </button>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={() => setGenreShowing(!genreShowing)}
            >
              Show Genre
            </button>
          </div>,
        );
        break;
      case "quiz":
        setFrameContent(
          <QuizButtons
            index={index}
            unitNumber={unitNumber}
            classSelected={classSelected}
            onCorrectAnswer={handleCorrectAnswer}
            correctAnswer={artist}
          />,
        );
        break;
    }
  }, [index, title, artist, genre, studyType]);

  return (
    <div className="m-5 p-5 mx-auto">
      <h1 className={titleShowing ? `text-black` : `hidden`}>
        <span className="font-bold">Title:</span> {title}
      </h1>
      <h2 className={artistShowing ? `text-black` : `hidden`}>
        <span className="font-bold">Artist:</span> {artist}
      </h2>
      <h3 className={genreShowing ? `text-black` : `hidden`}>
        <span className="font-bold">Genre:</span> {genre != null ? genre : ""}
      </h3>
      <div className="flex justify-center">
        <iframe
          frameBorder="0"
          width="420"
          height="120"
          src={`https://drive.google.com/file/d/${ID}/preview?usp=embed&toolbar=0`}
          className="pt-5 bg-white"
        />
      </div>
      {frameContent}
    </div>
  );
};

export default MusicFrame;
