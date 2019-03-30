# Ajouter un nouveau patron de formulaire

Pour ajouter un nouveau patron de formulaire

1. Il faut d'abord créer un nouveau composant, par exemple le compoasant NouveauFormulaire. Il doit être dans le dossier templates. 
   ```
    $ cd templates
    $ ng g c NouveauFormulaire
   ```
2. Dans le fichier .ts du nouveau composant, le développeur doit créer une nouvelle Interface le représentant. 

```
export interface INouveauFormulaire
{
    ...
}
```
3. l'interface doit contenir un filed: {id: string, assigneA:string, ...}
un champ obligatoire signatures: ISignature[]

4. Pour chaque section du que contiendra le nouveau formulaire, la nouvelle interface de ce formulaire doir contenir un objet pour chaque secion 

```
export interface INouveauFormulaire
{
    section1: {...}
    section2: {...}
}
```
5. Les objets sections doivent obligatoirement contenir les attributs *id* et *assigneA*. 

```
export interface INouveauFormulaire
{
    section1: {
        id: string,
        assigneA: string,
        ...
    }
    section2: {
        id: string,
        assigneA: string,
        ...
    }
}
```
6. Les objets sections doivent également contenir un attribut signatures qui initialisera un tableau de nouvelles signatuers. Dépendamment du nombre de signatures souhaités, le nombre d'instanciation changera. Le titre des champs de signatures sont modifiables dans le constructeur de la class Signature. La classe signature se trouve dans le fichier *fields.ts*.
   
```
export interface INouveauFormulaire
{
    section1: {
        id: string,
        assigneA: string,
        ...
    }
    section2: {
        id: string,
        assigneA: string,
        ...
    }
    signatures = [
        new Signature("sig-boursier", "SIGNATURE DU BOURSIER", null, "", false, false, false),
        new Signature("sig-titulaire", "SIGNATURE DU (DES) TITULAIRES(S) DE SUBVENTION", null, "", false, false, false),
        new Signature("sig-autorise", "SIGNATURE(S) AUTORISÉE(S)", null, "", false, false, false),
        new Signature("sig-finances", "SERVICE DES FINANCES", null, "", false, false, false),
    ];
}
```
7. Pour chaque section dans le .html, 
    <div class = "section"> // peut changer
    <div id = "$field"> // exactement pareil
8.  Pour les signaures, <div *ngFor="let sig of signatures">

TS

1. Make it extends BaseFormComponent implements INewForm 
2. Initialiser les attributs : des lignes pour un tableau et les Signatures (classe Signature existante)
3. Obligatoire: setSection(){this.section=[...]}
4. this.dSventilation = new MatTableDataSource
   
instance.service.ts
1. Importer la nouvelle Interface

template.service.ts
1. import new Component
2. add it to FORMS_DATA {name:, id:, NewFormClass}
3. 3. add Interface to interface Instace "data"
4. add interface to postInstance(formdata, ...)