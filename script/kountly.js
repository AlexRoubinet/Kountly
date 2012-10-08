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
	$('#list').find('form').on('submit',function(e){
		$('#list').find('ul').append(
			('<li>\
				<b>1</b>\
				<p>{titre}</p>\
				<small>{date}</small>\
				<a href="#" data-action="add"></a>\
			</li>'
			).replace('{titre}',$('#list').find('input[type="text"]').val())
		);
	});
/*	$('#app').find('a').on('click',function(e){
		//e.preventDefault();
		console.log($(this).data('action'));
		self[$(this).data('action')]();
	});*/
	
	//view
	
	
	
}

$(function(){
	new Kountly();
});
$.jQTouch({
	slideSelector: '#app li a'
});