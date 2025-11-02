//
//  IAPHelper.h
//  BlockJam
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface IAPHelper : NSObject <SKProductsRequestDelegate, SKPaymentTransactionObserver>

+ (instancetype)sharedHelper;
+ (void)initializeIAP;
+ (NSString *)getProductInfo:(NSString *)productIdsJson;
+ (NSString *)purchaseProduct:(NSString *)productId;
+ (void)restorePurchases;

@property (nonatomic, strong) NSArray<SKProduct *> *products;
@property (nonatomic, assign) BOOL isInitialized;

@end

NS_ASSUME_NONNULL_END