const fs = require('fs')
const express = require('express')
const cors = require('cors')
const _ = require('lodash')
const {v4: uuid} = require('uuid')

// create server instance
const app = express()

app.use(express.json())
app.use(cors())

// define a new route/endpoint 
app.get("/endpoint", (req, res) => {
  const tops = ["Black", "White", "Orange", "Navy"]
  const pants = ["Black", "White", "Orange", "Navy"]
  const shoes = ["Black", "White", "Orange", "Navy"]

  res.json({
    top: _.sample(tops),
    pants: _.sample(pants),
    shoes: _.sample(shoes)
  })
})

// send comment to server & save to file
app.post("/comments", (req, res) => {
  const id = uuid()
  const content = req.body.content
  // if user didn't send any content, send back a 400 response code
  if (!content) {
    return res.sendStatus(400) // must use RETURN to halt the code, otherwise the code below will still run
  }
  fs.mkdir("data/comments", { recursive: true }, (err) => {
    console.log(err)
  })
  fs.writeFile(`./data/comments/${id}.txt`, content, (err) => {
    if (err) throw err;
    console.log('File created')
  })
  res.status(201).json({
    id:id
  })
})

// retrieve comment contents by id
app.get("/comments/:id", (req, res) => {
  const id = req.params.id

  fs.readFile(`data/comments/${id}.txt`, "utf-8", (err, data) => {
      if (err) {
        res.sendStatus(404)
        throw err
      }
      res.send({
        data: data
      })
    })
})

// this needs to go last
app.listen(3000, () => {
  console.log("API Server is running on port 3000")
})

