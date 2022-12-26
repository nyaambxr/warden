// rename the place
const { SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
categoryId = process.env.PLACES_CATEGORY_ID;

async function renplace(interaction, placeName, categoryId, userId) {
    try {

        const places = require('../places.json');
        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);
        //use the place id to get the channel
        let owner;
        for (const [key, value] of Object.entries(places)) {
            if (value.owner == userId) {
                owner = key;
                break;
            }
        }
        
        const channel = guild.channels.cache.get(places[owner].placeID);
        await channel.setName(placeName);
        interaction.reply('Place renamed!');  

    } catch (error) {
        console.error(error);
        interaction.reply('Something went wrong!');  
    }

}



module.exports = {
	data: new SlashCommandBuilder()
		.setName('renplace')
		.setDescription('Renames your place!')
		.addStringOption(option =>
			option
				.setName('placename')
				.setRequired(true)
				.setDescription('The name of your place!')),
    async execute(interaction) {
        const placeName = interaction.options.getString('placename');
        if(placeName.length > 100) {
            await interaction.reply('place name too long!');
            return;
        } else if(placeName.length < 2) {
            await interaction.reply('place name too short!');
            return;
        }
        //check if the user has a place already in the json file using the place id
        const places = require('../places.json');
        const userId = interaction.user.id;
        let placeExists = false;
        for (const [key, value] of Object.entries(places)) {
            if (value.owner == userId) {
                placeExists = true;
                break;
            }
        }
        if (placeExists) {
            renplace(interaction, placeName, categoryId, userId);
        } else {
            await interaction.reply('You don\'t have a place!');
        }
        
    }
}

