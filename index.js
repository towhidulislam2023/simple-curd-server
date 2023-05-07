const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json()) //middle wire

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://towhidulislam2bd:UZ2w30eMWn419Ymg@cluster0.w8zzyxt.mongodb.net/?retryWrites=true&w=majority";

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
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        const userCollection = client.db('userCollection').collection('users');

        //get
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
         const query={_id: new ObjectId(id)}
         const result= await userCollection.findOne(query)
            res.send(result)
        })
        // post 
        app.post("/users", async (req, res) => {
            const users = req.body
            console.log("New User", users);
            const result = await userCollection.insertOne(users);
            res.send(result)
        })
        //put
        app.put("/users/:id",async (req,res)=>{
            const id =req.params.id
            const user=req.body
            // console.log(id, "wise updated",updatedUser);
            const filter={ _id: new ObjectId(id)}
            const option={upsert:true}
            const updateUser={
                $set:{
                    name: user.name,
                    email:user.email
                }
            }

            const result = await userCollection.updateOne(filter, updateUser,option)
            res.send(result)

            
        })
        //DELLET
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id
            console.log("Delleted Id", id);
            const query = { _id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Do not close the connection here
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('SIMPLE CURD SERVER RUNNING......')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})