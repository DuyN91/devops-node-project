# DevOps and NodeJS Project
 This repository contain the files for the DevOps and NodeJS project of the M1 of the engineering cycle of ECE Paris.
 
# Introduction
The application is supposed to be able to register a new account and to connect to existing ones. From the connecting account you should be able to use metrics and keep tracks of them in a graph. You can only access to the metrics link to your account.

# Installation 
These are the steps you need to complete before launching the project.

Node modules that need to be install:
```
- npm install
- npm install express
- npm install ejs
- npm install typescript --save-dev
- npm install --save-dev nodemon
- npm install -D ts-node
- npm install -D typescript
- npm install --save encoding-down leveldown levelup level-ws
- npm i --save body-parser
- npm install password-hash
```

# Usage intructions
To have access to the application you need to type `localhost8080` in your browser search bar.
Next to get to the login page you need to add "/login" at the end of the url: `localhost8080/login`.
After that you have two options: 

- to access the signup page, just click on the "Create an account" button. 
- if you want to access a "profile" page, in the url type: `localhost8080/hello/[name]`. Just put any name in place of [name].

In the case of the signup page, after you enter the user information, just click on the "Create an account" button to get back to the login page.

# DevOps Project
To run the test, first you need to install: `npm install --save-dev jest supertest`.
Then you need to open your terminal, go to the project folder ans run `npm test`.
The only test we manage to implement are the routing test, allowing us to know if we get a response from our request.
We also didn't manage to "link" the server.ts file to the test file and so we add to copy the tested routing function inside the test file (routes.test.js). 
We suspected a Typescript/Javascript conflict. We try by using Jest with typescript, but it didn't turn out well (`npm install jest @types/jest ts-jest -D`).
A .travis.yml file has been added to the project to build it on Travis CI.

# NodeJS Project
We couldn't manage to write user information into the database for a new account. So we were unable to continue the project, we did implement some of the user's password related function please see to it. We counldn't manage to use the UserHandler "get" and "save" function allowing us to use the database.

# Contributors
Christian AHADJI, ECE Paris Student
Duy NGUYEN, ECE Paris Student
