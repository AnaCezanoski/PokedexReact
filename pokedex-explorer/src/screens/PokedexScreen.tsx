import React, { useEffect, useState, useMemo } from 'react';
import "../components/PokemonCard"
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { fetchPokemonList } from '../api/pokeapi';
import PokemonCard from '../components/PokemonCard';
import type { PokemonSummary } from '../types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

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

  const loadPokemons = async (isInitialLoad = false) => {
    if (loading || (totalCount !== null && pokemons.length >= totalCount && !isInitialLoad)) return;

    try {
      setLoading(true);
      setError(null);
      const currentOffset = isInitialLoad ? 0 : offset;
      const data = await fetchPokemonList(limit, offset);
      setPokemons(prev => isInitialLoad ? data.results : [...prev, ...data.results]);
      setOffset(prev => prev + limit);
      if (isInitialLoad || totalCount === null) {
         setTotalCount(data.count);
      }
    } catch (err) {
      setError('Não foi possível carregar a lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadPokemons();
  };

  const handlePressPokemon = (item: PokemonSummary) => {
    navigation.navigate('Details', { nameOrId: item.name });
  };

  const filteredData = useMemo(() => {
    if (!searchInput) {
      return pokemons;
    }
    const searchTerm = searchInput.toLowerCase().trim();
    
    return pokemons.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);

      const urlMatch = pokemon.url.match(/\/pokemon\/(\d+)\//); //
      const id = urlMatch ? urlMatch[1] : null; //
      const idMatch = id ? id.includes(searchTerm) : false;

      return nameMatch || idMatch;
    });
  }, [pokemons, searchInput]);

  const renderItem = ({ item }: { item: PokemonSummary }) => {
    const match = item.url.match(/\/pokemon\/(\d+)\//);
    const id = match ? match[1] : null;
    const imageUri = id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` : undefined;
    return <PokemonCard name={item.name} imageUri={imageUri} onPress={() => handlePressPokemon(item)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Digite o nome ou número do Pokémon"
          style={styles.input}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          keyboardType="web-search"
        />
      </View>

      {loading && pokemons.length === 0 ? (
        <ActivityIndicator size="large" style={styles.centerSpinner} />
      ) : error && pokemons.length === 0 ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                !loading ? <Text style={styles.noResults}>Nenhum Pokémon encontrado.</Text> : null
            }
          />
          {loading && pokemons.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null}

          {!searchInput && totalCount !== null && pokemons.length < totalCount && !loading && (
             <View style={styles.loadMoreButtonContainer}>
               <Button
                  title="Carregar Mais"
                  onPress={handleLoadMore}
                  disabled={loading}
                />
             </View>
          )}

          {error ? <Text style={[styles.error, { paddingBottom: 10 }]}>{error}</Text> : null}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: {
     flexDirection: 'row',
     paddingHorizontal: 12,
     paddingTop: 12,
     paddingBottom: 8,
     gap: 8,
     borderBottomWidth: 1,
     borderBottomColor: '#ddd',
     backgroundColor: '#f2f2f2',
  },
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  input: {
     flex: 1,
     borderWidth: 1,
     borderColor: '#ddd',
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 20,
     backgroundColor: '#fff',
     fontSize: 16,
  },
  listContentContainer: {
    padding: 8,
    paddingBottom: 60,
  },
  centerSpinner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  error: { color: 'red', textAlign: 'center', margin: 8 },
  loadMoreButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  noResults: {
     textAlign: 'center',
     marginTop: 30,
     fontSize: 16,
     color: '#666',
  }
});
