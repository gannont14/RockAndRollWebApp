import { React, useEffect, useState } from "react";
import MusicFrame from "./MusicFrame";

const Unit = ({ unitNumber, studyType, queueType = "smart" }) => {
  const [data, setData] = useState([]);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSongList, setShowSongList] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(null);

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";

  const filePath = `${baseURL}/unit${unitNumber}.json`;

  const shuffleArray = (arr) => {
    let shuffled = [...arr];

    //loop through the elements, swapping each of them with a random index
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      //swap elements
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  //useEffect for whenever data changes, to shuffle the array
  useEffect(() => {
    setQueue(shuffleArray([...Array(data.length).keys()]));
  }, [data]);

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
    if (queueType === "smart") {
      setQueue((prevQueue) => {
        let newQueue = [...prevQueue];

        if (newQueue.length === 0) {
          // If queue is empty, reshuffle and refill the queue with indices
          newQueue = shuffleArray([...Array(data.length).keys()]);
        }

        const nextIndex = newQueue.pop(); // Get the last element in the queue (random index)
        setCurrentIndex(nextIndex); // Update the current index based on the next available one

        return newQueue; // Return the updated queue of indices
      });
    } else {
      // If not using "smart" queue, just pick a random index
      setCurrentIndex(Math.floor(Math.random() * data.length));
    }
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
              genre={data[currentIndex].genre}
              studyType={studyType}
              unitNumber={unitNumber}
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
