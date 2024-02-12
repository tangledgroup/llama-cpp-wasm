import { action } from "./actions.js";
import { loadBinaryResource } from "./utility.js";
import Module from "./main.js";

// WASM Module
let module;

// hard-coded filepath for loaded model in vfs
const model_path = "/models/model.bin";

// Function to send model line result
const print = (text) => {
    postMessage({
        event: action.WRITE_RESULT,
        text: text + "\n",
    });
};

// Function to initialize worker 
// and download model file
const initWorker = async (modelPath) => {
    const args = {
        'noInitialRun': true,
        'print': print,
    }

    module = await Module(args);

    const initCallback = (bytes) => {
        // create vfs folder for storing model bins
        module['FS_createPath']("/", "models", true, true);

        // load model
        module['FS_createDataFile']('/models', 'model.bin', bytes, true, true, true);
        
        // update callback action to worker main thread
        postMessage({
            event: action.INITIALIZED
        });
    }

    loadBinaryResource(modelPath, initCallback)
}

const run_main = (
    prompt,
    chatml,
    n_predict,
    ctx_size,
    batch_size,
    temp,
    n_gpu_layers,
    top_k,
    top_p,
    no_display_prompt
) => {
    const args = [
        "--threads", (navigator.hardwareConcurrency).toString(),
        "--model", model_path,
        "--n-predict", n_predict.toString(),
        "--ctx-size", ctx_size.toString(),
        "--temp", temp.toString(),
        "--top_k", top_k.toString(),
        "--top_p", top_p.toString(),
        "--simple-io",
        "--log-disable",
        "--prompt", prompt.toString(),
    ];

    if (chatml) {
        args.push("--chatml");
    }

    if (no_display_prompt) {
        args.push("--no-display-prompt");
    }

    module['callMain'](args);

    postMessage({
        event: action.RUN_COMPLETED
    });
} 

// Worker Events
self.addEventListener('message', (e) => {
    switch (e.data.event) {
        case action.LOAD:
            // load event
            initWorker(e.data.url);
            break;
        case action.RUN_MAIN:
            // run main
            run_main(
                e.data.prompt,
                e.data.chatml,
                e.data.n_predict,
                e.data.ctx_size,
                e.data.batch_size,
                e.data.temp,
                e.data.n_gpu_layers,
                e.data.top_k,
                e.data.top_p,
                e.data.no_display_prompt,
            );

            break;
    }
}, false);
