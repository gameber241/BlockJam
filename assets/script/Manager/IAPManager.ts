import { _decorator, Component, sys, log } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { BlockJamManager } from './BlockJamManager';

const { ccclass, property } = _decorator;

// Interface cho product information
export interface ProductInfo {
    productId: string;
    price: string;
    title: string;
    description: string;
}

// Interface cho purchase result
export interface PurchaseResult {
    success: boolean;
    productId: string;
    orderId?: string;
    purchaseToken?: string;
    error?: string;
}

@ccclass('IAPManager')
export class IAPManager extends BaseSingleton<IAPManager> {
    

    public readonly isTesting: boolean = true;

    private isInitialized: boolean = false;
    private productList: ProductInfo[] = [];
    
    // Danh sách các product ID trong game của bạn
    private readonly PRODUCT_IDS = {
        COINS_100: 'com.blockjam.coins.100',
        COINS_500: 'com.blockjam.coins.500',
        COINS_1000: 'com.blockjam.coins.1000',
        REMOVE_ADS: 'com.blockjam.removeads',
        PREMIUM_PACK: 'com.blockjam.premium'
    };

    protected onLoad() {
        super.onLoad();
        this.initializeIAP();
    }

    /**
     * Khởi tạo In-App Purchase
     */
    private async initializeIAP(): Promise<void> {
        try {
            // Kiểm tra platform có hỗ trợ IAP không
            if (!this.isPlatformSupported()) {
                log('IAP not supported on this platform');
                return;
            }

            // Khởi tạo IAP service (tùy thuộc vào platform)
            if (sys.platform === sys.Platform.ANDROID) {
                await this.initializeAndroidIAP();
            } else if (sys.platform === sys.Platform.IOS) {
                await this.initializeIOSIAP();
            }

            this.isInitialized = true;
            log('IAP initialized successfully');
            
            // Load thông tin sản phẩm
            await this.loadProductInfo();
            
        } catch (error) {
            log('Failed to initialize IAP:', error);
        }
    }

    /**
     * Kiểm tra platform có hỗ trợ IAP
     */
    private isPlatformSupported(): boolean {
        return sys.platform === sys.Platform.ANDROID || 
               sys.platform === sys.Platform.IOS;
    }

    /**
     * Khởi tạo IAP cho Android (Google Play Billing)
     */
    private async initializeAndroidIAP(): Promise<void> {
        // Sử dụng Cocos Service hoặc native plugin
        if (typeof window !== 'undefined' && (window as any).jsb) {
            // Native call cho Android
            (window as any).jsb.reflection.callStaticMethod(
                'com/cocos/game/IAPHelper',
                'initializeIAP',
                '()V'
            );
        }
    }

    /**
     * Khởi tạo IAP cho iOS (StoreKit)
     */
    private async initializeIOSIAP(): Promise<void> {
        // Sử dụng Cocos Service hoặc native plugin
        if (typeof window !== 'undefined' && (window as any).jsb) {
            // Native call cho iOS
            (window as any).jsb.reflection.callStaticMethod(
                'IAPHelper',
                'initializeIAP'
            );
        }
    }

    /**
     * Load thông tin sản phẩm từ store
     */
    private async loadProductInfo(): Promise<void> {
        try {
            const productIds = [
                this.PRODUCT_IDS.COINS_100,
                this.PRODUCT_IDS.COINS_500,
                this.PRODUCT_IDS.COINS_1000,
                this.PRODUCT_IDS.REMOVE_ADS,
                this.PRODUCT_IDS.PREMIUM_PACK
            ];
            
            if (sys.platform === sys.Platform.ANDROID) {
                // Call native Android method
                const result = (window as any).jsb?.reflection.callStaticMethod(
                    'com/cocos/game/IAPHelper',
                    'getProductInfo',
                    '(Ljava/lang/String;)Ljava/lang/String;',
                    JSON.stringify(productIds)
                );
                
                if (result) {
                    this.productList = JSON.parse(result);
                }
            } else if (sys.platform === sys.Platform.IOS) {
                // Call native iOS method
                const result = (window as any).jsb?.reflection.callStaticMethod(
                    'IAPHelper',
                    'getProductInfo:',
                    JSON.stringify(productIds)
                );
                
                if (result) {
                    this.productList = JSON.parse(result);
                }
            }
            
            log('Product info loaded:', this.productList);
        } catch (error) {
            log('Failed to load product info:', error);
        }
    }

