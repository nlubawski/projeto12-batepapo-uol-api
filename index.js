import express, {json} from "express";
import cors from "cors";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();