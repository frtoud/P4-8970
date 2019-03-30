### Créer une nouvelle instance de formulaire

| POST  | /forms/new |
| ----- | ------------ |

Exemple d'un JSON à envoyer : 

```json 
{
  "form": {
  	"idForm": "DA",
    "auteur": {
    	"idAuteur": "5c8dbd4800de679f160dd618",
    	"nom": "John Smith",
    	"typeAuteur": "MANAGER"
    },
    "nomFormulaire": "Avance de voyage",
    "collaborateurs": [
         { "idCollaborateur": "5c81f580d56259370d9e049a", "nom": "Jane Doe", "email": "jane.doe@email.com", "acces": "EDITION"},
         { "idCollaborateur": "5c8dbcb700de679f160dd617", "nom": "John Smith", "email": "john.smith@email.com", "acces": "WAITING"}],
    "data": { /* Contenu du formulaire */ }
  }
}
```

Exemple de réponse :
 
| CODE  | 201 |
| ----- | --- |

```json 
{
    "_id": "5c9906d7f459c74ef861eee2",
    "idForm": "DA-5c9906d7f459c74ef861eee2",
    "auteur": {
        "idAuteur": "5c8dbd4800de679f160dd618",
        "nom": "John Smith",
        "typeAuteur": "MANAGER"
    },
    "nomFormulaire": "Avance de voyage",
    "collaborateurs": [
        {
            "_id": "5c9906d8f459c74ef861eee4",
            "idCollaborateur": "5c81f580d56259370d9e049a",
            "nom": "Jane Doe",
            "email": "jane.doe@email.com",
            "acces": "EDITION"
        },
        {
            "_id": "5c9906d8f459c74ef861eee3",
            "idCollaborateur": "5c8dbcb700de679f160dd617",
            "nom": "John Smith",
            "email": "john.smith@email.com",
            "acces": "WAITING"
        }
    ],
    "data": { /* Contenu du formulaire */ },
    "statut": "IN_PROGRESS",
    "creeLe": "2019-03-25T16:50:32.695Z",
    "modifieLe": "2019-03-25T16:50:32.695Z"
}
```

***

### Obtenir la liste des formulaires

| GET   | /forms       |
| ----- | ------------ |

Exemple de réponse :
 
| CODE  | 200 |
| ----- | --- |

```json 
[
    {
        "_id": "5c970d425547ae2c2bb4c2d2",
        "idForm": "DA-5c970d425547ae2c2bb4c2d2",
        "auteur": {
            "idAuteur": "5c8aef7f720a8f79f24e8db5",
            "nom": "John Smith",
            "typeAuteur": "MANAGER"
        },
        "nomFormulaire": "Demande d'achat",
        "collaborateurs": [
            {
                "_id": "5c9711cec36a4a2dd4ee9c3a",
                "idCollaborateur": "5c8bb5627ebd2693e142193c",
                "nom": "John Smith",
                "email": "john.smith@email.com",
                "ordre": 3,
                "acces": "COMPLETED"
            }
        ],
        "statut": "ARCHIVED",
        "creeLe": "2019-03-24T05:12:46.843Z",
        "modifieLe": "2019-03-24T05:12:46.843Z"
    },
    {
        "_id": "5c9906d7f459c74ef861eee2",
        "idForm": "DA-5c9906d7f459c74ef861eee2",
        "auteur": {
            "idAuteur": "5c8dbd4800de679f160dd618",
            "nom": "John Smith",
            "typeAuteur": "MANAGER"
        },
        "nomFormulaire": "Avance de voyage",
        "collaborateurs": [
            {
                "_id": "5c9712a06ebf8c2df96257bc",
                "idCollaborateur": "5c8aef7f720a8f79f24e8db5",
                "nom": "Jane Doe",
                "email": "jane.doe@email.com",
                "ordre": 2,
                "acces": "COMPLETED"
            },
            {
                "_id": "5c9712a06ebf8c2df96257bb",
                "idCollaborateur": "5c8bb5627ebd2693e142193c",
                "nom": "John Smith",
                "email": "john.smith@email.com",
                "ordre": 3,
                "acces": "COMPLETED"
            }
        ],
        "statut": "IN_PROGRESS",
        "creeLe": "2019-03-24T05:16:16.600Z",
        "modifieLe": "2019-03-24T05:16:16.600Z"
    }
]
```

***

### Obtenir un formulaire

| GET     | /forms/5c8dbd4800de679f160dd618   |
| ------- | ------------ |

