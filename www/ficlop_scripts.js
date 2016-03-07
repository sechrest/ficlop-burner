var companyDatabase 		= {};
var companyDatabasePrivate 	= {};
var companyIndex    = 0;
var myFirebaseRef = null;


function loadLogin()
{
	document.body.innerHTML = loadPage("ficlop_login.html")
}

//http://stackoverflow.com/questions/18930361/how-to-load-another-html-file-using-js
function loadPage(href)
{
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false); //JET some debuggers claim calling this .open asychonously (with a "false" value) is bad for performance? (shrug)
    xmlhttp.send();
 	return xmlhttp.responseText;
}
//JET ficlop_login scripts
function loginReply(error, authData)
{
    document.getElementById("user_email_field").value = "";
	document.getElementById("password_field").value = "";
	if (error)
		{document.getElementById("loginSuccessFail_field").innerHTML = "Invalid login credentials";}
	else
	{
	    document.body.innerHTML = loadPage("ficlop_card_browser.html");
	    myFirebaseRef.child("CompaniesPublic").on("value", updateLocalCompanyData);
	    for (i = 0; i < 2; i++)
			{myFirebaseRef.child("CompaniesPrivate").child(i).on ("value", updateLocalCompanyDataPrivate);}
}   }

function loginWithCredentials()
{
	if (myFirebaseRef == null) myFirebaseRef = new Firebase("https://brilliant-fire-2109.firebaseio.com/");
    myFirebaseRef.authWithPassword({
                                    "email"    : document.getElementById("user_email_field").value,
                                    "password" : document.getElementById("password_field").value,
                                   }, loginReply);  
}

//JET ficlop_card_browser scripts
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

function updateLocalCompanyDataPrivate(databaseReply)
{
	companyDatabasePrivate[databaseReply.key()] = databaseReply.val();
	changeCompanyDisplay(companyIndex);
}

function changeCompanyDisplay(whichIndex)
{
	//JET wait until the two "updateLocalCompanyData" functions are finished before making any DOM changes
	if ((companyDatabase.length == 0) || (companyDatabasePrivate.length == 0))
		return;
	document.getElementById("CEO_Field").innerHTML          = companyDatabase[whichIndex]["CEO"];
	document.getElementById("Motto_Field").innerHTML        = companyDatabase[whichIndex]["Motto"];
	document.getElementById("headerImage").image            = companyDatabase[whichIndex]["Icon"];
	document.getElementById("headerImage").heading          = companyDatabase[whichIndex]["Company"];
	document.getElementById("EmployeeCount_Field").label    = "Employee Count = " + companyDatabase[whichIndex]["Employee Count"];

	if (whichIndex in companyDatabasePrivate)
	{
		document.getElementById("hiddenDataDivider").innerHTML = loadPage("ficlop_hidden_data.html");
		document.getElementById("EmployeeCount_Field").disabled       = false;
		document.getElementById("UpdateEmployeeCountButton").disabled = false;		
		document.getElementById("BankBalance_Field").innerHTML = companyDatabasePrivate[whichIndex]["BankBalance"];

	}
	else
	{
		document.getElementById("hiddenDataDivider").innerHTML = "<div></div>";
		document.getElementById("EmployeeCount_Field").disabled = true;
		document.getElementById("UpdateEmployeeCountButton").disabled = true;		
}	}	

function changeEmployeeCountInDatabase()
{
	var whichCompanyRef = myFirebaseRef.child("CompaniesPublic").child(companyIndex);
    whichCompanyRef.update({"Employee Count": Number(document.getElementById("EmployeeCount_Field").value)});
	document.getElementById("EmployeeCount_Field").value = "";
}