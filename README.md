# SoundWave
Projet LP S2IMA 2018-2019

# Api RESTful

pour faire fonctionner l'api REST il faut un serveur local mongodb:
- nom de la base: soundwave  
- nom de la collection: plage  

le jeu de test se situe dans le fichier data.json

pour importer le jeu de test il faut éxecuter la commande suivante  
> mongoimport.exe --db soundwave --collection plage --drop --file data.json

note :
- il faut éxecuter cette commande depuis la racine du projet
- la base et la collection seront créée lors de l'import
