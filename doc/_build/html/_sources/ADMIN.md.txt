### Créer un nouvel utilisateur

Permet de créer un nouveau compte utilisateur et envoie un lien d'activation à l'utilisateur pour confirmer son compte et définir son mot de passe. 

**Note :** Le lien généré sera valide pendant 60 jours.
 
| POST | /admin/users/new |
| ---- | ---------- |
|Authorization | **Token** _authorizationToken_|

Exemple d'un JSON à envoyer : 

```json 
{
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "type": "ADMIN" /* Valeurs possibles : ['ADMIN', 'MANAGER', 'USER'] */
  }
}
```
Exemples de réponses :
 
| CODE  | 201 |
| ----- | --- |

```json 
{
    "_id": "5c7ffc5b8138a50eef79c4a7",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "type": "ADMIN",
    "createdAt": "2019-03-06T16:59:07.942Z",
    "updatedAt": "2019-03-06T16:59:07.942Z",
    "linkExpiration": "2019-05-05T15:59:07.942Z"
}
```

| CODE  | 400 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***
### Mettre à jour un compte utilisateur

Permet de modifier l'adresse e-mail ou le type d'un utilisateur existant.

| PATCH | /admin/users/5c81f580d56259370d9e049a |
| ----  | ---------- |
|Authorization | **Token** _authorizationToken_|

Exemple d'un JSON à envoyer : 

```json 
{
  "user": {
    "email": "john.doe@email.com",
    "type": "USER"
  }
}
```

Exemples de réponses :
 
| CODE  | 204 |
| ----- | --- |

| CODE  | 400 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***
### Supprimer un compte utilisateur

Permet de supprimer un compte utilisateur existant.

**Note :** il n'est pas possible pour un admin de supprimer son propre compte.

| DELETE | /admin/users/5c81f580d56259370d9e049a |
| ----   | ---------- |
|Authorization | **Token** _authorizationToken_|

Exemples de réponses :
 
| CODE  | 204 |
| ----- | --- |

| CODE  | 403 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```

***
### Réinitialiser le mot de passe d'un compte utilisateur

Permet d'envoyer un lien (par e-mail) pour définir un nouveau mot de passe à l'utilisateur concerné.

| GET | /admin/users/reset/5c81f580d56259370d9e049a |
| ----   | ---------- |
|Authorization | **Token** _authorizationToken_|

Exemples de réponses :
 
| CODE  | 204 |
| ----- | --- |

| CODE  | 404 |
| ----- | --- |

```json 
{
    "erreur": "Raison de l'erreur"
}
```
