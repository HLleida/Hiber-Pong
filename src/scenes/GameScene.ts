import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Sprite;
    private paddleLeft!: Phaser.Physics.Arcade.Sprite;
    private paddleRight!: Phaser.Physics.Arcade.Sprite;
    private scoreLeft: number = 0;
    private scoreRight: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private ballSpeed: number = 200; 

    constructor() {
        super('pongGame');
    }

    preload() {
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
    }

    create() {
        this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball');
        this.ball.setBounce(1, 1);
        this.ball.setVelocity(200, 200);
        this.ball.body.setCollideWorldBounds(true, 1, 1, false);

        this.paddleLeft = this.createPaddle(30, this.scale.height / 2);
        this.paddleRight = this.createPaddle(this.scale.width - 30, this.scale.height / 2);

        this.physics.add.collider(this.ball, this.paddleLeft, this.handlePaddleBallCollision, undefined, this);
        this.physics.add.collider(this.ball, this.paddleRight, this.handlePaddleBallCollision, undefined, this);

        this.scoreText = this.add.text(
            this.scale.width / 2,
            30,
            `Score: ${this.scoreLeft} - ${this.scoreRight}`,
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0.5);
    }

    update() {
        this.handlePlayerInput();
        this.controlAiPaddle();

        if (this.ball.x < 0 || this.ball.x > this.scale.width) {
            if (this.ball.x < 0) {
                this.scoreRight++;
            } else {
                this.scoreLeft++;
            }
            this.scoreText.setText(`Score: ${this.scoreLeft} - ${this.scoreRight}`);
            this.resetBall();
        }
    }

    private createPaddle(x: number, y: number): Phaser.Physics.Arcade.Sprite {
        const paddle = this.physics.add.sprite(x, y, 'paddle');
        paddle.setImmovable(true);
        paddle.setCollideWorldBounds(true);
        return paddle;
    }

    private handlePaddleBallCollision(ball: Phaser.Physics.Arcade.Sprite, paddle: Phaser.Physics.Arcade.Sprite) {
        const newVelocityX = paddle.x < ball.x ? this.ballSpeed : -this.ballSpeed;
        ball.setVelocity(newVelocityX, ball.body.velocity.y);
    }

    private handlePlayerInput() {
        const cursorKeys = this.input.keyboard.createCursorKeys();
        if (cursorKeys.up.isDown) {
            this.paddleLeft.setVelocityY(-300);
        } else if (cursorKeys.down.isDown) {
            this.paddleLeft.setVelocityY(300);
        } else {
            this.paddleLeft.setVelocityY(0);
        }
    }

    private controlAiPaddle() {
        const ballY = this.ball.y;
        if (this.paddleRight.y < ballY) {
            this.paddleRight.setVelocityY(150);
        } else if (this.paddleRight.y > ballY) {
            this.paddleRight.setVelocityY(-150);
        } else {
            this.paddleRight.setVelocityY(0);
        }
    }

    private resetBall() {
        let launchFromLeft = this.scoreRight > this.scoreLeft;
        let posX = launchFromLeft ? this.paddleLeft.x + 20 : this.paddleRight.x - 20;
        this.ball.setPosition(posX, this.scale.height / 2);
        let angle = launchFromLeft ? Phaser.Math.Between(-45, 45) : Phaser.Math.Between(135, 225);
        this.ball.setVelocity(this.ballSpeed * Math.cos(Phaser.Math.DegToRad(angle)), 
                             this.ballSpeed * Math.sin(Phaser.Math.DegToRad(angle)));
    }
}