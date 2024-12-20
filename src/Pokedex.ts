import { DurableObject } from "cloudflare:workers";

export type Pokemon = {
  name: string;
  type: string;
};

export class Pokedex extends DurableObject {
  sql: SqlStorage;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;

    ctx.blockConcurrencyWhile(async () => {
      this.sql.exec(`CREATE TABLE IF NOT EXISTS pokemon(
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        name  TEXT,
        type  TEXT
      );`);
    });
  }

  async addPokemon(pokemon: Pokemon) {
    this.sql.exec(
      "INSERT INTO pokemon (name, type) VALUES (?, ?)",
      pokemon.name,
      pokemon.type
    );
  }

  async listPokemon() {
    const cursor = this.sql.exec("SELECT * FROM pokemon");
    return cursor.toArray();
  }
}
