// src/screens/DetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Pressable } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { fetchPokemonByNameOrId } from '../api/pokeapi';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { PokemonDetail } from '../types';
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, FavoritePokemon } from '../context/FavoritesContext';

type Props = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: any;
};

export default function DetailsScreen({ route }: Props) {
  const param = route.params?.nameOrId;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  const favorited = pokemon ? isFavorited(pokemon.id) : false;

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        if (param) {
          const data: PokemonDetail = await fetchPokemonByNameOrId(param);
          setPokemon(data);
        }
      } catch (err) {
        setError('Não foi possível carregar os detalhes do Pokémon.');
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [param]);

  const handleToggleFavorite = () => {
    if (!pokemon) return;

    const favoriteData: FavoritePokemon = {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default
    };

    if (favorited) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(favoriteData);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!pokemon) {
    return null;
  }

  const imageUri =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={imageUri ? { uri: imageUri } : require('../../assets/pokeball.png')}
        style={styles.image}
      />

      <Pressable
        style={({ pressed }) => [
          styles.favoriteButton,
          pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
          favorited && styles.favoriteButtonActive,
        ]}
        onPress={handleToggleFavorite}
      >
        <Ionicons
          name={favorited ? "star" : "star-outline"}
          size={32}
          color={favorited ? "#FFD700" : "#5e5e5e"}
        />
      </Pressable>

      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.row}>
          {pokemon.types.map((t) => (
            <View key={t.slot} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.row}>
          {pokemon.abilities.map((a, index) => (
            <View key={index} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>{a.ability.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  favoriteButton: {
    marginVertical: 12,
    backgroundColor: '#ffffff',
    borderColor: '#9acbe2ff',
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#fff7d1',
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 12,
  },
  id: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  typeText: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  abilityBadge: {
    backgroundColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  abilityText: {
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
  },
});
