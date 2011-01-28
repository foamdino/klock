FONT_NAME = "'Futura'";

HOUR_R = 320;
HOUR_SIZE = 80;
HOUR_COL = '#422';
HOUR_HL = '#fff';

MIN_SIZE = 45;
MIN_R = HOUR_R - MIN_SIZE - 10;
MIN_COL = HOUR_COL;
MIN_HL = HOUR_HL;

SEC_SIZE = 25;
SEC_R = MIN_R - SEC_SIZE - 10;
SEC_COL = HOUR_COL;
SEC_HL = HOUR_HL;

HAND_COL = HOUR_COL; //'rgba(128,0,0,0.4)';
HAND_WIDTH = 1;
HAND_LENGTH = MIN_R + 5;
HAND_OFFSET = 50;

SECONDS_TICK = true;
SECONDS_VISIBLE = true;
HOUR_24 = false;
HOUR_FIXED = false;

function togglePreferences() {
	prefs = document.getElementById('prefs');
	button = document.getElementById('prefs-button');
	if (prefs.style.display=='none') {
		prefs.style.display='';
		button.innerHTML = 'Hide Preferences'
	} else {
		prefs.style.display='none';
		button.innerHTML = 'Show Preferences'
	}
}

function setColours(hc, hhl, mc, mhl, sc, shl, hand) {
	HOUR_COL = hc;
	HOUR_HL  = hhl;
	MIN_COL  = mc   || hc;
	MIN_HL   = mhl  || hhl;
	SEC_COL  = sc   || hc;
	SEC_HL   = shl  || hhl;
	HAND_COL = hand || hc;
}

function setFont(fontName) {
    FONT_NAME = fontName;
}

function secondsTick(value) {
    secondsVisible(true);
    SECONDS_TICK = value;
}

function secondsVisible(value) {
    SECONDS_VISIBLE = value;
}

function hour24(value) {
    HOUR_24 = value;
}

function hourFixed(value) {
    HOUR_FIXED = value;
}

function startClock() {
	togglePreferences();
	var canvas = document.getElementById('clock');
	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var r = (w > h ? h/2 : w/2) - 5;
	var centre = {'x':w/2, 'y':h/2};
	tick(ctx, centre);
}

function tick(ctx, centre) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var s = time.getSeconds();
	var ms = time.getMilliseconds();
	s += ms / 1000;
	m += s / 60;
	h += m / 60;
    if (HOUR_24) {
        var handAng = 360 * (h/24);
    } else {
        if (h>12) h-= 12;
        var handAng = 360 * (h/12);
    }
	ctx.clearRect(0,0,800,800);
	drawHours(ctx, centre, h, handAng);
	drawMinutes(ctx, centre, m, handAng);
	if (SECONDS_VISIBLE) 
        drawSeconds(ctx, centre, s, handAng);
	drawHand(ctx, centre, handAng);
	if (SECONDS_TICK || !SECONDS_VISIBLE)
	    setTimeout(function(){tick(ctx, centre)}, 1000 - ms - (new Date() - time));
	else
	    setTimeout(function(){tick(ctx, centre)}, 15);
}

function rAngToXY(r, angDeg) {
	var angRad = degToRad(angDeg - 90);
	var y = Math.sin(angRad) * r;
	var x = Math.cos(angRad) * r;
	return {'x':x, 'y':y}
}

function degToRad(angDeg) {
	return  Math.PI * 2 * angDeg / 360;
}

function prepCanvas(ctx, r, angDeg) {
	var point = rAngToXY(r, angDeg);
	ctx.translate(point.x, point.y);
	var angRad = degToRad(angDeg);
	ctx.rotate(angRad);
}

