'use strict';

$('html').css({
//	fontSize: $('html').height() * 16/920
});
$('app').width()
$(window).resize(function() {
	$('html').css({
//		fontSize: $('html').height() * 16/920
	});
});
  
function Kountly(){
	var self = this;
	
	function counter(){
		this.counter = 0;
		this.title = '';
	}
	
	//Actions 
	this.new_counter = function(){
		alert('new counter');
	};
	this.counters = function(){
		alert('new count');
	};
	
	// controll
	$('#app').find('a').on('click',function(e){
		e.preventDefault();
		console.log($(this).data('action'));
		self[$(this).data('action')]();
	});
	
	//view
	
	
	
}

$(function(){new Kountly();});
