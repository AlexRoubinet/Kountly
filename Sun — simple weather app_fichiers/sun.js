var height, width, degree, active, unit, w_unit, theme, settings;
function transform() {
	width = $(document).width();
	height = $(document).height();
	current();
	//alert(width + ' + ' + height);
	if(settings!=true) {
		$('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + degree + 'deg)');
	} else {
		$('#layer').css('-webkit-transform', 'translate3d(0px, -40%, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + degree + 'deg)');
	}
	$('.slide:nth-child(1)').css('-webkit-transform', 'rotate3d(0, 1, 0, 0deg) translate3d(0px, 0px, ' + width/2 + 'px)');
	$('.slide:nth-child(2)').css('-webkit-transform', 'rotate3d(0, 1, 0, 90deg) translate3d(0px, 0px, ' + width/2 + 'px)');
	$('.slide:nth-child(3)').css('-webkit-transform', 'rotate3d(0, 1, 0, 180deg) translate3d(0px, 0px, ' + width/2 + 'px)');
	$('.slide:nth-child(4)').css('-webkit-transform', 'rotate3d(0, 1, 0, 270deg) translate3d(0px, 0px, ' + width/2 + 'px)');
}
function full_day(day) {
	switch(day) {
		case 'Mon':
			day = 'Monday';
			break;
		case 'Tue':
			day = 'Tuesday';
			break;
		case 'Wed':
			day = 'Wednesday';
			break;
		case 'Thu':
			day = 'Thursday';
			break;
		case 'Fri':
			day = 'Friday';
			break;
		case 'Sat':
			day = 'Saturday';
			break;
		case 'Sun':
			day = 'Sunday';
			break;	
	}
	return day;	
}
function convert(degree, units) {
	if(units=='f') {
		// Fra celcius til fahrenheit
		return Math.round((degree*1.8)+32)
	} else {
		// Fra fahrenheit til celcius
		return Math.round((degree-32)/1.8)
	}
}
function current() {
	switch(active) {
		case 1:
			degree = 0;
			break;
		case 2:
			degree = -90;
			break;
		case 3:
			degree = -180;
			break;
		case 4:
			degree = -270;
			break;
		default:
			// Do nothing, yet?
	}
	return degree;
}
function weather(data, index, city) {
	var temp = data.weather.current_conditions.temp_c['@attributes'].data;				  			
	if(unit=='f') { temp = convert(temp, 'f') }
	city = city.split(',')[0];
	var icon = data.weather.current_conditions.condition['@attributes'].data.replace(/ /g, '_').toLowerCase();
	var wind = data.weather.current_conditions.wind_condition['@attributes'].data.split('at ')[1].split(' mph')[0];
	var o_wind = wind;			  			
	if(w_unit=='m/s') {
		wind = Math.round(wind * 0.44704);
	} else if (w_unit=='km/h') {
		wind = Math.round(wind * 1.609344);
	}
	
	if($('.slide:eq('+index+') .weather').length>0) {
		$('.slide:eq('+index+') .weather').html('');
	} else {
		$('.slide:eq('+index+')').append('<div class="weather" />');
	}
	
	$('.slide:eq('+index+') .weather').append('<div class="icon ' + icon + '" />');
	$('.slide:eq('+index+') .weather').append('<div class="info">' + city + ' <span>' + temp + '°</span>'  + '</div>');
	
	if($('.slide:eq('+index+') .forecast').length>0) {
		$('.slide:eq('+index+') .forecast').remove();
	}
	
	$('.slide:eq('+index+')').append('<div class="forecast" />');
	$.each(data.weather.forecast_conditions, function(it, item) {
		var low = data.weather.forecast_conditions[it].low['@attributes'].data;
		var high = data.weather.forecast_conditions[it].high['@attributes'].data;
		var con = data.weather.forecast_conditions[it].condition['@attributes'].data;
		var day = data.weather.forecast_conditions[it].day_of_week['@attributes'].data;
		
		if(unit=='c') {
			low = convert(low, 'c');
			high = convert(high, 'c');
		}
		
		if(it==0) {
			day = 'Today'
		} else {
			day = full_day(day);
		}
		
		$('.slide:eq('+index+') .forecast').append('<div class="day"><div class="icon ' + con.replace(/ /g, '_').toLowerCase() + '"></div><div class="info">' + day + ' <span class="temp" data-temp="'+high+','+low+'">' + high + '° / ' + low + '°</span><span class="con">'+con+'</span></div></div>');
		
		if(it==0) {
			$('.slide:eq('+index+') .forecast .day:nth-child(1) .info .con').append('<span data-wind="'+o_wind+'"> — ' + wind + ' ' + w_unit + '</span>');
		}
	});
}
function notification(title, content, infinite) {
	var notification = $('<div class="notification">');
	notification.append('<div class="left"></div><div class="right"></div>')
	notification.children('.right').append('<h2>' + title + '</h2><p>' + content + '</p>');
	if(!$('.notification').length>0) {
		$('body').append(notification);	
	} else {
		$('.notification').addClass('up');
		$('.notification').delay(600).queue(function(){
			$('.notification').remove();
			$('body').append(notification);
			$(this).dequeue();
		});	
	}
	if(infinite != true) {
		setTimeout(function () {
			notification.addClass('up');
			notification.delay(600).queue(function(){
				notification.remove();
				$(this).dequeue();
			});
		}, 6000)
	}
	
	notification.bind('touchstart', function() {
		notification.addClass('up');
		notification.delay(600).queue(function(){
			notification.remove();
			$(this).dequeue();
		});
	}); 
	
}
jQuery.event.special.tap = {
    setup: function (a, b) {
        var c = this,
            d = jQuery(c);
        if (window.Touch) {
            d.bind("touchstart", jQuery.event.special.tap.onTouchStart);
            d.bind("touchmove", jQuery.event.special.tap.onTouchMove);
            d.bind("touchend", jQuery.event.special.tap.onTouchEnd)
        } else {
            d.bind("click", jQuery.event.special.tap.click)
        }
    },
    click: function (a) {
        a.type = "tap";
        jQuery.event.handle.apply(this, arguments)
    },
    teardown: function (a) {
        if (window.Touch) {
            $elem.unbind("touchstart", jQuery.event.special.tap.onTouchStart);
            $elem.unbind("touchmove", jQuery.event.special.tap.onTouchMove);
            $elem.unbind("touchend", jQuery.event.special.tap.onTouchEnd)
        } else {
            $elem.unbind("click", jQuery.event.special.tap.click)
        }
    },
    onTouchStart: function (a) {
        this.moved = false
    },
    onTouchMove: function (a) {
        this.moved = true
    },
    onTouchEnd: function (a) {
        if (!this.moved) {
            a.type = "tap";
            jQuery.event.handle.apply(this, arguments)
        }
    }
};
var ScrollFix = function(elem) {
	// Variables to track inputs
	var startY, startTopScroll;

	elem = elem || document.querySelector(elem);

	// If there is no element, then do nothing	
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;

		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};

