import React, { useState } from "react";
import Unit from "./Unit";

const UnitSelector = () => {
  const [unitSelected, setUnitSelected] = useState(null);

  return (
    <div>
      {unitSelected === null && (
        <div className="flex flex-col justify-center align-middle">
          <h1>Select your unit</h1>
          <button
            onClick={() => setUnitSelected("1")}
            className="m-[25%] p-5 rounded-xl border border-black"
          >
            Unit 1
          </button>
          {/* <button onClick={() => setUnitSelected("2")}>Unit 2</button>
          <button onClick={() => setUnitSelected("3")}>Unit 3</button> */}
        </div>
      )}
      {unitSelected !== null && (
        <div>
          <h1 className="font-bold text-7xl pt-[10%]">
            {" "}
            Z201 Unit: {unitSelected}
          </h1>
          <Unit unitNumber={unitSelected} />
        </div>
      )}
    </div>
  );
};

export default UnitSelector;
