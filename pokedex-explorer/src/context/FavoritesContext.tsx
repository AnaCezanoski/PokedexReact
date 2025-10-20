// src/context/FavoritesContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { PokemonDetail, PokemonSummary } from '../types'; // Importe seus tipos

// Define o tipo para um item favorito (pode ser ajustado conforme necessário)
export type FavoritePokemon = Pick<PokemonDetail, 'id' | 'name'> & {
  imageUrl?: string | null;
};

type FavoritesContextType = {
  favorites: FavoritePokemon[];
  addFavorite: (pokemon: FavoritePokemon) => void;
  removeFavorite: (pokemonId: number) => void;
  isFavorited: (pokemonId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const addFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.some(fav => fav.id === pokemon.id)) {
        return [...prevFavorites, pokemon];
      }
      return prevFavorites;
    });
  }, []);

  const removeFavorite = useCallback((pokemonId: number) => {
    setFavorites((prevFavorites) => prevFavorites.filter((pokemon) => pokemon.id !== pokemonId));
  }, []);

  const isFavorited = useCallback((pokemonId: number) => {
    return favorites.some((pokemon) => pokemon.id === pokemonId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado com um FavoritesProvider');
  }
  return context;
};