require('dotenv').config()
const TOKEN = process.env.DISCORD_TOKEN
const CLIENT_ID = process.env.DISCORD_CLIENT_ID

const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const supabase = require('@supabase/supabase-js').createClient('https://qdwpenfblwdmhywwszzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3BlbmZibHdkbWh5d3dzenpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1ODMxOTU4MSwiZXhwIjoxOTczODk1NTgxfQ.wH277cEujuIGitoCFIUI7zmduBmCQQYgqeam2rT9dJA')
//test
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'getroles',
    description: 'Get roles'
  }
];
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

function getTitle(rating) {
  if (rating >= 4000) return {
    title: 'LGM',
    fullTitle: 'Legendary Grandmaster',
    color: 'darkred'
  }
  if (rating >= 3600) return {
    title: 'GM',
    fullTitle: 'Grandmaster',
    color: 'red'
  }
  if (rating >= 3000) return {
    title: 'M',
    fullTitle: 'Master',
    color: 'blue'
  }
  if (rating >= 2500) return {
    title: 'CM',
    fullTitle: 'Candidate Master',
    color: 'darkorange'
  }
  if (rating >= 2000) return {
    title: 'EX',
    fullTitle: 'Expert',
    color: 'purple'
  }
  if (rating >= 1500) return {
    title: 'SP',
    fullTitle: 'Specialist',
    color: 'darkcyan'
  }
  if (rating >= 1000) return {
    title: 'AP',
    fullTitle: 'Apprentice',
    color: 'darkgreen'
  }
  if (rating >= 500) return {
    title: 'N',
    fullTitle: 'Novice',
    color: 'green'
  }
  if (rating > 0) return {
    title: 'C',
    fullTitle: 'Casual',
    color: 'gray'
  }
  return null
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if(interaction.commandName === 'getroles'){
    const tag = interaction.user.username + '#' + interaction.user.discriminator
    const { data, error } = await supabase
      .from('players')
      .select('rating')
      .eq('discord', tag)
      .single()
    if(error){
      await interaction.reply('An error occured');
      return
    }
    try{
      const roleName = getTitle(data.rating).fullTitle
      const role = interaction.guild.roles.cache.find(role => role.name === roleName)
      interaction.member.roles.add(role)
      await interaction.reply(`Given \"${roleName}\" role to ${tag}`);
    }
    catch(err){
      console.error(err)
      await interaction.reply('You are not eglible for any role')
    }
  }
});

client.login(TOKEN);