# Lab 2 - Grade Book


* *Date Created*: 04 Feb 2026
* *Last Modification Date*: 08 Feb 2026
* *Lab Timberlea URL*: <https://web.cs.dal.ca/~eskelton/csci3172/labs/lab2/>
* *Lab Gitlab URL*: <https://git.cs.dal.ca/eskelton/csci3172>


## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

* [Ella](el423421@dal.ca) - (Author)


## Built With

<!--- Provide a list of the frameworks used to build this application, your list should include the name of the framework used, the url where the framework is available for download and what the framework was used for, see the example below --->

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) - Markup language for structuring web pages
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling language for web pages
* [JavaScript ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language for web interactivity



## Variable Keywords: let and const

### (a) What is the scope of a const variable?

A const variable has block scope, which means it can only be used inside the block of code ({}) where it is declared. 
This is the same as let and different from var, which can be accessed outside of blocks. A const variable cannot be 
reassigned to a new value, but if it is an object or array, the values inside it can still be changed.

**Example:** In this lab, `const studentNames = ['Alice', 'Pedro', ...]` is declared at the top level, so it can be 
accessed throughout the entire script. However, if it were declared inside a function like `function displayGradeBook() { const studentNames = [...] }`, 
it would only be accessible within that function block.


### (b) When were the let and const keywords added to JavaScript?

The let and const keywords were added in ECMAScript 2015 (ES6), which was released in 2015. 
This update introduced block-scoped variables and other modern JavaScript features.

*Source: L5V4: Using VAR, LET and CONST (Post-Lecture Video)*


### (c) If you were to change let for var in your script(s), would your script still work? Why or Why not?

Yes I believe, the script would still work if let was replaced with var in this lab. This is because all the let variables are 
used in simple loops and functions where the scope difference between var and let does not cause problems. The variables 
are not used in closures or complex scenarios where var's function scope would create bugs. However, using let and const 
is better practice because they have block scope which makes code easier to understand and helps prevent bugs in more 
complex programs.


## Sources Used

### L5V4: Using VAR, LET and CONST (Post-Lecture Video) - Question B

This post-lecture video was used to understand when the let and const keywords were introduced to JavaScript and 
their relationship to ECMAScript 2015 (ES6)


## Acknowledgments

* 3172, 2171, 1170 CSCI course work :)



