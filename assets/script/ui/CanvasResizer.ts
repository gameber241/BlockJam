import { _decorator, Component, Node, ResolutionPolicy, UITransform, Enum, view, Vec2, Size, Vec3, macro, sys, native, Camera } from 'cc';
const { ccclass, property } = _decorator;

export enum EORIENTATION {
    AUTO,
    LANDSCAPE,
    PORTRAIT,
}
Enum(EORIENTATION);
@ccclass('UICanvasResizer')
export class UICanvasResizer extends Component {
    @property(UITransform)
    uiTransform: UITransform = null;

    @property(Camera)
    camera: Camera = null;
    @property()
    fixOrthoHeight: boolean = false;

    // @property(Node)
    // camera: Node = null;

    gameOrientation: EORIENTATION = EORIENTATION.PORTRAIT;

    originContentSize: Size = new Size(1, 1);
    originContentSizeAspect: number = 1;

    nodeScaleOrigin: Vec3 = new Vec3(1, 1, 1);

    lastFrameSize: Size = new Size(0, 0);


    protected onLoad(): void {
        if (!this.uiTransform) this.uiTransform = this.getComponent(UITransform);
        if (!this.uiTransform) return;
        this.init();

        view.on('canvas-resize', this.resizeFrame, this);
    }

    protected onDestroy(): void {
        view.off('canvas-resize', this.resizeFrame, this);

    }

    protected start(): void {
        this.scheduleOnce(() => this.resizeFrame(), 0.1);
    }

    init() {
        this.gameOrientation =
            this.uiTransform.width > this.uiTransform.height ?
                EORIENTATION.LANDSCAPE : EORIENTATION.PORTRAIT;

        this.nodeScaleOrigin.set(this.node.scale);
        this.originContentSize.set(this.uiTransform.contentSize);
        this.originContentSizeAspect = this.originContentSize.width / this.originContentSize.height;
        if(this.camera){
            if(!this.camera.originOrthoHeight) this.camera.originOrthoHeight = this.camera.orthoHeight;
            this.node.setParent(this.camera.node);
            this.node.setPosition(new Vec3(0, 0, -this.camera.node.position.z));
            this.camera.node.setSiblingIndex(this.camera.node.parent.children.length - 1);
        }
        
    }


    resizeFrame() {
        const displayFrameSize = view.getFrameSize();
        const currentFrameSize = new Size(displayFrameSize.width, this.camera? this.camera.orthoHeight : displayFrameSize.height);

        if (currentFrameSize.width == this.lastFrameSize.width && currentFrameSize.height == this.lastFrameSize.height) return;

        this.lastFrameSize.set(currentFrameSize);

        console.log(`Frame size: ${displayFrameSize.width}x${displayFrameSize.height}`);
        const frameSize = new Size(displayFrameSize.width * window.devicePixelRatio, displayFrameSize.height * window.devicePixelRatio);

        let currentOrientation =
            frameSize.width > frameSize.height ?
                EORIENTATION.LANDSCAPE : EORIENTATION.PORTRAIT;

        let isTogetherDir = currentOrientation === this.gameOrientation;
        if (isTogetherDir) view.setDesignResolutionSize(this.originContentSize.width, this.originContentSize.height, ResolutionPolicy.UNKNOWN);
        else view.setDesignResolutionSize(this.originContentSize.height, this.originContentSize.width, ResolutionPolicy.UNKNOWN);

        

        const shorterOrigin = this.originContentSize.width < this.originContentSize.height ? this.originContentSize.width : this.originContentSize.height;
        const shorterCurrent = frameSize.width < frameSize.height ? frameSize.width : frameSize.height;
        const longerOrigin = this.originContentSize.width > this.originContentSize.height ? this.originContentSize.width : this.originContentSize.height;
        const longerCurrent = frameSize.width > frameSize.height ? frameSize.width : frameSize.height;

        const currentAspect = shorterCurrent / longerCurrent;
        const originAspect = shorterOrigin / longerOrigin;
        let scaleCalculated = originAspect > currentAspect ? shorterOrigin / shorterCurrent : longerOrigin / longerCurrent;
        
        
        

        let newHeight = frameSize.height * scaleCalculated;
        let newWidth = frameSize.width * scaleCalculated;
        this.uiTransform.setContentSize(newWidth, newHeight);
        if (this.camera) {
            
            if(this.fixOrthoHeight) this.camera.orthoHeight = this.camera.originOrthoHeight / (newWidth / this.originContentSize.width);
            console.log(`Camera ortho height: ${this.camera.orthoHeight}`);
            let fitCamera = this.camera.orthoHeight / (newHeight / 2) ;
            this.camera.node.setScale(this.nodeScaleOrigin.x * fitCamera, this.nodeScaleOrigin.y * fitCamera, this.nodeScaleOrigin.z);
        }

        
        
        

        // if(isTogetherDir){
        //     scaleCalculated = (shorterCurrent / longerCurrent );
        // }
        // else{
        //     scaleCalculated = (frameSize.width / frameSize.height) / (this.originContentSize.height / this.originContentSize.width);
        // }
        //
        //if(!EDITOR) return;

        
        console.log(`Scale calculated: ${scaleCalculated}\nframeSize: ${frameSize}\n newWidth: ${newWidth}, newHeight: ${newHeight}`);

        console.log(`Device Info: \nwidth ${window.screen.width}px, height ${window.screen.height}px`);
        console.log(`innerWidth ${window.innerWidth}px, innerHeight ${window.innerHeight}px \nDevicePixelRatio ${window.devicePixelRatio}`);


    }
}

