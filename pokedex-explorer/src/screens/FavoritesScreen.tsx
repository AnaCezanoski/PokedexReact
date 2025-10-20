// src/screens/FavoritesScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites, FavoritePokemon } from '../context/FavoritesContext';
import PokemonCard from '../components/PokemonCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type FavoritesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;


export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const navigation = useNavigation<FavoritesNavigationProp>();

  const handlePressPokemon = (item: FavoritePokemon) => {
    navigation.navigate('Details', { nameOrId: item.id });
  };


  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Você ainda não tem Pokémon favoritos.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FavoritePokemon }) => (
    <PokemonCard
      name={item.name}
      imageUri={item.imageUrl ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`}
      onPress={() => handlePressPokemon(item)}
    />
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});