import React, { useState } from "https://cdn.skypack.dev/react@17.0.2?dts";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.2?dts";
import useStateEffect from "https://cdn.skypack.dev/use-state-effect";
type keepWord = {
  Word: string;
  isUser: boolean;
};

function App() {
  const [sendText, setSendText] = useState<string>("");
  const [prevWord, setPrevWord] = useState<string>("");
  const [firstWordData, setFirstWordData] = useState<string>("");
  const [wordList, setWordList] = useState<keepWord[]>([]);

  useStateEffect(() => {
    const dataReq = async () => {
      const response = await fetch("http://localhost:8000/shiritori");
      const previousWord = await response.json();
      setPrevWord(previousWord);
    };
    dataReq();
  }, []);
  const firstReqData = async () => {
    const data = await fetch("http://localhost:8000/firstData");
    const firstWord = await data.json();

    setFirstWordData(JSON.stringify(firstWord));
  };
  const gameEndCheck = (checkText: string) => {
    if (checkText[checkText.length - 1] === "ン") {
      console.log("yahharo");
    }
  };

  const wordCheck = (word: string) => {
    if (word.match(/[\u30a0-\u30ff\u3040-\u309f]/)) {
      reqData(word);
    } else {
      alert("入力はカタカナです");
    }
  };
  const hiraToKana = (str: string): string => {
    return str.replace(/[\u3041-\u3096]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
  };
  const reqData = async (word: string) => {
    const response = await fetch("http://localhost:8000/word", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sendText }),
    });
    if (response.status / 100 !== 2) {
      alert(await response.text());
      return;
    }

    const previousWord = await response.text();
    console.log(previousWord);
    console.log(JSON.parse(previousWord));

    console.log(JSON.parse(previousWord).length);
    console.log(Math.floor(Math.random() * JSON.parse(previousWord).length));
    console.log(
      JSON.parse(previousWord)[
        Math.floor(Math.random() * JSON.parse(previousWord).length)
      ].name
    );
  };
  return (
    <div>
      <button
        onClick={() => {
          firstReqData();
        }}
      >
        最初の文字決めるボタン的な
      </button>
      <p>最初の単語:{firstWordData}</p>
      <p>前の単語:{prevWord}</p>
      <input
        value={sendText}
        onChange={(event) => setSendText(hiraToKana(event.target.value))}
      ></input>
      <button
        onClick={() => {
          wordCheck(sendText);
          setWordList((prev) => [...prev, { Word: sendText, isUser: true }]);
        }}
      >
        送信
      </button>
    </div>
  );
}

function main() {
  ReactDOM.render(<App />, document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
