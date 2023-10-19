const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

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
  },
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("productDb").collection("product");
    const newCollection = client.db("productDb").collection("Brand");
    const brandImageCollection = client
      .db("productDb")
      .collection("BrandImage");

    // post method applied here
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/brands", async (req, res) => {
      const result = await newCollection.find().toArray();
      res.send(result);
    });

    app.get("/:brandName", async (req, res) => {
      const brand = req.query.brand;
      const query = {
        brand: brand,
      };
      const result = await productCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/productDetails/:_id", async (req, res) => {
      const id = req.params._id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // app.get("/:brandName", async (req, res) => {
    //   const brand = req.params.brandName;
    //   const query = {
    //     brand_name: brand,
    //   };
    //   console.log("Querying for brand:", brand);
    //   const result = await brandImageCollection.find(query).toArray();
    //   console.log("Result:", result);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Taste-Temple server is running ");
});

app.listen(port, (req, res) => {
  console.log(`Taste-Temple server is running on ${port}`);
});
