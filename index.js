var GitHubAPI   = require('github'),
    _           = require('underscore'),
    nodefn      = require('when/node/function'),

    /// vars
    GitHub      = new GitHubAPI({
        version: '3.0.0'
    }),
    repo,
    milestone;


// ## Configuration - should be abstracted

repo = {
    user: 'TryGhost',
    repo: 'Ghost'
};

milestone = 3;


// ## Formatting

function isBug(issue) {
    if (issue.labels) {
        return _.contains(_.pluck(issue.labels, 'name'), 'bug');
    }
}

function process(items) {
    var issues = [],
        bugs = [];

    _.each(items, function (item) {
        if (isBug(item)) {
            bugs.push(item);
        } else {
            issues.push(item);
        }
    });

    return {issues: issues, bugs: bugs};
}

function labelList(issue) {

    return _.reduce(issue.labels, function (memo, label) {
        var out = "";

        if (label.name !== "bug") {
            if (memo !== "") {
                out += ", ";
            }

            out += label.name;
        }

        return memo + out;
    }, "");
}

function issueToListItem(issue) {
    var status = issue.state === 'open' ? '' : '~~',
        labels = labelList(issue),
        link =   "[" + status + '#' + issue.number + status + "](" + issue.html_url + ")";

    return issue.title + (labels !== "" ? " (" + labels + ") " : " ") + link;
}


// ## Fetch Data

function getMilestone() {

}

function getPullRequests() {

}

function getIssuePage(page) {
    var options = _.extend(repo, {
        milestone: milestone,
        sort: 'created',
        per_page: 100,
        page: page
    });

    return nodefn.call(GitHub.issues.repoIssues, options);
}

function loadIssues() {
    var page = 1;

    // Todo: recursive pagination
    getIssuePage(page).then(function (items) {
        items = process(items);

        console.log('### Issue List');

        _.each(items.issues, function (issue) {
            console.log('*', issueToListItem(issue));
        });

        console.log('### Bug List');


        _.each(items.bugs, function (bug) {
            console.log('*', issueToListItem(bug));
        });
    });
}




loadIssues();