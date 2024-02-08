# llama-cpp-wasm

WebAssembly (Wasm) Build and Bindings for llama.cpp

## Build

```bash
git clone https://github.com/tangledgroup/llama-cpp-wasm.git
cd llama-cpp-wasm
./build.sh
```

Once build is complete you can find `llama.cpp` built in `build` directory.

## Run

```bash
cd example
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
npx http-server -S -C cert.pem
```

Then open in browser: https://127.0.0.1:8080/