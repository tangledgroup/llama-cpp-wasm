import { LlamaCpp } from "./llama-mt/llama.js";

let app;
const buttonRun = document.querySelector("#run");
const buttonRunProgressLoadingModel = document.querySelector("#run-progress-loading-model");
const buttonRunProgressLoadedModel = document.querySelector("#run-progress-loaded-model");
const buttonRunProgressGenerating = document.querySelector("#run-progress-generating");
const selectModel = document.querySelector("select#model");
const modelProgress = document.querySelector("#model-progress");
const textareaPrompt = document.querySelector("textarea#prompt");
const textareaResult = document.querySelector("textarea#result");

const onModelLoaded = () => {
  const prompt = textareaPrompt.value;
  buttonRunProgressLoadingModel.setAttribute("hidden", "hidden");
  buttonRunProgressLoadedModel.removeAttribute("hidden");
  console.debug("model: loaded");

  app.run({
      prompt: prompt,
      ctx_size: 4096,
      temp: 0.1,
      top_k: 40,
      no_display_prompt: true,
  });
}

const onMessageChunk = (text) => {
  console.log(text);

  if (buttonRunProgressGenerating.hasAttribute("hidden")) {
    buttonRunProgressLoadingModel.setAttribute("hidden", "hidden");
    buttonRunProgressLoadedModel.setAttribute("hidden", "hidden");
    buttonRunProgressGenerating.removeAttribute("hidden");
  }

  textareaResult.value += text;
};

const onComplete = () => {
  console.debug("model: completed");
  buttonRun.removeAttribute("hidden");
  buttonRunProgressLoadingModel.setAttribute("hidden", "hidden");
  buttonRunProgressLoadedModel.setAttribute("hidden", "hidden");
  buttonRunProgressGenerating.setAttribute("hidden", "hidden");
  modelProgress.setAttribute("hidden", "hidden");
};

buttonRun.addEventListener("click", (e) => {
  buttonRun.setAttribute("hidden", "hidden");
  buttonRunProgressLoadingModel.removeAttribute("hidden");
  modelProgress.removeAttribute("hidden");
  textareaResult.value = "";

  app = new LlamaCpp(
    selectModel.value,
    onModelLoaded,          
    onMessageChunk,       
    onComplete,
  );
});
