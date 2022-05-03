import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();
const port = process.env.PORT || 5000;

const dbName = "uol";
let db = null;

const mongoClient = new MongoClient(process.env.MONGO_URI);

const promise = mongoClient.connect();
promise.then(() => {
    db = mongoClient.db(dbName);
    console.log("Conexão com o Mongo ");
});
promise.catch(() => {
    console.log("Mongo falhou");
});
//

const participantSchema = joi.object({
    name: joi.string().required()
});

const messageSchema = joi.object({
    to: joi.string().required(), 
    text: joi.string().required(),
    type: joi.string().valid("message", "private_message").required(),
    from: joi.required(),
    time: joi.required()
});

app.post("/participants", async (req, res) => {
    const {body} = req;

    try {
        await participantSchema.validateAsync(body, { abortEarly: false});
    } catch(e) {
        res.status(422).send("deu erro");
        return;
    }

    const user = {
        name: body.name,
        lastStatus: Date.now()
    };

    const message = {
        from: body.name,
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: dayjs().format("HH:mm:ss")
    }
    
    try {

        const participants = await db.collection("participants").find({name: body.name}).toArray();
        
        if (participants.length !== 0) {
            res.sendStatus(409);
            return;
        }

        await db.collection("participants").insertOne(user);
        await db.collection("messages").insertOne(message);
        res.sendStatus(201);
    } catch(e) {
        console.log("Deu erro: post /participants", e);
        res.status(422).send(e);
    }
});

app.get("/participants", async (req, res) => {
    try {
        const users = await db.collection("participants").find({}).toArray();
        res.send(users);
    } catch(error) {
        console.log(" Erro no get: /participants", error);
        res.status(422).send(error);
    }
});

app.listen(port, () => console.log(`Servidor em pé na porta ${port}`));