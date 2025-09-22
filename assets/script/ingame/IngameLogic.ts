import { _decorator, Color, Component, director, Enum, EPhysics2DDrawFlags, Label, Node, PhysicsSystem2D, Prefab, Size, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { LeveConfig } from './LevelConfig';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { PoolManager } from '../Manager/PoolManager';
import { block } from './block';
import { BaseSingleton } from '../Base/BaseSingleton';
import { exit } from './exit';
import { border } from './border';
import { BlockJamManager } from '../Manager/BlockJamManager';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 100
export const BLOCK_GAP = 0
type FinishCallback = () => void;
function pad(num: number, size: number): string {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
}

// dùng thay vì padStart:

export enum ENUM_GAME_STATUS {
    UNRUNING = 'UNRUNING',
    RUNING = 'RUNING'
}

Enum(ENUM_GAME_STATUS)

@ccclass('IngameLogic')
export class IngameLogic extends BaseSingleton<IngameLogic> {
    @property(Node)
    blockBg: Node = null

    @property(Label)
    coinLb: Label = null

    @property(Label)
    levelLabel: Label

    @property({ type: Node })
    guide: Node = null

    @property(Node)
    levelComplete: Node = null

    @property(Label)
    timeLb: Label = null

    @property(Node)
    outoftime1: Node = null

    @property(Node)
    popupClose: Node = null

    @property(Label)
    coinContinue: Label = null

    timeNumber: 0

    /** Bước hướng dẫn hiện tại */
    guideStep: number = 0

    blockClearNum: number = 0
    rowNum = 0
    colNum = 0
    blockTotalNum = 0
    currentSkillIndex = -1
    currentColorIndex = -1
    currentSelectBlock: block = null
    blockLimitData: number[][] = []
    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.UNRUNING


    protected start() {
        this.Reset()
    }

    Reset() {
        this.levelComplete.active = false
        this.popupClose.active = false
        this.outoftime1.active = false
        this.blockBg.destroyAllChildren()
        this.scheduleOnce(() => {
            this.init()
        })


        this.status = ENUM_GAME_STATUS.RUNING
        this.levelLabel.string = "Level " + (BlockJamManager.getInstance().level).toString()
        this.startFromString('1:30', this.ShowOutOfTime.bind(this));
        this.coinLb.string = BlockJamManager.getInstance().coin.toString()
    }


    init() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Pair;
        let levelConfig = LeveConfig[BlockJamManager.getInstance().level - 1]
        this.rowNum = levelConfig.rowNum
        this.colNum = levelConfig.colNum
        let sizeBg = new Size(this.colNum * 100, this.rowNum * 100)

        this.blockBg.getComponent(UITransform).setContentSize(sizeBg)
        this.initBlockBg(levelConfig.board)
        this.createBlockBorders(levelConfig.border)
        this.initBlock(levelConfig.blocks)
        this.initBlockLimit()
        this.initExit(levelConfig.exits)

    }

    initBlock(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            this.blockTotalNum += 1
            const data = arr[i]
            const blockNode = PoolManager.getInstance().getNode('block', this.blockBg)
            const x = data.x * (BLOCK_SIZE + BLOCK_GAP)
            const y = data.y * (BLOCK_SIZE + BLOCK_GAP)
            const pos = this.getRealPos(v2(x, y))
            blockNode.setPosition(pos)
            const blockComp = blockNode.getComponent(block)
            // Lấy số từ chuỗi

            let dir = 0
            if (typeof data.dir == 'string') {
                dir = parseInt(data.dir)
            } else {
                dir = data.dir
            }
            blockComp.init(i, data.typeIndex, data.colorIndex, data.x, data.y, data.iceNumber, dir, data.colorList, data.isLock, data.isKey, data.isStar, data.isWire)
        }


    }

    initBlockBg(boards) {
        let board = [...boards].reverse()
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {
                if (board[i][j] == 0) continue
                const blockBgNode = PoolManager.getInstance().getNode('blockBg', this.blockBg)
                blockBgNode.getComponent(UITransform).width = blockBgNode.getComponent(UITransform).height = BLOCK_SIZE
                // blockBgNode.getChildByName('test_label').getComponent(Label).string = `x${j}:y${i}`
                const x = startPos.x + BLOCK_SIZE * j + BLOCK_GAP * j + BLOCK_SIZE / 2 + BLOCK_GAP
                const y = startPos.y + BLOCK_SIZE * i + BLOCK_GAP * i + BLOCK_SIZE / 2 + BLOCK_GAP
                blockBgNode.setPosition(v3(x, y))
            }
        }

    }

    initExit(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            const data = arr[i]
            const blockNode = PoolManager.getInstance().getNode('exit', this.blockBg)
            const x = data.x * (BLOCK_SIZE + BLOCK_GAP)
            const y = data.y * (BLOCK_SIZE + BLOCK_GAP)
            const pos = this.getRealPos(v2(x, y))
            blockNode.setPosition(pos)
            const blockComp = blockNode.getComponent(exit)
            // Lấy số từ chuỗi

            blockComp.init(i, data.typeIndex, data.colorIndex, data.size, data.x, data.y)
        }
    }

    getRealPos(pos: Vec2) {
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2 + BLOCK_GAP, -this.blockBg.getComponent(UITransform).height / 2 + BLOCK_GAP)
        const x = startPos.x + pos.x
        const y = startPos.y + pos.y
        return new Vec3(x, y)
    }

    getBlocksAtPosition(worldPos: Vec2): block[] {
        const blocks = this.blockBg.getComponentsInChildren(block);
        const result: block[] = [];

        for (const block of blocks) {

            if (this.isPositionInBlock(worldPos, block)) {
                result.push(block);
            }
        }

        // Sắp xếp theo độ ưu tiên chọn và zIndex
        return result.sort((a, b) => {
            const priorityDiff = b.getSelectionPriority() - a.getSelectionPriority();
            return priorityDiff !== 0 ? priorityDiff : a.node.getSiblingIndex() - b.node.getSiblingIndex();
        });
    }
    private isPositionInBlock(worldPos: Vec2, block: block): boolean {
        const shape = block.getBlockShape();

        // Đổi từ worldPos sang localPos trong block
        const localPos = block.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y));

        // Tính index trên grid
        const gridX = Math.floor(localPos.x / BLOCK_SIZE);
        const gridY = Math.floor(localPos.y / BLOCK_SIZE);

        if (gridY >= 0 && gridY < shape.length &&
            gridX >= 0 && gridX < shape[gridY].length) {
            return shape[gridY][gridX] === 1;
        }

        return false;
    }


    updateBlockLimitData(block: block, isAdd: boolean) {
        const shape = block.getBlockShape();
        // Xóa chiếm dụng cũ
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    const posY = block.yIndex + y;
                    const posX = block.xIndex + x;
                    if (posY >= 0 && posY < this.rowNum &&
                        posX >= 0 && posX < this.colNum) {
                        this.blockLimitData[posY][posX] = 0;
                    }
                }
            }
        }

        // Nếu là thêm, đặt chiếm dụng mới
        if (isAdd) {
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] === 1) {
                        const posY = block.yIndex + y;
                        const posX = block.xIndex + x;
                        if (posY >= 0 && posY < this.rowNum &&
                            posX >= 0 && posX < this.colNum) {
                            this.blockLimitData[posY][posX] = 1;
                        }
                    }
                }
            }
        }
    }


    canPlaceBlock(block: block, x: number, y: number): boolean {
        const shape = block.getBlockShape();

        // Kiểm tra biên giới
        if (x < 0 || y < 0 ||
            x + shape[0].length > this.colNum ||
            y + shape.length > this.rowNum) {
            return false;
        }

        // Kiểm tra từng ô hợp lệ của hình dạng
        for (let relY = 0; relY < shape.length; relY++) {
            for (let relX = 0; relX < shape[relY].length; relX++) {
                if (shape[relY][relX] === 1) {
                    const checkX = x + relX;
                    const checkY = y + relY;

                    // Kiểm tra có phải vị trí gốc của block hiện tại không
                    const isOriginalPos = (
                        checkX >= block.xIndex && checkX < block.xIndex + shape[0].length &&
                        checkY >= block.yIndex && checkY < block.yIndex + shape.length
                    );

                    // Nếu vị trí bị chiếm và không phải vị trí gốc, thì không thể đặt
                    if (!isOriginalPos &&
                        this.blockLimitData[checkY] &&
                        this.blockLimitData[checkY][checkX] === 1) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    initBlockLimit() {
        let levelConfig = LeveConfig[BlockJamManager.getInstance().level - 1]
        let board = [...levelConfig.board].reverse()
        this.blockLimitData = []
        for (let i = 0; i < this.rowNum; i++) {
            this.blockLimitData[i] = []
        }
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {

                this.blockLimitData[i][j] = 0
                if (board[i][j] == 0) {
                    this.blockLimitData[i][j] = 1
                }
            }
        }

        const blockCompArr = this.blockBg.getComponentsInChildren(block)
        for (let i = 0; i < blockCompArr.length; i++) {
            const blockComp = blockCompArr[i]

            switch (blockComp.typeIndex) {
                case 1:

                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    break
                case 2:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    break
                case 3:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1

                    break
                case 4:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    break
                case 5:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    break
                case 6:
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 7:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break

                case 8:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    break
                case 9:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    break
                case 10:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    break
                case 11:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1

                    break
                case 12:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 13:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    break
                case 14:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 15:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 16:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 17:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    break
                case 18:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    break
                case 19:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 20:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 21:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 22:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 3][blockComp.xIndex] = 1
                    break
                case 23:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 3] = 1
                    break
            }
        }

        console.log([...this.blockLimitData].reverse())
    }
    checkExitCondition(block: block): boolean {
        const exits = this.node.getComponentsInChildren(exit);
        for (const ex of exits) {
            if (ex.canAcceptBlock(block)) {
                block.tryPlaceBlock();

                // Xóa khỏi dữ liệu chiếm dụng

                IngameLogic.getInstance().currentSelectBlock = null;

                // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BLOCK_OUT);

                if (block.subcolor == false) {

                    block.hideDir();
                    this.updateBlockLimitData(block, false);
                    block.isExited = true;

                    block.setActive(false);
                    this.blockClearNum += 1;
                }
                else {
                    this.updateBlockLimitData(block, true);
                }



                // if (BlockJamManager.getInstance().level === 1) {
                //     this.guideStep += 1;
                //     this.setGuideStep();
                // }

                // --- Logic hoạt hình ---
                let moveX = 0, moveY = 0, moveX2 = 0, moveY2 = 0;
                const uiTrans = block.node.getComponent(UITransform)!;
                switch (ex.typeIndex) {
                    case 2:
                        moveY = -50;
                        moveY2 = -uiTrans.height;
                        break;
                    case 0:
                        moveX = 50;
                        moveX2 = uiTrans.width;
                        break;
                    case 3:
                        moveY = 50;
                        moveY2 = uiTrans.height;
                        break;
                    case 1:
                        moveX = -50;
                        moveX2 = -uiTrans.width;
                        break;
                }
                console.log(block.icon)
                if (block.subcolor == false) {
                    tween(block.listIcon)
                        .by(0.2, { position: new Vec3(moveX2, moveY2) })
                        .call(() => {
                            
                        })
                        .start();

                }
                tween(block.icon)
                    .by(0.2, { position: new Vec3(moveX2, moveY2) })
                    .call(() => {
                        if (block.subcolor == false) {
                            director.emit("MERGE")
                            block.node.destroy();
                        }
                        else {
                            block.AddSubColor()
                        }
                    })
                    .start();
                // tween(block.node)
                //     .by(0.2, { position: new Vec3(moveX, moveY) })
                //     .call(() => {


                //         // --- Hiệu ứng ---
                //         switch (ex.typeIndex) {
                //             case 1:
                //                 for (let i = 0; i < ex.size; i++) {
                //                     const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                //                     // eff.setPosition(i * 100 + 50, 0);
                //                     // const effParticle = eff.getComponent(ParticleSystem2D)!;
                //                     // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                //                     // effParticle.gravity = new Vec2(0, 200);
                //                     // effParticle.resetSystem();
                //                 }
                //                 break;
                //             case 2:
                //                 for (let i = 0; i < ex.size; i++) {
                //                     const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                //                     // eff.setPosition(30, i * 100 + 50);
                //                     // const effParticle = eff.getComponent(ParticleSystem2D)!;
                //                     // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                //                     // effParticle.gravity = new Vec2(0, 0);
                //                     // effParticle.resetSystem();
                //                 }
                //                 break;
                //             case 3:
                //                 for (let i = 0; i < ex.size; i++) {
                //                     const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                //                     // eff.setPosition(i * 100 + 50, 50);
                //                     // const effParticle = eff.getComponent(ParticleSystem2D)!;
                //                     // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                //                     // effParticle.gravity = new Vec2(0, -200);
                //                     // effParticle.resetSystem();
                //                 }
                //                 break;
                //             case 4:
                //                 for (let i = 0; i < ex.size; i++) {
                //                     const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                //                     eff.setPosition(0, i * 100 + 50);
                //                     // const effParticle = eff.getComponent(ParticleSystem2D)!;
                //                     // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                //                     // effParticle.gravity = new Vec2(0, 0);
                //                     // effParticle.resetSystem();
                //                 }
                //                 break;
                //         }
                //     })
                //     .start();

                // Tiến trình game
                this.checkGame();
                return true;
            }
        }

        return false;
    }
    setGuideStep() {
        // if (this.guideStep == 0) {
        //     this.guide.children[0].active = true
        //     this.guide.children[1].active = false
        // } else if (this.guideStep == 1) {
        //     this.guide.children[0].active = false
        //     this.guide.children[1].active = true
        // } else {
        //     this.guide.children[0].active = false
        //     this.guide.children[1].active = false
        // }
    }


    checkGame() {
        if (this.blockClearNum >= this.blockTotalNum) {
            this.scheduleOnce(() => {
                BlockJamManager.getInstance().heartSystem.addHeart(1)
                BlockJamManager.getInstance().updateScore(200)
                BlockJamManager.getInstance().UpdateLevel()
                // BlockJamManager.getInstance().save()
                this.levelComplete.active = true
                BlockJamManager.getInstance().heartSystem.addHeart(1)
                this.pause()
            }, 0.5)
            // StaticInstance.gameManager.onGameOver(ENUM_UI_TYPE.WIN)
            this.status = ENUM_GAME_STATUS.UNRUNING

        }
    }

    private createBlockBorders(borders) {
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)

        for (let i = 0; i < borders.length; i++) {

            const borderNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg)

            this.setBorderSpriteFrame(borderNode, "wall_" + borders[i].id)
            const x = startPos.x + BLOCK_SIZE * borders[i].x + BLOCK_SIZE / 2
            const y = startPos.y + BLOCK_SIZE * borders[i].y + BLOCK_SIZE / 2
            borderNode.getComponent(border).init(borders[i].id, v3(x, y))


        }


    }

    private setBorderSpriteFrame(node: Node, frameName: string) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;

        const spriteFrame = ResourcesManager.getInstance().getSprite(frameName);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    }


    private createCornerBorder(startPos: Vec2, col: number, row: number, frameName: string) {
        const x = startPos.x + BLOCK_SIZE * col + BLOCK_GAP * col + BLOCK_SIZE / 2 + BLOCK_GAP;
        const y = startPos.y + BLOCK_SIZE * row + BLOCK_GAP * row + BLOCK_SIZE / 2 + BLOCK_GAP;

        let offsetX = 0;
        let offsetY = 0;

        if (col === 0 && row === 0) {
            offsetX = -(BLOCK_SIZE + 50) / 2;
            offsetY = -(BLOCK_SIZE + 50) / 2;
        } else if (col === this.colNum - 1 && row === 0) {
            offsetX = (BLOCK_SIZE + 50) / 2;
            offsetY = -(BLOCK_SIZE + 50) / 2;
        } else if (col === 0 && row === this.rowNum - 1) {
            offsetX = -(BLOCK_SIZE + 50) / 2;
            offsetY = (BLOCK_SIZE + 50) / 2;
        } else if (col === this.colNum - 1 && row === this.rowNum - 1) {
            offsetX = (BLOCK_SIZE + 50) / 2;
            offsetY = (BLOCK_SIZE + 50) / 2;
        }

        const cornerNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg);
        // cornerNode.getComponent(UITransform).width = BLOCK_SIZE;
        // cornerNode.getComponent(UITransform).height = BLOCK_SIZE;
        cornerNode.setPosition(v3(x + offsetX, y + offsetY));
        this.setBorderSpriteFrame(cornerNode, frameName);
    }

    ShowOutoffTime() {

    }

    BtnNextLevel() {
        this.node.destroy()
        BlockJamManager.getInstance().ShowLobby()
    }



    @property
    public displayMode: 'mm:ss' | 's' = 'mm:ss'; // hiển thị mm:ss hoặc chỉ giây (ex: "90s")

    private remainingSeconds: number = 0;
    private running: boolean = false;
    private onFinish?: FinishCallback;
    private finishedCalled: boolean = false;

    // Khởi động từ string (ví dụ "1:30" hoặc "90")
    public startFromString(timeStr: string, finishCb?: FinishCallback) {
        const parts = timeStr.split(':').map(p => p.trim());
        let total = 0;
        if (parts.length === 2) {
            const m = parseInt(parts[0], 10) || 0;
            const s = parseInt(parts[1], 10) || 0;
            total = m * 60 + s;
        } else {
            // nếu chỉ truyền "90" hiểu là giây
            total = parseInt(timeStr, 10) || 0;
        }
        this.startFromSeconds(total, finishCb);
    }

    // Khởi động từ giây
    public startFromSeconds(seconds: number, finishCb?: FinishCallback) {
        this.remainingSeconds = Math.max(0, Math.floor(seconds));
        this.onFinish = finishCb;
        this.finishedCalled = false;
        this.running = true;
        this.updateLabel(); // cập nhật ngay lập tức
    }

    public pause() {
        this.running = false;
    }

    public resume() {
        if (this.remainingSeconds > 0) this.running = true;
    }

    public stop() {
        this.running = false;
        this.remainingSeconds = 0;
        this.updateLabel();
    }

    public isRunning() {
        return this.running;
    }

    // Booster: cộng thêm thời gian
    public addTime(seconds: number) {
        this.remainingSeconds = Math.max(0, this.remainingSeconds + seconds);
        this.updateLabel();
    }

    // --- internal update ---
    update(dt: number) {
        if (!this.running) return;
        if (this.remainingSeconds <= 0) {
            this.running = false;
            if (!this.finishedCalled) {
                this.finishedCalled = true;
                if (this.onFinish) this.onFinish();
            }
            return;
        }

        // trừ dt
        this.remainingSeconds = Math.max(0, this.remainingSeconds - dt);

        this.updateLabel();

        if (this.remainingSeconds <= 0 && !this.finishedCalled) {
            this.finishedCalled = true;
            this.running = false;
            if (this.onFinish) this.onFinish();
        }
    }

    // Cập nhật text hiển thị theo chế độ
    private updateLabel() {
        if (!this.timeLb) return;

        if (this.displayMode === 's') {
            // hiển thị dưới dạng "90" (giây còn lại)
            const sec = Math.ceil(this.remainingSeconds);
            this.timeLb.string = `${sec}`;
        } else {
            // mm:ss
            const total = Math.ceil(this.remainingSeconds);
            const m = Math.floor(total / 60);
            const s = total % 60;

            const mm = this.pad(m, 2);
            const ss = this.pad(s, 2);

            this.timeLb.string = `${mm}:${ss}`;
        }
    }

    private pad(num: number, size: number): string {
        let s = num.toString();
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    }

    btnContinue() {
        if (BlockJamManager.getInstance().coin > 1000) {
            this.outoftime1.active = false
            this.addTime(20)
            this.running = true
            this.finishedCalled = false
            BlockJamManager.getInstance().updateScore(-1000)
            this.coinLb.string = BlockJamManager.getInstance().coin.toString()
        }
    }

    ShowOutOfTime() {
        this.outoftime1.active = true
        if (BlockJamManager.getInstance().coin > 1000) {
            this.coinContinue.color = Color.WHITE
        }
        else this.coinContinue.color = Color.RED
    }

    BtnCloseOutOfTime() {
        this.popupClose.active = true
        this.outoftime1.active = false
    }

    BtnClosePopupClose() {
        this.node.destroy()
        BlockJamManager.getInstance().BackToMenu()
    }

    BtnReset() {
        BlockJamManager.getInstance().ShowWinSubHeart(this.Reset.bind(this))
    }


}