Exemple de réponse :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c9906d7f459c74ef861eee2",
    "idForm": "DA-5c9906d7f459c74ef861eee2",
    "auteur": {
        "idAuteur": "5c8dbd4800de679f160dd618",
        "nom": "John Smith",
        "typeAuteur": "MANAGER"
    },
    "nomFormulaire": "Avance de voyage",
    "collaborateurs": [
        {
            "_id": "5c9906d8f459c74ef861eee4",
            "idCollaborateur": "5c81f580d56259370d9e049a",
            "nom": "Jane Doe",
            "email": "jane.doe@email.com",
            "acces": "EDITION"
        },
        {
            "_id": "5c9906d8f459c74ef861eee3",
            "idCollaborateur": "5c8dbcb700de679f160dd617",
            "nom": "John Smith",
            "email": "john.smith@email.com",
            "acces": "WAITING"
        }
    ],
    "data": { /* Contenu du formulaire */ },
    "statut": "IN_PROGRESS",
    "creeLe": "2019-03-25T16:50:32.695Z",
    "modifieLe": "2019-03-25T16:50:32.695Z"
}
```

***

### Obtenir les formulaires d'un utilisateur

Retourne la liste des formulaires qui concernent l'utilisateur en question (L'utilisateur est l'auteur ou collaborateur).

| GET     | /forms/user/5c8dbd4800de679f160dd618   |
| ------- | ----------------- |

Exemple de réponse :
 
| CODE  | 200 |
| ----- | --- |

```json 
[
    {
        "_id": "5c970d425547ae2c2bb4c2d2",
        "idForm": "DA-5c970d425547ae2c2bb4c2d2",
        "auteur": {
            "idAuteur": "5c8aef7f720a8f79f24e8db5",
            "nom": "John Smith",
            "typeAuteur": "MANAGER"
        },
        "nomFormulaire": "Demande d'achat",
        "collaborateurs": [
            {
                "_id": "5c9711cec36a4a2dd4ee9c3a",
                "idCollaborateur": "5c8bb5627ebd2693e142193c",
                "nom": "John Smith",
                "email": "john.smith@email.com",
                "ordre": 3,
                "acces": "COMPLETED"
            }
        ],
        "statut": "ARCHIVED",
        "creeLe": "2019-03-24T05:12:46.843Z",
        "modifieLe": "2019-03-24T05:12:46.843Z"
    },
    {
        "_id": "5c9906d7f459c74ef861eee2",
        "idForm": "DA-5c9906d7f459c74ef861eee2",
        "auteur": {
            "idAuteur": "5c8dbd4800de679f160dd618",
            "nom": "John Smith",
            "typeAuteur": "MANAGER"
        },
        "nomFormulaire": "Avance de voyage",
        "collaborateurs": [
            {
                "_id": "5c9712a06ebf8c2df96257bc",
                "idCollaborateur": "5c8aef7f720a8f79f24e8db5",
                "nom": "Jane Doe",
                "email": "jane.doe@email.com",
                "ordre": 2,
                "acces": "COMPLETED"
            },
            {
                "_id": "5c9712a06ebf8c2df96257bb",
                "idCollaborateur": "5c8bb5627ebd2693e142193c",
                "nom": "John Smith",
                "email": "john.smith@email.com",
                "ordre": 3,
                "acces": "COMPLETED"
            }
        ],
        "statut": "IN_PROGRESS",
        "creeLe": "2019-03-24T05:16:16.600Z",
        "modifieLe": "2019-03-24T05:16:16.600Z"
    }
]
```

***

### Modifier un formulaire

Soumettre une modification à un formulaire en cours. Cette action ne peut être effectuée que par l'auteur du formulaire et les collaborateurs de ce dernier.

| PATCH   | /forms/5c8dbd4800de679f160dd618   |
| ------- | ------------ |

Exemple d'un JSON à envoyer : 

```json 
{
	"userId": "5c8dbd4800de679f160dd618",
	"data": { /* UNIQUEMENT les champs modifiés du formulaire */ }
}
```

Exemple de réponse :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c9906d7f459c74ef861eee2",
    "idForm": "DA-5c9906d7f459c74ef861eee2",
    "auteur": {
        "idAuteur": "5c8dbd4800de679f160dd618",
        "nom": "John Smith",
        "typeAuteur": "MANAGER"
    },
    "nomFormulaire": "Avance de voyage",
    "collaborateurs": [
        {
            "_id": "5c9906d8f459c74ef861eee4",
            "idCollaborateur": "5c81f580d56259370d9e049a",
            "nom": "Jane Doe",
            "email": "jane.doe@email.com",
            "acces": "EDITION"
        },
        {
            "_id": "5c9906d8f459c74ef861eee3",
            "idCollaborateur": "5c8dbcb700de679f160dd617",
            "nom": "John Smith",
            "email": "john.smith@email.com",
            "acces": "WAITING"
        }
    ],
    "data": { /* Contenu du formulaire */ },
    "statut": "IN_PROGRESS",
    "creeLe": "2019-03-25T16:50:32.695Z",
    "modifieLe": "2019-03-25T16:50:32.695Z"
}
```

***

### Valider/Archiver un formulaire

La validation d'un formulaire entraîne automatiquement sa mise en archive.

| PATCH   | /forms/5c8dbd4800de679f160dd618/archive |
| ------- | ------------------ |

Exemple de réponse :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c9906d7f459c74ef861eee2",
    "idForm": "DA-5c9906d7f459c74ef861eee2",
    "auteur": {
        "idAuteur": "5c8dbd4800de679f160dd618",
        "nom": "John Smith",
        "typeAuteur": "MANAGER"
    },
    "nomFormulaire": "Avance de voyage",
    "collaborateurs": [
        {
            "_id": "5c9906d8f459c74ef861eee4",
            "idCollaborateur": "5c81f580d56259370d9e049a",
            "nom": "Jane Doe",
            "email": "jane.doe@email.com",
            "acces": "PREVIEW"
        },
        {
            "_id": "5c9906d8f459c74ef861eee3",
            "idCollaborateur": "5c8dbcb700de679f160dd617",
            "nom": "John Smith",
            "email": "john.smith@email.com",
            "acces": "PREVIEW"
        }
    ],
    "data": { /* Contenu du formulaire */ },
    "statut": "ARCHIVED",
    "creeLe": "2019-03-25T16:50:32.695Z",
    "modifieLe": "2019-03-25T16:50:32.695Z"
}
```
