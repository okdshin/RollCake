(function($){
	$(document).ready(function(){ 
		var receive_sound = new Audio('tm2_switch001.wav');
        var con = RollCake.rcpConnection();
        var Pass = function(){return True;};
		var onReceive = function(raw_cmd_str, cmd){
			$('#debug_log').prepend('<div class = "msg">'+RollCake.timeStr()+RollCake.htmlEscape(raw_cmd_str)+'</div>');

			if (cmd.command === 'appendValue'){
				if($('#sound').is(':checked')){
					receive_sound.play();
				}
				$('#result').prepend('<div class = "msg">'+cmd.value.time+':'+RollCake.htmlEscape(cmd.value.handlename)+":"+RollCake.htmlEscape(cmd.value.message)+'</div>');
				$('#result').autolink();
				//window.webkitNotifications.createNotification("test", "notify", "hello");
			}
			else if (cmd.command === 'caution'){
				if(cmd.cause === 'logintUser'){
					$('#login_result').val() = 'failure.';
				}
			}
			else if (cmd.command === 'info'){
				if(cmd.cause === 'loginUser'){
					//$('#login_create').hide();
					$('#handlename').text($('#username').val());
				}
			}
			else if (cmd.command === 'addUser'){
				$('#result').prepend('<div class = "msg">'+cmd.username+' login.'+'</div>');
				$('#online_user_list').prepend('<span class="user_id_'+cmd.username+'">'+cmd.username+' </span>');
			}	
			else if (cmd.command === 'removeUser'){
				$('#result').prepend('<div class = "msg">'+cmd.username+' logout.'+'</div>');
				$('.user_id_'+cmd.username).remove();
			}

		}

		var onError = function(e){
			$('#debug_log').prepend('<div class = "msg">'+RollCake.timeStr()+'error!'+'</div>');
        	con.connectToServer(host_address,4001,Pass,onError,onReceive,Pass);
        	//con.connectToServer(host_address,4002,Pass,onError,onReceive,Pass);
		}

		//var host_address = "192.168.11.27"
		var host_address = "www.tuna-cat.com"
        con.connectToServer(host_address,4001,Pass,onError,onReceive,Pass);
		//$('#debug_log').prepend('<div class = "msg">'+con+'error!'+'</div>');

        $('#createUser_button').click(function(){
			con.createUser($('#username').val(), $('#password').val());
			$('#message_text').val("");
        });
        
		$('#login_button').click(function(){
			con.loginUser($('#username').val(), $('#password').val(), 'pw');
			$('#message_text').val("");
        });
		
		$('#addPermission_button').click(function(){
			con.addPermission($('#username').val());
			$('#message_text').val("");
		});

		$(window).bind("beforeunload", function(){
			con.close();	
		});

        $('#send_button').click(function(){
			/*	
			if (!$.trim($('#message_text'.val())))
			{
				$('#debug_log').prepend('message is none.');
				return;	
			}
			else
			*/
			{	
				cmd = {
					command:'appendValue',
					value:{
						handlename:$('#handlename').val(),
						message:$('#message_text').val(),
						time:RollCake.timeStr()
					}
				}
				con.sendCommand(cmd);
				$('#message_text').val("");
			}
        })
		
		$('#message_text').keyup(function(e){
			if (e.keyCode === 13 && e.shiftKey){ // Shift + Enter
				$('#send_button').click();
			}
		})
		
		$('#password').keyup(function(e){
			if (e.keyCode === 13){ // Enter
				$('#login_button').click();
			}
		})
        
    });

})(jQuery);
