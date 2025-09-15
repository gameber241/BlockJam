import { _decorator, BoxCollider, BoxCollider2D, Component, EventTouch, Input, instantiate, Label, misc, Node, Size, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { BLOCK_GAP, BLOCK_SIZE, ENUM_GAME_STATUS, IngameLogic } from './IngameLogic';
import { delay } from '../Utils';
import { PoolManager } from '../Manager/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {
    index: number = -1

    typeIndex: number = -1

    colorIndex: number = -1

    xIndex: number = -1

    yIndex: number = -1

    dir: number = -1 // 0 la khong co huong, 1 la ngang, 2 la len xuong
    isExited: boolean = false
    freezeNum: number = -1
    isSelected = false
    colors: number[] = []
    private touchOffset: Vec3 = Vec3.ZERO;
    private originalPos: Vec3 = Vec3.ZERO;
    private initPos: Vec3 = Vec3.ZERO;
    @property(Node)
    mask: Node = null

    @property(Node)
    dirNode: Node = null

    @property(Node)
    freezeNode: Node = null

    @property(Label)
    freezeLb: Label = null


    @property(Node)
    icon: Node = null

    @property(Node)
    listColor: Node = null

    @property(BoxCollider2D)
    collider: BoxCollider2D = null

    sibilingCurrent = -1
    subcolor = false

    init(index: number, typeIndex: number, colorIndex: number, xIndex: number, yIndex: number, freezeNum: number, dir: number, colors) {
        this.index = index
        this.typeIndex = typeIndex
        this.colorIndex = colorIndex
        this.xIndex = xIndex
        this.yIndex = yIndex
        this.freezeNum = freezeNum
        this.dir = dir
        this.initSprite()
        this.initDir()
        this.initPos = v3(this.node.position.clone());
        this.colors = colors
        this.initListColor(colors)
    }

    AddSubColor() {
        this.icon = this.listColor.children[0]
        this.colorIndex = this.colors[0]
        this.subcolor = false
        this.isSelected = false
        console.log(this.colorIndex, this.isSelected)
    }

    initListColor(colors: number[]) {
        if (colors.length == 0) return
        colors.forEach((e, index) => {
            this.subcolor = true
            let newIcon = PoolManager.getInstance().getNode("blockInner", this.listColor)
            newIcon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_inner_${e}_${this.typeIndex}`)
            // Vì anchor cả 2 = (0,0), nên để con nằm giữa:

            // switch (this.typeIndex) {
            //     case 1:
            //     case 2:
            //     case 3:
            //     case 4:
            //     case 5:
            //     case 20:
            //     case 21:
            //     case 22:
            //     case 23:
            //         posX = this.node.getComponent(UITransform).width / 2;
            //         posY = this.node.getComponent(UITransform).height / 2;
            //         break;
            //     case 6:
            //         break
            // }
        })
    }


    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    initSprite() {
        let size = new Size()
        let offSet = new Vec2()
        switch (this.typeIndex) {
            case 1:
                size = new Size(100, 100)
                offSet = new Vec2(50, 50)
                break
            case 2:
                size = new Size(300, 100)
                offSet = new Vec2(150, 50)
                break
            case 3:
                size = new Size(100, 300)
                offSet = new Vec2(50, 150)
                break
            case 4:
                size = new Size(200, 100)
                offSet = new Vec2(50, 50)
                break
            case 5:
                size = new Size(100, 200)
                offSet = new Vec2(50, 100)
                break
            case 6:
            case 7:
            case 8:
            case 9:
                size = new Size(200, 200)
                offSet = new Vec2(100, 100)
                break
            case 10:
            case 11:
                size = new Size(300, 200)
                offSet = new Vec2(150, 100)
                break
            case 12:
            case 13:
            case 14:
            case 15:
                size = new Size(200, 300)
                offSet = new Vec2(100, 150)
                break
            case 16:
            case 17:
                size = new Size(200, 300)
                offSet = new Vec2(100, 150)
                break
            case 18:
            case 19:
                size = new Size(300, 200)
                offSet = new Vec2(150, 100)
                break
            case 20:
                size = new Size(300, 300)
                offSet = new Vec2(150, 100)
                break
            case 21:
                size = new Size(200, 200)
                offSet = new Vec2(100, 100)
                break
            case 22:
                size = new Size(100, 400)
                offSet = new Vec2(50, 200)
                break
            case 23:
                size = new Size(400, 100)
                offSet = new Vec2(200, 50)
                break
        }


        this.node.getComponent(UITransform).setContentSize(size)
        // this.icon.getComponent(UITransform).setContentSize(size)
        this.collider.size = size
        this.collider.offset = offSet
        this.mask.getComponent(UITransform).setContentSize(size)
        this.icon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_${this.colorIndex}_${this.typeIndex}`)
    }


    onTouchStart(event: EventTouch) {
        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        const touchedBlocks = IngameLogic.getInstance().getBlocksAtPosition(event.getUILocation());

        if (touchedBlocks.length === 0) return;
        const block = touchedBlocks[touchedBlocks.length - 1];
        this.sibilingCurrent = this.node.getSiblingIndex()
        // Skill logic
        // if (IngameLogic.getInstance().currentSkillIndex == 0) {
        //     // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.DING)
        //     block.colorIndex = IngameLogic.getInstance().currentColorIndex += 1
        //     // this.changeColor()
        //     IngameLogic.getInstance().currentSkillIndex = -1
        //     // IngameLogic.getInstance().ins.toggleSkillTip(false)
        //     return
        // } else if (IngameLogic.getInstance().currentSkillIndex == 1) {
        //     // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BLOCK_OUT)
        //     // block.node.zIndex = 888
        //     // block.isExited = true
        //     // IngameLogic.getInstance().updateBlockLimitData(block, false)
        //     // let act = null
        //     // if (block.xIndex >= IngameLogic.getInstance().colNum / 2) {
        //     //     act = moveBy(0.1, 200, 0)
        //     // } else {
        //     //     act = moveBy(0.1, -200, 0)
        //     // }
        //     // tween(block.node).then(act).call(() => {
        //     //     block.node.destroy()
        //     // }).start()
        //     // IngameLogic.getInstance().blockClearNum += 1
        //     // IngameLogic.getInstance().currentSkillIndex = -1
        //     // IngameLogic.getInstance().toggleSkillTip(false)
        //     // return
        // }


        console.log("den day ne", block.isSelected)
        // Nếu block hiện tại đã được chọn, trả về trực tiếp
        if (block.isSelected) return;

        // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BLOCK_CHOOSE)
        // Đặt trạng thái được chọn
        IngameLogic.getInstance().currentSelectBlock = block;
        block.isSelected = true;
        // block.setActive(true);
        block.node.setSiblingIndex(9999)

        IngameLogic.getInstance().updateBlockLimitData(IngameLogic.getInstance().currentSelectBlock, false);

        // Lưu độ lệch chạm
        const touchPos = block.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        block.touchOffset = touchPos.subtract(v3(block.node.position.x, block.node.position.y));

        // Lưu lại vị trí gốc của block
        block.originalPos = v3(block.node.position.x, block.node.position.y).clone();

        // Ngăn không cho sự kiện lan truyền
        // event.propagationStopped = true;

    }

    /**
     * Xử lý sự kiện chạm di chuyển
     */
    private onTouchMove(event: EventTouch) {

        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        if (IngameLogic.getInstance().currentSelectBlock == null) return
        if (!IngameLogic.getInstance().currentSelectBlock.isSelected) return;

        // Tính toán vị trí mới
        const touchPos = IngameLogic.getInstance().currentSelectBlock.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        let newPos: Vec3 = touchPos.subtract(
            IngameLogic.getInstance().currentSelectBlock.touchOffset
        );
        // Lấy vị trí lưới hiện tại
        const currentGridPos = IngameLogic.getInstance().currentSelectBlock.getCurrentGridPosition();

        // Tính toán biên cơ bản
        const minX = -IngameLogic.getInstance().blockBg.getComponent(UITransform).contentSize.width / 2 + BLOCK_GAP;
        const minY = -IngameLogic.getInstance().blockBg.getComponent(UITransform).contentSize.height / 2 + BLOCK_GAP;

        // Tính toán động biên có thể di chuyển thực tế
        const dynamicBounds = IngameLogic.getInstance().currentSelectBlock.calculateShapeAwareBounds(currentGridPos);
        // Chuyển đổi thành biên tọa độ thế giới
        const worldMinX = minX + dynamicBounds.minCol * (BLOCK_SIZE + BLOCK_GAP);
        const worldMaxX = minX + dynamicBounds.maxCol * (BLOCK_SIZE + BLOCK_GAP);
        const worldMinY = minY + dynamicBounds.minRow * (BLOCK_SIZE + BLOCK_GAP);
        const worldMaxY = minY + dynamicBounds.maxRow * (BLOCK_SIZE + BLOCK_GAP);

        // Giới hạn vị trí trong biên động
        if (IngameLogic.getInstance().currentSelectBlock.dir == 1) {
            // log(IngameLogic.getInstance().currentSelectBlock.initPos.x, IngameLogic.getInstance().currentSelectBlock.originalPos.x)
            newPos.x = IngameLogic.getInstance().currentSelectBlock.initPos.x; // Giữ vị trí x gốc
            newPos.y = misc.clampf(newPos.y, worldMinY, worldMaxY);
        } else if (IngameLogic.getInstance().currentSelectBlock.dir == 2) {
            // log(IngameLogic.getInstance().currentSelectBlock.initPos.y, IngameLogic.getInstance().currentSelectBlock.originalPos.y)
            newPos.y = IngameLogic.getInstance().currentSelectBlock.initPos.y; // Giữ vị trí y gốc
            newPos.x = misc.clampf(newPos.x, worldMinX, worldMaxX);
        } else {
            newPos.x = misc.clampf(newPos.x, worldMinX, worldMaxX);
            newPos.y = misc.clampf(newPos.y, worldMinY, worldMaxY);
        }

        // Áp dụng vị trí mới
        IngameLogic.getInstance().currentSelectBlock.node.position = v3(newPos);

        event.propagationStopped = true;
    }


    /**
     * Xử lý sự kiện chạm kết thúc
     */
    private onTouchEnd(event: EventTouch) {
        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        if (IngameLogic.getInstance().currentSelectBlock == null) return
        if (!IngameLogic.getInstance().currentSelectBlock.isSelected) return;
        const block = IngameLogic.getInstance().currentSelectBlock;

        // Thử đặt block
        const canPlace = block.tryPlaceBlock();

        if (!canPlace)
            // Nếu không thể đặt, quay về vị trí gốc ngay lập tức
            block.node.setPosition(block.originalPos);

        // Reset trạng thái
        block.isSelected = false;
        block.setActive(false);
        block.node.setSiblingIndex(this.sibilingCurrent);

        event.propagationStopped = true;
    }

    public getBlockShape(): number[][] {
        switch (this.typeIndex) {
            case 1: // Block 1x1
                return [
                    [1]
                ];
            case 2:
                return [
                    [1, 1, 1]
                ];
            case 3:
                return [
                    [1],
                    [1],
                    [1]
                ];
            case 4:
                return [
                    [1, 1]
                ];
            case 5:
                return [
                    [1],
                    [1]
                ];
            case 6:
                return [
                    [0, 1],
                    [1, 1]
                ];
            case 7:
                return [
                    [1, 0],
                    [1, 1]
                ];
            case 8:
                return [
                    [1, 1],
                    [0, 1]
                ];
            case 9:
                return [
                    [1, 1],
                    [1, 0]
                ];
            case 10:
                return [
                    [0, 0, 1],
                    [1, 1, 1]
                ]
            case 11:
                return [
                    [1, 0, 0],
                    [1, 1, 1]
                ]
            case 12:
                return [
                    [1, 1],
                    [0, 1],
                    [0, 1]
                ]
            case 13:
                return [
                    [1, 1],
                    [1, 0],
                    [1, 0]
                ]
            case 14:
                return [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ]
            case 15:
                return [
                    [0, 1],
                    [0, 1],
                    [1, 1]
                ]
            case 16:
                return [
                    [0, 1],
                    [1, 1],
                    [0, 1]
                ]
            case 17:
                return [
                    [1, 0],
                    [1, 1],
                    [1, 0]
                ]
            case 18:
                return [
                    [0, 1, 0],
                    [1, 1, 1]
                ]
            case 19:
                return [
                    [1, 1, 1],
                    [0, 1, 0]
                ]
            case 20:
                return [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
            case 21:
                return [
                    [1, 1],
                    [1, 1],

                ];
            case 22:
                return [
                    [1],
                    [1],
                    [1],
                    [1]
                ];
            case 23:
                return [
                    [1, 1, 1, 1]
                ];
        }
    }

    public getSelectionPriority(): number {
        // Block nhỏ có độ ưu tiên cao hơn
        switch (this.typeIndex) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 14: return 100
            default: return 60; // Khác
        }
    }

    public getCurrentGridPosition(): { x: number, y: number } {
        const blockBg = IngameLogic.getInstance().blockBg;
        const uiTransform = blockBg.getComponent(UITransform);

        if (!uiTransform) {
            return { x: 0, y: 0 };
        }

        // Tính vị trí bắt đầu (góc trái dưới của bảng)
        const startPos = v3(
            -uiTransform.contentSize.width / 2 + BLOCK_GAP,
            -uiTransform.contentSize.height / 2 + BLOCK_GAP,
            0
        );

        // Lấy vị trí tương đối của node so với startPos
        const relativePos = this.node.position.clone().subtract(startPos);

        // Tính vị trí lưới gần nhất
        const gridX = Math.round(relativePos.x / (BLOCK_SIZE + BLOCK_GAP));
        const gridY = Math.round(relativePos.y / (BLOCK_SIZE + BLOCK_GAP));

        return { x: gridX, y: gridY };
    }
    private calculateShapeAwareBounds(currentPos: { x: number, y: number }) {
        const shape = this.getBlockShape();
        const bounds = {
            minCol: 0,
            maxCol: IngameLogic.getInstance().colNum - shape[0].length,
            minRow: 0,
            maxRow: IngameLogic.getInstance().rowNum - shape.length
        };

        // Tạm thời xóa chiếm dụng của block hiện tại
        // IngameLogic.getInstance().updateBlockLimitData(this, false);

        // Kiểm tra cản trở 4 hướng
        const checkDirection = (dx: number, dy: number) => {
            for (let step = 1; step <= Math.max(IngameLogic.getInstance().colNum, IngameLogic.getInstance().rowNum); step++) {
                const testX = currentPos.x + dx * step;
                const testY = currentPos.y + dy * step;

                // Kiểm tra hình dạng ở vị trí mới có va chạm không
                for (let y = 0; y < shape.length; y++) {
                    for (let x = 0; x < shape[y].length; x++) {
                        if (shape[y][x] === 1) {
                            const checkX = testX + x;
                            const checkY = testY + y;

                            // Kiểm tra biên
                            if (checkX < 0 || checkX >= IngameLogic.getInstance().colNum ||
                                checkY < 0 || checkY >= IngameLogic.getInstance().rowNum) {
                                return step - 1;
                            }

                            // Kiểm tra chiếm dụng
                            if (IngameLogic.getInstance().blockLimitData[checkY] &&
                                IngameLogic.getInstance().blockLimitData[checkY][checkX] === 1) {
                                return step - 1;
                            }
                        }
                    }
                }
            }
            return 0;
        };

        bounds.minCol = currentPos.x - checkDirection(-1, 0);
        bounds.maxCol = currentPos.x + checkDirection(1, 0);
        bounds.minRow = currentPos.y - checkDirection(0, -1);
        bounds.maxRow = currentPos.y + checkDirection(0, 1);
        // Khôi phục chiếm dụng block hiện tại
        // IngameLogic.getInstance().updateBlockLimitData(this, true);
        return bounds;
    }

    setActive(bool: boolean) {
        // const targetMaterial = bool ? this.materialActive : this.material
        // this.sprite.setMaterial(0, targetMaterial);
    }

    public tryPlaceBlock(): boolean {
        // Tính toán vị trí lưới hiện tại
        const gridPos = this.getCurrentGridPosition();
        // Kiểm tra có thể đặt không
        if (IngameLogic.getInstance().canPlaceBlock(this, gridPos.x, gridPos.y)) {
            // Cập nhật chỉ số vị trí block
            this.xIndex = gridPos.x;
            this.yIndex = gridPos.y;

            // Reset dữ liệu chiếm dụng sân khấu
            IngameLogic.getInstance().initBlockLimit()

            // Căn chỉnh vào lưới
            this.alignToGrid();

            return true;
        }

        return false;
    }

    private async alignToGrid() {
        // Lấy vị trí đích trên grid
        const targetPos2D: Vec2 = v2(
            this.xIndex * (BLOCK_SIZE + BLOCK_GAP),
            this.yIndex * (BLOCK_SIZE + BLOCK_GAP)
        );

        const targetPos3D: Vec3 = IngameLogic.getInstance().getRealPos(targetPos2D);

        // Vị trí hiện tại của node (Vec3 -> Vec2 để tính distance)
        const currentPos2D = v2(this.node.position.x, this.node.position.y);

        // Khoảng cách từ node tới ô lưới
        const distance = currentPos2D.subtract(targetPos2D).length();

        // Thời gian di chuyển (giới hạn từ 0.1s đến 0.5s)
        const moveTime = misc.clampf(distance / 500, 0.1, 0.5);
        // Tween node tới vị trí mới
        tween(this.node)
            .to(moveTime, { position: targetPos3D }, { easing: 'quartOut' })
            .start();

        // Chờ tween chạy xong
        await delay(moveTime);
    }
    public getBlockSize(): { width: number, height: number } {
        switch (this.typeIndex) {
            case 1: return { width: 1, height: 1 };
            case 2: return { width: 3, height: 1 };
            case 3: return { width: 1, height: 3 };
            case 4: return { width: 2, height: 1 };
            case 5: return { width: 1, height: 2 };
            case 6:
            case 7:
            case 8:
            case 9: return { width: 2, height: 2 };
            case 10:
            case 11: return { width: 3, height: 2 };
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17: return { width: 2, height: 3 };
            case 18:
            case 19: return { width: 3, height: 2 };
            case 20: return { width: 3, height: 3 };
            case 21: return { width: 2, height: 2 };
            case 22: return { width: 1, height: 4 };
            case 23: return { width: 4, height: 1 };
        }
    }


    hideDir() {

    }

    protected update(dt: number): void {

    }

    initDir() {

        if (this.dir == 0) {
            this.dirNode.active = false
        } else {
            /**
             * Vertical
             */
            const nodeTransform = this.node.getComponent(UITransform)!;
            const dirTransform = this.dirNode.getComponent(UITransform)!;

            if (this.dir === 1) {
                this.dirNode.active = true
                this.dirNode.getComponent(UITransform).height = this.node.getComponent(UITransform).height


                // Vertical
                this.dirNode.active = true;

                switch (this.typeIndex) {
                    case 1: case 2: case 3: case 4: case 5:
                    case 18: case 19: case 20: case 21:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width) / 2, this.dirNode.position.y);
                        break;

                    case 7: case 9: case 13: case 14: case 17:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.dirNode.position.y);
                        break;

                    case 6: case 8: case 12: case 15: case 16:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.dirNode.position.y);
                        break;

                    case 11:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                        break;

                    case 10:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                        break;
                }

            } else if (this.dir === 2) {
                // Horizontal
                this.dirNode.active = true;
                this.dirNode.getComponent(UITransform).width = this.node.getComponent(UITransform).width
                switch (this.typeIndex) {
                    case 1: case 2: case 3: case 4: case 5:
                    case 16: case 17: case 20: case 21:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height) / 2);
                        break;

                    case 7: case 6: case 18: case 10: case 11:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height + BLOCK_SIZE) / 2);
                        break;

                    case 9: case 10: case 16: case 22: case 19:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height - BLOCK_SIZE) / 2);
                        break;

                    case 11: case 19: case 14: case 15:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height + BLOCK_SIZE * 2) / 2);
                        break;

                    // case 20:
                    //     this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height - BLOCK_SIZE * 2) / 2);
                    //     break;
                }
            }

            // Set sprite frame
            const sprite = this.dirNode.getComponent(Sprite)!;
            sprite.spriteFrame = ResourcesManager.getInstance().getSprite(`PA_Up_Down_1_${this.dir}`);
        }
    }
}


