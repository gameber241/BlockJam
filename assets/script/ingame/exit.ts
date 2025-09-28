import { _decorator, BoxCollider, BoxCollider2D, Collider, Collider2D, Component, Contact2DType, Director, director, game, IPhysics2DContact, Node, Size, Sprite, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { BLOCK_SIZE, ENUM_GAME_STATUS, IngameLogic } from './IngameLogic';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { block } from './block';
const { ccclass, property } = _decorator;

@ccclass('exit')
export class exit extends Component {
    @property(Node)
    star: Node = null

    index: number = -1
    typeIndex: number = -1

    colorIndex: number = -1

    xIndex: number = -1

    yIndex: number = -1
    size: number = 2

    sprite: Sprite = null

    colliderNode: Node = null


    tranform: UITransform = null

    protected onLoad(): void {
        this.sprite = this.node.getComponent(Sprite)
        this.colliderNode = this.node.getChildByName('collider')
        this.tranform = this.node.getComponent(UITransform)

    }
    isStar: boolean = false

    init(index: number, typeIndex: number, colorIndex: number, size: number, xIndex: number, yIndex: number, isStar) {
        this.index = index
        this.typeIndex = typeIndex
        this.colorIndex = colorIndex
        this.xIndex = xIndex
        this.yIndex = yIndex
        this.size = size
        this.initSprite()
        this.isStar = isStar
        this.star.active = isStar
    }

    initSprite() {
        let sizeNode = new Size()
        let pos = new Vec3()
        let sizeColliderNode = new Size()
        let posCollider = new Vec3()
        let sizeCollider = new Size()
        switch (this.typeIndex) {
            case 0: // phai
                sizeNode = new Size(BLOCK_SIZE / 2, BLOCK_SIZE * this.size)
                pos = v3(this.node.position.x + BLOCK_SIZE, this.node.position.y)
                sizeColliderNode = new Size(BLOCK_SIZE, sizeNode.height - 40)
                posCollider = v3(this.colliderNode.position.x - BLOCK_SIZE / 2, 20)
                sizeCollider = new Size(BLOCK_SIZE, sizeNode.height - 40)
                break;
            case 1: // trai
                sizeNode = new Size(BLOCK_SIZE / 2, BLOCK_SIZE * this.size)
                pos = v3(this.node.position.x - BLOCK_SIZE / 2, this.node.position.y)
                sizeColliderNode = new Size(BLOCK_SIZE, sizeNode.height - 40)
                posCollider = v3(0, 20)
                sizeCollider = new Size(BLOCK_SIZE, sizeNode.height - 40)
                break;
            case 3: // up
                sizeNode = new Size(BLOCK_SIZE * this.size, BLOCK_SIZE / 2)
                pos = v3(this.node.position.x, this.node.position.y + BLOCK_SIZE)
                sizeColliderNode = new Size(sizeNode.width - 40, BLOCK_SIZE)
                posCollider = v3(20, this.colliderNode.position.y - BLOCK_SIZE / 2)
                sizeCollider = new Size(sizeNode.width - 40, BLOCK_SIZE)
                break;
            case 2: // down
                sizeNode = new Size(BLOCK_SIZE * this.size, BLOCK_SIZE / 2)
                pos = v3(this.node.position.x, this.node.position.y - BLOCK_SIZE / 2)
                sizeColliderNode = new Size(sizeNode.width - 40, BLOCK_SIZE)
                posCollider = v3(20, 0)
                sizeCollider = new Size(sizeNode.width - 40, BLOCK_SIZE)
                break;
        }

        this.tranform.setContentSize(sizeNode)
        this.node.setPosition(pos)
        this.colliderNode.getComponent(UITransform).setContentSize(sizeColliderNode)
        this.colliderNode.setPosition(posCollider)
        let collider = this.colliderNode.getComponent(BoxCollider2D)
        collider.size = sizeCollider
        collider.offset = new Vec2(sizeCollider.width / 2, sizeCollider.height / 2)
        this.sprite.spriteFrame = ResourcesManager.getInstance().getSprite(`exit_${this.colorIndex}_${this.typeIndex}`)
        collider.on(Contact2DType.STAY_CONTACT, this.onCollisionStay, this);
        this.star.getComponent(UITransform).setContentSize(sizeNode)
        this.star.parent.getComponent(UITransform).setContentSize(sizeNode)

    }

    private lastCheckTime: number = 0;
    private checkInterval: number = 0.3;
    onCollisionStay(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return

        if (otherCollider.node.name == "block" && IngameLogic.getInstance().currentSelectBlock) {
            const now = game.totalTime / 1000; // Chuyển đổi sang giây
            if (now - this.lastCheckTime >= this.checkInterval) {
                this.lastCheckTime = now;
                if (IngameLogic.getInstance().checkExitCondition(IngameLogic.getInstance().currentSelectBlock)) {
                    // Đã bị exit loại bỏ, thoát trực tiếp
                    return;
                }
            }

        }
    }


    canAcceptBlock(block: block): boolean {
        // 1. Kiểm tra màu có khớp không
        if (this.colorIndex !== block.colorIndex) {
            return false;
        }

        // 2. Kiểm tra kích thước có phù hợp không
        const blockSize = block.getBlockSize();
        if (this.typeIndex === 2 || this.typeIndex === 3) { // Cửa trên và dưới
            if (blockSize.width > this.size) {
                return false;
            }
        } else { // Cửa trái và phải
            if (blockSize.height > this.size) {
                return false;
            }
        }

        // 3. Kiểm tra vị trí có thẳng hàng không
        if (!this.isBlockAligned(block)) {
            return false;
        }

        // 4. Kiểm tra đã có block khác ở exit chưa
        if (this.isBlockExited(block)) {
            return false;
        }

        if (block.isStar !== this.isStar) {
            return false
        }


        return true;
    }

    /**
     * Kiểm tra block có thẳng hàng với exit không
     */
    private isBlockAligned(block: block): boolean {
        const blockSize = block.getBlockSize();
        const currentGridPos = block.getCurrentGridPosition();
        switch (this.typeIndex) {
            case 0: // cửa phải
                {
                    const blockCount = Math.floor(block.node.getComponent(UITransform).height / BLOCK_SIZE) - 1
                    const blockMax = currentGridPos.y + blockCount
                    const exitMax = this.yIndex + this.size - 1
                    return (currentGridPos.y >= this.yIndex && blockMax <= exitMax) && currentGridPos.x + (blockSize.width - 1) === this.xIndex
                }

            case 1: // cửa trái
                {
                    const blockCount = Math.floor(block.node.getComponent(UITransform).height / BLOCK_SIZE) - 1
                    const blockMax = currentGridPos.y + blockCount
                    const exitMax = this.yIndex + this.size - 1
                    return (currentGridPos.y >= this.yIndex && blockMax <= exitMax) && currentGridPos.x === this.xIndex
                }
            case 3: // cửa trên
                {
                    const blockCount = Math.floor(block.node.getComponent(UITransform).width / BLOCK_SIZE) - 1
                    const blockMax = currentGridPos.x + blockCount
                    const exitMax = this.xIndex + this.size - 1
                    return (currentGridPos.x >= this.xIndex && blockMax <= exitMax) && currentGridPos.y + (blockSize.height - 1) === this.yIndex;
                }
            case 2: // cửa dưới
                {
                    const blockCount = Math.floor(block.node.getComponent(UITransform).width / BLOCK_SIZE) - 1
                    const blockMax = currentGridPos.x + blockCount  // 3
                    const exitMax = this.xIndex + this.size - 1 // 1
                    return (currentGridPos.x >= this.xIndex && blockMax <= exitMax) && currentGridPos.y === this.yIndex
                }



        }
    }

    /**
     * Kiểm tra block đã ra khỏi exit chưa (có bị chặn bởi block khác không)
     */
    private isBlockExited(block: block): boolean {
        if (block.typeIndex == 1
            || block.typeIndex == 2
            || block.typeIndex == 3
            || block.typeIndex == 4
            || block.typeIndex == 5) {
            return false
        }
        const currentGridPos = block.getCurrentGridPosition();
        // Kiểm tra xem có block khác đã chiếm vị trí ở cửa ra chưa
        switch (this.typeIndex) {

            case 0: // phải
                if (block.typeIndex == 6) return false
                if (block.typeIndex == 7) {
                    const tempY = currentGridPos.y
                    return IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1
                }
                if (block.typeIndex == 8) return false
                if (block.typeIndex == 9) {
                    const tempY1 = currentGridPos.y + 1
                    return IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1
                }
                if (block.typeIndex == 10) return false
                if (block.typeIndex == 11) {
                    const tempX = this.xIndex
                    const tempX2 = this.xIndex + 1
                    return (IngameLogic.getInstance().blockLimitData[currentGridPos.y][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[currentGridPos.y][this.xIndex] == 1)
                }
                if (block.typeIndex == 12) return false
                if (block.typeIndex == 13) {
                    const tempY = currentGridPos.y + 1
                    const tempY2 = currentGridPos.y + 2
                    return (IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1)
                }
                if (block.typeIndex == 14) {
                    const tempY = currentGridPos.y
                    const tempY2 = currentGridPos.y + 1
                    return (IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1)
                }
                if (block.typeIndex == 15) return
                if (block.typeIndex == 16) return
                if (block.typeIndex == 17) {
                    const tempY = currentGridPos.y
                    const tempY2 = currentGridPos.y + 2
                    return (IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1)
                }
                if (block.typeIndex == 18) {
                    const tempY = currentGridPos.y
                    return (IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1)
                }
                if (block.typeIndex == 19) {
                    const tempY = currentGridPos.y + 1
                    return (IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1)
                } if (block.typeIndex == 20) {
                    const tempY1 = currentGridPos.y
                    const tempY2 = currentGridPos.y + 2
                    return (IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1)
                }
            case 1: // trái
                if (block.typeIndex == 6) {
                    const tempX = currentGridPos.x
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1
                }
                if (block.typeIndex == 7) return false
                if (block.typeIndex == 8) {
                    const tempY = this.yIndex + 1
                    return IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1
                }
                if (block.typeIndex == 9) return false
                if (block.typeIndex == 10) {
                    const tempX = currentGridPos.x + 1
                    const tempX1 = currentGridPos.x
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX1] == 1
                }
                if (block.typeIndex == 11) return false
                if (block.typeIndex == 12) {
                    const tempY1 = currentGridPos.y + 1
                    const tempY2 = currentGridPos.y + 2
                    return (IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1)
                }
                if (block.typeIndex == 13) return
                if (block.typeIndex == 14) return
                if (block.typeIndex == 15) {
                    const tempY1 = currentGridPos.y + 1
                    const tempY2 = currentGridPos.y
                    return (IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1)
                }
                if (block.typeIndex == 16) {
                    const tempY1 = currentGridPos.y + 2
                    const tempY2 = currentGridPos.y
                    return (IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1)
                }
                if (block.typeIndex == 17) return false
                if (block.typeIndex == 18) {
                    const tempY = this.yIndex
                    return IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1
                }
                if (block.typeIndex == 19) {
                    const tempY = this.yIndex + 1
                    return IngameLogic.getInstance().blockLimitData[tempY][this.xIndex] == 1
                }
                if (block.typeIndex == 20) {
                    const tempY1 = currentGridPos.y + 2
                    const tempY2 = currentGridPos.y
                    return (IngameLogic.getInstance().blockLimitData[tempY1][this.xIndex] == 1 || IngameLogic.getInstance().blockLimitData[tempY2][this.xIndex] == 1)
                }
            case 2: // dưới
                if (block.typeIndex == 6) {
                    const tempX1 = currentGridPos.x
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX1] == 1
                }
                if (block.typeIndex == 7) {
                    const tempX1 = currentGridPos.x + 1
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX1] == 1
                }
                if (block.typeIndex == 8) return
                if (block.typeIndex == 9) return false
                if (block.typeIndex == 10) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 1
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 11) {
                    const tempX = currentGridPos.x + 1
                    const tempX2 = currentGridPos.x + 2
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 12) return false
                if (block.typeIndex == 13) return false
                if (block.typeIndex == 14) {
                    const tempX = currentGridPos.x + 1
                    const tempY = this.yIndex + 1
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1 || IngameLogic.getInstance().blockLimitData[tempY][tempX] == 1)
                }
                if (block.typeIndex == 15) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 1
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 16) {
                    const tempX = currentGridPos.x
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1
                }
                if (block.typeIndex == 17) {
                    const tempX = currentGridPos.x + 1
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1
                }
                if (block.typeIndex == 18) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 2
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 19) return false
                if (block.typeIndex == 20) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 2
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }



            case 3: // trên
                if (block.typeIndex == 6) return false
                if (block.typeIndex == 7) return false
                if (block.typeIndex == 8) {
                    const tempX1 = currentGridPos.x
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX1] == 1
                }
                if (block.typeIndex == 9) {
                    const tempX1 = currentGridPos.x + 1
                    return IngameLogic.getInstance().blockLimitData[this.yIndex][tempX1] == 1
                }
                if (block.typeIndex == 10) return false
                if (block.typeIndex == 11) return false
                if (block.typeIndex == 12) {
                    const tempX = currentGridPos.x
                    const tempY = this.yIndex - 1
                    return (IngameLogic.getInstance().blockLimitData[tempY][tempX] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 13) {
                    const tempX = currentGridPos.x + 1
                    const tempY = this.yIndex - 1
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1 || IngameLogic.getInstance().blockLimitData[tempY][tempX] == 1)
                }
                if (block.typeIndex == 14) return false
                if (block.typeIndex == 15) return false
                if (block.typeIndex == 16) {
                    const tempX = currentGridPos.x
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 17) {
                    const tempX = currentGridPos.x + 1
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1)
                }
                if (block.typeIndex == 18) return false
                if (block.typeIndex == 19) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 2
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1)
                }
                if (block.typeIndex == 20) {
                    const tempX = currentGridPos.x
                    const tempX2 = currentGridPos.x + 2
                    return (IngameLogic.getInstance().blockLimitData[this.yIndex][tempX] == 1 || IngameLogic.getInstance().blockLimitData[this.yIndex][tempX2] == 1)
                }

        }
        return false;
    }
}

