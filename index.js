if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const { Client, Intents } = require("discord.js");
const consola = require("consola");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const keepAlive = require("./server")

const EncouragementsModel = require("./models/Encouragements");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        consola.success("Connected to database")
    } catch (error) {
        consola.error(error)
    }
};

connectToDatabase();

const sadWords = [
    "sad",
    "depressed",
    "unhappy",
    "down",
    "miserable",
    "unhappy",
    "angry",
    "mad",
    "upset",
];

const starterEncouragements = [
    "You're doing great!",
    "Cheers!",
    "Cheer up!",
    "Hang in there!",
    "Keep it up!",
    "Keep going!",
    "You are amazing!",
];

let responding = true

starterEncouragements.forEach(async (starterEncouragement) => {
    if (
        !(await EncouragementsModel.findOne({
            encouragement: starterEncouragement,
        }))
    ) {
        const newEncouragement = new EncouragementsModel({
            encouragement: starterEncouragement,
            type: "starter",
        });
        await newEncouragement.save();
    }
});

const updateEncouragements = async (encouragingMessage) => {
    const newEncouragement = new EncouragementsModel({
        encouragement: encouragingMessage,
    });
    await newEncouragement.save();
};

const deleteEncouragement = async (encouragement) => {
    await EncouragementsModel.deleteOne({
        encouragement: encouragement,
    });
};

getQuote = () => {
    return fetch("https://api.quotable.io/random")
        .then((res) => res.json())
        .then((data) => data.content + " -" + data.author);
};

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const token = process.env["TOKEN"];

client.on("ready", () => {
    consola.ready({
        message: `Logged in as ${client.user.tag}!`,
        badge: true,
    });
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;

    if (msg.content === "!quote") {
        getQuote().then((quote) => {
            msg.channel.send(quote);
        });
    }

    if (
        responding === true && sadWords.some((word) => msg.content.toLowerCase().includes(word))
    ) {
        msg.react("😢");
        // Random encouragement
        EncouragementsModel.findOneRandom((err, encouragement) => {
            if (err) return console.error(err);
            msg.reply(encouragement.encouragement);
        });
    }

    if (msg.content.startsWith("!newEncouragement")) {
        newEncouragement = msg.content.split("!newEncouragement ")[1];
        updateEncouragements(newEncouragement);
        msg.reply("Encouragement added!");
        msg.react("✔️");
    }

    if (msg.content.startsWith("!deleteEncouragement")) {
        const encouragement = msg.content.split("!deleteEncouragement ")[1];
        deleteEncouragement(encouragement);
        msg.react("✔️");
        msg.reply(`Encouraging deleted.`);
    }

    if (msg.content.startsWith("!listEncouragements")) {
        EncouragementsModel.find({}, (err, encouragements) => {
            if (err) return console.error(err);
            const encouragementText = encouragements.map((encouragement) => {
                return encouragement.encouragement;
            });
            encouragementText.sort();
            msg.channel.send(encouragementText.join("\n"));
        })
        msg.react("📃");
    }

    if (msg.content.startsWith("!responding")) {
        value = msg.content.split("!responding ")[1];
        if (value.toLowerCase() === "true") {
            responding = true;
            msg.reply("Responding to messages is now enabled.");
            msg.react("✔️");
        }
        if (value.toLowerCase() === "false") {
            responding = false;
            msg.reply("Responding to messages is now disabled.");
            msg.react("✔️");
        }
    }
});

keepAlive();
client.login(token);
