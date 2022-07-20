import pokemonJson from "./pokemon.json" assert { type: "json" };
type Pokemon = {
  name: string;
  no: number;
};

export const pokemons = pokemonJson as Pokemon[];
