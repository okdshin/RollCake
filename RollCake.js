//copy-right(201202220240):okada shintarou(kokuzen@gmail.com)
//to use this, you need including json2.js

var RollCake = {};//name space
(function(JSON){
    RollCake.rcpConnection = function(){
        var that = this;
        var con = {};//temporary object

        con.connectToServer = function(server_name, port, onopen, onclose, onmessage, onerror){
            that.websock = new WebSocket('ws://'+server_name+':'+port+'/rcp');
            that.websock.onmessage = function(event){
                var message = JSON.parse(event.data);
				if (message.command == 'sendValue'){
					con.onReceiveValue(message.value);
				}
				onmessage(event.data, message);
            };
            that.websock.onopen = function(event){
                con.protocol();
				con.sendCommand({command:'loginContext'});
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
        
        con.protocol = function(){
            con.sendCommand({command:'protocol',protocol:'RCP-ALPHA',client:'RollCakeClient'});
        };
        
        con.loginUser = function(uname, pass){
            con.sendCommand({
                command:'loginUser', 
                username:uname, 
                password:pass
            });
        };
        
        con.loginDocument = function(document_id){
            con.sendCommand({
                command:'loginDocument', 
                document_id:document_id
            });
        };
        
        con.loginDocumentListDocument = function(){
            con.sendCommand({command:'loginDocumentListDocument'});
        };

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
