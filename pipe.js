function timeStamp() {
	var now = new Date();
	var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()]; 
	var suffix = (time[0] < 12) ? "AM" : "PM";
	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
	time[0] = time[0] || 12;
	for (var i = 1; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}
	return date.join("/") + " " + time.join(":") + " " + suffix;
}

var create_cookie = function(stage) {
	var expires = "";
	document.cookie = "stage="+stage+expires+"; path=/";
}

var read_cookie = function() {
	var nameEQ = "stage=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return 'null';
}
var stages = {
	pre: 5,
	stuff: 34,
	post: 5,
	empty:13,
	done:5
}
var current_stage = "pre";
var preload_images = function() {
	var pre_image = new Image();
	for(var stage in stages) {
		for(var i = 1; i <= stages[stage]; i++) {
			pre_image.src = "images/" +  stage + "/out" + i + ".jpeg";
			console.log("preload");
		}
	}
	document.getElementById("loading").style.display = "none";
	document.getElementById("loading-text").style.display = "none";
	document.getElementById("webcam").style.display = "block";
}

var update_time = function(context) {	
	context.rect(0, 460, 640, 40);
	context.fillStyle = "#000000";
	context.fill();
	context.font = "18pt Calibri";
	context.fillStyle = "white";
	context.fillText(timeStamp(), 10, 487);
	context.fillStyle = "#00FF00";
	context.font = "15pt Calibri";
	context.fillText("Live", 10, 20);
}

var image = new Image();
var load_image = function(context, image_path) {
	image.src = image_path;
	image.onload = function() {
		context.drawImage(image, 0, 0);
		update_time(context);
	}
}
var still_num = 1;
var feed_controller = function(context) {
	var interval = window.setInterval(function() {
		load_image(context, "images/" + current_stage + "/out" + still_num + ".jpeg");
		still_num++;
		if(still_num > stages[current_stage]) {
			if(current_stage == "stuff") {
				current_stage = "post";
				document.getElementById("stuff").disabled = false;
				document.getElementById("stuff").innerHTML = "UNSTUFF MY PIPE";
				set_cookie(current_stage);
			}
			if(current_stage == "empty") {
				document.getElementById("stuff").innerHTML = "REQUEST SENT";
				current_stage = "done";
				set_cookie(current_stage);
			}
			still_num = 1;
		}	
	}, 1400);
}
var init_canvas = function() {
	var webcam_canvas = document.getElementById("webcam");
	var context = webcam_canvas.getContext("2d");
	preload_images();
	console.log(read_cookie());

	if(read_cookie() !== 'null') {
		current_stage = read_cookie();
	}
	console.log(current_stage);
	feed_controller(context);
}

var send_stuff_request = function() {
	document.getElementById("stuff").disabled = true;
	document.getElementById("stuff").onclick = function() { send_unstuff_request(); };
	document.getElementById("stuff").innerHTML = "SENDING REQUEST . . .";
	setTimeout(function() {
		still_num = 1;
		current_stage = "stuff";
	}, Math.floor(Math.random()*10000)+7500);
}

var send_unstuff_request = function() {
	document.getElementById("stuff").disabled = true;
	document.getElementById("stuff").innerHTML = "SENDING REQUEST . . .";
	setTimeout(function() {
		still_num = 1;
		current_stage = "empty";
	}, Math.floor(Math.random()*10000)+7500);
}

window.onload = init_canvas;
