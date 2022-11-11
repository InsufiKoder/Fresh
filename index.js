require("dotenv").config();
const { Client } = require("discord.js");

const { readdirSync } = require("fs");
const { join } = require("path");
const client = new Client({ intents: 32767 });

client.categories = readdirSync(join(__dirname, "./commands"));

const TOKEN = process.env.BOT_TOKEN;
client.login(TOKEN);
