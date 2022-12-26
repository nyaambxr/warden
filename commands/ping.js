const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {

        const start = Date.now();
        await interaction.reply('Pong!');
        const end = Date.now();
        const ping = end - start;
        interaction.editReply(`Pong! ${ping}ms`);

    },
};
