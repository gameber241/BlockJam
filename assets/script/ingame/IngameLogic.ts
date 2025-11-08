import { _decorator, BoxCollider2D, Color, Component, director, Enum, EPhysics2DDrawFlags, EventTouch, Label, math, Node, ParticleSystem, PhysicsSystem2D, Prefab, RigidBody2D, Size, sp, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { LeveConfig } from './LevelConfig';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { PoolManager } from '../Manager/PoolManager';
import { block } from './block';
import { BaseSingleton } from '../Base/BaseSingleton';
import { exit } from './exit';
import { border } from './border';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { COLORblOCK } from '../Tool/SelectColorBlock';
import { BlockTool } from '../Tool/BlockTool';
import { BuyBooster } from '../Booster/BuyBooster';
import { MenuLayer } from '../ui/MenuLayer';
import { DataManager } from '../DataManager';
import { AudioManager } from '../Manager/AudioManager';
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

    @property(Node)
    freezeEff: Node = null

    @property(Node)
    HammerEffect: Node = null

    @property(Node)
    conffeti: Node = null

    @property(Node)
    rocketEffect: Node = null

    @property(Node)
    magnetEffect: Node = null

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

    isUseTool = false

    COLOR_MAP: Record<COLORblOCK, Color> = {
        [COLORblOCK.NAU]: new Color(139, 69, 19),      // Nâu (SaddleBrown)
        [COLORblOCK.XANH_DUONG_DAM]: new Color(0, 0, 139), // Xanh dương đậm (DarkBlue)
        [COLORblOCK.XANH_LA_DAM]: new Color(0, 100, 0),    // Xanh lá đậm (DarkGreen)
        [COLORblOCK.XANH_DUONG_NHAT]: new Color(135, 206, 250), // Xanh dương nhạt (LightSkyBlue)
        [COLORblOCK.XANH_LA_NHAT]: new Color(144, 238, 144),    // Xanh lá nhạt (LightGreen)
        [COLORblOCK.CAM]: new Color(255, 165, 0),       // Cam (Orange)
        [COLORblOCK.HONG]: new Color(255, 182, 193),    // Hồng (LightPink)
        [COLORblOCK.TIM]: new Color(128, 0, 128),       // Tím (Purple)
        [COLORblOCK.DO]: new Color(255, 0, 0),          // Đỏ (Red)
        [COLORblOCK.VANG]: new Color(255, 255, 0),      // Vàng (Yellow)
    };

    protected start() {
        director.on("UPDATE_ACCOUNT", this.updateCoin, this)
        this.Reset()
    }

    protected onDestroy(): void {
        director.off("UPDATE_ACCOUNT", this.updateCoin, this)
        super.onDestroy()
    }

    Reset() {
        this.isUseTool = false
        this.blockTotalNum = 0
        this.typebooster = -1
        this.blockClearNum = 0
        this.levelComplete.active = false
        this.popupClose.active = false
        this.outoftime1.active = false
        this.currentSelectBlock = null
        this.blockBg.children.forEach(e => {
            if (e.getComponent(RigidBody2D)) {
                e.getComponent(RigidBody2D).enabled = false
            }

            if (e.getComponent(BoxCollider2D)) {
                e.getComponent(BoxCollider2D).enabled = false
            }
        })

        this.scheduleOnce(() => {
            this.blockBg.destroyAllChildren()
            this.init()
            this.status = ENUM_GAME_STATUS.RUNING
            this.levelLabel.string = "Level " + (BlockJamManager.getInstance().level).toString()
            this.startFromString('5:00', this.ShowOutOfTime.bind(this));
            this.coinLb.string = BlockJamManager.getInstance().coin.toString()
            this.UseTools()

        }, 0.1)


    }
    updateCoin() {
        this.coinLb.string = BlockJamManager.getInstance().coin.toString()
    }

    init() {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Pair;
        let levelConfig = LeveConfig[BlockJamManager.getInstance().level - 1]
        this.rowNum = levelConfig.rowNum
        this.colNum = levelConfig.colNum
        let sizeBg = new Size(this.colNum * 100, this.rowNum * 100)

        this.blockBg.getComponent(UITransform).setContentSize(sizeBg)
        if (this.colNum > 10) {
            this.blockBg.setScale(0.8, 0.8, 0.8)
        }
        else {
            this.blockBg.setScale(1, 1, 1)
        }

        this.initBlockBg(levelConfig.board)
        this.createBlockBorders(levelConfig.border)
        this.initBlock(levelConfig.blocks)
        this.initBlockLimit()
        this.initExit(levelConfig.exits)
        this.buildShapeDict();

    }



    UseTools() {
        MenuLayer.getInstance().idBoosters.forEach(e => {

            if (e == 0) {
                this.FreezeBooster()
            }
            if (e == 1) {
                this.UserocketRandom()
            }
            DataManager.SaveBooster(e, -1)
            director.emit("UPDATE_BOOSTER")
        })
        MenuLayer.getInstance().idBoosters = []
    }

    UserocketRandom() {
        IngameLogic.getInstance().status = ENUM_GAME_STATUS.UNRUNING

        let blocks = this.blockBg.getComponentsInChildren(block)
        // Lấy danh sách tất cả các ô trong block
        for (let i = 0; i < blocks.length; i++) {
            let e = blocks[i]
            if (e.freezeNum > 0) continue
            if (e.lockNumber > 0) continue
            if (e.isKey == true) continue
            if (e.isStar == true) continue
            if (e.isWire == true) continue
            if (e.colorWire != -1) continue
            if (e.colorsWire.length > 0) continue

            const shape = e.getBlockShape();
            const cells: Vec2[] = [];
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] === 1) {
                        cells.push(new Vec2(x, y));
                    }
                }
            }
            if (cells.length === 0) continue;
            let size = e.node.getComponent(UITransform).contentSize
            IngameLogic.getInstance().moveToTarget(this.node, new Vec3(e.node.getWorldPosition().x + size.width / 2, e.node.getWorldPosition().y + size.height / 2))
            this.scheduleOnce(() => {
                let size = e.node.getComponent(UITransform).contentSize
                this.HammerEffect.setWorldPosition(new Vec3(e.node.getWorldPosition().x + size.width / 2, e.node.getWorldPosition().y + size.height / 2))
                IngameLogic.getInstance().conffeti.active = true
                IngameLogic.getInstance().conffeti.getComponent(sp.Skeleton).setAnimation(0, "animation", false)

                IngameLogic.getInstance().conffeti.setWorldPosition(new Vec3(e.node.getWorldPosition().x + size.width / 2, e.node.getWorldPosition().y + size.height / 2))
                IngameLogic.getInstance().scheduleOnce(() => {
                    IngameLogic.getInstance().conffeti.active = false
                }, 0.5)


                // Chọn ngẫu nhiên 1 ô
                const randomCell = cells[Math.floor(Math.random() * cells.length)];

                // Phá ô đó
                e.breakCell(randomCell);

                // Kết thúc booster
                e.onBoosterFinish(null);
            }, 2)
            // Không có ô nào thì thoát

            return;
        }



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
            blockComp.init(i, data.typeIndex, data.colorIndex, data.x, data.y, data.iceNumber, dir, data.colorList, data.lockNumber, data.isKey, data.isStar, data.isWire)
        }


    }

    initBlockBg(boards) {

        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {
                if (boards[i][j] == 0) continue
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

            blockComp.init(i, data.typeIndex, data.colorIndex, data.size, data.x, data.y, data.isStar)
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

        console.log("BlockLimitData:", JSON.stringify(this.blockLimitData, null, 2));
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
        this.blockLimitData = []
        for (let i = 0; i < this.rowNum; i++) {
            this.blockLimitData[i] = []
        }
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {

                this.blockLimitData[i][j] = 0
                if (levelConfig.board[i][j] == 0) {
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

        console.log(this.blockLimitData)
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
                block.isCanMove = false
                const currentGridPos = block.getCurrentGridPosition();
                const x = currentGridPos.x * (BLOCK_SIZE + BLOCK_GAP)
                const y = currentGridPos.y * (BLOCK_SIZE + BLOCK_GAP)
                tween(block.node).to(0.1, { position: this.getRealPos(v2(x, y)) })
                    .call(() => {
                        if (block.subcolor == false) {
                            block.star.active = false
                            block.lock.node.active = false
                            tween(block.listIcon)
                                .by(0.5, { position: new Vec3(moveX2, moveY2) })
                                .call(() => {

                                })
                                .start();

                        }
                        if (block.subcolor == true) {
                            // this.iniIconBlock()
                            block.iconSub.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_${block.colors[0]}_${block.typeIndex}`)
                        }
                        block.icon.setSiblingIndex(1)
                        block.isCanMove = false

                        tween(block.icon)
                            .by(0.5, { position: new Vec3(moveX2, moveY2) })
                            .call(() => {
                                block.icon.active = false
                                block.isCanMove = true

                                if (block.subcolor == false) {
                                    this.blockClearNum += 1;
                                    director.emit("MERGE")
                                    if (block.isKey == true) {
                                        director.emit("KEY")
                                    }
                                    block.node.destroy();
                                    this.checkGame();
                                }
                                else {
                                    block.AddSubColor()
                                    block.isCanMove = true
                                }

                            })
                            .start();

                        switch (ex.typeIndex) {
                            case 0:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('exitVfx', ex.node);
                                    eff.setPosition(0, i * 100 + 50);
                                    eff.setScale(30, 30, 30)
                                    eff.setRotationFromEuler(new Vec3(90, 0, -90))
                                    eff.getComponent(ParticleSystem).startColor.color = this.COLOR_MAP[block.colorIndex]
                                    eff.getComponent(ParticleSystem).play()

                                    this.scheduleOnce(() => {
                                        eff.destroy()
                                    }, 0.5)
                                }
                                break;
                            case 1:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('exitVfx', block.node);
                                    eff.setPosition(0, i * 100 + 50);
                                    eff.setScale(30, 30, 30)
                                    eff.setRotationFromEuler(new Vec3(90, 0, 90))
                                    eff.getComponent(ParticleSystem).startColor.color = this.COLOR_MAP[block.colorIndex]
                                    eff.getComponent(ParticleSystem).play()
                                    this.scheduleOnce(() => {
                                        eff.destroy()
                                    }, 0.5)


                                }
                                break;
                            case 2:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('exitVfx', block.node);
                                    eff.setPosition(i * 100 + 50, 0);
                                    eff.setScale(30, 30, 30)
                                    eff.setRotationFromEuler(new Vec3(90, 0, 180))
                                    eff.getComponent(ParticleSystem).startColor.color = this.COLOR_MAP[block.colorIndex]
                                    eff.getComponent(ParticleSystem).play()
                                    this.scheduleOnce(() => {
                                        eff.destroy()
                                    }, 0.5)
                                }
                                break;
                            case 3:
                                for (let i = 0; i < ex.size; i++) {
                                    const eff = PoolManager.getInstance().getNode('exitVfx', ex.node);
                                    eff.setPosition(i * 100 + 50, 0);
                                    eff.setScale(30, 30, 30)
                                    eff.setRotationFromEuler(new Vec3(90, 0, 0))
                                    eff.getComponent(ParticleSystem).startColor.color = this.COLOR_MAP[block.colorIndex]
                                    eff.getComponent(ParticleSystem).play()
                                    this.scheduleOnce(() => {
                                        eff.destroy()
                                    }, 0.5) 
                                }
                                break;
                        }
                    })
                    .start()


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
    checkWin() {
        const blocks = this.blockBg.getComponentsInChildren(block);
        if (blocks.length === 0) {
            this.scheduleOnce(() => {
                BlockJamManager.getInstance().heartSystem.addHeart(1);
                BlockJamManager.getInstance().updateScore(200);
                BlockJamManager.getInstance().UpdateLevel();
                this.levelComplete.active = true;
                this.pause();
            }, 0.5);

            this.status = ENUM_GAME_STATUS.UNRUNING;
        }
    }
    public checkGame() {
        this.unschedule(this.checkWin)
        // đếm số block còn lại trong grid
        this.scheduleOnce(this.checkWin, 0.2);

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
        this.freezeEff.active = false
        if (this.remainingSeconds > 0) this.running = true;
        if (this.isBooster == true) {
            this.isBooster = false
        }
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

    public isOccupied(x: number, y: number): boolean {
        if (x < 0 || x >= this.colNum || y < 0 || y >= this.rowNum) {
            return true; // ngoài biên coi như bị chặn
        }
        return this.blockLimitData[y][x] === 1;
    }

    PauseGame() {

    }

    FreezeBooster() {
        this.freezeEff.active = true
        this.freezeEff.getComponent(sp.Skeleton).setAnimation(0, "start", false)
        this.freezeEff.getComponent(sp.Skeleton).addAnimation(0, "idle", true)
        this.pause()
        this.scheduleOnce(this.resume, 10)

    }





    isBooster = false
    typebooster = -1
    Magnet() {
        this.typebooster = 1
    }

    Hammer() {
        this.typebooster = 2

    }


    /**
     * Tạo hiệu ứng hút block về giữa màn hình
     * @param targetBlock Block cần tạo hiệu ứng
     * @param index Thứ tự của block (để tạo delay)
     * @param totalBlocks Tổng số block (để biết block cuối cùng)
     * @param onComplete Callback khi hoàn thành hiệu ứng
     */
    private createMagnetEffect(targetBlock: block, index: number, totalBlocks: number, onComplete?: () => void) {
        // Reset currentSelectBlock nếu cần
        if (targetBlock == IngameLogic.getInstance().currentSelectBlock) {
            this.currentSelectBlock = null
        }

        // Set sorting layer lên trên cùng để hiện trên các block khác
        targetBlock.node.setSiblingIndex(9999)

        // Thời gian delay cho mỗi block để tạo hiệu ứng sóng
        const delayTime = index * 0.08

        // Tính toán vị trí giữa màn hình
        const screenCenter = v3(0, 0, 0)

        // Lấy kích thước block để tính tâm xoay
        const blockTransform = targetBlock.node.getComponent(UITransform)
        const blockCenterOffset = v3(blockTransform.width / 2, blockTransform.height / 2, 0)

        // Tạo node tạm để làm tâm xoay
        const rotationPivot = new Node('RotationPivot')
        targetBlock.node.parent.addChild(rotationPivot)

        // Đặt pivot tại tâm block
        const blockCenter = targetBlock.node.position.clone().add(blockCenterOffset)
        rotationPivot.setPosition(blockCenter)

        // Chuyển block thành con của pivot và điều chỉnh vị trí relative
        const originalParent = targetBlock.node.parent
        targetBlock.node.setParent(rotationPivot)
        targetBlock.node.setPosition(blockCenterOffset.negative())

        // Hiệu ứng thu nhỏ dần trước khi bắt đầu bay
        tween(rotationPivot)
            .delay(delayTime)
            .to(0.2, { scale: v3(0.8, 0.8, 0.8) }, { easing: 'backOut' })
            .to(0.1, { scale: v3(1.1, 1.1, 1.1) }, { easing: 'backOut' })
            .parallel(
                // Di chuyển về giữa màn hình với hiệu ứng hút
                tween().to(0.8, { position: screenCenter }, { easing: 'sineIn' }),

                // Scale nhỏ dần với nhiều giai đoạn
                tween()
                    .to(0.4, { scale: v3(0.6, 0.6, 0.6) }, { easing: 'quartOut' })
                    .to(0.2, { scale: v3(0.3, 0.3, 0.3) }, { easing: 'quartIn' })
                    .to(0.2, { scale: v3(0, 0, 0) }, { easing: 'backIn' }),

                // Xoay vòng với tốc độ tăng dần
                tween()
                    .by(0.4, { angle: 360 })
                    .by(0.2, { angle: 540 }) // Tăng tốc xoay
                    .by(0.2, { angle: 720 }) // Xoay rất nhanh cuối
            )
            .call(() => {
                // Sau khi hoàn thành hiệu ứng, xóa toàn bộ pivot (bao gồm block)
                rotationPivot.destroy()
                this.blockClearNum += 1

                // Gọi callback khi hoàn thành hiệu ứng block cuối cùng
                if (index === totalBlocks - 1) {
                    this.checkGame()
                    if (onComplete) {
                        onComplete()
                    }
                }
            })
            .start()
    }

    /**
     * Sử dụng booster Magnet để hút tất cả block cùng màu
     * @param colorId Màu của block cần hút
     */
    MagnetBlock(colorId: number) {
        this.magnetEffect.active = true
        this.magnetEffect.getComponent(sp.Skeleton).setAnimation(0, "start", false)
        this.magnetEffect.getComponent(sp.Skeleton).addAnimation(0, "loop", true)
        this.scheduleOnce(() => {
            let listBlock = this.blockBg.getComponentsInChildren(block)
            const targetBlocks: block[] = []

            // Tìm tất cả block có màu phù hợp
            listBlock.forEach(e => {
                if (e.freezeNum > 0) return
                if (e.lockNumber > 0) return
                if (e.isKey == true) return
                if (e.isStar == true) return
                if (e.isWire == true) return
                if (e.colorWire != -1) return
                if (e.colorsWire.length > 0) return
                if (e.colorIndex == colorId) {
                    targetBlocks.push(e)
                }
            })

            // Kiểm tra có block nào để hút không
            if (targetBlocks.length === 0) {
                this.typebooster = -1
                this.isBooster = false
                return
            }

            // Tạo hiệu ứng hút cho từng block
            targetBlocks.forEach((targetBlock, index) => {
                this.createMagnetEffect(targetBlock, index, targetBlocks.length, () => {
                    // Callback khi hoàn thành tất cả hiệu ứng
                    IngameLogic.getInstance().status = ENUM_GAME_STATUS.RUNING
                })
            })
            this.scheduleOnce(() => {
                this.magnetEffect.active = false
                this.typebooster = -1
                this.isBooster = false
            }, 1)

            // Reset booster state

        }, 1)

    }


    HammerBlock(block: block, event: EventTouch) {
        if (block.freezeNum > 0) return
        if (block.lockNumber > 0) return
        if (block.isKey == true) return
        if (block.isStar == true) return
        if (block.isWire == true) return
        if (block.colorWire != -1) return
        if (block.colorsWire.length > 0) return
        if (block == IngameLogic.getInstance().currentSelectBlock) {
            this.currentSelectBlock = null
        }
        this.HammerEffect.active = true
        let size = block.node.getComponent(UITransform).contentSize
        this.HammerEffect.setWorldPosition(new Vec3(block.node.getWorldPosition().x + size.width / 2, block.node.getWorldPosition().y + size.height / 2))
        this.HammerEffect.getComponent(sp.Skeleton).setAnimation(0, "animation", false)
        this.scheduleOnce(() => {
            this.conffeti.active = true
            this.conffeti.getComponent(sp.Skeleton).setAnimation(0, "animation", false)

            this.conffeti.setWorldPosition(new Vec3(block.node.getWorldPosition().x + size.width / 2, block.node.getWorldPosition().y + size.height / 2))
            this.scheduleOnce(() => {
                this.conffeti.active = false
            }, 0.5)
            this.HammerEffect.active = false
            block.onBoosterFinish(event);
            event.propagationStopped = true;
            block.node.destroy();
            this.blockClearNum += 1;
            this.checkGame()
            IngameLogic.getInstance().status = ENUM_GAME_STATUS.RUNING
            AudioManager.getInstance().playOneShot('rocketHit');


        }, 1)

    }

    shapeDict: Map<string, number> = new Map();
    public buildShapeDict() {
        this.shapeDict.clear();

        for (let t = 1; t <= 23; t++) {

            // tạo 1 block tạm để lấy đúng shape logic theo typeIndex
            const blockNode = PoolManager.getInstance().getNode('block', null);
            const bc = blockNode.getComponent(block);
            bc.typeIndex = t;

            const shape = bc.getBlockShape();
            blockNode.destroy();

            if (!shape) continue;

            const cells: Vec2[] = [];
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] === 1) cells.push(new Vec2(x, y));
                }
            }

            const minX = Math.min(...cells.map(c => c.x));
            const minY = Math.min(...cells.map(c => c.y));
            const norm = cells.map(c => new Vec2(c.x - minX, c.y - minY))
                .sort((a, b) => a.y - b.y || a.x - b.x);

            const key = norm.map(c => `${c.x},${c.y}`).join("|");

            this.shapeDict.set(key, t);
        }
    }



    Rocket() {
        this.typebooster = 3
    }



    @property
    public rotateDuration = 0.3; // thời gian quay (giây)

    @property
    public moveDuration = 1;   // thời gian bay (giây)

    /** Gọi hàm này để rocket quay và bay đến target */
    public moveToTarget(target: Node, event) {
        this.rocketEffect.active = true
        if (target.position.y > 0)
            if (target.position.x < 0)
                this.rocketEffect.setPosition(new Vec3(1200, -1200))
            else
                this.rocketEffect.setPosition(new Vec3(-1200, -1200))

        else {
            if (target.position.x < 0)
                this.rocketEffect.setPosition(new Vec3(1200, 1200))
            else
                this.rocketEffect.setPosition(new Vec3(-1200, 1200))
        }
        if (!target) {
            console.warn("RocketTween: Chưa gán target!");
            return;
        }

        const rocketPos = this.rocketEffect.worldPosition.clone();
        const targetPos = target.worldPosition.clone();

        // === Tính góc cần quay (sprite mặc định hướng +Y nên trừ 90 độ) ===
        const dir = new Vec3(targetPos.x - rocketPos.x, targetPos.y - rocketPos.y, 0);
        const angleRad = Math.atan2(dir.y, dir.x);
        const angleDeg = math.toDegree(angleRad) - 90;

        // === Tween quay rồi bay ===
        tween(this.rocketEffect)
            .to(0, { eulerAngles: new Vec3(0, 0, angleDeg) }, { easing: 'quadOut' })
            .call(() => {
                tween(this.rocketEffect)
                    .to(2, { worldPosition: new Vec3(event.x, event.y) }, { easing: 'quadIn' })
                    .call(() => {
                        this.rocketEffect.active = false
                    })
                    .start();
            })
            .start();
    }
}



