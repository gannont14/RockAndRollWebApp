// components/ClassSelector.js

import { React, useState, useEffect } from "react";
import TypeSelector from "./TypeSelector";
import GitHubLink from "./GitHubLink";
function ClassSelector() {
  const [classSelected, setClassSelected] = useState(null);

  const baseURL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}` : "";
  const filePath = `${baseURL}/classes.json`;
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => setClasses(data))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  return (
    <div>
      <div>
        {classSelected === null && (
          <div className="flex flex-col justify-center align-middle mt-7">
            <h1 className="text-center">Select your class</h1>
            {classes.map((classObject) => (
              <button
                key={classObject.class_name}
                onClick={() => setClassSelected(classObject.class_name)}
                className="mx-[25%] my-5 p-5 rounded-xl border border-black"
              >
                {classObject.class_name}
              </button>
            ))}

      <div className="absolute bottom-0 right-0 h-[40px] w-[40px] mb-5 mr-5"> 
        <GitHubLink/>
      </div>
          </div>
        )}
        {classSelected !== null && (
          <div>
            <TypeSelector classSelected={classSelected} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassSelector;
