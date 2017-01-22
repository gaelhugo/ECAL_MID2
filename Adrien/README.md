# TETRIS LIKE BEHAVIOUR

Voici un exemple "fonctionnel" de comportement "TETRIS":<br/>
<b>Chaque forme se décompose si une ligne est formée</b><br/><br/>
3 classes composent l'application:<br/>
- App.js<br/>
- Composite.js<br/>
- Piece.js<br/><br/>

Le fichier principal "App.js" se charge de gérer l'avancée des pièces, l'interaction et leur destruction.<br/>
Le fichier "Composite.js" est le gestionnaire de forme<br/>
Le fichier "Piece.js" est le fichier gérant l'unité des formes<br/><br/>
Dans "App.js" on a la fonction "generateNewComposite" qui pour l'instant est soit complètement random, soit on peut lui donner un paramètre qui défini la largeur de la pièce que l'on veut. Il s'agira de l'utiliser avec d'autres paramètres pour générer une forme dépendant des dimensions transmises en websocket.<br/>
Dans "App.js" le mouvement des pièces est gérée par un listener sur les touches de clavier. Il s'agit de customiser cette fonction pour la faire fonctionner avec l'accéléromètre.<br/><br/>
La dimension de la grille ainsi que la vitesse de défilement se gère également dans "App.js"
