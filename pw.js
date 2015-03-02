(function($){

 //Uploader
	$(document).ready(function(){ 
		$('#upload').click(function(){
			var ff = $('#file_form')[0][0];
			var files = ff.files;
			var Data = files[0];

			function progressHandlingFunction(e){
			    if(e.lengthComputable){
					$('#upload_progress').attr(
						{value:e.loaded,max:e.total});
				}
			}

			$.ajax({
				//url : 'http://localhost:54321/file_0.bin',
				//url : 'http://192.168.2.109:54321/file_0.bin',
				url: 'http://static.tuna-cat.com/upload',
				type: 'POST',
			 	xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload){
						myXhr.upload.addEventListener(
							'progress',progressHandlingFunction, false);
					}
					return myXhr;
				},

				//beforeSend: beforeSendHandler,
				success: function(data, status, jqXHR){
					$("#file")[0].value = "";	
					//$("progress").detach();
					//$("#upload_result").html(data);
					var uuid = data;
					var str = "A file was uploaded as [" + uuid + "].";
					$("#upload_result").html(str);

					//console.log(data);
				},
				error: function(jqXHR, textStatus, errorThrown){
					$("#upload_result").html("Upload failed:"+textStatus);
			    },
				data: Data,
			    crossDomain: true,

				cache: false,
				contentType: false,
				processData: false
			});
			$("#upload_result").html(
					"<progress id='upload_progress'></progress>");
		});
	});
//Postwave
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
		jQuery.fn.ex_tags = function(){
			var re1 = /\[img:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\]/g;
			var re2 = /\[file:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\]/g;
			return this.each( function(){
				$(this).html( $(this).html().replace(re1,
						'<img src = "http://static.tuna-cat.com/$1"/>'
					).replace(re2,
						'<a href = "http://static.tuna-cat.com/$1">$1</a>'
					));});
		}
		var onReceive = function(raw_cmd_str, cmd){
			if(cmd.command === 'addContext'){
				var safeName=RollCake.htmlEscape(cmd.name);
				var threadStr = makeThreadStr(cmd);
				if (safeName === 'main5'){
					threadStr = threadStr+
						' <font color=red>[[active]]<font/>';
					$('#thread_list').prepend(threadStr);
				}
				else{
					$('#thread_list').append(threadStr);
				}
				//$('#thread_list').append(threadStr);
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
					+'</div>').autolink().ex_tags().prependTo('#result');
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
			handlename= $('#handlename').val();
			message = $('#message_text').val();
			if (handlename == ""){
				$('#result').prepend(
						'<div class="box error">Require handlename.</div>');
				return;
			}

			cmd = {
				command:'replaceValue',
				begin:-1,
				end:-1,
				value:[{
					handlename:handlename,
					message:message,
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
