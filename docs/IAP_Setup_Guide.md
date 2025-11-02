# In-App Purchase (IAP) Setup Guide cho Cocos Creator

## Tổng quan
Hệ thống In-App Purchase đã được tích hợp vào project BlockJam với các tính năng sau:
- Mua coins (100, 500, 1000)
- Remove ads
- Premium pack
- Restore purchases (iOS)

## Cấu trúc Files

### TypeScript Files:
- `assets/script/Manager/IAPManager.ts` - Manager chính xử lý IAP logic
- `assets/script/Shop/buyCoinButton.ts` - Component cho button mua coins
- `assets/script/ui/Shop.ts` - Controller cho UI Shop

### Native Files:
- `native/engine/android/app/src/com/cocos/game/IAPHelper.java` - Android IAP helper
- `native/engine/ios/IAPHelper.h` - iOS header file
- `native/engine/ios/IAPHelper.m` - iOS implementation

## Setup Instructions

### 1. Android Setup (Google Play Console)

#### 1.1 Cấu hình trong Google Play Console:
1. Đăng nhập vào [Google Play Console](https://play.google.com/console/)
2. Chọn app của bạn
3. Vào **Monetization > Products > In-app products**
4. Tạo các sản phẩm sau:

```
Product ID: com.blockjam.coins.100
Name: 100 Coins
Description: Get 100 coins for your game
Price: $0.99

Product ID: com.blockjam.coins.500
Name: 500 Coins
Description: Get 500 coins for your game
Price: $3.99

Product ID: com.blockjam.coins.1000
Name: 1000 Coins
Description: Get 1000 coins for your game
Price: $6.99

Product ID: com.blockjam.removeads
Name: Remove Ads
Description: Remove all advertisements
Price: $2.99

Product ID: com.blockjam.premium
Name: Premium Pack
Description: Premium pack with coins and features
Price: $9.99
```

#### 1.2 Cấu hình build.gradle:
Thêm vào `native/engine/android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.android.billingclient:billing:5.0.0'
}
```

#### 1.3 Cấu hình AndroidManifest.xml:
Thêm permission vào `native/engine/android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

### 2. iOS Setup (App Store Connect)

#### 2.1 Cấu hình trong App Store Connect:
1. Đăng nhập vào [App Store Connect](https://appstoreconnect.apple.com/)
2. Chọn app của bạn
3. Vào **Features > In-App Purchases**
4. Tạo các sản phẩm với cùng Product ID như Android

#### 2.2 Cấu hình Xcode Project:
1. Thêm `StoreKit.framework` vào project
2. Import các file IAPHelper.h và IAPHelper.m vào project
3. Cấu hình App Store Connect API key nếu cần

### 3. Cocos Creator Setup

#### 3.1 Service Configuration:
1. Mở Cocos Creator
2. Vào **Panel > Service**
3. Enable **Analytics** và các service cần thiết

#### 3.2 Build Settings:
Trong **Project > Build**:
- Android: Ensure Google Play Billing is enabled
- iOS: Ensure StoreKit capability is added

## Usage Examples

### Basic Purchase Flow:
```typescript
// Trong component button
public async onBuyCoins() {
    const result = await IAPManager.getInstance().purchaseProduct('com.blockjam.coins.100');
    if (result.success) {
        console.log('Purchase successful!');
    } else {
        console.log('Purchase failed:', result.error);
    }
}
```

### Check Premium Status:
```typescript
// Kiểm tra user đã mua premium chưa
if (IAPManager.getInstance().isPremiumUser()) {
    // Show premium features
}

// Kiểm tra đã remove ads chưa
if (IAPManager.getInstance().isAdsRemoved()) {
    // Hide ads
}
```

### Restore Purchases:
```typescript
// Restore purchases (chủ yếu cho iOS)
await IAPManager.getInstance().restorePurchases();
```

## Testing

### Android Testing:
1. Upload APK lên Google Play Console (Internal Testing)
2. Add test accounts trong Google Play Console
3. Test trên device với test account

### iOS Testing:
1. Use sandbox environment trong App Store Connect
2. Create sandbox tester accounts
3. Test trên device hoặc simulator

### Testing Product IDs:
Đảm bảo các Product ID trong code match với trong store:
```typescript
// Trong IAPManager.ts
private readonly PRODUCT_IDS = {
    COINS_100: 'com.blockjam.coins.100',    // Must match store
    COINS_500: 'com.blockjam.coins.500',    // Must match store
    // ...
};
```

## Troubleshooting

### Common Issues:

1. **"Product not found"**:
   - Kiểm tra Product ID có đúng không
   - Đảm bảo products đã được published trong store console

2. **"Billing service not available"**:
   - Kiểm tra device có Google Play Services
   - Đảm bảo app được signed properly

3. **"Cannot make payments"**:
   - Kiểm tra device settings cho in-app purchases
   - Đảm bảo có payment method trong account

### Debug Logs:
Enable debug logs trong native code:
```java
// Android
Log.d("IAP", "Debug message");
```

```objc
// iOS
NSLog(@"IAP Debug: %@", message);
```

## Security Notes

1. **Verify Purchases**: Always verify purchases server-side
2. **Receipt Validation**: Implement receipt validation cho production
3. **Store Encrypted Data**: Encrypt sensitive purchase data
4. **Handle Refunds**: Implement logic để handle refunds

## Production Checklist

- [ ] All products created in both stores
- [ ] Product IDs match between code and stores
- [ ] Receipt validation implemented
- [ ] Testing completed on both platforms
- [ ] Proper error handling implemented
- [ ] Analytics tracking added
- [ ] Terms of Service updated for purchases
- [ ] Privacy Policy updated for purchase data

## Support

Nếu có vấn đề:
1. Check console logs
2. Verify product setup in stores
3. Test với sandbox/test accounts trước
4. Review Apple/Google documentation cho specific errors

## Next Steps

1. Implement server-side receipt validation
2. Add analytics tracking cho purchase events
3. Implement promotional codes support
4. Add subscription products nếu cần
5. Implement offline purchase handling