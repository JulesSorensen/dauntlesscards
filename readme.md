# Projet Outils Dev Front "Dauntless"

## Fonctionnement

### Principal

Cliquez sur "jouer" pour commencer l'aventure !  
Vous pourrez créer des cartes des différents montres appellés "behemots" du jeu vidéo Dauntless, en personnalisant leur niveau de menance !  
Une fois une carte créer via le bouton +, vous pouvez éditez la carte, la supprimer, ou prendre une photo avec le Behemot car son nom sera dans le nom de la photo téléchargée !

### Storage

Les donnés enregistrés via le **session storage** sont les suivantes :

- L'appuie sur le bouton play, vous pouvez recharger la page sans devoir appuyer sur ce bouton à nouveau
- Le dernier behemot sélectionné, vous pouvez recharger la page sans perdre de vue votre dernière selection

Les donnés enregistrés via le **local storage** sont les suivantes :

- La liste de vos behemots, pour ne jamais la perdre même si vous fermez votre navigateur

### API

Divers API listés sur le site *WhatWebCanDo.Today* ont étés utilisés  

Les suivants peuvent être retrouvés en cliquant sur le bouton "info" au niveau de la carte de création de behemots:

- Affichage de la mémoire de l'ordinateur
- Affichage d'informations concernant la batterie
- Affichage du nombre de fois où la page n'était plus en focus (changement de fenêtre / onglet)

Le suivant peut être retrouvé en cliquant sur l'îcone photo sur un behemot ajouté:

- Prise de photo et vue en temps réel, cliquez sur l'icone photo pour prendre et télécharger la photo qui contient le nom du behemot avec lequel vous l'avez prise

## Autre

L'application est bien responsive, les cards se mettent en dessous si il n'y a plus de place.

L'utilisation du spread a été utile au niveau de l'ajout de cartes.

Le PWA est fonctionnel.

L'affichage d'erreur est fonctionnel (lorsque la caméra n'a pas été autorisée)

## What Web Can Do Today

|API UTILISE                    |LIEN                                                 |
|-------------------------------|-----------------------------------------------------|
|Battery Status                 |https://whatwebcando.today/battery-status.html       |
|Foreground Detection           |https://whatwebcando.today/foreground-detection.html |
|Device Memory                  |https://whatwebcando.today/memory.html               |
|Audio & Video Capture          |https://whatwebcando.today/camera-microphone.html    |