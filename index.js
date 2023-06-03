const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");

dotenv.config();

// Initialization
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    32767,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
  ],
});

// Collections
client.commands = new Collection();
client.interactions = new Collection();
client.cooldowns = new Collection();

// Paths
let commandPath = "./commands",
  interactionPath = "./interactions",
  eventPath = "./events";

// Command Handler
for (const file of fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"))) {
  const command = require(`${commandPath}/${file}`);
  client.commands.set(command.data.name, command);
}

// Interaction Handler
for (const file of fs
  .readdirSync(interactionPath)
  .filter((file) => file.endsWith(".js"))) {
  const interaction = require(`${interactionPath}/${file}`);
  client.interactions.set(interaction.data.id, interaction);
}

// Event Handler
for (const file of fs
  .readdirSync(eventPath)
  .filter((file) => file.endsWith(".js"))) {
  const event = require(`${eventPath}/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Schedule backup every 6 hours
const backupSchedule = schedule.scheduleJob("0 */6 * * *", () => {
  const databaseFilePath = path.join(__dirname, "database.json");
  const backupFilePath = path.join(__dirname, "database_backup.json");

  fs.copyFileSync(databaseFilePath, backupFilePath);
  console.log("Database backup created/updated successfully.");
});

// Login
client.login(process.env.TOKEN);
