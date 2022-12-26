const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whereami')
		.setDescription('Provides information about where you are.'),
	async execute(interaction) {
		if (interaction.inGuild()) {
			await interaction.reply(`You're in ${interaction.guild.name}/${interaction.channel.name}`);
		} else {
			await interaction.reply(`You're in a DM with me!`);
		}
	},
};