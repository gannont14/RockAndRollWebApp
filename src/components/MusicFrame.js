import React, { useEffect, useState } from "react";

const MusicFrame = ({ index, title, artist, ID }) => {
  const [titleShowing, setTitleShowing] = useState(false);
  const [artistShowing, setArtistShowing] = useState(false);

  useEffect(() => {
    setTitleShowing(false);
    setArtistShowing(false);
  }, [title, artist]);

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
      <h1 className={titleShowing ? `text-black` : `text-white`}>
        <span className="font-bold">Title:</span> {title}
      </h1>
      <h2 className={artistShowing ? `text-black` : `text-white`}>
        <span className="font-bold">Artist:</span> {artist}
      </h2>
      <div className="flex justify-center">
        <iframe
          frameborder="0"
          width="420"
          height="120"
          src={`https://drive.google.com/file/d/${ID}/preview`}
          className="pt-5 bg-white"
        ></iframe>
      </div>
      <button
        className="m-5 p-5 border border-black rounded-lg"
        onClick={toggleTitleShowing}
      >
        Show Title
      </button>
      <button
        className="m-5 p-5 border border-black rounded-lg"
        onClick={toggleArtistShowing}
      >
        Show Artist
      </button>
    </div>
  );
};

export default MusicFrame;
