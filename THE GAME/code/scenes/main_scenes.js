import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";
import { Pathfinder } from "./pathfinder.js";

export class MainScene extends Phaser.Scene{
    constructor()
    {
        super({
            key: SCENE_KEYS.MAIN_SCENE,
        })
        console.log(SCENE_KEYS.MAIN_SCENE);
    }

    create(){
        console.log('create');
        this.cameras.main.roundPixels = true;
        const POTION_FRAME = 146; 

        const map = this.make.tilemap({key: "map"});
        const tileset1 = map.addTilesetImage('hyptosis', 'hyptosis');
        const tileset2 = map.addTilesetImage('Slates', 'Slates');
        const tileset3 = map.addTilesetImage('terrain', 'terrain');
        const tileset4 = map.addTilesetImage('crops', 'crops');
        const tilesetCollision = map.addTilesetImage('collisionBlocks', 'collisionBlocks');

        const waterLayer = map.createLayer('water', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const groundLayer = map.createLayer('ground', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const groundLayer2 = map.createLayer('ground2', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const pathLayer = map.createLayer('paths', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const buildLayer1 = map.createLayer('build1', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const intrLayer = map.createLayer('interior', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const buildLayer2 = map.createLayer('build2', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const topsLayer = map.createLayer('tops', [tileset1, tileset2, tileset3, tileset4, tilesetCollision]);
        const collisionLayer = map.createLayer('collisions', [tilesetCollision]);
        const ForegroundLayer1 = map.createLayer('foreground1', [tileset1, tileset2, tileset3, tileset4]);
        const ForegroundLayer2 = map.createLayer('foreground2', [tileset1, tileset2, tileset3, tileset4]);

        collisionLayer.setCollisionFromCollisionGroup()
        collisionLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(collisionLayer);

        collisionLayer.setVisible(false);
        this.enemies = [];

        groundLayer.setCullPadding(1, 1);
        groundLayer2.setCullPadding(1, 1);
        buildLayer1.setCullPadding(2, 2);
        buildLayer2.setCullPadding(2, 2);
        intrLayer.setCullPadding(2, 2);
        topsLayer.setCullPadding(2, 2);
        pathLayer.setCullPadding(1, 1);

        const createOnce = (key, config) => {
            if (!this.anims.exists(key)) {
                this.anims.create({ key, ...config });
            }
        };

        this.grid = [];
        for (let y = 0; y < map.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < map.width; x++) {
                const tile = collisionLayer.getTileAt(x, y);

                // 0 = walkable, 1 = blocked
                this.grid[y][x] = tile && tile.collides ? 1 : 0;
            }
        }            
        this.pathfinder = new Pathfinder(this.grid);

        this.vxp = 0;
        this.vyp = 0;



        // player anims
        createOnce('walk-down', {
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-left', {
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-right', {
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-up', {
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-downright', {
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-downleft', {
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 17 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-upleft', {
            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 20 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('walk-upright', {
            frames: this.anims.generateFrameNumbers('player', { start: 21, end: 23 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('idle-down', {
            frames: [{ key: 'player', frame: 1 }],
            frameRate: 1
        });

        createOnce('idle-downright', {
            frames: [{ key: 'player', frame: 13 }],
            frameRate: 1
        });

        createOnce('idle-downleft', {
            frames: [{ key: 'player', frame: 16 }],
            frameRate: 1
        });

        createOnce('idle-up', {
            frames: [{ key: 'player', frame: 10 }],
            frameRate: 1
        });

        createOnce('idle-upleft', {
            frames: [{ key: 'player', frame: 10 }],
            frameRate: 19
        });

        createOnce('idle-upright', {
            frames: [{ key: 'player', frame: 10 }],
            frameRate: 22
        });

        createOnce('idle-left', {
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 1
        });

        createOnce('idle-right', {
            frames: [{ key: 'player', frame: 7 }],
            frameRate: 1
        });

        createOnce('attack-down', {
            frames: this.anims.generateFrameNumbers('sword', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });

        createOnce('attack-left', {
            frames: this.anims.generateFrameNumbers('sword', { start: 3, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        createOnce('attack-right', {
            frames: this.anims.generateFrameNumbers('sword', { start: 6, end: 8 }),
            frameRate: 12,
            repeat: 0
        });

        createOnce('attack-up', {
            frames: this.anims.generateFrameNumbers('sword', { start: 9, end: 11 }),
            frameRate: 12,
            repeat: 0
        });



        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.arrowKeys = this.input.keyboard.createCursorKeys(); 
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);


        this.player = this.matter.add.sprite(447*32, 582*32, 'player', 1);
        this.player.setRectangle(this.player.width * 0.5, this.player.height * 0.25, {
            chamfer: 0,
        });
        this.player.setOrigin(0.5, 0.8);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.setZoom(1.5);

        ForegroundLayer1.setDepth(100000000);
        ForegroundLayer2.setDepth(100000001);
        this.player.setDepth(5);
        this.player.setMass(5);

        this.sword = this.add.sprite(this.player.x, this.player.y, 'sword');
        this.sword.setVisible(false); // hidden until attack
        this.sword.setDepth(6);


        //shopkeeper
        this.anims.create({
            key: 'shop_idle',
            frames: this.anims.generateFrameNumbers('shopkeeper', { start: 1, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.shopkeeper = this.matter.add.sprite(14554, 18388, 'shopkeeper', 1);
        this.shopkeeper.body.allowGravity = false;
        this.shopkeeper.play('shop_idle');
        this.shopkeeper.setVisible(false);
        this.potionCount = 0;
        this.potionHealAmount = 30; 
        this.potionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);


        //player health stuff
        this.playermaxHealth = 100;
        this.playerhealth = 100;

        this.healthBarBg = this.add.rectangle(20, 20, 204, 20, 0x222222)
            .setScrollFactor(0)
            .setOrigin(0)
            .setDepth(10000000010);

        this.healthBar = this.add.rectangle(22, 22, 200, 16, 0x00ff00)
            .setScrollFactor(0)
            .setOrigin(0)
            .setDepth(100000000011);

        this.healthBarBg.setPosition(190, 110);
        this.healthBar.setPosition(192, 112);


        //stamina
        this.playerMaxStamina = 100;
        this.playerStamina = 100;
        this.staminaRegenRate = 10;
        this.staminaRegenDelay = 1000; //1 sec delay
        this.lastStaminaUseTime = 0;

        this.staminaBarBg = this.add.rectangle(20, 50, 204, 14, 0x222222)
            .setScrollFactor(0)
            .setOrigin(0)
            .setDepth(10000000010);

        this.staminaBar = this.add.rectangle(22, 52, 200, 10, 0x00ffff)
            .setScrollFactor(0)
            .setOrigin(0)
            .setDepth(100000000011);

        this.staminaBarBg.setPosition(190, 135-7);
        this.staminaBar.setPosition(192, 137-7);


        //potions
        this.potionCount = 0;
        this.potionHealAmount = 30; 
        this.potionIcon = this.add.sprite(201, 188, 'items', POTION_FRAME)
            .setScrollFactor(0)
            .setScale(0.8)
            .setDepth(1000000000000005);
        this.potionCountText = this.add.text(212, 175, "x0", {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
        })
        .setScrollFactor(0)
        .setDepth(1000000000000001);


        //score
        this.score = 0;
        this.scoreText = null;
        this.scoreText = this.add.text(
            this.cameras.main.width - 190, 
            105,                       
            'Score: 0',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
            }
        );
        this.scoreText.setOrigin(1, 0); // Align to top-right corner
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100000000011);


        //monsies
        this.money = 0;
        this.moneyText = 0;
        this.moneyIcon = null;
        this.coinIcon = this.add.image(30, 80, 'coin'); 
        this.coinIcon.setOrigin(0, 0.5);
        this.coinIcon.setScale(0.08); 
        this.coinIcon.setScrollFactor(0); 
        this.coinIcon.setPosition(192, 160); 
        this.coinIcon.setDepth(100000000011);

        this.moneyText = this.add.text(60, 80, '0', { 
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        });
        this.moneyText.setOrigin(0, 0.5);
        this.moneyText.setScrollFactor(0);
        this.moneyText.setPosition(212, 160);
        this.moneyText.setDepth(100000000011);


        // interiors
        this.castle = new Phaser.Geom.Rectangle(14112, 13280, 864, 350);
        this.tavern = new Phaser.Geom.Rectangle(14422, 18326, 404, 298);
        this.townhall = new Phaser.Geom.Rectangle(13952, 19584, 832, 352);
        this.weaponsmith = new Phaser.Geom.Rectangle(13120, 18368, 336, 220);


        // shopping
        this.shopText = this.add.text(230, 250, "Press E to talk", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "#0008"
        });
        this.shopText.setVisible(false);
        this.shopText.setScrollFactor(0);

        this.input.keyboard.on("keydown-E", () => {
            if (this.isNearShop) {
                this.openShopMenu();
            }
        });

        //purchase areas
        this.tavernshop = new Phaser.Geom.Rectangle(14496, 18432, 96, 64);


        // shadows
        this.shadowTexture = this.make.graphics()
        .fillStyle(0x000000, 0.2)
        .fillEllipse(16, 8, 16, 8)
        .generateTexture('shadow', 32, 16);

        this.playerShadow = this.add.image(this.player.x, this.player.y, 'shadow');
        this.playerShadow.setOrigin(0.5, 0.1);
        this.playerShadow.setDepth(this.player.depth - 1);


        // Enemy-1 - armored swordsman
        createOnce('enemy1-idle', {
            frames: this.anims.generateFrameNumbers('enemy1-walk', { start: 22, end: 23 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('enemy1-walk-up', {
            frames: this.anims.generateFrameNumbers('enemy1-walk', { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });

        createOnce('enemy1-walk-left', {
            frames: this.anims.generateFrameNumbers('enemy1-walk', { start: 9, end: 17 }),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });

        createOnce('enemy1-walk-down', {
            frames: this.anims.generateFrameNumbers('enemy1-walk', { start: 18, end: 26 }),
            frameRate: 8,
            repeat: -1
        });

        createOnce('enemy1-walk-right', {
            frames: this.anims.generateFrameNumbers('enemy1-walk', { start: 27, end: 35 }),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });

        createOnce('enemy1-attack-up', {
            frames: this.anims.generateFrameNumbers('enemy1-attack', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        createOnce('enemy1-attack-left', {
            frames: this.anims.generateFrameNumbers('enemy1-attack', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: 0
        });

        createOnce('enemy1-attack-down', {
            frames: this.anims.generateFrameNumbers('enemy1-attack', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: 0
        });

        createOnce('enemy1-attack-right', {
            frames: this.anims.generateFrameNumbers('enemy1-attack', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: 0
        });


        // this.enemies = this.add.group({
        //     classType: Phaser.Physics.Matter.Sprite,
        //     runChildUpdate: true
        // });

        this.sortables = this.add.group();
        this.sortables.add(this.player);
        this.sortables.add(this.sword);
        this.lastDirection = 'down';

        const enemyPositions = [
            {x: 468*32, y: 462*32},
            {x: 481*32, y: 486*32},
            {x: 476*32, y: 500*32},
            {x: 461*32, y: 514*32},
            {x: 444*32, y: 545*32},
            {x: 445*32, y: 542*32},
            {x: 400*32, y: 526*32},
            {x: 401*32, y: 544*32},
        ]

        enemyPositions.forEach(pos => {
            const enemy = this.matter.add.sprite(pos.x, pos.y, 'enemy1-walk', 0);
            enemy.setDepth(5);
            enemy.setRectangle(enemy.width * 0.5, enemy.height * 0.25);
            enemy.setOrigin(0.5, 0.8);
            enemy.setFixedRotation();
            enemy.setStatic(false);
            enemy.setCollisionCategory(0x0002);
            enemy.setIgnoreGravity(true);
            enemy.anims.play('enemy1-idle');
            enemy.health = 100;
            enemy.attacking = false;
            enemy.isDead = false;
            enemy.path = [];
            enemy.nextPoint = null;
            enemy.pathCooldown = 0;
            enemy.speed = 1.5;
            enemy.spawnX = pos.x;
            enemy.spawnY = pos.y;
            enemy.lastHitTime = 0; // Add this to prevent undefined error

            const shadow = this.add.image(enemy.x, enemy.y, 'shadow');
            shadow.setOrigin(0.5, 0.5);
            shadow.setDepth(enemy.depth - 1);
            enemy.shadow = shadow;

            this.enemies.push(enemy);
            this.sortables.add(enemy); 
        });
        
        this.time.addEvent({
            delay: 1000,
            callback: () => this.updateEnemyPath(),
            loop: true
        });

        this.enemySpeed = 0.85;


        this.buildLayer2 = buildLayer2;
        this.topsLayer   = topsLayer;

        this.enemies.forEach(enemy => {
            this.sortables.add(enemy);
        });


        this.lastDamageTime = 0;
        this.damageCooldown = 100;

        this.matter.world.on('collisionstart', (event) => {
            
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;

                const isEnemyHitPlayer =
                    (bodyA.label === 'enemyAttackHitbox' && bodyB.gameObject === this.player) ||
                    (bodyB.label === 'enemyAttackHitbox' && bodyA.gameObject === this.player);

                if (isEnemyHitPlayer) {
                    const now = this.time.now;
                    if (now - this.lastDamageTime > this.damageCooldown && !this.player.dead) {
                        this.lastDamageTime = now;
                        this.damagePlayer(10);
                    }
                }
            });
        });

    }

    update(time, delta){
        this.player.setVelocity(0);
        let baseSpeed = 110;
        let speed = baseSpeed;
        let sprinting = false;
        const dist = (speed * delta) / 1000;

        this.sword.setPosition(this.player.x, this.player.y);

        this.sortables.getChildren().forEach(child => {
            child.setDepth(child.y);
        });

        this.playerShadow.setPosition(
            this.player.x,
            this.player.y + (this.player.height * (1 - this.player.originY)) - 1
        );
        this.playerShadow.setDepth(this.player.depth - 1);

        this.playerShadow.setPosition(this.player.x, this.player.y);

        this.enemies.forEach(enemy => {
            enemy.shadow.setPosition(enemy.x, enemy.y);
        });

        let vx = 0;
        let vy = 0;
        if((this.keys.left.isDown || this.arrowKeys.left.isDown ) && (this.keys.right.isDown || this.arrowKeys.right.isDown))
        {
            if(this.vxp == 1)
            {vx = 1;}
            else
            {vx = -1;}
        }
        else if(this.keys.right.isDown || this.arrowKeys.right.isDown){
            vx = 1;
        }
        else if(this.keys.left.isDown || this.arrowKeys.left.isDown){
            vx = -1;
        }
        
        if((this.keys.up.isDown || this.arrowKeys.up.isDown) && (this.keys.down.isDown || this.arrowKeys.down.isDown))
        {
            if(this.vyp == 1)
            {vy = 1;}
            else
            {vy = -1;}
        }
        else if(this.keys.up.isDown || this.arrowKeys.up.isDown){
            vy = -1;
        }
        else if(this.keys.down.isDown || this.arrowKeys.down.isDown){
            vy = 1;
        }

        let direction = null;
        if (vx !== 0 || vy !== 0) {
            if (vx === 0 && vy < 0) direction = 'up';
            else if (vx === 0 && vy > 0) direction = 'down';
            else if (vy === 0 && vx < 0) direction = 'left';
            else if (vy === 0 && vx > 0) direction = 'right';
            else if (vx > 0 && vy < 0) direction = 'upright';
            else if (vx < 0 && vy < 0) direction = 'upleft';
            else if (vx > 0 && vy > 0) direction = 'downright';
            else if (vx < 0 && vy > 0) direction = 'downleft';
        }

        if (!direction) {
            this.player.anims.play('idle-' + this.lastDirection, true);
        } else {
            this.player.anims.play('walk-' + direction, true);
            this.lastDirection = direction;
        }

        if (this.sprintKey.isDown && this.playerStamina > 5 && (vx !== 0 || vy !== 0)) {
            sprinting = true;
            speed = 150;
            this.playerStamina -= 20 * (delta / 1000);
            this.lastStaminaUseTime = time;
            if (this.playerStamina < 0) this.playerStamina = 0;
        } else {
            //regen stamina when not sprinting
            if (time - this.lastStaminaUseTime > this.staminaRegenDelay) {
                this.playerStamina += (this.staminaRegenRate * delta) / 1000;
                this.playerStamina = Math.min(this.playerStamina, this.playerMaxStamina);
            }
        }
        this.updateStaminaBar();


        if(vx != 0){this.vxp = vx;}
        if(vy != 0){this.vyp = vy;}
        
        if(vx != 0 && vy != 0)
        {
            vx = vx * 0.72;
            vy = vy * 0.72;
        }
        this.player.setFixedRotation();

        const velX = vx * speed * (delta / 1000);
        const velY = vy * speed * (delta / 1000);
        this.player.setVelocity(velX , velY);

        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.attackMelee();
        }

        const insideCastle = Phaser.Geom.Rectangle.Contains(this.castle, this.player.x, this.player.y);
        const insideTavern = Phaser.Geom.Rectangle.Contains(this.tavern, this.player.x, this.player.y);
        const insideTownhall = Phaser.Geom.Rectangle.Contains(this.townhall, this.player.x, this.player.y);
        const insideWeaponsmith = Phaser.Geom.Rectangle.Contains(this.weaponsmith, this.player.x, this.player.y);

        if(insideCastle || insideTavern || insideTownhall || insideWeaponsmith)
        {
            this.buildLayer2.setVisible(false);
            this.topsLayer.setVisible(false);
            this.shopkeeper.setVisible(true);
        }
        else{
            this.buildLayer2.setVisible(true);
            this.topsLayer.setVisible(true);
            this.shopkeeper.setVisible(false);
        }

        const goodsshop = Phaser.Geom.Rectangle.Contains(this.tavernshop, this.player.x, this.player.y);
        if(goodsshop)
        {
            this.shopText.setVisible(true);
            this.isNearShop = true;
        }
        else{
            this.shopText.setVisible(false);
            this.isNearShop = false;
        }


        if (this.sword.visible) {
        this.sword.setPosition(this.player.x + this.offsetX, this.player.y + this.offsetY);
            if (this.attackHitbox) {
                this.matter.body.setPosition(
                    this.attackHitbox,
                    { x: this.player.x + this.offsetX, y: this.player.y + this.offsetY }
                );
            }
        }

        this.enemies.forEach(enemy => {
    if (enemy.isDead) return;

    const distanceToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

    // shadow
    enemy.shadow.setPosition(enemy.x, enemy.y + (enemy.height * (1 - enemy.originY)) - 1);
    enemy.shadow.setDepth(enemy.depth - 1);

    // If player is close enough to chase
    if (distanceToPlayer < 350) {
            if (this.time.now > enemy.pathCooldown) {
                this.computeEnemyPath(enemy);
                enemy.pathCooldown = this.time.now + 600;
            }

            if (!enemy.nextPoint && enemy.path.length > 0) {
                enemy.nextPoint = enemy.path.shift();
            }

            if (enemy.nextPoint) {
                const tx = enemy.nextPoint.x * 32 + 16;
                const ty = enemy.nextPoint.y * 32 + 16;
                const dx = tx - enemy.x;
                const dy = ty - enemy.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 12) {
                    enemy.nextPoint = null;
                } else {
                    enemy.setStatic(false);

                    const dt = this.game.loop.delta; 
                    const vel = (enemy.speed * dt) / 16; 
                    enemy.setVelocity((dx / dist) * vel, (dy / dist) * vel);

                    if (Math.abs(dx) > Math.abs(dy)) {
                        enemy.anims.play(dx < 0 ? "enemy1-walk-left" : "enemy1-walk-right", true);
                    } else {
                        enemy.anims.play(dy < 0 ? "enemy1-walk-up" : "enemy1-walk-down", true);
                    }
                    return;
                }
            }

            if (distanceToPlayer < 20) {
                enemy.setVelocity(0);
                enemy.setStatic(true);
                if (!enemy.attacking) this.enemyAttack(enemy);
            }
        } else {
            enemy.setVelocity(0);
            enemy.setStatic(true);
            if (enemy.anims.currentAnim?.key !== "enemy1-idle") {
                enemy.anims.play("enemy1-idle", true);
            }
        }
    });


        if (this.attackHitbox) {
            this.enemies.forEach(enemy => {
                const distance = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    this.attackHitbox.position.x, this.attackHitbox.position.y
                );
                if (distance < 30) {
                    this.damageEnemy(enemy, 25); // deal 25 damage
                }
            });
        }


        if (Phaser.Input.Keyboard.JustDown(this.potionKey)) {
            this.usePotion();
        }

    }

    attackMelee() {
        this.time.delayedCall(250, () => {});

        if (this.playerStamina < 10) return;
        this.playerStamina -= 10;
        // this.lastStaminaUseTime = this.time.now;
        this.updateStaminaBar();

        if (this.isAttacking) return;
        this.isAttacking = true;

        this.sword.setVisible(true);

        let animKey = 'attack-down';
        this.offsetX = 0; 
        this.offsetY = 0;
        const distance = 10;

        if (this.lastDirection === 'up') {
            animKey = 'attack-up';
            this.sword.setDepth(2);
            this.offsetY = -distance - 6;
        } else if (this.lastDirection === 'left') {
            animKey = 'attack-left';
            this.offsetX = -distance;
        } else if (this.lastDirection === 'right') {
            animKey = 'attack-right';
            this.offsetX = distance;
        } else {
            this.offsetY = distance;
        }

        this.sword.anims.play(animKey, true);

        this.attackHitbox = this.matter.add.rectangle(
            this.player.x + this.offsetX,
            this.player.y + this.offsetY,
            24, 24,
            { isSensor: true, label: 'attackHitbox' }
        );

        this.time.delayedCall(200, () => {
            this.matter.world.remove(this.attackHitbox);
            this.attackHitbox = null;
        });

        this.sword.once('animationcomplete', () => {
            this.sword.setVisible(false);
            this.isAttacking = false;
        });
    }

    enemyAttack(enemy) {
        if (enemy.attacking) return;
        
        enemy.attacking = true;
        console.log('enemy attack !!');

        let animKey = 'enemy1-attack-down';
        if (Math.abs(this.player.x - enemy.x) > Math.abs(this.player.y - enemy.y)) {
            animKey = (this.player.x < enemy.x) ? 'enemy1-attack-left' : 'enemy1-attack-right';
        } else {
            animKey = (this.player.y < enemy.y) ? 'enemy1-attack-up' : 'enemy1-attack-down';
        }

        enemy.anims.play(animKey, true);

        //attack hitbox
        const hitbox = this.matter.add.rectangle(
            enemy.x, enemy.y + 10, 24, 24, { isSensor: true, label: 'enemyAttackHitbox' }
        );

        this.time.delayedCall(300, () => {
            if (hitbox) {
                this.matter.world.remove(hitbox);
            }
        });

        enemy.once('animationcomplete', () => {
            enemy.attacking = false;
        });

        this.time.delayedCall(800, () => {
            enemy.attacking = false;
        });
    }

    damageEnemy(enemy, damage) {
            const now = this.time.now;
            if (enemy.isDead || now - enemy.lastHitTime < 300) return; // 300ms cooldown
            enemy.lastHitTime = now;

        enemy.health -= damage;
        this.showDamageText(enemy.x, enemy.y, `-${damage}`, '#ff3c00');

        if (enemy.health <= 0) {
            enemy.attacking = false;
            enemy.setStatic(false);
            enemy.setVelocity(0, 0);

            enemy.setVisible(false);
            enemy.shadow.setVisible(false);
            const coinReward = 5;
            this.money += coinReward;
            this.updateMoneyText();
            this.score += 100;
            this.updateScoreText();
            this.createScorePopup(enemy.x, enemy.y, 100);

            enemy.isDead = true;

            this.time.delayedCall(20000, () => { // 20 seconds
                enemy.health = 100;
                enemy.setPosition(enemy.spawnX, enemy.spawnY);
                enemy.setStatic(true);
                enemy.attacking = false;
                enemy.isDead = false;

                enemy.setVisible(true);
                enemy.shadow.setVisible(true);
                enemy.anims.play('enemy1-idle', true);
            });

        } else {
            enemy.setTint(0xff0000);
            this.time.delayedCall(150, () => enemy.clearTint());
        }
    }

    damagePlayer(amount) {
        if (this.player.dead) return;

        this.playerhealth -= amount;
        this.playerhealth = Phaser.Math.Clamp(this.playerhealth, 0, this.playermaxHealth);
        this.updateHealthBar();
        // this.showDamageText(this.player.x, this.player.y, `-${amount}`, '#ff0000');
        

        if (this.playerhealth <= 0) {
            this.playerhealth = 0;
            this.updateHealthBar();
            this.player.dead = true;
            alert("You died !!")

            this.player.setTint(0x000000);
            this.player.anims.stop();
            this.player.setStatic(true);

            const w = this.cameras.main.width;
            const h = this.cameras.main.height;
            const deathText = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y, 'You Died', {
                font: '36px Arial',
                color: '#ff0000',
                backgroundColor: '#000000aa',
                padding: { x: 10, y: 10 }
            }).setOrigin(0.5).setScrollFactor(0);

            this.time.delayedCall(1000, () => {
                this.isAttacking = false;
                this.scene.restart();
            });
        } else {
            this.player.setTint(0xff0000);
            this.time.delayedCall(150, () => this.player.clearTint());
        }
    }

    showDamageText(x, y, amount, color = '#ff3c00') {
        const dmgText = this.add.text(x, y - 20, amount, {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: color,
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        dmgText.setDepth(100000002);

        this.tweens.add({
            targets: dmgText,
            y: y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => dmgText.destroy()
        });
    }

    updateHealthBar() {
        const maxW = 200;
        const pct = Phaser.Math.Clamp(this.playerhealth / this.playermaxHealth, 0, 1);
        this.healthBar.displayWidth = maxW * pct;

        let healthRatio = this.playerhealth / this.playermaxHealth;
        if (healthRatio > 0.5) {
            this.healthBar.fillColor = 0x00ff00; // green
        } else if (healthRatio > 0.25) {
            this.healthBar.fillColor = 0xffff00; // yellow
        } else {
            this.healthBar.fillColor = 0xff0000; // red
        }

        const col = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(255, 0, 0),
            new Phaser.Display.Color(0, 255, 0),
            100,
            Math.round(pct * 100)
        );
        this.healthBar.fillColor = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
    }

    updateStaminaBar() {
        const maxW = 200;
        const pct = Phaser.Math.Clamp(this.playerStamina / this.playerMaxStamina, 0, 1);
        this.staminaBar.displayWidth = maxW * pct;

        if (pct > 0.5) {
            this.staminaBar.fillColor = 0x00ffff;
        } else if (pct > 0.25) {
            this.staminaBar.fillColor = 0xffff00; 
        } else {
            this.staminaBar.fillColor = 0xff0000;
        }
    }

    updateScoreText() {
        if (this.scoreText) {
            this.scoreText.setText('Score: ' + this.score);
        }
    }

    createScorePopup(x, y, amount) {
        const popup = this.add.text(x, y-20, `Score +${amount}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#0000ff',
            stroke: '#000000',
            strokeThickness: 2,
        });
        popup.setOrigin(0.5); 

        this.tweens.add({
            targets: popup,
            y: y - 80,    
            alpha: 0,     
            duration: 800,   
            ease: 'Cubic.easeOut',
            onComplete: () => popup.destroy()
        });
    }

    updateMoneyText() {
        if (this.moneyText) {
            this.moneyText.setText(this.money.toString());
        }
    }


    openShopMenu() {
        if (this.shopUI) return; 

        this.shopUI = this.add.rectangle(470, 250, 335, 200, 0x000000, 0.8)
            .setScrollFactor(0);

        this.shopTitle = this.add.text(320, 180, "Shopkeeper", {
            fontSize: "22px",
            fill: "#fff"
        }).setScrollFactor(0);

        this.shopBuyText = this.add.text(330, 230, "Buy Health Potion (2 gold)", {
            fontSize: "18px",
            fill: "#0f0"
        }).setScrollFactor(0).setInteractive();

        this.shopBuyText.on('pointerdown', () => {
            this.buyPotion();
        });

        this.shopClose = this.add.text(430, 300, "[Close]", {
            fontSize: "16px",
            fill: "#ff4444"
        }).setScrollFactor(0).setInteractive();

        this.shopClose.on('pointerdown', () => {
            this.closeShopMenu();
        });
    }

    closeShopMenu() {
        this.shopUI.destroy();
        this.shopTitle.destroy();
        this.shopBuyText.destroy();
        this.shopClose.destroy();
        this.shopUI = null;
    }

    buyPotion() {
        if (this.potionCount >= 4) {
            this.shopBuyText.setText("Max potions reached!");
            return;
        }

        if (this.money < 2) {
            this.shopBuyText.setText("Not enough gold!");
            return;
        }

        this.money -= 2;
        this.potionCount++;
        this.updateMoneyText();

        this.updatePotionUI();

        this.shopBuyText.setText("Purchased!");

        setTimeout(() => {
            if (this.shopBuyText) {
                this.shopBuyText.setText("Buy Health Potion");
            }
        }, 800);
    }

    updatePotionUI() {
        this.potionCountText.setText("x" + this.potionCount);
    }

    usePotion() {
        if (this.potionCount <= 0) {
            return; 
        }

        if (this.playerhealth >= this.playermaxHealth) {
            return; 
        }

        // heal
        this.playerhealth += this.potionHealAmount;
        if (this.playerhealth > this.playermaxHealth) {
            this.playerhealth = this.playermaxHealth;
        }

        this.updateHealthBar();
        this.potionCountText.setText("x" + this.potionCount);
        this.cameras.main.flash(150, 0, 255, 0);

        // reduce potion count
        this.potionCount--;
        this.potionCountText.setText("x" + this.potionCount);
    }

    worldToGrid(x, y) {
        return {
            x: Math.floor(x / 32),
            y: Math.floor(y / 32)
        };
    }

    computeEnemyPath(enemy) {
        const tileX = Math.floor(enemy.x / 32);
        const tileY = Math.floor(enemy.y / 32);
        const playerTileX = Math.floor(this.player.x / 32);
        const playerTileY = Math.floor(this.player.y / 32);

        // clamp within map bounds
        const width = this.grid[0].length;
        const height = this.grid.length;

        const startX = Phaser.Math.Clamp(tileX, 0, width-1);
        const startY = Phaser.Math.Clamp(tileY, 0, height-1);
        const endX = Phaser.Math.Clamp(playerTileX, 0, width-1);
        const endY = Phaser.Math.Clamp(playerTileY, 0, height-1);

        
        const start = { x: startX, y: startY };
        const end = { x: endX, y: endY };
        enemy.path = this.pathfinder.findPath(start, end) || [];
        enemy.nextPoint = enemy.path.length > 0 ? enemy.path.shift() : null;
    }

    updateEnemyPath() {
        this.enemies.forEach(enemy => {
            if (!enemy.isDead) {
                this.computeEnemyPath(enemy);
            }
        });
    }
    


}