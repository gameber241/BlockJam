import { _decorator, Component, Node } from 'cc';
import { BlockJamManager } from './Manager/BlockJamManager';
const { ccclass, property } = _decorator;

@ccclass('ReceiveMessageToNative')
export class ReceiveMessageToNative {
    PurchaseShop(productId: string) {
        console.log("PURCHASE")
        switch (productId) {
            case "com.block.colorjam.100":
                BlockJamManager.getInstance().updateScore(1000)
                break;
            case "com.block.colorjam.200":
                BlockJamManager.getInstance().updateScore(2000)
                break;
            case "com.block.colorjam.300":
                BlockJamManager.getInstance().updateScore(3000)
                break;
            case "com.block.colorjam.400":
                BlockJamManager.getInstance().updateScore(4000)
                break;
            case "com.block.colorjam.500":
                BlockJamManager.getInstance().updateScore(5000)
                break;
            case "com.block.colorjam.600":
                BlockJamManager.getInstance().updateScore(6000)
                break;
        }
    }

    CanceledPurchase() {
        console.log("PURCHASE_CANCLE")

    }
}


