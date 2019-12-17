# MIASHS-M2-TP3-Projet

## Installation et lancement

Pour récupérer la dernière version et lancer l'application il faudra éxécuter les commandes suivantes:
```
git clone https://github.com/Selenium62610/ToDoListAngular/tree/master
npm install
ng serve
```

## Fonctionnalités ajoutés

- Sérialisation / désérialisation des données localement (local storage)
- Effacer tout.
- Changement de titre.
- Changer les différents filtres.
- Undo/Redo qui s'actualise aussi avec les modifications de label et d'étâts.
- Tentative de remplir la liste par vocal (Récuperation simple de la parole).
- Lors de l'entrée d'une nouvelle tâche le champs se vide.

## Problèmes rencontrés

Lors du premier démarrage de l'application celle ci peut ne pas compiler, mais étrangement si l'on modifie un fichier et qu'on lui redonne sa forme d'origine, la compilation fonctionne.

## Plugin

Utilisation du plugin SpeechRecognitionService afin de pouvoir enregistrer la voix de l'utilisateur et potentiellement ajouter des tâches a la TodoList
