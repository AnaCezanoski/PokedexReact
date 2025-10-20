// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import PokedexScreen from '../screens/PokedexScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';

export type RootStackParamList = {
  Pokedex: undefined;
  Details: { nameOrId: string | number } | undefined;
  Favorites: undefined;
};

type PokedexNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pokedex'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function FavoritesHeaderButton() {
  const navigation = useNavigation<PokedexNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Favorites')}
      style={styles.headerButtonContainer}
    >
      <Ionicons name="heart" size={28} color="#e3350d" />
      <Text style={styles.headerButtonText}>Favoritos</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pokedex">
        <Stack.Screen
          name="Pokedex"
          component={PokedexScreen}
          options={{
            title: 'Pokédex',
            headerRight: () => <FavoritesHeaderButton />,
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: 'Detalhes' }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: 'Favoritos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  headerButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#e3350d',
    fontWeight: 'bold',
  }
});