require("dotenv").config();
const { Events, Client } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    mongoose.set("strictQuery", false);
    const connectDB = mongoose.connect(process.env.MONGODB, {
      keepAlive: true,
      useNewUrlParser: true,
    });

    if (connectDB) {
      console.log("[DATABASE] Successfully connect to database.");
    } else {
      return console.log("[DATABASE] Failed to connect.");
    }

    console.log(`[SYSTEM] ${client.user.tag} has been login.`);
  },
};
