# Ajouter un nouveau patron de formulaire

Pour ajouter un nouveau patron de formulaire

1. Créer un nouveau composant, par exemple le compoasant NouveauFormulaire. Il doit être dans le dossier templates. 
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

7. Dans le *.ts* du nouveau composant, faire en sorte que la classe *extends* BaseFormComponent et implémente INouveauFormulaire.

```
export class NewFormFormComponent extends BaseFormComponent implements INewForm 
{
    ...
}
```

8. Initialiser les attributs de la classe du nouveau composant du nouveau formulaire. Ceux-ci doivent être les mêmes que ceux de son interface. Lors de l'utilisation de tableau, des lignes (au moins 1) doit être initialiser. De plus, la construction des Signature doit être dans un tableau de Signature.
```
export class NewFormFormComponent extends BaseFormComponent implements INewForm {
 section1 = {
    id: "section1",
    assigneA: null,
    ...
  };
   section1 = {
    id: "section1",
    assigneA: null,
    ...
  };
  ...

    tableau: [
      {id:0, ubr:"", compte:"", unite:"", percent:0, montant:0, },
      {id:1, ubr:"", compte:"", unite:"", percent:0, montant:0, },
      {id:2, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    ],
  }
  signatures = [
    new Signature("sig-boursier", "SIGNATURE DU BOURSIER", null, "", false, false, false),
    new Signature("sig-titulaire", "SIGNATURE DU (DES) TITULAIRES(S) DE SUBVENTION", null, "", false, false, false),
    new Signature("sig-autorise", "SIGNATURE(S) AUTORISÉE(S)", null, "", false, false, false),
    new Signature("sig-finances", "SERVICE DES FINANCES", null, "", false, false, false),
  ];

}
```
9.  Obligatoire: 
    ``` 
    setSection(){
        this.section = [...]
        }
    ```
1.  this.dSventilation = new MatTableDataSource
2.  Pour chaque section dans le .html, 
    ```
    <div class = "section"> // peut changer
    <div id = "$field"> // exactement pareil
    ```
3.  Pour les signaures, 
     ```
    <div *ngFor="let sig of signatures">
    ```
4.  instance.service.ts
    Importer la nouvelle Interface
5.  template.service.ts
    import new Component
6.  add it to FORMS_DATA {name:, id:, NewFormClass}
7.  add Interface to interface Instace "data"
8.  add interface to postInstance(formdata, ...)