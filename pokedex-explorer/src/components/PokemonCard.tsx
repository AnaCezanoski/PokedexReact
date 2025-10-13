import React from 'react';
import "../../assets/pokeball.png"
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  name: string;
  imageUri?: string | null;
  onPress?: () => void;
};

export default function PokemonCard({ name, imageUri, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={imageUri ? { uri: imageUri } : require('../../assets/pokeball.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  name: {
    marginTop: 6,
    textTransform: 'capitalize',
  },
});