function drawNumberRing(ctx, centre, args) {
	ctx.save();
	ctx.textAlign = "center";
	normFont = args.fontSize + "px " + args.fontName; 
	smallFont = "20px " + args.fontName; 
	ctx.font = normFont;
	ctx.translate(centre.x, centre.y);
	for (var num = args.min; num<= args.max; num++) {
		var ang = (360/(args.max-args.min+1) * (num + args.numOffset || 0)) + (args.angOffset || 0);
		ctx.save();
		prepCanvas(ctx, args.r, ang);
		var text = num;
		ctx.font = normFont;
		if (args.numberEvery) {
			if (num == args.currentNum)
				text = num
			else if ((num % args.numberEvery == 0) 
				&& num != args.currentNum - 1 
				&& num != args.currentNum + 1 
				&! (args.currentNum == args.max && num == args.min))
				text = num
			else {
				text = "";
				ctx.font = smallFont;
			}
		}
		if (args.fontHightlight && num == args.currentNum) {
			ctx.fillStyle = args.fontHightlight;
		} else {
			ctx.fillStyle = args.fontColour;
		}
		ctx.fillText(text, 0, 0);
     	ctx.font = smallFont;
		ctx.fillStyle = args.fontColour;
		ctx.fillText('.', 0, 10);
		ctx.restore();
	}
	ctx.restore();
}

function drawLine(ctx, startX, startY, endX, endY) {
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

function drawHandLine(ctx, endX, vOffset) {
	drawLine(ctx, -HAND_OFFSET, vOffset, endX, vOffset);
	if (vOffset > 0) drawLine(ctx, -HAND_OFFSET, -vOffset, endX, -vOffset);
}

function drawHand(ctx, centre, ang) {
	ctx.save()
	ctx.strokeStyle = HAND_COL;
	ctx.lineWidth = HAND_WIDTH;
	ctx.translate(centre.x, centre.y);
	ctx.save();
	if (HOUR_FIXED) ang = 0;
	ctx.rotate(degToRad(ang-90));
	
	drawHandLine(ctx, HOUR_R - 10, 0); 
//	drawHandLine(ctx, MIN_R - 2, 3); 
	drawHandLine(ctx, HAND_OFFSET, 6); 

	ctx.restore();
	ctx.fillStyle = HAND_COL;
	ctx.beginPath();
	ctx.arc(0, 0, 2, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.restore();
	
}

function drawMinutes(ctx, centre, currentMinutes, handAng) {
	drawNumberRing(ctx, centre, {
		'fontColour': MIN_COL,
		'fontHightlight': MIN_HL,
		'fontSize': MIN_SIZE,
		'fontName': FONT_NAME,
		'min': 0,
		'max': 59,
		'numOffset': -currentMinutes,
		'angOffset': HOUR_FIXED ? 0 : handAng,
		'r': MIN_R,
		'numberEvery': 5,
		'currentNum': parseInt(currentMinutes)
	});
}
function drawSeconds(ctx, centre, currentSeconds, handAng) {
	drawNumberRing(ctx, centre, {
		'fontColour': SEC_COL,
		'fontSize': SEC_SIZE,
		'fontName': FONT_NAME,
		'min': 0,
		'max': 59,
		'numOffset': -currentSeconds,
		'angOffset': HOUR_FIXED ? 0 : handAng,
		'r': SEC_R,
		'numberEvery': 5,
//		'fontHightlight': SEC_HL,
//		'currentNum': parseInt(currentSeconds)
	});
}
function drawHours(ctx, centre, currentHour, handAng) {
	if (!HOUR_24 && currentHour < 1) currentHour += 12;
	drawNumberRing(ctx, centre, {
		'fontColour': HOUR_COL,
		'fontHightlight': HOUR_HL,
		'fontSize': HOUR_SIZE,
		'fontName': FONT_NAME,
		'min': HOUR_24 ? 0 : 1,
		'max': HOUR_24 ? 23 : 12,
		'numberEvery': HOUR_24 ? 3 : false,
		'numOffset': HOUR_FIXED ? -currentHour : 0,
		//'angOffset': HOUR_FIXED ? 0 : handAng,
		'r': HOUR_R,
		'currentNum': parseInt(currentHour)
	});
}