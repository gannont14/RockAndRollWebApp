import React, { useEffect, useState } from "react";
import QuizButtons from "./QuizButtons";

const MusicFrame = ({ index, title, artist, ID, studyType, unitNumber }) => {
  const [titleShowing, setTitleShowing] = useState(false);
  const [artistShowing, setArtistShowing] = useState(false);
  const [frameContent, setFrameContent] = useState(null);

  useEffect(() => {
    setTitleShowing(false);
    setArtistShowing(false);
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

  return (
    <div className="m-5 p-5 mx-auto">
      <h1 className={titleShowing ? `text-black` : `hidden`}>
        <span className="font-bold">Title:</span> {title}
      </h1>
      <h2 className={artistShowing ? `text-black` : `hidden`}>
        <span className="font-bold">Artist:</span> {artist}
      </h2>
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
