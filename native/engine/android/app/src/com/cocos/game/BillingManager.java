package com.cocos.game;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BillingManager implements PurchasesUpdatedListener {
    private static BillingClient billingClient;
    private static Activity mainActivity;
    private static ProductDetails cachedProduct;

    // 🔹 Gọi từ Cocos: khởi tạo billing
    public static void init(Activity activity) {
        mainActivity = activity;

        if (billingClient != null && billingClient.isReady()) {
            Log.d("Billing", "BillingClient already initialized");
            return;
        }

        billingClient = BillingClient.newBuilder(activity)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .setListener(new BillingManager())
                .build();

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d("Billing", "Billing setup complete");
//                    queryProduct("com.fplay.cooking3d.bundle01");
                } else {
                    Log.e("Billing", "Billing setup failed: " + billingResult.getResponseCode());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                Log.w("Billing", "Billing service disconnected");
            }
        });
    }

    // 🔹 Gọi từ Cocos: Query product theo productId
    public static void queryProduct(String productId) {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.INAPP) // hoặc SUBS nếu là gói thuê bao
                        .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
            @Override
            public void onProductDetailsResponse(BillingResult billingResult, QueryProductDetailsResult result) {
                int code = billingResult.getResponseCode();
                String msg = billingResult.getDebugMessage();
                Log.d("Billing", "Query result: code=" + code + ", msg=" + msg);

                if (code == BillingClient.BillingResponseCode.OK && result != null) {
                    List<ProductDetails> productDetailsList = result.getProductDetailsList();
                    if (productDetailsList != null && !productDetailsList.isEmpty()) {
                        ProductDetails productDetails = productDetailsList.get(0);
                        Log.d("Billing", "✅ Product loaded: " + productDetails.getName());
                        launchPurchase(productDetails);
                    } else {
                        Log.e("Billing", "❌ Product list empty for id: " + productId);
                    }
                } else {
                    Log.e("Billing", "❌ Query failed: code=" + code + ", msg=" + msg);
                }
            }
        });
    }

    // 🔹 Gọi từ Cocos: Mua hàng
    public static void purchase(String productId) {
        if (billingClient == null || !billingClient.isReady()) {
            Log.e("Billing", "BillingClient not ready for purchase");
            return;
        }

        if (cachedProduct == null || !cachedProduct.getProductId().equals(productId)) {
            Log.w("Billing", "Product not cached, querying again...");
            queryProduct(productId);
            return;
        }

        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = List.of(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(cachedProduct)
                        .build()
        );

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();
//        mainActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LOCKED);

        BillingResult result = billingClient.launchBillingFlow(mainActivity, billingFlowParams);
//        mainActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);

        Log.d("Billing", "Launch purchase flow: " + result.getResponseCode());
    }

    // 🔹 Lắng nghe kết quả mua hàng

    public static void launchPurchase(ProductDetails productDetails) {
        if (billingClient == null || !billingClient.isReady() || mainActivity == null) {
            Log.e("Billing", "BillingClient not ready or activity is null");
            return;
        }

        // Tạo danh sách ProductDetailsParams
        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .build()
        );

        // Tạo BillingFlowParams
        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();

        // Launch Billing Flow → popup Google Play sẽ hiện lên
        BillingResult result = billingClient.launchBillingFlow(mainActivity, billingFlowParams);

        // Log kết quả
        if (result != null) {
            int code = result.getResponseCode();
            String msg = result.getDebugMessage();
            Log.d("Billing", "Launch purchase flow result: code=" + code + ", msg=" + msg);
        } else {
            Log.e("Billing", "Launch purchase flow failed: result is null");
        }
    }


    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {

                // Reset trạng thái sở hữu để mua lại lần sau
                ConsumeParams consumeParams = ConsumeParams.newBuilder()
                        .setPurchaseToken(purchase.getPurchaseToken())
                        .build();

                billingClient.consumeAsync(consumeParams, new ConsumeResponseListener() {
                    @Override
                    public void onConsumeResponse(@NonNull BillingResult result, @NonNull String purchaseToken) {

                        Log.d("Billing", "✅ Consume OK, response=" + result.getResponseCode());

                        List<String> productIds = purchase.getProducts();
                        for (String productId : productIds) {
                            CocosHelper.runOnGameThread(() -> {
                                String js = String.format("ReceiveMassageToNative.PurchaseShop('%s')", productId);
                                CocosJavascriptJavaBridge.evalString(js);
                            });
                        }
                    }
                });

            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            CocosHelper.runOnGameThread(() ->
                    CocosJavascriptJavaBridge.evalString("ReceiveMassageToNative.CanceledPurchase()")
            );
        } else {
            CocosHelper.runOnGameThread(() ->
                    CocosJavascriptJavaBridge.evalString("ReceiveMassageToNative.CanceledPurchase()")
            );
        }
    }


    public static void queryAllProducts() {
        List<String> productIds = Arrays.asList(
                // 🔹 Bundle Packs\
                "com.blockjam.100",
                "com.blockjam.200",
                "com.blockjam.300",
                "com.blockjam.400",
                "com.blockjam.500",
                "com.blockjam.600",
               
        );

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        for (String id : productIds) {
            productList.add(
                    QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(id)
                            .setProductType(BillingClient.ProductType.INAPP) // Tất cả đều là INAPP
                            .build()
            );
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
            @Override
            public void onProductDetailsResponse(BillingResult billingResult, QueryProductDetailsResult result) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    List<ProductDetails> list = result.getProductDetailsList();
                    if (list != null && !list.isEmpty()) {
                        Log.i("Billing", "✅ Found " + list.size() + " products:");
                        for (ProductDetails p : list) {
                            String price = p.getOneTimePurchaseOfferDetails() != null
                                    ? p.getOneTimePurchaseOfferDetails().getFormattedPrice()
                                    : "(no price)";
                            Log.i("Billing", "👉 " + p.getProductId() + " - " + p.getName() + " - " + price);
                        }
                    } else {
                        Log.e("Billing", "❌ Product list empty!");
                    }
                } else {
                    Log.e("Billing", "❌ Query failed: " + billingResult.getDebugMessage());
                }
            }
        });
    }


}