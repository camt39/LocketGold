// ============================================================
// Locket AI Captions Bridge (Quote & Breaking News)
// Endpoint: generateCaption -> CamTu Cloudflare Worker
// ============================================================
var CAPTION_WORKER = "https://camtu-photobooth.nlctu9305.workers.dev/generateCaption";
var NATIVE_CAPTION_API = /^https:\/\/(?:api\.locketcamera\.com|us-central1-locket-4252a\.cloudfunctions\.net)\/(?:[^?#]*\/)?generateCaption(?:\?|$)/i;
var finished = false;

function done(value) {
  if (finished) return;
  finished = true;
  $done(value);
}

function respondError(code, message) {
  done({
    response: {
      status: code,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: { status: "CAPTION_BACKEND_ERROR", message: message } })
    }
  });
}

(function run() {
  if (!NATIVE_CAPTION_API.test($request.url || "")) return done({});
  if (($request.method || "POST").toUpperCase() !== "POST") return done({});

  var original;
  try {
    original = JSON.parse($request.body || "{}");
    if (!original || !original.data || typeof original.data !== "object") throw Error("INVALID_DATA");
    if (typeof (original.data.image_base64 || original.data.imageBase64) !== "string") throw Error("CAPTION_IMAGE_MISSING");
  } catch (e) {
    return respondError(400, "INVALID_NATIVE_REQUEST");
  }

  if (typeof $httpClient === "undefined" || typeof $httpClient.post !== "function") {
    return respondError(503, "HTTPCLIENT_UNAVAILABLE");
  }

  $httpClient.post({
    url: CAPTION_WORKER,
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(original),
    timeout: 30
  }, function (error, response, responseBody) {
    if (error || !response) return respondError(502, "WORKER_CONNECTION_FAILED");
    var status = Number(response.status || response.statusCode || 0);
    var result;
    try { result = JSON.parse(String(responseBody || "")); }
    catch (e) { return respondError(502, "WORKER_INVALID_JSON"); }

    if (status !== 200) {
      return respondError(
        status >= 400 && status < 600 ? status : 502,
        String((result.error && result.error.message) || "WORKER_HTTP_" + status)
      );
    }

    if (!result.result || typeof result.result.caption !== "string") {
      return respondError(502, "WORKER_CAPTION_MISSING");
    }

    done({
      response: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
        body: JSON.stringify(result)
      }
    });
  });
})();
