export type PokemonSummary = {
  name: string;
  url: string;
};

export type PokemonDetail = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default?: string | null;
      }
    }
  };
  types: { slot: number; type: { name: string; url: string } }[];
  abilities: { ability: { name: string; url: string } }[];
};
