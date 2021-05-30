# CoopBot

A Discord bot for updating users in a server of new jobs in a particular field that have been posted online.

## Installation
To install this bot, simply clone the repo, and run `npm install` in the resulting folder. This assumes you have the latest LTS release of [Node.js](https://nodejs.org/en/) installed.

## Running
To run this bot, create the configuration as specified below, and run `npm start` in the bot's folder.

## Config Options
Before running the bot, please create a `.env` file in the bot's folder, and specify the following options:

- `TOKEN`: The token for your Discord bot

- `JOBS_CHANNEL_ID`: The unique ID of the channel the bot should post updates to

- `JOBS_SINCE`: When retrieving jobs, the maximum age of any jobs retrieved; "Jobs posted in the past week", etc.
    - Known good options:
        - 1 (1 day)
        - 3 (3 days)
        - 7 (Past week)
        - 14 (Past 2 weeks)

- `JOBS_QUERY`: What to search for when retrieving jobs; the kind of job you're looking for

- `JOBS_LOCATION`: Where you want to look for jobs

- `JOBS_RADIUS`: How far away from your specified location a job can be
    - Known good options:
        - 0 (Exact location)
        - 5 (Within 5 kilometres)
        - 10 (Within 10 kilometres)
        - 15 (Within 15 kilometres)
        - 25 (Within 25 kilometres)
        - 50 (Within 50 kilometres)
        - 100 (Within 100 kilometres)

- `JOBS_UPDATE_INTERVAL`: How often to run the update function of the bot, in seconds.

### Example Configuration

```
TOKEN=(Not going to write anything here for security reasons)

JOBS_CHANNEL_ID=(Same deal here, if you don't know how to get the unique ID of a channel, Google it)

JOBS_SINCE=7

JOBS_QUERY=Software Developer Co-op

JOBS_LOCATION=Toronto, ON

JOBS_RADIUS=100

JOBS_UPDATE_INTERVAL=60
```