const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eta')
		.setDescription('Replies with the username of the user and thejoin time!'),
	async execute(interaction) {
		await interaction.reply(`You are: ${interaction.user.username} and joined the server on ${interaction.member.joinedAt}.`);
	},
};