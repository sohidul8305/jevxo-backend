require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

// Variables
const BD_USER = "jevxo_user";
const BD_PASS = "dWxsDXPNhhGHJTT0";

// Middleware
app.use(express.json());
app.use(cors());

// Connection URI
const uri = `mongodb+srv://${BD_USER}:${BD_PASS}@cluster0.hz6ypdj.mongodb.net/?appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('jevxo_post');
    const UsersCollection = db.collection('users');
    const ProductsCollection = db.collection('products'); // নতুন প্রোডাক্ট কালেকশন

    // ================= USER APIs =================
    app.get('/users', async(req, res) => {
        const result = await UsersCollection.find().toArray();
        res.send(result);
    });

    app.post('/users', async(req, res) =>{
        const users = req.body;
        const result = await UsersCollection.insertOne(users);
        res.send(result);
    });
    
    // ================= PRODUCT APIs (ডাটাবেজে সেভ ও রিড করার জন্য) =================
    
    // ডাটাবেজ থেকে সব প্রোডাক্ট নিয়ে আসার API
    app.get('/products', async (req, res) => {
        try {
            const result = await ProductsCollection.find().sort({ _id: -1 }).toArray(); // নতুনগুলো আগে দেখাবে
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to fetch products" });
        }
    });

    // ডাটাবেজে নতুন প্রোডাক্ট সেভ করার API
    app.post('/products', async (req, res) => {
        try {
            const product = req.body;
            const result = await ProductsCollection.insertOne(product);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to add product" });
        }
    });
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
  }
}
run().catch(console.dir);

// Routes
app.get('/', (req, res) => {
  res.send('jevxo server running!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});