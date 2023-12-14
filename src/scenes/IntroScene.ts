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

        // Crear el objeto de texto
        const text = this.add.text(camWidth / 2, camHeight - 50, 'Presiona cualquier tecla para continuar...', {
            color: '#FFFFFF',
            fontSize: '20px',
        });
        text.setOrigin(0.5, 0.5);

        // Configurar el parpadeo del texto
        let textVisible = true;
        this.time.addEvent({
            delay: 1000, // Parpadear cada 1000 milisegundos (1 segundo)
            loop: true,
            callback: () => {
                textVisible = !textVisible;
                text.setVisible(textVisible);
            },
        });

        this.input.keyboard.once('keydown', () => {
            text.setVisible(false);
            this.scene.start('pongGame');
        });
    }
}