import { instrument } from "@fiberplane/hono-otel";
import { Hono } from "hono";

// Pokedex durable object
import { Pokedex } from "./Pokedex";

import { PokemonService } from "./PokemonService";

const app = new Hono<{ Bindings: Env }>();

/**
 * List pokemon
 */
app.get("/pokemon", async (c) => {
  const pokemon = await c.env.POKEMON_SERVICE.listPokemon();
  return c.json(pokemon);
});

/**
 * Get single pokemon
 */
app.get("/pokemon/:pokemonId", async (c) => {
  const pokemon = await c.env.POKEMON_SERVICE.getPokemonById(
    c.req.param("pokemonId")
  );
  return c.json(pokemon);
});

/**
 * Add a pokemon to a pokedex
 */
app.post("/pokedex/:pokedexId/pokemon/:pokemonId", async (c) => {
  console.log("creating pokemon");
  const pokedexId = c.req.param("pokedexId");
  const pokemonId = c.req.param("pokemonId");
  const pokedexDoId = c.env.POKEDEX.idFromName(pokedexId);
  const stub = c.env.POKEDEX.get(pokedexDoId);
  console.log(`getting pokemon ${pokemonId}`);
  const pokemon: any = await c.env.POKEMON_SERVICE.getPokemonById(pokemonId);
  console.log(`got pokemon ${pokemon.name}`);

  await stub.addPokemon({
    name: pokemon.name,
    type: pokemon.types[0].type.name,
  });

  return c.json(true);
});

/**
 * List pokemon in the pokedex
 */
app.get("/pokedex/:pokedexId/pokemon/", async (c) => {
  const pokedexId = c.req.param("pokedexId");
  const pokedexDoId = c.env.POKEDEX.idFromName(pokedexId);
  const stub = c.env.POKEDEX.get(pokedexDoId);

  const pokemon = (await stub.listPokemon()) as any;
  return c.json(pokemon);
});

export { Pokedex, PokemonService };
export default instrument(app);
