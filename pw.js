(function($){
	$(document).ready(function(){ 
		var receive_sound = new Audio('tm2_switch001.wav');
        var con = RollCake.rcpConnection();
        var Pass = function(){return true;};

		var clearView = function(){
			$('#online_user_list').html("");
			$('#result').html("");
			$('#thread_list').html("");
		}

		var onReceive = function(raw_cmd_str, cmd){
			if(cmd.command === 'addContext'){
				var safeName=RollCake.htmlEscape(cmd.name);
				$('#thread_list').append(
					'<a class="thread" id='
						+safeName
						+'> '
						+safeName
						+' </a>');
				$('.thread#'+safeName).click(function(){
					con.loginContext($(this).attr('id'));
				});
			}
			else if (cmd.command === 'appendValue'){
				if($('#sound').is(':checked')){
					receive_sound.play();
				}
				$('#result').prepend(
					'<div class="msg box">'
					+'<div class="time">'+cmd.value.time+'</div>'
					+'<div class="nametext">'
					+'<div class="handlename">'
					+RollCake.htmlEscape(cmd.value.handlename)
					+'</div>'
					+'<div class="text">'
					+RollCake.htmlEscape(cmd.value.message).
						replace('\n','<br/>')+'</div>'
					+'</div>'
					+'</div>');
				$('#result').autolink();
			}
			///
			//error 
			else if (cmd.command === 'fatal'){
				$('#result').prepend('<div class="box error">caution:'
						+cmd.description+'</div>');
			}
			else if (cmd.command === 'error'){
				$('#result').prepend('<div class="box error">caution:'
						+cmd.description+'</div>');
				if(cmd.cause.command === 'loginUser'){
					$('#login_result').text('failure.');
				}
			}
			else if (cmd.command === 'caution'){
				$('#result').prepend('<div class="box error">caution:'
						+cmd.description+'</div>');
			}
			else if (cmd.command === 'info'){
				$('#result').prepend('<div class="box">info:'
						+cmd.description+'</div>');
				if(cmd.cause.command === 'loginContext'){
					clearView();
				}
				if(cmd.cause.command === 'logoutContext'){
					clearView();
				}
				if(cmd.cause.command === 'loginUser'){
					$('#handlename').text($('#username').val());
				}
			}
			///
			//user
			else if (cmd.command === 'addUser'){
				$('#result').prepend(
					'<div class = "msg box">'+cmd.username+' login.'+'</div>');
				$('#online_user_list').prepend(
					'<span class="user_id_'+cmd.username+'" id='+cmd.username+'>'+cmd.username+' </span>');
			}	
			else if (cmd.command === 'removeUser'){
				$('#result').prepend(
					'<div class = "msg box">'+cmd.username+' logout.'+'</div>');
				$('.user_id_'+cmd.username).remove();
			}
		}

		var onError = function(e){
			setTimeout(function(){
				$('#result').prepend(
					'<div class = "error box">'+RollCake.timeStr()+'error!'+'</div>');
        		con.connectToServer(host_address, 4001, 'pw', Pass, onError, onReceive, Pass);}, 3000);
		}

		//var host_address = "192.168.11.27"
		var host_address = "www.tuna-cat.com"
		//var host_address = "localhost"
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
