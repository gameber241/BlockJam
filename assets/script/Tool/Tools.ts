import { _decorator, Button, Component, EditBox, Input, Node, Size, Sprite, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { PoolManager } from '../Manager/PoolManager';
import { BLOCK_GAP, BLOCK_SIZE } from '../ingame/IngameLogic';
import { BaseSingleton } from '../Base/BaseSingleton';
import { BlockBgTool } from './BlockBgTool';
import { BlockTool } from './BlockTool';
import { SelectIdBlock } from './SelectIdBlock';
import { SelectIdWall } from './SelectIdWall';
import { border } from '../ingame/border';
import { SelectIdExit } from './SelectIdExit';
import { WallTool } from './WallTool';
import { ExitTool } from './ExitTool';
const { ccclass, property } = _decorator;

@ccclass('Tools')
export class Tools extends BaseSingleton<Tools> {
    @property(Node)
    loading: Node = null
    async start() {
        await ResourcesManager.getInstance().loadAllResources()
        this.loading.active = false
        this.selectIdBlock.init()
        this.selectIdWall.init()
        this.selectIdExit.init()
    }

    @property(EditBox)
    row: EditBox = null

    @property(EditBox)
    col: EditBox = null


    @property(EditBox)
    sizeExit: EditBox = null

    @property(Node)
    blockBg: Node = null

    @property(Node)
    blocks: Node = null

    @property(EditBox)
    ice: EditBox = null

    @property(EditBox)
    lockNumber: EditBox = null

    @property(SelectIdBlock)
    selectIdBlock: SelectIdBlock = null

    @property(SelectIdWall)
    selectIdWall: SelectIdWall = null
    @property(SelectIdExit)
    selectIdExit: SelectIdExit = null


    rowNumber: number = 0

    colNumber: number = 0

    idBlock: number = 1
    idColor: number = 1
    colSelect: number = 0
    rowSelect: number = 0
    idDirector: number = 0
    idColorSub: number = 1
    isStar = false
    blocSelect = null
    wallSelect = null
    exitSelect = null

    idWall: number = 1
    idExit: number = 1
    idColorExit: number = 1
    isDrag: boolean = false
    isKey: boolean = false
    isStarExit: boolean = false
    board = []
    init() {
        this.board = []
        this.blockBg.destroyAllChildren()
        this.blocks.destroyAllChildren()
        this.rowNumber = Number(this.row.string)
        this.colNumber = Number(this.col.string)
        let sizeBg = new Size(this.colNumber * 100, this.rowNumber * 100)
        this.blockBg.getComponent(UITransform).setContentSize(sizeBg)
        this.initBlockBg()
        for (let i = 0; i < this.rowNumber; i++) {
            this.board.push([])
            for (let j = 0; j < this.colNumber; j++) {
                this.board[i].push(1)
            }
        }
    }

    initBlockBg() {
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)
        for (let i = 0; i < this.rowNumber; i++) {
            for (let j = 0; j < this.colNumber; j++) {
                const blockBgNode = PoolManager.getInstance().getNode('blockBgTool', this.blockBg)
                blockBgNode.getComponent(UITransform).width = blockBgNode.getComponent(UITransform).height = BLOCK_SIZE
                // blockBgNode.getChildByName('test_label').getComponent(Label).string = `x${j}:y${i}`
                const x = startPos.x + BLOCK_SIZE * j + BLOCK_GAP * j + BLOCK_SIZE / 2 + BLOCK_GAP
                const y = startPos.y + BLOCK_SIZE * i + BLOCK_GAP * i + BLOCK_SIZE / 2 + BLOCK_GAP
                blockBgNode.setPosition(v3(x, y))
                blockBgNode.getComponent(BlockBgTool).init(j, i)
                blockBgNode.getComponent(UIOpacity).opacity = 100

            }
        }
    }

    BtnAdd() {
        this.blockBg.setSiblingIndex(99)
        this.blockBg.children.forEach(e => {
            e.getComponent(UIOpacity).opacity = 200
            e.getComponent(BlockBgTool).isClick = true
            e.getComponent(BlockBgTool).isClickWall = false
            e.getComponent(BlockBgTool).isExit = false

        })

    }

    CreateBlock() {
        // this.blocks.setSiblingIndex(99)
        // this.blockBg.children.forEach(e => {
        //     e.getComponent(UIOpacity).opacity = 100
        //     e.getComponent(BlockBgTool).isClick = false
        //     e.getComponent(BlockBgTool).isClickWall = false
        //     e.getComponent(BlockBgTool).isExit = false


        // })
        const blockTool = PoolManager.getInstance().getNode('blockTool', this.blocks)
        const x = this.colSelect * (BLOCK_SIZE + BLOCK_GAP)
        const y = this.rowSelect * (BLOCK_SIZE + BLOCK_GAP)
        const pos = this.getRealPos(v2(x, y))
        blockTool.setPosition(pos)
        blockTool.getComponent(BlockTool).init(this.colSelect, this.rowSelect, this.idBlock, this.idColor, this.idDirector, this.idColorSub, Number(this.ice.string), this.isKey, this.isDrag, Number(this.lockNumber.string), [], this.isStar)
    }

    getRealPos(pos: Vec2) {
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2 + BLOCK_GAP, -this.blockBg.getComponent(UITransform).height / 2 + BLOCK_GAP)
        const x = startPos.x + pos.x
        const y = startPos.y + pos.y
        return new Vec3(x, y)
    }

    RemvoveBlock() {
        if (this.blocSelect) {
            this.blocSelect.destroy()
            this.blocSelect = null
        }
    }

    BtnAddWall() {
        this.blockBg.setSiblingIndex(99)
        this.blockBg.children.forEach(e => {
            e.getComponent(UIOpacity).opacity = 200
            e.getComponent(BlockBgTool).isClickWall = true
            e.getComponent(BlockBgTool).isClick = false
            e.getComponent(BlockBgTool).isExit = false



        })
    }

    CreateWall() {
        // this.blocks.setSiblingIndex(99)
        // this.blockBg.children.forEach(e => {
        //     e.getComponent(UIOpacity).opacity = 100
        //     e.getComponent(BlockBgTool).isClick = false
        //     e.getComponent(BlockBgTool).isClickWall = false
        //     e.getComponent(BlockBgTool).isExit = false

        // })
        const startPos = v2(-this.blockBg.getComponent(UITransform).width / 2, -this.blockBg.getComponent(UITransform).height / 2)
        const borderNode = PoolManager.getInstance().getNode('wallTool', this.blocks)
        this.setBorderSpriteFrame(borderNode, "wall_" + this.idWall)
        const x = startPos.x + BLOCK_SIZE * this.colSelect + BLOCK_SIZE / 2
        const y = startPos.y + BLOCK_SIZE * this.rowSelect + BLOCK_SIZE / 2
        borderNode.getComponent(WallTool).init(this.idWall, v3(x, y), this.colSelect, this.rowSelect)
        borderNode.on(Input.EventType.TOUCH_END, () => {
            this.wallSelect = borderNode
        }, this)
    }
    private setBorderSpriteFrame(node: Node, frameName: string) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;

        const spriteFrame = ResourcesManager.getInstance().getSprite(frameName);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    }
    DeleteWall() {
        if (this.wallSelect) {
            this.wallSelect.destroy()
            this.wallSelect = null
        }
    }

    CreateExit() {
        // this.blocks.setSiblingIndex(99)
        // this.blockBg.children.forEach(e => {
        //     e.getComponent(UIOpacity).opacity = 100
        //     e.getComponent(BlockBgTool).isClick = false
        //     e.getComponent(BlockBgTool).isClickWall = false
        //     e.getComponent(BlockBgTool).isExit = false

        // })
        const exit = PoolManager.getInstance().getNode('exitTool', this.blocks)
        const x = this.colSelect * (BLOCK_SIZE + BLOCK_GAP)
        const y = this.rowSelect * (BLOCK_SIZE + BLOCK_GAP)
        const pos = this.getRealPos(v2(x, y))
        exit.setPosition(pos)

        // exit.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`exit_${this.idColorExit}_${this.idExit}`)
        exit.getComponent(ExitTool).init(this.idExit, this.colSelect, this.rowSelect, Number(this.sizeExit.string), this.idColorExit, this.isStarExit)
        exit.on(Input.EventType.TOUCH_END, () => {
            this.exitSelect = exit
        }, this)
    }

    BtnAddExit() {
        this.blockBg.setSiblingIndex(99)
        this.blockBg.children.forEach(e => {
            e.getComponent(UIOpacity).opacity = 200
            e.getComponent(BlockBgTool).isClickWall = false
            e.getComponent(BlockBgTool).isClick = false
            e.getComponent(BlockBgTool).isExit = true
        })
    }

    DeleteExt() {
        if (this.exitSelect) {
            this.exitSelect.destroy()
            this.exitSelect = null
        }
    }



    BtnSave() {
        let data = {
            "rowNum": this.rowNumber,
            "colNum": this.colNumber,
            "board": this.board,
            "border": [],
            "blocks": [],  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            "exits": []
        }


        this.blocks.children.forEach(e => {
            if (e.getComponent(BlockTool)) {
                data.blocks.push(e.getComponent(BlockTool).GenerateData())
            }
            if (e.getComponent(WallTool)) {
                data.border.push(e.getComponent(WallTool).GenerateData())
            }
            if (e.getComponent(ExitTool)) {
                data.exits.push(e.getComponent(ExitTool).GenerateData())
            }

        })

        console.log(data)
    }

    SuccessChoose() {
        this.blocks.setSiblingIndex(99)
        this.blockBg.children.forEach(e => {
            e.getComponent(UIOpacity).opacity = 100
            e.getComponent(BlockBgTool).isClick = false
            e.getComponent(BlockBgTool).isClickWall = false
            e.getComponent(BlockBgTool).isExit = false
            this.isChooseEmpltyWall = false
        })
    }

    isChooseEmpltyWall = false
    BtnEmptyWall() {
        this.isChooseEmpltyWall = true
        this.blockBg.setSiblingIndex(99)
        this.blockBg.children.forEach(e => {
            e.getComponent(UIOpacity).opacity = 200
            e.getComponent(BlockBgTool).isClickWall = false
            e.getComponent(BlockBgTool).isClick = false
            e.getComponent(BlockBgTool).isExit = false



        })
    }


    BtnIsKey(target, args) {
        if (this.isKey == false) {
            this.isKey = true
            target.target.getComponent(UIOpacity).opacity = 100
        }
        else {
            this.isKey = false
            target.target.getComponent(UIOpacity).opacity = 255
        }
    }

    btnIsDrag(target, args) {
        if (this.isDrag == false) {
            this.isDrag = true
            target.target.getComponent(UIOpacity).opacity = 100
        }
        else {
            this.isDrag = false
            target.target.getComponent(UIOpacity).opacity = 255
        }
    }

    BtnIsStarBlock(target, args) {
        if (this.isStar == false) {
            this.isStar = true
            target.target.getComponent(UIOpacity).opacity = 100
        }
        else {
            this.isStar = false
            target.target.getComponent(UIOpacity).opacity = 255
        }
    }

    BtnIsStarExit(target, args) {
        if (this.isStarExit == false) {
            this.isStarExit = true
            target.target.getComponent(UIOpacity).opacity = 100
        }
        else {
            this.isStarExit = false
            target.target.getComponent(UIOpacity).opacity = 255
        }
    }
}


