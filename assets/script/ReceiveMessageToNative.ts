import { _decorator, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReceiveMessageToNative')
export class ReceiveMessageToNative {
    PurchaseShop(productId: string) {
        console.log("PURCHASE:", productId)
        
        // Gửi event thay vì gọi trực tiếp để tránh circular dependency
        let coins = 0;
        switch (productId) {
            case "com.block.colorjam.100":
                coins = 1000;
                break;
            case "com.block.colorjam.200":
                coins = 2000;
                break;
            case "com.block.colorjam.300":
                coins = 3000;
                break;
            case "com.block.colorjam.400":
                coins = 4000;
                break;
            case "com.block.colorjam.500":
                coins = 5000;
                break;
            case "com.block.colorjam.600":
                coins = 6000;
                break;
        }
        
        if (coins > 0) {
            // Emit event để BlockJamManager xử lý
            director.emit("PURCHASE_SUCCESS", coins);
        }
    }

    CanceledPurchase() {
        console.log("PURCHASE_CANCEL")
    }
}


