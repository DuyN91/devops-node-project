# DevOps and NodeJS Project
 This repository contain the files for the DevOps and NodeJS project of the M1 of the engineering cycle of ECE Paris.
 
# Introduction
The application is supposed to be able to register a new account and to connect to existing ones. From the connecting account you should be able to use metrics and keep tracks of them in a graph. You can only access to the metrics link to your account.

# Installation 
These are the steps you need to complete before launching the project.

Node modules that need to be install:
```
-npm install
-npm install express
-npm install ejs
-npm install typescript --save-dev
-npm install --save-dev nodemon
-npm install -D ts-node
-npm install -D typescript
-npm install --save encoding-down leveldown levelup level-ws
-npm i --save body-parser
-npm install password-hash
```

# Usage intructions
To have access to the application you need to type `localhost8080` in your browser search bar.
Next to get to the login page you need to add "/login" at the end of the url: `localhost8080/login`.
After that you have two options: 
-to access the signup page, just click on the "Create an account" button. 
-if you want to acces a "profile" page, in the url type: `localhost8080/hello/[name]`. Just put any name in place of [name].
In the case of the signup page, after you enter the user information, just click on the "confirm" button to get back to the login page.

# DevOps Project
To fill with list of tests.

# NodeJS Project
We couldn't manage to write user information into the database for a new account. So we were unable to continue the project, we did implement some of the user's password related function please see to it. We counldn't manage to use the UserHandler "get" and "save" function allowing us to use the database.

# Contributors
Christian AHADJI, ECE Paris Student
Duy NGUYEN, ECE Paris Student
