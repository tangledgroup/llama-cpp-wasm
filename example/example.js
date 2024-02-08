import { LlamaCpp } from "./llama/llama.js";


const onModelLoaded = () => { 
    const prompt = document.querySelector("#prompt").value;
    document.querySelector("#result").value = prompt;

    app.run({
        prompt: prompt,
        ctx_size: 4096,
        no_display_prompt: true,
    });
}

const onMessageChunk = (text) => {
    console.log(text);
    document.querySelector('#result').value += text;
};

const onComplete = () => {
    console.log('complete!');
};

const app = new LlamaCpp(
    'https://huggingface.co/Qwen/Qwen1.5-0.5B-Chat-GGUF/resolve/main/qwen2-beta-0_5b-chat-q8_0.gguf',
    // 'https://huggingface.co/Qwen/Qwen1.5-1.8B-Chat-GGUF/resolve/main/qwen1_5-1_8b-chat-q8_0.gguf',
    // 'https://huggingface.co/stabilityai/stablelm-2-zephyr-1_6b/resolve/main/stablelm-2-zephyr-1_6b-Q4_1.gguf',
    // 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    // 'https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf',
    onModelLoaded,          
    onMessageChunk,       
    onComplete,
);
