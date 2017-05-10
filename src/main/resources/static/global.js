window.registerExtension('csvexport/global', function (options) {

  var isDisplayed = true;

  //get all projects
  window.SonarRequest.getJSON('/api/projects/index', {
    resolved: false
  }).then(function (responseProjects) {
    if (isDisplayed) {
      //title
      var myHeader = document.createElement('h1');
      myHeader.textContent = 'All projects';
      var myRegion = options.el;
      options.el.appendChild(myHeader);

      //project list
      var myList = document.createElement('ul');
      options.el.appendChild(myList);

      for(var k in responseProjects) {
        var projectKey = responseProjects[k].k;
        var projectName = responseProjects[k].nm;
        var myItem = document.createElement('li');
        myItem.textContent = "KEY: " + projectKey;
        myList.appendChild(myItem);
        var myItem = document.createElement('li');
        myItem.textContent = "NAME: " + projectName;
        myList.appendChild(myItem);
        /*window.SonarRequest.getJSON('/api/issues/search?tags=antipattern,stupid', {
                  resolved: false,
                  componentKeys: projectKey
                }).then(function (responseIssues) {
                  var myIssues = responseIssues.total;
                  var myItem = document.createElement('li');
                  myItem.textContent = "KEY: " + projectKey + "   NAME: " + projectName + "   MY ISSUES: " + myIssues;
                  myList.appendChild(myItem);
                });*/
      }
    }
  });

  // return a function, which is called when the page is being closed
  return function () {
    options.el.textContent = '';
    // we unset the `isDisplayed` flag to ignore to Web API calls finished after the page is closed
    isDisplayed = false;
  };
});