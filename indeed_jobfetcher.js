// A class for fetching job listings from Indeed
const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

class JobFetcher {
    constructor(since, query, location, radius) {
        this.since = since;
        this.query = query;
        this.location = location;
        this.radius = radius;
        this.dataUrl = 'https://ca.indeed.com/jobs?q=' + this.query
            + '&l=' + this.location
            + '&fromage=' + this.since
            + '&radius=' + this.radius;
    }

    async fetchJobs() {
        // Send a new GET request to Indeed
        try {
            let fetchResp = await fetch(this.dataUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let fetchText = await fetchResp.text();

            let jobs = this.parseFetchedHTML(fetchText); 
            return jobs;
        } catch(e) {
            return 'Job fetch request FAILED: ' + e.message;
        }
    }

    parseFetchedHTML(htmlString) {
        // Create an object to hold the jobs
        let jobs = {
            data: [],
            count: 0,
            seeAllLink: ''
        };

        // Parse the response text as HTML
        let html = HTMLParser.parse(htmlString);

        // Get the total number of results for the job query
        jobs.count = parseInt(html.querySelector('#searchCountPages').text.match(/Page 1 of (\d*) jobs$/)[1]);

        let jobsHTML = html.querySelectorAll('.jobsearch-SerpJobCard');

        jobsHTML.forEach(element => {
            let title = element.querySelector('.title a').text.replace(/\n/g, '');
            let link = encodeURI(this.dataUrl + '&vjk=' + element.attributes['data-jk']);
            let company = element.querySelector('.sjcl div span.company').text.replace(/\n/g, '');
            let location = element.querySelector('.sjcl .location').text;

            jobs.data.push({
                title: title,
                link: link,
                company: company,
                location: location
            });
        });

        // Include a link to the search results page
        jobs.seeAllLink = encodeURI(this.dataUrl);

        return jobs;
    }
}

module.exports = JobFetcher;