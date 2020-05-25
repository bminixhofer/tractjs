/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".bootstrap.js"
/******/ 	}
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	function promiseResolve() { return Promise.resolve(); }
/******/
/******/ 	var wasmImportObjects = {
/******/ 		"../pkg/tractjs_bg.wasm": function() {
/******/ 			return {
/******/ 				"./tractjs_bg.js": {
/******/ 					"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_object_drop_ref"](p0i32);
/******/ 					},
/******/ 					"__wbg_model_new": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_model_new"](p0i32);
/******/ 					},
/******/ 					"__wbg_new_59cb74e423758ede": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_new_59cb74e423758ede"]();
/******/ 					},
/******/ 					"__wbg_stack_558ba5917b466edd": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_stack_558ba5917b466edd"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_error_4bb6c2a97407129a": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_error_4bb6c2a97407129a"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_instanceof_Window_17fdb5cd280d476d": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_instanceof_Window_17fdb5cd280d476d"](p0i32);
/******/ 					},
/******/ 					"__wbg_arrayBuffer_74898c32f31aed64": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_arrayBuffer_74898c32f31aed64"](p0i32);
/******/ 					},
/******/ 					"__wbg_fetch_e99dd5fe8361399a": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_fetch_e99dd5fe8361399a"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbindgen_cb_drop": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_cb_drop"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_object_clone_ref": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_object_clone_ref"](p0i32);
/******/ 					},
/******/ 					"__wbg_newnoargs_8aad4a6554f38345": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_newnoargs_8aad4a6554f38345"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_call_1f85aaa5836dfb23": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_call_1f85aaa5836dfb23"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_call_0246f1c8ff252fb6": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_call_0246f1c8ff252fb6"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_buffer_eb5185aa4a8e9c62": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_buffer_eb5185aa4a8e9c62"](p0i32);
/******/ 					},
/******/ 					"__wbg_new_09f2ad087112acf0": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_new_09f2ad087112acf0"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_resolve_708df7651c8929b8": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_resolve_708df7651c8929b8"](p0i32);
/******/ 					},
/******/ 					"__wbg_then_8c23dce80c84c8fb": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_then_8c23dce80c84c8fb"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_then_300153bb889a5b4b": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_then_300153bb889a5b4b"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_self_c0d3a5923e013647": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_self_c0d3a5923e013647"]();
/******/ 					},
/******/ 					"__wbg_window_7ee6c8be3432927d": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_window_7ee6c8be3432927d"]();
/******/ 					},
/******/ 					"__wbg_globalThis_c6de1d938e089cf0": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_globalThis_c6de1d938e089cf0"]();
/******/ 					},
/******/ 					"__wbg_global_c9a01ce4680907f8": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_global_c9a01ce4680907f8"]();
/******/ 					},
/******/ 					"__wbindgen_is_undefined": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_is_undefined"](p0i32);
/******/ 					},
/******/ 					"__wbg_new_3d94e83f0a6bf252": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_new_3d94e83f0a6bf252"](p0i32);
/******/ 					},
/******/ 					"__wbg_set_d4d7629a896d4b3e": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_set_d4d7629a896d4b3e"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_length_2e324c9c0e74a81d": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_length_2e324c9c0e74a81d"](p0i32);
/******/ 					},
/******/ 					"__wbg_new_425c4bc0e35ec22f": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_new_425c4bc0e35ec22f"](p0i32);
/******/ 					},
/******/ 					"__wbg_set_c6918ca5977a5b66": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_set_c6918ca5977a5b66"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_length_81dcf4356abac381": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_length_81dcf4356abac381"](p0i32);
/******/ 					},
/******/ 					"__wbg_newwithbyteoffsetandlength_a31622ccc380e8b4": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_newwithbyteoffsetandlength_a31622ccc380e8b4"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_new_470473004db6a289": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_new_470473004db6a289"](p0i32);
/******/ 					},
/******/ 					"__wbg_set_47b2beca3d5c9e3f": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_set_47b2beca3d5c9e3f"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_length_2f682a6b8ac0fb07": function(p0i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbg_length_2f682a6b8ac0fb07"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_throw": function(p0i32,p1i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_throw"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_memory": function() {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_memory"]();
/******/ 					},
/******/ 					"__wbindgen_closure_wrapper567": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["../pkg/tractjs_bg.js"].exports["__wbindgen_closure_wrapper567"](p0i32,p1i32,p2i32);
/******/ 					}
/******/ 				}
/******/ 			};
/******/ 		},
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/
/******/ 		// Fetch + compile chunk loading for webassembly
/******/
/******/ 		var wasmModules = {"0":["../pkg/tractjs_bg.wasm"]}[chunkId] || [];
/******/
/******/ 		wasmModules.forEach(function(wasmModuleId) {
/******/ 			var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/
/******/ 			// a Promise means "currently loading" or "already loaded".
/******/ 			if(installedWasmModuleData)
/******/ 				promises.push(installedWasmModuleData);
/******/ 			else {
/******/ 				var importObject = wasmImportObjects[wasmModuleId]();
/******/ 				var req = fetch(__webpack_require__.p + "" + {"../pkg/tractjs_bg.wasm":"4c2155d8f0814305c8c8"}[wasmModuleId] + ".module.wasm");
/******/ 				var promise;
/******/ 				if(importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
/******/ 					promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 						return WebAssembly.instantiate(items[0], items[1]);
/******/ 					});
/******/ 				} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 					promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 				} else {
/******/ 					var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 					promise = bytesPromise.then(function(bytes) {
/******/ 						return WebAssembly.instantiate(bytes, importObject);
/******/ 					});
/******/ 				}
/******/ 				promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 					return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 				}));
/******/ 			}
/******/ 		});
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// object with all WebAssembly.instance exports
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./bootstrap.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./bootstrap.js":
/*!**********************!*\
  !*** ./bootstrap.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./index.js */ \"./index.js\"))\n    .catch(e => console.error(\"Error importing `index.js`:\", e));\n\n//# sourceURL=webpack:///./bootstrap.js?");

/***/ })

/******/ });