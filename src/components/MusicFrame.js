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

  useEffect(() => {
    switch (studyType) {
      case "study":
        setFrameContent(
          <div>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={toggleTitleShowing}
            >
              Show Title
            </button>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={toggleArtistShowing}
            >
              Show Artist
            </button>
            <button
              className="m-3 p-3 border border-black rounded-lg"
              onClick={toggleGenreShowing}
            >
              Show Genre
            </button>
          </div>
        );
        break;
      case "quiz":
        setFrameContent(<QuizButtons index={index} unitNumber={unitNumber} />);
        break;
    }
  });

  const toggleTitleShowing = () => {
    if (titleShowing) {
      setTitleShowing(false);
    } else {
      setTitleShowing(true);
    }
  };

  const toggleArtistShowing = () => {
    if (artistShowing) {
      setArtistShowing(false);
    } else {
      setArtistShowing(true);
    }
  };

  const toggleGenreShowing = () => {
    if (artistShowing) {
      setGenreShowing(false);
    } else {
      setGenreShowing(true);
    }
  };

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
          frameborder="0"
          width="420"
          height="120"
          src={`https://drive.google.com/file/d/${ID}/preview?usp=embed&toolbar=0`}
          className="pt-5 bg-white"
        ></iframe>
      </div>
      {frameContent}
    </div>
  );
};

export default MusicFrame;
