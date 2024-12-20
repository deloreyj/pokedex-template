import { WorkerEntrypoint } from "cloudflare:workers";

export class PokemonService extends WorkerEntrypoint<Env> {
  async listPokemon() {
    const response = await fetch(`${this.env.POKEMON_API_BASE}/pokemon`);
    if (!response.ok) {
      throw new Error("failed to fetch pokemon");
    }
    return response.json();
  }

  async getPokemonById(id: string) {
    const response = await fetch(`${this.env.POKEMON_API_BASE}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("failed to fetch pokemon");
    }
    return response.json();
  }
}
