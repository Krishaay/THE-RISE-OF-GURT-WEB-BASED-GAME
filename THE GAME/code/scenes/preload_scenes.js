import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.PRELOAD_SCENE });
        console.log(SCENE_KEYS.PRELOAD_SCENE);
    }

    init()
    {
        console.log('init');
    }

    preload() {
        const { width, height } = this.cameras.main;
        let loadingText = this.add.text(width / 2, height / 2 , "Loading...", {
            fontSize: "20px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.load.tilemapTiledJSON('map', 'assets/map/map.tmj');
        this.load.image('hyptosis', 'assets/main_assets/hyptosis.png');
        this.load.image('Slates', 'assets/main_assets/Slates v.2 [32x32px orthogonal tileset by Ivan Voirol].png');
        this.load.image('terrain', 'assets/main_assets/terrain_tiles_v2.png');
        this.load.image('ground3', 'assets/main_assets/Topdown RPG 32x32 - Ground Tileset.PNG');
        this.load.image('collisionBlocks', 'assets/main_assets/collisionBlocks.png');
        this.load.image('crops', 'assets/main_assets/crops.png');
        this.load.image('coin', 'assets/main_assets/coin.png');
        this.load.image('menu_bg', 'assets/UI/menubg.png')

        this.load.spritesheet('player', 'assets/Characters/character1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('sword', 'assets/weapons/sword.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('items', 'assets/UI/items_ui.png', {frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('shopkeeper', 'assets/Characters/shopkeeper.png', {frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy1-walk', 'assets/Characters/Enemy1-walk.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy1-attack', 'assets/Characters/Enemy1-attack.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
    this.tweens.add({
        targets: this.children.list,
        duration: 300,
        onComplete: () => {
            this.scene.start(SCENE_KEYS.MAINMENU_SCENE);
        }
    });
}
}
