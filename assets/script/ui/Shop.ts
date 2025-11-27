import { _decorator, Component, Node, Button, log, instantiate, Prefab } from 'cc';
import { IAPManager } from '../Manager/IAPManager';
import { buyCoinButton } from '../Shop/buyCoinButton';
import { IAP_SHOP } from '../Shop/ConfigIap';
const { ccclass, property } = _decorator;

@ccclass('Shop')
export class Shop extends Component {

    @property(Node)
    shopItemsContainer: Node = null;

    @property(Prefab)
    itemShop: Prefab = null

    @property(Button)
    restorePurchasesButton: Button = null;

    start() {
        this.initializeShopItems();
        this.setupRestoreButton();
    }

    /**
     * Khởi tạo các shop items
     */
    private initializeShopItems(): void {

        IAP_SHOP.forEach(e => {
            let item = instantiate(this.itemShop)
            this.shopItemsContainer.addChild(item)
            item.getComponent(buyCoinButton).init(e)
        })


        // if (this.shopItemsContainer) {
        //     const coinButtons = this.shopItemsContainer.getComponentsInChildren(buyCoinButton);

        //     // Setup từng coin button với product ID tương ứng
        //     coinButtons.forEach((button, index) => {
        //         const coinAmounts = [100, 500, 1000]; // Tương ứng với các gói coin
        //         if (index < coinAmounts.length) {
        //             button.setCoinAmount(coinAmounts[index]);
        //         }
        //     });
        // }
    }

    /**
     * Setup restore purchases button
     */
    private setupRestoreButton(): void {
        if (!this.restorePurchasesButton) {
            // Tìm restore button nếu không được set
            const restoreNode = this.node.getChildByName('restorePurchasesButton');
            if (restoreNode) {
                this.restorePurchasesButton = restoreNode.getComponent(Button);
            }
        }

        if (this.restorePurchasesButton) {
            this.restorePurchasesButton.node.on('click', this.onRestorePurchases, this);
        }
    }

    /**
     * Xử lý restore purchases
     */
    private async onRestorePurchases(): Promise<void> {
        log('Restoring purchases...');

        if (this.restorePurchasesButton) {
            this.restorePurchasesButton.interactable = false;
        }

        try {
            await IAPManager.getInstance().restorePurchases();
            log('Restore purchases completed');

            // TODO: Show success message
            // PopupManager.getInstance().showSuccess('Đã khôi phục giao dịch thành công!');

        } catch (error) {
            log('Restore purchases failed:', error);

            // TODO: Show error message
            // PopupManager.getInstance().showError('Không thể khôi phục giao dịch. Vui lòng thử lại.');

        } finally {
            if (this.restorePurchasesButton) {
                this.restorePurchasesButton.interactable = true;
            }
        }
    }

    /**
     * Đóng shop
     */
    BtnClose() {
        this.node.active = false;
    }

    /**
     * Refresh shop items khi có thay đổi
     */
    public refreshShop(): void {
        this.initializeShopItems();
    }

    /**
     * Kiểm tra và cập nhật trạng thái premium features
     */
    private checkPremiumStatus(): void {
        const iapManager = IAPManager.getInstance();

        // Kiểm tra nếu user đã mua remove ads
        if (iapManager.isAdsRemoved()) {
            // Ẩn ads hoặc cập nhật UI tương ứng
            log('Ads removed for this user');
        }

        // Kiểm tra nếu user là premium
        if (iapManager.isPremiumUser()) {
            // Cập nhật UI cho premium user
            log('Premium user detected');
        }
    }

    protected onEnable(): void {
        this.checkPremiumStatus();
    }
}


