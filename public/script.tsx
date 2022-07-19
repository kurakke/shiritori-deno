import React, { useState } from "https://cdn.skypack.dev/react@17.0.2?dts";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.2?dts";
import useStateEffect from "https://cdn.skypack.dev/use-state-effect";
import styled, {
  createGlobalStyle,
} from "https://cdn.skypack.dev/styled-components@5.3.3?dts";

const All = styled.div``;
const FirstButton = styled.button``;
const WordInput = styled.input``;
const WordSendButton = styled.button``;
const PrevWordP = styled.p``;
const PrevUserP = styled.p``;
const HistoryP = styled.p``;
const HistoriesDiv = styled.div``;

type keepWord = {
  Word: string;
  isUser: boolean;
};

function App() {
  const [sendText, setSendText] = useState<string>("");
  const [prevWord, setPrevWord] = useState<string>("");
  const [wordList, setWordList] = useState<keepWord[]>([]);
  const [isFirst, setIsFirst] = useState<boolean>(true);

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
    if (prevWord === "") {
      return false;
    } else if (
      prevWord[prevWord.length - 1] !== usersword[0] ||
      usersword[usersword.length - 1] === "ン"
    ) {
      alert("やっはろー");

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
    <All>
      {/* <button
        onClick={() => {
          firstReqData();
        }}
      >
        最初の文字決めるボタン的な
      </button> */}
      {(() => {
        if (isFirst) {
          return (
            <div>
              <FirstButton
                onClick={() => {
                  firstReqData();
                }}
              >
                最初の単語を決めるボタン的な
              </FirstButton>
              <p>最初の単語:{prevWord}</p>
            </div>
          );
        } else {
          return <p>前の単語:{prevWord}</p>;
        }
      })()}

      <WordInput
        value={sendText}
        onChange={(event) => setSendText(hiraToKana(event.target.value))}
      ></WordInput>
      <WordSendButton
        onClick={() => {
          setIsFirst(false);
          setWordList((prev) => [...prev, { Word: sendText, isUser: true }]);
          // if (!usersGameEnd(sendText)) {
          //   wordCheck(sendText);
          // }
          wordCheck(sendText);
        }}
      >
        送信
      </WordSendButton>
      <HistoryP>履歴</HistoryP>
      <HistoriesDiv>
        {wordList.map((items) => {
          return (
            <>
              <PrevUserP>{items.isUser ? "プレイヤー" : "サーバー"}</PrevUserP>
              <PrevWordP>{items.Word}</PrevWordP>
            </>
          );
        })}
      </HistoriesDiv>
    </All>
  );
}

function main() {
  ReactDOM.render(<App />, document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
