import React from 'react';
import { View, Text, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: any;
};

export default function DetailsScreen({ route, navigation }: Props) {
  const param = route.params?.nameOrId;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Detalhes do Pokémon: {String(param)}</Text>
    </View>
  );
}
