const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('Tells you who you are.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		await interaction.reply(`You are "**${interaction.user.username}**".`);
	},
};
