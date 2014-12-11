/*
 * Copyright (c) 2013, Personal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, regexp: true */
/*global $, window, blueimp */

$(function () {
    'use strict';
    
    var url='app.idonote.com/';
//     url='127.0.0.1:8080/';
    // Initialize the jQuery File Upload widget:
    // Uncomment the following to send cross-domain cookies:
    //xhrFields: {withCredentials: true}
    
	$('#fileupload').fileupload({submit: function (e, data) {
	        
	    	var $this = $(this);
	    	debugger;
	        $.getJSON('/rest/file/url?' + new Date().getTime(), function (result) {
	        	data.url = result.url;
	            $this.fileupload('send', data);
	        });
	        return false;
	    }
		});
	
	// Enable iframe cross-domain access via redirect option:
	$('#fileupload').fileupload(
	    'option',
	    'redirect',
	    window.location.href.replace(
	        /\/[^\/]*$/,
	        '/cors/result.html?%s'
	    )
	);
        
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: '//'+url+'rest/file',
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                    .text('文件上传服务不可用 - ' +
                            new Date())
                    .appendTo('#fileupload');
            });
        }
        
        $('#tabs a').click(function (e) {
        	  e.preventDefault();
        	  $(this).tab('show');
        });
        
        jQuery.download = function(url, data, method){
            if( url && data ){ 
                data = typeof data == 'string' ? data : jQuery.param(data);
                var inputs = '';
                jQuery.each(data.split('&'), function(){ 
                    var pair = this.split('=');
                    inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
                });
                jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
                .appendTo('body').submit().remove();
            };
        };
        
        $('#commit').tooltip('show');
        $('#popover').popover('hide');
        $('#commit').button('loading');
        
        $('#url').keypress(function(e) {
        	if (e.which == '13') {
        		e.preventDefault();
        		$.download('/rest/agent',$('#agenturl').serialize(),'post' );
        	}
        });
        //user info 
        $.ajax({
            url: '//'+url+'client/info',
            type: 'GET'
        }).success(function (res) {
            $('<div class="alert alert-success"/>')
                .text(JSON.stringify(res))
                .appendTo('#client');
        });
        
        $('#getFile').click(function (e) {
        	 $.ajax({
                 url: '//'+url+'rest/list',
                 type: 'GET'
             }).success(function (res) {
            	var tpl='';
            	 var fiels=res.files;
            	 for(var i=0;i<fiels.length;i++){
            		  var file=fiels[i];
            		 tpl+='<span class="preview"><a href="'+file.url+'" title="'+file.name+'" data-gallery><img src="'+file.url+'"></a></span><br/>'; 
            	 }
            	 $('#files').html(tpl) ;
             });
    });
        	
});
