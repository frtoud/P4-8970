### Accéder au lien d'activation d'un compte utilisateur

Il s'agit de la première requête à faire pour accéder à la vue d'activation d'un compte utilisateur.
 
| GET  | /users/verify/5c81f580d56259370d9e049a |
| ---- | ---------- |

Exemples de réponses :
 
| CODE  | 200 |
| ----- | --- |

| CODE  | 400, 403, 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***

### Activer un compte : définir un mot de passe

Deuxième et dernière étape pour activer un compte utilisateur. 

| PATCH | /users/verify/5c81f580d56259370d9e049a |
| ---- | ---------- |

Exemple d'un JSON à envoyer : 

```json 
{
  "user": {
    "password": "Q12ry2364ddsf"
  }
}
```

Exemples de réponses :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c81f580d56259370d9e049a",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@email.com",
    "type": "USER",
    "createdAt": "2019-03-08T04:54:24.245Z",
    "updatedAt": "2019-03-09T03:18:43.109Z",
    "linkExpiration": null,
    "hash": "$2b$08$x4iYlfvXgL6eAHub3Lu.sJuTLvfCwnBg4nVUfWimwD9Kd8E.y"
}
```

| CODE  | 400, 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***

### Authentification 

| POST  | /users/login |
| ----- | ------------ |

Exemple d'un JSON à envoyer : 

```json 
{
  "user": {
    "email": "jane.doe@email.com",
    "password": "Q12ry2364ddsf"
  }
}
```

Exemples de réponses :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c81f580d56259370d9e049a",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@email.com",
    "type": "USER",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

| CODE  | 400, 403, 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***

### Obtenir la liste d'utilisateurs

| GET  | /users |
| ---- | ------ |

Ou bien avec une requête : 

| GET  | /users?type=ADMIN |
| ---- | ------------------- |

**Types disponibles :** [ADMIN, MANAGER, USER]

Exemples de réponses :
 
| CODE  | 200 |
| ----- | --- |

```json 
[
    {
        "_id": "5c8177712e64ab2736875bc7",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@email.com",
        "type": "ADMIN",
        "createdAt": "2019-03-07T19:56:33.476Z",
        "updatedAt": "2019-03-07T19:56:33.476Z"
    },
    {
        "_id": "5c81dd19e0fc042e77ca96ef",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@test.com",
        "type": "ADMIN",
        "createdAt": "2019-03-08T03:10:17.064Z",
        "updatedAt": "2019-03-08T03:10:17.064Z"
    }
]
```

| CODE  | 400, 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***

### Obtenir un utilisateur par son ID

| GET  | /users/5c8177712e64ab2736875bc7 |
| ---- | ---------- |

Exemples de réponses :
 
| CODE  | 200 |
| ----- | --- |

```json 
{
    "_id": "5c8177712e64ab2736875bc7",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "type": "ADMIN",
    "createdAt": "2019-03-07T19:56:33.476Z",
    "updatedAt": "2019-03-07T19:56:33.476Z"
}
```

| CODE  | 400, 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```