import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('intro-scene');
    }
    
    preload() {
        this.load.image('main-logo', 'assets/main-logo.png');
    }

    create() {

        const camWidth = this.cameras.main.width;
        const camHeight = this.cameras.main.height;
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'main-logo');

        const scaleRatio = Math.min(camWidth / logo.width, camHeight / logo.height);
        logo.setScale(scaleRatio);

        const text = this.add.text(camWidth / 2, camHeight / 2 + logo.height * scaleRatio / 2 + 10, 'Presiona cualquier tecla para comenzar', {
            color: '#FFFFFF',
            fontSize: '20px',
        });
        text.setOrigin(0.5, 0.5);
    
        this.input.keyboard.once('keydown', () => {
            text.setVisible(false);
            this.scene.start('pongGame');
        });
    }
}