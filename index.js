const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiitlmi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const brandCollection = client.db("dewyDrinks").collection("brands")
        const productCollection = client.db("dewyDrinks").collection("products")

        app.post('/productDetails', async(req,res)=>{
            const brandInfo = req.body;
            const result = await productDetailsCollection.insertOne(brandInfo);
            res.send(result);
        })

        app.get('/brands',async(req,res)=>{
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/products/:name',async(req,res)=>{
            const name = req.params.name;
            const query = {brandName: name};
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/productName/:Pname',async(req,res)=>{
            const Pname = req.params.Pname;
            const query = {productName: Pname};
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/products',async(req,res)=>{
            const products = req.body;
            const result = await productCollection.insertOne(products);
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



app.get('/', (req, res) => {
    res.send('dewy drinks server is running');
})
app.listen(port, () => {
    console.log(`dewy drinks server is running on port: ${port}`)
})