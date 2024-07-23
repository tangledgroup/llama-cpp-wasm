# llama-cpp-wasm

**WebAssembly** (Wasm) Build and Bindings for [llama.cpp](https://github.com/ggerganov/llama.cpp) and supported by [Tangled Group, Inc](https://tangledgroup.com).

![llama-cpp-wasm](docs/img/run-llama-cpp-in-browser-twitter-fs8.png)

## Online Demos

https://tangledgroup.github.io/llama-cpp-wasm/


## Build

```bash
git clone https://github.com/tangledgroup/llama-cpp-wasm.git
cd llama-cpp-wasm
./build.sh
```

Once build is complete you can find `llama.cpp` built in `dist/llama-st` and `dist/llama-mt` directory.


## Deploy

Basically, you can copy/paste `dist/llama-st` or `dist/llama-mt` directory after build to your project and use as vanilla JavaScript library/module.


**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <label for="prompt">Prompt:</label>
    <br/>

    <textarea id="prompt" name="prompt" rows="25" cols="80">Suppose Alice originally had 3 apples, then Bob gave Alice 7 apples, then Alice gave Cook 5 apples, and then Tim gave Alice 3x the amount of apples Alice had. How many apples does Alice have now? Let’s think step by step.</textarea>
    <br/>

    <label for="result">Result:</label>
    <br/>

    <textarea id="result" name="result" rows="25" cols="80"></textarea>
    <br/>
    
    <script type="module" src="example.js"></script>
  </body>
</html>
```


**example.js**

```javascript
// import { LlamaCpp } from "./llama-st/llama.js";
import { LlamaCpp } from "./llama-mt/llama.js";

const onModelLoaded = () => { 
  console.debug('model: loaded');
  const prompt = document.querySelector("#prompt").value;
  document.querySelector("#result").value = prompt;

  app.run({
    prompt: prompt,
    ctx_size: 4096,
    temp: 0.1,
    no_display_prompt: true,
  });
}

const onMessageChunk = (text) => {
  console.log(text);
  document.querySelector('#result').value += text;
};

const onComplete = () => {
  console.debug('model: completed');
};

const models = [
  'https://huggingface.co/Qwen/Qwen1.5-0.5B-Chat-GGUF/resolve/main/qwen2-beta-0_5b-chat-q8_0.gguf',
  'https://huggingface.co/Qwen/Qwen1.5-1.8B-Chat-GGUF/resolve/main/qwen1_5-1_8b-chat-q8_0.gguf',
  'https://huggingface.co/stabilityai/stablelm-2-zephyr-1_6b/resolve/main/stablelm-2-zephyr-1_6b-Q4_1.gguf',
  'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
  'https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf'
];

const model = models[2]; // stablelm-2-zephyr-1_6b

const app = new LlamaCpp(
  model,
  onModelLoaded,          
  onMessageChunk,       
  onComplete,
);
```


## Run Example

First generate self-signed certificate.

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

### Run Single Thread Example

```bash
npx http-server -S -C cert.pem
```

### Run Multi-threading Example

Copy `docs/server.js` to your working directory.

```bash
npm i express
node server.js
```

Then open in browser: https://127.0.0.1:8080/
