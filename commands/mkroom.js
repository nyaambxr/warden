const { SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
categoryId = process.env.CATEGORY_ID;

function makeRoom(interaction, roomName, categoryId, userId) {
	try {
		interaction.guild.channels.create(
			{
				name: roomName,
				type: ChannelType.GuildText,
				parent: categoryId }) // then set tempID to the id of the created channel
		.then(channel => {
			tempID = channel.id;
			console.log(tempID);
			// add created room to json file
			const rooms = require('../rooms.json');
			rooms[roomName] = {
				'owner': userId,
				'category': categoryId,
				'roomName': roomName,
				'roomID': tempID,
			};
			fs.writeFile('./rooms.json', JSON.stringify(rooms), (err) => {
				if (err) {
					console.error(err);
				}
			}
			);
			interaction.reply('Room created!');

		})

			.catch(console.error);
	

	} catch (error) {
		console.error(error);
		interaction.reply('Something went wrong!');
	}
	
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('mkroom')
		.setDescription('Makes you a room!')
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
		} else {
			//check if the user has a room already in the json file
			const fs = require('fs');
			const rooms = require('../rooms.json');
			const userId = interaction.user.id;
			//check if userId is equal to interaction.user.id
			for (const [key, value] of Object.entries(rooms)) {
				if (value.owner == userId) {
					await interaction.reply('You already have a room!');
					return;
				}
			}
			//if not, make a room
			makeRoom(interaction, roomName, process.env.CATEGORY_ID, interaction.user.id);
		}

	},
};