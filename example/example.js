import { LlamaCpp } from "./llama/llama.js";

let app;
const buttonRun = document.querySelector("#run");
const buttonRunProgressLoadingModel = document.querySelector("#run-progress-loading-model");
const buttonRunProgressLoadedModel = document.querySelector("#run-progress-loaded-model");
const buttonRunProgressGenerating = document.querySelector("#run-progress-generating");
const modelProgress = document.querySelector("#model-progress");
const textareaPrompt = document.querySelector("textarea#prompt");
const textareaResult = document.querySelector("textarea#result");

const onModelLoaded = () => {
  const prompt = textareaPrompt.value;
  buttonRunProgressLoadingModel.setAttribute('hidden', 'hidden');
  buttonRunProgressLoadedModel.removeAttribute('hidden');
  console.debug('model: loaded');

  app.run({
      prompt: prompt,
      ctx_size: 4096,
      temp: 0.1,
      no_display_prompt: true,
  });
}

const onMessageChunk = (text) => {
  console.log(text);

  if (buttonRunProgressGenerating.hasAttribute('hidden')) {
    buttonRunProgressLoadingModel.setAttribute('hidden', 'hidden');
    buttonRunProgressLoadedModel.setAttribute('hidden', 'hidden');
    buttonRunProgressGenerating.removeAttribute('hidden');
  }

  textareaResult.value += text;
};

const onComplete = () => {
  console.debug('model: completed');
  buttonRun.removeAttribute('hidden');
  buttonRunProgressLoadingModel.setAttribute('hidden', 'hidden');
  buttonRunProgressLoadedModel.setAttribute('hidden', 'hidden');
  buttonRunProgressGenerating.setAttribute('hidden', 'hidden');
  modelProgress.setAttribute('hidden', 'hidden');
};

buttonRun.addEventListener("click", (e) => {
  buttonRun.setAttribute('hidden', 'hidden');
  buttonRunProgressLoadingModel.removeAttribute('hidden');
  modelProgress.removeAttribute('hidden');

  app = new LlamaCpp(
    'https://huggingface.co/Qwen/Qwen1.5-0.5B-Chat-GGUF/resolve/main/qwen2-beta-0_5b-chat-q8_0.gguf',
    // 'https://huggingface.co/Qwen/Qwen1.5-1.8B-Chat-GGUF/resolve/main/qwen1_5-1_8b-chat-q8_0.gguf',
    // 'https://huggingface.co/stabilityai/stablelm-2-zephyr-1_6b/resolve/main/stablelm-2-zephyr-1_6b-Q4_1.gguf',
    // 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    // 'https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf',
    onModelLoaded,          
    onMessageChunk,       
    onComplete,
  );
});
