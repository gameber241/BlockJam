//
//  IAPHelper.m
//  BlockJam
//

#import "IAPHelper.h"

@implementation IAPHelper

+ (instancetype)sharedHelper {
    static IAPHelper *sharedHelper = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedHelper = [[self alloc] init];
    });
    return sharedHelper;
}

+ (void)initializeIAP {
    IAPHelper *helper = [IAPHelper sharedHelper];
    [helper initialize];
}

- (void)initialize {
    if ([SKPaymentQueue canMakePayments]) {
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        [self requestProducts];
        self.isInitialized = YES;
        NSLog(@"IAP initialized successfully");
    } else {
        NSLog(@"In-App Purchase is not available on this device");
        self.isInitialized = NO;
    }
}

- (void)requestProducts {
    NSSet *productIdentifiers = [NSSet setWithObjects:
                                @"com.blockjam.coins.100",
                                @"com.blockjam.coins.500",
                                @"com.blockjam.coins.1000",
                                @"com.blockjam.removeads",
                                @"com.blockjam.premium",
                                nil];
    
    SKProductsRequest *request = [[SKProductsRequest alloc] initWithProductIdentifiers:productIdentifiers];
    request.delegate = self;
    [request start];
}

+ (NSString *)getProductInfo:(NSString *)productIdsJson {
    IAPHelper *helper = [IAPHelper sharedHelper];
    
    if (!helper.products || helper.products.count == 0) {
        return @"[]";
    }
    
    NSMutableArray *productInfoArray = [[NSMutableArray alloc] init];
    
    for (SKProduct *product in helper.products) {
        NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
        [numberFormatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
        [numberFormatter setNumberStyle:NSNumberFormatterCurrencyStyle];
        [numberFormatter setLocale:product.priceLocale];
        NSString *formattedPrice = [numberFormatter stringFromNumber:product.price];
        
        NSDictionary *productInfo = @{
            @"productId": product.productIdentifier,
            @"price": formattedPrice ?: @"$0.99",
            @"title": product.localizedTitle ?: @"",
            @"description": product.localizedDescription ?: @""
        };
        
        [productInfoArray addObject:productInfo];
    }
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:productInfoArray
                                                       options:0
                                                         error:&error];
    
    if (error) {
        NSLog(@"Error creating product info JSON: %@", error.localizedDescription);
        return @"[]";
    }
    
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

+ (NSString *)purchaseProduct:(NSString *)productId {
    IAPHelper *helper = [IAPHelper sharedHelper];
    
    if (!helper.isInitialized) {
        return @"{\"success\":false,\"productId\":\"%@\",\"error\":\"IAP not initialized\"}";
    }
    
    if (![SKPaymentQueue canMakePayments]) {
        return [NSString stringWithFormat:@"{\"success\":false,\"productId\":\"%@\",\"error\":\"Payments not allowed\"}", productId];
    }
    
    SKProduct *product = nil;
    for (SKProduct *p in helper.products) {
        if ([p.productIdentifier isEqualToString:productId]) {
            product = p;
            break;
        }
    }
    
    if (!product) {
        return [NSString stringWithFormat:@"{\"success\":false,\"productId\":\"%@\",\"error\":\"Product not found\"}", productId];
    }
    
    SKPayment *payment = [SKPayment paymentWithProduct:product];
    [[SKPaymentQueue defaultQueue] addPayment:payment];
    
    return [NSString stringWithFormat:@"{\"success\":true,\"productId\":\"%@\",\"message\":\"Purchase started\"}", productId];
}

+ (void)restorePurchases {
    [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
}

#pragma mark - SKProductsRequestDelegate

- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response {
    self.products = response.products;
    NSLog(@"Loaded %lu products", (unsigned long)self.products.count);
    
    for (NSString *invalidProductId in response.invalidProductIdentifiers) {
        NSLog(@"Invalid product identifier: %@", invalidProductId);
    }
}

- (void)request:(SKRequest *)request didFailWithError:(NSError *)error {
    NSLog(@"Products request failed: %@", error.localizedDescription);
}

#pragma mark - SKPaymentTransactionObserver

- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray<SKPaymentTransaction *> *)transactions {
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchased:
                [self completeTransaction:transaction];
                break;
            case SKPaymentTransactionStateFailed:
                [self failedTransaction:transaction];
                break;
            case SKPaymentTransactionStateRestored:
                [self restoreTransaction:transaction];
                break;
            case SKPaymentTransactionStateDeferred:
                NSLog(@"Transaction deferred: %@", transaction.payment.productIdentifier);
                break;
            case SKPaymentTransactionStatePurchasing:
                NSLog(@"Transaction purchasing: %@", transaction.payment.productIdentifier);
                break;
        }
    }
}

- (void)completeTransaction:(SKPaymentTransaction *)transaction {
    NSLog(@"Transaction completed: %@", transaction.payment.productIdentifier);
    
    // Deliver the purchased content
    [self deliverPurchaseForIdentifier:transaction.payment.productIdentifier
                           transaction:transaction];
    
    // Remove the transaction from the payment queue
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

- (void)restoreTransaction:(SKPaymentTransaction *)transaction {
    NSLog(@"Transaction restored: %@", transaction.originalTransaction.payment.productIdentifier);
    
    // Deliver the restored content
    [self deliverPurchaseForIdentifier:transaction.originalTransaction.payment.productIdentifier
                           transaction:transaction];
    
    // Remove the transaction from the payment queue
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

- (void)failedTransaction:(SKPaymentTransaction *)transaction {
    NSLog(@"Transaction failed: %@", transaction.error.localizedDescription);
    
    [self notifyPurchaseResult:NO
                     productId:transaction.payment.productIdentifier
                         error:transaction.error.localizedDescription];
    
    // Remove the transaction from the payment queue
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

- (void)deliverPurchaseForIdentifier:(NSString *)productIdentifier transaction:(SKPaymentTransaction *)transaction {
    // Notify the game about successful purchase
    [self notifyPurchaseResult:YES
                     productId:productIdentifier
                         error:nil];
}

- (void)notifyPurchaseResult:(BOOL)success productId:(NSString *)productId error:(NSString *)error {
    // Create result dictionary
    NSMutableDictionary *result = [@{
        @"success": @(success),
        @"productId": productId ?: @""
    } mutableCopy];
    
    if (!success && error) {
        result[@"error"] = error;
    }
    
    if (success) {
        result[@"purchaseToken"] = @"ios_purchase_token"; // iOS doesn't have purchase tokens like Android
    }
    
    // Convert to JSON
    NSError *jsonError;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:result
                                                       options:0
                                                         error:&jsonError];
    
    if (jsonError) {
        NSLog(@"Error creating purchase result JSON: %@", jsonError.localizedDescription);
        return;
    }
    
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
    // Call JavaScript callback
    NSString *jsCode = [NSString stringWithFormat:@"if(window.IAPCallback) { window.IAPCallback(%@); }", jsonString];
    
    // Execute JavaScript in main thread if you have WebView integration
    dispatch_async(dispatch_get_main_queue(), ^{
        // Execute JavaScript code here if needed
        NSLog(@"Would execute JS: %@", jsCode);
    });
}

- (void)paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue {
    NSLog(@"Restore completed successfully");
}

- (void)paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error {
    NSLog(@"Restore failed: %@", error.localizedDescription);
}

@end