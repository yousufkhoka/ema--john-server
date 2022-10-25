const express = require('express')
const nodemailer = require('nodemailer');

require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.lkv7go4.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;


const cors = require('cors')
const bodyParser = require('body-parser')
const port = 4200
const app = express()
app.use(bodyParser.json())
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("emajohnProduct").collection("Products");
  const orderCollection = client.db("emajohnProduct").collection("orders");
  app.post('/addProduct' , (req, res) => {
            const product = req.body
  
            collection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
            res.send(result.insertedCount)
            })
        
           })


  app.get('/products', (req , res ) => {
       collection.find({})
       .toArray((arr ,document) =>{
        res.send(document)
       })
  })
  app.get('/products/:id' , (req , res)=> {
       collection.find({id: req.params.id})
       .toArray((arr,document)=>{
             res.send(document[0])
       })
  })

app.post('/getProductsByKeys' , (req , res) => {
     const productKeys = req.body    
     collection.find({id: {$in: productKeys}})
     .toArray((arr , documents) => {
     
          res.send(documents)
     })
})


app.post('/addOrder' , (req, res) => {
     const newOrder = req.body
    
     orderCollection.insertOne(newOrder)
     .then(result => {
          console.log(result)
     res.send(result.acknowledged)
     })
 
    })
orderCollection



// mongodb close
});































app.listen(port)