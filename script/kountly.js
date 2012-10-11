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
	
	function Counter(init){
		this.key = (new Date()).getTime();
		this.counter = init.counter;
		this.title = init.title;
		this.date = init.date;
		this.save = function(){
			localStorage.setItem(this.key,JSON.stringify(this));
			self.counters.add(this.key);
			this.render();
		};
		this.render = function(){
			$('#list').find('ul').append(
				('<li>\
					<b>1</b>\
					<p>{title}</p>\
					<small>{date}</small>\
					<a href="#" data-action="add"></a>\
				</li>'
				).replace('{title}',this.title)
				.replace('{date}',this.date)
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
			var c = new Counter(e);
			
			c.counter = e.counter;
			c.render();
		}
		
		return this;
	}
	
	this.counters = new Counters();
	
	
	//Actions 
	this.new_counter = function(text){
		var counter = new Counter({
			title: text,
			date: date_format(),
			counter: 1	
		});
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

function date_format(){
	var d = new Date()
		,days_of_week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
		,months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	return days_of_week[d.getDay()] + ', ' 
		+ months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() 
		+ ' at ' + d.getHours()%12 +':'+ d.getMinutes() + ' ' + (d.getHours()>11? 'p.m.' : 'a.m.');
}

$(function(){
	new Kountly();
});
$.jQTouch({
	slideSelector: '#app li a',
	backSelector : '.home'
});