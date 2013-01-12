(function($){
	$(document).ready(function(){ 
		var receive_sound = new Audio('tm2_switch001.wav');
        var con = RollCake.rcpConnection();
        var Pass = function(){return true;};

		var clearView = function(){

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
				if(cmd.cause.command === 'createUser'){
					$('#login_result').text('fail:'
						+cmd.description);
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
				if(cmd.cause.command === 'createUser'){
					$('#login_result').text('success');
				}
			}
			///
			//user
			else if (cmd.command === 'addUser'){
				$('#result').prepend(
					'<div class = "msg box">'+cmd.username+' login.'+'</div>');
				$('#online_user_list').prepend(
					'<span id=login_id_'+cmd.loginID+'>'+cmd.username+' </span>');
			}	
			else if (cmd.command === 'removeUser'){
				$('#result').prepend(
					'<div class = "msg box">'+cmd.username+' logout.'+'</div>');
				$('#login_id_'+cmd.loginID).remove();
			}
		}

		var onOpen = function(e){
			$("#connection_state").text("online");
			console.log("test log");
		}
		var onError = function(e){
			$('#result').prepend(
				'<div class = "error box">'+RollCake.timeStr()+'error!'+'</div>');
			$("#connection_state").text("offline");
			setTimeout(function(){
        		con.connectToURL(host_url, 'pw', onOpen, onError, onReceive, Pass);}, 3000);
		}

		//var host_address = "192.168.11.27"
		//var host_address = "localhost"
		con.connectToURL(host_url, 'pw', onOpen, onError, onReceive, Pass);

        $('#createUser_button').click(function(){
			con.createUser($('#username').val(), $('#password').val());
			$('#message_text').val("");
        });
        
		$(window).bind("beforeunload", function(){
			con.close();	
		});

		$('#password').keyup(function(e){
			if (e.keyCode === 13){
				$('#createUser_button').click();
			}
		})
        
    });

})(jQuery);
