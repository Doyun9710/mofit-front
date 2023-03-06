import "phaser";
import {
    isPhaserGameStart,
    gameTimePassed,
    gameTimeTotal,
    mySquart,
    heSquart
} from "../openvidu/OpenviduComponent";
import {gameTimePassed2} from "@/components/openvidu/OpenviduComponent";


//통신


export default class Main extends Phaser.Scene {
    gameHasNotStarted = true;
    loadingText;
    player1;
    player2;
    player1Attack = false;
    player2Attack = false;
    player1Attacked = false;
    player2Attacked = false;
    player1InputTime;
    player2InputTime;
    player1Press = false;
    player2Press = false;

    player1CountTempSave = 0;
    player2CountTempSave = 0;

    touch = false;

    inputTimeDelay = 0.5;
    name;
    backGround_Gameboy;
    backgroundCity;
    ground;
    punchSound;
    fightBgm;
    waitBgm;
    bee;
    ding;
    start;
    noDisplay;
    number;
    countdown = 5;
    player1Number100;
    player1Number10;
    player1Number1;
    player2Number100;
    player2Number10;
    player2Number1;
    timeBar;
    timeText;
    playerFire;

    playerBackground;

    constructor() {
        super();

    }

    preload() {
        // 로딩 하기
        this.loadingText = this.make.text({
            x: 1900 / 2,
            y: (1000 / 2) + 175,
            text: '0%',
            style: {
                font: '100px monospace',
                fill: '#000000'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => { // arrow function으로 변경
            this.loadingText.text = `${Math.round(value * 100)}%`; // Math.round 수정
        });

        this.load.on('complete', () => { // arrow function으로 변경
            this.loadingText.destroy();
        });


        // 플레이어
        let char = ["biker.png", 'cyber.png', 'punk.png']
        const num1 = Math.random()
        let random1;
        if (num1 < 0.33) {
            random1 = char[0]
            char.splice(0, 1)
        } else if (num1 < 0.66) {
            random1 = char[1]
            char.splice(1, 1)

        } else {
            random1 = char[2]
            char.splice(2, 1)

        }
        const num2 = Math.random()
        let random2;
        if (num2 < 0.5) {
            random2 = char[0]
        } else {
            random2 = char[1]
        }
        this.load.spritesheet(
            "player1",
            `../assets/characters/${random1}`,
            {frameWidth: 48, frameHeight: 48}
        )
        this.load.spritesheet(
            "player2",
            `../assets/characters/${random2}`,
            {frameWidth: 48, frameHeight: 48}
        )
        this.load.spritesheet(
            "displayDisable",
            '../assets/notStart.png',
            {frameWidth: 467, frameHeight: 262}
        )
        this.load.spritesheet(
            "numbers",
            '../assets/numbers.png',
            {frameWidth: 130, frameHeight: 150}
        )
        this.load.spritesheet(
            "fire",
            '../assets/fire.png',
            {frameWidth: 192, frameHeight: 32}
        )
        this.load.image('backGround_Gameboy', '../assets/gameboy.png')
        this.load.image('backgroundCityImage', '../assets/backgroundCity.png')
        this.load.image('ground', '../assets/ground.webp')
        this.load.audio('punch', ['../assets/sound/punch.mp3'])
        this.load.audio('fight', ['../assets/sound/fightBGM.mp3'])
        this.load.audio('wait', ['../assets/sound/waitBGM.mp3'])
        this.load.audio('bee', ['../assets/sound/bee.mp3'])
        this.load.audio('ding', ['../assets/sound/ding.mp3'])
        this.load.audio('start', ['../assets/sound/start.mp3'])


    }


    create() {
        this.playerBackground = this.add.graphics();

        this.timeBar = this.add.graphics().setDepth(1);

        this.timeText = this.add
            .text(600, 40,
                "TIME LEFT:",
                {color: "#ffffff", fontSize: "55px", fontFamily: 'dalmoori'}
            )
            .setDepth(1)
        this.timeBar.visible = false;
        this.timeText.visible = false;


        this.punchSound = this.sound.add('punch');
        this.fightBgm = this.sound.add('fight');
        this.waitBgm = this.sound.add('wait');
        this.bee = this.sound.add('bee');
        this.ding = this.sound.add('ding');
        this.start = this.sound.add('start');

        this.waitBgm.play();

        this.backGround_Gameboy = this.add.image(950, 480, 'backGround_Gameboy')
            .setOrigin(0.5, 0.5)
            .setScale(1.6);
        this.backgroundCity = this.add.image(950, 370, 'backgroundCityImage').setScale(1.06, 1.15)
        this.ground = this.add.image(950, 593, 'ground').setScale(1.06, 1.4).setScale(0.85, 1)


        this.player2 = this.physics.add.sprite(1090, 430, 'player2')
            .setScale(5)
            .toggleFlipX();
        this.player1 = this.physics.add.sprite(820, 430, 'player1').setScale(5);
        this.name = this.add
            .text(this.player1.x - 80, this.player1.y - 80,
                "PLAYER",
                {color: "#000000", fontSize: "20px"}
            )
        //player1
        this.anims.create({
            key: 'player1_idle',
            frames: this.anims.generateFrameNumbers('player1', {start: 56, end: 59}),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'player1_run',
            frames: this.anims.generateFrameNumbers('player1', {start: 80, end: 85}),
            frameRate: 20,
            repeat: 0,
        });


        this.anims.create({
            key: 'player1_attack1',
            frames: this.anims.generateFrameNumbers('player1', {start: 8, end: 15}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack2',
            frames: this.anims.generateFrameNumbers('player1', {start: 16, end: 23}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack3',
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 5}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack4',
            frames: this.anims.generateFrameNumbers('player1', {start: 72, end: 77}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_hurt',
            frames: this.anims.generateFrameNumbers('player1', {start: 48, end: 49}),
            frameRate: 10,
            repeat: 3,
        });
        //player2
        this.anims.create({
            key: 'player2_idle',
            frames: this.anims.generateFrameNumbers('player2', {start: 56, end: 59}),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'player2_run',
            frames: this.anims.generateFrameNumbers('player2', {start: 80, end: 85}),
            frameRate: 20,
            repeat: 0,
        });


        this.anims.create({
            key: 'player2_attack1',
            frames: this.anims.generateFrameNumbers('player2', {start: 8, end: 15}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack2',
            frames: this.anims.generateFrameNumbers('player2', {start: 16, end: 23}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack3',
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 5}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack4',
            frames: this.anims.generateFrameNumbers('player2', {start: 72, end: 77}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_hurt',
            frames: this.anims.generateFrameNumbers('player2', {start: 48, end: 49}),
            frameRate: 10,
            repeat: 3,
        });
        this.noDisplay = this.add.sprite(950, 410, 'displayDisable')
            .setOrigin(0.5, 0.5)
            .setScale(1.31, 1.75);
        this.anims.create({
            key: 'beforeStart',
            frames: this.anims.generateFrameNumbers('displayDisable', {start: 0, end: 1}),
            frameRate: 20,
            repeat: -1,
        });

        this.playerFire = this.add.sprite(280, 930, 'fire')
            .setOrigin(0.5, 0.5)
            .setScale(1.8, 3)
            .setDepth(1)
            .setVisible(false);

        this.anims.create({
            key: 'player_fire',
            frames: this.anims.generateFrameNumbers('fire', {start: 0, end: 3}),
            frameRate: 15,
            repeat: 0,
        });

        this.noDisplay.anims.play('beforeStart')
        this.number = this.add.sprite(950, 410, 'numbers').setVisible(false);
        this.player1Number10 = this.add.sprite(280, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player1Number100 = this.add.sprite(this.player1Number10.x - 110, this.player1Number10.y, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player1Number1 = this.add.sprite(this.player1Number10.x + 110, this.player1Number10.y, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number10 = this.add.sprite(1640, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number100 = this.add.sprite(this.player2Number10.x - 110, this.player2Number10.y, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number1 = this.add.sprite(this.player2Number10.x + 110, this.player2Number10.y, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
    }


    update(time, delta) {
        let currentGameTime = (gameTimeTotal - gameTimePassed - 5) / (gameTimeTotal)
        if (currentGameTime < 0) {
            currentGameTime = 0
        } else if (currentGameTime > 1) {
            currentGameTime = 1
        }
        this.timeBar.clear();
        this.timeBar.fillStyle(0xff0000, 1);
        this.timeBar.fillRect(880, 38, 420 * currentGameTime, 55);


        const r = Math.floor(Math.sin(Date.now() / 1000) * 127 + 128);
        const g = Math.floor(Math.sin(Date.now() / 2000) * 127 + 128);
        const b = Math.floor(Math.sin(Date.now() / 3000) * 127 + 128);


        const cursors = this.input.keyboard.createCursorKeys();
        if (mySquart > heSquart) {
            this.playerFire.x = 280;
            this.playerFire.visible = true;
            this.playerFire.anims.play('player_fire', true)
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(0, 0, 570, 1000);
        } else if (mySquart < heSquart) {
            this.playerFire.x = 1640;
            this.playerFire.visible = true;
            this.playerFire.anims.play('player_fire', true)
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(1330, 0, 570, 1000);
        }


        if (mySquart != this.player1CountTempSave && (time - this.player1InputTime) > this.inputTimeDelay * 1000) {
            this.ding.play();
            this.player1CountTempSave = mySquart;
            this.player1InputTime = time;
            this.player1Press = true;
        } else {
            this.player1Press = false;
        }
        if (heSquart != this.player2CountTempSave && (time - this.player2InputTime) > this.inputTimeDelay * 1000) {
            this.ding.play();
            this.player2CountTempSave = heSquart;
            this.player2InputTime = time;
            this.player2Press = true;
        } else {
            this.player2Press = false;
        }


        if (isPhaserGameStart && this.gameHasNotStarted) {
            this.gameHasNotStarted = false;
            this.timeBar.visible = true;
            this.timeText.visible = true;
            this.noDisplay.destroy();
            this.countDown.call(this);
        }


        this.name.setPosition(this.player1.x - 80, this.player1.y - 80)

        if (this.player1.x < 750) {
            this.player1.x = 750
        }
        if (this.player2.x > 1170) {
            this.player2.x = 1170
        }

        if (this.player2Attacked) {
            this.player2.body.velocity.x -= 50;
            this.player2.anims.play('player2_hurt', false)
            if (this.player2.body.velocity.x < 0) {
                this.player2Attacked = false;
            }
        }
        if (this.player1Attacked) {
            this.player1.body.velocity.x += 50;
            this.player1.anims.play('player1_hurt', false)
            if (this.player1.body.velocity.x > 0) {
                this.player1Attacked = false;
            }
        }

        if (this.player2.x - this.player1.x < 0) {
            this.player2.setVelocity(0);
            this.player1.setVelocity(0);
            this.player1.x = this.player2.x - 1
            this.player2.x = this.player1.x + 1


        }
        if (this.player2.x - this.player1.x < 40) {
            this.touch = true;
            this.attackDetector();
        } else {
            this.touch = false
        }
        this.player1.on("animationcomplete", () => {
            this.player1.anims.play('player1_idle', true);
        });
        this.player2.on("animationcomplete", () => {
            this.player2.anims.play('player2_idle', true);
        });

        //player1 이동
        if (this.player1Press && this.touch) {
            this.player1Attack = true;
            this.punchSound.play();
            const number = Math.random()
            if (number < 0.25) {
                this.player1.anims.play('player1_attack1', true);
            } else if (number < 0.5) {
                this.player1.anims.play('player1_attack2', true);
            } else if (number < 0.75) {
                this.player1.anims.play('player1_attack3', true);
            } else {
                this.player1.anims.play('player1_attack4', true);
            }
        } else if (this.player1Press && !this.touch) {
            this.player1.body.velocity.x = 300;
            this.player1.anims.play('player1_run', true);
        } else {
            if (this.player1.body.velocity.x > 0 && !this.player1Attacked) {
                this.player1.body.velocity.x -= 10;
            } else if (!this.player1Attacked) {
                this.player1.body.velocity.x = 0
            }
            this.player1Attack = false;
        }
        // player2
        if (this.player2Press && this.touch) {
            this.player2Attack = true;
            this.punchSound.play();
            const number = Math.random();
            if (number < 0.25) {
                this.player2.anims.play('player2_attack2', true);
            } else if (number < 0.5) {
                this.player2.anims.play('player2_attack1', true);
            } else if (number < 0.75) {
                this.player2.anims.play('player2_attack3', true);
            } else {
                this.player2.anims.play('player2_attack4', true);

            }

        } else if (this.player2Press && !this.touch) {
            this.player2.body.velocity.x = -300;
            this.player2.anims.play('player2_run', true);
        } else {
            if (this.player2.body.velocity.x < 0 && !this.player2Attacked) {
                this.player2.body.velocity.x += 10;
            } else if (!this.player2Attacked) {
                this.player2.body.velocity.x = 0
            }
            this.player2Attack = false;
        }

        this.player1Number100.setFrame(Math.floor(mySquart / 100))
        this.player1Number10.setFrame(Math.floor((mySquart % 100) / 10))
        this.player1Number1.setFrame(Math.floor(mySquart % 10))

        this.player2Number100.setFrame(Math.floor(heSquart / 100))
        this.player2Number10.setFrame(Math.floor((heSquart % 100) / 10))
        this.player2Number1.setFrame(Math.floor(heSquart % 10))

        // 이것은 키보드로하는 테스트 용입니다.
        // if (cursors.right.isDown && (time - this.player1InputTime) > this.inputTimeDelay * 1000) {
        //     this.player1InputTime = time;
        //     this.player1Press = true;
        // } else {
        //     this.player1Press = false;
        // }
        // if (cursors.left.isDown && (time - this.player2InputTime) > this.inputTimeDelay * 1000) {
        //     this.player2InputTime = time;
        //     this.player2Press = true;
        // } else {
        //     this.player2Press = false;
        // }


    }


    attackDetector() {
        if (this.player1Attack && this.player2Attack) {
            return
        } else if (this.player1Attack && !this.player2Attack) {
            //player1 attack!
            this.player2Attacked = true;
            this.player2.body.velocity.x = 700;
        } else if (!this.player1Attack && this.player2Attack) {
            // player2 attack
            this.player1Attacked = true;
            this.player1.body.velocity.x = -700;

        }
    }

    countDown() {
        if (this.countdown === 0) {
            this.start.play();
            this.number.visible = false;
            this.player1InputTime = 0;
            this.player2InputTime = 0;

            this.waitBgm.destroy();
            this.fightBgm.play()
            return;
        }
        this.bee.play();
        this.number.destroy();
        this.number = this.add.sprite(950, 410, 'numbers').setFrame(this.countdown);
        this.tweens.add({
            targets: this.number,
            duration: 1000, // 애니메이션 지속 시간
            scale: 2, // X축으로 2배 키우기
            repeat: 0
        });
        this.countdown--;

        this.time.delayedCall(1000, this.countDown, [], this);
    }

}