# Documentation développeur

## Ajouter un nouveau patron de formulaire.

Pour ajouter un nouveau patron de formulaire,

1. cd templates
2. ng g c newForm
3. in .ts, exports a new class AND an Interface,
l'interface doit contenir un filed: {id: string, assigneA:string, ...}
un champ obligatoire signatures: ISignature[]
4. Pour chaque section dans le .html, 
    <div class = "section"> // peut changer
    <div id = "$field"> // exactement pareil
5. Pour les signaures, <div *ngFor="let sig of signatures">

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