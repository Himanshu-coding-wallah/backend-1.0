## creating first express app
- goto folder 
- create index.js
- in terminal
    - npm init
    - install express  --> npm i express
    - intall dotenv --> npm i dotenv
- in package.json -> scripts
    - "dev": "node index.js"
- create .env file
- create .gitignore file
- in index.js -->
```
const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 2000

app.get('/', (req, res) => {
  res.send('hello bhaiyaa')
})


app.get('/login', (req, res)=>{
    res.send("login")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

```

- .env file have all the sensitive info
- .gitignore have all the files that must be ignored while uploading to github

### Accessing variables from .env file
> process.env.PORT  

### Using new sytanx in express
> "type": "module" 
```
{
  "name": "backend-1.0",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",             <<<------
  "scripts": {
    "dev": "node index.js"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "dotenv": "^17.4.1",
    "express": "^5.2.1"
  }
}
```
so now in index.js 
```
import 'dotenv/config'
import express from 'express'
```