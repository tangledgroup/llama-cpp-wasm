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
