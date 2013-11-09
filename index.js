var GitHubAPI   = require('github'),
    _           = require('underscore'),
    nodefn      = require('when/node/function'),
    GitHub,
    repo,
    milestone;

// This should be config
repo = {
    user: 'TryGhost',
    repo: 'Ghost'
};

milestone = 3;


GitHub = new GitHubAPI({
    version: '3.0.0'
});

function isBug(issue) {
    if (issue.labels) {
        console.log(_.pluck(issue.labels, 'name'));
    }
}

function issueToListItem(issue) {
    var status = issue.state === 'open' ? '' : '~~',
        link =  issue.title + "[" + status + issue.number + status + "](" + issue.html_url + ")"

    //console.log(issue.pull_request);
    return issue.title + "[" + status + issue.number + status + "](" + issue.html_url + ")";
}

function getIssuePage(page) {
    var options = _.extend(repo, {
        milestone: milestone,
        sort: 'updated',
        per_page: 100,
        page: page
    });

    return nodefn.call(GitHub.issues.repoIssues, options);
}

function loadIssues() {
    var page = 1;

    // Todo: recursive pagination
    getIssuePage(page).then(function (issues) {
        console.log(issues.meta);
        _.each(issues, function (issue) {
            console.log('*', issueToListItem(issue));
        });
    });
}




loadIssues();