## Installer PolyForms
Pour installer un logiciel et toutes les dépendances nécessaires (c'est-à-dire: Node.js et MongoDB)
exécutez le script situé à la racine du dossier du projet appelé install.sh.

```
sudo bash ./install.sh
```

## Déployer PolyForms
Pour déployer l'application PolyForms sur la machine locale, exécutez:

```
sudo bash ./deploy.sh
```

## Éteindre PolyForms
Le déploiement se fait en mode développement, les serveurs continuent donc à être exécutés sur des processus en parallèle. Pour éteindre Polyforms, exécutez

```
sudo bash ./stop.sh
```

## Désinstaller PolyForms
Pour désinstaller PolyForms et toutes ses dépendances (c'est-à-dire Node.js et MongoDB),éteindre Polyforms. Ensuite, exécutez:

```
sudo bash ./uninstall.sh
```