import { React, useState } from "react";
import StudyUnitSelector from "./StudyUnitSelector";
import Unit from "./Unit";

const TypeSelector = () => {
  const [typeSelected, setTypeSelected] = useState(null);

  return (
    <div>
      {typeSelected === null && (
        <div className="flex flex-col justify-center align-middle">
          <h1>Select your study type</h1>
          <button
            onClick={() => setTypeSelected("study")}
            className="mx-[25%] my-3 p-5 rounded-xl border border-black"
          >
            Study
          </button>
          <button
            onClick={() => setTypeSelected("quiz")}
            className="mx-[25%] my-3 p-5 rounded-xl border border-black"
          >
            Quiz
          </button>
          {/* <button onClick={() => setUnitSelected("3")}>Unit 3</button> */}
        </div>
      )}
      {typeSelected !== null && <StudyUnitSelector studyType={typeSelected} />}
    </div>
  );
};

export default TypeSelector;
