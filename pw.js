(function($){
	$(document).ready(function(){ 
		var receive_sound = new Audio('tm2_switch001.wav');
        var con = RollCake.rcpConnection();
        var Pass = function(){return true;};
		var onReceive = function(raw_cmd_str, cmd){
			$('#current_context').html(RollCake.htmlEscape(con.getCurrentContextName()));
			if(cmd.command === 'addContext'){
				$('#thread_list').prepend(
					'<button class="thread" name='+RollCake.htmlEscape(cmd.name)+'>'
						+RollCake.htmlEscape(cmd.name)
					+'</button>');
				$('.thread').click(function(){
					$('#debug_log').html("loginuser");
					$('#result').html("");
					con.loginContext($(this).attr('name'));
				});
			}
			else if (cmd.command === 'appendValue'){
				if($('#sound').is(':checked')){
					receive_sound.play();
				}
				$('#result').prepend(
					'<div class="msg">'
					+'<span class="time">'+cmd.value.time+'</span>'+':'
					+'<span class="handlename">'
						+RollCake.htmlEscape(cmd.value.handlename)+'</span>'+':'
					+'<span class="text">'+RollCake.htmlEscape(cmd.value.message)+'</span>'
					+'</div>');
				$('#result').autolink();
			}
			else if (cmd.command === 'caution'){
				$('#debug_log').prepend('<div>caution:'+cmd.reason+'</div>');
				if(cmd.cause.command === 'loginUser'){
					$('#login_result').text('failure.');
				}
			}
			else if (cmd.command === 'info'){
				$('#debug_log').prepend('<div>info:'+cmd.info+'</div>');
				if(cmd.cause.command === 'loginUser'){
					$('#handlename').text($('#username').val());
				}
			}
			else if (cmd.command === 'addUser'){
				$('#result').prepend(
					'<div class = "msg">'+cmd.username+' login.'+'</div>');
				$('#online_user_list').prepend(
					'<span class="user_id_'+cmd.username+'">'+cmd.username+' </span>');
			}	
			else if (cmd.command === 'removeUser'){
				$('#result').prepend(
					'<div class = "msg">'+cmd.username+' logout.'+'</div>');
				$('.user_id_'+cmd.username).remove();
			}
		}

		var onError = function(e){
			setTimeout(function(){
				$('#debug_log').prepend(
					'<div class = \"msg\">'+RollCake.timeStr()+'error!'+'</div>');
        		con.connectToServer(host_address, 4001, 'pw', Pass, onError, onReceive, Pass);}, 3000);
		}

		//var host_address = "192.168.11.27"
		var host_address = "www.tuna-cat.com"
        con.connectToServer(host_address, 4001, 'pw', Pass,onError, onReceive, Pass);

        $('#createUser_button').click(function(){
			con.createUser($('#username').val(), $('#password').val());
			$('#message_text').val("");
        });
        
		$('#login_button').click(function(){
			con.loginUser($('#username').val(), $('#password').val());
			//con.loginContet('pw');
			$('#message_text').val("");
			$('#handlename').val($('#username').val());
			$('#message_text').focus();
        });
		
		$('#logout_button').click(function(){
			con.logoutContext();
			$('#result').html("");
			$('#thread_list').html("");
        });
		
		$('#create_thread_button').click(function(){
			con.addContext($('#new_thread_name').val());
			con.loginContext($('#new_thread_name').val());
			con.setValue(null, []);
			$('#new_thread_name').val("");
			$('#result').html("");
		});

		$(window).bind("beforeunload", function(){
			con.close();	
		});

		$('#message_text').keyup(function(e){
			if (e.keyCode === 13 && e.shiftKey){ // Shift + Enter
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
		
		$('#password').keyup(function(e){
			if (e.keyCode === 13){ // Enter
				$('#login_button').click();
			}
		})
		
        
    });

})(jQuery);
