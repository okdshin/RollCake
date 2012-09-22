RollCake
========
RCP web client library

function list
---------------
namespace RollCake
-----------------
function **timeStr**
+ argument value: none  
+ return value: (*year*-*month*-*date* *hour*:*minute*:*second*)  
  
function **htmlEscape**  
+ argument value: raw string  
+ return value: escaped argument raw string  
  
function **rcpConnection**  
+ argument value: none  
+ return value: connection object  
  
### connection object  
function **loginContext**  
+ argument value: target context name  
+ return value: none  
  
function **connectToServer**  
+ argument value: server name,   
port,   
initial context name,  
on open function,  
on close function,  
on receive message function,  
on error occuered function  
+ returnvalue: none
  
function **sendCommand**  
+ argument value: command json string  
+ return value: none  

function **createUser**  
+ argument value: user name, password  
+ return value: none  

function **loginUser**  
+ argument value: user name, password
+ return value: none
  
function **addPermission**  
+ argument value: user name  
+ return value: none  
  
function **addContext**  
+ argument value: context name  
+ return value: none  
  
function **setValue**  
+ argument value: context path, value json string  
+ return value: none  
  
function **close**  
+ argument value: none  
+ return value: none  
  
function **sendValue**  
+ argument value: value  
+ return value: none  