//copy-right(201202220240):okada shintarou(kokuzen@gmail.com)
//to use this, you need including json2.js

var RollCake = {};//name space
(function(JSON){
	RollCake.timeStr = function(){
		var today = new Date();
		var year = today.getYear();
		if (year < 2000)
		{
			year = year + 1900;	
		}
		var month=today.getMonth()+1;
		var date=today.getDate();
		var hour   = today.getHours();
		var minute = today.getMinutes();
		var second = today.getSeconds();
		return '('+year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second+')';
	}

	RollCake.htmlEscape = function(raw_str){
		return raw_str
			.replace('&', '&amp')
			.replace('<', '&lt;')
			.replace('/', '&#47;')
			.replace('>', '&gt;')
			.replace('"', '&quot');
	}

    RollCake.rcpConnection = function(){
        var that = this;
        var con = {};//temporary object

        con.connectToServer = function(server_name, port, onopen, onclose, onmessage, onerror){
            that.websock = new WebSocket('ws://'+server_name+':'+port+'/rcp');
            //that.websock = new WebSocket('wss://'+server_name+':'+port+'/rcp');

            that.websock.onmessage = function(event){
                var message = JSON.parse(event.data);
				if (message.command == 'sendValue'){
					con.onReceiveValue(message.value);
				}
				onmessage(event.data, message);
            };
            that.websock.onopen = function(event){
                onopen(event);
            };            
            that.websock.onclose = function(event){
                onclose(event);
            };
            that.websock.onerror = function(event){
                onerror(event);
            };
        };

        con.sendCommand = function(command){
            var dumped = JSON.stringify(command);
            that.websock.send(dumped);
        };
        
        con.createUser = function(uname, pass){
            con.sendCommand({
                command:'createUser', 
                username:uname, 
                password:pass
            });
        };
        
		con.loginUser = function(uname, pass, context_name){
            con.sendCommand({
                command:'loginUser', 
                username:uname, 
                password:pass
            });
			con.sendCommand({
				command:'loginContext',
				name:context_name
			});
        };
       
	   	con.addPermission = function(uname){
			con.sendCommand({
				command:'addPermission',
				username:uname
			});
		}

        con.close = function(){
            con.sendCommand({command:'close'});
            that.websock.close();
        };
		
		//command short cut
        con.sendValue = function(value){
            con.sendCommand({
				command:'sendValue',
				value:value
			});
        };


        return con;
    };
    
})(JSON);
