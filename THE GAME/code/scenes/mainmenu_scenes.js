import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.MAINMENU_SCENE,
        });
    }

    
    create() {
        this.bg = this.add.image(0, 0, "menu_bg").setOrigin(0);
        this.bg.setDisplaySize(this.scale.width, this.scale.height);

        this.titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.25, "The Rise of Gurt", {
            fontFamily: "Cinzel, serif",
            fontSize: "67px",
            color: "#d4af37",
            stroke: "#000",
            strokeThickness: 6,
        }).setOrigin(0.5);

        const playButton = this.add.text(this.scale.width / 2, this.scale.height * 0.55, "Play", {
            fontFamily: "Cinzel, serif",
            fontSize: "48px",
            color: "#ffffff",
            backgroundColor: "#6b4226",
            padding: { x: 30, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playButton.on("pointerover", () => playButton.setStyle({ backgroundColor: "#8b5a2b" }));
        playButton.on("pointerout", () => playButton.setStyle({ backgroundColor: "#6b4226" }));
        playButton.on("pointerup", () => {
            this.scene.start(SCENE_KEYS.MAIN_SCENE);
        });


        const creditsButton = this.add.text(this.scale.width / 2, this.scale.height * 0.7, "Credits", {
            fontFamily: "Cinzel, serif",
            fontSize: "36px",
            color: "#ffffff",
            backgroundColor: "#6b4226",
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        creditsButton.on("pointerover", () => creditsButton.setStyle({ backgroundColor: "#8b5a2b" }));
        creditsButton.on("pointerout", () => creditsButton.setStyle({ backgroundColor: "#6b4226" }));
        creditsButton.on("pointerup", () => this.toggleCreditsBox());


        //credits box
        const boxWidth = this.scale.width * 0.6;
        const boxHeight = this.scale.height * 0.5;

        this.creditsContainer = this.add.container(this.scale.width / 2, this.scale.height / 2).setVisible(false);

        const bg = this.add.rectangle(0, 0, boxWidth, boxHeight, 0x000000, 1).setStrokeStyle(3, 0xd4af37);
        const text = this.add.text(0, 0, "Created by: Krishaay, Yogita, Aartha, Samia", {
            fontFamily: "Cinzel, serif",
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: boxWidth - 40 },
        }).setOrigin(0.5);

        const closeText = this.add.text(0, boxHeight / 2 - 40, "Close", {
            fontSize: "28px",
            backgroundColor: "#6b4226",
            color: "#fff",
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeText.on("pointerup", () => this.toggleCreditsBox(false));
        this.creditsContainer.add([bg, text, closeText]);
    }

        toggleCreditsBox(forceHide = null) {
            if (forceHide === true) {
                this.creditsContainer.setVisible(false);
                return;
            }
            const currentlyVisible = this.creditsContainer.visible;
            this.creditsContainer.setVisible(!currentlyVisible);
        }
}