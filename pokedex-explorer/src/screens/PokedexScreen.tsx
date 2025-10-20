import React, { useEffect, useState } from 'react';
import "../components/PokemonCard"
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchPokemonList, fetchPokemonByNameOrId } from '../api/pokeapi';
import PokemonCard from '../components/PokemonCard';
import type { PokemonSummary } from '../types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pokedex'>;

export default function PokedexScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonList(limit, offset);
      setPokemons(prev => [...prev, ...data.results]);
      setOffset(prev => prev + limit);
      setTotalCount(data.count);
    } catch (err) {
      setError('Não foi possível carregar a lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (totalCount !== null && pokemons.length >= totalCount) return;
    loadPokemons();
  };

  const handlePressPokemon = (item: PokemonSummary) => {
    navigation.navigate('Details', { nameOrId: item.name });
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonByNameOrId(searchInput.toLowerCase().trim());
      navigation.navigate('Details', { nameOrId: data.id });
    } catch (err) {
      setError('Pokémon não encontrado. Verifique o nome ou número.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: PokemonSummary }) => {
    const match = item.url.match(/\/pokemon\/(\d+)\//);
    const id = match ? match[1] : null;
    const imageUri = id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` : undefined;
    return <PokemonCard name={item.name} imageUri={imageUri} onPress={() => handlePressPokemon(item)} />;
  };

  const goToFavorites = () => {
    navigation.navigate('Favorites');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Nome ou número do Pokémon"
          style={styles.input}
          autoCapitalize="none"
        />
        <Button title="Buscar" onPress={handleSearch} />
        <TouchableOpacity onPress={goToFavorites} style={styles.favoritesIcon}>
          <Ionicons name="heart" size={28} color="#e3350d" />
        </TouchableOpacity>
      </View>

      {loading && pokemons.length === 0 ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : error && pokemons.length === 0 ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={pokemons}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            contentContainerStyle={{ padding: 8 }}
            showsVerticalScrollIndicator={false}
          />
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : (
            <Button title="Carregar Mais" onPress={handleLoadMore} disabled={totalCount !== null && pokemons.length >= totalCount} />
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  searchRow: {
     flex: 1,
     flexDirection: 'row',
     gap: 8,
     padding: 12,
  },
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, backgroundColor: '#fff' },
  favoritesIcon: { padding: 8 },
  error: { color: 'red', textAlign: 'center', margin: 8 },
});
