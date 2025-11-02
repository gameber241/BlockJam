package com.cocos.game;

import android.app.Activity;
import android.util.Log;
import com.android.billingclient.api.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class IAPHelper implements PurchasesUpdatedListener, BillingClientStateListener {
    private static final String TAG = "IAPHelper";
    private static IAPHelper instance;
    private BillingClient billingClient;
    private Activity activity;
    private boolean isServiceConnected = false;
    private List<SkuDetails> skuDetailsList = new ArrayList<>();

    public static IAPHelper getInstance() {
        if (instance == null) {
            instance = new IAPHelper();
        }
        return instance;
    }

    public static void initializeIAP() {
        getInstance().initialize();
    }

    public void initialize() {
        activity = com.cocos.lib.CocosActivity.getInstance();
        if (activity == null) {
            Log.e(TAG, "Activity is null, cannot initialize IAP");
            return;
        }

        billingClient = BillingClient.newBuilder(activity)
                .setListener(this)
                .enablePendingPurchases()
                .build();

        billingClient.startConnection(this);
    }

    @Override
    public void onBillingSetupFinished(BillingResult billingResult) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
            isServiceConnected = true;
            Log.d(TAG, "Billing service connected successfully");
            querySkuDetails();
        } else {
            Log.e(TAG, "Billing setup failed: " + billingResult.getDebugMessage());
        }
    }

    @Override
    public void onBillingServiceDisconnected() {
        isServiceConnected = false;
        Log.w(TAG, "Billing service disconnected");
    }

    private void querySkuDetails() {
        List<String> skuList = new ArrayList<>();
        skuList.add("com.blockjam.coins.100");
        skuList.add("com.blockjam.coins.500");
        skuList.add("com.blockjam.coins.1000");
        skuList.add("com.blockjam.removeads");
        skuList.add("com.blockjam.premium");

        SkuDetailsParams.Builder params = SkuDetailsParams.newBuilder();
        params.setSkusList(skuList).setType(BillingClient.SkuType.INAPP);

        billingClient.querySkuDetailsAsync(params.build(),
                new SkuDetailsResponseListener() {
                    @Override
                    public void onSkuDetailsResponse(BillingResult billingResult,
                                                     List<SkuDetails> skuDetailsListResponse) {
                        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                            skuDetailsList = skuDetailsListResponse;
                            Log.d(TAG, "SKU details loaded: " + skuDetailsList.size() + " items");
                        } else {
                            Log.e(TAG, "Failed to query SKU details: " + billingResult.getDebugMessage());
                        }
                    }
                });
    }

    public static String getProductInfo(String productIdsJson) {
        try {
            JSONArray productInfoArray = new JSONArray();
            
            for (SkuDetails skuDetails : getInstance().skuDetailsList) {
                JSONObject productInfo = new JSONObject();
                productInfo.put("productId", skuDetails.getSku());
                productInfo.put("price", skuDetails.getPrice());
                productInfo.put("title", skuDetails.getTitle());
                productInfo.put("description", skuDetails.getDescription());
                productInfoArray.put(productInfo);
            }
            
            return productInfoArray.toString();
        } catch (JSONException e) {
            Log.e(TAG, "Error creating product info JSON", e);
            return "[]";
        }
    }

    public static String purchaseProduct(String productId) {
        IAPHelper helper = getInstance();
        JSONObject result = new JSONObject();
        
        try {
            if (!helper.isServiceConnected) {
                result.put("success", false);
                result.put("productId", productId);
                result.put("error", "Billing service not connected");
                return result.toString();
            }

            SkuDetails skuDetails = null;
            for (SkuDetails sku : helper.skuDetailsList) {
                if (sku.getSku().equals(productId)) {
                    skuDetails = sku;
                    break;
                }
            }

            if (skuDetails == null) {
                result.put("success", false);
                result.put("productId", productId);
                result.put("error", "Product not found");
                return result.toString();
            }

            BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                    .setSkuDetails(skuDetails)
                    .build();

            BillingResult billingResult = helper.billingClient.launchBillingFlow(
                    helper.activity, billingFlowParams);

            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                result.put("success", true);
                result.put("productId", productId);
                result.put("message", "Purchase flow started");
            } else {
                result.put("success", false);
                result.put("productId", productId);
                result.put("error", "Failed to start purchase flow: " + billingResult.getDebugMessage());
            }

        } catch (JSONException e) {
            Log.e(TAG, "Error creating purchase result JSON", e);
        }

        return result.toString();
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "Purchase canceled by user");
            notifyPurchaseResult(false, "", "User canceled");
        } else {
            Log.e(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            notifyPurchaseResult(false, "", billingResult.getDebugMessage());
        }
    }

    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            // Verify the purchase
            // Ideally, verify purchase on your backend server
            
            // Acknowledge the purchase
            if (!purchase.isAcknowledged()) {
                AcknowledgePurchaseParams acknowledgePurchaseParams =
                        AcknowledgePurchaseParams.newBuilder()
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();
                
                billingClient.acknowledgePurchase(acknowledgePurchaseParams,
                        new AcknowledgePurchaseResponseListener() {
                            @Override
                            public void onAcknowledgePurchaseResponse(BillingResult billingResult) {
                                Log.d(TAG, "Purchase acknowledged: " + billingResult.getResponseCode());
                            }
                        });
            }

            Log.d(TAG, "Purchase successful: " + purchase.getSkus());
            notifyPurchaseResult(true, purchase.getSkus().get(0), purchase.getPurchaseToken());
        }
    }

    private void notifyPurchaseResult(boolean success, String productId, String token) {
        // Notify Cocos2d-x about the purchase result
        // This would typically call back to your JavaScript/TypeScript code
        try {
            JSONObject result = new JSONObject();
            result.put("success", success);
            result.put("productId", productId);
            if (success) {
                result.put("purchaseToken", token);
            } else {
                result.put("error", token); // token contains error message when success is false
            }
            
            // Call JavaScript function to handle the result
            String jsCode = "if(window.IAPCallback) { window.IAPCallback(" + result.toString() + "); }";
            
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // Execute JavaScript code in WebView if available
                    // This depends on your Cocos2d-x setup
                }
            });
            
        } catch (JSONException e) {
            Log.e(TAG, "Error creating purchase result notification", e);
        }
    }

    public static void restorePurchases() {
        IAPHelper helper = getInstance();
        if (!helper.isServiceConnected) {
            Log.e(TAG, "Cannot restore purchases: billing service not connected");
            return;
        }

        Purchase.PurchasesResult purchasesResult = helper.billingClient.queryPurchases(BillingClient.SkuType.INAPP);
        List<Purchase> purchases = purchasesResult.getPurchasesList();
        
        if (purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    // Restore the purchase
                    helper.handlePurchase(purchase);
                }
            }
        }
        
        Log.d(TAG, "Restore purchases completed");
    }
}