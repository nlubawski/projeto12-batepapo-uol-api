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
app.listen(port, () => console.log(`Servidor em pé na porta ${port}`));