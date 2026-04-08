# Production Code Of Backend
- do `npm init` in root folder
- intall nodemon `npm install --save-dev nodemon `
- intall prettier `npm install -D prettier `
- intall mongoose `npm install mongoose`
- intall dotenv `npm install dotenv `
- intall express `npm install express `
- create `.env`
- create `.gitignore`
- create `.prettierrc`
- create `.prettierignore`
- in scripts , 
```js
"dev": "nodemon src/index.js"
```
>NOTE -->   
> - Nodemon restart the server automatically when we save the changes. it is a dev dependencry i.e. it do not go into production  
> - add content in .gitignore from website like gitignore generator  
> - prettier is used to follow the same formatting among the peers
## 1. Folder Setup
in `src`, 
- folders  
    - `controller`  
    - `db`  
    - `middlewares`  
    - `routes`  
    - `utils`  
    - `models`  

- files   
    - `app.js`
    - `index.js`
    - `constants.js`

## Database connection
- Create cluster in mongodb atlas  
- Copy string provided by the mongo and paste that in .env by the varibale MONGODB_URI
`MONGODB_URI=mongodb+srv://Himanshu:Himanshu123@cluster0.fw3kydq.mongodb.net`  
- In constants.js, add the database name and export it  
`export const DB_NAME = "project-Youtube"`   
> NOTE--> database is in other continent, use async await and try catch  
---
> First approach -> we can write database code in index  
> Second approach -> We can write database code in db folder than import it to index  
---
