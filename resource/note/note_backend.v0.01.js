
/*
 author:xcc
 since:2012-06-14
 description:interact with  google's backend server
 dependence:  depend with third part js lib(jquery-1.7.2,)
 */
/* Section: Core Functions */
function crudNote(url, operation, id) {
	var content = document.getElementById(id);
	var crud = operation || "get";
	crud = crud + "&";
	jQuery.getJSON("/operator?operator=" + crud + encodeURI(encodeURI()), function (data) {
		if (data.length > 0) {
			console.log(jQuery.stringify(data));
		}
	});
}
function expand_calendar_after_init() {
	jQuery("textarea[maxlength]").each(function () {
		if (jQuery(this).attr("textarea_maxlength_inited")) {
			return;
		}
		jQuery(this).attr("textarea_maxlength_inited", true);
	});
	jQuery("textarea[maxlength]").bind("propertychange input", function () {
	    jQuery(this).attr("modified", true);
		if (event.propertyName && event.propertyName == "value" && jQuery.trim(this.value)) {
			var val = jQuery(this).data("oldvalforvalidate");
			if (val == null || val != this.value) {
				jQuery(this).data("oldvalforvalidate", this.value);
				handle(this);
			}
		} else {
			if (jQuery.trim(this.value)) {
				var val = jQuery(this).data("oldvalforvalidate");
				if (val == null || val != this.value) {
					jQuery(this).data("oldvalforvalidate", this.value);
					handle(this);
				}
			}
		}
	});
	
	jQuery("textarea[maxlength]").bind("dblclick", function () {
	    var obj=this;
		if (!jQuery.trim(this.value)) {
			var mils=parseFloat(this.id);
		      var dates=jQuery.coverTimeToDate(mils);
		       jQuery.post("/operator?operator=get",
		       {id:this.id},
		       function(result){
		    	 if(result.success)
		    	 obj.value=(result.data['description'] );
		       
		       },"json");
			 
		} 
	});
 
}

		 function handle(thisObj){
	            var mils=parseFloat(thisObj.id);
						      var dates=jQuery.coverTimeToDate(mils);
						       jQuery.post("/operator?operator=insertOrUpdate",
						       {id:thisObj.id,description:thisObj.value,subject:'',location:'',color:'',recurringrule:'',startTime:dates,endTime:dates},
						       function(){}
						       );

				}


 <!-- 静态拓展无需返回this arg: callback fn -->
  jQuery.extend({
            onClientLeave: function(callback) {
             if (window != top) {
              //do nothing
			   } else {
				if (window.Event) {
					window.onbeforeunload = function (event) {
						return callback(event);
					};
				} else {
					window.onbeforeunload = function () {
						return callback(event);
					};
				}
			}
                 
           },
      coverTimeToDate:  function (time){
		  var date= new Date(time);
		  var month=date.getMonth()+1;
		  return date.getFullYear()+'-'+month+'-'+date.getDate();
	   }
   });

   jQuery.onClientLeave(function(){
	return '数据已经自动保存';

});