import { React, useEffect, useState } from "react";
import MusicFrame from "./MusicFrame";

const Unit = ({
  unitNumber,
  studyType,
  queueType = "smart",
  numUnits = 0,
  classSelected,
}) => {
  const [currentUnit, setCurrentUnit] = useState(unitNumber);
  const [data, setData] = useState([]);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSongList, setShowSongList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";

  const getRandomUnit = () => {
    if (unitNumber === "-1" && numUnits > 0) {
      return Math.floor(Math.random() * numUnits) + 1;
    }
    return unitNumber;
  };

  const fetchUnitData = async (unit, skipRandomIndex = false) => {
    setLoading(true);
    const targetUnit = unit.toString();
    const filePath = `${baseURL}/classes/${classSelected}/unit${targetUnit}.json`;
    console.log(`Fetching data for unit: ${targetUnit} from ${filePath}`);

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const unitData = await response.json();
      setData(unitData);
      setLoading(false);
      if (!skipRandomIndex) {
        setInitialIndex(unitData);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError(error);
      setLoading(false);
    }
  };

  const setInitialIndex = (unitData) => {
    if (queueType === "smart") {
      const newQueue = shuffleArray([...Array(unitData.length).keys()]);
      const nextIndex = newQueue.pop();
      setQueue(newQueue);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(Math.floor(Math.random() * unitData.length));
    }
  };

  const shuffleArray = (arr) => {
    let shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (classSelected && unitNumber) {
      const initialUnit = getRandomUnit();
      console.log("Initial unit:", initialUnit);
      setCurrentUnit(initialUnit);
      fetchUnitData(initialUnit);
    }
  }, [classSelected, unitNumber, numUnits]);

  const setRandomIndex = async () => {
    console.log("Setting random index, unitNumber:", unitNumber);
    if (unitNumber === "-1") {
      const newUnit = getRandomUnit();
      console.log("Randomizing unit to:", newUnit);
      setCurrentUnit(newUnit);
      await fetchUnitData(newUnit, true);
      setInitialIndex(data);
    } else if (queueType === "smart") {
      setQueue((prevQueue) => {
        let newQueue = [...prevQueue];
        if (!newQueue?.length) {
          newQueue = shuffleArray([...Array(data.length).keys()]);
        }
        const nextIndex = newQueue.pop();
        setCurrentIndex(nextIndex);
        return newQueue;
      });
    } else {
      setCurrentIndex(Math.floor(Math.random() * data.length));
    }
  };

  const handleSongSelect = (index) => {
    setCurrentIndex(index);
    setShowSongList(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  if (!data.length) return <p>No songs found for this unit</p>;

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
              ID={data[currentIndex]?.id}
              title={data[currentIndex]?.name}
              artist={data[currentIndex]?.author}
              genre={data[currentIndex]?.genre}
              studyType={studyType}
              unitNumber={currentUnit}
              classSelected={classSelected}
            />
            <button
              onClick={() => setRandomIndex()}
              className="p-5 rounded-xl border border-black w-full"
            >
              Next Song
            </button>
          </>
        ) : (
          <div className="h-[50vh] overflow-y-scroll">
            <h1 className="text-3xl font-bold">
              Song List {unitNumber === "-1" && `(Unit ${currentUnit})`}
            </h1>
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
