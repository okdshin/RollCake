(function($){
	$(document).ready(function(){ 
		$('#upload').click(function(){
			var formData = new FormData($('#file_form')[0]);
			//var formData = new FormData($('form')[0]);
			function progressHandlingFunction(e){
			    if(e.lengthComputable){
				        $('progress').attr({value:e.loaded,max:e.total});
				}
			}

			$.ajax({
				url : 'http://localhost:54321/file_0.bin',
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
					$("progress").detach();
				},
				//error: errorHandler,
				data: formData,

				cache: false,
				contentType: false,
				processData: false
			});
			$("body").append("<progress></progress>");
		});
	});
})(jQuery);
