require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connection URI
const dbUser = process.env.DB_USER || "jevxo_user";
const dbPass = process.env.DB_PASS || "dWxsDXPNhhGHJTT0";
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.hz6ypdj.mongodb.net/?appName=Cluster0`;

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
    // Ekhaney products collection-ti bad dewa holo ebong success collection ti nirdishto kora holo
    const SuccessCollection = db.collection('success'); 

    // ================= USER APIs =================
    app.get('/users', async (req, res) => {
        try {
            const result = await UsersCollection.find().toArray();
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to fetch users", error: error.message });
        }
    });

    app.post('/users', async (req, res) => {
        try {
            const users = req.body;
            const result = await UsersCollection.insertOne(users);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to add user", error: error.message });
        }
    });
    
    // ================= SUCCESS APIs (Shudhu matro success collection er jonno) =================
    
    // 1. Success collection theke shob data dynamic-bhabe get korar API
    app.get('/success', async (req, res) => {
        try {
            // Eta ekhon nishchitbhabe apnar screenshot er 'success' collection theke data niye ashbe
            const result = await SuccessCollection.find().sort({ _id: -1 }).toArray(); 
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to fetch success data", error: error.message });
        }
    });

    // 2. Success collection-e notun kono destination database-e pathanor api (jodi proyojon hoy)
    app.post('/success', async (req, res) => {
        try {
            const newData = req.body;
            const result = await SuccessCollection.insertOne(newData);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to add success data", error: error.message });
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

// Root Route
app.get('/', (req, res) => {
  res.send('jevxo server running!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});