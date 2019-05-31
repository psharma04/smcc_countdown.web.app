# SMCC-Countdown
### A "simple" bell tracker and timetabling web app for SMCC students and teachers.

## How to contribute:
1. Make a fork of the GitHub Repository
2. Add your code to the fork
3. Open an issue requesting a new feature
4. If the fork is valid, it will be merged with credit into the master branch

## To-do List:
* Add Timetable Functionality
* Add a login to sync timetable across devices

## Components:
* [React.JS](https://reactjs.org/)
* [Google Firebase](https://firebase.google.com/)

## Re-purposing for other schools:
### First-time setup:
1. Clone this repository
2. Edit public\static\js\jsx\pData.jsx to match your school's bell times
3. cd to the directory
4. Delete .firebaserc (file) and .firebase (directory)
5. Initialise firebase repository using `firebase init`
6. Select Database, functions, hosting and storage
7. When prompted to use existing files, enter `Y`
8. Execute `firebase deploy`
9. Navigate to the URL of the site to check that it works
### Updating code:
1. Clone this repository to a different directory
2. Make a backup of your pData.jsx
3. Copy the "public" folder from the updated clone over your public folder in your previous clone
4. Overwrite all files that conflict
5. Copy your backed up pData.jsx into public\static\js\jsx\pData.jsx
6. Execute `firebase deploy`
