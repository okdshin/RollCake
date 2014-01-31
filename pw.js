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

		var makeThreadStr = function(cmd){
			var safeName=RollCake.htmlEscape(cmd.name);

			var threadStr = '';
			threadStr += '<div class="thread" id='
			threadStr += safeName
			threadStr += '> '

			threadStr += '<a>'
			threadStr += safeName
			threadStr += '</a>';

			if (cmd.connectionCount != 0)
				threadStr += "("+cmd.connectionCount+")";
			var ts_values = cmd.timestamp.split("-");
			var ts_date = new Date(Date.UTC(
					parseInt(ts_values[0]),
					parseInt(ts_values[1]-1),
					parseInt(ts_values[2]),
					parseInt(ts_values[3]),
					parseInt(ts_values[4]),
					parseInt(ts_values[5])));

			threadStr += '|'+ts_date.toLocaleString();
			return threadStr
		}
		var onReceive = function(raw_cmd_str, cmd){
			if(cmd.command === 'addContext'){
				var safeName=RollCake.htmlEscape(cmd.name);
				var threadStr = makeThreadStr(cmd);
				$('#thread_list').append(threadStr);
				$('.thread#'+safeName).click(function(){
					con.loginContext($(this).attr('id'));
				});
			}
			if(cmd.command === 'updateContext'){
				var safeName=RollCake.htmlEscape(cmd.name);
				var threadStr = makeThreadStr(cmd);
				$('.thread#'+safeName).replaceWith(threadStr);
				$('.thread#'+safeName).click(function(){
					con.loginContext($(this).attr('id'));
				});
			}
			else if (cmd.command === 'replaceValue'){
				if (cmd.begin != -1)
					return;
				if (cmd.end != -1)
					return;
				if($('#sound').is(':checked')){
					receive_sound.play();
				}
				$(	'<div class="msg box">'
					+'<div class="time">'
					+RollCake.htmlEscape(cmd.value[0].time)
					+'</div>'
					+'<div class="nametext">'
					+'<div class="handlename">'
					+RollCake.htmlEscape(cmd.value[0].handlename)
					+'</div>'
					+'<div class="text">'
					+RollCake.htmlEscape(cmd.value[0].message).
						replace(/\n/g,'<br/>')+'</div>'
					+'</div>'
					+'</div>').autolink().prependTo('#result');
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
					'<span id=login_id_'+cmd.loginID+'>'+cmd.username+' </span>');
			}	
			else if (cmd.command === 'removeUser'){
				$('#result').prepend(
					'<div class = "msg box">'+cmd.username+' logout.'+'</div>');
				$('#login_id_'+cmd.loginID).remove();
			}
		}

		var onError = function(e){
			$('#result').prepend(
				'<div class = "error box">'+RollCake.timeStr()+'error!'+'</div>');
			setTimeout(function(){
        		con.connectToURL(host_url, 'pw', Pass, onError, onReceive, Pass);}, 3000);
		}

		//var host_address = "192.168.11.27"
		//var host_address = "www.tuna-cat.com"
		//var host_address = "localhost"

		// now, host_url are defined separated file "rcp_url.js"
		con.connectToURL(host_url, 'pw', Pass, onError, onReceive, Pass);

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

		$('#css_main').click(function(){
			$('#css').attr("href","main.css");
		});

		$('#css_sub').click(function(){
			$('#css').attr("href","sub.css");
		});

		$(window).bind("beforeunload", function(){
			con.close();	
		});

		var send_message = function(){
			cmd = {
				command:'replaceValue',
				begin:-1,
				end:-1,
				value:[{
					handlename:$('#handlename').val(),
					message:$('#message_text').val(),
					time:RollCake.timeStr()
				}]
			}
			con.sendCommand(cmd);
			$('#message_text').val("");
		};
		$('#post_message').click(function(e){
			send_message();
		})
		$('#message_text').keydown(function(e){
			if (e.keyCode === 13 && e.shiftKey){ // Shift + Enter
				send_message();
				return false;
			}
		})
		
		$('#password').keyup(function(e){
			if (e.keyCode === 13){ // Enter
				$('#login_button').click();
			}
		})
		
        
    });

})(jQuery);
