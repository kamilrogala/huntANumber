/*jshint esversion:6,browser:true,devel: true*/
const canvas = document.querySelector('canvas');
const cLeft = canvas.offsetLeft;
const cTop = canvas.offsetTop;
const ctx = canvas.getContext('2d');
const arcRadius = 75;
let roundTime, roundNumber, number, time;
roundNumber = 0;
let actualLives, startLives;
startLives = actualLives = 3;
const imageObj = new Image();
imageObj.src = 'https://lab.kamilrogala.it/huntANumber/assets/heart.png';
const win = new Audio('https://lab.kamilrogala.it/huntANumber/assets/win.mp3');
const failed = new Audio('https://lab.kamilrogala.it/huntANumber/assets/fail.mp3');
const timeout = new Audio('https://lab.kamilrogala.it/huntANumber/assets/timeout.mp3');
win.volume = failed.volume = timeout.volume = 0.5;
canvas.addEventListener('click', function (e) {
	let clickX = e.pageX - cLeft;
	let clickY = e.pageY - cTop;
	if (canvas.classList.contains('gameActive')) {
		if (Math.pow(clickX - canvas.width / 2 - arcRadius / 4 + cLeft * 2, 2) + Math.pow(clickY - canvas.height / 2 - arcRadius / 4 + cTop * 2, 2) < Math.pow(arcRadius, 2)) {
			ctx.fillStyle = '#de3636';
			ctx.arc(canvas.width / 2, canvas.height / 2, arcRadius, 0, 2 * Math.PI);
			ctx.fill();
			if (time === number) {
				canvas.classList.remove('gameActive');
				canvas.classList += ' roundEnded';
				winDraw(++roundNumber);
				clearInterval(roundTime);
			} else {
				canvDraw(number, time);
				if (actualLives < 1) {
					canvas.classList.remove('gameActive');
					canvas.classList += ' fail';
					clearInterval(roundTime);
					fail(roundNumber);
				} else {
					--actualLives;
					clearInterval(roundTime);
					if (actualLives > 0) {
						timeout.play();
					}
					game(roundNumber, actualLives);
				}

			}
		}
	} else if (canvas.classList.contains('roundEnded')) {
		if (clickX >= 176 && clickX <= 325 && clickY >= 345 && clickY <= 414) {
			if (actualLives > 0) {
				game(roundNumber, actualLives);
			}
		}
	} else if (canvas.classList.contains('fail')) {
		if (clickX >= 176 && clickX <= 325 && clickY >= 345 && clickY <= 414) {
			game(roundNumber, actualLives);
		}
	} else {
		if (clickX >= 140 && clickX <= 360 && clickY >= 365 && clickY <= 435) {
			game(roundNumber, actualLives);
		}
	}
}, false);

