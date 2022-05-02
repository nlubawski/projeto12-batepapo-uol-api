import express, {json} from "express";
import cors from "cors";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();
const port = process.env.PORT || 5000;

const dbName = process.env.MONGO_NAME_DATABASE;
let db = null;

const mongoClient = new MongoClient(process.env.MONGO_URI);

const promise = mongoClient.connect();
promise.then(() => {
    db = mongoClient.db(dbName);
    console.log('Conexão com o Mongo ');  
});
promise.catch(() => {
    console.log('Mongo falhou');
});






app.listen(port, () => console.log(`Servidor em pé na porta ${port}`));