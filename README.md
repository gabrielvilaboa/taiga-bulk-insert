# README #

## What is this repository for? ##
* Add userstories to TAIGA.IO service using user/password and the project's slug.
* It allow to add subject, description and points.
* It allow to remove current userstories (**use it carefully!**).
* **slug**: [https://tree.taiga.io/project/***slug***](https://tree.taiga.io/project/)

## How do I get set up? ##
* Install node, please see: nodejs.org and update npm:
* ```sh
  sudo npm install npm -g
  ```
* Install NPM dependencies:
  ```sh
  npm install
  ```

## How to run? ##
* **Without parameteres**: just add the user stories.
  ```sh
  node index.js
  ```
* **delete-userstories**: remove current user stories.
  *(@default: false)*
  ```sh
  node index.js --delete-userstories=true
  ```
* **userstories_file**: filename to read new user stories.
  *(@default: userstories.json)*
  ```sh
  node index.js --userstories_file=file.json
  ```
## Annex ##
### userstories_file format file ###
Is an array of objects. Example:
```json
[{
  "subject": "Subject 1",
  "description": "Description 1",
  "points": {
    "back": 0,
    "front": 1,
    "ux": 2,
    "design": 3
  }
}, {
  "subject": "Subject 2",
  "description": "Description 2",
  "points": {
    "back": 2,
    "front": 5,
    "ux": 3,
    "design": 8
  }
}]
```
