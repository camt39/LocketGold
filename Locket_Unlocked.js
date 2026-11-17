// ========= TÙY CHỈNH BẢNG THÔNG BÁO (POPUP) & THÔNG TIN CÁ NHÂN ========= //
if (obj && obj.entries) {
  obj.Attention = "Chúc mừng bạn! Được kích hoạt bởi @camtu";
  obj.entries.settings_tiktok_url = "https://tiktok.com/@tictocuser039";

  obj.entries.feature_discovery_popup_config = JSON.stringify({
    tag: "LOCKET GOLD ALL FEATURES",
    tag_gradient: true,
    tag_style: "gold_gradient",
    title: "Gay to rồi🏳️‍🌈.",
    feature_set: [
      {
        title: "Nhớ follow kênh tiktok @tictocuser039 ✨",
        body: "Cũng không cần lắm tại thử code mượn.",
        imageURL: "https://cdn.upanhlaylink.com/i/T2KzOdli.jpg"
      }
    ],
    primary_button_title: "Xong rồi nhé!",
    campaign: "locket_gold_camtu_v1", // Đổi v1 thành v2, v3... mỗi khi muốn ép bảng thông báo hiện lại
    start_at: "2005-03-09T00:00:00",
    end_at: "2099-12-31T23:59:59",
    use_local_time_zone: true
  });
}

var finalBody = JSON.stringify(obj)
  .replace(/duyvinh\.09/gi, "camtu")
  .replace(/duyvinh09/gi, "camtu")
  .replace(/dvinh\.09/gi, "camtu")
  .replace(/Duy Vinh/gi, "CamTu");

$done({ body: finalBody });
