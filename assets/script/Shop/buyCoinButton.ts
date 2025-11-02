import { _decorator, Component, Label, Node, Button, log } from 'cc';
import { IAPManager, ProductInfo } from '../Manager/IAPManager';
const { ccclass, property } = _decorator;

@ccclass('buyCoinButton')
export class buyCoinButton extends Component {

    @property()
    coinAmount: number = 0;

    @property(Label)
    coinLabel: Label = null;

    @property(Label)
    priceLabel: Label = null;

    @property()
    productId: string = '';

    private button: Button = null;
    private productInfo: ProductInfo = null;

    start() {
        this.coinLabel.string = this.coinAmount.toString();
        this.button = this.getComponent(Button);
        this.loadProductInfo();
    }

    /**
     * Load thông tin sản phẩm và cập nhật UI
     */
    private loadProductInfo(): void {
        if (this.productId) {
            this.productInfo = IAPManager.getInstance().getProductInfo(this.productId);
            
            if (this.productInfo && this.priceLabel) {
                this.priceLabel.string = this.productInfo.price;
            } else if (this.priceLabel) {
                // Fallback price nếu không load được từ store
                this.priceLabel.string = this.getDefaultPrice();
            }
        }
    }

    /**
     * Lấy giá mặc định dựa trên coinAmount
     */
    private getDefaultPrice(): string {
        switch (this.coinAmount) {
            case 100: return '$0.99';
            case 500: return '$3.99';
            case 1000: return '$6.99';
            default: return '$0.99';
        }
    }

    /**
     * Xử lý khi button được click
     */
    public async onButtonClick(): Promise<void> {
        if (!this.productId) {
            log('Product ID not set for this button');
            return;
        }

        // Disable button để tránh spam click
        if (this.button) {
            this.button.interactable = false;
        }

        try {
            log(`Attempting to purchase: ${this.productId}`);
            
            const result = await IAPManager.getInstance().purchaseProduct(this.productId);
            
            if (result.success) {
                log(`Purchase successful: ${this.productId}`);
                this.onPurchaseSuccess();
            } else {
                log(`Purchase failed: ${result.error}`);
                this.onPurchaseFailed(result.error || 'Unknown error');
            }
            
        } catch (error) {
            log('Purchase error:', error);
            this.onPurchaseFailed(error.toString());
        } finally {
            // Re-enable button
            if (this.button) {
                this.button.interactable = true;
            }
        }
    }

    /**
     * Xử lý khi mua thành công
     */
    private onPurchaseSuccess(): void {
        // Có thể show popup thông báo thành công
        log(`Successfully purchased ${this.coinAmount} coins!`);
        
        // TODO: Show success popup/animation
        // PopupManager.getInstance().showSuccess(`Bạn đã mua ${this.coinAmount} xu thành công!`);
    }

    /**
     * Xử lý khi mua thất bại
     */
    private onPurchaseFailed(error: string): void {
        log(`Purchase failed: ${error}`);
        
        // TODO: Show error popup
        // PopupManager.getInstance().showError('Không thể thực hiện giao dịch. Vui lòng thử lại.');
    }

    /**
     * Set product ID và cập nhật thông tin
     */
    public setProductId(productId: string): void {
        this.productId = productId;
        this.loadProductInfo();
    }

    /**
     * Cập nhật coin amount và product ID tương ứng
     */
    public setCoinAmount(amount: number): void {
        this.coinAmount = amount;
        if (this.coinLabel) {
            this.coinLabel.string = amount.toString();
        }
        
        // Tự động set product ID dựa trên amount
        const iapManager = IAPManager.getInstance();
        switch (amount) {
            case 100:
                this.productId = iapManager.ProductIDs.COINS_100;
                break;
            case 500:
                this.productId = iapManager.ProductIDs.COINS_500;
                break;
            case 1000:
                this.productId = iapManager.ProductIDs.COINS_1000;
                break;
        }
        
        this.loadProductInfo();
    }
}

