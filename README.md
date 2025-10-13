# PokedexExplorer - React

Um catálogo de Pokémon interativo desenvolvido em **React Native com Expo**, que consome a [PokéAPI](https://pokeapi.co/).  
O aplicativo permite visualizar, buscar e favoritar Pokémon, além de explorar detalhes de cada um deles.



## Equipe
- Ana Julia Rocha Cezanoski
- Kauane Santana da Rosa
- Lucas Nascimento da Silva
  

## Funcionalidades

- **Tela Principal**
  - Exibe uma lista de Pokémon em grade.
  - Botão **Carregar Mais** para paginação.
  - Campo de **busca** por nome ou número do Pokémon.
  - Indicador de carregamento e mensagens de erro.

- **Tela de Detalhes**
  - Exibe sprite em tamanho maior, número da Pokédex, tipos e habilidades.
  - Possibilidade de **favoritar/desfavoritar** o Pokémon.

- **Tela de Favoritos**
  - Lista os Pokémon favoritados globalmente via Context API.
  - Atualiza automaticamente ao favoritar/desfavoritar.


## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/) – requisições HTTP
- [React Navigation](https://reactnavigation.org/) – navegação entre telas
- Context API – gerenciamento de estado global
- [PokéAPI](https://pokeapi.co/) – dados dos Pokémon


## Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/AnaCezanoski/PokedexReact.git
cd pokedex-explorer
````
### 2. Instalar as dependências
```bash
npm install
```
### 3. Rodar o projeto
```bash
npx expo start
```
