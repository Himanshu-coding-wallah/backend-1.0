# creating first express app
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

## Accessing variables from .env file
> process.env.PORT  

## Using new sytanx in express
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

# Data Modelling
### Intiution
- Firtly we have to think what models do we need.  
- Than we have to think what models are unique and independent of others , implement them. Then think what models depend on one or two than implement those.
---

### Basic Code
1. npm install mongoose
2. In the file , do (this is a boiler plate code)
    - Import mongoose from "mongoose"
    - const userSchema = new mongoose.Schema({})
    - export const User = mongoose.model("User", userSchema)  

- In mongodb the User is stored as users i.e. lowercase and plural
- <u>User</u> is the name of model and it is based on <u>userSchema</u>
---
### Example
```js
import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  image: {
     type: String,
  },
  occupation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job"
  }
},
{timestamps: true}
)

export const User = mongoose.model("User", userSchema)
```
`timestamps: true` add two fields  
- createdAt
- updatedAt
----
> ### Note ->  
> - We do not store images, video and files in the database.
> - We store them on a third party site or on our server and we just store the URL of the image in the database 
> - That is why we set type of image field as string
---
### Refrencing
```js
occupation: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "job"
}

// This is how we do referencing
// job is the referenced schema
```
---

### Example 
```js
// In this example the main schema is the orderSchema. 
// In the orderItems field , we want to store the ordered item and their count so we create a new schema orderItemSchema
// orderItems will be an array because we can have multiple products

import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    required
  }
})

const orderSchema = new mongoose.Schema({
  orderPrice: {
    type: Number,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  orderItems: [orderItemSchema],
})

export const Order = mongoose.model("Order", orderSchema)
```
---

### Creating a choice

```js
status: {
    type: String,
    enum: ["PENDING", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  }

// using enum we can impose choice and user will have to choose from these only.
```

# Production Code Of Backend
## 1. Folder Setup

