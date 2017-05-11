// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var urlParameters = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var options;

window.registerExtension('csvexport/global', function (opts) {

    var isDisplayed = true;
    options = opts;

    if (typeof urlParameters["componentKeys"] === "undefined") {
        window.SonarRequest.getJSON('/api/projects/index'
        ).then(function (response) {
            if (isDisplayed) {
                showProjects(response);
            }
        });
    } else {
        window.SonarRequest.getJSON('/api/issues/search',
            {componentKeys: urlParameters['componentKeys'], tags: 'antipattern'}
        ).then(function (response) {
            if (isDisplayed) {
                showIssues(response);
            }
        });
    }


    // return a function, which is called when the page is being closed
    return function () {
        options.el.textContent = '';
        // we unset the `isDisplayed` flag to ignore to Web API calls finished after the page is closed
        isDisplayed = false;
    };
});

function showProjects(responseProjects) {
    var myHeader = document.createElement('h1');
    myHeader.textContent = 'All projects';
    var myRegion = options.el;
    options.el.appendChild(myHeader);

    var projectList = document.createElement('ul');
    options.el.appendChild(projectList);

    for(var k in responseProjects) {
        var projectKey = responseProjects[k].k;
        var projectName = responseProjects[k].nm;
        var listItem = document.createElement('li');
        var itemLink = document.createElement('a');
        itemLink.setAttribute('href', "?componentKeys=" + projectKey);
        itemLink.textContent = projectName + " (" + projectKey + ")";
        listItem.appendChild(itemLink);
        projectList.appendChild(listItem);
    }
}

function showIssues(responseIssues) {
    console.log(responseIssues);
    var myHeader = document.createElement('h1');
    myHeader.textContent = 'All issues';
    var myRegion = options.el;
    options.el.appendChild(myHeader);

    var issueList = document.createElement('ul');
    options.el.appendChild(issueList);

    var row = [];
    var issues = responseIssues['issues'];
    for(var k in issues) {
        var creationDate = issues[k].creationDate;
        var updateDate = issues[k].updateDate;
        var rule = issues[k].rule;
        var status = issues[k].status;
        var classname = issues[k].component;
        row.push(creationDate);
        row.push(updateDate);
        row.push(rule);
        row.push(status);
        row.push(classname);
        var rowElem = document.createElement("p");
        rowElem.textContent = row;
        issueList.appendChild(rowElem);
        row = [];
    }
}

// cd src\main\resources\static
// http-server