import { _decorator, Component, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CallNative')
export class CallNative extends Component {
    public static CallIAP(productId: string) {
        // director.pause()
        if (sys.os === sys.OS.ANDROID) {
            native.reflection.callStaticMethod(
                "com/cocos/game/BillingManager",   // 👈 đường dẫn class
                "queryProduct",                    // tên hàm Java
                "(Ljava/lang/String;)V",        // signature (hàm nhận String, trả về void)
                productId
            );
        }
    }

}


