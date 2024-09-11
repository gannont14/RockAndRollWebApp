import { React, useEffect, useState } from "react";
import MusicFrame from "./MusicFrame";

const Unit = ({ unitNumber }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSongList, setShowSongList] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(null);

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";

  const filePath = `${baseURL}/unit${unitNumber}.json`;

  console.log("File path");
  console.log(filePath);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
        setRandomIndex(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const setRandomIndex = (data) => {
    setCurrentIndex(Math.floor(Math.random() * data.length));
  };
  const handleSongSelect = (index) => {
    setCurrentIndex(index);
    setShowSongList(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="flex flex-col align-middle w-full h-[100vh] mt-10">
      <div className="p-5 shadow-2xl rounded-lg mx-auto">
        <div className="tooltip tooltip-left absolute bottom-3 right-3 p-2">
          <button
            onClick={() => setShowSongList(!showSongList)}
            className="btn hover:underline"
          >
            {showSongList ? "Hide Song List" : "Show Song List"}
          </button>
        </div>

        <div
          className="tooltip tooltip-left absolute bottom-20 right-3 p-2"
          data-tip="Selecting 'next song' will choose a new random song from the unit selected, you can show and hide the artist and song title as you please to test yourself, there is also a full song list you are able to view, if the site is not working, give it a second to load, if it still isn't working, I probably broke something"
        >
          <button className="btn">?</button>
        </div>

        {!showSongList ? (
          <>
            <h1 className="text-3xl font-bold">Now Playing:</h1>
            <MusicFrame
              index={currentIndex}
              ID={data[currentIndex].id}
              title={data[currentIndex].name}
              artist={data[currentIndex].author}
            />
            <button
              onClick={() => setRandomIndex(data)}
              className=" p-5 rounded-xl border border-black"
            >
              Next Song
            </button>
          </>
        ) : (
          <div className="h-[50vh] overflow-y-scroll">
            <h1 className="text-3xl font-bold">Song List</h1>
            <ul className="mt-3">
              {data.map((song, index) => (
                <li
                  key={song.id}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    currentIndex === index ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handleSongSelect(index)}
                >
                  {song.name} - {song.author}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unit;
