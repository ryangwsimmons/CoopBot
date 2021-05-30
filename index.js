require('dotenv').config();
const JobsFetcher = require('./indeed_jobfetcher');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const Discord = require('discord.js');
const client = new Discord.Client();

// Once the bot is ready
client.once('ready', async () => {
    // Create a new jobs fetcher
    let jobsFetcher = new JobsFetcher(process.env.JOBS_SINCE, process.env.JOBS_QUERY, process.env.JOBS_LOCATION, process.env.JOBS_RADIUS);

    // Update the jobs once on start-up
    jobsFetcher.fetchJobs().then(jobs => {
        sendUpdate(jobs);
    });

    // Create a new scheduler to automatically fetch jobs and post them
    const scheduler = new ToadScheduler();

    // Create a new task for the scheduler
    const task = new AsyncTask('Fetch Jobs and Send Update', () => {
        return jobsFetcher.fetchJobs().then(jobs => {
            sendUpdate(jobs);
        });
    }, (err) => {console.log('Error: ' + err.message)});

    // Set up a scheduler job to fetch and send jobs at the specified interval
    const scheduledTask = new SimpleIntervalJob({seconds: process.env.JOBS_UPDATE_INTERVAL}, task);

    // Add the scheduler job to the scheduler
    scheduler.addSimpleIntervalJob(scheduledTask);
});

const sendUpdate = (jobs) => {
    let embeds = buildEmbeds(jobs);

    let currentDate = new Date();

    let startDate = new Date(currentDate.getTime());

    startDate.setDate(currentDate.getDate() - process.env.JOBS_SINCE);

    // Send header message
    let headerMessage = new Discord.MessageEmbed()
        .setTitle('New Jobs For "' + process.env.JOBS_QUERY + '": '
        + startDate.toLocaleString('default', {month: 'long'}) + ' ' + startDate.getDate() + ', ' + startDate.getFullYear()
        + ' - '
        + currentDate.toLocaleString('default', {month: 'long'}) + ' ' + currentDate.getDate() + ', ' + currentDate.getFullYear());

    client.channels.cache.get(process.env.JOBS_CHANNEL_ID).send(headerMessage);

    // Send jobs
    embeds.forEach(embed => {
        client.channels.cache.get(process.env.JOBS_CHANNEL_ID).send(embed);
    });

    // Send "See All" message
    let seeAllMessage = new Discord.MessageEmbed()
        .setTitle('See All ' + jobs.count + ' Jobs For "' + process.env.JOBS_QUERY + '" Posted in the Past Week')
        .setURL(jobs.seeAllLink);
    
    client.channels.cache.get(process.env.JOBS_CHANNEL_ID).send(seeAllMessage);
}

const buildEmbeds = (jobs) => {
    let embeds = [];

    jobs.data.forEach(job => {
        let embed = new Discord.MessageEmbed();

        embed.setTitle(job.title);
        embed.setURL(job.link);
        embed.setAuthor(job.company);
        embed.addFields({name: 'Location', value: job.location});

        embeds.push(embed);
    });

    return embeds;
}

// Log into Discord
client.login(process.env.TOKEN);