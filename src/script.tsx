import React, { useState } from "https://cdn.skypack.dev/react@17.0.2?dts";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.2?dts";
import useStateEffect from "https://cdn.skypack.dev/use-state-effect";
import styled, {
  createGlobalStyle,
} from "https://cdn.skypack.dev/styled-components@5.3.3?dts";
import { pokemons } from "../components/pokemon.tsx";

const AllDiv = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background-color: #abbbf0;
`;
const ItemsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleH1 = styled.h1`
  margin-block-start: 0;
  margin-block-end: 0;
  padding-top: 134px;
  padding-bottom: 50px;
  margin: 0;
  color: #0d0f41;
`;
const WordInput = styled.input`
  width: 440px;
  height: 34px;
  border: 1px solid;
  color: #8494c9;
`;
const WordSendDiv = styled.div`
  padding: 20px;
`;
const WordSendButton = styled.button`
  width: 60px;
  height: 34px;
`;
const PrevDiv = styled.div`
  height: 40px;
  width: 500px;
  border: 1px solid black;
  background-color: #8494c9;
  display: flex;
  align-items: center;
  color: #0d0f41;
`;

const Buttons = styled.div`
  padding: 20px;
  display: flex;
  // justify-content: flex-end;
`;
const ResetButton = styled.button``;
const FirstButton = styled.button``;

const HistoriesDiv = styled.div`
  margin: 10px auto;
  width: 500px;
  max-height: 288px;
  background-color: red;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const FlexHistoryDiv = styled.div`
  display: flex;
`;
const IndexDiv = styled.div`
  background-color: yellow;
  display: flex;
  text-align: center;
  align-items: center;
  width: 50px;
  height: 30px;
`;
const PrevUserDiv = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  background-color: red;
  border: 1px solid;
  border-color: purple;
  width: 100px;
  height: 30px;
`;
const PrevWordDiv = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  background-color: aqua;
  border: 1px solid;
  border-color: black;
  width: 350px;
  height: 30px;
`;

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
    const A = word.replace("ァ", "ア");
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
    return O;
  };
  const firstReqData = async () => {
    const data = await fetch("http://localhost:8000/firstData");
    const firstWord = await data.json();
    setPrevWord(firstWord.name);
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
  const checkGameEnd = (word: string) => {
    if (
      changeAbnormalWord(word)[changeAbnormalWord(word).length - 1] === "ン"
    ) {
      return true;
    } else {
      false;
    }
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
      <ItemsDiv>
        <TitleH1>ポケモンしりとり</TitleH1>

        <WordSendDiv>
          <WordInput
            value={sendText}
            onChange={(event) => setSendText(hiraToKana(event.target.value))}
          ></WordInput>
          <WordSendButton
            onClick={() => {
              setIsFirst(false);
              setWordList((prev) => [
                ...prev,
                { Word: sendText, isUser: true },
              ]);
              wordCheck(sendText);
            }}
          >
            送信
          </WordSendButton>
        </WordSendDiv>
        {(() => {
          if (isFirst) {
            return <PrevDiv>最初の単語:{prevWord}</PrevDiv>;
          } else {
            return <PrevDiv>前の単語:{prevWord}</PrevDiv>;
          }
        })()}
        <Buttons>
          <FirstButton
            onClick={() => {
              firstReqData();
            }}
          >
            最初の単語
          </FirstButton>
          <ResetButton
            onClick={() => {
              reset();
            }}
          >
            リセット
          </ResetButton>
        </Buttons>

        <HistoriesDiv>
          {wordList.map((items, index) => {
            return (
              <FlexHistoryDiv>
                <IndexDiv>{index + 1}</IndexDiv>
                <PrevUserDiv>
                  {items.isUser ? "プレイヤー" : "サーバー"}
                </PrevUserDiv>
                <PrevWordDiv>{items.Word}</PrevWordDiv>
              </FlexHistoryDiv>
            );
          })}
        </HistoriesDiv>
      </ItemsDiv>
    </AllDiv>
  );
}

function main() {
  ReactDOM.render(<App />, document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
