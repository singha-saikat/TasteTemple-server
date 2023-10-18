const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000 ;


app.use(cors());
app.use(express.json());

// TasteTemple
// 7GjiYyYClmK9XbEv


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggrwjrl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function insertFakeData() {
  try {
    await client.connect();
    const newCollection = client.db("productDb").collection("Brand");
    

    const brandData = [
      
        { "name": "Starbucks", "brandImage": "https://i.postimg.cc/8ChsJHqp/Starbucks-Talky.jpg" },
        { "name": "McDonald's", "brandImage": "https://i.postimg.cc/kGZtF5wq/Mc-Donald-s.jpg" },
        { "name": "PepsiCo", "brandImage": "https://i.postimg.cc/Bt9nnPML/pepsico.png" },
        { "name": "Nestle", "brandImage": "https://i.postimg.cc/bJpMpyxy/Nestle.png" },
        { "name": "Kellogg's", "brandImage": "https://i.postimg.cc/8ztQcrCF/Kellogg-s.webp" },
        { "name": "Pran", "brandImage": "https://i.postimg.cc/25kkXD1W/pran.jpg" }
      
      
    ];

    const result = await newCollection.insertMany(brandData);
    console.log(`${result.insertedCount} documents inserted`);
  } finally {
    client.close();
  }
}

insertFakeData();

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db('productDb').collection("product")

    // post method applied here 
    app.post('/products',async (req,res) =>{
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result) 
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/' , (req,res) => {
    res.send('Taste-Temple server is running ')
});

app.listen( port,(req,res) => {
    console.log(`Taste-Temple server is running on ${port}`)
})