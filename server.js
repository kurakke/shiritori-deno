import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { pokemons } from "./components/pokemon.tsx";
let previousWord = "しりとり";

let yahharo = "やっはろ";
const ngChars = ["ン", "X", "Y"];
console.log("Listening on http://localhost:8000");
function getAvalablePokemons(tailChar) {
  const avalablePokemons = pokemons
    .filter((pokemon) => pokemon.name[0] === tailChar)
    .filter((pokemon) =>
      ngChars.every(
        (ngChar) => ngChar !== pokemon.name[pokemon.name.length - 1]
      )
    );
  return avalablePokemons;
}
const changeAbnormalWord = (word) => {
  const first = word.replace("2", "ツー");
  const smallA = first.replace("ァ", "ア");
  const smallI = smallA.replace("ィ", "イ");
  const smallU = smallI.replace("ゥ", "ウ");
  const smallE = smallU.replace("ェ", "エ");
  const smallO = smallE.replace("ォ", "オ");
  const smallTu = smallO.replace("ッ", "ツ");
  const smallYa = smallTu.replace("ャ", "ヤ");
  const smallYu = smallYa.replace("ュ", "ユ");
  const smallYo = smallYu.replace("ョ", "ヨ");
  const hihun = smallYo.replace("ー", "");
  const strZ = hihun.replace("Z", "ゼット");
  const strY = strZ.replace("Y", "ワイ");
  const strX = strY.replace("X", "エックス");
  const male = strX.replace("♂", "オス");
  const female = male.replace("♀", "メス");
  const nextHihun = female.replace("ー", "");
  return nextHihun;
};
serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(req);
  if (req.method === "OPTIONS") {
    return new Response("", {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:1234",
        "Access-Control-Allow-Method": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  if (req.method === "GET" && pathname === "/shiritori") {
    console.log("in shiritori");
    return new Response(JSON.stringify(previousWord), {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:1234",
      },
    });
  }
  if (req.method === "GET" && pathname === "/firstData") {
    const firstPokemonData =
      pokemons[Math.floor(Math.random() * pokemons.length)];
    console.log("in firstData");
    console.log(firstPokemonData);
    return new Response(JSON.stringify(firstPokemonData), {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:1234",
      },
    });
  }

  if (req.method === "POST" && pathname === "/word") {
    const reqData = await req.json();
    console.log("yahharo-");
    const changedWord = changeAbnormalWord(reqData.sendText);
    console.log(
      getAvalablePokemons(changedWord[changedWord.length - 1])
    );
    return new Response(
      JSON.stringify(
        getAvalablePokemons(changedWord[changedWord.length - 1])
      ),
      {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:1234",
        },
      }
    );
  }
  console.log("out serverDir");
  return serveDir(req, {
    fsRoot: "public",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,
  });
});
