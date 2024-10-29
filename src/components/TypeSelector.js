import { React, useState } from "react";
import StudyUnitSelector from "./StudyUnitSelector";
import Unit from "./Unit";

const TypeSelector = ({ classSelected }) => {
  const [typeSelected, setTypeSelected] = useState(null);

  return (
    <div>
      {typeSelected === null && (
        <div className="flex flex-col justify-center align-middle mt-7">
          <h1 className="text-center">Select your study type</h1>
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
        </div>
      )}
      {typeSelected !== null && (
        <StudyUnitSelector
          studyType={typeSelected}
          classSelected={classSelected}
        />
      )}
    </div>
  );
};

export default TypeSelector;
