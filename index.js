const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        const brandCollection = client.db("dewyDrinks").collection("brands")
        const productCollection = client.db("dewyDrinks").collection("products")
        const addToCartCollection = client.db("dewyDrinks").collection("addToCart")

        app.post('/addToCart', async(req,res)=>{
            const cartInfo = req.body;
            const result = await addToCartCollection.insertOne(cartInfo);
            res.send(result)
        })

        app.get('/myCart',async(req,res)=>{
            const cursor = addToCartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/addToCart/myCart/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await addToCartCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/brands',async(req,res)=>{
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/updateProduct/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.put('/updateProduct/:id',async(req,res)=>{
            const id = req.params.id;
            const product = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert:true};
            const updateProductInDb = {
                $set:{
                    productName: product.productName,
                    brandName: product.brandName,
                    type: product.type,
                    price: product.price,
                    shortDescription: product.shortDescription,
                    rating: product.rating,
                    image: product.image
                }
            } 
            const result = await productCollection.updateOne(filter,updateProductInDb,options);
            res.send(result)
        })

        app.get('/products/:name',async(req,res)=>{
            const name = req.params.name;
            const query = {brandName: name};
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/productName/:Pid',async(req,res)=>{
            const Pid = req.params.Pid;
            const query = {_id: new ObjectId(Pid)};
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/products',async(req,res)=>{
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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