# SmartSplit - Serveur API

## Installation

Pour installer le serveur API, lancez simplement 

```sh
yarn install
```

## Configuration

Copiez le fichier `/config.example.js` vers `config.js` et modifiez les paramètres en fonction des besoins. Toutes les options de configuration sont optionelles et ont une valeur par défaut raisonnable. Cependant, certaines fonctionnalités peuvent ne pas fonctionner. Par exemple, si une clé API SendGrid n'est pas spécifiée, les envois de courriels ne fonctionneront pas.

## Démarrage

Lancez simplement le `index.js` à la racine.

```sh
node .
```

Ou encore:

```sh
yarn start
```
