const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

const DB = "MyWorkingDB";
const COLLECTION = "socket.io-adapter-events";

const app = express();
const server = createServer(app);
const io = new Server(server);

const mongoClient = new MongoClient("mongodb+srv://shivam:HkZGadQiwssADLbT@cluster0.sodtgra.mongodb.net/");

// shivam | HkZGadQiwssADLbT

const main = async () => {
    await mongoClient.connect();

    try {
        await mongoClient.db(DB).createCollection(COLLECTION, {
            capped: true,
            size: 1e6
        });
        console.log("Collection created");
    } catch (e) {
        // collection already exists
        console.log("Collection not created",e);
    }
    const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

    io.adapter(createAdapter(mongoCollection));
    io.listen(3000);
}



app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(27017, () => {
    console.log('server running at http://localhost:27017');
});

main().catch(console.dir)