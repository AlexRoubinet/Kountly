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
	
	function Counter(title){
		this.key = (new Date()).getTime();
		this.counter = 1;
		this.title = title;
		this.save = function(){
			localStorage.setItem(this.key,JSON.stringify(this));
			self.counters.add(this.key);
			this.render();
		};
		this.render = function(){
			$('#list').find('ul').append(
				('<li>\
					<b>1</b>\
					<p>{titre}</p>\
					<small>{date}</small>\
					<a href="#" data-action="add"></a>\
				</li>'
				).replace('{titre}',this.title)
			);
		};
		return this;
	}
	
	function Counters(){
		this.list = JSON.parse(localStorage.getItem('counters')) || [];
		
		this.add = function(c){console.log(this.list);
			this.list.push(c);
			localStorage.setItem('counters',JSON.stringify(this.list));
		}
		
		for(var i = 0;i< this.list.length; i++){
			var e = JSON.parse(localStorage.getItem(this.list[i]));
			var c = new Counter(e.title);
			
			c.counter = e.counter;
			c.render();
		}
		
		return this;
	}
	
	this.counters = new Counters();
	
	
	//Actions 
	this.new_counter = function(text){
		var counter = new Counter(text);
		counter.save();
	};
	
	// controll
	$('#list').find('form').on('submit',function(e){
		var text = $(this).find('input[type="text"]').val();
		if(text.length > 0){
			self.new_counter(text);	
		}

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
	slideSelector: '#app li a',
	backSelector : '.home'
});