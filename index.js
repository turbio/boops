const express = require('express');
const Octokit = require('@octokit/rest');
const octokit = new Octokit({auth: process.env.TOKEN});

let app = express();

const cache = {
	issues: [],
	at: 0,
}

async function getIssues(labels) {
	const lists = [];
	for (const label of labels) {
		const issues = await octokit.issues.list({
			filter: 'all',
			state: 'open',
			// We can't just list all the labels here as that
			// does an AND but we want an OR.
			labels: [label],
		});

		lists.push(issues.data)
	}

	const flat = [].concat.apply( [], lists, )
	return flat.map(l => ({
			labels: l.labels,
			title: l.title,
			repository: { full_name: l.repository.full_name },
			updated_at: l.updated_at,
			pull_request: { html_url: l.pull_request.html_url },
			user: { avatar_url: l.user.avatar_url },
		}))
}

async function issues(_, res, next) {
	if (new Date() - cache.at > 10 * 1000) {
		cache.at = new Date(); 

		getIssues(['boop', 'superboop']).then(issues => {
			cache.issues = issues;
		}).catch(err => console.error('error:', err));
	}
	
	res.locals.issues = cache.issues;
	next();
}

app.use(express.static('static'));

app.get('/issues', issues, (req, res) => {
	res.json(res.locals.issues);
});

app.listen(3001);