#!/usr/bin/env bash
set -e

LLAMA_CPP_WASM_BUILD_DIR=build
LLAMA_CPP_WASM_DIST_DIR=dist
LLAMA_CPP_GIT_HASH="8c933b7"
LLAMA_CPP_SOURCE_DIR=$LLAMA_CPP_WASM_BUILD_DIR/llama.cpp
LLAMA_CPP_BUILD_DIR=$LLAMA_CPP_WASM_BUILD_DIR/build

#
# compile llama.cpp
#
if [ -d $LLAMA_CPP_WASM_BUILD_DIR ]; then
    rm -rf $LLAMA_CPP_WASM_BUILD_DIR
fi

mkdir -p $LLAMA_CPP_WASM_BUILD_DIR

git clone https://github.com/ggerganov/llama.cpp.git $LLAMA_CPP_SOURCE_DIR
cd $LLAMA_CPP_SOURCE_DIR
git reset --hard $LLAMA_CPP_GIT_HASH
git apply ../../00-llama-cpp-enable-main.patch
cd ../..

mkdir -p $LLAMA_CPP_BUILD_DIR
cd $LLAMA_CPP_BUILD_DIR
emcmake cmake ../../$LLAMA_CPP_SOURCE_DIR
# export EMCC_CFLAGS="-O3 -msimd128 -pthread -DNDEBUG -s FORCE_FILESYSTEM=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s INITIAL_MEMORY=1GB -s MAXIMUM_MEMORY=4GB -s ALLOW_MEMORY_GROWTH -s EXPORTED_FUNCTIONS=_main -s EXPORTED_RUNTIME_METHODS=callMain -s NO_EXIT_RUNTIME=1"
export EMCC_CFLAGS="-O3 -msimd128 -pthread -DNDEBUG -s FORCE_FILESYSTEM=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s INITIAL_MEMORY=4GB -s MEMORY64 -s EXPORTED_FUNCTIONS=_main -s EXPORTED_RUNTIME_METHODS=callMain -s NO_EXIT_RUNTIME=1"
emmake make main
cd ../..

#
# bundle llama-cpp-wasm dist
#
if [ -d $LLAMA_CPP_WASM_DIST_DIR ]; then
    rm -rf $LLAMA_CPP_WASM_DIST_DIR
fi

mkdir -p $LLAMA_CPP_WASM_DIST_DIR
cp -r src/* $LLAMA_CPP_WASM_DIST_DIR
cp $LLAMA_CPP_BUILD_DIR/bin/main.* $LLAMA_CPP_WASM_DIST_DIR/llama
