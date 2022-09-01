const Discord = require("discord.js");
const bdd = require("./bdd.json");
const fs = require("fs");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
});

const prefix = "*";

var  port_serveur  =  processus . env . VOTRE_PORT  ||  processus . env . PORT  ||  80 ;

Client.on("ready", () => {
    console.log("bot oprérationnel");
});

Client.login(process.env.TOKEN);

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

Client.on("messageCreate", message => {
    if (message.author.bot) return;

    //*aruher
    if(message.content === prefix + "aruher"){
        message.reply("Je suis là et je suis opérationnel !");
    }
    //*help
    else if(message.content === prefix + "help"){
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("**Liste des commandes**")
            .setAuthor("BarudeziaBot_Off", "https://cdn.discordapp.com/attachments/984144205997830195/1011966418708865054/unknown.png")
            .setDescription("**Voici toutes les commandes qu vous pouvez effectuer avec notre Bot...**")
            .setThumbnail("https://cdn.discordapp.com/attachments/984144205997830195/1011966418708865054/unknown.png")
            .addField("- __*help__", "Affiche la liste des commandes.")
            .addField("- __*aruher__", "Vous renvoie un message si le bot est opérationnel.")
            .setTimestamp()
            .setFooter("Barudezia", "https://cdn.discordapp.com/attachments/984144205997830195/1011966418708865054/unknown.png");

        message.channel.send({ embeds: [embed]});
    }
});

Client.on("guildMemberAdd", member => {
    console.log("Un membre est arrivé")
    Client.channels.cache.get("998877843364773908").send("<@" + member.id + "> est arrivé sur le serveur ! Bienvenue et bon jeu !")
});

Client.on("guildMemberRemove", member => {
    console.log("Un membre vient de partir")
    Client.channels.cache.get("998877843364773908").send("<@" + member.id + "> est partis :sob:.")
});





Client.on("guildMemberAdd", async member => {
    member.roles.add('1012999986662875136');
    bdd["captcha"][member.id] = { "value": Math.floor(Math.random() * Math.floor(10000)), "statut": false }
    Savebdd();
    Client.channels.cache.get('1013000861598883899').send(`Bonjour ${member} ! Ton code de captcha est : ${bdd["captcha"][member.id]["value"]}`)
})
Client.on('message', async message => {
    if(message.author.bot || message.member.permissions.has('ADMINISTRATOR')) return;
    if(message.channel.id == "1013000861598883899") {
        message.delete();
        if(!bdd["captcha"][message.member.id]["statut"]){
            if (isNaN(message.content)) {
                return message.channel.send('Tu dois indiquer la valeur de la captcha envoyée au dessus').then(message=> message.delete({timeout: 15000}));
            }
            else {
                if(message.content == bdd["captcha"][message.member.id]["value"]){
                    bdd["captcha"][message.member.id]["statut"] = true;
                    Savebdd();
                    message.member.roles.remove('1012999986662875136');
                    console.log("Un membre à complété avec succès le captcha !");
                }
                else{
                    return message.channel.send('Tu dois indiquer la valeur de la captcha envoyée au dessus').then(message=> message.delete({timeout: 15000}));
                }
            }
        }
    }
})
Client.on('guildMemberRemove', async member => {
    delete bdd["captcha"][member.id]
    Savebdd();
})
