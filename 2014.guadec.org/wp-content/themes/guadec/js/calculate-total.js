/*calculate-total.js*/
/*Jquery file to calculate net amount during registration
  GUADEC 2014
  Author: Saumya Dwivedi */

function callTotalCalculate() {
	$.ajax({
	type: "POST",	
	url:"../wp-content/themes/guadec/js/calculate.php",
	data: {functionname: "updateTotal", arguments : [$("form input[value*='lunch_']:checked").size(), $("[name=arrival]").val(),$("[name=departure]").val(), $('input:radio[name=entry-fee]:checked').val(), $("[value=lunch]").prop("checked"), $("[value=accommodation]").prop("checked"), $("[name=room_type]").val() ]},
	success:function(obj, status){
		result = new String(obj);
		result = result.trim();
       if(result != 'error' ) {
        	$(".total").html(result);
        	$('[name=tfee]').prop('value', result);
        }
        else {
            console.log(result);
   		}          
	}
	});
}

function callLunchCalculate() {
	$.ajax({
	type: "POST",	
	url:"../wp-content/themes/guadec/js/calculate.php",
	data: {functionname : "updateLunchTotal", arguments : [$("form input[value*='lunch_']:checked").size(),  $("[value=lunch]").prop("checked")]},
	success:function(obj, status){
		result = new String(obj);
		result = result.trim();
        if(result != 'error' ) {
	    	$(".lunchfee").html(result);
	    	$('[name=lfee]').prop('value', result);
        }
        else {
            console.log(result);
   		}          
	}
	});
	callTotalCalculate();
}

function callAccomCalculate() {
	$.ajax({
	type: "POST",	
	url:"../wp-content/themes/guadec/js/calculate.php",
	data: {functionname : "updateAccomTotal", arguments : [$("[name=arrival]").val(),$("[name=departure]").val(), $("[value=accommodation]").prop("checked"), $("[name=room_type]").val()]},
	success:function(obj, status){
		result = new String(obj);
		result = result.trim();
        if(result != 'error' ) {
        	$(".accomfee").html(result);
        	$('[name=afee]').prop('value', result);
        }
        else {
            console.log(result);
   		}          
	}
	});	
	callTotalCalculate();
}
function enableDisableA(obj) {
	if ($(obj).is(":checked")) {
		$("[name=arrival]").prop("disabled", false);
		$("[name=departure]").prop("disabled", false);
		$("[name=room_type]").prop("disabled", false);
		$("[name=sponsored]").removeAttr('checked');
		$(".box-options-accom").removeClass("disabled");
		enableDisableR($("[name=room_type]"));
	}
	else {
		$("[name=arrival]").prop("disabled", true);
		$("[name=departure]").prop("disabled", true);
		$("[name=room_type]").prop("disabled", true);
		$("[name=roommate]").prop("disabled", true);
		$(".box-options-accom").addClass("disabled");
	}
}
function enableDisableS(obj) {
	if ($(obj).is(":checked")) {
		$('[name=accomodation]').removeAttr('checked');
		enableDisableA($('[name=accomodation]'));
	}
}

function enableDisableL(obj) {
	if ($(obj).is(":checked")) {
		$("form input[value*='lunch_']").prop("disabled", false);
		$("[name=diet]").prop("disabled", false);
		$(".box-options-lunch").removeClass("disabled");
		
	}
	else {
		$("form input[value*='lunch_']").prop("disabled", true);
		$("form input[value*='lunch_']").prop("checked", false);
		$("[name=diet]").prop("disabled", true);
		$(".box-options-lunch").addClass("disabled");
		
	}
}

function enableDisableR(obj) {
	if ($(obj).val() == "double") {
		$("[name=roommate]").prop("disabled", false);
	}
	else {
		$("[name=roommate]").prop("disabled", true);
	}
}

$(function() {


	/*Dropdown triggered event*/

	$('[name=arrival]').on('change' , function(){
		callAccomCalculate();
	})
	$('[name=departure]').on('change' , function(){
		callAccomCalculate();
	})
	$('[name=room_type]').on('change' , function(){
		callAccomCalculate();
		enableDisableR(this);	
	})

	 /* Checkboxes call events */
	$("[value=lunch]").change(function(){
		callLunchCalculate();
	})
	$("[value=accommodation]").change(function(){
		callAccomCalculate();
	})
	$("[value*='lunch_']").click(function(){
		callLunchCalculate();
	})
	

	/*Radio triggered event */
	$('input:radio[name=entry-fee]').click(function() {
		callTotalCalculate();
	});               

	$('input:radio[id=entry-fee-arb]').click(function() {
		callTotalCalculate();
	});

	/* To force entry of numbers in money textbox */
	$('#entry-arb').on('change keyup', function() {
	  // Remove invalid characters
	  var sanitized = $(this).val().replace(/[^0-9]/g, '');
	  // Update value
	   $(this).val(sanitized);
           $('input:radio[id=entry-fee-arb]').prop('value', sanitized);
	   callTotalCalculate();
	});
	//Enable Disable Accomodation and Lunch Selection
	$(document).ready(function() {
		enableDisableA(this);
		$("[name=accommodation]").click(function() {
			enableDisableA(this);	
		});
	});
	$(document).ready(function() {
		enableDisableL(this);
		$("[name=lunch]").click(function() {
			enableDisableL(this);	
		});
	});
	$(document).ready(function() {
		enableDisableS(this);
		$("[name=sponsored]").click(function() {
			enableDisableS(this);
		});
	});
	// Enable Disable the submit button
	$('input[name=regsub]').attr('disabled','disabled');

     $('input[name="policy"]').click(function() {
        if($(this).is(':checked')) {
           $('input[name=regsub]').removeAttr('disabled');
        }
        else {
           $('input[name=regsub]').attr('disabled','disabled');
        }
     });

     //Enable the arbitary Amount Text Field
     $('#entry-arb').attr('disabled','disabled');
     $('[name=entry-fee]').change(function(){
     	if($('input:radio[id=entry-fee-arb]').is(':checked')) {
           $('#entry-arb').removeAttr('disabled');
        }
        else {
           $('#entry-arb').attr('disabled','disabled');
        }
     });

     /*Form Submit related checks */
     $('form[name=registration]').submit(function(event){
		if(!$("[name=contact_name]").val() || !$("[name=contact_email]").val()) {
			alert("Make sure you enter your name and email", $('.accomfee').html());
   			event.preventDefault();
		}
		if($('.accomfee').html() == 'Incorrect dates'){
			alert("Make sure you enter correct accommodation dates");
   			event.preventDefault();	
		}
     });
     
});

