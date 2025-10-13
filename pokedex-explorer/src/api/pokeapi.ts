import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000,
});

export type PokemonListItem = {
  name: string;
  url: string;
};

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  const res = await api.get<{ results: PokemonListItem[], count: number }>(`pokemon?limit=${limit}&offset=${offset}`);
  return res.data;
};

export const fetchPokemonByNameOrId = async (identifier: string | number) => {
  const res = await api.get(`pokemon/${identifier}`);
  return res.data;
};

export default api;
