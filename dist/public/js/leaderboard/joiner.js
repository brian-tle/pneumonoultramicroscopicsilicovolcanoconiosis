class Joiner {
	constructor() {
		this.container1 = new Rectangle(0, 0, SCREENWIDTH / 3, SCREENHEIGHT);
		this.container2 = new Rectangle(SCREENWIDTH / 3, 0, SCREENWIDTH / 3, SCREENHEIGHT);
		this.container3 = new Rectangle(SCREENWIDTH * (2 / 3), 0, SCREENWIDTH / 3, SCREENHEIGHT);
		this.containerText1 = new TextObject("Top", 50, 0xFF7FBF, this.container1.x + (this.container1.width / 2), 48);
		this.containerText3 = new TextObject("Rising", 50, 0xFF7FBF, this.container3.x + (this.container3.width / 2), 48);
		this.leaderboardText = new TextObject("Leaderboard", 96, 0xFF7FB6, SCREENWIDTH / 2, 48);

		this.initializeIntro();
	}

	update(elapsedTimeS) {
		this.updateIntro(elapsedTimeS);
	}

	draw() {
		drawRectOutline(0, 0, SCREENWIDTH, SCREENHEIGHT, 0x000000, 20);
		drawLine(SCREENWIDTH * 0.3, 90, SCREENWIDTH * 0.7, 90, 0x000000, 10);
		drawLine(SCREENWIDTH * 0.3, 0, SCREENWIDTH * 0.3, 95, 0x000000, 10);
		drawLine(SCREENWIDTH * 0.7, 0, SCREENWIDTH * 0.7, 95, 0x000000, 10);
		drawLine(SCREENWIDTH / 3, 90, SCREENWIDTH / 3, SCREENHEIGHT - 10, 0x000000, 10);
		drawLine(SCREENWIDTH / 3, 90, SCREENWIDTH / 3, SCREENHEIGHT - 10, 0x000000, 10);
		drawLine(SCREENWIDTH * (2 / 3), 90, SCREENWIDTH * (2 / 3), SCREENHEIGHT - 10, 0x000000, 10);
	}

	initializeIntro() {
		this.doorLeft = new Door('img/leaderboard/door_left.png', 0);
		this.gearLeftTop = new Gear('img/leaderboard/door_gear.png', 5, 0);
		this.gearLeftBottom = new Gear('img/leaderboard/door_gear.png', 5, SCREENHEIGHT);

		this.doorRight = new Door('img/leaderboard/door_right.png', SCREENWIDTH / 2);
		this.gearRightTop = new Gear('img/leaderboard/door_gear.png', SCREENWIDTH - 5, 0);
		this.gearRightBottom = new Gear('img/leaderboard/door_gear.png', SCREENWIDTH - 5, SCREENHEIGHT);

		this.vaultBarLeft = new VaultBar('img/leaderboard/vault_bar.png', (SCREENWIDTH / 2) - 80, 0);
		this.vaultBarRight = new VaultBar('img/leaderboard/vault_bar.png', (SCREENWIDTH / 2) + 50, 0);

		this.vaultLockLeftTop = new VaultLock('img/leaderboard/vault_lock.png', (SCREENWIDTH / 2) - 85, 0);
		this.vaultLockLeftTop2 = new VaultLock('img/leaderboard/vault_lock_2.png', (SCREENWIDTH / 2) - 85, 40);
		this.vaultLockLeftBottom = new VaultLock('img/leaderboard/vault_lock.png', (SCREENWIDTH / 2) - 85, SCREENHEIGHT - 40);
		this.vaultLockRightTop = new VaultLock('img/leaderboard/vault_lock.png', (SCREENWIDTH / 2) + 45, 0);
		this.vaultLockRightBottom = new VaultLock('img/leaderboard/vault_lock.png', (SCREENWIDTH / 2) + 45, SCREENHEIGHT - 40);
		this.vaultLockRightBottom2 = new VaultLock('img/leaderboard/vault_lock_3.png', (SCREENWIDTH / 2) + 45, SCREENHEIGHT - 80);

		this.valve = new Valve('img/leaderboard/valve.png', SCREENWIDTH / 2, SCREENHEIGHT / 2);

		this.confetti = new Confetti('img/leaderboard/confetti.png');
		this.confetti.generate(30);

		this.introStep = -1;
		this.introTimer = 0;
	}

	updateIntro(elapsedTimeS) {
		if (this.introStep == -1) {
			if (this.introTimer > 0.8) {
				this.introStep += 1;
				this.introTimer = 0;
			}
			else {
				this.introTimer += elapsedTimeS;
			}
		}

		if (this.introStep == 0) {
			if (this.introTimer > 1.035) {
				this.introStep += 1;
				this.introTimer = 0;
			}
			else {
				this.introTimer += elapsedTimeS;
				this.valve.spinCounterClockwise(elapsedTimeS, 6);
			}
		}

		if (this.introStep == 1) {
			if (this.vaultBarLeft.sprite.y + this.vaultBarLeft.sprite.height > 135) {
				this.vaultBarLeft.slideUp(elapsedTimeS, 1000);
				this.vaultBarRight.slideDown(elapsedTimeS, 1000);
			}
			else {
				this.introStep += 1;
			}
		}

		if (this.introStep == 2) {
			if (this.introTimer > 0.3) {
				this.introStep += 1;
				this.introTimer = 0;
			}
			else {
				this.introTimer += elapsedTimeS;
			}
		}

		if (this.introStep == 3) {
			this.confetti.update(elapsedTimeS);

			if (this.doorLeft.sprite.x + this.doorLeft.sprite.width > 0) {
				this.doorLeft.slideLeft(elapsedTimeS, 500);
				this.vaultBarLeft.slideLeft(elapsedTimeS, 500);
				this.vaultLockLeftBottom.slideLeft(elapsedTimeS, 500);
				this.vaultLockLeftTop.slideLeft(elapsedTimeS, 500);
				this.vaultLockLeftTop2.slideLeft(elapsedTimeS, 500);
				this.doorRight.slideRight(elapsedTimeS, 500);
				this.vaultBarRight.slideRight(elapsedTimeS, 500);
				this.vaultLockRightBottom.slideRight(elapsedTimeS, 500);
				this.vaultLockRightBottom2.slideRight(elapsedTimeS, 500);
				this.vaultLockRightTop.slideRight(elapsedTimeS, 500);
			}

			if (this.valve.sprite.x + this.valve.sprite.width > 0) {
				this.gearLeftTop.spinClockwise(elapsedTimeS, 2.5);
				this.gearLeftBottom.spinCounterClockwise(elapsedTimeS, 2.5);
				this.gearRightTop.spinCounterClockwise(elapsedTimeS, 2.5);
				this.gearRightBottom.spinClockwise(elapsedTimeS, 2.5);
				this.valve.slideLeft(elapsedTimeS, 500);
			}
		}
	}
}