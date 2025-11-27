import { _decorator, Component, Label, Node, Button, log, sys } from 'cc';
import { IAPManager, ProductInfo } from '../Manager/IAPManager';
import { CallNative } from '../CallNative';
import { BlockJamManager } from '../Manager/BlockJamManager';
const { ccclass, property } = _decorator;

@ccclass('buyCoinButton')
export class buyCoinButton extends Component {

    // @property()
    // coinAmount: number = 0;

    @property(Label)
    coinLabel: Label = null;

    @property(Label)
    priceLabel: Label = null;

    // @property()
    // productId: string = '';


    private button: Button = null;
    private productInfo: ProductInfo = null;

    start() {
        // this.coinLabel.string = this.coinAmount.toString();
        // this.button = this.getComponent(Button);
        // // this.loadProductInfo();
    }


    dataIAP = null

    init(dataIAP) {
        this.dataIAP = dataIAP
        this.coinLabel.string = dataIAP.quantity
        this.priceLabel.string = dataIAP.price
    }

    onClick() {
        if (sys.isNative)
            CallNative.CallIAP(this.dataIAP.id)
        else {
            BlockJamManager.getInstance().updateScore(this.dataIAP.quantity)
        }
    }

}


