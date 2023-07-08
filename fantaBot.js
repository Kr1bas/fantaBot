// Various imports
require('dotenv').config();
const { Client, Events, GatewayIntentBits, ShardEvents, Collection } = require('discord.js');
const { eventNames } = require('process');
const fs = require('node:fs');
const path = require('node:path');

//Setting up client
const appIntentsList = [GatewayIntentBits.Guilds,
                        GatewayIntentBits.GuildMessages,
                        GatewayIntentBits.MessageContent,
                        GatewayIntentBits.DirectMessages];

const client = new Client({intents: appIntentsList});

//Setting up commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles){
            const filePath = path.join(commandsPath,file);
            const command = require(filePath);

        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name,command);
        }else{
            console.error(`[ERROR] Failed to load command ${filePath}. Properties 'data' or 'execute' missing!`);
        }
    }
}

//Setting up listeners
client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}!`)
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()){
        console.log(`[INFO] received ${interaction.content}`)    
        return;
    } //Only handles explicit commands

    const invokedCommand = interaction.client.commands.get(interaction.commandName);
    
    //Reply with error if the command doesn't exist
    if (!invokedCommand){
        console.warn(`[WARNING] User ${interaction.user.username} invoked non existent command: ${interaction.commandName}.`);
        interaction.reply({content: `${interaction.commandName} does not exist!`, ephemeral: true});
        return;
    }

    //Executing command
    try{
        await invokedCommand.execute(interaction);
    } catch(error){
        console.error(`[ERROR] Could not execute ${interaction.commandName}`);
        console.error(error)
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }else{
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        return;
    }
    console.log(`[INFO] User ${interaction.user.username} executed ${interaction.commandName}.`);
})

client.on(Events.MessageCreate, msg => {
    console.log("MSG RECEIVED")
    if (/hello\ *there\.?/gm.test(msg.content.toLocaleLowerCase())) {
        msg.reply("General Kenoby. You are a bold one.");
    }else if(msg.content === "ping!"){
        msg.reply("pong!")
    }else if(msg.content === "pon!"){
        msg.reply("ping!")
    }
})


client.login(process.env.DISCORD_TOKEN);
