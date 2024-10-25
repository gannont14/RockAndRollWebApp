import React, { useState } from "react";
import Unit from "./Unit";

const StudyUnitSelector = ({ studyType }) => {
  const [unitSelected, setUnitSelected] = useState(null);

  return (
    <div>
      {unitSelected === null && (
        <div className="flex flex-col justify-center align-middle">
          <h1>Select your unit</h1>
          <button
            onClick={() => setUnitSelected("1")}
            className="mx-[25%] my-5 p-5 rounded-xl border border-black"
          >
            Unit 1
          </button>
          <button
            className="mx-[25%] my-5 p-5 rounded-xl border border-black"
            onClick={() => setUnitSelected("2")}
          >
            Unit 2
          </button>
          <button
            className="mx-[25%] my-5 p-5 rounded-xl border border-black"
            onClick={() => setUnitSelected("3")}
          >
            Unit 3
          </button>
          {/* <button onClick={() => setUnitSelected("2")}>Unit 2</button>
          <button onClick={() => setUnitSelected("3")}>Unit 3</button> */}
        </div>
      )}
      {unitSelected !== null && (
        <div>
          <h1 className="font-bold text-5xl pt-[15%]">
            {" "}
            Z201 Unit: {unitSelected}
          </h1>
          <Unit unitNumber={unitSelected} studyType={studyType} />
        </div>
      )}
    </div>
  );
};

export default StudyUnitSelector;
