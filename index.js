const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 3000
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app=express();
//midlewares
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Hello I am server');
})


//mongodb
console.log(process.env.USER_DB)
console.log(process.env.USER_PASS)


const uri =
  `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.z5rmhar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//listen
app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})