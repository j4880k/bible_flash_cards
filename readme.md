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


#To Convert the Data#
The convention materials contain .docx for teacher which lists the questions and has the answer in bold. Everything is visual and requires manual conversion. This guide will step through taking the .docx and making it into JSON data. Get a cup of coffee, you will need it.

JSON model we shoot for is:
<pre>
var deck = 
[
  {
    "BOOK":"Galatians", 
    "BOOK_NUMBER":48,
    "CHAPTER":1,
    "QUESTION_NUMBER":1,
    "SEQUENCE":1,
    "BCQ_KEY":"48-01-01",
    "CORRECT_OPTION":"A",
    "QUESTION":"According to Galatians 1:1, how does Paul describe himself?",
    "CHOICE_A":"Apostle",
    "CHOICE_B":"Christian",
    "CHOICE_C":"Follower",
    "CHOICE_D":"Sinner",
    "CARD_SET":"LTLL-2015-BB"
  }
]
</pre>

We will be ultimately creating a csv in which we will later insert some additional columns, so let's get the document workable:

1. Any existing commas and quotes need to be neutralized. replace "," with "!comma!", replace """ with "'"
1. Normalize some spaces in textmate replace \t => " " , replace "  " => " "
2. follow single digit nums with commas "^([0-9])(. )" => "$1, "
3. follow double digit nums with commas "^([0-9])([0-9])(. )" => "$1$2, "
4. Get all the answers stacked "\n ([A-D]). " => ","
5. get rid of some whitespace "\n\n" => "\n"
6. Get our single digit chapter headers into pastable strings "(MATTHEW)( )([0-9])\n" => "$1",40,$3,
7. Get our single digit chapter headers into pastable strings "(MATTHEW)( )([0-9])([0-9])\n" => "$1",40,$3$4,
8. Create the BCQ key column for all double digit existing chapters/question_nums "^("MATTHEW"),(40),([0-9])([0-9]),([0-9])([0-9])," => $1,$2,$3$4,$5$6,"$2-$3$4-$5$6",
9. Create BCQ key column for all double digit chapters with single digit question_nums ^("MATTHEW"),(40),([0-9])([0-9]),([0-9]), => $1,$2,$3$4,$5,"$2-$3$4-0$5",
10. Create BCQ key column for all single digit chapters with double digit question_nums ^("MATTHEW"),(40),([0-9]),([0-9])([0-9]), => $1,$2,$3,$4$5,"$2-0$3-$4$5",
11. Create BCQ key column for all single digit chapters with single digit question_nums ^("MATTHEW"),(40),([0-9]),([0-9]), => $1,$2,$3,$4,"$2-0$3-0$4",
12. Turn off line-wrapping and scan the file to make sure all of the lines are formed properly. Do your copy/paste changes to make sure the BOOK,BOOK_NUMBER,CHAPTER columns are inserted for each row (the conversion above only operates on line 1 of each chapter. Make necessary formatting corrections.
13. Create your header row which will define the fields, the following *should* correspond to the columns currently in the file:
	"BOOK","BOOK\_NUMBER","CHAPTER","QUESTION\_NUMBER","BCQ\_KEY","QUESTION","CHOICE\_A","CHOICE\_B","CHOICE\_C","CHOICE\_D"
14. Open the file as a CSV in Apple Numbers, M$ Excel, or OO Sheets and install the following columns:
	- Create a column on end of row with header "CARD\_SET"
	- Create a column *between* "QUESTION\_NUMBER" and "BCQ\_KEY" with header "SEQUENCE"
	- Create a column *between* "BCQ\_KEY" and "QUESTION" with header "CORRECT_OPTION"
15. Using your spreadsheet formula fill the "SEQUENCE" column with sequential counter from 1 - last row count.
16. Populate the "CARD\_SET" column with key for this year's data load ("LTLL-2017-BB" or whatever you will be using as a data set key)
17. Populate "CORRECT\_OPTION" column cells with "A","B","C","D" indicating which "CHOICE\_?" column contains the correct answer.
18. Export the spreadsheet as a text CSV file. Open the new .csv file in your favorite modern text editor.
19. Find and replace the following to get all columns surrounded by proper quotes for text csv if your export didn't do it for you:
	- Comma delimiters find , and replace with ","
	- Begin row quote (regex) find ^ and replace "
	- End row quote (regex) find $ and replace "
20. Use an online tool like http://www.convertcsv.com/csv-to-json.htm to convert your CSV to json format. Compare with sample above to make sure formatting looks right. The formatter should have converted your numeric field values properly.
