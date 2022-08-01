import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  /* preload function to add music and pictures into memory */
  preload() {
  }

  /* create function is used to add the objects to the game */
  create() {
    //create images (z order), or use setDepth
    this.add.image(0, 0, "title_bg").setOrigin(0).setDisplaySize(this.game.renderer.width, this.game.renderer.height);

    this.add.image(this.cameras.main.centerX, this.game.renderer.height * 0.2, 'logo').setDepth(1);

    let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play_button').setDepth(1);

    this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 70, 'options_button').setDepth(1);

    //create sprites (if using pixel art, remove sharpen)
    let hoverSprite = this.add.sprite(100, 100, "cat");
    hoverSprite.setScale(2);
    hoverSprite.setVisible(false);

    //create animation

    this.anims.create({
        key: "walk",
        frameRate: 4,
        repeat: -1, //repeat forever
        frames: this.anims.generateFrameNumbers("cat", {
            frames: [0, 1, 2, 3] //frames on the spreadsheet
        })
    });

    //create audio
    this.sound.play("bg_music", {
        loop: true,
    })
    this.sound.volume = 0;
    //this.sound.pauseOnBlur = false; //if music should keep playing when switching tab


    /** make image buttons interactive
     * PointerEvents:
     *    pointerover - hovering
     *    pointerout - not hovering
     *    pointerup - click and release
     *    pointerdown - just click
     */
    playButton.setInteractive();
    playButton.on("pointerover", () => {
        hoverSprite.setVisible(true);
        hoverSprite.play("walk");
        hoverSprite.x = playButton.x - playButton.width;
        hoverSprite.y = playButton.y;
    });
    playButton.on("pointerout", () => {
        hoverSprite.setVisible(false);
    });
    playButton.on("pointerup", () => {
        this.scene.start('DemoScene');
    });
  }

  /* update function is a loop that runs constantly */
  update(time: number, delta: number): void {
      
  }
}