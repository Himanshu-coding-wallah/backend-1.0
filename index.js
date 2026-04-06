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
