import Phaser from 'phaser';
import mainLogo from '../../assets/main-logo.png';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('intro-scene');
    }
    
    preload() {
        this.load.image('main-logo', mainLogo);
    }

    create() {
        const camWidth = this.cameras.main.width;
        const camHeight = this.cameras.main.height;
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'main-logo');
    
        const scaleRatio = Math.min(camWidth / logo.width, camHeight / logo.height);
        logo.setScale(scaleRatio);
    
        const text = this.add.text(camWidth / 2, camHeight - 50, 'Presiona cualquier tecla para continuar...', {
            color: '#FFFFFF',
            fontSize: '20px',
        });
        text.setOrigin(0.5, 0.5);
    
        let textVisible = true;
        this.time.addEvent({
            delay: 1000, 
            loop: true,
            callback: () => {
                textVisible = !textVisible;
                text.setVisible(textVisible);
            },
        });

        if (this.input && this.input.keyboard) {
            this.input.keyboard.once('keydown', () => {
                text.setVisible(false);
                this.scene.start('pongGame');
            });
        } 
    }
}