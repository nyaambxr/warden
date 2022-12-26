// rename the room
const { SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
categoryId = process.env.CATEGORY_ID;

async function renRoom(interaction, roomName, categoryId, userId) {
    try {

        const rooms = require('../rooms.json');
        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);
        //use the room id to get the channel
        let owner;
        for (const [key, value] of Object.entries(rooms)) {
            if (value.owner == userId) {
                owner = key;
                break;
            }
        }
        console.log("Owner: " + owner);
        console.log("Rooms: " + rooms);
        const channel = guild.channels.cache.get(rooms[owner].roomID);
        console.log("Channel: " + channel);
        await channel.setName(roomName);
        interaction.reply('Room renamed!');  

    } catch (error) {
        console.error(error);
        interaction.reply('Something went wrong!');  
    }

}



module.exports = {
	data: new SlashCommandBuilder()
		.setName('renroom')
		.setDescription('Renames your room!')
		.addStringOption(option =>
			option
				.setName('roomname')
				.setRequired(true)
				.setDescription('The name of your room!')),
    async execute(interaction) {
        const roomName = interaction.options.getString('roomname');
        if(roomName.length > 100) {
            await interaction.reply('Room name too long!');
            return;
        } else if(roomName.length < 2) {
            await interaction.reply('Room name too short!');
            return;
        }
        //check if the user has a room already in the json file using the room id
        const rooms = require('../rooms.json');
        const userId = interaction.user.id;
        let roomExists = false;
        for (const [key, value] of Object.entries(rooms)) {
            if (value.owner == userId) {
                roomExists = true;
                break;
            }
        }
        if (roomExists) {
            renRoom(interaction, roomName, categoryId, userId);
        } else {
            await interaction.reply('You don\'t have a room!');
        }
        
    }
}

