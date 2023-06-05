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

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
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

client.cooldowns = new Collection();

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
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

client.login(process.env.TOKEN);