const winDraw = function (round) {
	win.play();
	ctx.fillStyle = '#2f2f2f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#15b900';
	ctx.fillRect(canvas.width / 2 - 75, 345, 150, 70);

	ctx.font = "45px 'Arial', sans-serif";
	ctx.fillStyle = '#fff';
	ctx.textAlign = "center";
	ctx.fillStyle = '#15b900';
	ctx.fillText(`WYGRANA!`, canvas.width / 2, 100);
	ctx.fillStyle = '#fff';
	ctx.fillText(`Runda ${round} zakończona!`, canvas.width / 2, 175);
	ctx.fillText(`Grasz dalej?`, canvas.width / 2, 305);
	ctx.font = "65px 'Arial', sans-serif";
	ctx.fillText(`TAK`, canvas.width / 2, 405);

};
const fail = function (round) {
	failed.play();
	actualLives = startLives;
	roundNumber = 0;
	ctx.fillStyle = '#2f2f2f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#15b900';
	ctx.fillRect(canvas.width / 2 - 75, 345, 150, 70);

	ctx.font = "45px 'Arial', sans-serif";
	ctx.fillStyle = '#fff';
	ctx.textAlign = "center";
	ctx.fillStyle = '#b40000';
	ctx.fillText(`PRZEGRANA!`, canvas.width / 2, 100);
	ctx.fillStyle = '#fff';
	ctx.fillText(`Pokonała Cię runda ${round}`, canvas.width / 2, 175);
	ctx.fillText(`Grasz dalej?`, canvas.width / 2, 305);
	ctx.font = "65px 'Arial', sans-serif";
	ctx.fillText(`TAK`, canvas.width / 2, 405);

};
const canvDraw = function (numb, time) {
	ctx.fillStyle = '#2f2f2f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#b40000';
	ctx.arc(canvas.width / 2, canvas.height / 2, arcRadius, 0, 2 * Math.PI);
	ctx.fill();

	ctx.font = "25px 'Arial', sans-serif";
	ctx.fillStyle = '#fff';
	ctx.textAlign = "center";
	ctx.fillText('Ustrzel', canvas.width / 2, 245);
	ctx.fillText('numer!', canvas.width / 2, 275);
	ctx.font = "45px 'Arial', sans-serif";
	ctx.fillText(numb, canvas.width / 2, 145);
	ctx.fillText(time, canvas.width / 2, canvas.height - 105);

	for (let i = 1; i <= actualLives; ++i) {
		ctx.drawImage(imageObj, canvas.width - 30 * i, 25);
	}
};

const game = function (round, lives = 3) {

	if (canvas.classList.contains('start')) {
		canvas.classList.remove('start');
	} else if (canvas.classList.contains('roundEnded')) {
		canvas.classList.remove('roundEnded');
	} else if (canvas.classList.contains('fail')) {
		canvas.classList.remove('fail');
	}
	if (actualLives > 0) {
		canvas.classList += ' gameActive';
		number = Math.floor(Math.random() * 7) + 1;
		time = 11;
		let difficult = 50 * round;
		roundTime = setInterval(function () {
			time--;
			if (time < 0) {
				canvas.classList.remove('gameActive');
				canvas.classList += ' fail';
				--actualLives;
				clearInterval(roundTime);
				if (actualLives < 1) {
					fail(round);
				} else {
					timeout.play();
					game(round, actualLives);
				}
			} else {
				canvDraw(number, time);
			}
		}, (1000 - difficult));
	} else {
		canvas.classList.remove('gameActive');
		canvas.classList += ' fail';
		clearInterval(roundTime);
		fail(round);
	}
};

document.addEventListener('DOMContentLoaded', function () {
	document.body.style.margin = 0;
	canvas.style.cursor = 'pointer';
	const bottom = document.querySelector('.bottom');
	bottom.style.position = 'fixed';
	bottom.style.bottom = bottom.style.left = '10px';
	bottom.querySelector('img').style.maxWidth = '250px';

	canvas.classList += ' start';

	ctx.fillStyle = '#2f2f2f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#15b900';
	ctx.fillRect(canvas.width / 2 - 110, 365, 220, 70);

	ctx.font = "65px 'Arial', sans-serif";
	ctx.fillStyle = '#fff';
	ctx.textAlign = "center";
	ctx.fillText('Upoluj numer', canvas.width / 2, 100);

	ctx.font = "50px 'Arial', sans-serif";
	ctx.fillText(`Zaczynamy?`, canvas.width / 2, 330);

	ctx.font = "65px 'Arial', sans-serif";
	ctx.fillText(`START`, canvas.width / 2, 425);

	ctx.textAlign = "left";
	ctx.font = "30px 'Arial', sans-serif";
	ctx.fillText('Zadanie jest proste:', 25, 155);
	ctx.fillText('kliknij czerwony button gdy zegar', 25, 190);
	ctx.fillText('pokaże wylosowaną liczbę.', 25, 220);
	ctx.font = "20px 'Arial', sans-serif";
	ctx.fillText('Legenda głosi, że nikt nie dotrwał do 18 rundy...', 25, 260);
});
