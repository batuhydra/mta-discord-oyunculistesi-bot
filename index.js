const Discordrempvc = require('discord.js');
const rempvcmta = require('gamedig');
const rempvcconfig = require('./config.json');

const rempvc = new Discordrempvc.Client({ intents: [Discordrempvc.Intents.FLAGS.GUILDS] });
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { config } = require('process');
const { start } = require('repl');

const webhookURL = 'https://discord.com/api/webhooks/1145813345077833789/i8gwuKps_AMGpdPYeAVIsE9PZuAKml-kvyZI63oEGM-ro3A8vRlQt1JhItOSJhQYLYkE'; // Webhook URL'sini buraya yazın
const channelId = '1128983498473091102'; // Kanal ID'sini buraya yazın

let lastMessage = null;

rempvc.once('ready', () => {
    console.log(`Giriş Yapıldı: ${rempvc.user.tag}`);
    let lastMessage = null;

    rempvcmta.query({
        type: 'mtasa',
        host: rempvcconfig.server_ip,
        port: rempvcconfig.server_port
    }).then((state) => {
        const playersList = state.players.map(player => `- ${player.name}`).join('\n');
        const playerCount = state.players.length;
        const maxPlayers = state.maxplayers;
        const message = `## Sunucudaki Oyuncular: :green_circle: ${playerCount}/${maxPlayers} \n${playersList || 'Sunucu İçerisinde Oyuncu Bulunmuyor.'}`;

        rempvc.channels.fetch(channelId).then(channel => {
            channel.send(message)
                .then(newMessage => {
                    lastMessage = newMessage;

                    setInterval(() => {
                        rempvcmta.query({
                            type: 'mtasa',
                            host: rempvcconfig.server_ip,
                            port: rempvcconfig.server_port
                        }).then((state) => {
                            const playersList = state.players.map(player => `- ${player.name}`).join('\n');
                            const playerCount = state.players.length;
                            const maxPlayers = state.maxplayers;
                            const updatedMessage = `## Sunucudaki Oyuncular: :green_circle: ${playerCount}/${maxPlayers} \n${playersList || 'Sunucu İçerisinde Oyuncu Bulunmuyor.'}`;

                            
                            lastMessage.edit(updatedMessage)
                                .catch(err => {
                                    console.error(err);
                                });
                        }).catch(err => {
                            console.log(err);
                        });
                    }, 5000);
                })
                .catch(err => {
                    console.error(err);
                });
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.log(err);
    });
});

// * bwtu






rempvc.login(rempvcconfig.token);

async function sendWebhookMessage(channelId, webhookURL, message) {
    const { Client, Intents } = require('discord.js');
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_WEBHOOKS] });

    await client.login(rempvcconfig.token);

    const channel = await client.channels.fetch(channelId);

    if (channel.isText()) {
        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.find(wh => wh.name === 'OyuncuListesiWebhook');

        if (!webhook) {
            webhook = await channel.createWebhook('OyuncuListesiWebhook', {
                avatar: 'https://example.com/avatar.png', 
            });
        }

        await webhook.send({
            content: message,
            username: 'Oyuncu Listesi',
        });
    }
}

// * bwtu