const cacheName = "llama-cpp-wasm-cache";

export async function loadBinaryResource(url, callback) {
    let cache = null, window = self;

    // Try to find if the model data is cached in Web Worker memory.
    if (typeof window === "undefined") {
        console.debug("`window` is not defined");
    } else if (window && window.caches) {
        cache = await window.caches.open(cacheName);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            const data = await cachedResponse.arrayBuffer();
            const byteArray = new Uint8Array(data);
            callback(byteArray);
            return;
        }
    }


    // Download model and store in cache
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";

    req.onload = async (_) => {
        const arrayBuffer = req.response; // Note: not req.responseText
        
        if (arrayBuffer) {
            const byteArray = new Uint8Array(arrayBuffer);
            
            if (cache) {
                await cache.put(url, new Response(arrayBuffer))
            };

            callback(byteArray);
        }
    };

    req.send(null);
}

export function isMultiThreadSupported() {
    // If 'SharedArrayBuffer' is not available, WebAssembly threads will not work.
    if (typeof SharedArrayBuffer === "undefined") {
        return false;
    }

    try {
        // Test for transferability of SABs (for browsers. needed for Firefox)
        // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
        if (typeof MessageChannel !== "undefined") {
            new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
        }

        // Test for WebAssembly threads capability (for both browsers and Node.js)
        // This typed array is a WebAssembly program containing threaded instructions.
        return WebAssembly.validate(
            new Uint8Array([
                0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5,
                4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11,
            ])
        );
    } catch (e) {
        return false;
    }
}
