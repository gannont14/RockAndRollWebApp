import React, { useState, useEffect } from "react";
import axios from "axios";
import Unit from "./Unit";

const StudyUnitSelector = ({ studyType, classSelected }) => {
  const [numberOfUnits, setNumberOfUnits] = useState(0);
  const [hasComprehensive, setHasComprehensive] = useState(false);
  const [unitSelected, setUnitSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //const [classSelected, setClassSelected] = useState(null);
  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";
  const filePath = `${baseURL}/classes.json`;

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        // Fetch the classes.json file from your backend or public folder
        const response = await axios.get(filePath);
        const classes = response.data;

        // Find the selected class in the classes array
        const selectedClass = classes.find(
          (cls) => cls.class_name === classSelected,
        );

        if (selectedClass) {
          // Update the number of units
          setNumberOfUnits(selectedClass.number_of_units);
        } else {
          setError("Class not found");
        }

        // update if it has a comprehensive section
        if( selectedClass.has_comprehensive){
          setHasComprehensive(true);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching class data:", err);
        setError("Failed to fetch class data");
        setLoading(false);
      }
    };

    if (classSelected) {
      fetchClassData();
    }
  }, [classSelected]);

  if (loading) {
    return <div>Loading units...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {unitSelected === null && (
        <div className="flex flex-col justify-center align-middle mt-7">
          <h1 className="text-center">Select your unit</h1>
          {Array.from({ length: numberOfUnits }, (_, index) => (
            <button
              key={index}
              className="mx-[25%] my-5 p-5 rounded-xl border border-black"
              onClick={() => setUnitSelected(`${index + 1}`)}
            >
              Unit {index + 1}
            </button>
          ))}
          {hasComprehensive && 
          <button
            className="mx-[25%] my-5 p-5 rounded-xl border border-black"
            onClick={() => setUnitSelected(`-1`)}
          >
            Comprehensive
          </button>
          }
        </div>
      )}
      {unitSelected !== null && (
        <div>
          <h1 className="font-bold text-5xl pt-[15%] text-center">
            {" "}
            {classSelected}
          </h1>
          <Unit
            unitNumber={unitSelected}
            classSelected={classSelected}
            studyType={studyType}
            numUnits={numberOfUnits}
          />
        </div>
      )}
    </div>
  );
};

export default StudyUnitSelector;
