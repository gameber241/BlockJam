import { _decorator, Component, Enum, EPhysics2DDrawFlags, Node, PhysicsSystem2D, Prefab, Size, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { LeveConfig } from './LevelConfig';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { PoolManager } from '../Manager/PoolManager';
import { block } from './block';
import { BaseSingleton } from '../Base/BaseSingleton';
import { exit } from './exit';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 100
export const BLOCK_GAP = 0

export enum ENUM_GAME_STATUS {
    UNRUNING = 'UNRUNING',
    RUNING = 'RUNING'
}

Enum(ENUM_GAME_STATUS)

@ccclass('IngameLogic')
export class IngameLogic extends BaseSingleton<IngameLogic> {
    @property(Node)
    blockBg: Node = null

    @property(Node)
    bg: Node = null

    @property({ type: Node })
    guide: Node = null
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
    level: number = 1
    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.RUNING
    protected async start() {
        await ResourcesManager.getInstance().loadAllResources()
        this.init()
    }

    init() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Pair;
        let levelConfig = LeveConfig[0]
        this.rowNum = levelConfig.rowNum
        this.colNum = levelConfig.colNum
        let sizeBg = new Size(this.colNum * 100, this.rowNum * 100)

        this.blockBg.getComponent(UITransform).setContentSize(sizeBg)
        this.bg.getComponent(UITransform).setContentSize(new Size(this.colNum * 100 + 50, this.rowNum * 100 + 50))
        this.initBlockBg()
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
            blockComp.init(i, data.typeIndex, data.colorIndex, data.x, data.y, dir, data.iceNumber)
        }


    }

    initBlockBg() {
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {
                const blockBgNode = PoolManager.getInstance().getNode('blockBg', this.blockBg)
                blockBgNode.getComponent(UITransform).width = blockBgNode.getComponent(UITransform).height = BLOCK_SIZE
                // blockBgNode.getChildByName('test_label').getComponent(Label).string = `x${j}:y${i}`
                const x = startPos.x + BLOCK_SIZE * j + BLOCK_GAP * j + BLOCK_SIZE / 2 + BLOCK_GAP
                const y = startPos.y + BLOCK_SIZE * i + BLOCK_GAP * i + BLOCK_SIZE / 2 + BLOCK_GAP
                blockBgNode.setPosition(v3(x, y))
            }
        }
        // Tạo lại viền
        this.createBlockBorders(startPos);
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
        this.blockLimitData = []
        for (let i = 0; i < this.rowNum; i++) {
            this.blockLimitData[i] = []
        }
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {
                this.blockLimitData[i][j] = 0
            }
        }

        const blockCompArr = this.blockBg.getComponentsInChildren(block)
        for (let i = 0; i < blockCompArr.length; i++) {
            const blockComp = blockCompArr[i]
            switch (blockComp.typeIndex) {
                case 1:
                    // Ô 1*1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    break
                case 2:
                    // Ô 3*1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    break
                case 3:
                    // Ô 1*3
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1

                    break
                case 4:
                    // Ô 2*1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    break
                case 5:
                    // Ô 1*2
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1

                    break
                case 6:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 7:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    break

                case 8:
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    break
                case 9:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 10:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    break
                case 11:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    break
                case 12:

                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1

                case 13:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break
                case 14:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex] = 1
                    break
                case 15:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
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
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    break
                case 19:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    break
                case 20:
                    this.blockLimitData[blockComp.yIndex][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 1] = 1
                    this.blockLimitData[blockComp.yIndex + 1][blockComp.xIndex + 2] = 1
                    this.blockLimitData[blockComp.yIndex + 2][blockComp.xIndex + 1] = 1
                    break


            }
        }
    }
    checkExitCondition(block: block): boolean {
        const exits = this.node.getComponentsInChildren(exit);
        for (const ex of exits) {
            if (ex.canAcceptBlock(block)) {
                block.tryPlaceBlock();

                // Xóa khỏi dữ liệu chiếm dụng
                this.updateBlockLimitData(block, false);
                IngameLogic.getInstance().currentSelectBlock = null;

                // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BLOCK_OUT);
                block.isExited = true;
                this.blockClearNum += 1;
                block.setActive(false);
                block.hideDir();

                if (IngameLogic.getInstance().level === 1) {
                    this.guideStep += 1;
                    this.setGuideStep();
                }

                // --- Logic hoạt hình ---
                let moveX = 0, moveY = 0, moveX2 = 0, moveY2 = 0;
                const uiTrans = block.node.getComponent(UITransform)!;
                console.log(ex.typeIndex)
                switch (ex.typeIndex) {
                    case 2:
                        moveY = 50;
                        moveY2 = uiTrans.height;
                        break;
                    case 0:
                        moveX = 50;
                        moveX2 = uiTrans.width;
                        break;
                    case 3:
                        moveY = -50;
                        moveY2 = -uiTrans.height;
                        break;
                    case 1:
                        moveX = -50;
                        moveX2 = -uiTrans.width;
                        break;
                }

                tween(block.node)
                    .by(0.2, { position: new Vec3(moveX, moveY) })
                    .call(() => {
                        tween(block.icon)
                            .by(0.2, { position: new Vec3(moveX2, moveY2) })
                            .call(() => {
                                block.node.destroy();
                            })
                            .start();

                        // --- Hiệu ứng ---
                        switch (ex.typeIndex) {
                            case 1:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                                    // eff.setPosition(i * 100 + 50, 0);
                                    // const effParticle = eff.getComponent(ParticleSystem2D)!;
                                    // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                                    // effParticle.gravity = new Vec2(0, 200);
                                    // effParticle.resetSystem();
                                }
                                break;
                            case 2:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                                    // eff.setPosition(30, i * 100 + 50);
                                    // const effParticle = eff.getComponent(ParticleSystem2D)!;
                                    // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                                    // effParticle.gravity = new Vec2(0, 0);
                                    // effParticle.resetSystem();
                                }
                                break;
                            case 3:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                                    // eff.setPosition(i * 100 + 50, 50);
                                    // const effParticle = eff.getComponent(ParticleSystem2D)!;
                                    // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                                    // effParticle.gravity = new Vec2(0, -200);
                                    // effParticle.resetSystem();
                                }
                                break;
                            case 4:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('eff_exit', ex.node);
                                    eff.setPosition(0, i * 100 + 50);
                                    // const effParticle = eff.getComponent(ParticleSystem2D)!;
                                    // effParticle.endColor = Color.fromHEX(BLOCK_COLOR[ex.colorIndex - 1]);
                                    // effParticle.gravity = new Vec2(0, 0);
                                    // effParticle.resetSystem();
                                }
                                break;
                        }
                    })
                    .start();

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
            // StaticInstance.gameManager.onGameOver(ENUM_UI_TYPE.WIN)
        }
    }

    private createBlockBorders(startPos: Vec2) {
        const minX = 0;
        const maxX = this.colNum - 1;
        const minY = 0;
        const maxY = this.rowNum - 1;

        // 1. Tạo viền trên (không bao gồm góc)
        for (let j = 0; j < this.colNum; j++) {
            const borderNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg);
            // borderNode.getComponent(UITransform).width = BLOCK_SIZE;
            // borderNode.getComponent(UITransform).height = BLOCK_SIZE;

            let x = startPos.x + BLOCK_SIZE * j + BLOCK_GAP * j + BLOCK_SIZE / 2 + BLOCK_GAP;
            let y = startPos.y + BLOCK_SIZE * maxY + BLOCK_GAP * maxY + BLOCK_SIZE / 2 + BLOCK_GAP;
            y += (BLOCK_SIZE + 50) / 2;

            borderNode.setPosition(v3(x, y));
            console.log("den day ne", v3(x, y))
            this.setBorderSpriteFrame(borderNode, 'PA_Machine_1_11_1_1'); // Hình viền trên
        }

        // 2. Tạo viền dưới (không bao gồm góc)
        for (let j = 0; j < this.colNum; j++) {
            const borderNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg);
            // borderNode.getComponent(UITransform).width = BLOCK_SIZE;
            // borderNode.getComponent(UITransform).height = BLOCK_SIZE;

            let x = startPos.x + BLOCK_SIZE * j + BLOCK_GAP * j + BLOCK_SIZE / 2 + BLOCK_GAP;
            let y = startPos.y + BLOCK_GAP * minY + BLOCK_SIZE / 2;

            y -= (BLOCK_SIZE + 78) / 2;

            borderNode.setPosition(v3(x, y));
            
            this.setBorderSpriteFrame(borderNode, 'PA_Machine_3_11_1_1'); // Hình viền dưới
        }

        // 3. Tạo viền trái (không bao gồm góc)
        for (let i = 0; i < this.rowNum; i++) {
            const borderNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg);
            // borderNode.getComponent(UITransform).width = BLOCK_SIZE;
            // borderNode.getComponent(UITransform).height = BLOCK_SIZE;

            let x = startPos.x + BLOCK_GAP * minX + BLOCK_SIZE / 2;
            let y = startPos.y + BLOCK_SIZE * i + BLOCK_GAP * i + BLOCK_SIZE / 2 + BLOCK_GAP;

            x -= (BLOCK_SIZE + 50) / 2;

            borderNode.setPosition(v3(x, y));

            this.setBorderSpriteFrame(borderNode, 'PA_Machine_4_11_1_1'); // Hình viền trái
        }

        // 4. Tạo viền phải (không bao gồm góc)
        for (let i = 0; i < this.rowNum; i++) {
            const borderNode = PoolManager.getInstance().getNode('blockBorder', this.blockBg);
            // borderNode.getComponent(UITransform).width = BLOCK_SIZE;
            // borderNode.getComponent(UITransform).height = BLOCK_SIZE;

            let x = startPos.x + BLOCK_SIZE * maxX + BLOCK_GAP * maxX + BLOCK_SIZE / 2 + BLOCK_GAP;
            let y = startPos.y + BLOCK_SIZE * i + BLOCK_GAP * i + BLOCK_SIZE / 2 + BLOCK_GAP;

            x += (BLOCK_SIZE + 50) / 2;

            borderNode.setPosition(v3(x, y));

            this.setBorderSpriteFrame(borderNode, 'PA_Machine_2_11_1_1'); // Hình viền phải
        }

        // 5. Tạo bốn góc (thêm riêng)
        this.createCornerBorder(startPos, minX, minY, 'PA_Machine_TC_4'); // Góc trái dưới
        this.createCornerBorder(startPos, maxX, minY, 'PA_Machine_TC_3'); // Góc phải dưới
        this.createCornerBorder(startPos, minX, maxY, 'PA_Machine_TC_1'); // Góc trái trên
        this.createCornerBorder(startPos, maxX, maxY, 'PA_Machine_TC_2'); // Góc phải trên
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
}



