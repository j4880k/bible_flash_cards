#Flash Cards
*rev 2015.02.09.11.17-5:00*

This is a flash card application that is free standing. Although the initial design is single purpose, it should be expandable for multiple decks based on some simple POC code hints that can be found in git history of this project.

The application uses:  

  * JQuery  
  * AngularJS  
  * Bootstrap  

Everything you need for it to "just run" on localhost is included in the project. The server will run on port 8087 and requires node to be installed.

The parts:

1. Frameworks (JQuery, Bootstrap, Angular[angular.js,angular-filter.js,angular-route.js])
2. Very simple index and partials (index.html, app/views/choices\_partial.html, app/views/quiz\_partial.html)
3. Data : This is a JSON data store that was designed specifically for practice data acquired for a Bible Bowl competition. (/app/data/2015\_bb\_card\_data.js)
4. Node server for localhost development. This came with the simple-sidebar template from Bootstrap's site.


#To Run local#

1. Clone the repo
2. Command line to the base directory (make sure you see 'server.js')
3. At command:<pre>$ node server</pre>
4. Navigate to localhost:8087
