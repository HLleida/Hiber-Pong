
import * as Phaser from 'phaser';

type ArcadePhysicsCallback = (ball: Phaser.Physics.Arcade.Sprite, paddle: Phaser.Physics.Arcade.Sprite) => void;

export default class Game extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Sprite;
    private paddleLeft!: Phaser.Physics.Arcade.Sprite;
    private paddleRight!: Phaser.Physics.Arcade.Sprite;
    private scoreLeft: number = 0;
    private scoreRight: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private ballSpeed: number = 200; // Velocidad constante para la pelota
    private gameOver: boolean = false;

    constructor() {
        super('pongGame');
    }

    preload() {
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
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
        this.ball.setCollideWorldBounds(true); // Fix: Use setCollideWorldBounds instead of accessing the read-only property
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

        // Asegúrate de que la pelota no rebote en los bordes izquierdo y derecho
        this.physics.world.setBoundsCollision(false, false, true, true);


    }

    update() {
        if (this.gameOver) {
            return; // Detiene la actualización si el juego ha terminado
        }

        this.handlePlayerInput();
        this.controlCPUPaddle();

         // Verifica si la pelota pasa por los bordes laterales para anotar puntos
         if (this.ball.x < 0 || this.ball.x > this.scale.width) {
            if (this.ball.x < 0) {
                this.scoreRight++;
            } else {
                this.scoreLeft++;
            }
            this.scoreText.setText(`Score: ${this.scoreLeft} - ${this.scoreRight}`);
            this.resetBall();

            // Comprueba si alguno de los jugadores ha ganado
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
        // Determina desde qué lado se lanzará la pelota
        let launchFromLeft = this.scoreRight > this.scoreLeft;
    
        // Coloca la pelota al lado de la pala del jugador que va a recibir
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

        //reiniciar el juego después de un tiempo
        this.time.delayedCall(5000, () => {
            this.scene.restart();
        });
    }
    
}