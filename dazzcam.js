// ============================================================
// Dazz Cam Pro Unlock (iTunes verifyReceipt)
// Endpoint: https://buy.itunes.apple.com/verifyReceipt
// Dùng cho: Shadowrocket / Surge / Loon / Quantumult X
// Tác giả: @camtu
// ============================================================

const headers = $request.headers || {};
const ua = (headers["User-Agent"] || headers["user-agent"] || "").toLowerCase();
const body = $response.body;

if (!body) {
  $done({});
} else {
  try {
    const obj = JSON.parse(body);
    const bundleId = (obj.receipt && obj.receipt.bundle_id ? obj.receipt.bundle_id : "").toLowerCase();

    // Chỉ can thiệp khi đúng là Dazz Cam để tránh xung đột với app khác
    if (ua.includes("dazz") || bundleId.includes("dazz")) {
      const productIds = [
        "dazzpro",
        "dazz_pro",
        "dazz_pro_year",
        "dazz_pro_forever",
        "com.dazz.pro.year",
        "com.dazz.pro.forever"
      ];

      const purchaseDate = "2024-01-01 00:00:00 Etc/GMT";
      const purchaseDatePst = "2023-12-31 16:00:00 America/Los_Angeles";
      const purchaseMs = "1704067200000";

      const expiresDate = "2099-09-09 09:09:09 Etc/GMT";
      const expiresDatePst = "2099-09-09 02:09:09 America/Los_Angeles";
      const expiresMs = "4092599349000";

      const items = productIds.map((pid, idx) => ({
        quantity: "1",
        purchase_date_ms: purchaseMs,
        expires_date: expiresDate,
        expires_date_pst: expiresDatePst,
        is_in_intro_offer_period: "false",
        transaction_id: `49000131452000${idx + 1}`,
        is_trial_period: "false",
        original_transaction_id: `49000131452000${idx + 1}`,
        purchase_date: purchaseDate,
        product_id: pid,
        original_purchase_date_pst: purchaseDatePst,
        in_app_ownership_type: "PURCHASED",
        original_purchase_date_ms: purchaseMs,
        web_order_line_item_id: `49000012345678${idx + 1}`,
        expires_date_ms: expiresMs,
        purchase_date_pst: purchaseDatePst,
        original_purchase_date: purchaseDate
      }));

      const renewals = productIds.map((pid, idx) => ({
        auto_renew_product_id: pid,
        product_id: pid,
        original_transaction_id: `49000131452000${idx + 1}`,
        auto_renew_status: "1"
      }));

      obj.Attention = "Dazz Cam Pro Unlocked by @camtu";
      obj.status = 0;
      obj.environment = "Production";
      obj.receipt = obj.receipt || {};
      obj.receipt.receipt_type = "Production";
      obj.receipt.in_app = items;
      obj.latest_receipt_info = items;
      obj.pending_renewal_info = renewals;
      obj.latest_receipt = "camtu_dazz_pro_receipt";

      $done({ body: JSON.stringify(obj) });
    } else {
      $done({});
    }
  } catch (e) {
    $done({});
  }
}
