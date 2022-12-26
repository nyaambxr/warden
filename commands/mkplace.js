const { SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
categoryId = process.env.PLACES_CATEGORY_ID;

function makePlace(interaction, placeName, categoryId, userId) {
	try {
		interaction.guild.channels.create(
			{
				name: placeName,
				type: ChannelType.GuildText,
				parent: categoryId }) // then set tempID to the id of the created channel
		.then(channel => {
			tempID = channel.id;
			console.log(tempID);
			// add created place to json file
			const places = require('../places.json');
			places[placeName] = {
				'owner': userId,
				'category': categoryId,
				'placeName': placeName,
				'placeID': tempID,
			};
			fs.writeFile('./places.json', JSON.stringify(places), (err) => {
				if (err) {
					console.error(err);
				}
			}
		);
			interaction.reply('Place created!');
		})

			.catch(console.error);
	

	} catch (error) {
		console.error(error);
		interaction.reply('Something went wrong!');
	}
	
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mkplace')
		.setDescription('Makes you a place!')
		.addStringOption(option =>
			option
				.setName('placename')
				.setRequired(true)
				.setDescription('The name of your place!')),


	async execute(interaction) {

		const placeName = interaction.options.getString('placename');
		if(placeName.length > 100) {
			await interaction.reply('Place name too long!');
			return;
		} else if(placeName.length < 2) {
			
			await interaction.reply('Place name too short!');
		} else {
			//check if the user has a place already in the json file
			const fs = require('fs');
			const places = require('../places.json');
			const userId = interaction.user.id;
			//check if userId is equal to interaction.user.id
			for (const [key, value] of Object.entries(places)) {
				if (value.owner == userId) {
					await interaction.reply('You already have a place!');
					return;
				}
			}
			//if not, make a place
			makePlace(interaction, placeName, process.env.PLACES_CATEGORY_ID, interaction.user.id);
		}

	},
};