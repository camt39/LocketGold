var body = $request.body;
// Chỉ can thiệp khi đang tải đúng app Locket (App ID: 1600525061)
if (body && body.includes("1600525061")) {
    var targetVersionId = "MA_PHIEN_BAN_CU";
    if (body.includes("<key>appExtVrsId</key>")) {
        body = body.replace(
            /<key>appExtVrsId<\/key>\s*<string>\d+<\/string>/,
            "<key>appExtVrsId</key><string>" + targetVersionId + "</string>"
        );
    } else {
        body = body.replace(
            /<\/dict>/,
            "<key>appExtVrsId</key><string>" + targetVersionId + "</string></dict>"
        );
    }
    $done({ body: body });
} else {
    $done({});
}
