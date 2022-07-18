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
  const [wordList, setWordList] = useState<keepWord[]>([]);

  const firstReqData = async () => {
    const data = await fetch("http://localhost:8000/firstData");
    const firstWord = await data.json();
    setPrevWord(firstWord.name);
    setWordList((prev) => [...prev, { Word: firstWord.name, isUser: false }]);
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
    const sentData =
      JSON.parse(previousWord)[
        Math.floor(Math.random() * JSON.parse(previousWord).length)
      ];
    setWordList((prev) => [...prev, { Word: sentData.name, isUser: false }]);
    if (checkGameEnd(sentData.name)) {
      alert("ゲーム終了");
    }
    setPrevWord(sentData.name);
  };

  const hiraToKana = (str: string): string => {
    return str.replace(/[\u3041-\u3096]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
  };
  const usersGameEnd = (usersword: string) => {
    if (
      prevWord[prevWord.length - 1] !== usersword[0] ||
      usersword[usersword.length - 1] === "ン"
    ) {
      alert("ゲーム終了");

      return true;
    } else {
      return false;
    }
  };
  const checkGameEnd = (word: string) => {
    if (word[word.length - 1] === "ン") {
      return true;
    } else {
      false;
    }
    // if (word[word.length - 1] === "ン") {
    //   return true;
    // } else {
    //   false;
    // }
  };
  const wordCheck = (word: string) => {
    wordList.map((items) => {
      if (items.Word === word) {
        alert("既に使用しています");
        return false;
      }
    });
    if (word.match(/[\u30a0-\u30ff\u3040-\u309f]/)) {
      if (!usersGameEnd(word)) {
        reqData(word);
      }
    } else {
      alert("入力はカタカナです");
    }
  };
  const reset = () => {
    setSendText("");
    setPrevWord("");
    setWordList([]);
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
      <p>最初の単語:{prevWord}</p>
      <p>前の単語:{prevWord}</p>
      <input
        value={sendText}
        onChange={(event) => setSendText(hiraToKana(event.target.value))}
      ></input>
      <button
        onClick={() => {
          setWordList((prev) => [...prev, { Word: sendText, isUser: true }]);
          // if (!usersGameEnd(sendText)) {
          //   wordCheck(sendText);
          // }
          wordCheck(sendText);
        }}
      >
        送信
      </button>
      <p>履歴</p>
      {wordList.map((items) => {
        return (
          <>
            <p>{items.isUser ? "プレイヤー" : "サーバー"}</p>
            <p>{items.Word}</p>
          </>
        );
      })}
    </div>
  );
}

function main() {
  ReactDOM.render(<App />, document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
