import React, { useState } from "https://cdn.skypack.dev/react@17.0.2?dts";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.2?dts";
import useStateEffect from "https://cdn.skypack.dev/use-state-effect";
import styled from "https://cdn.skypack.dev/styled-components@5.3.3?dts";
import { pokemons } from "../components/pokemon.tsx";
import {
  AllDiv,
  Buttons,
  FirstButton,
  FlexHistoryDiv,
  HistoriesDiv,
  IndexDiv,
  ItemsDiv,
  PrevDiv,
  PrevUserDiv,
  PrevWordDiv,
  ResetButton,
  TitleH1,
  WordDiv,
  WordInput,
  WordSendButton,
  WordSendDiv,
} from "./style.ts";

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
    const data = await fetch("/firstData");
    const firstWord = await data.json();
    setPrevWord(firstWord.name);
    setWordList((prev) => [...prev, { Word: firstWord.name, isUser: false }]);
  };

  const reqData = async (word: string) => {
    const response = await fetch("/word", {
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
      changeAbnormalWord(prevWord)[changeAbnormalWord(prevWord).length - 1] !==
      usersword[0]
    ) {
      alert("単語が適切な形で入力されていません");
      return true;
    } else if (
      changeAbnormalWord(usersword)[
        changeAbnormalWord(usersword).length - 1
      ] === "ン"
    ) {
      alert("んが末尾についたら負けです");
      return true;
    } else {
      return false;
    }
  };
  const checkGameEnd = (word: string) => {
    wordList.map((items) => {
      if (items.Word === word) {
        alert("同じ単語が二回出たのでコンピューターの負けです");
        return true;
      }
    });
    if (
      changeAbnormalWord(word)[changeAbnormalWord(word).length - 1] === "ン"
    ) {
      alert("んが末尾についたのでコンピューターの負けです");
      return true;
    } else {
      false;
    }
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
            <WordDiv>送信</WordDiv>
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
                <PrevUserDiv>{items.isUser ? "プレイヤー" : "COM"}</PrevUserDiv>
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