    /**
     * Mua sản phẩm
     */
    public async purchaseProduct(productId: string): Promise<PurchaseResult> {
        if (!this.isInitialized) {
            return {
                success: false,
                productId,
                error: 'IAP not initialized'
            };
        }

        try {
            let result: string = '';
            
            if (sys.platform === sys.Platform.ANDROID) {
                result = (window as any).jsb?.reflection.callStaticMethod(
                    'com/cocos/game/IAPHelper',
                    'purchaseProduct',
                    '(Ljava/lang/String;)Ljava/lang/String;',
                    productId
                ) || '';
            } else if (sys.platform === sys.Platform.IOS) {
                result = (window as any).jsb?.reflection.callStaticMethod(
                    'IAPHelper',
                    'purchaseProduct:',
                    productId
                ) || '';
            }

            const purchaseResult: PurchaseResult = result ? JSON.parse(result) : {
                success: false,
                productId,
                error: 'No response from native'
            };

            if (purchaseResult.success) {
                await this.handleSuccessfulPurchase(productId, purchaseResult);
            }

            return purchaseResult;
            
        } catch (error) {
            log('Purchase failed:', error);
            return {
                success: false,
                productId,
                error: error.toString()
            };
        }
    }

    /**
     * Xử lý khi mua thành công
     */
    private async handleSuccessfulPurchase(productId: string, result: PurchaseResult): Promise<void> {
        const blockJamManager = BlockJamManager.getInstance();
        
        switch (productId) {
            case this.PRODUCT_IDS.COINS_100:
                blockJamManager.coin += 100;
                break;
            case this.PRODUCT_IDS.COINS_500:
                blockJamManager.coin += 500;
                break;
            case this.PRODUCT_IDS.COINS_1000:
                blockJamManager.coin += 1000;
                break;
            case this.PRODUCT_IDS.REMOVE_ADS:
                // Xử lý remove ads
                sys.localStorage.setItem('REMOVE_ADS', 'true');
                break;
            case this.PRODUCT_IDS.PREMIUM_PACK:
                // Xử lý premium pack
                blockJamManager.coin += 2000;
                sys.localStorage.setItem('PREMIUM_USER', 'true');
                break;
        }
        
        // Lưu game data
        blockJamManager.save();
        
        // Cập nhật UI
        if (blockJamManager.menuLayer) {
            blockJamManager.menuLayer.UpdateCoin();
        }
        
        log(`Successfully handled purchase for ${productId}`);
    }

    /**
     * Khôi phục purchases (cho iOS và non-consumable products)
     */
    public async restorePurchases(): Promise<void> {
        if (!this.isInitialized) {
            log('IAP not initialized');
            return;
        }

        try {
            if (sys.platform === sys.Platform.ANDROID) {
                (window as any).jsb?.reflection.callStaticMethod(
                    'com/cocos/game/IAPHelper',
                    'restorePurchases',
                    '()V'
                );
            } else if (sys.platform === sys.Platform.IOS) {
                (window as any).jsb?.reflection.callStaticMethod(
                    'IAPHelper',
                    'restorePurchases'
                );
            }
        } catch (error) {
            log('Failed to restore purchases:', error);
        }
    }

    /**
     * Lấy thông tin sản phẩm
     */
    public getProductInfo(productId: string): ProductInfo | null {
        return this.productList.find(product => product.productId === productId) || null;
    }

    /**
     * Lấy tất cả thông tin sản phẩm
     */
    public getAllProductInfo(): ProductInfo[] {
        return this.productList;
    }

    /**
     * Kiểm tra xem có phải premium user không
     */
    public isPremiumUser(): boolean {
        return sys.localStorage.getItem('PREMIUM_USER') === 'true';
    }

    /**
     * Kiểm tra xem đã remove ads chưa
     */
    public isAdsRemoved(): boolean {
        return sys.localStorage.getItem('REMOVE_ADS') === 'true';
    }

    // Getter cho product IDs
    public get ProductIDs() {
        return this.PRODUCT_IDS;
    }
}