import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import IntroScene from './scenes/IntroScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [IntroScene, GameScene],
};

new Phaser.Game(config);