import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { pokemons } from "./pokemon.tsx";
let previousWord = "しりとり";
const firstPokemonData = pokemons[Math.floor(Math.random() * pokemons.length)];
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
    // const requestJson = await req.json();

    // const nextWord = requestJson.nextWord;

    // if (
    //   nextWord.length > 0 &&
    //   previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    // ) {
    //   return new Response("前の単語に続いていません。", { status: 400 });
    // }
    // console.log(req);
    // console.log(req.body.getReader().read());
    // console.log("yahharo");
    // req.body.getReader().then(function A(value) {
    //   console.log(value);
    // });
    const reqData = await req.json();
    console.log("yahharo-");
    console.log(
      getAvalablePokemons(reqData.sendText[reqData.sendText.length - 1])
    );
    // previousWord = nextWord;
    return new Response(
      JSON.stringify(
        getAvalablePokemons(reqData.sendText[reqData.sendText.length - 1])
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
    fsRoot: "dist",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,
  });
});
