require("dotenv").config();
import { ExtendedClient } from "./structures/Client";
import { StartDatabase } from "./structures/Mongo"; 

export const client = new ExtendedClient();
global.client = client;

const database = new StartDatabase();

client.start();
