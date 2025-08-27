import { _decorator, Component, Enum, Node, Prefab, Size, UITransform, v2, Vec2, Vec3 } from 'cc';
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

    blockClearNum: number = 0
    rowNum = 0
    colNum = 0
    blockTotalNum = 0
    currentSkillIndex = -1
    currentColorIndex = -1
    currentSelectBlock: block = null
    blockLimitData: number[][] = []

    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.RUNING
    protected async start() {
        await ResourcesManager.getInstance().loadAllResources()
        this.init()
    }

    init() {
        let levelConfig = LeveConfig[0]
        this.rowNum = levelConfig.rowNum
        this.colNum = levelConfig.colNum
        let sizeBg = new Size(this.colNum * 100, this.rowNum * 100)
        this.blockBg.getComponent(UITransform).setContentSize(sizeBg)
        this.bg.getComponent(UITransform).setContentSize(new Size(this.colNum * 100 + 50, this.rowNum * 100 + 50))
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
            console.log("den day")
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
            console.log(this.isPositionInBlock(worldPos, block))
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
        console.log(shape)
        // Đổi từ worldPos sang localPos trong block
        const localPos = block.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y));

        // Tính index trên grid
        const gridX = Math.floor(localPos.x / BLOCK_SIZE);
        const gridY = Math.floor(localPos.y / BLOCK_SIZE);
        console.log("gridX=", gridX, "gridY=", gridY);

        if (gridY >= 0 && gridY < shape.length &&
            gridX >= 0 && gridX < shape[gridY].length) {
            return shape[gridY][gridX] === 1;
        }

        return false;
    }


    updateBlockLimitData(block: block, isAdd: boolean) {
        const shape = block.getBlockShape();
        console.log(shape)
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
        // for (const exit of exits) {
        //     if (exit.canAcceptBlock(block)) {
        //         block.tryPlaceBlock();
        //         // Xóa khỏi dữ liệu chiếm dụng
        //         this.updateBlockLimitData(block, false)
        //         // cc.log(this.blockLimitData)
        //         IngameLogic.getInstance().currentSelectBlock = null
        //         // Xóa khỏi scene
        //         // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BLOCK_OUT)
        //         block.isExited = true
        //         this.blockClearNum += 1
        //         block.setActive(false)
        //         block.hideDir()


        //         if (IngameLogic.getInstance().level == 1) {
        //             this.guideStep += 1
        //             this.setGuideStep()
        //         }

        //         // Logic hoạt hình
        //         let moveX = 0, moveY = 0, moveX2 = 0, moveY2 = 0
        //         if (exit.typeIndex == 1) {
        //             moveY = 50
        //             moveY2 = block.node.getComponent(UITransform).height
        //         }
        //         if (exit.typeIndex == 2) {
        //             moveX = 50
        //             moveX2 = block.node.getComponent(UITransform).width
        //         }
        //         if (exit.typeIndex == 3) {
        //             moveY = -50
        //             moveY2 = -block.node.getComponent(UITransform).height
        //         }
        //         if (exit.typeIndex == 4) {
        //             moveX = -50
        //             moveX2 = -block.node.getComponent(UITransform).width
        //         }
        //         const act = cc.moveBy(0.2, moveX, moveY)
        //         cc.tween(block.node).then(act).call(() => {
        //             const act = cc.moveBy(0.2, moveX2, moveY2)
        //             cc.tween(block.sprite.node).then(act).call(() => [
        //                 block.node.destroy()
        //             ]).start()

        //             switch (exit.typeIndex) {
        //                 case 1:
        //                     {
        //                         for (let i = 0; i < exit.size; i++) {
        //                             const eff = PoolManager.getInstance().getNode('eff_exit', exit.node)
        //                             eff.x = i * 100 + 50
        //                             const effParitcle = eff.getComponent(cc.ParticleSystem)
        //                             effParitcle.endColor = new cc.Color().fromHEX(BLOCK_COLOR[exit.colorIndex - 1])
        //                             effParitcle.gravity = cc.v2(0, 200)
        //                             effParitcle.resetSystem()
        //                         }
        //                     }
        //                     break
        //                 case 2:
        //                     {
        //                         for (let i = 0; i < exit.size; i++) {
        //                             const eff = PoolManager.getInstance().getNode('eff_exit', exit.node)
        //                             eff.x = 30
        //                             eff.y = i * 100 + 50
        //                             const effParitcle = eff.getComponent(cc.ParticleSystem)
        //                             effParitcle.endColor = new cc.Color().fromHEX(BLOCK_COLOR[exit.colorIndex - 1])
        //                             effParitcle.gravity = cc.v2(0, 0)
        //                             effParitcle.resetSystem()
        //                         }
        //                     }
        //                     break
        //                 case 3:
        //                     {
        //                         for (let i = 0; i < exit.size; i++) {
        //                             const eff = PoolManager.getInstance().getNode('eff_exit', exit.node)
        //                             eff.x = i * 100 + 50
        //                             eff.y = 50
        //                             const effParitcle = eff.getComponent(cc.ParticleSystem)
        //                             effParitcle.endColor = new cc.Color().fromHEX(BLOCK_COLOR[exit.colorIndex - 1])
        //                             effParitcle.gravity = cc.v2(0, -200)
        //                             effParitcle.resetSystem()
        //                         }
        //                     }
        //                     break
        //                 case 4:
        //                     {
        //                         for (let i = 0; i < exit.size; i++) {
        //                             const eff = PoolManager.getInstance().getNode('eff_exit', exit.node)
        //                             eff.x = 0
        //                             eff.y = i * 100 + 50
        //                             const effParitcle = eff.getComponent(cc.ParticleSystem)
        //                             effParitcle.endColor = new cc.Color().fromHEX(BLOCK_COLOR[exit.colorIndex - 1])
        //                             effParitcle.gravity = cc.v2(0, 0)
        //                             effParitcle.resetSystem()
        //                         }
        //                     }
        //                     break
        //             }

        //         }).start()

        //         // Tiến trình game
        //         this.checkGame()
        //         return true;
        //     }
        // }

         return false;
    }

}