$(document).ready(function() {
	if (!window.navigator.standalone) {
		if (navigator.userAgent.match(/like Mac OS X/i)) {
			$('head').append('<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">');
			$('body').addClass('install').html('<div id="install"><div id="homescreen"><h2 id="add">Add to your <strong>Home Screen</strong></h2></div></div>');
			document.title = 'Sun';
		} else {
			$('body').append('<div class="overlay"><div class="wrapper"><h2>Visit this page from your <strong>iOS</strong> device</h2><p>Sun is a web app designed for the iPhone and iPad. It\'s making heavy use of gestures. Rest assured, you\'ll be doing a lot of pinching.</p><p>Visit <strong>this page</strong> from your iOS device and install it on your Home Screen.</p><small>You can follow me on <a target="_blank" href="http://twitter.com/jalifax">Twitter</a> and <a target="_blank" href="http://dribbble.com/jalifax">Dribbble</a>.<br>My <em>real</em> portfolio is not quite ready.</small></div></div>');
			$('.overlay').click(function() {
				$(this).addClass('up').delay(600).queue(function(){
					$(this).hide().removeClass('up');
		  			$(this).dequeue();
		  		});
			});
		}
		$('#more').click(function(e) {
			e.preventDefault();
			if(!$('.overlay').hasClass('up')) {
				$('.overlay').show();
			}
		});
		window.addEventListener('load', function(e) {
			window.applicationCache.addEventListener('updateready', function(e) {
				if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
					console.log('[Non-fullscreen] Cache manifest updated. Relaunch required.')
					window.applicationCache.swapCache();
				}
			}, false);
		
		}, false);
	} else {
		// #Initialization
		// _Declaration of variables and initial initialization_
		var city, xPos, xOrg, xCor, freeze, touchX, touchY, pinch, time, time2, icon, info, reveal1, reveal2, pagination, r1height, r2height, blur;
		var cities = [];
		var doc = $(this);
		active = 1;
		$('head').append('<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">');
		$('body').removeClass('preview').html('<div id="box"><div id="layer"><div class="slide"><div class="pagination"><span class="active"></span><span></span><span></span><span></span></div></div></div></div>');
		if(!window.navigator.onLine) {
			$('.pagination').hide();
			$(document).bind('touchstart', function(e) {
				e.preventDefault();
			});
			notification("No connection", 'Sun requires a working 3G or WiFi connection.', true);
		} else {
			// Check if a new cache is available on page load.
			window.addEventListener('load', function(e) {
				window.applicationCache.addEventListener('updateready', function(e) {
					if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
						notification("An update has been installed", 'Relaunch the app to load the update.');
						window.applicationCache.swapCache();
						//Notification here!
					} else {
						// Manifest didn't changed. Nothing new to server.
					}
				}, false);
			}, false);
			
			// #Application start
			// _Take-off_
			$('.slide').append('<div class="loading" />');
			$('body').append('<div id="settings"><div class="content"><h2>Units</h2><ul class="units"><li data-unit="c">Celsius</li><li data-unit="f">Fahrenheit</li></ul><ul class="wind"><li data-unit="m/s">Meters per second</li><li data-unit="km/h">Kilometers per hour</li><li data-unit="mph">Miles per hour</li></ul><h2>Cities</h2><ul class="cities"></ul><h2>Themes</h2><ul class="themes"><li data-theme="jour">Jour</li><li data-theme="bokeh">Bokeh</li><li data-theme="pastel">Pastel</li><li data-theme="adrift">Adrift</li><li data-theme="stardust">Stardust</li></ul><h2>Credits</h2><ul class="credits"><li>See credits</li></div></div>');
			$('#settings').show().hide(); // Flicker protection
			
			// #First Time
			// _If a user visits for the first time — fill in local storage values_
			if(localStorage.getItem("init")!='false') {
				localStorage.setItem("init", 'false');
				localStorage.setItem("city0", 'Copenhagen'); // <3
				localStorage.setItem("city1", 'Amsterdam');
				localStorage.setItem("city2", 'Los Angeles');
				localStorage.setItem("unit", 'c');
				localStorage.setItem("w_unit", 'm/s');
				localStorage.setItem("theme", 'jour');
				notification("Quick Guide", 'Swipe left or right to change city.<br>Pinch in to see a 4-day forecast.<br>Pinch out to change settings.<small><strong>Tap</strong> to dismiss</small>', true);
			}
			
			// #Declaration
			// _This will fuck completely, if a browser doesn't support localStorage — but this is an iOS concept_ //
			cities[0] = localStorage.getItem("city0");
			cities[1] = localStorage.getItem("city1");
			cities[2] = localStorage.getItem("city2");
			unit = localStorage.getItem("unit"); // // Celcius (c) or Fahrenheit (f)
			w_unit = localStorage.getItem("w_unit"); // Meters per second (m/s), kilometers per second (km/h) or, god forbid, miles per hour (mph)
			theme = localStorage.getItem("theme"); // Setting theme, defaults to 'Jour'
			
			// #Settings
			// _Applying settings and listening for any settings changes_ //
			$('body').addClass(theme);
			$('#settings ul.units li[data-unit="'+unit+'"]').addClass('current');
			$('#settings ul.wind li[data-unit="'+w_unit+'"]').addClass('current');
			$('#settings ul.themes li[data-theme="'+theme+'"]').addClass('current');
			var scrollable = document.getElementById("settings"); // WebKit in iOS 5 is fantastic, except for this weird behavior that bounces the entire view. Shame.
			new ScrollFix(scrollable); // And totally fixed now.
			
			function check(input) {
				var name = input.val();
				var index = input.parent().index();
				if (name!=null && name!="") {
					$.ajax({
					  url: 'api.php',
					  dataType: 'json',
					  type: 'post',
					  data: { city: name },
					  success: function(data) {
					  	if(data==false) {
					  		notification("No match found", "The city <strong>" + name + "</strong> didn't return any results.");
					  		input.val($(this).data('city'));
					  		blur = true;
					  		input.blur();
					  	} else {
							weather(data, index + 1, name);
					  		localStorage.setItem('city' + index, name);	
					  		active = index + 2;
					  		$('#layer').css('-webkit-transform', 'translate3d(0px, -40%, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + current() + 'deg)').removeClass('fast').delay(550).queue(function(){
								$(this).addClass('fast');
					  			$(this).dequeue();
					  		});
					  		$('.beneath').removeClass('beneath');
					  		$('.slide:eq('+(active-1)+')').addClass('beneath');
					  		input.data('city', name);
					  		blur = true;
					  		input.blur();
					  	}
					  }
					});
				} else {
					input.val(input.data('city'));
				}
			}
			
			$('input').live('keydown', function(e) {
				if(e.which == 13) {
					e.preventDefault();
					check($(this));
				}
			});
			
			$('input').live('blur', function() {
				if(blur!=true && settings==true) {
					check($(this));
				} else {
					blur = false;
					$(this).val($(this).data('city'));
				}
			});
			
			$('input').live('focus', function() {
				$(this).val('');
			});
			
			$('#settings ul li').live('tap', function() {		
				// Change of temperature units
				if($(this).parent().attr('class')=='units' && $(this).attr('class')!='current') {
					unit = $(this).data('unit');
					localStorage.setItem('unit', unit);
					$(this).parent().children('.current').removeClass('current');
					$(this).addClass('current');
					
					$('.slide > .weather .info > span').each(function() {
						$(this).html(convert(parseInt($(this).html().split('°')[0]), unit) + '°');
					});
					
					$('.slide > .forecast span.temp').each(function() {
						var temp1 = parseInt($(this).data('temp').split(',')[0]);
						var temp2 = parseInt($(this).data('temp').split(',')[1]);
						temp1 = convert(temp1, unit);
						temp2 = convert(temp2, unit);
						$(this).html(temp1 + '° / ' + temp2 + '°');
						$(this).data('temp', temp1+','+temp2);
						
					});
					
				}
				
				// Change of wind units
				if($(this).parent().attr('class')=='wind' && $(this).attr('class')!='current') {
					w_unit = $(this).data('unit');
					localStorage.setItem('w_unit', w_unit);
					$(this).parent().children('.current').removeClass('current');
					$(this).addClass('current');
					
					$('.slide > .forecast span.con span').each(function() {
						var newWind = $(this).data('wind');
						if(w_unit=='m/s') {
			  				newWind = Math.round(newWind * 0.44704);
			  			} else if (w_unit=='km/h') {
			  				newWind = Math.round(newWind * 1.609344);
			  			}
			  			
			  			$(this).html(' — ' + newWind + ' ' + w_unit)
					})
					
				}
				
				// Change of themes
				if($(this).parent().attr('class')=='themes' && $(this).attr('class')!='current') {
					localStorage.setItem('theme', $(this).data('theme'));
					$('body').removeAttr('class').addClass($(this).data('theme'));
					$(this).parent().children('.current').removeClass('current');
					$(this).addClass('current');
				}
				
				if($(this).parent().attr('class')=='credits') {
					notification("Credits", 'Without these persons and services, this app would simply not have been possible:<br><br><strong>Adam Whitcroft</strong><br> Creator of the pretty Climacons.<br><strong>Google</strong><br>Provider of an amazing free weather API.<br><strong>Yahoo!</strong><br> Converting latitude and longitude points to city names.<small><strong>Tap</strong> to dismiss</small>', true);	
				}
				
			});
			
			// #Weather fetching
			// _Google and Yahoo! in wonderful cooperation. Beautiful_ //
			if (navigator.geolocation) {  
				navigator.geolocation.getCurrentPosition(
					function(position) {  
						$.ajax({
							url: 'http://where.yahooapis.com/geocode?location=' + position.coords.latitude + '+' + position.coords.longitude +'&gflags=R&flags=J&appid=gg96E56o',
							dataType: 'json',
							success: function(data) {
						  		city = data.ResultSet.Results[0].city.split('-')[0];
						  		$.ajax({
						  		  url: 'api.php',
						  		  dataType: 'json',
						  		  type: 'post',
						  		  data: { city: city + ',' + data.ResultSet.Results[0].country },
						  		  success: function(data) {
						  		  	$('.loading').remove();
						  			weather(data, '0', city);
						  		  }
						  		});
						  		
							},
							error: function(request, status, error) {
								console.log('Error');
							}
						});
						
			  		}, 
			  		function(error) {	  			
			  			notification('An error occurred', 'Your location could not be determined');
			  		},
			  		{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0
			  		}
			  	);
			}
			$.each(cities, function(index) {
				var i = index + 1;
				$('#settings .cities').append('<li><input value="'+cities[index]+'" autocorrect="off" />');
				
				$('#settings .cities input').each(function() {
					$(this).data('city', $(this).val());
				});
				$('#layer').append('<div class="slide"><div class="pagination"><span></span><span></span><span></span><span></span></div><div class="weather"><div class="icon"></div><div class="info">' + cities[index].split(',')[0] + '</div></div></div>');
				$('.slide:eq('+i+') .pagination span:eq('+i+')').addClass('active');
				$.ajax({
				  url: 'api.php',
				  dataType: 'json',
				  type: 'post',
				  data: { city: cities[index] },
				  success: function(data) {
				  	weather(data, i, cities[index]);
				  }
				});		
				
			});
			transform();
			
			// #Gesturing
			// _Mostly fun, at times painfully painful_
			function showForecast() {
				if(navigator.userAgent.match(/iPhone/i)) {
					icon.css('-webkit-transform', 'translate3d(0,-'+r1height+'px,0)');
					info.css('-webkit-transform', 'translate3d(0,'+r2height+'px,0)');
					reveal1.css('-webkit-transform', 'translate3d(0,-'+r1height+'px,0)');
					reveal2.css('-webkit-transform', 'translate3d(0,'+r2height+'px,0)');
					pagination.css('-webkit-transform', 'translate3d(0,'+r2height+'px,0)');
				} else {
					icon.css('-webkit-transform', 'translate3d(0,-90px,0)');
					info.css('-webkit-transform', 'translate3d(0,90px,0)');
					reveal1.css('-webkit-transform', 'translate3d(0,-90px,0)');
					reveal2.css('-webkit-transform', 'translate3d(0,90px,0)');
					pagination.css('-webkit-transform', 'translate3d(0,90px,0)');
				}
			}
			function hideForecast(forecast) {
				if(forecast.data('pinch')!=false) {
					$(this).removeClass('transparent');
					icon.removeAttr('style');
					info.removeAttr('style');
					reveal1.removeAttr('style');
					reveal2.removeAttr('style');
					forecast.data('time', true)
					//document.title = 'Timer: ' + time + ' Pinch: ' + pinch;
					pagination.removeAttr('style').delay(600).queue(function(){
						forecast.data('pinch', false)
						forecast.data('time', false)
						$(this).dequeue();
					});
				}
			}
			function showSettings() {
				icon.removeAttr('style');
				info.removeAttr('style');
				reveal1.removeAttr('style');
				reveal2.removeAttr('style');
				pagination.removeAttr('style');
				$('#layer').css('-webkit-transform', 'translate3d(0px, -40%, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + current() + 'deg)').addClass('fast');
				$('.slide:eq('+(active-1)+')').addClass('beneath').removeClass('transparent');
				$('#settings').show();
				settings = true;
			}
			doc.bind('touchstart', function(e) {
				var touch = event.touches[0];
				xOrg = touch.pageX;
				if(settings!=true) {
					e.preventDefault();
				}
			});
			doc.bind('touchmove', function(e){
				if(freeze!=true && event.touches.length == 1 && settings!=true) {
					var touch = event.touches[0];
					xPos = touch.pageX;
				    xCor = (xOrg-xPos)/4;
				    current();
				    $('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + (degree - xCor) + 'deg)');
				    e.preventDefault();
			    }
			});
			doc.bind('touchend', function(e) {
				if(settings!=true) {
					if(freeze!=true) {
						if(xCor > 10) {
							switch(active) {
								case 1:
									degree = -90;
									active = 2;
									break;
								case 2:
									degree = -180;
									active = 3;
									break;
								case 3:
									degree = -270;
									active = 4;
									break;
								case 4:
									degree = 0;
									active = 1;
									break;
								default:
									// Do nothing, yet?
							}
							$('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + degree + 'deg)');
						} else if(xCor < -10) {
							switch(active) {
								case 1:
									degree = -270;
									active = 4;
									break;
								case 2:
									degree = 0;
									active = 1;
									break;
								case 3:
									degree = -90;
									active = 2;
									break;
								case 4:
									degree = -180;
									active = 3;
									break;
								default:
									// Do nothing, yet?
							}
							$('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + degree + 'deg)');
						} else {
							switch(active) {
								case 1:
									degree = 0;
									active = 1;
									break;
								case 2:
									degree = -90;
									active = 2;
									break;
								case 3:
									degree = -180;
									active = 3;
									break;
								case 4:
									degree = -270;
									active = 4;
									break;
								default:
									// Do nothing, yet?
							}
							$('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + degree + 'deg)');
						}
					}
					xCor = 0;
					freeze = true;
					doc.delay(551).queue(function(){
						freeze = false;
			//			$('#debug').html('Freezer released');
						$(this).dequeue()
					});
				}
			});
			doc.bind('orientationchange', transform);
			$('.slide').bind('touchstart', function(e) {
				e.preventDefault();
				if(settings==true) {
					if($('#layer').hasClass('fast')) {
						$(this).delay(250).queue(function(){
							$(this).removeClass('beneath');
							settings = false;
							$('input').blur();
							$('#layer').removeClass('fast');
							$('#settings').hide();
							$(this).dequeue();
						});
						$('#layer').css('-webkit-transform', 'translate3d(0px, 0px, -' + width/2 + 'px) rotate3d(0, 1, 0, ' + current() + 'deg)');
					}
				}
			});
			$('.slide').bind('touchmove', function(e) {
				e.preventDefault();
				if(event.touches.length == 2 && settings!=true && $(this).data('time')!=true) {
					if(!$(this).children('.reveal').length>0) {
						$(this).prepend('<div class="reveal"></div><div class="reveal"></div>');
						r1height = $(this).children('.reveal:nth-child(1)').height();
						r2height = $(this).children('.reveal:nth-child(2)').height();
						$(this).addClass('transparent');
					}
					$(this).children('.forecast').show();
					
					icon = $(this).children('.weather').children('.icon');
					info = $(this).children('.weather').children('.info');
					reveal1 = $(this).children('.reveal:nth-child(1)');
					reveal2 = $(this).children('.reveal:nth-child(2)');
					pagination = $(this).children('.pagination');
					
					if (event.scale > 1) {
						$(this).data('pinch', true);
						icon.css('-webkit-transform', 'translate3d(0,-'+event.scale*40+'px,0)');
						info.css('-webkit-transform', 'translate3d(0,'+event.scale*40+'px,0)');
						reveal1.css('-webkit-transform', 'translate3d(0,-'+event.scale*40+'px,0)');
						reveal2.css('-webkit-transform', 'translate3d(0,'+event.scale*40+'px,0)');
						pagination.css('-webkit-transform', 'translate3d(0,'+event.scale*40+'px,0)');
					}
					
					if(event.scale > 3) {
						showForecast();
					} else if (event.scale < 1 && $(this).data('pinch')==true) {
						hideForecast($(this));
					}
				}
				if(event.touches.length == 2 && settings!=true && event.scale<1 && $(this).data('time')!=true && $(this).data('pinch')!=true) {
					showSettings();
				}
			});
			$('.slide').bind('touchend', function(e) {
				if(event.scale > 1.5 && settings!=true && $(this).data('time')!=true) {
					showForecast();
				} else if (event.scale > 1 && settings!=true) {
					$(this).removeClass('transparent');
					icon.removeAttr('style');
					info.removeAttr('style');
					reveal1.removeAttr('style');
					reveal2.removeAttr('style');
					pagination.removeAttr('style')
				}
			});
		}
	}
});