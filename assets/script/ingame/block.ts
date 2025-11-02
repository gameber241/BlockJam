import { _decorator, BoxCollider, BoxCollider2D, Component, director, EventTouch, Input, instantiate, Label, misc, Node, Size, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
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


    @property(Label)
    freezeLb: Label = null


    @property(Node)
    icon: Node = null

    @property(Node)
    listColor: Node = null

    @property(BoxCollider2D)
    collider: BoxCollider2D = null

    @property(Node)
    listIcon: Node = null

    @property(Sprite)
    lock: Sprite = null

    @property(Node)
    key: Node = null

    @property(Node)
    star: Node = null

    @property(Node)
    lockLb: Node = null

    sibilingCurrent = -1
    subcolor = false
    freeNode = null
    isWire = false
    isStar = false
    isKey = false
    lockNumber = 0
    colorWire = -1
    colorsWire = []
    init(index: number, typeIndex: number, colorIndex: number, xIndex: number, yIndex: number, freezeNum: number, dir: number, colors, lockNumber, isKey, isStar, isWire, colorWire = -1, colorsWire = []) {
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
        this.initIce(freezeNum)
        director.on("MERGE", this.SubIce, this)
        director.on("KEY", this.SubKey, this)

        if (freezeNum == 0)
            this.iniIconBlock()

        this.isKey = isKey
        this.isStar = (isStar == null || isStar == undefined) ? false : isStar
        this.isWire = isWire
        this.lockNumber = lockNumber
        if (lockNumber > 0) {
            this.initLock()
        }
        else {
            this.lock.node.active = false
        }
        if (isKey == true) {
            this.key.active = true
            this.initKey()
        }
        else {
            this.key.active = false
        }

        if (isStar == true) {
            this.initStar()
        }
        else {
            this.star.active = false
        }
    }

    SubKey() {
        if (this.lockNumber == 0) return
        this.lockNumber--;
        this.lockLb.getComponent(Label).string = this.lockNumber.toString()
        if (this.lockNumber == 0) {
            this.lock.node.active = false
        }

    }
    initStar() {
        this.star.active = true
        this.star.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_star_3_${this.typeIndex}`)
    }
    initKey() {
        let nodeTransform = this.node.getComponent(UITransform)
        let dirTransform = this.key.getComponent(UITransform)
        switch (this.typeIndex) {
            case 1: case 2: case 3: case 4: case 5:
            case 18: case 19: case 20: case 21: case 23: case 22:
                this.key.setPosition((nodeTransform.width - dirTransform.width) / 2, (nodeTransform.height - dirTransform.height) / 2);
                break;

            case 7: case 9: case 13: case 14: case 17:
                this.key.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.key.position.y);
                break;

            case 6: case 8: case 12: case 15: case 16:
                this.key.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.key.position.y);
                break;

            case 11:
                this.key.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.key.position.y);
                break;

            case 10:
                this.key.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                break;
        }
    }


    initLock() {
        console.log("lock_" + this.colorIndex + "_" + this.typeIndex)
        this.lock.spriteFrame = ResourcesManager.getInstance().getSprite("lock_1" + "_" + this.typeIndex)
        this.lockLb.getComponent(Label).string = this.lockNumber.toString()
        switch (this.typeIndex) {
            case 1:
                this.lockLb.setPosition(new Vec3(48, 51, 0))
                break
            case 2:
                this.lockLb.setPosition(new Vec3(152, 46, 0))
                break
            case 3:
                this.lockLb.setPosition(new Vec3(48, 152, 0))
                break
            case 4:
                this.lockLb.setPosition(new Vec3(99, 46, 0))
                break
            case 5:
                this.lockLb.setPosition(new Vec3(48, 103, 0))
                break
            case 6:
                this.lockLb.setPosition(new Vec3(138, 124, 0))
                break
            case 7:
                this.lockLb.setPosition(new Vec3(71, 101, 0))
                break
            case 8:
                this.lockLb.setPosition(new Vec3(101, 49, 0))
                break
            case 9:
                this.lockLb.setPosition(new Vec3(100, 55, 0))
                break
            case 10:
                this.lockLb.setPosition(new Vec3(252, 110, 0))
                break
            case 11:
                this.lockLb.setPosition(new Vec3(84, 138, 0))
                break
            case 12:
                this.lockLb.setPosition(new Vec3(149, 158, 0))
                break
            case 13:
                this.lockLb.setPosition(new Vec3(100, 148, 0))
                break
            case 14:
                this.lockLb.setPosition(new Vec3(46, 164, 0))
                break
            case 15:
                this.lockLb.setPosition(new Vec3(15, 29, 0))
                break
            case 16:
                this.lockLb.setPosition(new Vec3(146, 160, 0))
                break
            case 17:
                this.lockLb.setPosition(new Vec3(51, 145, 0))
                break
            case 18:
                this.lockLb.setPosition(new Vec3(143, 146, 0))
                break
            case 19:
                this.lockLb.setPosition(new Vec3(163, 44, 0))
                break
            case 20:
                this.lockLb.setPosition(new Vec3(150, 150, 0))
                break
            case 21:
                this.lockLb.setPosition(new Vec3(96, 100, 0))
                break
            case 22:
                this.lockLb.setPosition(new Vec3(50, 200, 0))
                break
            case 23:
                this.lockLb.setPosition(new Vec3(203, 48, 0))
                break

        }
    }

    protected onDestroy(): void {
        director.off("MERGE", this.SubIce, this)
        director.off("KEY", this.SubKey, this)
    }

    SubIce() {
        if (this.freezeNum == 0) return
        this.freezeNum -= 1
        this.freezeLb.string = this.freezeNum.toString()
        if (this.freezeNum == 0) {
            this.freezeLb.node.active = false
            this.freeNode.destroy()
            this.freeNode = null
        }
    }

    iniIconBlock() {
        let shape = this.getBlockShape()
        console.log(shape)
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] == 0) continue
                let icon = PoolManager.getInstance().getNode("iconBlock")
                icon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite("fish_" + this.colorIndex)
                console.log("fish_" + this.typeIndex)
                this.listIcon.addChild(icon)
                icon.setPosition(new Vec3(j * 100, i * 100))
                icon.setScale(0.7, 0.7, 0.7)
                icon.setPosition(icon.position.x + 100 * 0.3 / 2, icon.position.y + 100 * 0.3 / 2)
            }
        }
    }


    initIce(iceNumber) {
        if (iceNumber == 0) return
        this.freezeLb.node.active = true
        this.freezeLb.string = iceNumber
        this.freezeLb.node.position = new Vec3(this.node.getComponent(UITransform).width / 2, this.node.getComponent(UITransform).height / 2)
        let newIcon = instantiate(this.icon)
        this.listColor.addChild(newIcon)
        newIcon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_11_${this.typeIndex}`)
        this.freeNode = newIcon
        let nodeTransform = this.node.getComponent(UITransform)
        let dirTransform = this.freezeLb.node.getComponent(UITransform)
        switch (this.typeIndex) {
            case 1: case 2: case 3: case 4: case 5:
            case 18: case 19: case 20: case 21: case 23: case 22:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width) / 2, (nodeTransform.height - dirTransform.height) / 2);
                break;

            case 7: case 9: case 13: case 14: case 17:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.freezeLb.node.position.y);
                break;

            case 6: case 8: case 12: case 15: case 16:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.freezeLb.node.position.y);
                break;

            case 11:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.freezeLb.node.position.y);
                break;

            case 10:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                break;
        }
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
        this.mask.getComponent(UITransform).setContentSize(new Size(size.width + 20, size.height + 20))
        this.icon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_${this.colorIndex}_${this.typeIndex}`)
    }


    onTouchStart(event: EventTouch) {

        if (this.freeNode != null) return
        if (this.lockNumber > 0) return
        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        const touchedBlocks = IngameLogic.getInstance().getBlocksAtPosition(event.getUILocation());
        console.log(this.getClickedShapeCell(event))
        if (touchedBlocks.length === 0) return;
        const block = touchedBlocks[touchedBlocks.length - 1];
        this.sibilingCurrent = this.node.getSiblingIndex()
        // Skill logic
        if (IngameLogic.getInstance().typebooster == 1) {
            // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.DING)
            IngameLogic.getInstance().MagnetBlock(block.colorIndex);
            this.onBoosterFinish(event);
            return
        } else if (IngameLogic.getInstance().typebooster == 2) {
            IngameLogic.getInstance().HammerBlock(block);
            this.onBoosterFinish(event);
            return
        }
        else {
            if (IngameLogic.getInstance().typebooster == 3) {
                const hit = this.getClickedShapeCell(event);
                if (hit) {
                    this.breakCell(hit);
                    this.onBoosterFinish(event);
                    return;
                }
                return
            }
        }

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
    }

    onBoosterFinish(event: EventTouch) {
        IngameLogic.getInstance().typebooster = -1;
        IngameLogic.getInstance().isUseTool = false;
        event.propagationStopped = true;
    }

    /**
     * Xử lý sự kiện chạm di chuyển
     */
    isCanMove = true
    private onTouchMove(event: EventTouch) {
        const selectBlock = IngameLogic.getInstance().currentSelectBlock;
        if (this.freeNode != null) return
        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        if (selectBlock == null) return
        if (!selectBlock.isSelected) return;
        if (this.lockNumber > 0) return
        if (selectBlock.isCanMove == false) return
        const dir = this.get8Direction(event);

        // Tính toán vị trí mới
        const touchPos = selectBlock.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        let newPos: Vec3 = touchPos.subtract(
            selectBlock.touchOffset
        );
        // Lấy vị trí lưới hiện tại
        const currentGridPos = selectBlock.getCurrentGridPosition();

        const blockBgTransform = IngameLogic.getInstance().blockBg.getComponent(UITransform);
        // Tính toán biên cơ bản
        const minX = -blockBgTransform.contentSize.width / 2 + BLOCK_GAP;
        const minY = -blockBgTransform.contentSize.height / 2 + BLOCK_GAP;

        // Tính toán động biên có thể di chuyển thực tế
        const dynamicBounds = selectBlock.calculateShapeAwareBounds(currentGridPos);
        const cellSize = BLOCK_SIZE + BLOCK_GAP;
        // Chuyển đổi thành biên tọa độ thế giới
        const worldMinX = minX + dynamicBounds.minCol * cellSize;
        const worldMaxX = minX + dynamicBounds.maxCol * cellSize;
        const worldMinY = minY + dynamicBounds.minRow * cellSize;
        const worldMaxY = minY + dynamicBounds.maxRow * cellSize;

        // Giới hạn vị trí trong biên động
        if (selectBlock.dir == 1) {
            // log(selectBlock.initPos.x, selectBlock.originalPos.x)
            newPos.x = selectBlock.initPos.x; // Giữ vị trí x gốc
            newPos.y = misc.clampf(newPos.y, worldMinY, worldMaxY);
        } else if (selectBlock.dir == 2) {
            // log(selectBlock.initPos.y, selectBlock.originalPos.y)
            newPos.y = selectBlock.initPos.y; // Giữ vị trí y gốc
            newPos.x = misc.clampf(newPos.x, worldMinX, worldMaxX);
        } else {
            newPos.x = misc.clampf(newPos.x, worldMinX, worldMaxX);
            newPos.y = misc.clampf(newPos.y, worldMinY, worldMaxY);


        }



        // Áp dụng vị trí mới
        selectBlock.node.position = v3(newPos);

        event.propagationStopped = true;
    }


    /**
     * Xử lý sự kiện chạm kết thúc
     */
    private onTouchEnd(event: EventTouch) {

        if (this.freeNode != null) return
        if (IngameLogic.getInstance().status == ENUM_GAME_STATUS.UNRUNING) return
        if (IngameLogic.getInstance().currentSelectBlock == null) return
        if (!IngameLogic.getInstance().currentSelectBlock.isSelected) return;
        if (this.lockNumber > 0) return
        const block = IngameLogic.getInstance().currentSelectBlock;
        if (block.isCanMove == false) return

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
    private getFloatGridPosition(): { x: number, y: number } {
        const blockBg = IngameLogic.getInstance().blockBg;
        const uiTransform = blockBg.getComponent(UITransform);
        if (!uiTransform) return { x: 0, y: 0 };

        const startPos = v3(
            -uiTransform.contentSize.width / 2 + BLOCK_GAP,
            -uiTransform.contentSize.height / 2 + BLOCK_GAP,
            0
        );
        if (!this.node) return;
        const relativePos = this.node.position.clone().subtract(startPos);

        const cellSize = BLOCK_SIZE + BLOCK_GAP;

        const gridX = relativePos.x / cellSize;
        const gridY = relativePos.y / cellSize;

        return { x: gridX, y: gridY };
    }
    public getCurrentGridPosition(): { x: number, y: number } {
        const blockBg = IngameLogic.getInstance().blockBg;
        const uiTransform = blockBg.getComponent(UITransform);
        if (!uiTransform) return { x: 0, y: 0 };

        const startPos = v3(
            -uiTransform.contentSize.width / 2 + BLOCK_GAP,
            -uiTransform.contentSize.height / 2 + BLOCK_GAP,
            0
        );
        if (!this.node) return;
        const relativePos = this.node.position.clone().subtract(startPos);

        const cellSize = BLOCK_SIZE + BLOCK_GAP;
        function roundGrid(value: number): number {
            const base = Math.round(value / cellSize);

            //if (frac > 0.9) return base + 1;
            return base;
        }

        const gridX = roundGrid(relativePos.x);
        const gridY = roundGrid(relativePos.y);

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
        // tween(this.node)
        //     .to(moveTime, { position: targetPos3D }, { easing: 'quartOut' })
        //     .start();

        // // Chờ tween chạy xong
        // await delay(moveTime);

        this.node.setPosition(targetPos3D);
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
        this.dirNode.active = false
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
            const sprite = this.dirNode.getComponent(Sprite)!;
            sprite.spriteFrame = ResourcesManager.getInstance().getSprite(`PA_Up_Down_1_${this.dir}`);
            if (this.dir === 1) {
                this.dirNode.active = true
                this.dirNode.getComponent(UITransform).height = this.node.getComponent(UITransform).height


                // Vertical
                this.dirNode.active = true;

                switch (this.typeIndex) {
                    case 1: case 2: case 3: case 4: case 5:
                    case 18: case 19: case 20: case 21: case 23: case 22:
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
                    case 16: case 17: case 20: case 21: case 23: case 22:
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

        }
    }


    get8Direction(event: EventTouch): string {
        const delta = event.getDelta();
        const dx = delta.x;
        const dy = delta.y;

        if (dx === 0 && dy === 0) return "none";

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Chọn hướng theo độ lớn delta
        if (absDx > absDy * 2) {
            // chủ yếu theo X
            return dx > 0 ? "right" : "left";
        } else if (absDy > absDx * 2) {
            // chủ yếu theo Y
            return dy > 0 ? "up" : "down";
        } else {
            // hướng chéo
            if (dx > 0 && dy > 0) return "up-right";
            if (dx < 0 && dy > 0) return "up-left";
            if (dx < 0 && dy < 0) return "down-left";
            if (dx > 0 && dy < 0) return "down-right";
        }

        return "none"; // fallback
    }

    private getCells(): Vec2[] {
        const shape = this.getBlockShape();
        const cells: Vec2[] = [];
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) cells.push(new Vec2(x, y));
            }
        }
        return cells;
    }

    // ⭐ ADD: canonical key
    private toKey(cells: Vec2[]): string {
        const minX = Math.min(...cells.map(c => c.x));
        const minY = Math.min(...cells.map(c => c.y));
        const norm = cells.map(c => ({ x: c.x - minX, y: c.y - minY }))
            .sort((a, b) => a.y - b.y || a.x - b.x);
        return norm.map(c => `${c.x},${c.y}`).join("|");
    }

    // ⭐ ADD: tách nhóm liên thông
    private splitConnectedCells(cells: Vec2[]): Vec2[][] {
        const set = new Set(cells.map(c => `${c.x},${c.y}`));
        const visited = new Set<string>();
        const results: Vec2[][] = [];
        const dirs = [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 1), new Vec2(0, -1)];

        for (const c of cells) {
            const key = `${c.x},${c.y}`;
            if (visited.has(key)) continue;

            const comp: Vec2[] = [];
            const q: Vec2[] = [c];
            visited.add(key);

            while (q.length > 0) {
                const cur = q.shift()!;
                comp.push(cur);
                for (const d of dirs) {
                    const nx = cur.x + d.x;
                    const ny = cur.y + d.y;
                    const k = `${nx},${ny}`;
                    if (set.has(k) && !visited.has(k)) {
                        visited.add(k);
                        q.push(new Vec2(nx, ny));
                    }
                }
            }
            results.push(comp);
        }
        return results;
    }

    // ⭐ ADD: mapping lại shape mới
    private identifyShape(cells: Vec2[]): number {
        const key = this.toKey(cells);
        const dict = IngameLogic.getInstance().shapeDict;
        return dict.has(key) ? dict.get(key)! : -1;
    }

    // ⭐ ADD: update shape
    private updateShape(cells: Vec2[], newType: number) {
        IngameLogic.getInstance().updateBlockLimitData(this, false);

        // Tính toán lại vị trí grid dựa trên cells còn lại
        const minX = Math.min(...cells.map(c => c.x));
        const minY = Math.min(...cells.map(c => c.y));
        
        // Cập nhật vị trí grid mới
        this.xIndex = this.xIndex + minX;
        this.yIndex = this.yIndex + minY;

        // Cập nhật shape
        this.typeIndex = newType;
        this.initSprite();
        this.listIcon.removeAllChildren();
        this.iniIconBlock();

        // Tính vị trí mới trên UI
        const targetPos2D = v2(
            this.xIndex * (BLOCK_SIZE + BLOCK_GAP),
            this.yIndex * (BLOCK_SIZE + BLOCK_GAP)
        );
        const newUIPos = IngameLogic.getInstance().getRealPos(targetPos2D);
        this.node.setPosition(newUIPos);

        IngameLogic.getInstance().updateBlockLimitData(this, true);
    }

    // ⭐ ADD: remove block chuẩn
    private removeBlock() {
        IngameLogic.getInstance().updateBlockLimitData(this, false);
        this.node.destroy();
        IngameLogic.getInstance().blockClearNum++;
        IngameLogic.getInstance().checkGame();
    }

    // ⭐ ADD: spawn nhiều block khi chia
    private spawnFragments(groups: Vec2[][]) {
        const originX = this.xIndex;
        const originY = this.yIndex;

        for (const g of groups) {
            const newType = this.identifyShape(g);
            if (newType === -1) continue;

            // Tính min của nhóm để chuẩn hóa tọa độ block mới
            const minX = Math.min(...g.map(c => c.x));
            const minY = Math.min(...g.map(c => c.y));

            // Block mới sẽ đặt đúng vị trí cell ban đầu trên grid
            // Vị trí grid của block mới = vị trí block gốc + vị trí relative của mảnh
            const newGridX = originX + minX;
            const newGridY = originY + minY;

            // tạo node block mới
            const newBlockNode = PoolManager.getInstance().getNode('block', IngameLogic.getInstance().blockBg);
            const newBlock = newBlockNode.getComponent(block);

            newBlock.init(
                IngameLogic.getInstance().blockTotalNum++,
                newType,
                this.colorIndex,
                newGridX,
                newGridY,
                0,
                0,
                [],
                0,
                false,
                false,
                false
            );

            // Tính vị trí thực tế trên UI dựa trên grid position
            const targetPos2D = v2(
                newGridX * (BLOCK_SIZE + BLOCK_GAP),
                newGridY * (BLOCK_SIZE + BLOCK_GAP)
            );
            const uiPos = IngameLogic.getInstance().getRealPos(targetPos2D);
            newBlockNode.setPosition(uiPos);

            // đánh dấu chiếm diện grid
            IngameLogic.getInstance().updateBlockLimitData(newBlock, true);
        }
    }

    // ⭐ ADD: break cell
    public breakCell(hit: Vec2) {
        // hit.y đã là chỉ số "từ TRÊN xuống" rồi (do getHitCell đã chuyển đổi)
        const cells = this.getCells(); // getCells() cũng tạo (x,y) theo hàng trên xuống

        // Tìm đúng cell để xóa
        const idx = cells.findIndex(c => c.x === hit.x && c.y === hit.y);
        if (idx === -1) return;

        // Xóa ô bị phá
        cells.splice(idx, 1);

        // Không còn ô nào → xóa block
        if (cells.length === 0) {
            this.removeBlock();
            return;
        }

        // Tách các nhóm liên thông
        const groups = this.splitConnectedCells(cells);

        // Nếu chia thành nhiều mảnh → spawn mảnh mới rồi xóa block cũ
        if (groups.length > 1) {
            this.spawnFragments(groups);
            this.removeBlock();
            return;
        }

        // Còn đúng 1 mảnh → nhận diện shape mới
        const newType = this.identifyShape(groups[0]);
        if (newType === -1) {
            // Không khớp shape hợp lệ → xóa block (tùy gameplay bạn có thể đổi fallback)
            this.removeBlock();
            return;
        }

        // Cập nhật block hiện tại thành shape mới
        this.updateShape(groups[0], newType);

    }


    // ⭐ ADD: xác định cell bị nhấn
    private getHitCell(event: EventTouch): Vec2 | null {
        const ui = this.node.getComponent(UITransform)!;
        const shape = this.getBlockShape();
        const totalRows = shape.length;
        const totalCols = shape[0].length;

        // Anchor = (0,0): gốc ở góc trái DƯỚI
        const local = ui.convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y)
        );

        // Chuyển local XY → chỉ số cột/hàng tính từ DƯỚI lên
        const colFromLeft = Math.floor(local.x / BLOCK_SIZE);
        const rowFromBottom = Math.floor(local.y / BLOCK_SIZE);

        // Ngoài vùng block
        if (colFromLeft < 0 || rowFromBottom < 0) return null;
        if (colFromLeft >= totalCols || rowFromBottom >= totalRows) return null;

        // ĐỔI trục Y: getBlockShape() định nghĩa hàng 0 ở TRÊN CÙNG
        const rowFromTop = totalRows - 1 - rowFromBottom;

        // Ô này có tồn tại trong shape không
        if (shape[rowFromTop][colFromLeft] !== 1) return null;

        // Trả về (col, row) theo CHUẨN của shape (tức là row tính TỪ TRÊN XUỐNG)
        return new Vec2(colFromLeft, rowFromTop);
    }


    // ✅ GẮN logic phá vào Touch Start (chỉ THÊM, không sửa logic cũ)
    // onTouchStart(event: EventTouch) {
    //     const hit = this.getHitCell(event);
    //     if (hit) {
    //         this.breakCell(hit);
    //         event.propagationStopped = true;
    //         return;
    //     }

    //     // phần code cũ xử lý kéo block giữ nguyên...
    // }

    /**
     * Trả về đúng cell theo shape (row tính từ TRÊN xuống)
     */
    public getClickedShapeCell(event: EventTouch): Vec2 | null {
        const ui = this.node.getComponent(UITransform)!;
        const shape = this.getBlockShape();
        console.log(shape)

        const totalRows = shape.length;
        const totalCols = shape[0].length;
        console.log()
        // tọa độ click relative trong block (anchor = 0,0 = bottom-left)
        const local = ui.convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y)
        );

        const col = Math.floor(local.x / BLOCK_SIZE);
        const rowBottom = Math.floor(local.y / BLOCK_SIZE);
        console.log(col, rowBottom, local)
        // ngoài vùng block
        if (col < 0 || col >= totalCols) return null;
        if (rowBottom < 0 || rowBottom >= totalRows) return null;



        // check có ô không
        if (shape[rowBottom][col] !== 1) return null;

        return new Vec2(col, rowBottom);
    }


}


