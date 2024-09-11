import { React, useEffect, useState } from "react";
import MusicFrame from "./MusicFrame";

const TestComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch("/test.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
        setLoading(false);
      });
    console.log(data[0]);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <h1>File IDs</h1>
      <ul>
        {/* {data.map((file, index) => (
          <li key={file.id}>
            {index} : {file.id}
            <MusicFrame
              index={index}
              title={file.title}
              ID={file.id}
              artist={"test"}
            />
          </li>
        ))} */}
      </ul>
      {/* <MusicFrame
        index={0}
        title={"TEstign"}
        id={"14mMLMaAvpbMAz9gM5xa4hb0xum7ovRJd"}
        artist={"Test"}
      /> */}
    </div>
  );
};

export default TestComponent;

// 14mMLMaAvpbMAz9gM5xa4hb0xum7ovRJd
