import React, { useState } from "https://cdn.skypack.dev/react@17.0.2?dts";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.2?dts";
import useStateEffect from "https://cdn.skypack.dev/use-state-effect";
import styled, {
  createGlobalStyle,
} from "https://cdn.skypack.dev/styled-components@5.3.3?dts";
import { pokemons } from "../pokemon.tsx";

const AllDiv = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background-color: #e9e5de;
`;
const TitleH1 = styled.h1`
  padding-top: 20px;
  text-align: center;
`;
const PrevP = styled.p`
  display: flex;
  justify-content: center;
`;

const WordInput = styled.input`
  width: 300px;
  height: 50px;
  border: 1px solid;
  border-color: red;
`;
const WordSendDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const WordSendButton = styled.button``;
const PrevWordDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
  border: 1px solid;
  border-color: black;
  width: 240px;
  height: 30px;
`;
const PrevUserDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  border: 1px solid;
  border-color: purple;
  width: 100px;
  height: 30px;
`;

const HistoriesDiv = styled.div`
  margin: 10px auto;
  width:500px;
  max-height:400px
  background-color: red;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const FlexHistoryDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: center;
`;
const ResetButton = styled.button``;
const FirstButton = styled.button``;
type keepWord = {
  Word: string;
  isUser: boolean;
};

function App() {
  const [sendText, setSendText] = useState<string>("");
  const [prevWord, setPrevWord] = useState<string>("");
  const [wordList, setWordList] = useState<keepWord[]>([]);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [pokemonBarks, setPokemonBarks] = useState<HTMLAudioElement[]>([]);

  const changeAbnormalWord = (word: string) => {
    // const [changeWord, setChangeWord] = useState<string>(word);
    // setChangeWord((prev) => prev.replace("ァ", "ア"));
    // setChangeWord((prev) => prev.replace("ィ", "イ"));
    // setChangeWord((prev) => prev.replace("ゥ", "ウ"));
    // setChangeWord((prev) => prev.replace("ェ", "エ"));
    // setChangeWord((prev) => prev.replace("ォ", "オ"));
    // setChangeWord((prev) => prev.replace("ャ", "ヤ"));
    // setChangeWord((prev) => prev.replace("ュ", "ユ"));
    // setChangeWord((prev) => prev.replace("ョ", "ヨ"));
    // setChangeWord((prev) => prev.replace("ッ", "ツ"));
    // setChangeWord((prev) => prev.replace("ー", ""));
    // setChangeWord((prev) => prev.replace("Z", "ゼット"));
    // setChangeWord((prev) => prev.replace("X", "エックス"));
    // setChangeWord((prev) => prev.replace("Y", "ワイ"));
    // setChangeWord((prev) => prev.replace("♂", "オス"));
    // setChangeWord((prev) => prev.replace("♀", "メス"));
    const first = word.replace("2", "ツー");
    const A = first.replace("ァ", "ア");
    const B = A.replace("ィ", "イ");
    const C = B.replace("ゥ", "ウ");
    const D = C.replace("ェ", "エ");
    const E = D.replace("ォ", "オ");
    const F = E.replace("ッ", "ツ");
    const G = F.replace("ャ", "ヤ");
    const H = G.replace("ュ", "ユ");
    const I = H.replace("ョ", "ヨ");
    const J = I.replace("ー", "");
    const K = J.replace("Z", "ゼット");
    const L = K.replace("Y", "ワイ");
    const M = L.replace("X", "エックス");
    const N = M.replace("♂", "オス");
    const O = N.replace("♀", "メス");
    const P = O.replace("ー", "");
    return P;
  };
  const firstReqData = async () => {
    const data = await fetch("http://localhost:8000/firstData");
    const firstWord = await data.json();
    setPrevWord(firstWord.name);
    // console.log(firstWord.no);
    // pokemonBarks[0].play();
    setWordList((prev) => [...prev, { Word: firstWord.name, isUser: false }]);
  };

  const reqData = async (word: string) => {
    console.log("in reqData");

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
    if (checkServerGameEnd(sentData.name)) {
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
    console.log("usersGameEnd in kansuu");
    console.log(changeAbnormalWord(prevWord));

    if (prevWord === "") {
      return false;
    } else if (
      changeAbnormalWord(prevWord)[changeAbnormalWord(prevWord).length - 1] !==
        usersword[0] ||
      changeAbnormalWord(usersword)[
        changeAbnormalWord(usersword).length - 1
      ] === "ン"
    ) {
      console.log("in if true");
      alert("やっはろー");
      return true;
    } else {
      console.log("in if false");

      return false;
    }
  };
  const checkServerGameEnd = (word: string) => {
    if (
      changeAbnormalWord(word)[changeAbnormalWord(word).length - 1] === "ン"
    ) {
      return true;
    } else if (word === null) {
      return true;
    } else if (
      wordList
        .map((item) => {
          return item.Word;
        })
        .includes(word)
    ) {
      return true;
    }

    // if (word[word.length - 1] === "ン") {
    //   return true;
    // } else {
    //   false;
    // }
  };
  const wordCheck = (word: string) => {
    console.log("wordCheck");

    wordList.map((items) => {
      if (items.Word === word) {
        alert("既に使用しています");
        return false;
      }
    });
    if (word.match(/[\u30a0-\u30ff\u3040-\u309f]/)) {
      console.log("word.mathch in if");

      if (!usersGameEnd(word)) {
        console.log("usersGameEnd in if");

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
    setIsFirst(true);
  };
  return (
    <AllDiv>
      <TitleH1>ポケモンしりとり</TitleH1>
      {/* <button
        onClick={() => {
          firstReqData();
        }}
      >
        最初の文字決めるボタン的な
      </button> */}
      {(() => {
        if (isFirst) {
          return <PrevP>最初の単語:{prevWord}</PrevP>;
        } else {
          return <PrevP>前の単語:{prevWord}</PrevP>;
        }
      })()}

      <WordSendDiv>
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
      </WordSendDiv>
      <Buttons>
        <FirstButton
          onClick={() => {
            firstReqData();
          }}
        >
          最初の単語を決めるボタン的な
        </FirstButton>
        <ResetButton
          onClick={() => {
            reset();
          }}
        >
          リセット
        </ResetButton>
      </Buttons>
      {/* <HistoryP>履歴</HistoryP> */}
      <HistoriesDiv>
        {wordList.map((items) => {
          return (
            <FlexHistoryDiv>
              <PrevUserDiv>
                {items.isUser ? "プレイヤー" : "サーバー"}
              </PrevUserDiv>
              <PrevWordDiv>{items.Word}</PrevWordDiv>
            </FlexHistoryDiv>
          );
        })}
      </HistoriesDiv>
    </AllDiv>
  );
}

function main() {
  ReactDOM.render(<App />, document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
