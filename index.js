const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 3010
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app=express();
//midlewares
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.z5rmhar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const CraftCollection = client.db("Crafts").collection("Items");
    app.get('/',(req,res)=>{
      res.send('hello world!')
    })
    //get single craft
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const item = await CraftCollection.findOne(query);
      res.send(item);
    });
    //get craft
    app.get("/items", async (req, res) => {
      const craft = CraftCollection.find();
      const result = await craft.toArray();
      res.send(result);
    });

    //create craft
    app.post("/items", async (req, res) => {
      const item = req.body;
      const doc = {
        userEmail: item.userEmail,
        userName: item.userName,

        item_name: item.item_name,
        image: item.image,
        stockStatus: item.stockStatus,
        price: item.price,
        rating: item.rating,
        processing_time: item.processing_time,
        customization: item.customization,
        subcategory_Name: item.subcategory_Name,
        short_description: item.short_description,
      };

      const result = await CraftCollection.insertOne(doc);
      res.send(result);
    });

    //delete craft
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CraftCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    //update craft
    app.put("/items/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const item = req.body;
        const updateUser = {
          $set: {
            image: item.image,
            item_name: item.item_name,
            subcategory_Name: item.subcategory_Name,
            short_description: item.short_description,
            price: item.price,
            rating: item.rating,
            customization: item.customization,
            processing_time: item.processing_time,
            stockStatus: item.stockStatus,
          },
        };
      const result=await CraftCollection.updateOne(filter,updateUser,options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//listen
app.listen(port);