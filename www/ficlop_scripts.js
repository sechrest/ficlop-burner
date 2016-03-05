var companyDatabase = {};
var companyIndex    = 0;
var myFirebaseRef = null;

//http://stackoverflow.com/questions/18930361/how-to-load-another-html-file-using-js
function loadPage(href)
{
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false); //JET some debuggers claim calling this .open asychonously (with a "false" value) is bad for performance? (shrug)
    xmlhttp.send();
 	document.body.innerHTML = xmlhttp.responseText;
}
//JET polymer_login scripts
function loginReply(error, authData)
{
    document.getElementById("user_email_field").value = "";
	document.getElementById("password_field").value = "";
	if (error)
	{
	    document.getElementById("loginSuccessFail_field").innerHTML = "Invalid login credentials";
	}
	else
	{
	   loadPage("ficlop_card_browser.html");
	    myFirebaseRef.child("Companies").on  ("value", updateLocalCompanyData);
}   }

function loginWithCredentials()
{
	if (myFirebaseRef == null) myFirebaseRef = new Firebase("https://brilliant-fire-2109.firebaseio.com/");
    myFirebaseRef.authWithPassword({
                                    "email"    : document.getElementById("user_email_field").value,
                                    "password" : document.getElementById("password_field").value,
                                   }, loginReply);  
}

//JET polymer_card_browser scripts
function displayCompanyXm1()
{
	if (companyIndex == 0) {companyIndex = 2;}
	else                   {companyIndex = companyIndex -1;}
	changeCompanyDisplay(companyIndex);
}
function displayCompanyXp1()
{
	if (companyIndex == 2) {companyIndex = 0;}
	else                   {companyIndex = companyIndex +1;}
	changeCompanyDisplay(companyIndex);
}
	    
function updateLocalCompanyData(databaseReply)
{
	companyDatabase = databaseReply.val();
	changeCompanyDisplay(companyIndex);
}
function changeCompanyDisplay(whichIndex)
{
	//JET create a clone of the DOM, for modification. This is done to avoid reflows where possible
	//var domClone = document.cloneNode(true); 
	document.getElementById("CEO_Field").innerHTML       = companyDatabase[whichIndex]["CEO"];
	document.getElementById("Motto_Field").innerHTML     = companyDatabase[whichIndex]["Motto"];
	document.getElementById("headerImage").image         = companyDatabase[whichIndex]["Icon"];
	document.getElementById("headerImage").heading       = companyDatabase[whichIndex]["Company"];
	document.getElementById("EmployeeCount_Field").label = "Employee Count = " + companyDatabase[whichIndex]["Employee Count"];
	//document.body.innerHTML = domClone.body.innerHTML;
}

function changeEmployeeCountInDatabase()
{
	var whichCompanyRef = myFirebaseRef.child("Companies").child(companyIndex);
    whichCompanyRef.update({
    						"Employee Count": Number(document.getElementById("EmployeeCount_Field").value)
                		  });
	document.getElementById("EmployeeCount_Field").value = "";
}