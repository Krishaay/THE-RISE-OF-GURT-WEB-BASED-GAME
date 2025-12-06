import Phaser from "./lib/phaser.js";
import { MainScene } from "./scenes/main_scenes.js";
import { MainMenuScene } from "./scenes/mainmenu_scenes.js";
import { PreloadScene } from "./scenes/preload_scenes.js";
import { SCENE_KEYS } from "./scenes/scene-keys.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        parent: 'game_container',
        width: 1024,
        height: 576,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000000',
    physics: {
        default: 'matter',
        matter: {
            gravity: {y:0},
            debug: false
        }
    },
});

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene, true);
game.scene.add(SCENE_KEYS.MAINMENU_SCENE, MainMenuScene);
game.scene.add(SCENE_KEYS.MAIN_SCENE, MainScene);