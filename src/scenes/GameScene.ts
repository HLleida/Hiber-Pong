import * as Phaser from 'phaser';
import ballGame from '../../assets/ball.png';
import paddleGame from '../../assets/paddle.png';

export default class Game extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Sprite;
    private paddleLeft!: Phaser.Physics.Arcade.Sprite;
    private paddleRight!: Phaser.Physics.Arcade.Sprite;
    private scoreLeft: number = 0;
    private scoreRight: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private ballSpeed: number = 200; 
    private gameOver: boolean = false;

    constructor() {
        super('pongGame');
    }

    preload() {
        this.load.image('ball', ballGame);
        this.load.image('paddle', paddleGame);
    }

    create() {

        this.add.text(10, 10, 'Player', { fontSize: '20px', color: '#fff' });
        this.add.text(this.scale.width - 70, 10, 'CPU', { fontSize: '20px', color: '#fff' });
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 270, 'HIBER-PONG!', {
            fontSize: '30px',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball');
        this.ball.setBounce(1, 1);
        this.ball.setCollideWorldBounds(true); 
        this.ball.setVelocity(this.ballSpeed, this.ballSpeed);


        this.paddleLeft = this.createPaddle(30, this.scale.height / 2);
        this.paddleRight = this.createPaddle(this.scale.width - 30, this.scale.height / 2);

        this.physics.add.collider(this.ball, this.paddleLeft, this.handlePaddleBallCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.physics.add.collider(this.ball, this.paddleRight, this.handlePaddleBallCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        this.scoreText = this.add.text(
            this.scale.width / 2,
            70,
            `Score: ${this.scoreLeft} - ${this.scoreRight}`,
            { fontSize: '32px', color: '#fff' }
        ).setOrigin(0.5, 0.5);

        this.physics.world.setBoundsCollision(false, false, true, true);


    }

    update() {
        if (this.gameOver) {
            return; 
        }

        this.handlePlayerInput();
        this.controlCPUPaddle();

         if (this.ball.x < 0 || this.ball.x > this.scale.width) {
            if (this.ball.x < 0) {
                this.scoreRight++;
            } else {
                this.scoreLeft++;
            }
            this.scoreText.setText(`Score: ${this.scoreLeft} - ${this.scoreRight}`);
            this.resetBall();

            if (this.scoreLeft === 6 || this.scoreRight === 6) {
                this.endGame();
            }
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
        if (ball.body) {
            ball.setVelocity(newVelocityX, ball.body.velocity.y);
        }
    }

    private handlePlayerInput() {
        if (this.input && this.input.keyboard) {
            const cursorKeys = this.input.keyboard.createCursorKeys();
            if (cursorKeys.up.isDown) {
                this.paddleLeft.setVelocityY(-300);
            } else if (cursorKeys.down.isDown) {
                this.paddleLeft.setVelocityY(300);
            } else {
                this.paddleLeft.setVelocityY(0);
            }
        }
    }

    private controlCPUPaddle() {
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
    
        if (launchFromLeft) {
            this.ball.setPosition(this.paddleLeft.x + 50, this.scale.height / 2);
            this.ball.setVelocity(this.ballSpeed, Phaser.Math.Between(-this.ballSpeed, this.ballSpeed));
        } else {
            this.ball.setPosition(this.paddleRight.x - 50, this.scale.height / 2);
            this.ball.setVelocity(-this.ballSpeed, Phaser.Math.Between(-this.ballSpeed, this.ballSpeed));
        }
    }

    private endGame() {
        let winner = this.scoreLeft === 6 ? 'Player' : 'CPU';
        this.add.text(this.scale.width / 2, this.scale.height / 2, `${winner} Wins!`, { fontSize: '40px', color: '#fff' }).setOrigin(0.5, 0.5);
        this.gameOver = true;
        
        this.time.delayedCall(5000, () => {
            this.scene.restart();
        });
    }
    
}
