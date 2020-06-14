var fetch = require('node-fetch');
const redis = require('redis');
    const client = redis.createClient();

const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json';

async function fetchGithub() {

    let resultCount = 1, onPage = 0;
    const allJobs = [];


    //fetch all pages
    while (resultCount > 0) {

        const res = await fetch(`${baseURL}?page=${onPage}`);
        const jobs = await res.json();
        allJobs.push(...jobs);
        resultCount = jobs.length;
        console.log('got', resultCount, 'jobs');

        onPage++;


    }
    console.log('got', allJobs.length, 'jobs total');

    //filter based on job criteria

    const jrJobs = allJobs.filter(job => {

        const jobTitle = job.title.toLowerCase();
        let isJunior = true;

        if (
            jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect')
        ) {

            return false;
        }

        return true;
    })


    console.log('filter down to jr job', jrJobs.length);
    //set in redis

    const success = await setAsync('github', JSON.stringify(jrJobs));

    console.log({ success });
}

fetchGithub();

module.exports = fetchGithub;

/*
 let resultCount = 1, onPage = 0; Setting the 
 result count to a non-zero value.
 starting page=0;

creating an empty array that will hold the results from the api

start while loop that runs as long as we are getting the results back and incrementing the pages

pushing the json data into our array
 
 */