"use strict";var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}function _classCallCheck2(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}(function(f){if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else{var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else{g=this;}g.MultihackCore=f();}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(require,module,exports){module.exports=after;function after(count,callback,err_cb){var bail=false;err_cb=err_cb||noop;proxy.count=count;return count===0?callback():proxy;function proxy(err,result){if(proxy.count<=0){throw new Error('after called too many times');}--proxy.count;// after first error, rest are passed to err_cb
if(err){bail=true;callback(err);// future error callbacks will go to error handler
callback=err_cb;}else if(proxy.count===0&&!bail){callback(null,result);}}}function noop(){}},{}],2:[function(require,module,exports){/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */module.exports=function(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start=start||0;end=end||bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end);}if(start<0){start+=bytes;}if(end<0){end+=bytes;}if(end>bytes){end=bytes;}if(start>=bytes||start>=end||bytes===0){return new ArrayBuffer(0);}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end-start);for(var i=start,ii=0;i<end;i++,ii++){result[ii]=abv[i];}return result.buffer;};},{}],3:[function(require,module,exports){(function(global){"use strict";require("core-js/shim");require("regenerator-runtime/runtime");require("core-js/fn/regexp/escape");if(global._babelPolyfill){throw new Error("only one instance of babel-polyfill is allowed");}global._babelPolyfill=true;var DEFINE_PROPERTY="defineProperty";function define(O,key,value){O[key]||Object[DEFINE_PROPERTY](O,key,{writable:true,configurable:true,value:value});}define(String.prototype,"padLeft","".padStart);define(String.prototype,"padRight","".padEnd);"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function(key){[][key]&&define(Array,key,Function.call.bind([][key]));});}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"core-js/fn/regexp/escape":11,"core-js/shim":304,"regenerator-runtime/runtime":359}],4:[function(require,module,exports){/**
 * Expose `Backoff`.
 */module.exports=Backoff;/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||10000;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0;}/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation;}return Math.min(ms,this.max)|0;};/**
 * Reset the number of attempts.
 *
 * @api public
 */Backoff.prototype.reset=function(){this.attempts=0;};/**
 * Set the minimum duration
 *
 * @api public
 */Backoff.prototype.setMin=function(min){this.ms=min;};/**
 * Set the maximum duration
 *
 * @api public
 */Backoff.prototype.setMax=function(max){this.max=max;};/**
 * Set the jitter
 *
 * @api public
 */Backoff.prototype.setJitter=function(jitter){this.jitter=jitter;};},{}],5:[function(require,module,exports){/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */(function(){"use strict";var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";// Use a lookup table to find the index.
var lookup=new Uint8Array(256);for(var i=0;i<chars.length;i++){lookup[chars.charCodeAt(i)]=i;}exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63];}if(len%3===2){base64=base64.substring(0,base64.length-1)+"=";}else if(len%3===1){base64=base64.substring(0,base64.length-2)+"==";}return base64;};exports.decode=function(base64){var bufferLength=base64.length*0.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="="){bufferLength--;if(base64[base64.length-2]==="="){bufferLength--;}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=lookup[base64.charCodeAt(i)];encoded2=lookup[base64.charCodeAt(i+1)];encoded3=lookup[base64.charCodeAt(i+2)];encoded4=lookup[base64.charCodeAt(i+3)];bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63;}return arraybuffer;};})();},{}],6:[function(require,module,exports){(function(global){/**
 * Create a blob builder even when vendor prefixes exist
 */var BlobBuilder=global.BlobBuilder||global.WebKitBlobBuilder||global.MSBlobBuilder||global.MozBlobBuilder;/**
 * Check if Blob constructor is supported
 */var blobSupported=function(){try{var a=new Blob(['hi']);return a.size===2;}catch(e){return false;}}();/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */var blobSupportsArrayBufferView=blobSupported&&function(){try{var b=new Blob([new Uint8Array([1,2])]);return b.size===2;}catch(e){return false;}}();/**
 * Check if BlobBuilder is supported
 */var blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */function mapArrayBufferViews(ary){for(var i=0;i<ary.length;i++){var chunk=ary[i];if(chunk.buffer instanceof ArrayBuffer){var buf=chunk.buffer;// if this is a subarray, make a copy so we only
// include the subarray region from the underlying buffer
if(chunk.byteLength!==buf.byteLength){var copy=new Uint8Array(chunk.byteLength);copy.set(new Uint8Array(buf,chunk.byteOffset,chunk.byteLength));buf=copy.buffer;}ary[i]=buf;}}}function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder();mapArrayBufferViews(ary);for(var i=0;i<ary.length;i++){bb.append(ary[i]);}return options.type?bb.getBlob(options.type):bb.getBlob();};function BlobConstructor(ary,options){mapArrayBufferViews(ary);return new Blob(ary,options||{});};module.exports=function(){if(blobSupported){return blobSupportsArrayBufferView?global.Blob:BlobConstructor;}else if(blobBuilderSupported){return BlobBuilderConstructor;}else{return undefined;}}();}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],7:[function(require,module,exports){(function(global){'use strict';var buffer=require('buffer');var Buffer=buffer.Buffer;var SlowBuffer=buffer.SlowBuffer;var MAX_LEN=buffer.kMaxLength||2147483647;exports.alloc=function alloc(size,fill,encoding){if(typeof Buffer.alloc==='function'){return Buffer.alloc(size,fill,encoding);}if(typeof encoding==='number'){throw new TypeError('encoding must not be number');}if(typeof size!=='number'){throw new TypeError('size must be a number');}if(size>MAX_LEN){throw new RangeError('size is too large');}var enc=encoding;var _fill=fill;if(_fill===undefined){enc=undefined;_fill=0;}var buf=new Buffer(size);if(typeof _fill==='string'){var fillBuf=new Buffer(_fill,enc);var flen=fillBuf.length;var i=-1;while(++i<size){buf[i]=fillBuf[i%flen];}}else{buf.fill(_fill);}return buf;};exports.allocUnsafe=function allocUnsafe(size){if(typeof Buffer.allocUnsafe==='function'){return Buffer.allocUnsafe(size);}if(typeof size!=='number'){throw new TypeError('size must be a number');}if(size>MAX_LEN){throw new RangeError('size is too large');}return new Buffer(size);};exports.from=function from(value,encodingOrOffset,length){if(typeof Buffer.from==='function'&&(!global.Uint8Array||Uint8Array.from!==Buffer.from)){return Buffer.from(value,encodingOrOffset,length);}if(typeof value==='number'){throw new TypeError('"value" argument must not be a number');}if(typeof value==='string'){return new Buffer(value,encodingOrOffset);}if(typeof ArrayBuffer!=='undefined'&&value instanceof ArrayBuffer){var offset=encodingOrOffset;if(arguments.length===1){return new Buffer(value);}if(typeof offset==='undefined'){offset=0;}var len=length;if(typeof len==='undefined'){len=value.byteLength-offset;}if(offset>=value.byteLength){throw new RangeError('\'offset\' is out of bounds');}if(len>value.byteLength-offset){throw new RangeError('\'length\' is out of bounds');}return new Buffer(value.slice(offset,offset+len));}if(Buffer.isBuffer(value)){var out=new Buffer(value.length);value.copy(out,0,0,value.length);return out;}if(value){if(Array.isArray(value)||typeof ArrayBuffer!=='undefined'&&value.buffer instanceof ArrayBuffer||'length'in value){return new Buffer(value);}if(value.type==='Buffer'&&Array.isArray(value.data)){return new Buffer(value.data);}}throw new TypeError('First argument must be a string, Buffer, '+'ArrayBuffer, Array, or array-like object.');};exports.allocUnsafeSlow=function allocUnsafeSlow(size){if(typeof Buffer.allocUnsafeSlow==='function'){return Buffer.allocUnsafeSlow(size);}if(typeof size!=='number'){throw new TypeError('size must be a number');}if(size>=MAX_LEN){throw new RangeError('size is too large');}return new SlowBuffer(size);};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"buffer":405}],8:[function(require,module,exports){/**
 * Slice reference.
 */var slice=[].slice;/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */module.exports=function(obj,fn){if('string'==typeof fn)fn=obj[fn];if('function'!=typeof fn)throw new Error('bind() requires a function');var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)));};};},{}],9:[function(require,module,exports){/**
 * Expose `Emitter`.
 */if(typeof module!=='undefined'){module.exports=Emitter;}/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */function Emitter(obj){if(obj)return mixin(obj);};/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key];}return obj;}/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks['$'+event]=this._callbacks['$'+event]||[]).push(fn);return this;};/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.once=function(event,fn){function on(){this.off(event,on);fn.apply(this,arguments);}on.fn=fn;this.on(event,on);return this;};/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};// all
if(0==arguments.length){this._callbacks={};return this;}// specific event
var callbacks=this._callbacks['$'+event];if(!callbacks)return this;// remove all handlers
if(1==arguments.length){delete this._callbacks['$'+event];return this;}// remove specific handler
var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break;}}return this;};/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks['$'+event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args);}}return this;};/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks['$'+event]||[];};/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length;};},{}],10:[function(require,module,exports){module.exports=function(a,b){var fn=function fn(){};fn.prototype=b.prototype;a.prototype=new fn();a.prototype.constructor=a;};},{}],11:[function(require,module,exports){require('../../modules/core.regexp.escape');module.exports=require('../../modules/_core').RegExp.escape;},{"../../modules/_core":32,"../../modules/core.regexp.escape":128}],12:[function(require,module,exports){module.exports=function(it){if(typeof it!='function')throw TypeError(it+' is not a function!');return it;};},{}],13:[function(require,module,exports){var cof=require('./_cof');module.exports=function(it,msg){if(typeof it!='number'&&cof(it)!='Number')throw TypeError(msg);return+it;};},{"./_cof":27}],14:[function(require,module,exports){// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES=require('./_wks')('unscopables'),ArrayProto=Array.prototype;if(ArrayProto[UNSCOPABLES]==undefined)require('./_hide')(ArrayProto,UNSCOPABLES,{});module.exports=function(key){ArrayProto[UNSCOPABLES][key]=true;};},{"./_hide":49,"./_wks":126}],15:[function(require,module,exports){module.exports=function(it,Constructor,name,forbiddenField){if(!(it instanceof Constructor)||forbiddenField!==undefined&&forbiddenField in it){throw TypeError(name+': incorrect invocation!');}return it;};},{}],16:[function(require,module,exports){var isObject=require('./_is-object');module.exports=function(it){if(!isObject(it))throw TypeError(it+' is not an object!');return it;};},{"./_is-object":58}],17:[function(require,module,exports){// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';var toObject=require('./_to-object'),toIndex=require('./_to-index'),toLength=require('./_to-length');module.exports=[].copyWithin||function copyWithin(target/*= 0*/,start/*= 0, end = @length*/){var O=toObject(this),len=toLength(O.length),to=toIndex(target,len),from=toIndex(start,len),end=arguments.length>2?arguments[2]:undefined,count=Math.min((end===undefined?len:toIndex(end,len))-from,len-to),inc=1;if(from<to&&to<from+count){inc=-1;from+=count-1;to+=count-1;}while(count-->0){if(from in O)O[to]=O[from];else delete O[to];to+=inc;from+=inc;}return O;};},{"./_to-index":114,"./_to-length":117,"./_to-object":118}],18:[function(require,module,exports){// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';var toObject=require('./_to-object'),toIndex=require('./_to-index'),toLength=require('./_to-length');module.exports=function fill(value/*, start = 0, end = @length */){var O=toObject(this),length=toLength(O.length),aLen=arguments.length,index=toIndex(aLen>1?arguments[1]:undefined,length),end=aLen>2?arguments[2]:undefined,endPos=end===undefined?length:toIndex(end,length);while(endPos>index){O[index++]=value;}return O;};},{"./_to-index":114,"./_to-length":117,"./_to-object":118}],19:[function(require,module,exports){var forOf=require('./_for-of');module.exports=function(iter,ITERATOR){var result=[];forOf(iter,false,result.push,result,ITERATOR);return result;};},{"./_for-of":46}],20:[function(require,module,exports){// false -> Array#indexOf
// true  -> Array#includes
var toIObject=require('./_to-iobject'),toLength=require('./_to-length'),toIndex=require('./_to-index');module.exports=function(IS_INCLUDES){return function($this,el,fromIndex){var O=toIObject($this),length=toLength(O.length),index=toIndex(fromIndex,length),value;// Array#includes uses SameValueZero equality algorithm
if(IS_INCLUDES&&el!=el)while(length>index){value=O[index++];if(value!=value)return true;// Array#toIndex ignores holes, Array#includes - not
}else for(;length>index;index++){if(IS_INCLUDES||index in O){if(O[index]===el)return IS_INCLUDES||index||0;}}return!IS_INCLUDES&&-1;};};},{"./_to-index":114,"./_to-iobject":116,"./_to-length":117}],21:[function(require,module,exports){// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx=require('./_ctx'),IObject=require('./_iobject'),toObject=require('./_to-object'),toLength=require('./_to-length'),asc=require('./_array-species-create');module.exports=function(TYPE,$create){var IS_MAP=TYPE==1,IS_FILTER=TYPE==2,IS_SOME=TYPE==3,IS_EVERY=TYPE==4,IS_FIND_INDEX=TYPE==6,NO_HOLES=TYPE==5||IS_FIND_INDEX,create=$create||asc;return function($this,callbackfn,that){var O=toObject($this),self=IObject(O),f=ctx(callbackfn,that,3),length=toLength(self.length),index=0,result=IS_MAP?create($this,length):IS_FILTER?create($this,0):undefined,val,res;for(;length>index;index++){if(NO_HOLES||index in self){val=self[index];res=f(val,index,O);if(TYPE){if(IS_MAP)result[index]=res;// map
else if(res)switch(TYPE){case 3:return true;// some
case 5:return val;// find
case 6:return index;// findIndex
case 2:result.push(val);// filter
}else if(IS_EVERY)return false;// every
}}}return IS_FIND_INDEX?-1:IS_SOME||IS_EVERY?IS_EVERY:result;};};},{"./_array-species-create":24,"./_ctx":34,"./_iobject":54,"./_to-length":117,"./_to-object":118}],22:[function(require,module,exports){var aFunction=require('./_a-function'),toObject=require('./_to-object'),IObject=require('./_iobject'),toLength=require('./_to-length');module.exports=function(that,callbackfn,aLen,memo,isRight){aFunction(callbackfn);var O=toObject(that),self=IObject(O),length=toLength(O.length),index=isRight?length-1:0,i=isRight?-1:1;if(aLen<2)for(;;){if(index in self){memo=self[index];index+=i;break;}index+=i;if(isRight?index<0:length<=index){throw TypeError('Reduce of empty array with no initial value');}}for(;isRight?index>=0:length>index;index+=i){if(index in self){memo=callbackfn(memo,self[index],index,O);}}return memo;};},{"./_a-function":12,"./_iobject":54,"./_to-length":117,"./_to-object":118}],23:[function(require,module,exports){var isObject=require('./_is-object'),isArray=require('./_is-array'),SPECIES=require('./_wks')('species');module.exports=function(original){var C;if(isArray(original)){C=original.constructor;// cross-realm fallback
if(typeof C=='function'&&(C===Array||isArray(C.prototype)))C=undefined;if(isObject(C)){C=C[SPECIES];if(C===null)C=undefined;}}return C===undefined?Array:C;};},{"./_is-array":56,"./_is-object":58,"./_wks":126}],24:[function(require,module,exports){// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor=require('./_array-species-constructor');module.exports=function(original,length){return new(speciesConstructor(original))(length);};},{"./_array-species-constructor":23}],25:[function(require,module,exports){'use strict';var aFunction=require('./_a-function'),isObject=require('./_is-object'),invoke=require('./_invoke'),arraySlice=[].slice,factories={};var construct=function construct(F,len,args){if(!(len in factories)){for(var n=[],i=0;i<len;i++){n[i]='a['+i+']';}factories[len]=Function('F,a','return new F('+n.join(',')+')');}return factories[len](F,args);};module.exports=Function.bind||function bind(that/*, args... */){var fn=aFunction(this),partArgs=arraySlice.call(arguments,1);var bound=function bound()/* args... */{var args=partArgs.concat(arraySlice.call(arguments));return this instanceof bound?construct(fn,args.length,args):invoke(fn,args,that);};if(isObject(fn.prototype))bound.prototype=fn.prototype;return bound;};},{"./_a-function":12,"./_invoke":53,"./_is-object":58}],26:[function(require,module,exports){// getting tag from 19.1.3.6 Object.prototype.toString()
var cof=require('./_cof'),TAG=require('./_wks')('toStringTag')// ES3 wrong here
,ARG=cof(function(){return arguments;}())=='Arguments';// fallback for IE11 Script Access Denied error
var tryGet=function tryGet(it,key){try{return it[key];}catch(e){/* empty */}};module.exports=function(it){var O,T,B;return it===undefined?'Undefined':it===null?'Null'// @@toStringTag case
:typeof(T=tryGet(O=Object(it),TAG))=='string'?T// builtinTag case
:ARG?cof(O)// ES3 arguments fallback
:(B=cof(O))=='Object'&&typeof O.callee=='function'?'Arguments':B;};},{"./_cof":27,"./_wks":126}],27:[function(require,module,exports){var toString={}.toString;module.exports=function(it){return toString.call(it).slice(8,-1);};},{}],28:[function(require,module,exports){'use strict';var dP=require('./_object-dp').f,create=require('./_object-create'),redefineAll=require('./_redefine-all'),ctx=require('./_ctx'),anInstance=require('./_an-instance'),defined=require('./_defined'),forOf=require('./_for-of'),$iterDefine=require('./_iter-define'),step=require('./_iter-step'),setSpecies=require('./_set-species'),DESCRIPTORS=require('./_descriptors'),fastKey=require('./_meta').fastKey,SIZE=DESCRIPTORS?'_s':'size';var getEntry=function getEntry(that,key){// fast case
var index=fastKey(key),entry;if(index!=='F')return that._i[index];// frozen object case
for(entry=that._f;entry;entry=entry.n){if(entry.k==key)return entry;}};module.exports={getConstructor:function getConstructor(wrapper,NAME,IS_MAP,ADDER){var C=wrapper(function(that,iterable){anInstance(that,C,NAME,'_i');that._i=create(null);// index
that._f=undefined;// first entry
that._l=undefined;// last entry
that[SIZE]=0;// size
if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that);});redefineAll(C.prototype,{// 23.1.3.1 Map.prototype.clear()
// 23.2.3.2 Set.prototype.clear()
clear:function clear(){for(var that=this,data=that._i,entry=that._f;entry;entry=entry.n){entry.r=true;if(entry.p)entry.p=entry.p.n=undefined;delete data[entry.i];}that._f=that._l=undefined;that[SIZE]=0;},// 23.1.3.3 Map.prototype.delete(key)
// 23.2.3.4 Set.prototype.delete(value)
'delete':function _delete(key){var that=this,entry=getEntry(that,key);if(entry){var next=entry.n,prev=entry.p;delete that._i[entry.i];entry.r=true;if(prev)prev.n=next;if(next)next.p=prev;if(that._f==entry)that._f=next;if(that._l==entry)that._l=prev;that[SIZE]--;}return!!entry;},// 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
// 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
forEach:function forEach(callbackfn/*, that = undefined */){anInstance(this,C,'forEach');var f=ctx(callbackfn,arguments.length>1?arguments[1]:undefined,3),entry;while(entry=entry?entry.n:this._f){f(entry.v,entry.k,this);// revert to the last existing entry
while(entry&&entry.r){entry=entry.p;}}},// 23.1.3.7 Map.prototype.has(key)
// 23.2.3.7 Set.prototype.has(value)
has:function has(key){return!!getEntry(this,key);}});if(DESCRIPTORS)dP(C.prototype,'size',{get:function get(){return defined(this[SIZE]);}});return C;},def:function def(that,key,value){var entry=getEntry(that,key),prev,index;// change existing entry
if(entry){entry.v=value;// create new entry
}else{that._l=entry={i:index=fastKey(key,true),// <- index
k:key,// <- key
v:value,// <- value
p:prev=that._l,// <- previous entry
n:undefined,// <- next entry
r:false// <- removed
};if(!that._f)that._f=entry;if(prev)prev.n=entry;that[SIZE]++;// add to index
if(index!=='F')that._i[index]=entry;}return that;},getEntry:getEntry,setStrong:function setStrong(C,NAME,IS_MAP){// add .keys, .values, .entries, [@@iterator]
// 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
$iterDefine(C,NAME,function(iterated,kind){this._t=iterated;// target
this._k=kind;// kind
this._l=undefined;// previous
},function(){var that=this,kind=that._k,entry=that._l;// revert to the last existing entry
while(entry&&entry.r){entry=entry.p;}// get next entry
if(!that._t||!(that._l=entry=entry?entry.n:that._t._f)){// or finish the iteration
that._t=undefined;return step(1);}// return step by kind
if(kind=='keys')return step(0,entry.k);if(kind=='values')return step(0,entry.v);return step(0,[entry.k,entry.v]);},IS_MAP?'entries':'values',!IS_MAP,true);// add [@@species], 23.1.2.2, 23.2.2.2
setSpecies(NAME);}};},{"./_an-instance":15,"./_ctx":34,"./_defined":36,"./_descriptors":37,"./_for-of":46,"./_iter-define":62,"./_iter-step":64,"./_meta":71,"./_object-create":75,"./_object-dp":76,"./_redefine-all":95,"./_set-species":100}],29:[function(require,module,exports){// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof=require('./_classof'),from=require('./_array-from-iterable');module.exports=function(NAME){return function toJSON(){if(classof(this)!=NAME)throw TypeError(NAME+"#toJSON isn't generic");return from(this);};};},{"./_array-from-iterable":19,"./_classof":26}],30:[function(require,module,exports){'use strict';var redefineAll=require('./_redefine-all'),getWeak=require('./_meta').getWeak,anObject=require('./_an-object'),isObject=require('./_is-object'),anInstance=require('./_an-instance'),forOf=require('./_for-of'),createArrayMethod=require('./_array-methods'),$has=require('./_has'),arrayFind=createArrayMethod(5),arrayFindIndex=createArrayMethod(6),id=0;// fallback for uncaught frozen keys
var uncaughtFrozenStore=function uncaughtFrozenStore(that){return that._l||(that._l=new UncaughtFrozenStore());};var UncaughtFrozenStore=function UncaughtFrozenStore(){this.a=[];};var findUncaughtFrozen=function findUncaughtFrozen(store,key){return arrayFind(store.a,function(it){return it[0]===key;});};UncaughtFrozenStore.prototype={get:function get(key){var entry=findUncaughtFrozen(this,key);if(entry)return entry[1];},has:function has(key){return!!findUncaughtFrozen(this,key);},set:function set(key,value){var entry=findUncaughtFrozen(this,key);if(entry)entry[1]=value;else this.a.push([key,value]);},'delete':function _delete(key){var index=arrayFindIndex(this.a,function(it){return it[0]===key;});if(~index)this.a.splice(index,1);return!!~index;}};module.exports={getConstructor:function getConstructor(wrapper,NAME,IS_MAP,ADDER){var C=wrapper(function(that,iterable){anInstance(that,C,NAME,'_i');that._i=id++;// collection id
that._l=undefined;// leak store for uncaught frozen objects
if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that);});redefineAll(C.prototype,{// 23.3.3.2 WeakMap.prototype.delete(key)
// 23.4.3.3 WeakSet.prototype.delete(value)
'delete':function _delete(key){if(!isObject(key))return false;var data=getWeak(key);if(data===true)return uncaughtFrozenStore(this)['delete'](key);return data&&$has(data,this._i)&&delete data[this._i];},// 23.3.3.4 WeakMap.prototype.has(key)
// 23.4.3.4 WeakSet.prototype.has(value)
has:function has(key){if(!isObject(key))return false;var data=getWeak(key);if(data===true)return uncaughtFrozenStore(this).has(key);return data&&$has(data,this._i);}});return C;},def:function def(that,key,value){var data=getWeak(anObject(key),true);if(data===true)uncaughtFrozenStore(that).set(key,value);else data[that._i]=value;return that;},ufstore:uncaughtFrozenStore};},{"./_an-instance":15,"./_an-object":16,"./_array-methods":21,"./_for-of":46,"./_has":48,"./_is-object":58,"./_meta":71,"./_redefine-all":95}],31:[function(require,module,exports){'use strict';var global=require('./_global'),$export=require('./_export'),redefine=require('./_redefine'),redefineAll=require('./_redefine-all'),meta=require('./_meta'),forOf=require('./_for-of'),anInstance=require('./_an-instance'),isObject=require('./_is-object'),fails=require('./_fails'),$iterDetect=require('./_iter-detect'),setToStringTag=require('./_set-to-string-tag'),inheritIfRequired=require('./_inherit-if-required');module.exports=function(NAME,wrapper,methods,common,IS_MAP,IS_WEAK){var Base=global[NAME],C=Base,ADDER=IS_MAP?'set':'add',proto=C&&C.prototype,O={};var fixMethod=function fixMethod(KEY){var fn=proto[KEY];redefine(proto,KEY,KEY=='delete'?function(a){return IS_WEAK&&!isObject(a)?false:fn.call(this,a===0?0:a);}:KEY=='has'?function has(a){return IS_WEAK&&!isObject(a)?false:fn.call(this,a===0?0:a);}:KEY=='get'?function get(a){return IS_WEAK&&!isObject(a)?undefined:fn.call(this,a===0?0:a);}:KEY=='add'?function add(a){fn.call(this,a===0?0:a);return this;}:function set(a,b){fn.call(this,a===0?0:a,b);return this;});};if(typeof C!='function'||!(IS_WEAK||proto.forEach&&!fails(function(){new C().entries().next();}))){// create collection constructor
C=common.getConstructor(wrapper,NAME,IS_MAP,ADDER);redefineAll(C.prototype,methods);meta.NEED=true;}else{var instance=new C()// early implementations not supports chaining
,HASNT_CHAINING=instance[ADDER](IS_WEAK?{}:-0,1)!=instance// V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
,THROWS_ON_PRIMITIVES=fails(function(){instance.has(1);})// most early implementations doesn't supports iterables, most modern - not close it correctly
,ACCEPT_ITERABLES=$iterDetect(function(iter){new C(iter);})// eslint-disable-line no-new
// for early implementations -0 and +0 not the same
,BUGGY_ZERO=!IS_WEAK&&fails(function(){// V8 ~ Chromium 42- fails only with 5+ elements
var $instance=new C(),index=5;while(index--){$instance[ADDER](index,index);}return!$instance.has(-0);});if(!ACCEPT_ITERABLES){C=wrapper(function(target,iterable){anInstance(target,C,NAME);var that=inheritIfRequired(new Base(),target,C);if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that);return that;});C.prototype=proto;proto.constructor=C;}if(THROWS_ON_PRIMITIVES||BUGGY_ZERO){fixMethod('delete');fixMethod('has');IS_MAP&&fixMethod('get');}if(BUGGY_ZERO||HASNT_CHAINING)fixMethod(ADDER);// weak collections should not contains .clear method
if(IS_WEAK&&proto.clear)delete proto.clear;}setToStringTag(C,NAME);O[NAME]=C;$export($export.G+$export.W+$export.F*(C!=Base),O);if(!IS_WEAK)common.setStrong(C,NAME,IS_MAP);return C;};},{"./_an-instance":15,"./_export":41,"./_fails":43,"./_for-of":46,"./_global":47,"./_inherit-if-required":52,"./_is-object":58,"./_iter-detect":63,"./_meta":71,"./_redefine":96,"./_redefine-all":95,"./_set-to-string-tag":101}],32:[function(require,module,exports){var core=module.exports={version:'2.4.0'};if(typeof __e=='number')__e=core;// eslint-disable-line no-undef
},{}],33:[function(require,module,exports){'use strict';var $defineProperty=require('./_object-dp'),createDesc=require('./_property-desc');module.exports=function(object,index,value){if(index in object)$defineProperty.f(object,index,createDesc(0,value));else object[index]=value;};},{"./_object-dp":76,"./_property-desc":94}],34:[function(require,module,exports){// optional / simple context binding
var aFunction=require('./_a-function');module.exports=function(fn,that,length){aFunction(fn);if(that===undefined)return fn;switch(length){case 1:return function(a){return fn.call(that,a);};case 2:return function(a,b){return fn.call(that,a,b);};case 3:return function(a,b,c){return fn.call(that,a,b,c);};}return function()/* ...args */{return fn.apply(that,arguments);};};},{"./_a-function":12}],35:[function(require,module,exports){'use strict';var anObject=require('./_an-object'),toPrimitive=require('./_to-primitive'),NUMBER='number';module.exports=function(hint){if(hint!=='string'&&hint!==NUMBER&&hint!=='default')throw TypeError('Incorrect hint');return toPrimitive(anObject(this),hint!=NUMBER);};},{"./_an-object":16,"./_to-primitive":119}],36:[function(require,module,exports){// 7.2.1 RequireObjectCoercible(argument)
module.exports=function(it){if(it==undefined)throw TypeError("Can't call method on  "+it);return it;};},{}],37:[function(require,module,exports){// Thank's IE8 for his funny defineProperty
module.exports=!require('./_fails')(function(){return Object.defineProperty({},'a',{get:function get(){return 7;}}).a!=7;});},{"./_fails":43}],38:[function(require,module,exports){var isObject=require('./_is-object'),document=require('./_global').document// in old IE typeof document.createElement is 'object'
,is=isObject(document)&&isObject(document.createElement);module.exports=function(it){return is?document.createElement(it):{};};},{"./_global":47,"./_is-object":58}],39:[function(require,module,exports){// IE 8- don't enum bug keys
module.exports='constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');},{}],40:[function(require,module,exports){// all enumerable object keys, includes symbols
var getKeys=require('./_object-keys'),gOPS=require('./_object-gops'),pIE=require('./_object-pie');module.exports=function(it){var result=getKeys(it),getSymbols=gOPS.f;if(getSymbols){var symbols=getSymbols(it),isEnum=pIE.f,i=0,key;while(symbols.length>i){if(isEnum.call(it,key=symbols[i++]))result.push(key);}}return result;};},{"./_object-gops":82,"./_object-keys":85,"./_object-pie":86}],41:[function(require,module,exports){var global=require('./_global'),core=require('./_core'),hide=require('./_hide'),redefine=require('./_redefine'),ctx=require('./_ctx'),PROTOTYPE='prototype';var $export=function $export(type,name,source){var IS_FORCED=type&$export.F,IS_GLOBAL=type&$export.G,IS_STATIC=type&$export.S,IS_PROTO=type&$export.P,IS_BIND=type&$export.B,target=IS_GLOBAL?global:IS_STATIC?global[name]||(global[name]={}):(global[name]||{})[PROTOTYPE],exports=IS_GLOBAL?core:core[name]||(core[name]={}),expProto=exports[PROTOTYPE]||(exports[PROTOTYPE]={}),key,own,out,exp;if(IS_GLOBAL)source=name;for(key in source){// contains in native
own=!IS_FORCED&&target&&target[key]!==undefined;// export native or passed
out=(own?target:source)[key];// bind timers to global for call from export context
exp=IS_BIND&&own?ctx(out,global):IS_PROTO&&typeof out=='function'?ctx(Function.call,out):out;// extend global
if(target)redefine(target,key,out,type&$export.U);// export
if(exports[key]!=out)hide(exports,key,exp);if(IS_PROTO&&expProto[key]!=out)expProto[key]=out;}};global.core=core;// type bitmap
$export.F=1;// forced
$export.G=2;// global
$export.S=4;// static
$export.P=8;// proto
$export.B=16;// bind
$export.W=32;// wrap
$export.U=64;// safe
$export.R=128;// real proto method for `library` 
module.exports=$export;},{"./_core":32,"./_ctx":34,"./_global":47,"./_hide":49,"./_redefine":96}],42:[function(require,module,exports){var MATCH=require('./_wks')('match');module.exports=function(KEY){var re=/./;try{'/./'[KEY](re);}catch(e){try{re[MATCH]=false;return!'/./'[KEY](re);}catch(f){/* empty */}}return true;};},{"./_wks":126}],43:[function(require,module,exports){module.exports=function(exec){try{return!!exec();}catch(e){return true;}};},{}],44:[function(require,module,exports){'use strict';var hide=require('./_hide'),redefine=require('./_redefine'),fails=require('./_fails'),defined=require('./_defined'),wks=require('./_wks');module.exports=function(KEY,length,exec){var SYMBOL=wks(KEY),fns=exec(defined,SYMBOL,''[KEY]),strfn=fns[0],rxfn=fns[1];if(fails(function(){var O={};O[SYMBOL]=function(){return 7;};return''[KEY](O)!=7;})){redefine(String.prototype,KEY,strfn);hide(RegExp.prototype,SYMBOL,length==2// 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
// 21.2.5.11 RegExp.prototype[@@split](string, limit)
?function(string,arg){return rxfn.call(string,this,arg);}// 21.2.5.6 RegExp.prototype[@@match](string)
// 21.2.5.9 RegExp.prototype[@@search](string)
:function(string){return rxfn.call(string,this);});}};},{"./_defined":36,"./_fails":43,"./_hide":49,"./_redefine":96,"./_wks":126}],45:[function(require,module,exports){'use strict';// 21.2.5.3 get RegExp.prototype.flags
var anObject=require('./_an-object');module.exports=function(){var that=anObject(this),result='';if(that.global)result+='g';if(that.ignoreCase)result+='i';if(that.multiline)result+='m';if(that.unicode)result+='u';if(that.sticky)result+='y';return result;};},{"./_an-object":16}],46:[function(require,module,exports){var ctx=require('./_ctx'),call=require('./_iter-call'),isArrayIter=require('./_is-array-iter'),anObject=require('./_an-object'),toLength=require('./_to-length'),getIterFn=require('./core.get-iterator-method'),BREAK={},RETURN={};var exports=module.exports=function(iterable,entries,fn,that,ITERATOR){var iterFn=ITERATOR?function(){return iterable;}:getIterFn(iterable),f=ctx(fn,that,entries?2:1),index=0,length,step,iterator,result;if(typeof iterFn!='function')throw TypeError(iterable+' is not iterable!');// fast case for arrays with default iterator
if(isArrayIter(iterFn))for(length=toLength(iterable.length);length>index;index++){result=entries?f(anObject(step=iterable[index])[0],step[1]):f(iterable[index]);if(result===BREAK||result===RETURN)return result;}else for(iterator=iterFn.call(iterable);!(step=iterator.next()).done;){result=call(iterator,f,step.value,entries);if(result===BREAK||result===RETURN)return result;}};exports.BREAK=BREAK;exports.RETURN=RETURN;},{"./_an-object":16,"./_ctx":34,"./_is-array-iter":55,"./_iter-call":60,"./_to-length":117,"./core.get-iterator-method":127}],47:[function(require,module,exports){// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global=module.exports=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();if(typeof __g=='number')__g=global;// eslint-disable-line no-undef
},{}],48:[function(require,module,exports){var hasOwnProperty={}.hasOwnProperty;module.exports=function(it,key){return hasOwnProperty.call(it,key);};},{}],49:[function(require,module,exports){var dP=require('./_object-dp'),createDesc=require('./_property-desc');module.exports=require('./_descriptors')?function(object,key,value){return dP.f(object,key,createDesc(1,value));}:function(object,key,value){object[key]=value;return object;};},{"./_descriptors":37,"./_object-dp":76,"./_property-desc":94}],50:[function(require,module,exports){module.exports=require('./_global').document&&document.documentElement;},{"./_global":47}],51:[function(require,module,exports){module.exports=!require('./_descriptors')&&!require('./_fails')(function(){return Object.defineProperty(require('./_dom-create')('div'),'a',{get:function get(){return 7;}}).a!=7;});},{"./_descriptors":37,"./_dom-create":38,"./_fails":43}],52:[function(require,module,exports){var isObject=require('./_is-object'),setPrototypeOf=require('./_set-proto').set;module.exports=function(that,target,C){var P,S=target.constructor;if(S!==C&&typeof S=='function'&&(P=S.prototype)!==C.prototype&&isObject(P)&&setPrototypeOf){setPrototypeOf(that,P);}return that;};},{"./_is-object":58,"./_set-proto":99}],53:[function(require,module,exports){// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports=function(fn,args,that){var un=that===undefined;switch(args.length){case 0:return un?fn():fn.call(that);case 1:return un?fn(args[0]):fn.call(that,args[0]);case 2:return un?fn(args[0],args[1]):fn.call(that,args[0],args[1]);case 3:return un?fn(args[0],args[1],args[2]):fn.call(that,args[0],args[1],args[2]);case 4:return un?fn(args[0],args[1],args[2],args[3]):fn.call(that,args[0],args[1],args[2],args[3]);}return fn.apply(that,args);};},{}],54:[function(require,module,exports){// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof=require('./_cof');module.exports=Object('z').propertyIsEnumerable(0)?Object:function(it){return cof(it)=='String'?it.split(''):Object(it);};},{"./_cof":27}],55:[function(require,module,exports){// check on default Array iterator
var Iterators=require('./_iterators'),ITERATOR=require('./_wks')('iterator'),ArrayProto=Array.prototype;module.exports=function(it){return it!==undefined&&(Iterators.Array===it||ArrayProto[ITERATOR]===it);};},{"./_iterators":65,"./_wks":126}],56:[function(require,module,exports){// 7.2.2 IsArray(argument)
var cof=require('./_cof');module.exports=Array.isArray||function isArray(arg){return cof(arg)=='Array';};},{"./_cof":27}],57:[function(require,module,exports){// 20.1.2.3 Number.isInteger(number)
var isObject=require('./_is-object'),floor=Math.floor;module.exports=function isInteger(it){return!isObject(it)&&isFinite(it)&&floor(it)===it;};},{"./_is-object":58}],58:[function(require,module,exports){module.exports=function(it){return(typeof it==="undefined"?"undefined":_typeof(it))==='object'?it!==null:typeof it==='function';};},{}],59:[function(require,module,exports){// 7.2.8 IsRegExp(argument)
var isObject=require('./_is-object'),cof=require('./_cof'),MATCH=require('./_wks')('match');module.exports=function(it){var isRegExp;return isObject(it)&&((isRegExp=it[MATCH])!==undefined?!!isRegExp:cof(it)=='RegExp');};},{"./_cof":27,"./_is-object":58,"./_wks":126}],60:[function(require,module,exports){// call something on iterator step with safe closing on error
var anObject=require('./_an-object');module.exports=function(iterator,fn,value,entries){try{return entries?fn(anObject(value)[0],value[1]):fn(value);// 7.4.6 IteratorClose(iterator, completion)
}catch(e){var ret=iterator['return'];if(ret!==undefined)anObject(ret.call(iterator));throw e;}};},{"./_an-object":16}],61:[function(require,module,exports){'use strict';var create=require('./_object-create'),descriptor=require('./_property-desc'),setToStringTag=require('./_set-to-string-tag'),IteratorPrototype={};// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype,require('./_wks')('iterator'),function(){return this;});module.exports=function(Constructor,NAME,next){Constructor.prototype=create(IteratorPrototype,{next:descriptor(1,next)});setToStringTag(Constructor,NAME+' Iterator');};},{"./_hide":49,"./_object-create":75,"./_property-desc":94,"./_set-to-string-tag":101,"./_wks":126}],62:[function(require,module,exports){'use strict';var LIBRARY=require('./_library'),$export=require('./_export'),redefine=require('./_redefine'),hide=require('./_hide'),has=require('./_has'),Iterators=require('./_iterators'),$iterCreate=require('./_iter-create'),setToStringTag=require('./_set-to-string-tag'),getPrototypeOf=require('./_object-gpo'),ITERATOR=require('./_wks')('iterator'),BUGGY=!([].keys&&'next'in[].keys())// Safari has buggy iterators w/o `next`
,FF_ITERATOR='@@iterator',KEYS='keys',VALUES='values';var returnThis=function returnThis(){return this;};module.exports=function(Base,NAME,Constructor,next,DEFAULT,IS_SET,FORCED){$iterCreate(Constructor,NAME,next);var getMethod=function getMethod(kind){if(!BUGGY&&kind in proto)return proto[kind];switch(kind){case KEYS:return function keys(){return new Constructor(this,kind);};case VALUES:return function values(){return new Constructor(this,kind);};}return function entries(){return new Constructor(this,kind);};};var TAG=NAME+' Iterator',DEF_VALUES=DEFAULT==VALUES,VALUES_BUG=false,proto=Base.prototype,$native=proto[ITERATOR]||proto[FF_ITERATOR]||DEFAULT&&proto[DEFAULT],$default=$native||getMethod(DEFAULT),$entries=DEFAULT?!DEF_VALUES?$default:getMethod('entries'):undefined,$anyNative=NAME=='Array'?proto.entries||$native:$native,methods,key,IteratorPrototype;// Fix native
if($anyNative){IteratorPrototype=getPrototypeOf($anyNative.call(new Base()));if(IteratorPrototype!==Object.prototype){// Set @@toStringTag to native iterators
setToStringTag(IteratorPrototype,TAG,true);// fix for some old engines
if(!LIBRARY&&!has(IteratorPrototype,ITERATOR))hide(IteratorPrototype,ITERATOR,returnThis);}}// fix Array#{values, @@iterator}.name in V8 / FF
if(DEF_VALUES&&$native&&$native.name!==VALUES){VALUES_BUG=true;$default=function values(){return $native.call(this);};}// Define iterator
if((!LIBRARY||FORCED)&&(BUGGY||VALUES_BUG||!proto[ITERATOR])){hide(proto,ITERATOR,$default);}// Plug for library
Iterators[NAME]=$default;Iterators[TAG]=returnThis;if(DEFAULT){methods={values:DEF_VALUES?$default:getMethod(VALUES),keys:IS_SET?$default:getMethod(KEYS),entries:$entries};if(FORCED)for(key in methods){if(!(key in proto))redefine(proto,key,methods[key]);}else $export($export.P+$export.F*(BUGGY||VALUES_BUG),NAME,methods);}return methods;};},{"./_export":41,"./_has":48,"./_hide":49,"./_iter-create":61,"./_iterators":65,"./_library":67,"./_object-gpo":83,"./_redefine":96,"./_set-to-string-tag":101,"./_wks":126}],63:[function(require,module,exports){var ITERATOR=require('./_wks')('iterator'),SAFE_CLOSING=false;try{var riter=[7][ITERATOR]();riter['return']=function(){SAFE_CLOSING=true;};Array.from(riter,function(){throw 2;});}catch(e){/* empty */}module.exports=function(exec,skipClosing){if(!skipClosing&&!SAFE_CLOSING)return false;var safe=false;try{var arr=[7],iter=arr[ITERATOR]();iter.next=function(){return{done:safe=true};};arr[ITERATOR]=function(){return iter;};exec(arr);}catch(e){/* empty */}return safe;};},{"./_wks":126}],64:[function(require,module,exports){module.exports=function(done,value){return{value:value,done:!!done};};},{}],65:[function(require,module,exports){module.exports={};},{}],66:[function(require,module,exports){var getKeys=require('./_object-keys'),toIObject=require('./_to-iobject');module.exports=function(object,el){var O=toIObject(object),keys=getKeys(O),length=keys.length,index=0,key;while(length>index){if(O[key=keys[index++]]===el)return key;}};},{"./_object-keys":85,"./_to-iobject":116}],67:[function(require,module,exports){module.exports=false;},{}],68:[function(require,module,exports){// 20.2.2.14 Math.expm1(x)
var $expm1=Math.expm1;module.exports=!$expm1// Old FF bug
||$expm1(10)>22025.465794806719||$expm1(10)<22025.4657948067165168// Tor Browser bug
||$expm1(-2e-17)!=-2e-17?function expm1(x){return(x=+x)==0?x:x>-1e-6&&x<1e-6?x+x*x/2:Math.exp(x)-1;}:$expm1;},{}],69:[function(require,module,exports){// 20.2.2.20 Math.log1p(x)
module.exports=Math.log1p||function log1p(x){return(x=+x)>-1e-8&&x<1e-8?x-x*x/2:Math.log(1+x);};},{}],70:[function(require,module,exports){// 20.2.2.28 Math.sign(x)
module.exports=Math.sign||function sign(x){return(x=+x)==0||x!=x?x:x<0?-1:1;};},{}],71:[function(require,module,exports){var META=require('./_uid')('meta'),isObject=require('./_is-object'),has=require('./_has'),setDesc=require('./_object-dp').f,id=0;var isExtensible=Object.isExtensible||function(){return true;};var FREEZE=!require('./_fails')(function(){return isExtensible(Object.preventExtensions({}));});var setMeta=function setMeta(it){setDesc(it,META,{value:{i:'O'+ ++id,// object ID
w:{}// weak collections IDs
}});};var fastKey=function fastKey(it,create){// return primitive with prefix
if(!isObject(it))return(typeof it==="undefined"?"undefined":_typeof(it))=='symbol'?it:(typeof it=='string'?'S':'P')+it;if(!has(it,META)){// can't set metadata to uncaught frozen object
if(!isExtensible(it))return'F';// not necessary to add metadata
if(!create)return'E';// add missing metadata
setMeta(it);// return object ID
}return it[META].i;};var getWeak=function getWeak(it,create){if(!has(it,META)){// can't set metadata to uncaught frozen object
if(!isExtensible(it))return true;// not necessary to add metadata
if(!create)return false;// add missing metadata
setMeta(it);// return hash weak collections IDs
}return it[META].w;};// add metadata on freeze-family methods calling
var onFreeze=function onFreeze(it){if(FREEZE&&meta.NEED&&isExtensible(it)&&!has(it,META))setMeta(it);return it;};var meta=module.exports={KEY:META,NEED:false,fastKey:fastKey,getWeak:getWeak,onFreeze:onFreeze};},{"./_fails":43,"./_has":48,"./_is-object":58,"./_object-dp":76,"./_uid":123}],72:[function(require,module,exports){var Map=require('./es6.map'),$export=require('./_export'),shared=require('./_shared')('metadata'),store=shared.store||(shared.store=new(require('./es6.weak-map'))());var getOrCreateMetadataMap=function getOrCreateMetadataMap(target,targetKey,create){var targetMetadata=store.get(target);if(!targetMetadata){if(!create)return undefined;store.set(target,targetMetadata=new Map());}var keyMetadata=targetMetadata.get(targetKey);if(!keyMetadata){if(!create)return undefined;targetMetadata.set(targetKey,keyMetadata=new Map());}return keyMetadata;};var ordinaryHasOwnMetadata=function ordinaryHasOwnMetadata(MetadataKey,O,P){var metadataMap=getOrCreateMetadataMap(O,P,false);return metadataMap===undefined?false:metadataMap.has(MetadataKey);};var ordinaryGetOwnMetadata=function ordinaryGetOwnMetadata(MetadataKey,O,P){var metadataMap=getOrCreateMetadataMap(O,P,false);return metadataMap===undefined?undefined:metadataMap.get(MetadataKey);};var ordinaryDefineOwnMetadata=function ordinaryDefineOwnMetadata(MetadataKey,MetadataValue,O,P){getOrCreateMetadataMap(O,P,true).set(MetadataKey,MetadataValue);};var ordinaryOwnMetadataKeys=function ordinaryOwnMetadataKeys(target,targetKey){var metadataMap=getOrCreateMetadataMap(target,targetKey,false),keys=[];if(metadataMap)metadataMap.forEach(function(_,key){keys.push(key);});return keys;};var toMetaKey=function toMetaKey(it){return it===undefined||(typeof it==="undefined"?"undefined":_typeof(it))=='symbol'?it:String(it);};var exp=function exp(O){$export($export.S,'Reflect',O);};module.exports={store:store,map:getOrCreateMetadataMap,has:ordinaryHasOwnMetadata,get:ordinaryGetOwnMetadata,set:ordinaryDefineOwnMetadata,keys:ordinaryOwnMetadataKeys,key:toMetaKey,exp:exp};},{"./_export":41,"./_shared":103,"./es6.map":158,"./es6.weak-map":264}],73:[function(require,module,exports){var global=require('./_global'),macrotask=require('./_task').set,Observer=global.MutationObserver||global.WebKitMutationObserver,process=global.process,Promise=global.Promise,isNode=require('./_cof')(process)=='process';module.exports=function(){var head,last,notify;var flush=function flush(){var parent,fn;if(isNode&&(parent=process.domain))parent.exit();while(head){fn=head.fn;head=head.next;try{fn();}catch(e){if(head)notify();else last=undefined;throw e;}}last=undefined;if(parent)parent.enter();};// Node.js
if(isNode){notify=function notify(){process.nextTick(flush);};// browsers with MutationObserver
}else if(Observer){var toggle=true,node=document.createTextNode('');new Observer(flush).observe(node,{characterData:true});// eslint-disable-line no-new
notify=function notify(){node.data=toggle=!toggle;};// environments with maybe non-completely correct, but existent Promise
}else if(Promise&&Promise.resolve){var promise=Promise.resolve();notify=function notify(){promise.then(flush);};// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
}else{notify=function notify(){// strange IE + webpack dev server bug - use .call(global)
macrotask.call(global,flush);};}return function(fn){var task={fn:fn,next:undefined};if(last)last.next=task;if(!head){head=task;notify();}last=task;};};},{"./_cof":27,"./_global":47,"./_task":113}],74:[function(require,module,exports){'use strict';// 19.1.2.1 Object.assign(target, source, ...)
var getKeys=require('./_object-keys'),gOPS=require('./_object-gops'),pIE=require('./_object-pie'),toObject=require('./_to-object'),IObject=require('./_iobject'),$assign=Object.assign;// should work with symbols and should have deterministic property order (V8 bug)
module.exports=!$assign||require('./_fails')(function(){var A={},B={},S=Symbol(),K='abcdefghijklmnopqrst';A[S]=7;K.split('').forEach(function(k){B[k]=k;});return $assign({},A)[S]!=7||Object.keys($assign({},B)).join('')!=K;})?function assign(target,source){// eslint-disable-line no-unused-vars
var T=toObject(target),aLen=arguments.length,index=1,getSymbols=gOPS.f,isEnum=pIE.f;while(aLen>index){var S=IObject(arguments[index++]),keys=getSymbols?getKeys(S).concat(getSymbols(S)):getKeys(S),length=keys.length,j=0,key;while(length>j){if(isEnum.call(S,key=keys[j++]))T[key]=S[key];}}return T;}:$assign;},{"./_fails":43,"./_iobject":54,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_to-object":118}],75:[function(require,module,exports){// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject=require('./_an-object'),dPs=require('./_object-dps'),enumBugKeys=require('./_enum-bug-keys'),IE_PROTO=require('./_shared-key')('IE_PROTO'),Empty=function Empty(){/* empty */},PROTOTYPE='prototype';// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict=function createDict(){// Thrash, waste and sodomy: IE GC bug
var iframe=require('./_dom-create')('iframe'),i=enumBugKeys.length,lt='<',gt='>',iframeDocument;iframe.style.display='none';require('./_html').appendChild(iframe);iframe.src='javascript:';// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
iframeDocument=iframe.contentWindow.document;iframeDocument.open();iframeDocument.write(lt+'script'+gt+'document.F=Object'+lt+'/script'+gt);iframeDocument.close();_createDict=iframeDocument.F;while(i--){delete _createDict[PROTOTYPE][enumBugKeys[i]];}return _createDict();};module.exports=Object.create||function create(O,Properties){var result;if(O!==null){Empty[PROTOTYPE]=anObject(O);result=new Empty();Empty[PROTOTYPE]=null;// add "__proto__" for Object.getPrototypeOf polyfill
result[IE_PROTO]=O;}else result=_createDict();return Properties===undefined?result:dPs(result,Properties);};},{"./_an-object":16,"./_dom-create":38,"./_enum-bug-keys":39,"./_html":50,"./_object-dps":77,"./_shared-key":102}],76:[function(require,module,exports){var anObject=require('./_an-object'),IE8_DOM_DEFINE=require('./_ie8-dom-define'),toPrimitive=require('./_to-primitive'),dP=Object.defineProperty;exports.f=require('./_descriptors')?Object.defineProperty:function defineProperty(O,P,Attributes){anObject(O);P=toPrimitive(P,true);anObject(Attributes);if(IE8_DOM_DEFINE)try{return dP(O,P,Attributes);}catch(e){/* empty */}if('get'in Attributes||'set'in Attributes)throw TypeError('Accessors not supported!');if('value'in Attributes)O[P]=Attributes.value;return O;};},{"./_an-object":16,"./_descriptors":37,"./_ie8-dom-define":51,"./_to-primitive":119}],77:[function(require,module,exports){var dP=require('./_object-dp'),anObject=require('./_an-object'),getKeys=require('./_object-keys');module.exports=require('./_descriptors')?Object.defineProperties:function defineProperties(O,Properties){anObject(O);var keys=getKeys(Properties),length=keys.length,i=0,P;while(length>i){dP.f(O,P=keys[i++],Properties[P]);}return O;};},{"./_an-object":16,"./_descriptors":37,"./_object-dp":76,"./_object-keys":85}],78:[function(require,module,exports){// Forced replacement prototype accessors methods
module.exports=require('./_library')||!require('./_fails')(function(){var K=Math.random();// In FF throws only define methods
__defineSetter__.call(null,K,function(){/* empty */});delete require('./_global')[K];});},{"./_fails":43,"./_global":47,"./_library":67}],79:[function(require,module,exports){var pIE=require('./_object-pie'),createDesc=require('./_property-desc'),toIObject=require('./_to-iobject'),toPrimitive=require('./_to-primitive'),has=require('./_has'),IE8_DOM_DEFINE=require('./_ie8-dom-define'),gOPD=Object.getOwnPropertyDescriptor;exports.f=require('./_descriptors')?gOPD:function getOwnPropertyDescriptor(O,P){O=toIObject(O);P=toPrimitive(P,true);if(IE8_DOM_DEFINE)try{return gOPD(O,P);}catch(e){/* empty */}if(has(O,P))return createDesc(!pIE.f.call(O,P),O[P]);};},{"./_descriptors":37,"./_has":48,"./_ie8-dom-define":51,"./_object-pie":86,"./_property-desc":94,"./_to-iobject":116,"./_to-primitive":119}],80:[function(require,module,exports){// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject=require('./_to-iobject'),gOPN=require('./_object-gopn').f,toString={}.toString;var windowNames=(typeof window==="undefined"?"undefined":_typeof(window))=='object'&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];var getWindowNames=function getWindowNames(it){try{return gOPN(it);}catch(e){return windowNames.slice();}};module.exports.f=function getOwnPropertyNames(it){return windowNames&&toString.call(it)=='[object Window]'?getWindowNames(it):gOPN(toIObject(it));};},{"./_object-gopn":81,"./_to-iobject":116}],81:[function(require,module,exports){// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys=require('./_object-keys-internal'),hiddenKeys=require('./_enum-bug-keys').concat('length','prototype');exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return $keys(O,hiddenKeys);};},{"./_enum-bug-keys":39,"./_object-keys-internal":84}],82:[function(require,module,exports){exports.f=Object.getOwnPropertySymbols;},{}],83:[function(require,module,exports){// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has=require('./_has'),toObject=require('./_to-object'),IE_PROTO=require('./_shared-key')('IE_PROTO'),ObjectProto=Object.prototype;module.exports=Object.getPrototypeOf||function(O){O=toObject(O);if(has(O,IE_PROTO))return O[IE_PROTO];if(typeof O.constructor=='function'&&O instanceof O.constructor){return O.constructor.prototype;}return O instanceof Object?ObjectProto:null;};},{"./_has":48,"./_shared-key":102,"./_to-object":118}],84:[function(require,module,exports){var has=require('./_has'),toIObject=require('./_to-iobject'),arrayIndexOf=require('./_array-includes')(false),IE_PROTO=require('./_shared-key')('IE_PROTO');module.exports=function(object,names){var O=toIObject(object),i=0,result=[],key;for(key in O){if(key!=IE_PROTO)has(O,key)&&result.push(key);}// Don't enum bug & hidden keys
while(names.length>i){if(has(O,key=names[i++])){~arrayIndexOf(result,key)||result.push(key);}}return result;};},{"./_array-includes":20,"./_has":48,"./_shared-key":102,"./_to-iobject":116}],85:[function(require,module,exports){// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys=require('./_object-keys-internal'),enumBugKeys=require('./_enum-bug-keys');module.exports=Object.keys||function keys(O){return $keys(O,enumBugKeys);};},{"./_enum-bug-keys":39,"./_object-keys-internal":84}],86:[function(require,module,exports){exports.f={}.propertyIsEnumerable;},{}],87:[function(require,module,exports){// most Object methods by ES6 should accept primitives
var $export=require('./_export'),core=require('./_core'),fails=require('./_fails');module.exports=function(KEY,exec){var fn=(core.Object||{})[KEY]||Object[KEY],exp={};exp[KEY]=exec(fn);$export($export.S+$export.F*fails(function(){fn(1);}),'Object',exp);};},{"./_core":32,"./_export":41,"./_fails":43}],88:[function(require,module,exports){var getKeys=require('./_object-keys'),toIObject=require('./_to-iobject'),isEnum=require('./_object-pie').f;module.exports=function(isEntries){return function(it){var O=toIObject(it),keys=getKeys(O),length=keys.length,i=0,result=[],key;while(length>i){if(isEnum.call(O,key=keys[i++])){result.push(isEntries?[key,O[key]]:O[key]);}}return result;};};},{"./_object-keys":85,"./_object-pie":86,"./_to-iobject":116}],89:[function(require,module,exports){// all object keys, includes non-enumerable and symbols
var gOPN=require('./_object-gopn'),gOPS=require('./_object-gops'),anObject=require('./_an-object'),Reflect=require('./_global').Reflect;module.exports=Reflect&&Reflect.ownKeys||function ownKeys(it){var keys=gOPN.f(anObject(it)),getSymbols=gOPS.f;return getSymbols?keys.concat(getSymbols(it)):keys;};},{"./_an-object":16,"./_global":47,"./_object-gopn":81,"./_object-gops":82}],90:[function(require,module,exports){var $parseFloat=require('./_global').parseFloat,$trim=require('./_string-trim').trim;module.exports=1/$parseFloat(require('./_string-ws')+'-0')!==-Infinity?function parseFloat(str){var string=$trim(String(str),3),result=$parseFloat(string);return result===0&&string.charAt(0)=='-'?-0:result;}:$parseFloat;},{"./_global":47,"./_string-trim":111,"./_string-ws":112}],91:[function(require,module,exports){var $parseInt=require('./_global').parseInt,$trim=require('./_string-trim').trim,ws=require('./_string-ws'),hex=/^[\-+]?0[xX]/;module.exports=$parseInt(ws+'08')!==8||$parseInt(ws+'0x16')!==22?function parseInt(str,radix){var string=$trim(String(str),3);return $parseInt(string,radix>>>0||(hex.test(string)?16:10));}:$parseInt;},{"./_global":47,"./_string-trim":111,"./_string-ws":112}],92:[function(require,module,exports){'use strict';var path=require('./_path'),invoke=require('./_invoke'),aFunction=require('./_a-function');module.exports=function()/* ...pargs */{var fn=aFunction(this),length=arguments.length,pargs=Array(length),i=0,_=path._,holder=false;while(length>i){if((pargs[i]=arguments[i++])===_)holder=true;}return function()/* ...args */{var that=this,aLen=arguments.length,j=0,k=0,args;if(!holder&&!aLen)return invoke(fn,pargs,that);args=pargs.slice();if(holder)for(;length>j;j++){if(args[j]===_)args[j]=arguments[k++];}while(aLen>k){args.push(arguments[k++]);}return invoke(fn,args,that);};};},{"./_a-function":12,"./_invoke":53,"./_path":93}],93:[function(require,module,exports){module.exports=require('./_global');},{"./_global":47}],94:[function(require,module,exports){module.exports=function(bitmap,value){return{enumerable:!(bitmap&1),configurable:!(bitmap&2),writable:!(bitmap&4),value:value};};},{}],95:[function(require,module,exports){var redefine=require('./_redefine');module.exports=function(target,src,safe){for(var key in src){redefine(target,key,src[key],safe);}return target;};},{"./_redefine":96}],96:[function(require,module,exports){var global=require('./_global'),hide=require('./_hide'),has=require('./_has'),SRC=require('./_uid')('src'),TO_STRING='toString',$toString=Function[TO_STRING],TPL=(''+$toString).split(TO_STRING);require('./_core').inspectSource=function(it){return $toString.call(it);};(module.exports=function(O,key,val,safe){var isFunction=typeof val=='function';if(isFunction)has(val,'name')||hide(val,'name',key);if(O[key]===val)return;if(isFunction)has(val,SRC)||hide(val,SRC,O[key]?''+O[key]:TPL.join(String(key)));if(O===global){O[key]=val;}else{if(!safe){delete O[key];hide(O,key,val);}else{if(O[key])O[key]=val;else hide(O,key,val);}}// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype,TO_STRING,function toString(){return typeof this=='function'&&this[SRC]||$toString.call(this);});},{"./_core":32,"./_global":47,"./_has":48,"./_hide":49,"./_uid":123}],97:[function(require,module,exports){module.exports=function(regExp,replace){var replacer=replace===Object(replace)?function(part){return replace[part];}:replace;return function(it){return String(it).replace(regExp,replacer);};};},{}],98:[function(require,module,exports){// 7.2.9 SameValue(x, y)
module.exports=Object.is||function is(x,y){return x===y?x!==0||1/x===1/y:x!=x&&y!=y;};},{}],99:[function(require,module,exports){// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */var isObject=require('./_is-object'),anObject=require('./_an-object');var check=function check(O,proto){anObject(O);if(!isObject(proto)&&proto!==null)throw TypeError(proto+": can't set as prototype!");};module.exports={set:Object.setPrototypeOf||('__proto__'in{}?// eslint-disable-line
function(test,buggy,set){try{set=require('./_ctx')(Function.call,require('./_object-gopd').f(Object.prototype,'__proto__').set,2);set(test,[]);buggy=!(test instanceof Array);}catch(e){buggy=true;}return function setPrototypeOf(O,proto){check(O,proto);if(buggy)O.__proto__=proto;else set(O,proto);return O;};}({},false):undefined),check:check};},{"./_an-object":16,"./_ctx":34,"./_is-object":58,"./_object-gopd":79}],100:[function(require,module,exports){'use strict';var global=require('./_global'),dP=require('./_object-dp'),DESCRIPTORS=require('./_descriptors'),SPECIES=require('./_wks')('species');module.exports=function(KEY){var C=global[KEY];if(DESCRIPTORS&&C&&!C[SPECIES])dP.f(C,SPECIES,{configurable:true,get:function get(){return this;}});};},{"./_descriptors":37,"./_global":47,"./_object-dp":76,"./_wks":126}],101:[function(require,module,exports){var def=require('./_object-dp').f,has=require('./_has'),TAG=require('./_wks')('toStringTag');module.exports=function(it,tag,stat){if(it&&!has(it=stat?it:it.prototype,TAG))def(it,TAG,{configurable:true,value:tag});};},{"./_has":48,"./_object-dp":76,"./_wks":126}],102:[function(require,module,exports){var shared=require('./_shared')('keys'),uid=require('./_uid');module.exports=function(key){return shared[key]||(shared[key]=uid(key));};},{"./_shared":103,"./_uid":123}],103:[function(require,module,exports){var global=require('./_global'),SHARED='__core-js_shared__',store=global[SHARED]||(global[SHARED]={});module.exports=function(key){return store[key]||(store[key]={});};},{"./_global":47}],104:[function(require,module,exports){// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject=require('./_an-object'),aFunction=require('./_a-function'),SPECIES=require('./_wks')('species');module.exports=function(O,D){var C=anObject(O).constructor,S;return C===undefined||(S=anObject(C)[SPECIES])==undefined?D:aFunction(S);};},{"./_a-function":12,"./_an-object":16,"./_wks":126}],105:[function(require,module,exports){var fails=require('./_fails');module.exports=function(method,arg){return!!method&&fails(function(){arg?method.call(null,function(){},1):method.call(null);});};},{"./_fails":43}],106:[function(require,module,exports){var toInteger=require('./_to-integer'),defined=require('./_defined');// true  -> String#at
// false -> String#codePointAt
module.exports=function(TO_STRING){return function(that,pos){var s=String(defined(that)),i=toInteger(pos),l=s.length,a,b;if(i<0||i>=l)return TO_STRING?'':undefined;a=s.charCodeAt(i);return a<0xd800||a>0xdbff||i+1===l||(b=s.charCodeAt(i+1))<0xdc00||b>0xdfff?TO_STRING?s.charAt(i):a:TO_STRING?s.slice(i,i+2):(a-0xd800<<10)+(b-0xdc00)+0x10000;};};},{"./_defined":36,"./_to-integer":115}],107:[function(require,module,exports){// helper for String#{startsWith, endsWith, includes}
var isRegExp=require('./_is-regexp'),defined=require('./_defined');module.exports=function(that,searchString,NAME){if(isRegExp(searchString))throw TypeError('String#'+NAME+" doesn't accept regex!");return String(defined(that));};},{"./_defined":36,"./_is-regexp":59}],108:[function(require,module,exports){var $export=require('./_export'),fails=require('./_fails'),defined=require('./_defined'),quot=/"/g;// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML=function createHTML(string,tag,attribute,value){var S=String(defined(string)),p1='<'+tag;if(attribute!=='')p1+=' '+attribute+'="'+String(value).replace(quot,'&quot;')+'"';return p1+'>'+S+'</'+tag+'>';};module.exports=function(NAME,exec){var O={};O[NAME]=exec(createHTML);$export($export.P+$export.F*fails(function(){var test=''[NAME]('"');return test!==test.toLowerCase()||test.split('"').length>3;}),'String',O);};},{"./_defined":36,"./_export":41,"./_fails":43}],109:[function(require,module,exports){// https://github.com/tc39/proposal-string-pad-start-end
var toLength=require('./_to-length'),repeat=require('./_string-repeat'),defined=require('./_defined');module.exports=function(that,maxLength,fillString,left){var S=String(defined(that)),stringLength=S.length,fillStr=fillString===undefined?' ':String(fillString),intMaxLength=toLength(maxLength);if(intMaxLength<=stringLength||fillStr=='')return S;var fillLen=intMaxLength-stringLength,stringFiller=repeat.call(fillStr,Math.ceil(fillLen/fillStr.length));if(stringFiller.length>fillLen)stringFiller=stringFiller.slice(0,fillLen);return left?stringFiller+S:S+stringFiller;};},{"./_defined":36,"./_string-repeat":110,"./_to-length":117}],110:[function(require,module,exports){'use strict';var toInteger=require('./_to-integer'),defined=require('./_defined');module.exports=function repeat(count){var str=String(defined(this)),res='',n=toInteger(count);if(n<0||n==Infinity)throw RangeError("Count can't be negative");for(;n>0;(n>>>=1)&&(str+=str)){if(n&1)res+=str;}return res;};},{"./_defined":36,"./_to-integer":115}],111:[function(require,module,exports){var $export=require('./_export'),defined=require('./_defined'),fails=require('./_fails'),spaces=require('./_string-ws'),space='['+spaces+']',non="\u200B\x85",ltrim=RegExp('^'+space+space+'*'),rtrim=RegExp(space+space+'*$');var exporter=function exporter(KEY,exec,ALIAS){var exp={};var FORCE=fails(function(){return!!spaces[KEY]()||non[KEY]()!=non;});var fn=exp[KEY]=FORCE?exec(trim):spaces[KEY];if(ALIAS)exp[ALIAS]=fn;$export($export.P+$export.F*FORCE,'String',exp);};// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim=exporter.trim=function(string,TYPE){string=String(defined(string));if(TYPE&1)string=string.replace(ltrim,'');if(TYPE&2)string=string.replace(rtrim,'');return string;};module.exports=exporter;},{"./_defined":36,"./_export":41,"./_fails":43,"./_string-ws":112}],112:[function(require,module,exports){module.exports="\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003"+"\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";},{}],113:[function(require,module,exports){var ctx=require('./_ctx'),invoke=require('./_invoke'),html=require('./_html'),cel=require('./_dom-create'),global=require('./_global'),process=global.process,setTask=global.setImmediate,clearTask=global.clearImmediate,MessageChannel=global.MessageChannel,counter=0,queue={},ONREADYSTATECHANGE='onreadystatechange',defer,channel,port;var run=function run(){var id=+this;if(queue.hasOwnProperty(id)){var fn=queue[id];delete queue[id];fn();}};var listener=function listener(event){run.call(event.data);};// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask||!clearTask){setTask=function setImmediate(fn){var args=[],i=1;while(arguments.length>i){args.push(arguments[i++]);}queue[++counter]=function(){invoke(typeof fn=='function'?fn:Function(fn),args);};defer(counter);return counter;};clearTask=function clearImmediate(id){delete queue[id];};// Node.js 0.8-
if(require('./_cof')(process)=='process'){defer=function defer(id){process.nextTick(ctx(run,id,1));};// Browsers with MessageChannel, includes WebWorkers
}else if(MessageChannel){channel=new MessageChannel();port=channel.port2;channel.port1.onmessage=listener;defer=ctx(port.postMessage,port,1);// Browsers with postMessage, skip WebWorkers
// IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
}else if(global.addEventListener&&typeof postMessage=='function'&&!global.importScripts){defer=function defer(id){global.postMessage(id+'','*');};global.addEventListener('message',listener,false);// IE8-
}else if(ONREADYSTATECHANGE in cel('script')){defer=function defer(id){html.appendChild(cel('script'))[ONREADYSTATECHANGE]=function(){html.removeChild(this);run.call(id);};};// Rest old browsers
}else{defer=function defer(id){setTimeout(ctx(run,id,1),0);};}}module.exports={set:setTask,clear:clearTask};},{"./_cof":27,"./_ctx":34,"./_dom-create":38,"./_global":47,"./_html":50,"./_invoke":53}],114:[function(require,module,exports){var toInteger=require('./_to-integer'),max=Math.max,min=Math.min;module.exports=function(index,length){index=toInteger(index);return index<0?max(index+length,0):min(index,length);};},{"./_to-integer":115}],115:[function(require,module,exports){// 7.1.4 ToInteger
var ceil=Math.ceil,floor=Math.floor;module.exports=function(it){return isNaN(it=+it)?0:(it>0?floor:ceil)(it);};},{}],116:[function(require,module,exports){// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject=require('./_iobject'),defined=require('./_defined');module.exports=function(it){return IObject(defined(it));};},{"./_defined":36,"./_iobject":54}],117:[function(require,module,exports){// 7.1.15 ToLength
var toInteger=require('./_to-integer'),min=Math.min;module.exports=function(it){return it>0?min(toInteger(it),0x1fffffffffffff):0;// pow(2, 53) - 1 == 9007199254740991
};},{"./_to-integer":115}],118:[function(require,module,exports){// 7.1.13 ToObject(argument)
var defined=require('./_defined');module.exports=function(it){return Object(defined(it));};},{"./_defined":36}],119:[function(require,module,exports){// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject=require('./_is-object');// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports=function(it,S){if(!isObject(it))return it;var fn,val;if(S&&typeof(fn=it.toString)=='function'&&!isObject(val=fn.call(it)))return val;if(typeof(fn=it.valueOf)=='function'&&!isObject(val=fn.call(it)))return val;if(!S&&typeof(fn=it.toString)=='function'&&!isObject(val=fn.call(it)))return val;throw TypeError("Can't convert object to primitive value");};},{"./_is-object":58}],120:[function(require,module,exports){'use strict';if(require('./_descriptors')){var LIBRARY=require('./_library'),global=require('./_global'),fails=require('./_fails'),$export=require('./_export'),$typed=require('./_typed'),$buffer=require('./_typed-buffer'),ctx=require('./_ctx'),anInstance=require('./_an-instance'),propertyDesc=require('./_property-desc'),hide=require('./_hide'),redefineAll=require('./_redefine-all'),toInteger=require('./_to-integer'),toLength=require('./_to-length'),toIndex=require('./_to-index'),toPrimitive=require('./_to-primitive'),has=require('./_has'),same=require('./_same-value'),classof=require('./_classof'),isObject=require('./_is-object'),toObject=require('./_to-object'),isArrayIter=require('./_is-array-iter'),create=require('./_object-create'),getPrototypeOf=require('./_object-gpo'),gOPN=require('./_object-gopn').f,getIterFn=require('./core.get-iterator-method'),uid=require('./_uid'),wks=require('./_wks'),createArrayMethod=require('./_array-methods'),createArrayIncludes=require('./_array-includes'),speciesConstructor=require('./_species-constructor'),ArrayIterators=require('./es6.array.iterator'),Iterators=require('./_iterators'),$iterDetect=require('./_iter-detect'),setSpecies=require('./_set-species'),arrayFill=require('./_array-fill'),arrayCopyWithin=require('./_array-copy-within'),$DP=require('./_object-dp'),$GOPD=require('./_object-gopd'),dP=$DP.f,gOPD=$GOPD.f,RangeError=global.RangeError,TypeError=global.TypeError,Uint8Array=global.Uint8Array,ARRAY_BUFFER='ArrayBuffer',SHARED_BUFFER='Shared'+ARRAY_BUFFER,BYTES_PER_ELEMENT='BYTES_PER_ELEMENT',PROTOTYPE='prototype',ArrayProto=Array[PROTOTYPE],$ArrayBuffer=$buffer.ArrayBuffer,$DataView=$buffer.DataView,arrayForEach=createArrayMethod(0),arrayFilter=createArrayMethod(2),arraySome=createArrayMethod(3),arrayEvery=createArrayMethod(4),arrayFind=createArrayMethod(5),arrayFindIndex=createArrayMethod(6),arrayIncludes=createArrayIncludes(true),arrayIndexOf=createArrayIncludes(false),arrayValues=ArrayIterators.values,arrayKeys=ArrayIterators.keys,arrayEntries=ArrayIterators.entries,arrayLastIndexOf=ArrayProto.lastIndexOf,arrayReduce=ArrayProto.reduce,arrayReduceRight=ArrayProto.reduceRight,arrayJoin=ArrayProto.join,arraySort=ArrayProto.sort,arraySlice=ArrayProto.slice,arrayToString=ArrayProto.toString,arrayToLocaleString=ArrayProto.toLocaleString,ITERATOR=wks('iterator'),TAG=wks('toStringTag'),TYPED_CONSTRUCTOR=uid('typed_constructor'),DEF_CONSTRUCTOR=uid('def_constructor'),ALL_CONSTRUCTORS=$typed.CONSTR,TYPED_ARRAY=$typed.TYPED,VIEW=$typed.VIEW,WRONG_LENGTH='Wrong length!';var $map=createArrayMethod(1,function(O,length){return allocate(speciesConstructor(O,O[DEF_CONSTRUCTOR]),length);});var LITTLE_ENDIAN=fails(function(){return new Uint8Array(new Uint16Array([1]).buffer)[0]===1;});var FORCED_SET=!!Uint8Array&&!!Uint8Array[PROTOTYPE].set&&fails(function(){new Uint8Array(1).set({});});var strictToLength=function strictToLength(it,SAME){if(it===undefined)throw TypeError(WRONG_LENGTH);var number=+it,length=toLength(it);if(SAME&&!same(number,length))throw RangeError(WRONG_LENGTH);return length;};var toOffset=function toOffset(it,BYTES){var offset=toInteger(it);if(offset<0||offset%BYTES)throw RangeError('Wrong offset!');return offset;};var validate=function validate(it){if(isObject(it)&&TYPED_ARRAY in it)return it;throw TypeError(it+' is not a typed array!');};var allocate=function allocate(C,length){if(!(isObject(C)&&TYPED_CONSTRUCTOR in C)){throw TypeError('It is not a typed array constructor!');}return new C(length);};var speciesFromList=function speciesFromList(O,list){return fromList(speciesConstructor(O,O[DEF_CONSTRUCTOR]),list);};var fromList=function fromList(C,list){var index=0,length=list.length,result=allocate(C,length);while(length>index){result[index]=list[index++];}return result;};var addGetter=function addGetter(it,key,internal){dP(it,key,{get:function get(){return this._d[internal];}});};var $from=function from(source/*, mapfn, thisArg */){var O=toObject(source),aLen=arguments.length,mapfn=aLen>1?arguments[1]:undefined,mapping=mapfn!==undefined,iterFn=getIterFn(O),i,length,values,result,step,iterator;if(iterFn!=undefined&&!isArrayIter(iterFn)){for(iterator=iterFn.call(O),values=[],i=0;!(step=iterator.next()).done;i++){values.push(step.value);}O=values;}if(mapping&&aLen>2)mapfn=ctx(mapfn,arguments[2],2);for(i=0,length=toLength(O.length),result=allocate(this,length);length>i;i++){result[i]=mapping?mapfn(O[i],i):O[i];}return result;};var $of=function of()/*...items*/{var index=0,length=arguments.length,result=allocate(this,length);while(length>index){result[index]=arguments[index++];}return result;};// iOS Safari 6.x fails here
var TO_LOCALE_BUG=!!Uint8Array&&fails(function(){arrayToLocaleString.call(new Uint8Array(1));});var $toLocaleString=function toLocaleString(){return arrayToLocaleString.apply(TO_LOCALE_BUG?arraySlice.call(validate(this)):validate(this),arguments);};var proto={copyWithin:function copyWithin(target,start/*, end */){return arrayCopyWithin.call(validate(this),target,start,arguments.length>2?arguments[2]:undefined);},every:function every(callbackfn/*, thisArg */){return arrayEvery(validate(this),callbackfn,arguments.length>1?arguments[1]:undefined);},fill:function fill(value/*, start, end */){// eslint-disable-line no-unused-vars
return arrayFill.apply(validate(this),arguments);},filter:function filter(callbackfn/*, thisArg */){return speciesFromList(this,arrayFilter(validate(this),callbackfn,arguments.length>1?arguments[1]:undefined));},find:function find(predicate/*, thisArg */){return arrayFind(validate(this),predicate,arguments.length>1?arguments[1]:undefined);},findIndex:function findIndex(predicate/*, thisArg */){return arrayFindIndex(validate(this),predicate,arguments.length>1?arguments[1]:undefined);},forEach:function forEach(callbackfn/*, thisArg */){arrayForEach(validate(this),callbackfn,arguments.length>1?arguments[1]:undefined);},indexOf:function indexOf(searchElement/*, fromIndex */){return arrayIndexOf(validate(this),searchElement,arguments.length>1?arguments[1]:undefined);},includes:function includes(searchElement/*, fromIndex */){return arrayIncludes(validate(this),searchElement,arguments.length>1?arguments[1]:undefined);},join:function join(separator){// eslint-disable-line no-unused-vars
return arrayJoin.apply(validate(this),arguments);},lastIndexOf:function lastIndexOf(searchElement/*, fromIndex */){// eslint-disable-line no-unused-vars
return arrayLastIndexOf.apply(validate(this),arguments);},map:function map(mapfn/*, thisArg */){return $map(validate(this),mapfn,arguments.length>1?arguments[1]:undefined);},reduce:function reduce(callbackfn/*, initialValue */){// eslint-disable-line no-unused-vars
return arrayReduce.apply(validate(this),arguments);},reduceRight:function reduceRight(callbackfn/*, initialValue */){// eslint-disable-line no-unused-vars
return arrayReduceRight.apply(validate(this),arguments);},reverse:function reverse(){var that=this,length=validate(that).length,middle=Math.floor(length/2),index=0,value;while(index<middle){value=that[index];that[index++]=that[--length];that[length]=value;}return that;},some:function some(callbackfn/*, thisArg */){return arraySome(validate(this),callbackfn,arguments.length>1?arguments[1]:undefined);},sort:function sort(comparefn){return arraySort.call(validate(this),comparefn);},subarray:function subarray(begin,end){var O=validate(this),length=O.length,$begin=toIndex(begin,length);return new(speciesConstructor(O,O[DEF_CONSTRUCTOR]))(O.buffer,O.byteOffset+$begin*O.BYTES_PER_ELEMENT,toLength((end===undefined?length:toIndex(end,length))-$begin));}};var $slice=function slice(start,end){return speciesFromList(this,arraySlice.call(validate(this),start,end));};var $set=function set(arrayLike/*, offset */){validate(this);var offset=toOffset(arguments[1],1),length=this.length,src=toObject(arrayLike),len=toLength(src.length),index=0;if(len+offset>length)throw RangeError(WRONG_LENGTH);while(index<len){this[offset+index]=src[index++];}};var $iterators={entries:function entries(){return arrayEntries.call(validate(this));},keys:function keys(){return arrayKeys.call(validate(this));},values:function values(){return arrayValues.call(validate(this));}};var isTAIndex=function isTAIndex(target,key){return isObject(target)&&target[TYPED_ARRAY]&&(typeof key==="undefined"?"undefined":_typeof(key))!='symbol'&&key in target&&String(+key)==String(key);};var $getDesc=function getOwnPropertyDescriptor(target,key){return isTAIndex(target,key=toPrimitive(key,true))?propertyDesc(2,target[key]):gOPD(target,key);};var $setDesc=function defineProperty(target,key,desc){if(isTAIndex(target,key=toPrimitive(key,true))&&isObject(desc)&&has(desc,'value')&&!has(desc,'get')&&!has(desc,'set')// TODO: add validation descriptor w/o calling accessors
&&!desc.configurable&&(!has(desc,'writable')||desc.writable)&&(!has(desc,'enumerable')||desc.enumerable)){target[key]=desc.value;return target;}else return dP(target,key,desc);};if(!ALL_CONSTRUCTORS){$GOPD.f=$getDesc;$DP.f=$setDesc;}$export($export.S+$export.F*!ALL_CONSTRUCTORS,'Object',{getOwnPropertyDescriptor:$getDesc,defineProperty:$setDesc});if(fails(function(){arrayToString.call({});})){arrayToString=arrayToLocaleString=function toString(){return arrayJoin.call(this);};}var $TypedArrayPrototype$=redefineAll({},proto);redefineAll($TypedArrayPrototype$,$iterators);hide($TypedArrayPrototype$,ITERATOR,$iterators.values);redefineAll($TypedArrayPrototype$,{slice:$slice,set:$set,constructor:function constructor(){/* noop */},toString:arrayToString,toLocaleString:$toLocaleString});addGetter($TypedArrayPrototype$,'buffer','b');addGetter($TypedArrayPrototype$,'byteOffset','o');addGetter($TypedArrayPrototype$,'byteLength','l');addGetter($TypedArrayPrototype$,'length','e');dP($TypedArrayPrototype$,TAG,{get:function get(){return this[TYPED_ARRAY];}});module.exports=function(KEY,BYTES,wrapper,CLAMPED){CLAMPED=!!CLAMPED;var NAME=KEY+(CLAMPED?'Clamped':'')+'Array',ISNT_UINT8=NAME!='Uint8Array',GETTER='get'+KEY,SETTER='set'+KEY,TypedArray=global[NAME],Base=TypedArray||{},TAC=TypedArray&&getPrototypeOf(TypedArray),FORCED=!TypedArray||!$typed.ABV,O={},TypedArrayPrototype=TypedArray&&TypedArray[PROTOTYPE];var getter=function getter(that,index){var data=that._d;return data.v[GETTER](index*BYTES+data.o,LITTLE_ENDIAN);};var setter=function setter(that,index,value){var data=that._d;if(CLAMPED)value=(value=Math.round(value))<0?0:value>0xff?0xff:value&0xff;data.v[SETTER](index*BYTES+data.o,value,LITTLE_ENDIAN);};var addElement=function addElement(that,index){dP(that,index,{get:function get(){return getter(this,index);},set:function set(value){return setter(this,index,value);},enumerable:true});};if(FORCED){TypedArray=wrapper(function(that,data,$offset,$length){anInstance(that,TypedArray,NAME,'_d');var index=0,offset=0,buffer,byteLength,length,klass;if(!isObject(data)){length=strictToLength(data,true);byteLength=length*BYTES;buffer=new $ArrayBuffer(byteLength);}else if(data instanceof $ArrayBuffer||(klass=classof(data))==ARRAY_BUFFER||klass==SHARED_BUFFER){buffer=data;offset=toOffset($offset,BYTES);var $len=data.byteLength;if($length===undefined){if($len%BYTES)throw RangeError(WRONG_LENGTH);byteLength=$len-offset;if(byteLength<0)throw RangeError(WRONG_LENGTH);}else{byteLength=toLength($length)*BYTES;if(byteLength+offset>$len)throw RangeError(WRONG_LENGTH);}length=byteLength/BYTES;}else if(TYPED_ARRAY in data){return fromList(TypedArray,data);}else{return $from.call(TypedArray,data);}hide(that,'_d',{b:buffer,o:offset,l:byteLength,e:length,v:new $DataView(buffer)});while(index<length){addElement(that,index++);}});TypedArrayPrototype=TypedArray[PROTOTYPE]=create($TypedArrayPrototype$);hide(TypedArrayPrototype,'constructor',TypedArray);}else if(!$iterDetect(function(iter){// V8 works with iterators, but fails in many other cases
// https://code.google.com/p/v8/issues/detail?id=4552
new TypedArray(null);// eslint-disable-line no-new
new TypedArray(iter);// eslint-disable-line no-new
},true)){TypedArray=wrapper(function(that,data,$offset,$length){anInstance(that,TypedArray,NAME);var klass;// `ws` module bug, temporarily remove validation length for Uint8Array
// https://github.com/websockets/ws/pull/645
if(!isObject(data))return new Base(strictToLength(data,ISNT_UINT8));if(data instanceof $ArrayBuffer||(klass=classof(data))==ARRAY_BUFFER||klass==SHARED_BUFFER){return $length!==undefined?new Base(data,toOffset($offset,BYTES),$length):$offset!==undefined?new Base(data,toOffset($offset,BYTES)):new Base(data);}if(TYPED_ARRAY in data)return fromList(TypedArray,data);return $from.call(TypedArray,data);});arrayForEach(TAC!==Function.prototype?gOPN(Base).concat(gOPN(TAC)):gOPN(Base),function(key){if(!(key in TypedArray))hide(TypedArray,key,Base[key]);});TypedArray[PROTOTYPE]=TypedArrayPrototype;if(!LIBRARY)TypedArrayPrototype.constructor=TypedArray;}var $nativeIterator=TypedArrayPrototype[ITERATOR],CORRECT_ITER_NAME=!!$nativeIterator&&($nativeIterator.name=='values'||$nativeIterator.name==undefined),$iterator=$iterators.values;hide(TypedArray,TYPED_CONSTRUCTOR,true);hide(TypedArrayPrototype,TYPED_ARRAY,NAME);hide(TypedArrayPrototype,VIEW,true);hide(TypedArrayPrototype,DEF_CONSTRUCTOR,TypedArray);if(CLAMPED?new TypedArray(1)[TAG]!=NAME:!(TAG in TypedArrayPrototype)){dP(TypedArrayPrototype,TAG,{get:function get(){return NAME;}});}O[NAME]=TypedArray;$export($export.G+$export.W+$export.F*(TypedArray!=Base),O);$export($export.S,NAME,{BYTES_PER_ELEMENT:BYTES,from:$from,of:$of});if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype,BYTES_PER_ELEMENT,BYTES);$export($export.P,NAME,proto);setSpecies(NAME);$export($export.P+$export.F*FORCED_SET,NAME,{set:$set});$export($export.P+$export.F*!CORRECT_ITER_NAME,NAME,$iterators);$export($export.P+$export.F*(TypedArrayPrototype.toString!=arrayToString),NAME,{toString:arrayToString});$export($export.P+$export.F*fails(function(){new TypedArray(1).slice();}),NAME,{slice:$slice});$export($export.P+$export.F*(fails(function(){return[1,2].toLocaleString()!=new TypedArray([1,2]).toLocaleString();})||!fails(function(){TypedArrayPrototype.toLocaleString.call([1,2]);})),NAME,{toLocaleString:$toLocaleString});Iterators[NAME]=CORRECT_ITER_NAME?$nativeIterator:$iterator;if(!LIBRARY&&!CORRECT_ITER_NAME)hide(TypedArrayPrototype,ITERATOR,$iterator);};}else module.exports=function(){/* empty */};},{"./_an-instance":15,"./_array-copy-within":17,"./_array-fill":18,"./_array-includes":20,"./_array-methods":21,"./_classof":26,"./_ctx":34,"./_descriptors":37,"./_export":41,"./_fails":43,"./_global":47,"./_has":48,"./_hide":49,"./_is-array-iter":55,"./_is-object":58,"./_iter-detect":63,"./_iterators":65,"./_library":67,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_object-gpo":83,"./_property-desc":94,"./_redefine-all":95,"./_same-value":98,"./_set-species":100,"./_species-constructor":104,"./_to-index":114,"./_to-integer":115,"./_to-length":117,"./_to-object":118,"./_to-primitive":119,"./_typed":122,"./_typed-buffer":121,"./_uid":123,"./_wks":126,"./core.get-iterator-method":127,"./es6.array.iterator":139}],121:[function(require,module,exports){'use strict';var global=require('./_global'),DESCRIPTORS=require('./_descriptors'),LIBRARY=require('./_library'),$typed=require('./_typed'),hide=require('./_hide'),redefineAll=require('./_redefine-all'),fails=require('./_fails'),anInstance=require('./_an-instance'),toInteger=require('./_to-integer'),toLength=require('./_to-length'),gOPN=require('./_object-gopn').f,dP=require('./_object-dp').f,arrayFill=require('./_array-fill'),setToStringTag=require('./_set-to-string-tag'),ARRAY_BUFFER='ArrayBuffer',DATA_VIEW='DataView',PROTOTYPE='prototype',WRONG_LENGTH='Wrong length!',WRONG_INDEX='Wrong index!',$ArrayBuffer=global[ARRAY_BUFFER],$DataView=global[DATA_VIEW],Math=global.Math,RangeError=global.RangeError,Infinity=global.Infinity,BaseBuffer=$ArrayBuffer,abs=Math.abs,pow=Math.pow,floor=Math.floor,log=Math.log,LN2=Math.LN2,BUFFER='buffer',BYTE_LENGTH='byteLength',BYTE_OFFSET='byteOffset',$BUFFER=DESCRIPTORS?'_b':BUFFER,$LENGTH=DESCRIPTORS?'_l':BYTE_LENGTH,$OFFSET=DESCRIPTORS?'_o':BYTE_OFFSET;// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754=function packIEEE754(value,mLen,nBytes){var buffer=Array(nBytes),eLen=nBytes*8-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,rt=mLen===23?pow(2,-24)-pow(2,-77):0,i=0,s=value<0||value===0&&1/value<0?1:0,e,m,c;value=abs(value);if(value!=value||value===Infinity){m=value!=value?1:0;e=eMax;}else{e=floor(log(value)/LN2);if(value*(c=pow(2,-e))<1){e--;c*=2;}if(e+eBias>=1){value+=rt/c;}else{value+=rt*pow(2,1-eBias);}if(value*c>=2){e++;c/=2;}if(e+eBias>=eMax){m=0;e=eMax;}else if(e+eBias>=1){m=(value*c-1)*pow(2,mLen);e=e+eBias;}else{m=value*pow(2,eBias-1)*pow(2,mLen);e=0;}}for(;mLen>=8;buffer[i++]=m&255,m/=256,mLen-=8){}e=e<<mLen|m;eLen+=mLen;for(;eLen>0;buffer[i++]=e&255,e/=256,eLen-=8){}buffer[--i]|=s*128;return buffer;};var unpackIEEE754=function unpackIEEE754(buffer,mLen,nBytes){var eLen=nBytes*8-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,nBits=eLen-7,i=nBytes-1,s=buffer[i--],e=s&127,m;s>>=7;for(;nBits>0;e=e*256+buffer[i],i--,nBits-=8){}m=e&(1<<-nBits)-1;e>>=-nBits;nBits+=mLen;for(;nBits>0;m=m*256+buffer[i],i--,nBits-=8){}if(e===0){e=1-eBias;}else if(e===eMax){return m?NaN:s?-Infinity:Infinity;}else{m=m+pow(2,mLen);e=e-eBias;}return(s?-1:1)*m*pow(2,e-mLen);};var unpackI32=function unpackI32(bytes){return bytes[3]<<24|bytes[2]<<16|bytes[1]<<8|bytes[0];};var packI8=function packI8(it){return[it&0xff];};var packI16=function packI16(it){return[it&0xff,it>>8&0xff];};var packI32=function packI32(it){return[it&0xff,it>>8&0xff,it>>16&0xff,it>>24&0xff];};var packF64=function packF64(it){return packIEEE754(it,52,8);};var packF32=function packF32(it){return packIEEE754(it,23,4);};var addGetter=function addGetter(C,key,internal){dP(C[PROTOTYPE],key,{get:function get(){return this[internal];}});};var get=function get(view,bytes,index,isLittleEndian){var numIndex=+index,intIndex=toInteger(numIndex);if(numIndex!=intIndex||intIndex<0||intIndex+bytes>view[$LENGTH])throw RangeError(WRONG_INDEX);var store=view[$BUFFER]._b,start=intIndex+view[$OFFSET],pack=store.slice(start,start+bytes);return isLittleEndian?pack:pack.reverse();};var set=function set(view,bytes,index,conversion,value,isLittleEndian){var numIndex=+index,intIndex=toInteger(numIndex);if(numIndex!=intIndex||intIndex<0||intIndex+bytes>view[$LENGTH])throw RangeError(WRONG_INDEX);var store=view[$BUFFER]._b,start=intIndex+view[$OFFSET],pack=conversion(+value);for(var i=0;i<bytes;i++){store[start+i]=pack[isLittleEndian?i:bytes-i-1];}};var validateArrayBufferArguments=function validateArrayBufferArguments(that,length){anInstance(that,$ArrayBuffer,ARRAY_BUFFER);var numberLength=+length,byteLength=toLength(numberLength);if(numberLength!=byteLength)throw RangeError(WRONG_LENGTH);return byteLength;};if(!$typed.ABV){$ArrayBuffer=function ArrayBuffer(length){var byteLength=validateArrayBufferArguments(this,length);this._b=arrayFill.call(Array(byteLength),0);this[$LENGTH]=byteLength;};$DataView=function DataView(buffer,byteOffset,byteLength){anInstance(this,$DataView,DATA_VIEW);anInstance(buffer,$ArrayBuffer,DATA_VIEW);var bufferLength=buffer[$LENGTH],offset=toInteger(byteOffset);if(offset<0||offset>bufferLength)throw RangeError('Wrong offset!');byteLength=byteLength===undefined?bufferLength-offset:toLength(byteLength);if(offset+byteLength>bufferLength)throw RangeError(WRONG_LENGTH);this[$BUFFER]=buffer;this[$OFFSET]=offset;this[$LENGTH]=byteLength;};if(DESCRIPTORS){addGetter($ArrayBuffer,BYTE_LENGTH,'_l');addGetter($DataView,BUFFER,'_b');addGetter($DataView,BYTE_LENGTH,'_l');addGetter($DataView,BYTE_OFFSET,'_o');}redefineAll($DataView[PROTOTYPE],{getInt8:function getInt8(byteOffset){return get(this,1,byteOffset)[0]<<24>>24;},getUint8:function getUint8(byteOffset){return get(this,1,byteOffset)[0];},getInt16:function getInt16(byteOffset/*, littleEndian */){var bytes=get(this,2,byteOffset,arguments[1]);return(bytes[1]<<8|bytes[0])<<16>>16;},getUint16:function getUint16(byteOffset/*, littleEndian */){var bytes=get(this,2,byteOffset,arguments[1]);return bytes[1]<<8|bytes[0];},getInt32:function getInt32(byteOffset/*, littleEndian */){return unpackI32(get(this,4,byteOffset,arguments[1]));},getUint32:function getUint32(byteOffset/*, littleEndian */){return unpackI32(get(this,4,byteOffset,arguments[1]))>>>0;},getFloat32:function getFloat32(byteOffset/*, littleEndian */){return unpackIEEE754(get(this,4,byteOffset,arguments[1]),23,4);},getFloat64:function getFloat64(byteOffset/*, littleEndian */){return unpackIEEE754(get(this,8,byteOffset,arguments[1]),52,8);},setInt8:function setInt8(byteOffset,value){set(this,1,byteOffset,packI8,value);},setUint8:function setUint8(byteOffset,value){set(this,1,byteOffset,packI8,value);},setInt16:function setInt16(byteOffset,value/*, littleEndian */){set(this,2,byteOffset,packI16,value,arguments[2]);},setUint16:function setUint16(byteOffset,value/*, littleEndian */){set(this,2,byteOffset,packI16,value,arguments[2]);},setInt32:function setInt32(byteOffset,value/*, littleEndian */){set(this,4,byteOffset,packI32,value,arguments[2]);},setUint32:function setUint32(byteOffset,value/*, littleEndian */){set(this,4,byteOffset,packI32,value,arguments[2]);},setFloat32:function setFloat32(byteOffset,value/*, littleEndian */){set(this,4,byteOffset,packF32,value,arguments[2]);},setFloat64:function setFloat64(byteOffset,value/*, littleEndian */){set(this,8,byteOffset,packF64,value,arguments[2]);}});}else{if(!fails(function(){new $ArrayBuffer();// eslint-disable-line no-new
})||!fails(function(){new $ArrayBuffer(.5);// eslint-disable-line no-new
})){$ArrayBuffer=function ArrayBuffer(length){return new BaseBuffer(validateArrayBufferArguments(this,length));};var ArrayBufferProto=$ArrayBuffer[PROTOTYPE]=BaseBuffer[PROTOTYPE];for(var keys=gOPN(BaseBuffer),j=0,key;keys.length>j;){if(!((key=keys[j++])in $ArrayBuffer))hide($ArrayBuffer,key,BaseBuffer[key]);};if(!LIBRARY)ArrayBufferProto.constructor=$ArrayBuffer;}// iOS Safari 7.x bug
var view=new $DataView(new $ArrayBuffer(2)),$setInt8=$DataView[PROTOTYPE].setInt8;view.setInt8(0,2147483648);view.setInt8(1,2147483649);if(view.getInt8(0)||!view.getInt8(1))redefineAll($DataView[PROTOTYPE],{setInt8:function setInt8(byteOffset,value){$setInt8.call(this,byteOffset,value<<24>>24);},setUint8:function setUint8(byteOffset,value){$setInt8.call(this,byteOffset,value<<24>>24);}},true);}setToStringTag($ArrayBuffer,ARRAY_BUFFER);setToStringTag($DataView,DATA_VIEW);hide($DataView[PROTOTYPE],$typed.VIEW,true);exports[ARRAY_BUFFER]=$ArrayBuffer;exports[DATA_VIEW]=$DataView;},{"./_an-instance":15,"./_array-fill":18,"./_descriptors":37,"./_fails":43,"./_global":47,"./_hide":49,"./_library":67,"./_object-dp":76,"./_object-gopn":81,"./_redefine-all":95,"./_set-to-string-tag":101,"./_to-integer":115,"./_to-length":117,"./_typed":122}],122:[function(require,module,exports){var global=require('./_global'),hide=require('./_hide'),uid=require('./_uid'),TYPED=uid('typed_array'),VIEW=uid('view'),ABV=!!(global.ArrayBuffer&&global.DataView),CONSTR=ABV,i=0,l=9,Typed;var TypedArrayConstructors='Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');while(i<l){if(Typed=global[TypedArrayConstructors[i++]]){hide(Typed.prototype,TYPED,true);hide(Typed.prototype,VIEW,true);}else CONSTR=false;}module.exports={ABV:ABV,CONSTR:CONSTR,TYPED:TYPED,VIEW:VIEW};},{"./_global":47,"./_hide":49,"./_uid":123}],123:[function(require,module,exports){var id=0,px=Math.random();module.exports=function(key){return'Symbol('.concat(key===undefined?'':key,')_',(++id+px).toString(36));};},{}],124:[function(require,module,exports){var global=require('./_global'),core=require('./_core'),LIBRARY=require('./_library'),wksExt=require('./_wks-ext'),defineProperty=require('./_object-dp').f;module.exports=function(name){var $Symbol=core.Symbol||(core.Symbol=LIBRARY?{}:global.Symbol||{});if(name.charAt(0)!='_'&&!(name in $Symbol))defineProperty($Symbol,name,{value:wksExt.f(name)});};},{"./_core":32,"./_global":47,"./_library":67,"./_object-dp":76,"./_wks-ext":125}],125:[function(require,module,exports){exports.f=require('./_wks');},{"./_wks":126}],126:[function(require,module,exports){var store=require('./_shared')('wks'),uid=require('./_uid'),_Symbol=require('./_global').Symbol,USE_SYMBOL=typeof _Symbol=='function';var $exports=module.exports=function(name){return store[name]||(store[name]=USE_SYMBOL&&_Symbol[name]||(USE_SYMBOL?_Symbol:uid)('Symbol.'+name));};$exports.store=store;},{"./_global":47,"./_shared":103,"./_uid":123}],127:[function(require,module,exports){var classof=require('./_classof'),ITERATOR=require('./_wks')('iterator'),Iterators=require('./_iterators');module.exports=require('./_core').getIteratorMethod=function(it){if(it!=undefined)return it[ITERATOR]||it['@@iterator']||Iterators[classof(it)];};},{"./_classof":26,"./_core":32,"./_iterators":65,"./_wks":126}],128:[function(require,module,exports){// https://github.com/benjamingr/RexExp.escape
var $export=require('./_export'),$re=require('./_replacer')(/[\\^$*+?.()|[\]{}]/g,'\\$&');$export($export.S,'RegExp',{escape:function escape(it){return $re(it);}});},{"./_export":41,"./_replacer":97}],129:[function(require,module,exports){// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export=require('./_export');$export($export.P,'Array',{copyWithin:require('./_array-copy-within')});require('./_add-to-unscopables')('copyWithin');},{"./_add-to-unscopables":14,"./_array-copy-within":17,"./_export":41}],130:[function(require,module,exports){'use strict';var $export=require('./_export'),$every=require('./_array-methods')(4);$export($export.P+$export.F*!require('./_strict-method')([].every,true),'Array',{// 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
every:function every(callbackfn/* , thisArg */){return $every(this,callbackfn,arguments[1]);}});},{"./_array-methods":21,"./_export":41,"./_strict-method":105}],131:[function(require,module,exports){// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export=require('./_export');$export($export.P,'Array',{fill:require('./_array-fill')});require('./_add-to-unscopables')('fill');},{"./_add-to-unscopables":14,"./_array-fill":18,"./_export":41}],132:[function(require,module,exports){'use strict';var $export=require('./_export'),$filter=require('./_array-methods')(2);$export($export.P+$export.F*!require('./_strict-method')([].filter,true),'Array',{// 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
filter:function filter(callbackfn/* , thisArg */){return $filter(this,callbackfn,arguments[1]);}});},{"./_array-methods":21,"./_export":41,"./_strict-method":105}],133:[function(require,module,exports){'use strict';// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export=require('./_export'),$find=require('./_array-methods')(6),KEY='findIndex',forced=true;// Shouldn't skip holes
if(KEY in[])Array(1)[KEY](function(){forced=false;});$export($export.P+$export.F*forced,'Array',{findIndex:function findIndex(callbackfn/*, that = undefined */){return $find(this,callbackfn,arguments.length>1?arguments[1]:undefined);}});require('./_add-to-unscopables')(KEY);},{"./_add-to-unscopables":14,"./_array-methods":21,"./_export":41}],134:[function(require,module,exports){'use strict';// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export=require('./_export'),$find=require('./_array-methods')(5),KEY='find',forced=true;// Shouldn't skip holes
if(KEY in[])Array(1)[KEY](function(){forced=false;});$export($export.P+$export.F*forced,'Array',{find:function find(callbackfn/*, that = undefined */){return $find(this,callbackfn,arguments.length>1?arguments[1]:undefined);}});require('./_add-to-unscopables')(KEY);},{"./_add-to-unscopables":14,"./_array-methods":21,"./_export":41}],135:[function(require,module,exports){'use strict';var $export=require('./_export'),$forEach=require('./_array-methods')(0),STRICT=require('./_strict-method')([].forEach,true);$export($export.P+$export.F*!STRICT,'Array',{// 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
forEach:function forEach(callbackfn/* , thisArg */){return $forEach(this,callbackfn,arguments[1]);}});},{"./_array-methods":21,"./_export":41,"./_strict-method":105}],136:[function(require,module,exports){'use strict';var ctx=require('./_ctx'),$export=require('./_export'),toObject=require('./_to-object'),call=require('./_iter-call'),isArrayIter=require('./_is-array-iter'),toLength=require('./_to-length'),createProperty=require('./_create-property'),getIterFn=require('./core.get-iterator-method');$export($export.S+$export.F*!require('./_iter-detect')(function(iter){Array.from(iter);}),'Array',{// 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
from:function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){var O=toObject(arrayLike),C=typeof this=='function'?this:Array,aLen=arguments.length,mapfn=aLen>1?arguments[1]:undefined,mapping=mapfn!==undefined,index=0,iterFn=getIterFn(O),length,result,step,iterator;if(mapping)mapfn=ctx(mapfn,aLen>2?arguments[2]:undefined,2);// if object isn't iterable or it's array with default iterator - use simple case
if(iterFn!=undefined&&!(C==Array&&isArrayIter(iterFn))){for(iterator=iterFn.call(O),result=new C();!(step=iterator.next()).done;index++){createProperty(result,index,mapping?call(iterator,mapfn,[step.value,index],true):step.value);}}else{length=toLength(O.length);for(result=new C(length);length>index;index++){createProperty(result,index,mapping?mapfn(O[index],index):O[index]);}}result.length=index;return result;}});},{"./_create-property":33,"./_ctx":34,"./_export":41,"./_is-array-iter":55,"./_iter-call":60,"./_iter-detect":63,"./_to-length":117,"./_to-object":118,"./core.get-iterator-method":127}],137:[function(require,module,exports){'use strict';var $export=require('./_export'),$indexOf=require('./_array-includes')(false),$native=[].indexOf,NEGATIVE_ZERO=!!$native&&1/[1].indexOf(1,-0)<0;$export($export.P+$export.F*(NEGATIVE_ZERO||!require('./_strict-method')($native)),'Array',{// 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
indexOf:function indexOf(searchElement/*, fromIndex = 0 */){return NEGATIVE_ZERO// convert -0 to +0
?$native.apply(this,arguments)||0:$indexOf(this,searchElement,arguments[1]);}});},{"./_array-includes":20,"./_export":41,"./_strict-method":105}],138:[function(require,module,exports){// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export=require('./_export');$export($export.S,'Array',{isArray:require('./_is-array')});},{"./_export":41,"./_is-array":56}],139:[function(require,module,exports){'use strict';var addToUnscopables=require('./_add-to-unscopables'),step=require('./_iter-step'),Iterators=require('./_iterators'),toIObject=require('./_to-iobject');// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports=require('./_iter-define')(Array,'Array',function(iterated,kind){this._t=toIObject(iterated);// target
this._i=0;// next index
this._k=kind;// kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
},function(){var O=this._t,kind=this._k,index=this._i++;if(!O||index>=O.length){this._t=undefined;return step(1);}if(kind=='keys')return step(0,index);if(kind=='values')return step(0,O[index]);return step(0,[index,O[index]]);},'values');// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments=Iterators.Array;addToUnscopables('keys');addToUnscopables('values');addToUnscopables('entries');},{"./_add-to-unscopables":14,"./_iter-define":62,"./_iter-step":64,"./_iterators":65,"./_to-iobject":116}],140:[function(require,module,exports){'use strict';// 22.1.3.13 Array.prototype.join(separator)
var $export=require('./_export'),toIObject=require('./_to-iobject'),arrayJoin=[].join;// fallback for not array-like strings
$export($export.P+$export.F*(require('./_iobject')!=Object||!require('./_strict-method')(arrayJoin)),'Array',{join:function join(separator){return arrayJoin.call(toIObject(this),separator===undefined?',':separator);}});},{"./_export":41,"./_iobject":54,"./_strict-method":105,"./_to-iobject":116}],141:[function(require,module,exports){'use strict';var $export=require('./_export'),toIObject=require('./_to-iobject'),toInteger=require('./_to-integer'),toLength=require('./_to-length'),$native=[].lastIndexOf,NEGATIVE_ZERO=!!$native&&1/[1].lastIndexOf(1,-0)<0;$export($export.P+$export.F*(NEGATIVE_ZERO||!require('./_strict-method')($native)),'Array',{// 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
lastIndexOf:function lastIndexOf(searchElement/*, fromIndex = @[*-1] */){// convert -0 to +0
if(NEGATIVE_ZERO)return $native.apply(this,arguments)||0;var O=toIObject(this),length=toLength(O.length),index=length-1;if(arguments.length>1)index=Math.min(index,toInteger(arguments[1]));if(index<0)index=length+index;for(;index>=0;index--){if(index in O)if(O[index]===searchElement)return index||0;}return-1;}});},{"./_export":41,"./_strict-method":105,"./_to-integer":115,"./_to-iobject":116,"./_to-length":117}],142:[function(require,module,exports){'use strict';var $export=require('./_export'),$map=require('./_array-methods')(1);$export($export.P+$export.F*!require('./_strict-method')([].map,true),'Array',{// 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
map:function map(callbackfn/* , thisArg */){return $map(this,callbackfn,arguments[1]);}});},{"./_array-methods":21,"./_export":41,"./_strict-method":105}],143:[function(require,module,exports){'use strict';var $export=require('./_export'),createProperty=require('./_create-property');// WebKit Array.of isn't generic
$export($export.S+$export.F*require('./_fails')(function(){function F(){}return!(Array.of.call(F)instanceof F);}),'Array',{// 22.1.2.3 Array.of( ...items)
of:function of()/* ...args */{var index=0,aLen=arguments.length,result=new(typeof this=='function'?this:Array)(aLen);while(aLen>index){createProperty(result,index,arguments[index++]);}result.length=aLen;return result;}});},{"./_create-property":33,"./_export":41,"./_fails":43}],144:[function(require,module,exports){'use strict';var $export=require('./_export'),$reduce=require('./_array-reduce');$export($export.P+$export.F*!require('./_strict-method')([].reduceRight,true),'Array',{// 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
reduceRight:function reduceRight(callbackfn/* , initialValue */){return $reduce(this,callbackfn,arguments.length,arguments[1],true);}});},{"./_array-reduce":22,"./_export":41,"./_strict-method":105}],145:[function(require,module,exports){'use strict';var $export=require('./_export'),$reduce=require('./_array-reduce');$export($export.P+$export.F*!require('./_strict-method')([].reduce,true),'Array',{// 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
reduce:function reduce(callbackfn/* , initialValue */){return $reduce(this,callbackfn,arguments.length,arguments[1],false);}});},{"./_array-reduce":22,"./_export":41,"./_strict-method":105}],146:[function(require,module,exports){'use strict';var $export=require('./_export'),html=require('./_html'),cof=require('./_cof'),toIndex=require('./_to-index'),toLength=require('./_to-length'),arraySlice=[].slice;// fallback for not array-like ES3 strings and DOM objects
$export($export.P+$export.F*require('./_fails')(function(){if(html)arraySlice.call(html);}),'Array',{slice:function slice(begin,end){var len=toLength(this.length),klass=cof(this);end=end===undefined?len:end;if(klass=='Array')return arraySlice.call(this,begin,end);var start=toIndex(begin,len),upTo=toIndex(end,len),size=toLength(upTo-start),cloned=Array(size),i=0;for(;i<size;i++){cloned[i]=klass=='String'?this.charAt(start+i):this[start+i];}return cloned;}});},{"./_cof":27,"./_export":41,"./_fails":43,"./_html":50,"./_to-index":114,"./_to-length":117}],147:[function(require,module,exports){'use strict';var $export=require('./_export'),$some=require('./_array-methods')(3);$export($export.P+$export.F*!require('./_strict-method')([].some,true),'Array',{// 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
some:function some(callbackfn/* , thisArg */){return $some(this,callbackfn,arguments[1]);}});},{"./_array-methods":21,"./_export":41,"./_strict-method":105}],148:[function(require,module,exports){'use strict';var $export=require('./_export'),aFunction=require('./_a-function'),toObject=require('./_to-object'),fails=require('./_fails'),$sort=[].sort,test=[1,2,3];$export($export.P+$export.F*(fails(function(){// IE8-
test.sort(undefined);})||!fails(function(){// V8 bug
test.sort(null);// Old WebKit
})||!require('./_strict-method')($sort)),'Array',{// 22.1.3.25 Array.prototype.sort(comparefn)
sort:function sort(comparefn){return comparefn===undefined?$sort.call(toObject(this)):$sort.call(toObject(this),aFunction(comparefn));}});},{"./_a-function":12,"./_export":41,"./_fails":43,"./_strict-method":105,"./_to-object":118}],149:[function(require,module,exports){require('./_set-species')('Array');},{"./_set-species":100}],150:[function(require,module,exports){// 20.3.3.1 / 15.9.4.4 Date.now()
var $export=require('./_export');$export($export.S,'Date',{now:function now(){return new Date().getTime();}});},{"./_export":41}],151:[function(require,module,exports){'use strict';// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export=require('./_export'),fails=require('./_fails'),getTime=Date.prototype.getTime;var lz=function lz(num){return num>9?num:'0'+num;};// PhantomJS / old WebKit has a broken implementations
$export($export.P+$export.F*(fails(function(){return new Date(-5e13-1).toISOString()!='0385-07-25T07:06:39.999Z';})||!fails(function(){new Date(NaN).toISOString();})),'Date',{toISOString:function toISOString(){if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');var d=this,y=d.getUTCFullYear(),m=d.getUTCMilliseconds(),s=y<0?'-':y>9999?'+':'';return s+('00000'+Math.abs(y)).slice(s?-6:-4)+'-'+lz(d.getUTCMonth()+1)+'-'+lz(d.getUTCDate())+'T'+lz(d.getUTCHours())+':'+lz(d.getUTCMinutes())+':'+lz(d.getUTCSeconds())+'.'+(m>99?m:'0'+lz(m))+'Z';}});},{"./_export":41,"./_fails":43}],152:[function(require,module,exports){'use strict';var $export=require('./_export'),toObject=require('./_to-object'),toPrimitive=require('./_to-primitive');$export($export.P+$export.F*require('./_fails')(function(){return new Date(NaN).toJSON()!==null||Date.prototype.toJSON.call({toISOString:function toISOString(){return 1;}})!==1;}),'Date',{toJSON:function toJSON(key){var O=toObject(this),pv=toPrimitive(O);return typeof pv=='number'&&!isFinite(pv)?null:O.toISOString();}});},{"./_export":41,"./_fails":43,"./_to-object":118,"./_to-primitive":119}],153:[function(require,module,exports){var TO_PRIMITIVE=require('./_wks')('toPrimitive'),proto=Date.prototype;if(!(TO_PRIMITIVE in proto))require('./_hide')(proto,TO_PRIMITIVE,require('./_date-to-primitive'));},{"./_date-to-primitive":35,"./_hide":49,"./_wks":126}],154:[function(require,module,exports){var DateProto=Date.prototype,INVALID_DATE='Invalid Date',TO_STRING='toString',$toString=DateProto[TO_STRING],getTime=DateProto.getTime;if(new Date(NaN)+''!=INVALID_DATE){require('./_redefine')(DateProto,TO_STRING,function toString(){var value=getTime.call(this);return value===value?$toString.call(this):INVALID_DATE;});}},{"./_redefine":96}],155:[function(require,module,exports){// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export=require('./_export');$export($export.P,'Function',{bind:require('./_bind')});},{"./_bind":25,"./_export":41}],156:[function(require,module,exports){'use strict';var isObject=require('./_is-object'),getPrototypeOf=require('./_object-gpo'),HAS_INSTANCE=require('./_wks')('hasInstance'),FunctionProto=Function.prototype;// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto,HAS_INSTANCE,{value:function value(O){if(typeof this!='function'||!isObject(O))return false;if(!isObject(this.prototype))return O instanceof this;// for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
while(O=getPrototypeOf(O)){if(this.prototype===O)return true;}return false;}});},{"./_is-object":58,"./_object-dp":76,"./_object-gpo":83,"./_wks":126}],157:[function(require,module,exports){var dP=require('./_object-dp').f,createDesc=require('./_property-desc'),has=require('./_has'),FProto=Function.prototype,nameRE=/^\s*function ([^ (]*)/,NAME='name';var isExtensible=Object.isExtensible||function(){return true;};// 19.2.4.2 name
NAME in FProto||require('./_descriptors')&&dP(FProto,NAME,{configurable:true,get:function get(){try{var that=this,name=(''+that).match(nameRE)[1];has(that,NAME)||!isExtensible(that)||dP(that,NAME,createDesc(5,name));return name;}catch(e){return'';}}});},{"./_descriptors":37,"./_has":48,"./_object-dp":76,"./_property-desc":94}],158:[function(require,module,exports){'use strict';var strong=require('./_collection-strong');// 23.1 Map Objects
module.exports=require('./_collection')('Map',function(get){return function Map(){return get(this,arguments.length>0?arguments[0]:undefined);};},{// 23.1.3.6 Map.prototype.get(key)
get:function get(key){var entry=strong.getEntry(this,key);return entry&&entry.v;},// 23.1.3.9 Map.prototype.set(key, value)
set:function set(key,value){return strong.def(this,key===0?0:key,value);}},strong,true);},{"./_collection":31,"./_collection-strong":28}],159:[function(require,module,exports){// 20.2.2.3 Math.acosh(x)
var $export=require('./_export'),log1p=require('./_math-log1p'),sqrt=Math.sqrt,$acosh=Math.acosh;$export($export.S+$export.F*!($acosh// V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
&&Math.floor($acosh(Number.MAX_VALUE))==710// Tor Browser bug: Math.acosh(Infinity) -> NaN 
&&$acosh(Infinity)==Infinity),'Math',{acosh:function acosh(x){return(x=+x)<1?NaN:x>94906265.62425156?Math.log(x)+Math.LN2:log1p(x-1+sqrt(x-1)*sqrt(x+1));}});},{"./_export":41,"./_math-log1p":69}],160:[function(require,module,exports){// 20.2.2.5 Math.asinh(x)
var $export=require('./_export'),$asinh=Math.asinh;function asinh(x){return!isFinite(x=+x)||x==0?x:x<0?-asinh(-x):Math.log(x+Math.sqrt(x*x+1));}// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S+$export.F*!($asinh&&1/$asinh(0)>0),'Math',{asinh:asinh});},{"./_export":41}],161:[function(require,module,exports){// 20.2.2.7 Math.atanh(x)
var $export=require('./_export'),$atanh=Math.atanh;// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S+$export.F*!($atanh&&1/$atanh(-0)<0),'Math',{atanh:function atanh(x){return(x=+x)==0?x:Math.log((1+x)/(1-x))/2;}});},{"./_export":41}],162:[function(require,module,exports){// 20.2.2.9 Math.cbrt(x)
var $export=require('./_export'),sign=require('./_math-sign');$export($export.S,'Math',{cbrt:function cbrt(x){return sign(x=+x)*Math.pow(Math.abs(x),1/3);}});},{"./_export":41,"./_math-sign":70}],163:[function(require,module,exports){// 20.2.2.11 Math.clz32(x)
var $export=require('./_export');$export($export.S,'Math',{clz32:function clz32(x){return(x>>>=0)?31-Math.floor(Math.log(x+0.5)*Math.LOG2E):32;}});},{"./_export":41}],164:[function(require,module,exports){// 20.2.2.12 Math.cosh(x)
var $export=require('./_export'),exp=Math.exp;$export($export.S,'Math',{cosh:function cosh(x){return(exp(x=+x)+exp(-x))/2;}});},{"./_export":41}],165:[function(require,module,exports){// 20.2.2.14 Math.expm1(x)
var $export=require('./_export'),$expm1=require('./_math-expm1');$export($export.S+$export.F*($expm1!=Math.expm1),'Math',{expm1:$expm1});},{"./_export":41,"./_math-expm1":68}],166:[function(require,module,exports){// 20.2.2.16 Math.fround(x)
var $export=require('./_export'),sign=require('./_math-sign'),pow=Math.pow,EPSILON=pow(2,-52),EPSILON32=pow(2,-23),MAX32=pow(2,127)*(2-EPSILON32),MIN32=pow(2,-126);var roundTiesToEven=function roundTiesToEven(n){return n+1/EPSILON-1/EPSILON;};$export($export.S,'Math',{fround:function fround(x){var $abs=Math.abs(x),$sign=sign(x),a,result;if($abs<MIN32)return $sign*roundTiesToEven($abs/MIN32/EPSILON32)*MIN32*EPSILON32;a=(1+EPSILON32/EPSILON)*$abs;result=a-(a-$abs);if(result>MAX32||result!=result)return $sign*Infinity;return $sign*result;}});},{"./_export":41,"./_math-sign":70}],167:[function(require,module,exports){// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export=require('./_export'),abs=Math.abs;$export($export.S,'Math',{hypot:function hypot(value1,value2){// eslint-disable-line no-unused-vars
var sum=0,i=0,aLen=arguments.length,larg=0,arg,div;while(i<aLen){arg=abs(arguments[i++]);if(larg<arg){div=larg/arg;sum=sum*div*div+1;larg=arg;}else if(arg>0){div=arg/larg;sum+=div*div;}else sum+=arg;}return larg===Infinity?Infinity:larg*Math.sqrt(sum);}});},{"./_export":41}],168:[function(require,module,exports){// 20.2.2.18 Math.imul(x, y)
var $export=require('./_export'),$imul=Math.imul;// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S+$export.F*require('./_fails')(function(){return $imul(0xffffffff,5)!=-5||$imul.length!=2;}),'Math',{imul:function imul(x,y){var UINT16=0xffff,xn=+x,yn=+y,xl=UINT16&xn,yl=UINT16&yn;return 0|xl*yl+((UINT16&xn>>>16)*yl+xl*(UINT16&yn>>>16)<<16>>>0);}});},{"./_export":41,"./_fails":43}],169:[function(require,module,exports){// 20.2.2.21 Math.log10(x)
var $export=require('./_export');$export($export.S,'Math',{log10:function log10(x){return Math.log(x)/Math.LN10;}});},{"./_export":41}],170:[function(require,module,exports){// 20.2.2.20 Math.log1p(x)
var $export=require('./_export');$export($export.S,'Math',{log1p:require('./_math-log1p')});},{"./_export":41,"./_math-log1p":69}],171:[function(require,module,exports){// 20.2.2.22 Math.log2(x)
var $export=require('./_export');$export($export.S,'Math',{log2:function log2(x){return Math.log(x)/Math.LN2;}});},{"./_export":41}],172:[function(require,module,exports){// 20.2.2.28 Math.sign(x)
var $export=require('./_export');$export($export.S,'Math',{sign:require('./_math-sign')});},{"./_export":41,"./_math-sign":70}],173:[function(require,module,exports){// 20.2.2.30 Math.sinh(x)
var $export=require('./_export'),expm1=require('./_math-expm1'),exp=Math.exp;// V8 near Chromium 38 has a problem with very small numbers
$export($export.S+$export.F*require('./_fails')(function(){return!Math.sinh(-2e-17)!=-2e-17;}),'Math',{sinh:function sinh(x){return Math.abs(x=+x)<1?(expm1(x)-expm1(-x))/2:(exp(x-1)-exp(-x-1))*(Math.E/2);}});},{"./_export":41,"./_fails":43,"./_math-expm1":68}],174:[function(require,module,exports){// 20.2.2.33 Math.tanh(x)
var $export=require('./_export'),expm1=require('./_math-expm1'),exp=Math.exp;$export($export.S,'Math',{tanh:function tanh(x){var a=expm1(x=+x),b=expm1(-x);return a==Infinity?1:b==Infinity?-1:(a-b)/(exp(x)+exp(-x));}});},{"./_export":41,"./_math-expm1":68}],175:[function(require,module,exports){// 20.2.2.34 Math.trunc(x)
var $export=require('./_export');$export($export.S,'Math',{trunc:function trunc(it){return(it>0?Math.floor:Math.ceil)(it);}});},{"./_export":41}],176:[function(require,module,exports){'use strict';var global=require('./_global'),has=require('./_has'),cof=require('./_cof'),inheritIfRequired=require('./_inherit-if-required'),toPrimitive=require('./_to-primitive'),fails=require('./_fails'),gOPN=require('./_object-gopn').f,gOPD=require('./_object-gopd').f,dP=require('./_object-dp').f,$trim=require('./_string-trim').trim,NUMBER='Number',$Number=global[NUMBER],Base=$Number,proto=$Number.prototype// Opera ~12 has broken Object#toString
,BROKEN_COF=cof(require('./_object-create')(proto))==NUMBER,TRIM='trim'in String.prototype;// 7.1.3 ToNumber(argument)
var toNumber=function toNumber(argument){var it=toPrimitive(argument,false);if(typeof it=='string'&&it.length>2){it=TRIM?it.trim():$trim(it,3);var first=it.charCodeAt(0),third,radix,maxCode;if(first===43||first===45){third=it.charCodeAt(2);if(third===88||third===120)return NaN;// Number('+0x1') should be NaN, old V8 fix
}else if(first===48){switch(it.charCodeAt(1)){case 66:case 98:radix=2;maxCode=49;break;// fast equal /^0b[01]+$/i
case 79:case 111:radix=8;maxCode=55;break;// fast equal /^0o[0-7]+$/i
default:return+it;}for(var digits=it.slice(2),i=0,l=digits.length,code;i<l;i++){code=digits.charCodeAt(i);// parseInt parses a string to a first unavailable symbol
// but ToNumber should return NaN if a string contains unavailable symbols
if(code<48||code>maxCode)return NaN;}return parseInt(digits,radix);}}return+it;};if(!$Number(' 0o1')||!$Number('0b1')||$Number('+0x1')){$Number=function Number(value){var it=arguments.length<1?0:value,that=this;return that instanceof $Number// check on 1..constructor(foo) case
&&(BROKEN_COF?fails(function(){proto.valueOf.call(that);}):cof(that)!=NUMBER)?inheritIfRequired(new Base(toNumber(it)),that,$Number):toNumber(it);};for(var keys=require('./_descriptors')?gOPN(Base):(// ES3:
'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,'+// ES6 (in case, if modules with ES6 Number statics required before):
'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,'+'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','),j=0,key;keys.length>j;j++){if(has(Base,key=keys[j])&&!has($Number,key)){dP($Number,key,gOPD(Base,key));}}$Number.prototype=proto;proto.constructor=$Number;require('./_redefine')(global,NUMBER,$Number);}},{"./_cof":27,"./_descriptors":37,"./_fails":43,"./_global":47,"./_has":48,"./_inherit-if-required":52,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_redefine":96,"./_string-trim":111,"./_to-primitive":119}],177:[function(require,module,exports){// 20.1.2.1 Number.EPSILON
var $export=require('./_export');$export($export.S,'Number',{EPSILON:Math.pow(2,-52)});},{"./_export":41}],178:[function(require,module,exports){// 20.1.2.2 Number.isFinite(number)
var $export=require('./_export'),_isFinite=require('./_global').isFinite;$export($export.S,'Number',{isFinite:function isFinite(it){return typeof it=='number'&&_isFinite(it);}});},{"./_export":41,"./_global":47}],179:[function(require,module,exports){// 20.1.2.3 Number.isInteger(number)
var $export=require('./_export');$export($export.S,'Number',{isInteger:require('./_is-integer')});},{"./_export":41,"./_is-integer":57}],180:[function(require,module,exports){// 20.1.2.4 Number.isNaN(number)
var $export=require('./_export');$export($export.S,'Number',{isNaN:function isNaN(number){return number!=number;}});},{"./_export":41}],181:[function(require,module,exports){// 20.1.2.5 Number.isSafeInteger(number)
var $export=require('./_export'),isInteger=require('./_is-integer'),abs=Math.abs;$export($export.S,'Number',{isSafeInteger:function isSafeInteger(number){return isInteger(number)&&abs(number)<=0x1fffffffffffff;}});},{"./_export":41,"./_is-integer":57}],182:[function(require,module,exports){// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export=require('./_export');$export($export.S,'Number',{MAX_SAFE_INTEGER:0x1fffffffffffff});},{"./_export":41}],183:[function(require,module,exports){// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export=require('./_export');$export($export.S,'Number',{MIN_SAFE_INTEGER:-0x1fffffffffffff});},{"./_export":41}],184:[function(require,module,exports){var $export=require('./_export'),$parseFloat=require('./_parse-float');// 20.1.2.12 Number.parseFloat(string)
$export($export.S+$export.F*(Number.parseFloat!=$parseFloat),'Number',{parseFloat:$parseFloat});},{"./_export":41,"./_parse-float":90}],185:[function(require,module,exports){var $export=require('./_export'),$parseInt=require('./_parse-int');// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S+$export.F*(Number.parseInt!=$parseInt),'Number',{parseInt:$parseInt});},{"./_export":41,"./_parse-int":91}],186:[function(require,module,exports){'use strict';var $export=require('./_export'),toInteger=require('./_to-integer'),aNumberValue=require('./_a-number-value'),repeat=require('./_string-repeat'),$toFixed=1..toFixed,floor=Math.floor,data=[0,0,0,0,0,0],ERROR='Number.toFixed: incorrect invocation!',ZERO='0';var multiply=function multiply(n,c){var i=-1,c2=c;while(++i<6){c2+=n*data[i];data[i]=c2%1e7;c2=floor(c2/1e7);}};var divide=function divide(n){var i=6,c=0;while(--i>=0){c+=data[i];data[i]=floor(c/n);c=c%n*1e7;}};var numToString=function numToString(){var i=6,s='';while(--i>=0){if(s!==''||i===0||data[i]!==0){var t=String(data[i]);s=s===''?t:s+repeat.call(ZERO,7-t.length)+t;}}return s;};var pow=function pow(x,n,acc){return n===0?acc:n%2===1?pow(x,n-1,acc*x):pow(x*x,n/2,acc);};var log=function log(x){var n=0,x2=x;while(x2>=4096){n+=12;x2/=4096;}while(x2>=2){n+=1;x2/=2;}return n;};$export($export.P+$export.F*(!!$toFixed&&(0.00008.toFixed(3)!=='0.000'||0.9.toFixed(0)!=='1'||1.255.toFixed(2)!=='1.25'||1000000000000000128..toFixed(0)!=='1000000000000000128')||!require('./_fails')(function(){// V8 ~ Android 4.3-
$toFixed.call({});})),'Number',{toFixed:function toFixed(fractionDigits){var x=aNumberValue(this,ERROR),f=toInteger(fractionDigits),s='',m=ZERO,e,z,j,k;if(f<0||f>20)throw RangeError(ERROR);if(x!=x)return'NaN';if(x<=-1e21||x>=1e21)return String(x);if(x<0){s='-';x=-x;}if(x>1e-21){e=log(x*pow(2,69,1))-69;z=e<0?x*pow(2,-e,1):x/pow(2,e,1);z*=0x10000000000000;e=52-e;if(e>0){multiply(0,z);j=f;while(j>=7){multiply(1e7,0);j-=7;}multiply(pow(10,j,1),0);j=e-1;while(j>=23){divide(1<<23);j-=23;}divide(1<<j);multiply(1,1);divide(2);m=numToString();}else{multiply(0,z);multiply(1<<-e,0);m=numToString()+repeat.call(ZERO,f);}}if(f>0){k=m.length;m=s+(k<=f?'0.'+repeat.call(ZERO,f-k)+m:m.slice(0,k-f)+'.'+m.slice(k-f));}else{m=s+m;}return m;}});},{"./_a-number-value":13,"./_export":41,"./_fails":43,"./_string-repeat":110,"./_to-integer":115}],187:[function(require,module,exports){'use strict';var $export=require('./_export'),$fails=require('./_fails'),aNumberValue=require('./_a-number-value'),$toPrecision=1..toPrecision;$export($export.P+$export.F*($fails(function(){// IE7-
return $toPrecision.call(1,undefined)!=='1';})||!$fails(function(){// V8 ~ Android 4.3-
$toPrecision.call({});})),'Number',{toPrecision:function toPrecision(precision){var that=aNumberValue(this,'Number#toPrecision: incorrect invocation!');return precision===undefined?$toPrecision.call(that):$toPrecision.call(that,precision);}});},{"./_a-number-value":13,"./_export":41,"./_fails":43}],188:[function(require,module,exports){// 19.1.3.1 Object.assign(target, source)
var $export=require('./_export');$export($export.S+$export.F,'Object',{assign:require('./_object-assign')});},{"./_export":41,"./_object-assign":74}],189:[function(require,module,exports){var $export=require('./_export');// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S,'Object',{create:require('./_object-create')});},{"./_export":41,"./_object-create":75}],190:[function(require,module,exports){var $export=require('./_export');// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S+$export.F*!require('./_descriptors'),'Object',{defineProperties:require('./_object-dps')});},{"./_descriptors":37,"./_export":41,"./_object-dps":77}],191:[function(require,module,exports){var $export=require('./_export');// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S+$export.F*!require('./_descriptors'),'Object',{defineProperty:require('./_object-dp').f});},{"./_descriptors":37,"./_export":41,"./_object-dp":76}],192:[function(require,module,exports){// 19.1.2.5 Object.freeze(O)
var isObject=require('./_is-object'),meta=require('./_meta').onFreeze;require('./_object-sap')('freeze',function($freeze){return function freeze(it){return $freeze&&isObject(it)?$freeze(meta(it)):it;};});},{"./_is-object":58,"./_meta":71,"./_object-sap":87}],193:[function(require,module,exports){// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject=require('./_to-iobject'),$getOwnPropertyDescriptor=require('./_object-gopd').f;require('./_object-sap')('getOwnPropertyDescriptor',function(){return function getOwnPropertyDescriptor(it,key){return $getOwnPropertyDescriptor(toIObject(it),key);};});},{"./_object-gopd":79,"./_object-sap":87,"./_to-iobject":116}],194:[function(require,module,exports){// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames',function(){return require('./_object-gopn-ext').f;});},{"./_object-gopn-ext":80,"./_object-sap":87}],195:[function(require,module,exports){// 19.1.2.9 Object.getPrototypeOf(O)
var toObject=require('./_to-object'),$getPrototypeOf=require('./_object-gpo');require('./_object-sap')('getPrototypeOf',function(){return function getPrototypeOf(it){return $getPrototypeOf(toObject(it));};});},{"./_object-gpo":83,"./_object-sap":87,"./_to-object":118}],196:[function(require,module,exports){// 19.1.2.11 Object.isExtensible(O)
var isObject=require('./_is-object');require('./_object-sap')('isExtensible',function($isExtensible){return function isExtensible(it){return isObject(it)?$isExtensible?$isExtensible(it):true:false;};});},{"./_is-object":58,"./_object-sap":87}],197:[function(require,module,exports){// 19.1.2.12 Object.isFrozen(O)
var isObject=require('./_is-object');require('./_object-sap')('isFrozen',function($isFrozen){return function isFrozen(it){return isObject(it)?$isFrozen?$isFrozen(it):false:true;};});},{"./_is-object":58,"./_object-sap":87}],198:[function(require,module,exports){// 19.1.2.13 Object.isSealed(O)
var isObject=require('./_is-object');require('./_object-sap')('isSealed',function($isSealed){return function isSealed(it){return isObject(it)?$isSealed?$isSealed(it):false:true;};});},{"./_is-object":58,"./_object-sap":87}],199:[function(require,module,exports){// 19.1.3.10 Object.is(value1, value2)
var $export=require('./_export');$export($export.S,'Object',{is:require('./_same-value')});},{"./_export":41,"./_same-value":98}],200:[function(require,module,exports){// 19.1.2.14 Object.keys(O)
var toObject=require('./_to-object'),$keys=require('./_object-keys');require('./_object-sap')('keys',function(){return function keys(it){return $keys(toObject(it));};});},{"./_object-keys":85,"./_object-sap":87,"./_to-object":118}],201:[function(require,module,exports){// 19.1.2.15 Object.preventExtensions(O)
var isObject=require('./_is-object'),meta=require('./_meta').onFreeze;require('./_object-sap')('preventExtensions',function($preventExtensions){return function preventExtensions(it){return $preventExtensions&&isObject(it)?$preventExtensions(meta(it)):it;};});},{"./_is-object":58,"./_meta":71,"./_object-sap":87}],202:[function(require,module,exports){// 19.1.2.17 Object.seal(O)
var isObject=require('./_is-object'),meta=require('./_meta').onFreeze;require('./_object-sap')('seal',function($seal){return function seal(it){return $seal&&isObject(it)?$seal(meta(it)):it;};});},{"./_is-object":58,"./_meta":71,"./_object-sap":87}],203:[function(require,module,exports){// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export=require('./_export');$export($export.S,'Object',{setPrototypeOf:require('./_set-proto').set});},{"./_export":41,"./_set-proto":99}],204:[function(require,module,exports){'use strict';// 19.1.3.6 Object.prototype.toString()
var classof=require('./_classof'),test={};test[require('./_wks')('toStringTag')]='z';if(test+''!='[object z]'){require('./_redefine')(Object.prototype,'toString',function toString(){return'[object '+classof(this)+']';},true);}},{"./_classof":26,"./_redefine":96,"./_wks":126}],205:[function(require,module,exports){var $export=require('./_export'),$parseFloat=require('./_parse-float');// 18.2.4 parseFloat(string)
$export($export.G+$export.F*(parseFloat!=$parseFloat),{parseFloat:$parseFloat});},{"./_export":41,"./_parse-float":90}],206:[function(require,module,exports){var $export=require('./_export'),$parseInt=require('./_parse-int');// 18.2.5 parseInt(string, radix)
$export($export.G+$export.F*(parseInt!=$parseInt),{parseInt:$parseInt});},{"./_export":41,"./_parse-int":91}],207:[function(require,module,exports){'use strict';var LIBRARY=require('./_library'),global=require('./_global'),ctx=require('./_ctx'),classof=require('./_classof'),$export=require('./_export'),isObject=require('./_is-object'),aFunction=require('./_a-function'),anInstance=require('./_an-instance'),forOf=require('./_for-of'),speciesConstructor=require('./_species-constructor'),task=require('./_task').set,microtask=require('./_microtask')(),PROMISE='Promise',TypeError=global.TypeError,process=global.process,$Promise=global[PROMISE],process=global.process,isNode=classof(process)=='process',empty=function empty(){/* empty */},Internal,GenericPromiseCapability,Wrapper;var USE_NATIVE=!!function(){try{// correct subclassing with @@species support
var promise=$Promise.resolve(1),FakePromise=(promise.constructor={})[require('./_wks')('species')]=function(exec){exec(empty,empty);};// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(isNode||typeof PromiseRejectionEvent=='function')&&promise.then(empty)instanceof FakePromise;}catch(e){/* empty */}}();// helpers
var sameConstructor=function sameConstructor(a,b){// with library wrapper special case
return a===b||a===$Promise&&b===Wrapper;};var isThenable=function isThenable(it){var then;return isObject(it)&&typeof(then=it.then)=='function'?then:false;};var newPromiseCapability=function newPromiseCapability(C){return sameConstructor($Promise,C)?new PromiseCapability(C):new GenericPromiseCapability(C);};var PromiseCapability=GenericPromiseCapability=function GenericPromiseCapability(C){var resolve,reject;this.promise=new C(function($$resolve,$$reject){if(resolve!==undefined||reject!==undefined)throw TypeError('Bad Promise constructor');resolve=$$resolve;reject=$$reject;});this.resolve=aFunction(resolve);this.reject=aFunction(reject);};var perform=function perform(exec){try{exec();}catch(e){return{error:e};}};var notify=function notify(promise,isReject){if(promise._n)return;promise._n=true;var chain=promise._c;microtask(function(){var value=promise._v,ok=promise._s==1,i=0;var run=function run(reaction){var handler=ok?reaction.ok:reaction.fail,resolve=reaction.resolve,reject=reaction.reject,domain=reaction.domain,result,then;try{if(handler){if(!ok){if(promise._h==2)onHandleUnhandled(promise);promise._h=1;}if(handler===true)result=value;else{if(domain)domain.enter();result=handler(value);if(domain)domain.exit();}if(result===reaction.promise){reject(TypeError('Promise-chain cycle'));}else if(then=isThenable(result)){then.call(result,resolve,reject);}else resolve(result);}else reject(value);}catch(e){reject(e);}};while(chain.length>i){run(chain[i++]);}// variable length - can't use forEach
promise._c=[];promise._n=false;if(isReject&&!promise._h)onUnhandled(promise);});};var onUnhandled=function onUnhandled(promise){task.call(global,function(){var value=promise._v,abrupt,handler,console;if(isUnhandled(promise)){abrupt=perform(function(){if(isNode){process.emit('unhandledRejection',value,promise);}else if(handler=global.onunhandledrejection){handler({promise:promise,reason:value});}else if((console=global.console)&&console.error){console.error('Unhandled promise rejection',value);}});// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
promise._h=isNode||isUnhandled(promise)?2:1;}promise._a=undefined;if(abrupt)throw abrupt.error;});};var isUnhandled=function isUnhandled(promise){if(promise._h==1)return false;var chain=promise._a||promise._c,i=0,reaction;while(chain.length>i){reaction=chain[i++];if(reaction.fail||!isUnhandled(reaction.promise))return false;}return true;};var onHandleUnhandled=function onHandleUnhandled(promise){task.call(global,function(){var handler;if(isNode){process.emit('rejectionHandled',promise);}else if(handler=global.onrejectionhandled){handler({promise:promise,reason:promise._v});}});};var $reject=function $reject(value){var promise=this;if(promise._d)return;promise._d=true;promise=promise._w||promise;// unwrap
promise._v=value;promise._s=2;if(!promise._a)promise._a=promise._c.slice();notify(promise,true);};var $resolve=function $resolve(value){var promise=this,then;if(promise._d)return;promise._d=true;promise=promise._w||promise;// unwrap
try{if(promise===value)throw TypeError("Promise can't be resolved itself");if(then=isThenable(value)){microtask(function(){var wrapper={_w:promise,_d:false};// wrap
try{then.call(value,ctx($resolve,wrapper,1),ctx($reject,wrapper,1));}catch(e){$reject.call(wrapper,e);}});}else{promise._v=value;promise._s=1;notify(promise,false);}}catch(e){$reject.call({_w:promise,_d:false},e);// wrap
}};// constructor polyfill
if(!USE_NATIVE){// 25.4.3.1 Promise(executor)
$Promise=function Promise(executor){anInstance(this,$Promise,PROMISE,'_h');aFunction(executor);Internal.call(this);try{executor(ctx($resolve,this,1),ctx($reject,this,1));}catch(err){$reject.call(this,err);}};Internal=function Promise(executor){this._c=[];// <- awaiting reactions
this._a=undefined;// <- checked in isUnhandled reactions
this._s=0;// <- state
this._d=false;// <- done
this._v=undefined;// <- value
this._h=0;// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=false;// <- notify
};Internal.prototype=require('./_redefine-all')($Promise.prototype,{// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function then(onFulfilled,onRejected){var reaction=newPromiseCapability(speciesConstructor(this,$Promise));reaction.ok=typeof onFulfilled=='function'?onFulfilled:true;reaction.fail=typeof onRejected=='function'&&onRejected;reaction.domain=isNode?process.domain:undefined;this._c.push(reaction);if(this._a)this._a.push(reaction);if(this._s)notify(this,false);return reaction.promise;},// 25.4.5.1 Promise.prototype.catch(onRejected)
'catch':function _catch(onRejected){return this.then(undefined,onRejected);}});PromiseCapability=function PromiseCapability(){var promise=new Internal();this.promise=promise;this.resolve=ctx($resolve,promise,1);this.reject=ctx($reject,promise,1);};}$export($export.G+$export.W+$export.F*!USE_NATIVE,{Promise:$Promise});require('./_set-to-string-tag')($Promise,PROMISE);require('./_set-species')(PROMISE);Wrapper=require('./_core')[PROMISE];// statics
$export($export.S+$export.F*!USE_NATIVE,PROMISE,{// 25.4.4.5 Promise.reject(r)
reject:function reject(r){var capability=newPromiseCapability(this),$$reject=capability.reject;$$reject(r);return capability.promise;}});$export($export.S+$export.F*(LIBRARY||!USE_NATIVE),PROMISE,{// 25.4.4.6 Promise.resolve(x)
resolve:function resolve(x){// instanceof instead of internal slot check because we should fix it without replacement native Promise core
if(x instanceof $Promise&&sameConstructor(x.constructor,this))return x;var capability=newPromiseCapability(this),$$resolve=capability.resolve;$$resolve(x);return capability.promise;}});$export($export.S+$export.F*!(USE_NATIVE&&require('./_iter-detect')(function(iter){$Promise.all(iter)['catch'](empty);})),PROMISE,{// 25.4.4.1 Promise.all(iterable)
all:function all(iterable){var C=this,capability=newPromiseCapability(C),resolve=capability.resolve,reject=capability.reject;var abrupt=perform(function(){var values=[],index=0,remaining=1;forOf(iterable,false,function(promise){var $index=index++,alreadyCalled=false;values.push(undefined);remaining++;C.resolve(promise).then(function(value){if(alreadyCalled)return;alreadyCalled=true;values[$index]=value;--remaining||resolve(values);},reject);});--remaining||resolve(values);});if(abrupt)reject(abrupt.error);return capability.promise;},// 25.4.4.4 Promise.race(iterable)
race:function race(iterable){var C=this,capability=newPromiseCapability(C),reject=capability.reject;var abrupt=perform(function(){forOf(iterable,false,function(promise){C.resolve(promise).then(capability.resolve,reject);});});if(abrupt)reject(abrupt.error);return capability.promise;}});},{"./_a-function":12,"./_an-instance":15,"./_classof":26,"./_core":32,"./_ctx":34,"./_export":41,"./_for-of":46,"./_global":47,"./_is-object":58,"./_iter-detect":63,"./_library":67,"./_microtask":73,"./_redefine-all":95,"./_set-species":100,"./_set-to-string-tag":101,"./_species-constructor":104,"./_task":113,"./_wks":126}],208:[function(require,module,exports){// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export=require('./_export'),aFunction=require('./_a-function'),anObject=require('./_an-object'),rApply=(require('./_global').Reflect||{}).apply,fApply=Function.apply;// MS Edge argumentsList argument is optional
$export($export.S+$export.F*!require('./_fails')(function(){rApply(function(){});}),'Reflect',{apply:function apply(target,thisArgument,argumentsList){var T=aFunction(target),L=anObject(argumentsList);return rApply?rApply(T,thisArgument,L):fApply.call(T,thisArgument,L);}});},{"./_a-function":12,"./_an-object":16,"./_export":41,"./_fails":43,"./_global":47}],209:[function(require,module,exports){// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export=require('./_export'),create=require('./_object-create'),aFunction=require('./_a-function'),anObject=require('./_an-object'),isObject=require('./_is-object'),fails=require('./_fails'),bind=require('./_bind'),rConstruct=(require('./_global').Reflect||{}).construct;// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG=fails(function(){function F(){}return!(rConstruct(function(){},[],F)instanceof F);});var ARGS_BUG=!fails(function(){rConstruct(function(){});});$export($export.S+$export.F*(NEW_TARGET_BUG||ARGS_BUG),'Reflect',{construct:function construct(Target,args/*, newTarget*/){aFunction(Target);anObject(args);var newTarget=arguments.length<3?Target:aFunction(arguments[2]);if(ARGS_BUG&&!NEW_TARGET_BUG)return rConstruct(Target,args,newTarget);if(Target==newTarget){// w/o altered newTarget, optimization for 0-4 arguments
switch(args.length){case 0:return new Target();case 1:return new Target(args[0]);case 2:return new Target(args[0],args[1]);case 3:return new Target(args[0],args[1],args[2]);case 4:return new Target(args[0],args[1],args[2],args[3]);}// w/o altered newTarget, lot of arguments case
var $args=[null];$args.push.apply($args,args);return new(bind.apply(Target,$args))();}// with altered newTarget, not support built-in constructors
var proto=newTarget.prototype,instance=create(isObject(proto)?proto:Object.prototype),result=Function.apply.call(Target,instance,args);return isObject(result)?result:instance;}});},{"./_a-function":12,"./_an-object":16,"./_bind":25,"./_export":41,"./_fails":43,"./_global":47,"./_is-object":58,"./_object-create":75}],210:[function(require,module,exports){// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP=require('./_object-dp'),$export=require('./_export'),anObject=require('./_an-object'),toPrimitive=require('./_to-primitive');// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S+$export.F*require('./_fails')(function(){Reflect.defineProperty(dP.f({},1,{value:1}),1,{value:2});}),'Reflect',{defineProperty:function defineProperty(target,propertyKey,attributes){anObject(target);propertyKey=toPrimitive(propertyKey,true);anObject(attributes);try{dP.f(target,propertyKey,attributes);return true;}catch(e){return false;}}});},{"./_an-object":16,"./_export":41,"./_fails":43,"./_object-dp":76,"./_to-primitive":119}],211:[function(require,module,exports){// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export=require('./_export'),gOPD=require('./_object-gopd').f,anObject=require('./_an-object');$export($export.S,'Reflect',{deleteProperty:function deleteProperty(target,propertyKey){var desc=gOPD(anObject(target),propertyKey);return desc&&!desc.configurable?false:delete target[propertyKey];}});},{"./_an-object":16,"./_export":41,"./_object-gopd":79}],212:[function(require,module,exports){'use strict';// 26.1.5 Reflect.enumerate(target)
var $export=require('./_export'),anObject=require('./_an-object');var Enumerate=function Enumerate(iterated){this._t=anObject(iterated);// target
this._i=0;// next index
var keys=this._k=[]// keys
,key;for(key in iterated){keys.push(key);}};require('./_iter-create')(Enumerate,'Object',function(){var that=this,keys=that._k,key;do{if(that._i>=keys.length)return{value:undefined,done:true};}while(!((key=keys[that._i++])in that._t));return{value:key,done:false};});$export($export.S,'Reflect',{enumerate:function enumerate(target){return new Enumerate(target);}});},{"./_an-object":16,"./_export":41,"./_iter-create":61}],213:[function(require,module,exports){// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD=require('./_object-gopd'),$export=require('./_export'),anObject=require('./_an-object');$export($export.S,'Reflect',{getOwnPropertyDescriptor:function getOwnPropertyDescriptor(target,propertyKey){return gOPD.f(anObject(target),propertyKey);}});},{"./_an-object":16,"./_export":41,"./_object-gopd":79}],214:[function(require,module,exports){// 26.1.8 Reflect.getPrototypeOf(target)
var $export=require('./_export'),getProto=require('./_object-gpo'),anObject=require('./_an-object');$export($export.S,'Reflect',{getPrototypeOf:function getPrototypeOf(target){return getProto(anObject(target));}});},{"./_an-object":16,"./_export":41,"./_object-gpo":83}],215:[function(require,module,exports){// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD=require('./_object-gopd'),getPrototypeOf=require('./_object-gpo'),has=require('./_has'),$export=require('./_export'),isObject=require('./_is-object'),anObject=require('./_an-object');function get(target,propertyKey/*, receiver*/){var receiver=arguments.length<3?target:arguments[2],desc,proto;if(anObject(target)===receiver)return target[propertyKey];if(desc=gOPD.f(target,propertyKey))return has(desc,'value')?desc.value:desc.get!==undefined?desc.get.call(receiver):undefined;if(isObject(proto=getPrototypeOf(target)))return get(proto,propertyKey,receiver);}$export($export.S,'Reflect',{get:get});},{"./_an-object":16,"./_export":41,"./_has":48,"./_is-object":58,"./_object-gopd":79,"./_object-gpo":83}],216:[function(require,module,exports){// 26.1.9 Reflect.has(target, propertyKey)
var $export=require('./_export');$export($export.S,'Reflect',{has:function has(target,propertyKey){return propertyKey in target;}});},{"./_export":41}],217:[function(require,module,exports){// 26.1.10 Reflect.isExtensible(target)
var $export=require('./_export'),anObject=require('./_an-object'),$isExtensible=Object.isExtensible;$export($export.S,'Reflect',{isExtensible:function isExtensible(target){anObject(target);return $isExtensible?$isExtensible(target):true;}});},{"./_an-object":16,"./_export":41}],218:[function(require,module,exports){// 26.1.11 Reflect.ownKeys(target)
var $export=require('./_export');$export($export.S,'Reflect',{ownKeys:require('./_own-keys')});},{"./_export":41,"./_own-keys":89}],219:[function(require,module,exports){// 26.1.12 Reflect.preventExtensions(target)
var $export=require('./_export'),anObject=require('./_an-object'),$preventExtensions=Object.preventExtensions;$export($export.S,'Reflect',{preventExtensions:function preventExtensions(target){anObject(target);try{if($preventExtensions)$preventExtensions(target);return true;}catch(e){return false;}}});},{"./_an-object":16,"./_export":41}],220:[function(require,module,exports){// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export=require('./_export'),setProto=require('./_set-proto');if(setProto)$export($export.S,'Reflect',{setPrototypeOf:function setPrototypeOf(target,proto){setProto.check(target,proto);try{setProto.set(target,proto);return true;}catch(e){return false;}}});},{"./_export":41,"./_set-proto":99}],221:[function(require,module,exports){// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP=require('./_object-dp'),gOPD=require('./_object-gopd'),getPrototypeOf=require('./_object-gpo'),has=require('./_has'),$export=require('./_export'),createDesc=require('./_property-desc'),anObject=require('./_an-object'),isObject=require('./_is-object');function set(target,propertyKey,V/*, receiver*/){var receiver=arguments.length<4?target:arguments[3],ownDesc=gOPD.f(anObject(target),propertyKey),existingDescriptor,proto;if(!ownDesc){if(isObject(proto=getPrototypeOf(target))){return set(proto,propertyKey,V,receiver);}ownDesc=createDesc(0);}if(has(ownDesc,'value')){if(ownDesc.writable===false||!isObject(receiver))return false;existingDescriptor=gOPD.f(receiver,propertyKey)||createDesc(0);existingDescriptor.value=V;dP.f(receiver,propertyKey,existingDescriptor);return true;}return ownDesc.set===undefined?false:(ownDesc.set.call(receiver,V),true);}$export($export.S,'Reflect',{set:set});},{"./_an-object":16,"./_export":41,"./_has":48,"./_is-object":58,"./_object-dp":76,"./_object-gopd":79,"./_object-gpo":83,"./_property-desc":94}],222:[function(require,module,exports){var global=require('./_global'),inheritIfRequired=require('./_inherit-if-required'),dP=require('./_object-dp').f,gOPN=require('./_object-gopn').f,isRegExp=require('./_is-regexp'),$flags=require('./_flags'),$RegExp=global.RegExp,Base=$RegExp,proto=$RegExp.prototype,re1=/a/g,re2=/a/g// "new" creates a new object, old webkit buggy here
,CORRECT_NEW=new $RegExp(re1)!==re1;if(require('./_descriptors')&&(!CORRECT_NEW||require('./_fails')(function(){re2[require('./_wks')('match')]=false;// RegExp constructor can alter flags and IsRegExp works correct with @@match
return $RegExp(re1)!=re1||$RegExp(re2)==re2||$RegExp(re1,'i')!='/a/i';}))){$RegExp=function RegExp(p,f){var tiRE=this instanceof $RegExp,piRE=isRegExp(p),fiU=f===undefined;return!tiRE&&piRE&&p.constructor===$RegExp&&fiU?p:inheritIfRequired(CORRECT_NEW?new Base(piRE&&!fiU?p.source:p,f):Base((piRE=p instanceof $RegExp)?p.source:p,piRE&&fiU?$flags.call(p):f),tiRE?this:proto,$RegExp);};var proxy=function proxy(key){key in $RegExp||dP($RegExp,key,{configurable:true,get:function get(){return Base[key];},set:function set(it){Base[key]=it;}});};for(var keys=gOPN(Base),i=0;keys.length>i;){proxy(keys[i++]);}proto.constructor=$RegExp;$RegExp.prototype=proto;require('./_redefine')(global,'RegExp',$RegExp);}require('./_set-species')('RegExp');},{"./_descriptors":37,"./_fails":43,"./_flags":45,"./_global":47,"./_inherit-if-required":52,"./_is-regexp":59,"./_object-dp":76,"./_object-gopn":81,"./_redefine":96,"./_set-species":100,"./_wks":126}],223:[function(require,module,exports){// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors')&&/./g.flags!='g')require('./_object-dp').f(RegExp.prototype,'flags',{configurable:true,get:require('./_flags')});},{"./_descriptors":37,"./_flags":45,"./_object-dp":76}],224:[function(require,module,exports){// @@match logic
require('./_fix-re-wks')('match',1,function(defined,MATCH,$match){// 21.1.3.11 String.prototype.match(regexp)
return[function match(regexp){'use strict';var O=defined(this),fn=regexp==undefined?undefined:regexp[MATCH];return fn!==undefined?fn.call(regexp,O):new RegExp(regexp)[MATCH](String(O));},$match];});},{"./_fix-re-wks":44}],225:[function(require,module,exports){// @@replace logic
require('./_fix-re-wks')('replace',2,function(defined,REPLACE,$replace){// 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
return[function replace(searchValue,replaceValue){'use strict';var O=defined(this),fn=searchValue==undefined?undefined:searchValue[REPLACE];return fn!==undefined?fn.call(searchValue,O,replaceValue):$replace.call(String(O),searchValue,replaceValue);},$replace];});},{"./_fix-re-wks":44}],226:[function(require,module,exports){// @@search logic
require('./_fix-re-wks')('search',1,function(defined,SEARCH,$search){// 21.1.3.15 String.prototype.search(regexp)
return[function search(regexp){'use strict';var O=defined(this),fn=regexp==undefined?undefined:regexp[SEARCH];return fn!==undefined?fn.call(regexp,O):new RegExp(regexp)[SEARCH](String(O));},$search];});},{"./_fix-re-wks":44}],227:[function(require,module,exports){// @@split logic
require('./_fix-re-wks')('split',2,function(defined,SPLIT,$split){'use strict';var isRegExp=require('./_is-regexp'),_split=$split,$push=[].push,$SPLIT='split',LENGTH='length',LAST_INDEX='lastIndex';if('abbc'[$SPLIT](/(b)*/)[1]=='c'||'test'[$SPLIT](/(?:)/,-1)[LENGTH]!=4||'ab'[$SPLIT](/(?:ab)*/)[LENGTH]!=2||'.'[$SPLIT](/(.?)(.?)/)[LENGTH]!=4||'.'[$SPLIT](/()()/)[LENGTH]>1||''[$SPLIT](/.?/)[LENGTH]){var NPCG=/()??/.exec('')[1]===undefined;// nonparticipating capturing group
// based on es5-shim implementation, need to rework it
$split=function $split(separator,limit){var string=String(this);if(separator===undefined&&limit===0)return[];// If `separator` is not a regex, use native split
if(!isRegExp(separator))return _split.call(string,separator,limit);var output=[];var flags=(separator.ignoreCase?'i':'')+(separator.multiline?'m':'')+(separator.unicode?'u':'')+(separator.sticky?'y':'');var lastLastIndex=0;var splitLimit=limit===undefined?4294967295:limit>>>0;// Make `global` and avoid `lastIndex` issues by working with a copy
var separatorCopy=new RegExp(separator.source,flags+'g');var separator2,match,lastIndex,lastLength,i;// Doesn't need flags gy, but they don't hurt
if(!NPCG)separator2=new RegExp('^'+separatorCopy.source+'$(?!\\s)',flags);while(match=separatorCopy.exec(string)){// `separatorCopy.lastIndex` is not reliable cross-browser
lastIndex=match.index+match[0][LENGTH];if(lastIndex>lastLastIndex){output.push(string.slice(lastLastIndex,match.index));// Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
if(!NPCG&&match[LENGTH]>1)match[0].replace(separator2,function(){for(i=1;i<arguments[LENGTH]-2;i++){if(arguments[i]===undefined)match[i]=undefined;}});if(match[LENGTH]>1&&match.index<string[LENGTH])$push.apply(output,match.slice(1));lastLength=match[0][LENGTH];lastLastIndex=lastIndex;if(output[LENGTH]>=splitLimit)break;}if(separatorCopy[LAST_INDEX]===match.index)separatorCopy[LAST_INDEX]++;// Avoid an infinite loop
}if(lastLastIndex===string[LENGTH]){if(lastLength||!separatorCopy.test(''))output.push('');}else output.push(string.slice(lastLastIndex));return output[LENGTH]>splitLimit?output.slice(0,splitLimit):output;};// Chakra, V8
}else if('0'[$SPLIT](undefined,0)[LENGTH]){$split=function $split(separator,limit){return separator===undefined&&limit===0?[]:_split.call(this,separator,limit);};}// 21.1.3.17 String.prototype.split(separator, limit)
return[function split(separator,limit){var O=defined(this),fn=separator==undefined?undefined:separator[SPLIT];return fn!==undefined?fn.call(separator,O,limit):$split.call(String(O),separator,limit);},$split];});},{"./_fix-re-wks":44,"./_is-regexp":59}],228:[function(require,module,exports){'use strict';require('./es6.regexp.flags');var anObject=require('./_an-object'),$flags=require('./_flags'),DESCRIPTORS=require('./_descriptors'),TO_STRING='toString',$toString=/./[TO_STRING];var define=function define(fn){require('./_redefine')(RegExp.prototype,TO_STRING,fn,true);};// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){return $toString.call({source:'a',flags:'b'})!='/a/b';})){define(function toString(){var R=anObject(this);return'/'.concat(R.source,'/','flags'in R?R.flags:!DESCRIPTORS&&R instanceof RegExp?$flags.call(R):undefined);});// FF44- RegExp#toString has a wrong name
}else if($toString.name!=TO_STRING){define(function toString(){return $toString.call(this);});}},{"./_an-object":16,"./_descriptors":37,"./_fails":43,"./_flags":45,"./_redefine":96,"./es6.regexp.flags":223}],229:[function(require,module,exports){'use strict';var strong=require('./_collection-strong');// 23.2 Set Objects
module.exports=require('./_collection')('Set',function(get){return function Set(){return get(this,arguments.length>0?arguments[0]:undefined);};},{// 23.2.3.1 Set.prototype.add(value)
add:function add(value){return strong.def(this,value=value===0?0:value,value);}},strong);},{"./_collection":31,"./_collection-strong":28}],230:[function(require,module,exports){'use strict';// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor',function(createHTML){return function anchor(name){return createHTML(this,'a','name',name);};});},{"./_string-html":108}],231:[function(require,module,exports){'use strict';// B.2.3.3 String.prototype.big()
require('./_string-html')('big',function(createHTML){return function big(){return createHTML(this,'big','','');};});},{"./_string-html":108}],232:[function(require,module,exports){'use strict';// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink',function(createHTML){return function blink(){return createHTML(this,'blink','','');};});},{"./_string-html":108}],233:[function(require,module,exports){'use strict';// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold',function(createHTML){return function bold(){return createHTML(this,'b','','');};});},{"./_string-html":108}],234:[function(require,module,exports){'use strict';var $export=require('./_export'),$at=require('./_string-at')(false);$export($export.P,'String',{// 21.1.3.3 String.prototype.codePointAt(pos)
codePointAt:function codePointAt(pos){return $at(this,pos);}});},{"./_export":41,"./_string-at":106}],235:[function(require,module,exports){// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';var $export=require('./_export'),toLength=require('./_to-length'),context=require('./_string-context'),ENDS_WITH='endsWith',$endsWith=''[ENDS_WITH];$export($export.P+$export.F*require('./_fails-is-regexp')(ENDS_WITH),'String',{endsWith:function endsWith(searchString/*, endPosition = @length */){var that=context(this,searchString,ENDS_WITH),endPosition=arguments.length>1?arguments[1]:undefined,len=toLength(that.length),end=endPosition===undefined?len:Math.min(toLength(endPosition),len),search=String(searchString);return $endsWith?$endsWith.call(that,search,end):that.slice(end-search.length,end)===search;}});},{"./_export":41,"./_fails-is-regexp":42,"./_string-context":107,"./_to-length":117}],236:[function(require,module,exports){'use strict';// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed',function(createHTML){return function fixed(){return createHTML(this,'tt','','');};});},{"./_string-html":108}],237:[function(require,module,exports){'use strict';// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor',function(createHTML){return function fontcolor(color){return createHTML(this,'font','color',color);};});},{"./_string-html":108}],238:[function(require,module,exports){'use strict';// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize',function(createHTML){return function fontsize(size){return createHTML(this,'font','size',size);};});},{"./_string-html":108}],239:[function(require,module,exports){var $export=require('./_export'),toIndex=require('./_to-index'),fromCharCode=String.fromCharCode,$fromCodePoint=String.fromCodePoint;// length should be 1, old FF problem
$export($export.S+$export.F*(!!$fromCodePoint&&$fromCodePoint.length!=1),'String',{// 21.1.2.2 String.fromCodePoint(...codePoints)
fromCodePoint:function fromCodePoint(x){// eslint-disable-line no-unused-vars
var res=[],aLen=arguments.length,i=0,code;while(aLen>i){code=+arguments[i++];if(toIndex(code,0x10ffff)!==code)throw RangeError(code+' is not a valid code point');res.push(code<0x10000?fromCharCode(code):fromCharCode(((code-=0x10000)>>10)+0xd800,code%0x400+0xdc00));}return res.join('');}});},{"./_export":41,"./_to-index":114}],240:[function(require,module,exports){// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';var $export=require('./_export'),context=require('./_string-context'),INCLUDES='includes';$export($export.P+$export.F*require('./_fails-is-regexp')(INCLUDES),'String',{includes:function includes(searchString/*, position = 0 */){return!!~context(this,searchString,INCLUDES).indexOf(searchString,arguments.length>1?arguments[1]:undefined);}});},{"./_export":41,"./_fails-is-regexp":42,"./_string-context":107}],241:[function(require,module,exports){'use strict';// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics',function(createHTML){return function italics(){return createHTML(this,'i','','');};});},{"./_string-html":108}],242:[function(require,module,exports){'use strict';var $at=require('./_string-at')(true);// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String,'String',function(iterated){this._t=String(iterated);// target
this._i=0;// next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
},function(){var O=this._t,index=this._i,point;if(index>=O.length)return{value:undefined,done:true};point=$at(O,index);this._i+=point.length;return{value:point,done:false};});},{"./_iter-define":62,"./_string-at":106}],243:[function(require,module,exports){'use strict';// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link',function(createHTML){return function link(url){return createHTML(this,'a','href',url);};});},{"./_string-html":108}],244:[function(require,module,exports){var $export=require('./_export'),toIObject=require('./_to-iobject'),toLength=require('./_to-length');$export($export.S,'String',{// 21.1.2.4 String.raw(callSite, ...substitutions)
raw:function raw(callSite){var tpl=toIObject(callSite.raw),len=toLength(tpl.length),aLen=arguments.length,res=[],i=0;while(len>i){res.push(String(tpl[i++]));if(i<aLen)res.push(String(arguments[i]));}return res.join('');}});},{"./_export":41,"./_to-iobject":116,"./_to-length":117}],245:[function(require,module,exports){var $export=require('./_export');$export($export.P,'String',{// 21.1.3.13 String.prototype.repeat(count)
repeat:require('./_string-repeat')});},{"./_export":41,"./_string-repeat":110}],246:[function(require,module,exports){'use strict';// B.2.3.11 String.prototype.small()
require('./_string-html')('small',function(createHTML){return function small(){return createHTML(this,'small','','');};});},{"./_string-html":108}],247:[function(require,module,exports){// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';var $export=require('./_export'),toLength=require('./_to-length'),context=require('./_string-context'),STARTS_WITH='startsWith',$startsWith=''[STARTS_WITH];$export($export.P+$export.F*require('./_fails-is-regexp')(STARTS_WITH),'String',{startsWith:function startsWith(searchString/*, position = 0 */){var that=context(this,searchString,STARTS_WITH),index=toLength(Math.min(arguments.length>1?arguments[1]:undefined,that.length)),search=String(searchString);return $startsWith?$startsWith.call(that,search,index):that.slice(index,index+search.length)===search;}});},{"./_export":41,"./_fails-is-regexp":42,"./_string-context":107,"./_to-length":117}],248:[function(require,module,exports){'use strict';// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike',function(createHTML){return function strike(){return createHTML(this,'strike','','');};});},{"./_string-html":108}],249:[function(require,module,exports){'use strict';// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub',function(createHTML){return function sub(){return createHTML(this,'sub','','');};});},{"./_string-html":108}],250:[function(require,module,exports){'use strict';// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup',function(createHTML){return function sup(){return createHTML(this,'sup','','');};});},{"./_string-html":108}],251:[function(require,module,exports){'use strict';// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim',function($trim){return function trim(){return $trim(this,3);};});},{"./_string-trim":111}],252:[function(require,module,exports){'use strict';// ECMAScript 6 symbols shim
var global=require('./_global'),has=require('./_has'),DESCRIPTORS=require('./_descriptors'),$export=require('./_export'),redefine=require('./_redefine'),META=require('./_meta').KEY,$fails=require('./_fails'),shared=require('./_shared'),setToStringTag=require('./_set-to-string-tag'),uid=require('./_uid'),wks=require('./_wks'),wksExt=require('./_wks-ext'),wksDefine=require('./_wks-define'),keyOf=require('./_keyof'),enumKeys=require('./_enum-keys'),isArray=require('./_is-array'),anObject=require('./_an-object'),toIObject=require('./_to-iobject'),toPrimitive=require('./_to-primitive'),createDesc=require('./_property-desc'),_create=require('./_object-create'),gOPNExt=require('./_object-gopn-ext'),$GOPD=require('./_object-gopd'),$DP=require('./_object-dp'),$keys=require('./_object-keys'),gOPD=$GOPD.f,dP=$DP.f,gOPN=gOPNExt.f,$Symbol=global.Symbol,$JSON=global.JSON,_stringify=$JSON&&$JSON.stringify,PROTOTYPE='prototype',HIDDEN=wks('_hidden'),TO_PRIMITIVE=wks('toPrimitive'),isEnum={}.propertyIsEnumerable,SymbolRegistry=shared('symbol-registry'),AllSymbols=shared('symbols'),OPSymbols=shared('op-symbols'),ObjectProto=Object[PROTOTYPE],USE_NATIVE=typeof $Symbol=='function',QObject=global.QObject;// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter=!QObject||!QObject[PROTOTYPE]||!QObject[PROTOTYPE].findChild;// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc=DESCRIPTORS&&$fails(function(){return _create(dP({},'a',{get:function get(){return dP(this,'a',{value:7}).a;}})).a!=7;})?function(it,key,D){var protoDesc=gOPD(ObjectProto,key);if(protoDesc)delete ObjectProto[key];dP(it,key,D);if(protoDesc&&it!==ObjectProto)dP(ObjectProto,key,protoDesc);}:dP;var wrap=function wrap(tag){var sym=AllSymbols[tag]=_create($Symbol[PROTOTYPE]);sym._k=tag;return sym;};var isSymbol=USE_NATIVE&&_typeof($Symbol.iterator)=='symbol'?function(it){return(typeof it==="undefined"?"undefined":_typeof(it))=='symbol';}:function(it){return it instanceof $Symbol;};var $defineProperty=function defineProperty(it,key,D){if(it===ObjectProto)$defineProperty(OPSymbols,key,D);anObject(it);key=toPrimitive(key,true);anObject(D);if(has(AllSymbols,key)){if(!D.enumerable){if(!has(it,HIDDEN))dP(it,HIDDEN,createDesc(1,{}));it[HIDDEN][key]=true;}else{if(has(it,HIDDEN)&&it[HIDDEN][key])it[HIDDEN][key]=false;D=_create(D,{enumerable:createDesc(0,false)});}return setSymbolDesc(it,key,D);}return dP(it,key,D);};var $defineProperties=function defineProperties(it,P){anObject(it);var keys=enumKeys(P=toIObject(P)),i=0,l=keys.length,key;while(l>i){$defineProperty(it,key=keys[i++],P[key]);}return it;};var $create=function create(it,P){return P===undefined?_create(it):$defineProperties(_create(it),P);};var $propertyIsEnumerable=function propertyIsEnumerable(key){var E=isEnum.call(this,key=toPrimitive(key,true));if(this===ObjectProto&&has(AllSymbols,key)&&!has(OPSymbols,key))return false;return E||!has(this,key)||!has(AllSymbols,key)||has(this,HIDDEN)&&this[HIDDEN][key]?E:true;};var $getOwnPropertyDescriptor=function getOwnPropertyDescriptor(it,key){it=toIObject(it);key=toPrimitive(key,true);if(it===ObjectProto&&has(AllSymbols,key)&&!has(OPSymbols,key))return;var D=gOPD(it,key);if(D&&has(AllSymbols,key)&&!(has(it,HIDDEN)&&it[HIDDEN][key]))D.enumerable=true;return D;};var $getOwnPropertyNames=function getOwnPropertyNames(it){var names=gOPN(toIObject(it)),result=[],i=0,key;while(names.length>i){if(!has(AllSymbols,key=names[i++])&&key!=HIDDEN&&key!=META)result.push(key);}return result;};var $getOwnPropertySymbols=function getOwnPropertySymbols(it){var IS_OP=it===ObjectProto,names=gOPN(IS_OP?OPSymbols:toIObject(it)),result=[],i=0,key;while(names.length>i){if(has(AllSymbols,key=names[i++])&&(IS_OP?has(ObjectProto,key):true))result.push(AllSymbols[key]);}return result;};// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){$Symbol=function _Symbol2(){if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');var tag=uid(arguments.length>0?arguments[0]:undefined);var $set=function $set(value){if(this===ObjectProto)$set.call(OPSymbols,value);if(has(this,HIDDEN)&&has(this[HIDDEN],tag))this[HIDDEN][tag]=false;setSymbolDesc(this,tag,createDesc(1,value));};if(DESCRIPTORS&&setter)setSymbolDesc(ObjectProto,tag,{configurable:true,set:$set});return wrap(tag);};redefine($Symbol[PROTOTYPE],'toString',function toString(){return this._k;});$GOPD.f=$getOwnPropertyDescriptor;$DP.f=$defineProperty;require('./_object-gopn').f=gOPNExt.f=$getOwnPropertyNames;require('./_object-pie').f=$propertyIsEnumerable;require('./_object-gops').f=$getOwnPropertySymbols;if(DESCRIPTORS&&!require('./_library')){redefine(ObjectProto,'propertyIsEnumerable',$propertyIsEnumerable,true);}wksExt.f=function(name){return wrap(wks(name));};}$export($export.G+$export.W+$export.F*!USE_NATIVE,{Symbol:$Symbol});for(var symbols=// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','),i=0;symbols.length>i;){wks(symbols[i++]);}for(var symbols=$keys(wks.store),i=0;symbols.length>i;){wksDefine(symbols[i++]);}$export($export.S+$export.F*!USE_NATIVE,'Symbol',{// 19.4.2.1 Symbol.for(key)
'for':function _for(key){return has(SymbolRegistry,key+='')?SymbolRegistry[key]:SymbolRegistry[key]=$Symbol(key);},// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function keyFor(key){if(isSymbol(key))return keyOf(SymbolRegistry,key);throw TypeError(key+' is not a symbol!');},useSetter:function useSetter(){setter=true;},useSimple:function useSimple(){setter=false;}});$export($export.S+$export.F*!USE_NATIVE,'Object',{// 19.1.2.2 Object.create(O [, Properties])
create:$create,// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:$defineProperty,// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:$defineProperties,// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:$getOwnPropertyDescriptor,// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:$getOwnPropertyNames,// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:$getOwnPropertySymbols});// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON&&$export($export.S+$export.F*(!USE_NATIVE||$fails(function(){var S=$Symbol();// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return _stringify([S])!='[null]'||_stringify({a:S})!='{}'||_stringify(Object(S))!='{}';})),'JSON',{stringify:function stringify(it){if(it===undefined||isSymbol(it))return;// IE8 returns string on undefined
var args=[it],i=1,replacer,$replacer;while(arguments.length>i){args.push(arguments[i++]);}replacer=args[1];if(typeof replacer=='function')$replacer=replacer;if($replacer||!isArray(replacer))replacer=function replacer(key,value){if($replacer)value=$replacer.call(this,key,value);if(!isSymbol(value))return value;};args[1]=replacer;return _stringify.apply($JSON,args);}});// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE]||require('./_hide')($Symbol[PROTOTYPE],TO_PRIMITIVE,$Symbol[PROTOTYPE].valueOf);// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol,'Symbol');// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math,'Math',true);// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON,'JSON',true);},{"./_an-object":16,"./_descriptors":37,"./_enum-keys":40,"./_export":41,"./_fails":43,"./_global":47,"./_has":48,"./_hide":49,"./_is-array":56,"./_keyof":66,"./_library":67,"./_meta":71,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_object-gopn-ext":80,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_property-desc":94,"./_redefine":96,"./_set-to-string-tag":101,"./_shared":103,"./_to-iobject":116,"./_to-primitive":119,"./_uid":123,"./_wks":126,"./_wks-define":124,"./_wks-ext":125}],253:[function(require,module,exports){'use strict';var $export=require('./_export'),$typed=require('./_typed'),buffer=require('./_typed-buffer'),anObject=require('./_an-object'),toIndex=require('./_to-index'),toLength=require('./_to-length'),isObject=require('./_is-object'),ArrayBuffer=require('./_global').ArrayBuffer,speciesConstructor=require('./_species-constructor'),$ArrayBuffer=buffer.ArrayBuffer,$DataView=buffer.DataView,$isView=$typed.ABV&&ArrayBuffer.isView,$slice=$ArrayBuffer.prototype.slice,VIEW=$typed.VIEW,ARRAY_BUFFER='ArrayBuffer';$export($export.G+$export.W+$export.F*(ArrayBuffer!==$ArrayBuffer),{ArrayBuffer:$ArrayBuffer});$export($export.S+$export.F*!$typed.CONSTR,ARRAY_BUFFER,{// 24.1.3.1 ArrayBuffer.isView(arg)
isView:function isView(it){return $isView&&$isView(it)||isObject(it)&&VIEW in it;}});$export($export.P+$export.U+$export.F*require('./_fails')(function(){return!new $ArrayBuffer(2).slice(1,undefined).byteLength;}),ARRAY_BUFFER,{// 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
slice:function slice(start,end){if($slice!==undefined&&end===undefined)return $slice.call(anObject(this),start);// FF fix
var len=anObject(this).byteLength,first=toIndex(start,len),final=toIndex(end===undefined?len:end,len),result=new(speciesConstructor(this,$ArrayBuffer))(toLength(final-first)),viewS=new $DataView(this),viewT=new $DataView(result),index=0;while(first<final){viewT.setUint8(index++,viewS.getUint8(first++));}return result;}});require('./_set-species')(ARRAY_BUFFER);},{"./_an-object":16,"./_export":41,"./_fails":43,"./_global":47,"./_is-object":58,"./_set-species":100,"./_species-constructor":104,"./_to-index":114,"./_to-length":117,"./_typed":122,"./_typed-buffer":121}],254:[function(require,module,exports){var $export=require('./_export');$export($export.G+$export.W+$export.F*!require('./_typed').ABV,{DataView:require('./_typed-buffer').DataView});},{"./_export":41,"./_typed":122,"./_typed-buffer":121}],255:[function(require,module,exports){require('./_typed-array')('Float32',4,function(init){return function Float32Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],256:[function(require,module,exports){require('./_typed-array')('Float64',8,function(init){return function Float64Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],257:[function(require,module,exports){require('./_typed-array')('Int16',2,function(init){return function Int16Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],258:[function(require,module,exports){require('./_typed-array')('Int32',4,function(init){return function Int32Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],259:[function(require,module,exports){require('./_typed-array')('Int8',1,function(init){return function Int8Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],260:[function(require,module,exports){require('./_typed-array')('Uint16',2,function(init){return function Uint16Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],261:[function(require,module,exports){require('./_typed-array')('Uint32',4,function(init){return function Uint32Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],262:[function(require,module,exports){require('./_typed-array')('Uint8',1,function(init){return function Uint8Array(data,byteOffset,length){return init(this,data,byteOffset,length);};});},{"./_typed-array":120}],263:[function(require,module,exports){require('./_typed-array')('Uint8',1,function(init){return function Uint8ClampedArray(data,byteOffset,length){return init(this,data,byteOffset,length);};},true);},{"./_typed-array":120}],264:[function(require,module,exports){'use strict';var each=require('./_array-methods')(0),redefine=require('./_redefine'),meta=require('./_meta'),assign=require('./_object-assign'),weak=require('./_collection-weak'),isObject=require('./_is-object'),getWeak=meta.getWeak,isExtensible=Object.isExtensible,uncaughtFrozenStore=weak.ufstore,tmp={},InternalMap;var wrapper=function wrapper(get){return function WeakMap(){return get(this,arguments.length>0?arguments[0]:undefined);};};var methods={// 23.3.3.3 WeakMap.prototype.get(key)
get:function get(key){if(isObject(key)){var data=getWeak(key);if(data===true)return uncaughtFrozenStore(this).get(key);return data?data[this._i]:undefined;}},// 23.3.3.5 WeakMap.prototype.set(key, value)
set:function set(key,value){return weak.def(this,key,value);}};// 23.3 WeakMap Objects
var $WeakMap=module.exports=require('./_collection')('WeakMap',wrapper,methods,weak,true,true);// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze||Object)(tmp),7).get(tmp)!=7){InternalMap=weak.getConstructor(wrapper);assign(InternalMap.prototype,methods);meta.NEED=true;each(['delete','has','get','set'],function(key){var proto=$WeakMap.prototype,method=proto[key];redefine(proto,key,function(a,b){// store frozen objects on internal weakmap shim
if(isObject(a)&&!isExtensible(a)){if(!this._f)this._f=new InternalMap();var result=this._f[key](a,b);return key=='set'?this:result;// store all the rest on native weakmap
}return method.call(this,a,b);});});}},{"./_array-methods":21,"./_collection":31,"./_collection-weak":30,"./_is-object":58,"./_meta":71,"./_object-assign":74,"./_redefine":96}],265:[function(require,module,exports){'use strict';var weak=require('./_collection-weak');// 23.4 WeakSet Objects
require('./_collection')('WeakSet',function(get){return function WeakSet(){return get(this,arguments.length>0?arguments[0]:undefined);};},{// 23.4.3.1 WeakSet.prototype.add(value)
add:function add(value){return weak.def(this,value,true);}},weak,false,true);},{"./_collection":31,"./_collection-weak":30}],266:[function(require,module,exports){'use strict';// https://github.com/tc39/Array.prototype.includes
var $export=require('./_export'),$includes=require('./_array-includes')(true);$export($export.P,'Array',{includes:function includes(el/*, fromIndex = 0 */){return $includes(this,el,arguments.length>1?arguments[1]:undefined);}});require('./_add-to-unscopables')('includes');},{"./_add-to-unscopables":14,"./_array-includes":20,"./_export":41}],267:[function(require,module,exports){// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export=require('./_export'),microtask=require('./_microtask')(),process=require('./_global').process,isNode=require('./_cof')(process)=='process';$export($export.G,{asap:function asap(fn){var domain=isNode&&process.domain;microtask(domain?domain.bind(fn):fn);}});},{"./_cof":27,"./_export":41,"./_global":47,"./_microtask":73}],268:[function(require,module,exports){// https://github.com/ljharb/proposal-is-error
var $export=require('./_export'),cof=require('./_cof');$export($export.S,'Error',{isError:function isError(it){return cof(it)==='Error';}});},{"./_cof":27,"./_export":41}],269:[function(require,module,exports){// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export=require('./_export');$export($export.P+$export.R,'Map',{toJSON:require('./_collection-to-json')('Map')});},{"./_collection-to-json":29,"./_export":41}],270:[function(require,module,exports){// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export=require('./_export');$export($export.S,'Math',{iaddh:function iaddh(x0,x1,y0,y1){var $x0=x0>>>0,$x1=x1>>>0,$y0=y0>>>0;return $x1+(y1>>>0)+(($x0&$y0|($x0|$y0)&~($x0+$y0>>>0))>>>31)|0;}});},{"./_export":41}],271:[function(require,module,exports){// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export=require('./_export');$export($export.S,'Math',{imulh:function imulh(u,v){var UINT16=0xffff,$u=+u,$v=+v,u0=$u&UINT16,v0=$v&UINT16,u1=$u>>16,v1=$v>>16,t=(u1*v0>>>0)+(u0*v0>>>16);return u1*v1+(t>>16)+((u0*v1>>>0)+(t&UINT16)>>16);}});},{"./_export":41}],272:[function(require,module,exports){// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export=require('./_export');$export($export.S,'Math',{isubh:function isubh(x0,x1,y0,y1){var $x0=x0>>>0,$x1=x1>>>0,$y0=y0>>>0;return $x1-(y1>>>0)-((~$x0&$y0|~($x0^$y0)&$x0-$y0>>>0)>>>31)|0;}});},{"./_export":41}],273:[function(require,module,exports){// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export=require('./_export');$export($export.S,'Math',{umulh:function umulh(u,v){var UINT16=0xffff,$u=+u,$v=+v,u0=$u&UINT16,v0=$v&UINT16,u1=$u>>>16,v1=$v>>>16,t=(u1*v0>>>0)+(u0*v0>>>16);return u1*v1+(t>>>16)+((u0*v1>>>0)+(t&UINT16)>>>16);}});},{"./_export":41}],274:[function(require,module,exports){'use strict';var $export=require('./_export'),toObject=require('./_to-object'),aFunction=require('./_a-function'),$defineProperty=require('./_object-dp');// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors')&&$export($export.P+require('./_object-forced-pam'),'Object',{__defineGetter__:function __defineGetter__(P,getter){$defineProperty.f(toObject(this),P,{get:aFunction(getter),enumerable:true,configurable:true});}});},{"./_a-function":12,"./_descriptors":37,"./_export":41,"./_object-dp":76,"./_object-forced-pam":78,"./_to-object":118}],275:[function(require,module,exports){'use strict';var $export=require('./_export'),toObject=require('./_to-object'),aFunction=require('./_a-function'),$defineProperty=require('./_object-dp');// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors')&&$export($export.P+require('./_object-forced-pam'),'Object',{__defineSetter__:function __defineSetter__(P,setter){$defineProperty.f(toObject(this),P,{set:aFunction(setter),enumerable:true,configurable:true});}});},{"./_a-function":12,"./_descriptors":37,"./_export":41,"./_object-dp":76,"./_object-forced-pam":78,"./_to-object":118}],276:[function(require,module,exports){// https://github.com/tc39/proposal-object-values-entries
var $export=require('./_export'),$entries=require('./_object-to-array')(true);$export($export.S,'Object',{entries:function entries(it){return $entries(it);}});},{"./_export":41,"./_object-to-array":88}],277:[function(require,module,exports){// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export=require('./_export'),ownKeys=require('./_own-keys'),toIObject=require('./_to-iobject'),gOPD=require('./_object-gopd'),createProperty=require('./_create-property');$export($export.S,'Object',{getOwnPropertyDescriptors:function getOwnPropertyDescriptors(object){var O=toIObject(object),getDesc=gOPD.f,keys=ownKeys(O),result={},i=0,key;while(keys.length>i){createProperty(result,key=keys[i++],getDesc(O,key));}return result;}});},{"./_create-property":33,"./_export":41,"./_object-gopd":79,"./_own-keys":89,"./_to-iobject":116}],278:[function(require,module,exports){'use strict';var $export=require('./_export'),toObject=require('./_to-object'),toPrimitive=require('./_to-primitive'),getPrototypeOf=require('./_object-gpo'),getOwnPropertyDescriptor=require('./_object-gopd').f;// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors')&&$export($export.P+require('./_object-forced-pam'),'Object',{__lookupGetter__:function __lookupGetter__(P){var O=toObject(this),K=toPrimitive(P,true),D;do{if(D=getOwnPropertyDescriptor(O,K))return D.get;}while(O=getPrototypeOf(O));}});},{"./_descriptors":37,"./_export":41,"./_object-forced-pam":78,"./_object-gopd":79,"./_object-gpo":83,"./_to-object":118,"./_to-primitive":119}],279:[function(require,module,exports){'use strict';var $export=require('./_export'),toObject=require('./_to-object'),toPrimitive=require('./_to-primitive'),getPrototypeOf=require('./_object-gpo'),getOwnPropertyDescriptor=require('./_object-gopd').f;// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors')&&$export($export.P+require('./_object-forced-pam'),'Object',{__lookupSetter__:function __lookupSetter__(P){var O=toObject(this),K=toPrimitive(P,true),D;do{if(D=getOwnPropertyDescriptor(O,K))return D.set;}while(O=getPrototypeOf(O));}});},{"./_descriptors":37,"./_export":41,"./_object-forced-pam":78,"./_object-gopd":79,"./_object-gpo":83,"./_to-object":118,"./_to-primitive":119}],280:[function(require,module,exports){// https://github.com/tc39/proposal-object-values-entries
var $export=require('./_export'),$values=require('./_object-to-array')(false);$export($export.S,'Object',{values:function values(it){return $values(it);}});},{"./_export":41,"./_object-to-array":88}],281:[function(require,module,exports){'use strict';// https://github.com/zenparsing/es-observable
var $export=require('./_export'),global=require('./_global'),core=require('./_core'),microtask=require('./_microtask')(),OBSERVABLE=require('./_wks')('observable'),aFunction=require('./_a-function'),anObject=require('./_an-object'),anInstance=require('./_an-instance'),redefineAll=require('./_redefine-all'),hide=require('./_hide'),forOf=require('./_for-of'),RETURN=forOf.RETURN;var getMethod=function getMethod(fn){return fn==null?undefined:aFunction(fn);};var cleanupSubscription=function cleanupSubscription(subscription){var cleanup=subscription._c;if(cleanup){subscription._c=undefined;cleanup();}};var subscriptionClosed=function subscriptionClosed(subscription){return subscription._o===undefined;};var closeSubscription=function closeSubscription(subscription){if(!subscriptionClosed(subscription)){subscription._o=undefined;cleanupSubscription(subscription);}};var Subscription=function Subscription(observer,subscriber){anObject(observer);this._c=undefined;this._o=observer;observer=new SubscriptionObserver(this);try{var cleanup=subscriber(observer),subscription=cleanup;if(cleanup!=null){if(typeof cleanup.unsubscribe==='function')cleanup=function cleanup(){subscription.unsubscribe();};else aFunction(cleanup);this._c=cleanup;}}catch(e){observer.error(e);return;}if(subscriptionClosed(this))cleanupSubscription(this);};Subscription.prototype=redefineAll({},{unsubscribe:function unsubscribe(){closeSubscription(this);}});var SubscriptionObserver=function SubscriptionObserver(subscription){this._s=subscription;};SubscriptionObserver.prototype=redefineAll({},{next:function next(value){var subscription=this._s;if(!subscriptionClosed(subscription)){var observer=subscription._o;try{var m=getMethod(observer.next);if(m)return m.call(observer,value);}catch(e){try{closeSubscription(subscription);}finally{throw e;}}}},error:function error(value){var subscription=this._s;if(subscriptionClosed(subscription))throw value;var observer=subscription._o;subscription._o=undefined;try{var m=getMethod(observer.error);if(!m)throw value;value=m.call(observer,value);}catch(e){try{cleanupSubscription(subscription);}finally{throw e;}}cleanupSubscription(subscription);return value;},complete:function complete(value){var subscription=this._s;if(!subscriptionClosed(subscription)){var observer=subscription._o;subscription._o=undefined;try{var m=getMethod(observer.complete);value=m?m.call(observer,value):undefined;}catch(e){try{cleanupSubscription(subscription);}finally{throw e;}}cleanupSubscription(subscription);return value;}}});var $Observable=function Observable(subscriber){anInstance(this,$Observable,'Observable','_f')._f=aFunction(subscriber);};redefineAll($Observable.prototype,{subscribe:function subscribe(observer){return new Subscription(observer,this._f);},forEach:function forEach(fn){var that=this;return new(core.Promise||global.Promise)(function(resolve,reject){aFunction(fn);var subscription=that.subscribe({next:function next(value){try{return fn(value);}catch(e){reject(e);subscription.unsubscribe();}},error:reject,complete:resolve});});}});redefineAll($Observable,{from:function from(x){var C=typeof this==='function'?this:$Observable;var method=getMethod(anObject(x)[OBSERVABLE]);if(method){var observable=anObject(method.call(x));return observable.constructor===C?observable:new C(function(observer){return observable.subscribe(observer);});}return new C(function(observer){var done=false;microtask(function(){if(!done){try{if(forOf(x,false,function(it){observer.next(it);if(done)return RETURN;})===RETURN)return;}catch(e){if(done)throw e;observer.error(e);return;}observer.complete();}});return function(){done=true;};});},of:function of(){for(var i=0,l=arguments.length,items=Array(l);i<l;){items[i]=arguments[i++];}return new(typeof this==='function'?this:$Observable)(function(observer){var done=false;microtask(function(){if(!done){for(var i=0;i<items.length;++i){observer.next(items[i]);if(done)return;}observer.complete();}});return function(){done=true;};});}});hide($Observable.prototype,OBSERVABLE,function(){return this;});$export($export.G,{Observable:$Observable});require('./_set-species')('Observable');},{"./_a-function":12,"./_an-instance":15,"./_an-object":16,"./_core":32,"./_export":41,"./_for-of":46,"./_global":47,"./_hide":49,"./_microtask":73,"./_redefine-all":95,"./_set-species":100,"./_wks":126}],282:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),toMetaKey=metadata.key,ordinaryDefineOwnMetadata=metadata.set;metadata.exp({defineMetadata:function defineMetadata(metadataKey,metadataValue,target,targetKey){ordinaryDefineOwnMetadata(metadataKey,metadataValue,anObject(target),toMetaKey(targetKey));}});},{"./_an-object":16,"./_metadata":72}],283:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),toMetaKey=metadata.key,getOrCreateMetadataMap=metadata.map,store=metadata.store;metadata.exp({deleteMetadata:function deleteMetadata(metadataKey,target/*, targetKey */){var targetKey=arguments.length<3?undefined:toMetaKey(arguments[2]),metadataMap=getOrCreateMetadataMap(anObject(target),targetKey,false);if(metadataMap===undefined||!metadataMap['delete'](metadataKey))return false;if(metadataMap.size)return true;var targetMetadata=store.get(target);targetMetadata['delete'](targetKey);return!!targetMetadata.size||store['delete'](target);}});},{"./_an-object":16,"./_metadata":72}],284:[function(require,module,exports){var Set=require('./es6.set'),from=require('./_array-from-iterable'),metadata=require('./_metadata'),anObject=require('./_an-object'),getPrototypeOf=require('./_object-gpo'),ordinaryOwnMetadataKeys=metadata.keys,toMetaKey=metadata.key;var ordinaryMetadataKeys=function ordinaryMetadataKeys(O,P){var oKeys=ordinaryOwnMetadataKeys(O,P),parent=getPrototypeOf(O);if(parent===null)return oKeys;var pKeys=ordinaryMetadataKeys(parent,P);return pKeys.length?oKeys.length?from(new Set(oKeys.concat(pKeys))):pKeys:oKeys;};metadata.exp({getMetadataKeys:function getMetadataKeys(target/*, targetKey */){return ordinaryMetadataKeys(anObject(target),arguments.length<2?undefined:toMetaKey(arguments[1]));}});},{"./_an-object":16,"./_array-from-iterable":19,"./_metadata":72,"./_object-gpo":83,"./es6.set":229}],285:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),getPrototypeOf=require('./_object-gpo'),ordinaryHasOwnMetadata=metadata.has,ordinaryGetOwnMetadata=metadata.get,toMetaKey=metadata.key;var ordinaryGetMetadata=function ordinaryGetMetadata(MetadataKey,O,P){var hasOwn=ordinaryHasOwnMetadata(MetadataKey,O,P);if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey,O,P);var parent=getPrototypeOf(O);return parent!==null?ordinaryGetMetadata(MetadataKey,parent,P):undefined;};metadata.exp({getMetadata:function getMetadata(metadataKey,target/*, targetKey */){return ordinaryGetMetadata(metadataKey,anObject(target),arguments.length<3?undefined:toMetaKey(arguments[2]));}});},{"./_an-object":16,"./_metadata":72,"./_object-gpo":83}],286:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),ordinaryOwnMetadataKeys=metadata.keys,toMetaKey=metadata.key;metadata.exp({getOwnMetadataKeys:function getOwnMetadataKeys(target/*, targetKey */){return ordinaryOwnMetadataKeys(anObject(target),arguments.length<2?undefined:toMetaKey(arguments[1]));}});},{"./_an-object":16,"./_metadata":72}],287:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),ordinaryGetOwnMetadata=metadata.get,toMetaKey=metadata.key;metadata.exp({getOwnMetadata:function getOwnMetadata(metadataKey,target/*, targetKey */){return ordinaryGetOwnMetadata(metadataKey,anObject(target),arguments.length<3?undefined:toMetaKey(arguments[2]));}});},{"./_an-object":16,"./_metadata":72}],288:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),getPrototypeOf=require('./_object-gpo'),ordinaryHasOwnMetadata=metadata.has,toMetaKey=metadata.key;var ordinaryHasMetadata=function ordinaryHasMetadata(MetadataKey,O,P){var hasOwn=ordinaryHasOwnMetadata(MetadataKey,O,P);if(hasOwn)return true;var parent=getPrototypeOf(O);return parent!==null?ordinaryHasMetadata(MetadataKey,parent,P):false;};metadata.exp({hasMetadata:function hasMetadata(metadataKey,target/*, targetKey */){return ordinaryHasMetadata(metadataKey,anObject(target),arguments.length<3?undefined:toMetaKey(arguments[2]));}});},{"./_an-object":16,"./_metadata":72,"./_object-gpo":83}],289:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),ordinaryHasOwnMetadata=metadata.has,toMetaKey=metadata.key;metadata.exp({hasOwnMetadata:function hasOwnMetadata(metadataKey,target/*, targetKey */){return ordinaryHasOwnMetadata(metadataKey,anObject(target),arguments.length<3?undefined:toMetaKey(arguments[2]));}});},{"./_an-object":16,"./_metadata":72}],290:[function(require,module,exports){var metadata=require('./_metadata'),anObject=require('./_an-object'),aFunction=require('./_a-function'),toMetaKey=metadata.key,ordinaryDefineOwnMetadata=metadata.set;metadata.exp({metadata:function metadata(metadataKey,metadataValue){return function decorator(target,targetKey){ordinaryDefineOwnMetadata(metadataKey,metadataValue,(targetKey!==undefined?anObject:aFunction)(target),toMetaKey(targetKey));};}});},{"./_a-function":12,"./_an-object":16,"./_metadata":72}],291:[function(require,module,exports){// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export=require('./_export');$export($export.P+$export.R,'Set',{toJSON:require('./_collection-to-json')('Set')});},{"./_collection-to-json":29,"./_export":41}],292:[function(require,module,exports){'use strict';// https://github.com/mathiasbynens/String.prototype.at
var $export=require('./_export'),$at=require('./_string-at')(true);$export($export.P,'String',{at:function at(pos){return $at(this,pos);}});},{"./_export":41,"./_string-at":106}],293:[function(require,module,exports){'use strict';// https://tc39.github.io/String.prototype.matchAll/
var $export=require('./_export'),defined=require('./_defined'),toLength=require('./_to-length'),isRegExp=require('./_is-regexp'),getFlags=require('./_flags'),RegExpProto=RegExp.prototype;var $RegExpStringIterator=function $RegExpStringIterator(regexp,string){this._r=regexp;this._s=string;};require('./_iter-create')($RegExpStringIterator,'RegExp String',function next(){var match=this._r.exec(this._s);return{value:match,done:match===null};});$export($export.P,'String',{matchAll:function matchAll(regexp){defined(this);if(!isRegExp(regexp))throw TypeError(regexp+' is not a regexp!');var S=String(this),flags='flags'in RegExpProto?String(regexp.flags):getFlags.call(regexp),rx=new RegExp(regexp.source,~flags.indexOf('g')?flags:'g'+flags);rx.lastIndex=toLength(regexp.lastIndex);return new $RegExpStringIterator(rx,S);}});},{"./_defined":36,"./_export":41,"./_flags":45,"./_is-regexp":59,"./_iter-create":61,"./_to-length":117}],294:[function(require,module,exports){'use strict';// https://github.com/tc39/proposal-string-pad-start-end
var $export=require('./_export'),$pad=require('./_string-pad');$export($export.P,'String',{padEnd:function padEnd(maxLength/*, fillString = ' ' */){return $pad(this,maxLength,arguments.length>1?arguments[1]:undefined,false);}});},{"./_export":41,"./_string-pad":109}],295:[function(require,module,exports){'use strict';// https://github.com/tc39/proposal-string-pad-start-end
var $export=require('./_export'),$pad=require('./_string-pad');$export($export.P,'String',{padStart:function padStart(maxLength/*, fillString = ' ' */){return $pad(this,maxLength,arguments.length>1?arguments[1]:undefined,true);}});},{"./_export":41,"./_string-pad":109}],296:[function(require,module,exports){'use strict';// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft',function($trim){return function trimLeft(){return $trim(this,1);};},'trimStart');},{"./_string-trim":111}],297:[function(require,module,exports){'use strict';// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight',function($trim){return function trimRight(){return $trim(this,2);};},'trimEnd');},{"./_string-trim":111}],298:[function(require,module,exports){require('./_wks-define')('asyncIterator');},{"./_wks-define":124}],299:[function(require,module,exports){require('./_wks-define')('observable');},{"./_wks-define":124}],300:[function(require,module,exports){// https://github.com/ljharb/proposal-global
var $export=require('./_export');$export($export.S,'System',{global:require('./_global')});},{"./_export":41,"./_global":47}],301:[function(require,module,exports){var $iterators=require('./es6.array.iterator'),redefine=require('./_redefine'),global=require('./_global'),hide=require('./_hide'),Iterators=require('./_iterators'),wks=require('./_wks'),ITERATOR=wks('iterator'),TO_STRING_TAG=wks('toStringTag'),ArrayValues=Iterators.Array;for(var collections=['NodeList','DOMTokenList','MediaList','StyleSheetList','CSSRuleList'],i=0;i<5;i++){var NAME=collections[i],Collection=global[NAME],proto=Collection&&Collection.prototype,key;if(proto){if(!proto[ITERATOR])hide(proto,ITERATOR,ArrayValues);if(!proto[TO_STRING_TAG])hide(proto,TO_STRING_TAG,NAME);Iterators[NAME]=ArrayValues;for(key in $iterators){if(!proto[key])redefine(proto,key,$iterators[key],true);}}}},{"./_global":47,"./_hide":49,"./_iterators":65,"./_redefine":96,"./_wks":126,"./es6.array.iterator":139}],302:[function(require,module,exports){var $export=require('./_export'),$task=require('./_task');$export($export.G+$export.B,{setImmediate:$task.set,clearImmediate:$task.clear});},{"./_export":41,"./_task":113}],303:[function(require,module,exports){// ie9- setTimeout & setInterval additional parameters fix
var global=require('./_global'),$export=require('./_export'),invoke=require('./_invoke'),partial=require('./_partial'),navigator=global.navigator,MSIE=!!navigator&&/MSIE .\./.test(navigator.userAgent);// <- dirty ie9- check
var wrap=function wrap(set){return MSIE?function(fn,time/*, ...args */){return set(invoke(partial,[].slice.call(arguments,2),typeof fn=='function'?fn:Function(fn)),time);}:set;};$export($export.G+$export.B+$export.F*MSIE,{setTimeout:wrap(global.setTimeout),setInterval:wrap(global.setInterval)});},{"./_export":41,"./_global":47,"./_invoke":53,"./_partial":92}],304:[function(require,module,exports){require('./modules/es6.symbol');require('./modules/es6.object.create');require('./modules/es6.object.define-property');require('./modules/es6.object.define-properties');require('./modules/es6.object.get-own-property-descriptor');require('./modules/es6.object.get-prototype-of');require('./modules/es6.object.keys');require('./modules/es6.object.get-own-property-names');require('./modules/es6.object.freeze');require('./modules/es6.object.seal');require('./modules/es6.object.prevent-extensions');require('./modules/es6.object.is-frozen');require('./modules/es6.object.is-sealed');require('./modules/es6.object.is-extensible');require('./modules/es6.object.assign');require('./modules/es6.object.is');require('./modules/es6.object.set-prototype-of');require('./modules/es6.object.to-string');require('./modules/es6.function.bind');require('./modules/es6.function.name');require('./modules/es6.function.has-instance');require('./modules/es6.parse-int');require('./modules/es6.parse-float');require('./modules/es6.number.constructor');require('./modules/es6.number.to-fixed');require('./modules/es6.number.to-precision');require('./modules/es6.number.epsilon');require('./modules/es6.number.is-finite');require('./modules/es6.number.is-integer');require('./modules/es6.number.is-nan');require('./modules/es6.number.is-safe-integer');require('./modules/es6.number.max-safe-integer');require('./modules/es6.number.min-safe-integer');require('./modules/es6.number.parse-float');require('./modules/es6.number.parse-int');require('./modules/es6.math.acosh');require('./modules/es6.math.asinh');require('./modules/es6.math.atanh');require('./modules/es6.math.cbrt');require('./modules/es6.math.clz32');require('./modules/es6.math.cosh');require('./modules/es6.math.expm1');require('./modules/es6.math.fround');require('./modules/es6.math.hypot');require('./modules/es6.math.imul');require('./modules/es6.math.log10');require('./modules/es6.math.log1p');require('./modules/es6.math.log2');require('./modules/es6.math.sign');require('./modules/es6.math.sinh');require('./modules/es6.math.tanh');require('./modules/es6.math.trunc');require('./modules/es6.string.from-code-point');require('./modules/es6.string.raw');require('./modules/es6.string.trim');require('./modules/es6.string.iterator');require('./modules/es6.string.code-point-at');require('./modules/es6.string.ends-with');require('./modules/es6.string.includes');require('./modules/es6.string.repeat');require('./modules/es6.string.starts-with');require('./modules/es6.string.anchor');require('./modules/es6.string.big');require('./modules/es6.string.blink');require('./modules/es6.string.bold');require('./modules/es6.string.fixed');require('./modules/es6.string.fontcolor');require('./modules/es6.string.fontsize');require('./modules/es6.string.italics');require('./modules/es6.string.link');require('./modules/es6.string.small');require('./modules/es6.string.strike');require('./modules/es6.string.sub');require('./modules/es6.string.sup');require('./modules/es6.date.now');require('./modules/es6.date.to-json');require('./modules/es6.date.to-iso-string');require('./modules/es6.date.to-string');require('./modules/es6.date.to-primitive');require('./modules/es6.array.is-array');require('./modules/es6.array.from');require('./modules/es6.array.of');require('./modules/es6.array.join');require('./modules/es6.array.slice');require('./modules/es6.array.sort');require('./modules/es6.array.for-each');require('./modules/es6.array.map');require('./modules/es6.array.filter');require('./modules/es6.array.some');require('./modules/es6.array.every');require('./modules/es6.array.reduce');require('./modules/es6.array.reduce-right');require('./modules/es6.array.index-of');require('./modules/es6.array.last-index-of');require('./modules/es6.array.copy-within');require('./modules/es6.array.fill');require('./modules/es6.array.find');require('./modules/es6.array.find-index');require('./modules/es6.array.species');require('./modules/es6.array.iterator');require('./modules/es6.regexp.constructor');require('./modules/es6.regexp.to-string');require('./modules/es6.regexp.flags');require('./modules/es6.regexp.match');require('./modules/es6.regexp.replace');require('./modules/es6.regexp.search');require('./modules/es6.regexp.split');require('./modules/es6.promise');require('./modules/es6.map');require('./modules/es6.set');require('./modules/es6.weak-map');require('./modules/es6.weak-set');require('./modules/es6.typed.array-buffer');require('./modules/es6.typed.data-view');require('./modules/es6.typed.int8-array');require('./modules/es6.typed.uint8-array');require('./modules/es6.typed.uint8-clamped-array');require('./modules/es6.typed.int16-array');require('./modules/es6.typed.uint16-array');require('./modules/es6.typed.int32-array');require('./modules/es6.typed.uint32-array');require('./modules/es6.typed.float32-array');require('./modules/es6.typed.float64-array');require('./modules/es6.reflect.apply');require('./modules/es6.reflect.construct');require('./modules/es6.reflect.define-property');require('./modules/es6.reflect.delete-property');require('./modules/es6.reflect.enumerate');require('./modules/es6.reflect.get');require('./modules/es6.reflect.get-own-property-descriptor');require('./modules/es6.reflect.get-prototype-of');require('./modules/es6.reflect.has');require('./modules/es6.reflect.is-extensible');require('./modules/es6.reflect.own-keys');require('./modules/es6.reflect.prevent-extensions');require('./modules/es6.reflect.set');require('./modules/es6.reflect.set-prototype-of');require('./modules/es7.array.includes');require('./modules/es7.string.at');require('./modules/es7.string.pad-start');require('./modules/es7.string.pad-end');require('./modules/es7.string.trim-left');require('./modules/es7.string.trim-right');require('./modules/es7.string.match-all');require('./modules/es7.symbol.async-iterator');require('./modules/es7.symbol.observable');require('./modules/es7.object.get-own-property-descriptors');require('./modules/es7.object.values');require('./modules/es7.object.entries');require('./modules/es7.object.define-getter');require('./modules/es7.object.define-setter');require('./modules/es7.object.lookup-getter');require('./modules/es7.object.lookup-setter');require('./modules/es7.map.to-json');require('./modules/es7.set.to-json');require('./modules/es7.system.global');require('./modules/es7.error.is-error');require('./modules/es7.math.iaddh');require('./modules/es7.math.isubh');require('./modules/es7.math.imulh');require('./modules/es7.math.umulh');require('./modules/es7.reflect.define-metadata');require('./modules/es7.reflect.delete-metadata');require('./modules/es7.reflect.get-metadata');require('./modules/es7.reflect.get-metadata-keys');require('./modules/es7.reflect.get-own-metadata');require('./modules/es7.reflect.get-own-metadata-keys');require('./modules/es7.reflect.has-metadata');require('./modules/es7.reflect.has-own-metadata');require('./modules/es7.reflect.metadata');require('./modules/es7.asap');require('./modules/es7.observable');require('./modules/web.timers');require('./modules/web.immediate');require('./modules/web.dom.iterable');module.exports=require('./modules/_core');},{"./modules/_core":32,"./modules/es6.array.copy-within":129,"./modules/es6.array.every":130,"./modules/es6.array.fill":131,"./modules/es6.array.filter":132,"./modules/es6.array.find":134,"./modules/es6.array.find-index":133,"./modules/es6.array.for-each":135,"./modules/es6.array.from":136,"./modules/es6.array.index-of":137,"./modules/es6.array.is-array":138,"./modules/es6.array.iterator":139,"./modules/es6.array.join":140,"./modules/es6.array.last-index-of":141,"./modules/es6.array.map":142,"./modules/es6.array.of":143,"./modules/es6.array.reduce":145,"./modules/es6.array.reduce-right":144,"./modules/es6.array.slice":146,"./modules/es6.array.some":147,"./modules/es6.array.sort":148,"./modules/es6.array.species":149,"./modules/es6.date.now":150,"./modules/es6.date.to-iso-string":151,"./modules/es6.date.to-json":152,"./modules/es6.date.to-primitive":153,"./modules/es6.date.to-string":154,"./modules/es6.function.bind":155,"./modules/es6.function.has-instance":156,"./modules/es6.function.name":157,"./modules/es6.map":158,"./modules/es6.math.acosh":159,"./modules/es6.math.asinh":160,"./modules/es6.math.atanh":161,"./modules/es6.math.cbrt":162,"./modules/es6.math.clz32":163,"./modules/es6.math.cosh":164,"./modules/es6.math.expm1":165,"./modules/es6.math.fround":166,"./modules/es6.math.hypot":167,"./modules/es6.math.imul":168,"./modules/es6.math.log10":169,"./modules/es6.math.log1p":170,"./modules/es6.math.log2":171,"./modules/es6.math.sign":172,"./modules/es6.math.sinh":173,"./modules/es6.math.tanh":174,"./modules/es6.math.trunc":175,"./modules/es6.number.constructor":176,"./modules/es6.number.epsilon":177,"./modules/es6.number.is-finite":178,"./modules/es6.number.is-integer":179,"./modules/es6.number.is-nan":180,"./modules/es6.number.is-safe-integer":181,"./modules/es6.number.max-safe-integer":182,"./modules/es6.number.min-safe-integer":183,"./modules/es6.number.parse-float":184,"./modules/es6.number.parse-int":185,"./modules/es6.number.to-fixed":186,"./modules/es6.number.to-precision":187,"./modules/es6.object.assign":188,"./modules/es6.object.create":189,"./modules/es6.object.define-properties":190,"./modules/es6.object.define-property":191,"./modules/es6.object.freeze":192,"./modules/es6.object.get-own-property-descriptor":193,"./modules/es6.object.get-own-property-names":194,"./modules/es6.object.get-prototype-of":195,"./modules/es6.object.is":199,"./modules/es6.object.is-extensible":196,"./modules/es6.object.is-frozen":197,"./modules/es6.object.is-sealed":198,"./modules/es6.object.keys":200,"./modules/es6.object.prevent-extensions":201,"./modules/es6.object.seal":202,"./modules/es6.object.set-prototype-of":203,"./modules/es6.object.to-string":204,"./modules/es6.parse-float":205,"./modules/es6.parse-int":206,"./modules/es6.promise":207,"./modules/es6.reflect.apply":208,"./modules/es6.reflect.construct":209,"./modules/es6.reflect.define-property":210,"./modules/es6.reflect.delete-property":211,"./modules/es6.reflect.enumerate":212,"./modules/es6.reflect.get":215,"./modules/es6.reflect.get-own-property-descriptor":213,"./modules/es6.reflect.get-prototype-of":214,"./modules/es6.reflect.has":216,"./modules/es6.reflect.is-extensible":217,"./modules/es6.reflect.own-keys":218,"./modules/es6.reflect.prevent-extensions":219,"./modules/es6.reflect.set":221,"./modules/es6.reflect.set-prototype-of":220,"./modules/es6.regexp.constructor":222,"./modules/es6.regexp.flags":223,"./modules/es6.regexp.match":224,"./modules/es6.regexp.replace":225,"./modules/es6.regexp.search":226,"./modules/es6.regexp.split":227,"./modules/es6.regexp.to-string":228,"./modules/es6.set":229,"./modules/es6.string.anchor":230,"./modules/es6.string.big":231,"./modules/es6.string.blink":232,"./modules/es6.string.bold":233,"./modules/es6.string.code-point-at":234,"./modules/es6.string.ends-with":235,"./modules/es6.string.fixed":236,"./modules/es6.string.fontcolor":237,"./modules/es6.string.fontsize":238,"./modules/es6.string.from-code-point":239,"./modules/es6.string.includes":240,"./modules/es6.string.italics":241,"./modules/es6.string.iterator":242,"./modules/es6.string.link":243,"./modules/es6.string.raw":244,"./modules/es6.string.repeat":245,"./modules/es6.string.small":246,"./modules/es6.string.starts-with":247,"./modules/es6.string.strike":248,"./modules/es6.string.sub":249,"./modules/es6.string.sup":250,"./modules/es6.string.trim":251,"./modules/es6.symbol":252,"./modules/es6.typed.array-buffer":253,"./modules/es6.typed.data-view":254,"./modules/es6.typed.float32-array":255,"./modules/es6.typed.float64-array":256,"./modules/es6.typed.int16-array":257,"./modules/es6.typed.int32-array":258,"./modules/es6.typed.int8-array":259,"./modules/es6.typed.uint16-array":260,"./modules/es6.typed.uint32-array":261,"./modules/es6.typed.uint8-array":262,"./modules/es6.typed.uint8-clamped-array":263,"./modules/es6.weak-map":264,"./modules/es6.weak-set":265,"./modules/es7.array.includes":266,"./modules/es7.asap":267,"./modules/es7.error.is-error":268,"./modules/es7.map.to-json":269,"./modules/es7.math.iaddh":270,"./modules/es7.math.imulh":271,"./modules/es7.math.isubh":272,"./modules/es7.math.umulh":273,"./modules/es7.object.define-getter":274,"./modules/es7.object.define-setter":275,"./modules/es7.object.entries":276,"./modules/es7.object.get-own-property-descriptors":277,"./modules/es7.object.lookup-getter":278,"./modules/es7.object.lookup-setter":279,"./modules/es7.object.values":280,"./modules/es7.observable":281,"./modules/es7.reflect.define-metadata":282,"./modules/es7.reflect.delete-metadata":283,"./modules/es7.reflect.get-metadata":285,"./modules/es7.reflect.get-metadata-keys":284,"./modules/es7.reflect.get-own-metadata":287,"./modules/es7.reflect.get-own-metadata-keys":286,"./modules/es7.reflect.has-metadata":288,"./modules/es7.reflect.has-own-metadata":289,"./modules/es7.reflect.metadata":290,"./modules/es7.set.to-json":291,"./modules/es7.string.at":292,"./modules/es7.string.match-all":293,"./modules/es7.string.pad-end":294,"./modules/es7.string.pad-start":295,"./modules/es7.string.trim-left":296,"./modules/es7.string.trim-right":297,"./modules/es7.symbol.async-iterator":298,"./modules/es7.symbol.observable":299,"./modules/es7.system.global":300,"./modules/web.dom.iterable":301,"./modules/web.immediate":302,"./modules/web.timers":303}],305:[function(require,module,exports){(function(Buffer){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg){if(Array.isArray){return Array.isArray(arg);}return objectToString(arg)==='[object Array]';}exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean';}exports.isBoolean=isBoolean;function isNull(arg){return arg===null;}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null;}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number';}exports.isNumber=isNumber;function isString(arg){return typeof arg==='string';}exports.isString=isString;function isSymbol(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol';}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0;}exports.isUndefined=isUndefined;function isRegExp(re){return objectToString(re)==='[object RegExp]';}exports.isRegExp=isRegExp;function isObject(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&arg!==null;}exports.isObject=isObject;function isDate(d){return objectToString(d)==='[object Date]';}exports.isDate=isDate;function isError(e){return objectToString(e)==='[object Error]'||e instanceof Error;}exports.isError=isError;function isFunction(arg){return typeof arg==='function';}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol'||// ES6 symbol
typeof arg==='undefined';}exports.isPrimitive=isPrimitive;exports.isBuffer=Buffer.isBuffer;function objectToString(o){return Object.prototype.toString.call(o);}}).call(this,{"isBuffer":require("../../../../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js")});},{"../../../../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js":410}],306:[function(require,module,exports){/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 *//*global window, navigator, document, require, process, module */(function(app){'use strict';var namespace='cuid',c=0,blockSize=4,base=36,discreteValues=Math.pow(base,blockSize),pad=function pad(num,size){var s="000000000"+num;return s.substr(s.length-size);},randomBlock=function randomBlock(){return pad((Math.random()*discreteValues<<0).toString(base),blockSize);},safeCounter=function safeCounter(){c=c<discreteValues?c:0;c++;// this is not subliminal
return c-1;},api=function cuid(){// Starting with a lowercase letter makes
// it HTML element ID friendly.
var letter='c',// hard-coded allows for sequential access
// timestamp
// warning: this exposes the exact date and time
// that the uid was created.
timestamp=new Date().getTime().toString(base),// Prevent same-machine collisions.
counter,// A few chars to generate distinct ids for different
// clients (so different computers are far less
// likely to generate the same id)
fingerprint=api.fingerprint(),// Grab some more chars from Math.random()
random=randomBlock()+randomBlock();counter=pad(safeCounter().toString(base),blockSize);return letter+timestamp+counter+fingerprint+random;};api.slug=function slug(){var date=new Date().getTime().toString(36),counter,print=api.fingerprint().slice(0,1)+api.fingerprint().slice(-1),random=randomBlock().slice(-2);counter=safeCounter().toString(36).slice(-4);return date.slice(-2)+counter+print+random;};api.globalCount=function globalCount(){// We want to cache the results of this
var cache=function calc(){var i,count=0;for(i in window){count++;}return count;}();api.globalCount=function(){return cache;};return cache;};api.fingerprint=function browserPrint(){return pad((navigator.mimeTypes.length+navigator.userAgent.length).toString(36)+api.globalCount().toString(36),4);};// don't change anything from here down.
if(app.register){app.register(namespace,api);}else if(typeof module!=='undefined'){module.exports=api;}else{app[namespace]=api;}})(this.applitude||this);},{}],307:[function(require,module,exports){(function(process){/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=require('./debug');exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
 * Colors.
 */exports.colors=['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson'];/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */function useColors(){// NB: In an Electron preload script, document will be defined but not fully
// initialized. Since we know we're in Chrome, we'll just detect this case
// explicitly
if(typeof window!=='undefined'&&window&&typeof window.process!=='undefined'&&window.process.type==='renderer'){return true;}// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&document&&'WebkitAppearance'in document.documentElement.style||// is firebug? http://stackoverflow.com/a/398120/376773
typeof window!=='undefined'&&window&&window.console&&(console.firebug||console.exception&&console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
typeof navigator!=='undefined'&&navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||// double check webkit in userAgent just in case we are in a worker
typeof navigator!=='undefined'&&navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);}/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */function formatArgs(args){var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return;var c='color: '+this.color;args.splice(1,0,c,'color: inherit');// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-zA-Z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);}/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */function load(){try{return exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(typeof process!=='undefined'&&'env'in process){return process.env.DEBUG;}}/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */exports.enable(load());/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */function localstorage(){try{return window.localStorage;}catch(e){}}}).call(this,require('_process'));},{"./debug":308,"_process":413}],308:[function(require,module,exports){/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=createDebug.debug=createDebug['default']=createDebug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=require('ms');/**
 * The currently active debug mode names, and names to skip.
 */exports.names=[];exports.skips=[];/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */exports.formatters={};/**
 * Previous log timestamp.
 */var prevTime;/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */function selectColor(namespace){var hash=0,i;for(i in namespace){hash=(hash<<5)-hash+namespace.charCodeAt(i);hash|=0;// Convert to 32bit integer
}return exports.colors[Math.abs(hash)%exports.colors.length];}/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */function createDebug(namespace){function debug(){// disabled?
if(!debug.enabled)return;var self=debug;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// turn the `arguments` into a proper Array
var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %O
args.unshift('%O');}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-zA-Z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting (colors, etc.)
exports.formatArgs.call(self,args);var logFn=debug.log||exports.log||console.log.bind(console);logFn.apply(self,args);}debug.namespace=namespace;debug.enabled=exports.enabled(namespace);debug.useColors=exports.useColors();debug.color=selectColor(namespace);// env-specific initialization logic for debug instances
if('function'===typeof exports.init){exports.init(debug);}return debug;}/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */function enable(namespaces){exports.save(namespaces);exports.names=[];exports.skips=[];var split=(namespaces||'').split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}}/**
 * Disable debug output.
 *
 * @api public
 */function disable(){exports.enable('');}/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}},{"ms":335}],309:[function(require,module,exports){module.exports=require('./lib/index');},{"./lib/index":310}],310:[function(require,module,exports){module.exports=require('./socket');/**
 * Exports parser
 *
 * @api public
 *
 */module.exports.parser=require('engine.io-parser');},{"./socket":311,"engine.io-parser":321}],311:[function(require,module,exports){(function(global){/**
 * Module dependencies.
 */var transports=require('./transports/index');var Emitter=require('component-emitter');var debug=require('debug')('engine.io-client:socket');var index=require('indexof');var parser=require('engine.io-parser');var parseuri=require('parseuri');var parsejson=require('parsejson');var parseqs=require('parseqs');/**
 * Module exports.
 */module.exports=Socket;/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts=opts||{};if(uri&&'object'===(typeof uri==="undefined"?"undefined":_typeof(uri))){opts=uri;uri=null;}if(uri){uri=parseuri(uri);opts.hostname=uri.host;opts.secure=uri.protocol==='https'||uri.protocol==='wss';opts.port=uri.port;if(uri.query)opts.query=uri.query;}else if(opts.host){opts.hostname=parseuri(opts.host).host;}this.secure=null!=opts.secure?opts.secure:global.location&&'https:'===location.protocol;if(opts.hostname&&!opts.port){// if no port is specified manually, use the protocol default
opts.port=this.secure?'443':'80';}this.agent=opts.agent||false;this.hostname=opts.hostname||(global.location?location.hostname:'localhost');this.port=opts.port||(global.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};if('string'===typeof this.query)this.query=parseqs.decode(this.query);this.upgrade=false!==opts.upgrade;this.path=(opts.path||'/engine.io').replace(/\/$/,'')+'/';this.forceJSONP=!!opts.forceJSONP;this.jsonp=false!==opts.jsonp;this.forceBase64=!!opts.forceBase64;this.enablesXDR=!!opts.enablesXDR;this.timestampParam=opts.timestampParam||'t';this.timestampRequests=opts.timestampRequests;this.transports=opts.transports||['polling','websocket'];this.readyState='';this.writeBuffer=[];this.prevBufferLen=0;this.policyPort=opts.policyPort||843;this.rememberUpgrade=opts.rememberUpgrade||false;this.binaryType=null;this.onlyBinaryUpgrades=opts.onlyBinaryUpgrades;this.perMessageDeflate=false!==opts.perMessageDeflate?opts.perMessageDeflate||{}:false;if(true===this.perMessageDeflate)this.perMessageDeflate={};if(this.perMessageDeflate&&null==this.perMessageDeflate.threshold){this.perMessageDeflate.threshold=1024;}// SSL options for Node.js client
this.pfx=opts.pfx||null;this.key=opts.key||null;this.passphrase=opts.passphrase||null;this.cert=opts.cert||null;this.ca=opts.ca||null;this.ciphers=opts.ciphers||null;this.rejectUnauthorized=opts.rejectUnauthorized===undefined?null:opts.rejectUnauthorized;this.forceNode=!!opts.forceNode;// other options for Node.js client
var freeGlobal=(typeof global==="undefined"?"undefined":_typeof(global))==='object'&&global;if(freeGlobal.global===freeGlobal){if(opts.extraHeaders&&Object.keys(opts.extraHeaders).length>0){this.extraHeaders=opts.extraHeaders;}if(opts.localAddress){this.localAddress=opts.localAddress;}}// set on handshake
this.id=null;this.upgrades=null;this.pingInterval=null;this.pingTimeout=null;// set on heartbeat
this.pingIntervalTimer=null;this.pingTimeoutTimer=null;this.open();}Socket.priorWebsocketSuccess=false;/**
 * Mix in `Emitter`.
 */Emitter(Socket.prototype);/**
 * Protocol version.
 *
 * @api public
 */Socket.protocol=parser.protocol;// this is an int
/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */Socket.Socket=Socket;Socket.Transport=require('./transport');Socket.transports=require('./transports/index');Socket.parser=require('engine.io-parser');/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */Socket.prototype.createTransport=function(name){debug('creating transport "%s"',name);var query=clone(this.query);// append engine.io protocol identifier
query.EIO=parser.protocol;// transport name
query.transport=name;// session id if we already have one
if(this.id)query.sid=this.id;var transport=new transports[name]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized,perMessageDeflate:this.perMessageDeflate,extraHeaders:this.extraHeaders,forceNode:this.forceNode,localAddress:this.localAddress});return transport;};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i];}}return o;}/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */Socket.prototype.open=function(){var transport;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf('websocket')!==-1){transport='websocket';}else if(0===this.transports.length){// Emit error on next tick so it can be listened to
var self=this;setTimeout(function(){self.emit('error','No transports available');},0);return;}else{transport=this.transports[0];}this.readyState='opening';// Retry with the next transport if the transport is disabled (jsonp: false)
try{transport=this.createTransport(transport);}catch(e){this.transports.shift();this.open();return;}transport.open();this.setTransport(transport);};/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */Socket.prototype.setTransport=function(transport){debug('setting transport %s',transport.name);var self=this;if(this.transport){debug('clearing existing transport %s',this.transport.name);this.transport.removeAllListeners();}// set up transport
this.transport=transport;// set up transport listeners
transport.on('drain',function(){self.onDrain();}).on('packet',function(packet){self.onPacket(packet);}).on('error',function(e){self.onError(e);}).on('close',function(){self.onClose('transport close');});};/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */Socket.prototype.probe=function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1});var failed=false;var self=this;Socket.priorWebsocketSuccess=false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary&&self.transport.supportsBinary;failed=failed||upgradeLosesBinary;}if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:'ping',data:'probe'}]);transport.once('packet',function(msg){if(failed)return;if('pong'===msg.type&&'probe'===msg.data){debug('probe transport "%s" pong',name);self.upgrading=true;self.emit('upgrading',transport);if(!transport)return;Socket.priorWebsocketSuccess='websocket'===transport.name;debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if('closed'===self.readyState)return;debug('changing transport and sending upgrade packet');cleanup();self.setTransport(transport);transport.send([{type:'upgrade'}]);self.emit('upgrade',transport);transport=null;self.upgrading=false;self.flush();});}else{debug('probe transport "%s" failed',name);var err=new Error('probe error');err.transport=transport.name;self.emit('upgradeError',err);}});}function freezeTransport(){if(failed)return;// Any callback called by transport should be ignored since now
failed=true;cleanup();transport.close();transport=null;}// Handle any error that happens while probing
function onerror(err){var error=new Error('probe error: '+err);error.transport=transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s',name,err);self.emit('upgradeError',error);}function onTransportClose(){onerror('transport closed');}// When the socket is closed while we're probing
function onclose(){onerror('socket closed');}// When the socket is upgraded while we're probing
function onupgrade(to){if(transport&&to.name!==transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport();}}// Remove all listeners on the transport and on self
function cleanup(){transport.removeListener('open',onTransportOpen);transport.removeListener('error',onerror);transport.removeListener('close',onTransportClose);self.removeListener('close',onclose);self.removeListener('upgrading',onupgrade);}transport.once('open',onTransportOpen);transport.once('error',onerror);transport.once('close',onTransportClose);this.once('close',onclose);this.once('upgrading',onupgrade);transport.open();};/**
 * Called when connection is deemed open.
 *
 * @api public
 */Socket.prototype.onOpen=function(){debug('socket open');this.readyState='open';Socket.priorWebsocketSuccess='websocket'===this.transport.name;this.emit('open');this.flush();// we check for `readyState` in case an `open`
// listener already closed the socket
if('open'===this.readyState&&this.upgrade&&this.transport.pause){debug('starting upgrade probes');for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i]);}}};/**
 * Handles a packet.
 *
 * @api private
 */Socket.prototype.onPacket=function(packet){if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit('packet',packet);// Socket is live - any packet counts
this.emit('heartbeat');switch(packet.type){case'open':this.onHandshake(parsejson(packet.data));break;case'pong':this.setPing();this.emit('pong');break;case'error':var err=new Error('server error');err.code=packet.data;this.onError(err);break;case'message':this.emit('data',packet.data);this.emit('message',packet.data);break;}}else{debug('packet received with socket readyState "%s"',this.readyState);}};/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */Socket.prototype.onHandshake=function(data){this.emit('handshake',data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();// In case open handler closes socket
if('closed'===this.readyState)return;this.setPing();// Prolong liveness of socket on heartbeat
this.removeListener('heartbeat',this.onHeartbeat);this.on('heartbeat',this.onHeartbeat);};/**
 * Resets ping timeout.
 *
 * @api private
 */Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if('closed'===self.readyState)return;self.onClose('ping timeout');},timeout||self.pingInterval+self.pingTimeout);};/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */Socket.prototype.setPing=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug('writing ping packet - expecting pong within %sms',self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout);},self.pingInterval);};/**
* Sends a ping packet.
*
* @api private
*/Socket.prototype.ping=function(){var self=this;this.sendPacket('ping',function(){self.emit('ping');});};/**
 * Called on `drain` event
 *
 * @api private
 */Socket.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen);// setting prevBufferLen = 0 is very important
// for example, when upgrading, upgrade packet is sent over,
// and a nonzero prevBufferLen could cause problems on `drain`
this.prevBufferLen=0;if(0===this.writeBuffer.length){this.emit('drain');}else{this.flush();}};/**
 * Flush write buffers.
 *
 * @api private
 */Socket.prototype.flush=function(){if('closed'!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug('flushing %d packets in socket',this.writeBuffer.length);this.transport.send(this.writeBuffer);// keep track of current length of writeBuffer
// splice writeBuffer and callbackBuffer on `drain`
this.prevBufferLen=this.writeBuffer.length;this.emit('flush');}};/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */Socket.prototype.write=Socket.prototype.send=function(msg,options,fn){this.sendPacket('message',msg,options,fn);return this;};/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */Socket.prototype.sendPacket=function(type,data,options,fn){if('function'===typeof data){fn=data;data=undefined;}if('function'===typeof options){fn=options;options=null;}if('closing'===this.readyState||'closed'===this.readyState){return;}options=options||{};options.compress=false!==options.compress;var packet={type:type,data:data,options:options};this.emit('packetCreate',packet);this.writeBuffer.push(packet);if(fn)this.once('flush',fn);this.flush();};/**
 * Closes the connection.
 *
 * @api private
 */Socket.prototype.close=function(){if('opening'===this.readyState||'open'===this.readyState){this.readyState='closing';var self=this;if(this.writeBuffer.length){this.once('drain',function(){if(this.upgrading){waitForUpgrade();}else{close();}});}else if(this.upgrading){waitForUpgrade();}else{close();}}function close(){self.onClose('forced close');debug('socket closing - telling transport to close');self.transport.close();}function cleanupAndClose(){self.removeListener('upgrade',cleanupAndClose);self.removeListener('upgradeError',cleanupAndClose);close();}function waitForUpgrade(){// wait for upgrade to finish since we can't send packets while pausing a transport
self.once('upgrade',cleanupAndClose);self.once('upgradeError',cleanupAndClose);}return this;};/**
 * Called upon transport error
 *
 * @api private
 */Socket.prototype.onError=function(err){debug('socket error %j',err);Socket.priorWebsocketSuccess=false;this.emit('error',err);this.onClose('transport error',err);};/**
 * Called upon transport close.
 *
 * @api private
 */Socket.prototype.onClose=function(reason,desc){if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState){debug('socket close with reason: "%s"',reason);var self=this;// clear timers
clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);// stop event from firing again for transport
this.transport.removeAllListeners('close');// ensure transport won't stay open
this.transport.close();// ignore further transport communication
this.transport.removeAllListeners();// set ready state
this.readyState='closed';// clear session id
this.id=null;// emit close event
this.emit('close',reason,desc);// clean buffers after, so users can still
// grab the buffers on `close` event
self.writeBuffer=[];self.prevBufferLen=0;}};/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */Socket.prototype.filterUpgrades=function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i<j;i++){if(~index(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i]);}return filteredUpgrades;};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./transport":312,"./transports/index":313,"component-emitter":9,"debug":319,"engine.io-parser":321,"indexof":328,"parsejson":347,"parseqs":348,"parseuri":349}],312:[function(require,module,exports){/**
 * Module dependencies.
 */var parser=require('engine.io-parser');var Emitter=require('component-emitter');/**
 * Module exports.
 */module.exports=Transport;/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */function Transport(opts){this.path=opts.path;this.hostname=opts.hostname;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState='';this.agent=opts.agent||false;this.socket=opts.socket;this.enablesXDR=opts.enablesXDR;// SSL options for Node.js client
this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;this.forceNode=opts.forceNode;// other options for Node.js client
this.extraHeaders=opts.extraHeaders;this.localAddress=opts.localAddress;}/**
 * Mix in `Emitter`.
 */Emitter(Transport.prototype);/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type='TransportError';err.description=desc;this.emit('error',err);return this;};/**
 * Opens the transport.
 *
 * @api public
 */Transport.prototype.open=function(){if('closed'===this.readyState||''===this.readyState){this.readyState='opening';this.doOpen();}return this;};/**
 * Closes the transport.
 *
 * @api private
 */Transport.prototype.close=function(){if('opening'===this.readyState||'open'===this.readyState){this.doClose();this.onClose();}return this;};/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */Transport.prototype.send=function(packets){if('open'===this.readyState){this.write(packets);}else{throw new Error('Transport not open');}};/**
 * Called upon open
 *
 * @api private
 */Transport.prototype.onOpen=function(){this.readyState='open';this.writable=true;this.emit('open');};/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */Transport.prototype.onData=function(data){var packet=parser.decodePacket(data,this.socket.binaryType);this.onPacket(packet);};/**
 * Called with a decoded packet.
 */Transport.prototype.onPacket=function(packet){this.emit('packet',packet);};/**
 * Called upon close.
 *
 * @api private
 */Transport.prototype.onClose=function(){this.readyState='closed';this.emit('close');};},{"component-emitter":9,"engine.io-parser":321}],313:[function(require,module,exports){(function(global){/**
 * Module dependencies
 */var XMLHttpRequest=require('xmlhttprequest-ssl');var XHR=require('./polling-xhr');var JSONP=require('./polling-jsonp');var websocket=require('./websocket');/**
 * Export transports.
 */exports.polling=polling;exports.websocket=websocket;/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */function polling(opts){var xhr;var xd=false;var xs=false;var jsonp=false!==opts.jsonp;if(global.location){var isSSL='https:'===location.protocol;var port=location.port;// some user agents have empty `location.port`
if(!port){port=isSSL?443:80;}xd=opts.hostname!==location.hostname||port!==opts.port;xs=opts.secure!==isSSL;}opts.xdomain=xd;opts.xscheme=xs;xhr=new XMLHttpRequest(opts);if('open'in xhr&&!opts.forceJSONP){return new XHR(opts);}else{if(!jsonp)throw new Error('JSONP disabled');return new JSONP(opts);}}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./polling-jsonp":314,"./polling-xhr":315,"./websocket":317,"xmlhttprequest-ssl":318}],314:[function(require,module,exports){(function(global){/**
 * Module requirements.
 */var Polling=require('./polling');var inherit=require('component-inherit');/**
 * Module exports.
 */module.exports=JSONPPolling;/**
 * Cached regular expressions.
 */var rNewline=/\n/g;var rEscapedNewline=/\\n/g;/**
 * Global JSONP callbacks.
 */var callbacks;/**
 * Noop.
 */function empty(){}/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */function JSONPPolling(opts){Polling.call(this,opts);this.query=this.query||{};// define global callbacks array if not present
// we do this here (lazily) to avoid unneeded global pollution
if(!callbacks){// we need to consider multiple engines in the same page
if(!global.___eio)global.___eio=[];callbacks=global.___eio;}// callback identifier
this.index=callbacks.length;// add callback to jsonp global
var self=this;callbacks.push(function(msg){self.onData(msg);});// append to query string
this.query.j=this.index;// prevent spurious errors from being emitted when the window is unloaded
if(global.document&&global.addEventListener){global.addEventListener('beforeunload',function(){if(self.script)self.script.onerror=empty;},false);}}/**
 * Inherits from Polling.
 */inherit(JSONPPolling,Polling);/*
 * JSONP only supports binary as base64 encoded strings
 */JSONPPolling.prototype.supportsBinary=false;/**
 * Closes the socket.
 *
 * @api private
 */JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null;}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null;this.iframe=null;}Polling.prototype.doClose.call(this);};/**
 * Starts a poll cycle.
 *
 * @api private
 */JSONPPolling.prototype.doPoll=function(){var self=this;var script=document.createElement('script');if(this.script){this.script.parentNode.removeChild(this.script);this.script=null;}script.async=true;script.src=this.uri();script.onerror=function(e){self.onError('jsonp poll error',e);};var insertAt=document.getElementsByTagName('script')[0];if(insertAt){insertAt.parentNode.insertBefore(script,insertAt);}else{(document.head||document.body).appendChild(script);}this.script=script;var isUAgecko='undefined'!==typeof navigator&&/gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement('iframe');document.body.appendChild(iframe);document.body.removeChild(iframe);},100);}};/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement('form');var area=document.createElement('textarea');var id=this.iframeId='eio_iframe_'+this.index;var iframe;form.className='socketio';form.style.position='absolute';form.style.top='-1000px';form.style.left='-1000px';form.target=id;form.method='POST';form.setAttribute('accept-charset','utf-8');area.name='d';form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area;}this.form.action=this.uri();function complete(){initIframe();fn();}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe);}catch(e){self.onError('jsonp polling iframe removal error',e);}}try{// ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
var html='<iframe src="javascript:0" name="'+self.iframeId+'">';iframe=document.createElement(html);}catch(e){iframe=document.createElement('iframe');iframe.name=self.iframeId;iframe.src='javascript:0';}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe;}initIframe();// escape \n to prevent it from being converted into \r\n by some UAs
// double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
data=data.replace(rEscapedNewline,'\\\n');this.area.value=data.replace(rNewline,'\\n');try{this.form.submit();}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState==='complete'){complete();}};}else{this.iframe.onload=complete;}};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./polling":316,"component-inherit":10}],315:[function(require,module,exports){(function(global){/**
 * Module requirements.
 */var XMLHttpRequest=require('xmlhttprequest-ssl');var Polling=require('./polling');var Emitter=require('component-emitter');var inherit=require('component-inherit');var debug=require('debug')('engine.io-client:polling-xhr');/**
 * Module exports.
 */module.exports=XHR;module.exports.Request=Request;/**
 * Empty function
 */function empty(){}/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */function XHR(opts){Polling.call(this,opts);this.requestTimeout=opts.requestTimeout;if(global.location){var isSSL='https:'===location.protocol;var port=location.port;// some user agents have empty `location.port`
if(!port){port=isSSL?443:80;}this.xd=opts.hostname!==global.location.hostname||port!==opts.port;this.xs=opts.secure!==isSSL;}else{this.extraHeaders=opts.extraHeaders;}}/**
 * Inherits from Polling.
 */inherit(XHR,Polling);/**
 * XHR supports binary
 */XHR.prototype.supportsBinary=true;/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;opts.xs=this.xs;opts.agent=this.agent||false;opts.supportsBinary=this.supportsBinary;opts.enablesXDR=this.enablesXDR;// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;opts.requestTimeout=this.requestTimeout;// other options for Node.js client
opts.extraHeaders=this.extraHeaders;return new Request(opts);};/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */XHR.prototype.doWrite=function(data,fn){var isBinary=typeof data!=='string'&&data!==undefined;var req=this.request({method:'POST',data:data,isBinary:isBinary});var self=this;req.on('success',fn);req.on('error',function(err){self.onError('xhr post error',err);});this.sendXhr=req;};/**
 * Starts a poll cycle.
 *
 * @api private
 */XHR.prototype.doPoll=function(){debug('xhr poll');var req=this.request();var self=this;req.on('data',function(data){self.onData(data);});req.on('error',function(err){self.onError('xhr poll error',err);});this.pollXhr=req;};/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */function Request(opts){this.method=opts.method||'GET';this.uri=opts.uri;this.xd=!!opts.xd;this.xs=!!opts.xs;this.async=false!==opts.async;this.data=undefined!==opts.data?opts.data:null;this.agent=opts.agent;this.isBinary=opts.isBinary;this.supportsBinary=opts.supportsBinary;this.enablesXDR=opts.enablesXDR;this.requestTimeout=opts.requestTimeout;// SSL options for Node.js client
this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;// other options for Node.js client
this.extraHeaders=opts.extraHeaders;this.create();}/**
 * Mix in `Emitter`.
 */Emitter(Request.prototype);/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */Request.prototype.create=function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;var xhr=this.xhr=new XMLHttpRequest(opts);var self=this;try{debug('xhr open %s: %s',this.method,this.uri);xhr.open(this.method,this.uri,this.async);try{if(this.extraHeaders){xhr.setDisableHeaderCheck(true);for(var i in this.extraHeaders){if(this.extraHeaders.hasOwnProperty(i)){xhr.setRequestHeader(i,this.extraHeaders[i]);}}}}catch(e){}if(this.supportsBinary){// This has to be done after open because Firefox is stupid
// http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
xhr.responseType='arraybuffer';}if('POST'===this.method){try{if(this.isBinary){xhr.setRequestHeader('Content-type','application/octet-stream');}else{xhr.setRequestHeader('Content-type','text/plain;charset=UTF-8');}}catch(e){}}try{xhr.setRequestHeader('Accept','*/*');}catch(e){}// ie6 check
if('withCredentials'in xhr){xhr.withCredentials=true;}if(this.requestTimeout){xhr.timeout=this.requestTimeout;}if(this.hasXDR()){xhr.onload=function(){self.onLoad();};xhr.onerror=function(){self.onError(xhr.responseText);};}else{xhr.onreadystatechange=function(){if(4!==xhr.readyState)return;if(200===xhr.status||1223===xhr.status){self.onLoad();}else{// make sure the `error` event handler that's user-set
// does not throw in the same tick and gets caught here
setTimeout(function(){self.onError(xhr.status);},0);}};}debug('xhr data %s',this.data);xhr.send(this.data);}catch(e){// Need to defer since .create() is called directly fhrom the constructor
// and thus the 'error' event can only be only bound *after* this exception
// occurs.  Therefore, also, we cannot throw here at all.
setTimeout(function(){self.onError(e);},0);return;}if(global.document){this.index=Request.requestsCount++;Request.requests[this.index]=this;}};/**
 * Called upon successful response.
 *
 * @api private
 */Request.prototype.onSuccess=function(){this.emit('success');this.cleanup();};/**
 * Called if we have data.
 *
 * @api private
 */Request.prototype.onData=function(data){this.emit('data',data);this.onSuccess();};/**
 * Called upon error.
 *
 * @api private
 */Request.prototype.onError=function(err){this.emit('error',err);this.cleanup(true);};/**
 * Cleans up house.
 *
 * @api private
 */Request.prototype.cleanup=function(fromError){if('undefined'===typeof this.xhr||null===this.xhr){return;}// xmlhttprequest
if(this.hasXDR()){this.xhr.onload=this.xhr.onerror=empty;}else{this.xhr.onreadystatechange=empty;}if(fromError){try{this.xhr.abort();}catch(e){}}if(global.document){delete Request.requests[this.index];}this.xhr=null;};/**
 * Called upon load.
 *
 * @api private
 */Request.prototype.onLoad=function(){var data;try{var contentType;try{contentType=this.xhr.getResponseHeader('Content-Type').split(';')[0];}catch(e){}if(contentType==='application/octet-stream'){data=this.xhr.response||this.xhr.responseText;}else{if(!this.supportsBinary){data=this.xhr.responseText;}else{try{data=String.fromCharCode.apply(null,new Uint8Array(this.xhr.response));}catch(e){var ui8Arr=new Uint8Array(this.xhr.response);var dataArray=[];for(var idx=0,length=ui8Arr.length;idx<length;idx++){dataArray.push(ui8Arr[idx]);}data=String.fromCharCode.apply(null,dataArray);}}}}catch(e){this.onError(e);}if(null!=data){this.onData(data);}};/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */Request.prototype.hasXDR=function(){return'undefined'!==typeof global.XDomainRequest&&!this.xs&&this.enablesXDR;};/**
 * Aborts the request.
 *
 * @api public
 */Request.prototype.abort=function(){this.cleanup();};/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */Request.requestsCount=0;Request.requests={};if(global.document){if(global.attachEvent){global.attachEvent('onunload',unloadHandler);}else if(global.addEventListener){global.addEventListener('beforeunload',unloadHandler,false);}}function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort();}}}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./polling":316,"component-emitter":9,"component-inherit":10,"debug":319,"xmlhttprequest-ssl":318}],316:[function(require,module,exports){/**
 * Module dependencies.
 */var Transport=require('../transport');var parseqs=require('parseqs');var parser=require('engine.io-parser');var inherit=require('component-inherit');var yeast=require('yeast');var debug=require('debug')('engine.io-client:polling');/**
 * Module exports.
 */module.exports=Polling;/**
 * Is XHR2 supported?
 */var hasXHR2=function(){var XMLHttpRequest=require('xmlhttprequest-ssl');var xhr=new XMLHttpRequest({xdomain:false});return null!=xhr.responseType;}();/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */function Polling(opts){var forceBase64=opts&&opts.forceBase64;if(!hasXHR2||forceBase64){this.supportsBinary=false;}Transport.call(this,opts);}/**
 * Inherits from Transport.
 */inherit(Polling,Transport);/**
 * Transport name.
 */Polling.prototype.name='polling';/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */Polling.prototype.doOpen=function(){this.poll();};/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */Polling.prototype.pause=function(onPause){var self=this;this.readyState='pausing';function pause(){debug('paused');self.readyState='paused';onPause();}if(this.polling||!this.writable){var total=0;if(this.polling){debug('we are currently polling - waiting to pause');total++;this.once('pollComplete',function(){debug('pre-pause polling complete');--total||pause();});}if(!this.writable){debug('we are currently writing - waiting to pause');total++;this.once('drain',function(){debug('pre-pause writing complete');--total||pause();});}}else{pause();}};/**
 * Starts polling cycle.
 *
 * @api public
 */Polling.prototype.poll=function(){debug('polling');this.polling=true;this.doPoll();this.emit('poll');};/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */Polling.prototype.onData=function(data){var self=this;debug('polling got data %s',data);var callback=function callback(packet,index,total){// if its the first message we consider the transport open
if('opening'===self.readyState){self.onOpen();}// if its a close packet, we close the ongoing requests
if('close'===packet.type){self.onClose();return false;}// otherwise bypass onData and handle the message
self.onPacket(packet);};// decode payload
parser.decodePayload(data,this.socket.binaryType,callback);// if an event did not trigger closing
if('closed'!==this.readyState){// if we got data we're not polling
this.polling=false;this.emit('pollComplete');if('open'===this.readyState){this.poll();}else{debug('ignoring poll - transport state "%s"',this.readyState);}}};/**
 * For polling, send a close packet.
 *
 * @api private
 */Polling.prototype.doClose=function(){var self=this;function close(){debug('writing close packet');self.write([{type:'close'}]);}if('open'===this.readyState){debug('transport open - closing');close();}else{// in case we're trying to close while
// handshaking is in progress (GH-164)
debug('transport not open - deferring close');this.once('open',close);}};/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */Polling.prototype.write=function(packets){var self=this;this.writable=false;var callbackfn=function callbackfn(){self.writable=true;self.emit('drain');};parser.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn);});};/**
 * Generates uri for connection.
 *
 * @api private
 */Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?'https':'http';var port='';// cache busting is forced
if(false!==this.timestampRequests){query[this.timestampParam]=yeast();}if(!this.supportsBinary&&!query.sid){query.b64=1;}query=parseqs.encode(query);// avoid port if default for schema
if(this.port&&('https'===schema&&Number(this.port)!==443||'http'===schema&&Number(this.port)!==80)){port=':'+this.port;}// prepend ? to query
if(query.length){query='?'+query;}var ipv6=this.hostname.indexOf(':')!==-1;return schema+'://'+(ipv6?'['+this.hostname+']':this.hostname)+port+this.path+query;};},{"../transport":312,"component-inherit":10,"debug":319,"engine.io-parser":321,"parseqs":348,"xmlhttprequest-ssl":318,"yeast":390}],317:[function(require,module,exports){(function(global){/**
 * Module dependencies.
 */var Transport=require('../transport');var parser=require('engine.io-parser');var parseqs=require('parseqs');var inherit=require('component-inherit');var yeast=require('yeast');var debug=require('debug')('engine.io-client:websocket');var BrowserWebSocket=global.WebSocket||global.MozWebSocket;var NodeWebSocket;if(typeof window==='undefined'){try{NodeWebSocket=require('ws');}catch(e){}}/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */var WebSocket=BrowserWebSocket;if(!WebSocket&&typeof window==='undefined'){WebSocket=NodeWebSocket;}/**
 * Module exports.
 */module.exports=WS;/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */function WS(opts){var forceBase64=opts&&opts.forceBase64;if(forceBase64){this.supportsBinary=false;}this.perMessageDeflate=opts.perMessageDeflate;this.usingBrowserWebSocket=BrowserWebSocket&&!opts.forceNode;if(!this.usingBrowserWebSocket){WebSocket=NodeWebSocket;}Transport.call(this,opts);}/**
 * Inherits from Transport.
 */inherit(WS,Transport);/**
 * Transport name.
 *
 * @api public
 */WS.prototype.name='websocket';/*
 * WebSockets support binary
 */WS.prototype.supportsBinary=true;/**
 * Opens socket.
 *
 * @api private
 */WS.prototype.doOpen=function(){if(!this.check()){// let probe timeout
return;}var uri=this.uri();var protocols=void 0;var opts={agent:this.agent,perMessageDeflate:this.perMessageDeflate};// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;if(this.extraHeaders){opts.headers=this.extraHeaders;}if(this.localAddress){opts.localAddress=this.localAddress;}try{this.ws=this.usingBrowserWebSocket?new WebSocket(uri):new WebSocket(uri,protocols,opts);}catch(err){return this.emit('error',err);}if(this.ws.binaryType===undefined){this.supportsBinary=false;}if(this.ws.supports&&this.ws.supports.binary){this.supportsBinary=true;this.ws.binaryType='nodebuffer';}else{this.ws.binaryType='arraybuffer';}this.addEventListeners();};/**
 * Adds event listeners to the socket
 *
 * @api private
 */WS.prototype.addEventListeners=function(){var self=this;this.ws.onopen=function(){self.onOpen();};this.ws.onclose=function(){self.onClose();};this.ws.onmessage=function(ev){self.onData(ev.data);};this.ws.onerror=function(e){self.onError('websocket error',e);};};/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */WS.prototype.write=function(packets){var self=this;this.writable=false;// encodePacket efficient as it uses WS framing
// no need for encodePayload
var total=packets.length;for(var i=0,l=total;i<l;i++){(function(packet){parser.encodePacket(packet,self.supportsBinary,function(data){if(!self.usingBrowserWebSocket){// always create a new object (GH-437)
var opts={};if(packet.options){opts.compress=packet.options.compress;}if(self.perMessageDeflate){var len='string'===typeof data?global.Buffer.byteLength(data):data.length;if(len<self.perMessageDeflate.threshold){opts.compress=false;}}}// Sometimes the websocket has already been closed but the browser didn't
// have a chance of informing us about it yet, in that case send will
// throw an error
try{if(self.usingBrowserWebSocket){// TypeError is thrown when passing the second argument on Safari
self.ws.send(data);}else{self.ws.send(data,opts);}}catch(e){debug('websocket closed before onclose event');}--total||done();});})(packets[i]);}function done(){self.emit('flush');// fake drain
// defer to next tick to allow Socket to clear writeBuffer
setTimeout(function(){self.writable=true;self.emit('drain');},0);}};/**
 * Called upon close
 *
 * @api private
 */WS.prototype.onClose=function(){Transport.prototype.onClose.call(this);};/**
 * Closes socket.
 *
 * @api private
 */WS.prototype.doClose=function(){if(typeof this.ws!=='undefined'){this.ws.close();}};/**
 * Generates uri for connection.
 *
 * @api private
 */WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?'wss':'ws';var port='';// avoid port if default for schema
if(this.port&&('wss'===schema&&Number(this.port)!==443||'ws'===schema&&Number(this.port)!==80)){port=':'+this.port;}// append timestamp to URI
if(this.timestampRequests){query[this.timestampParam]=yeast();}// communicate binary support capabilities
if(!this.supportsBinary){query.b64=1;}query=parseqs.encode(query);// prepend ? to query
if(query.length){query='?'+query;}var ipv6=this.hostname.indexOf(':')!==-1;return schema+'://'+(ipv6?'['+this.hostname+']':this.hostname)+port+this.path+query;};/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */WS.prototype.check=function(){return!!WebSocket&&!('__initialize'in WebSocket&&this.name===WS.prototype.name);};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"../transport":312,"component-inherit":10,"debug":319,"engine.io-parser":321,"parseqs":348,"ws":403,"yeast":390}],318:[function(require,module,exports){(function(global){// browser shim for xmlhttprequest module
var hasCORS=require('has-cors');module.exports=function(opts){var xdomain=opts.xdomain;// scheme must be same when usign XDomainRequest
// http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
var xscheme=opts.xscheme;// XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
// https://github.com/Automattic/engine.io-client/pull/217
var enablesXDR=opts.enablesXDR;// XMLHttpRequest can be disabled on IE
try{if('undefined'!==typeof XMLHttpRequest&&(!xdomain||hasCORS)){return new XMLHttpRequest();}}catch(e){}// Use XDomainRequest for IE8 if enablesXDR is true
// because loading bar keeps flashing when using jsonp-polling
// https://github.com/yujiosaka/socke.io-ie8-loading-example
try{if('undefined'!==typeof XDomainRequest&&!xscheme&&enablesXDR){return new XDomainRequest();}}catch(e){}if(!xdomain){try{return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');}catch(e){}}};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"has-cors":327}],319:[function(require,module,exports){(function(process){/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=require('./debug');exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
 * Colors.
 */exports.colors=['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson'];/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */function useColors(){// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&'WebkitAppearance'in document.documentElement.style||// is firebug? http://stackoverflow.com/a/398120/376773
window.console&&(console.firebug||console.exception&&console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31;}/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return args;var c='color: '+this.color;args=[args[0],c,'color: inherit'].concat(Array.prototype.slice.call(args,1));// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);return args;}/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */function load(){var r;try{return exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(typeof process!=='undefined'&&'env'in process){return process.env.DEBUG;}}/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */exports.enable(load());/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */function localstorage(){try{return window.localStorage;}catch(e){}}}).call(this,require('_process'));},{"./debug":320,"_process":413}],320:[function(require,module,exports){/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=debug.debug=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=require('ms');/**
 * The currently active debug mode names, and names to skip.
 */exports.names=[];exports.skips=[];/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */exports.formatters={};/**
 * Previously assigned color.
 */var prevColor=0;/**
 * Previous log timestamp.
 */var prevTime;/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */function selectColor(){return exports.colors[prevColor++%exports.colors.length];}/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */function debug(namespace){// define the `disabled` version
function disabled(){}disabled.enabled=false;// define the `enabled` version
function enabled(){var self=enabled;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// add the `color` if not set
if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %o
args=['%o'].concat(args);}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting
args=exports.formatArgs.apply(self,args);var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args);}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn;}/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */function enable(namespaces){exports.save(namespaces);var split=(namespaces||'').split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/[\\^$+?.()|[\]{}]/g,'\\$&').replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}}/**
 * Disable debug output.
 *
 * @api public
 */function disable(){exports.enable('');}/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}},{"ms":335}],321:[function(require,module,exports){(function(global){/**
 * Module dependencies.
 */var keys=require('./keys');var hasBinary=require('has-binary');var sliceBuffer=require('arraybuffer.slice');var after=require('after');var utf8=require('wtf-8');var base64encoder;if(global&&global.ArrayBuffer){base64encoder=require('base64-arraybuffer');}/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */var isAndroid=typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent);/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */var isPhantomJS=typeof navigator!=='undefined'&&/PhantomJS/i.test(navigator.userAgent);/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */var dontSendBlobs=isAndroid||isPhantomJS;/**
 * Current protocol version.
 */exports.protocol=3;/**
 * Packet types.
 */var packets=exports.packets={open:0// non-ws
,close:1// non-ws
,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys(packets);/**
 * Premade error packet.
 */var err={type:'error',data:'parser error'};/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */var Blob=require('blob');/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */exports.encodePacket=function(packet,supportsBinary,utf8encode,callback){if('function'==typeof supportsBinary){callback=supportsBinary;supportsBinary=false;}if('function'==typeof utf8encode){callback=utf8encode;utf8encode=null;}var data=packet.data===undefined?undefined:packet.data.buffer||packet.data;if(global.ArrayBuffer&&data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback);}else if(Blob&&data instanceof global.Blob){return encodeBlob(packet,supportsBinary,callback);}// might be an object with { base64: true, data: dataAsBase64String }
if(data&&data.base64){return encodeBase64Object(packet,callback);}// Sending data as a utf-8 string
var encoded=packets[packet.type];// data fragment is optional
if(undefined!==packet.data){encoded+=utf8encode?utf8.encode(String(packet.data)):String(packet.data);}return callback(''+encoded);};function encodeBase64Object(packet,callback){// packet data is an object { base64: true, data: dataAsBase64String }
var message='b'+exports.packets[packet.type]+packet.data.data;return callback(message);}/**
 * Encode packet helpers for binary types
 */function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1+data.byteLength);resultBuffer[0]=packets[packet.type];for(var i=0;i<contentArray.length;i++){resultBuffer[i+1]=contentArray[i];}return callback(resultBuffer.buffer);}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var fr=new FileReader();fr.onload=function(){packet.data=fr.result;exports.encodePacket(packet,supportsBinary,true,callback);};return fr.readAsArrayBuffer(packet.data);}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback);}var length=new Uint8Array(1);length[0]=packets[packet.type];var blob=new Blob([length.buffer,packet.data]);return callback(blob);}/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */exports.encodeBase64Packet=function(packet,callback){var message='b'+exports.packets[packet.type];if(Blob&&packet.data instanceof global.Blob){var fr=new FileReader();fr.onload=function(){var b64=fr.result.split(',')[1];callback(message+b64);};return fr.readAsDataURL(packet.data);}var b64data;try{b64data=String.fromCharCode.apply(null,new Uint8Array(packet.data));}catch(e){// iPhone Safari doesn't let you apply with typed arrays
var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i<typed.length;i++){basic[i]=typed[i];}b64data=String.fromCharCode.apply(null,basic);}message+=global.btoa(b64data);return callback(message);};/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */exports.decodePacket=function(data,binaryType,utf8decode){if(data===undefined){return err;}// String data
if(typeof data=='string'){if(data.charAt(0)=='b'){return exports.decodeBase64Packet(data.substr(1),binaryType);}if(utf8decode){data=tryDecode(data);if(data===false){return err;}}var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err;}if(data.length>1){return{type:packetslist[type],data:data.substring(1)};}else{return{type:packetslist[type]};}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=sliceBuffer(data,1);if(Blob&&binaryType==='blob'){rest=new Blob([rest]);}return{type:packetslist[type],data:rest};};function tryDecode(data){try{data=utf8.decode(data);}catch(e){return false;}return data;}/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */exports.decodeBase64Packet=function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!base64encoder){return{type:type,data:{base64:true,data:msg.substr(1)}};}var data=base64encoder.decode(msg.substr(1));if(binaryType==='blob'&&Blob){data=new Blob([data]);}return{type:type,data:data};};/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */exports.encodePayload=function(packets,supportsBinary,callback){if(typeof supportsBinary=='function'){callback=supportsBinary;supportsBinary=null;}var isBinary=hasBinary(packets);if(supportsBinary&&isBinary){if(Blob&&!dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback);}return exports.encodePayloadAsArrayBuffer(packets,callback);}if(!packets.length){return callback('0:');}function setLengthHeader(message){return message.length+':'+message;}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,true,function(message){doneCallback(null,setLengthHeader(message));});}map(packets,encodeOne,function(err,results){return callback(results.join(''));});};/**
 * Async array map using after
 */function map(ary,each,done){var result=new Array(ary.length);var next=after(ary.length,done);var eachWithIndex=function eachWithIndex(i,el,cb){each(el,function(error,msg){result[i]=msg;cb(error,result);});};for(var i=0;i<ary.length;i++){eachWithIndex(i,ary[i],next);}}/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */exports.decodePayload=function(data,binaryType,callback){if(typeof data!='string'){return exports.decodePayloadAsBinary(data,binaryType,callback);}if(typeof binaryType==='function'){callback=binaryType;binaryType=null;}var packet;if(data==''){// parser error - ignoring payload
return callback(err,0,1);}var length='',n,msg;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(':'!=chr){length+=chr;}else{if(''==length||length!=(n=Number(length))){// parser error - ignoring payload
return callback(err,0,1);}msg=data.substr(i+1,n);if(length!=msg.length){// parser error - ignoring payload
return callback(err,0,1);}if(msg.length){packet=exports.decodePacket(msg,binaryType,true);if(err.type==packet.type&&err.data==packet.data){// parser error in individual packet - ignoring payload
return callback(err,0,1);}var ret=callback(packet,i+n,l);if(false===ret)return;}// advance cursor
i+=n;length='';}}if(length!=''){// parser error - ignoring payload
return callback(err,0,1);}};/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */exports.encodePayloadAsArrayBuffer=function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0));}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data);});}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p==='string'){len=p.length;}else{len=p.byteLength;}return acc+len.toString().length+len+2;// string/binary identifier + separator = 2
},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p==='string';var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i<p.length;i++){view[i]=p.charCodeAt(i);}ab=view.buffer;}if(isString){// not true binary
resultArray[bufferIndex++]=0;}else{// true binary
resultArray[bufferIndex++]=1;}var lenStr=ab.byteLength.toString();for(var i=0;i<lenStr.length;i++){resultArray[bufferIndex++]=parseInt(lenStr[i]);}resultArray[bufferIndex++]=255;var view=new Uint8Array(ab);for(var i=0;i<view.length;i++){resultArray[bufferIndex++]=view[i];}});return callback(resultArray.buffer);});};/**
 * Encode as Blob
 */exports.encodePayloadAsBlob=function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0]=1;if(typeof encoded==='string'){var view=new Uint8Array(encoded.length);for(var i=0;i<encoded.length;i++){view[i]=encoded.charCodeAt(i);}encoded=view.buffer;binaryIdentifier[0]=0;}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length+1);for(var i=0;i<lenStr.length;i++){lengthAry[i]=parseInt(lenStr[i]);}lengthAry[lenStr.length]=255;if(Blob){var blob=new Blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob);}});}map(packets,encodeOne,function(err,results){return callback(new Blob(results));});};/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */exports.decodePayloadAsBinary=function(data,binaryType,callback){if(typeof binaryType==='function'){callback=binaryType;binaryType=null;}var bufferTail=data;var buffers=[];var numberTooLong=false;while(bufferTail.byteLength>0){var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0]===0;var msgLength='';for(var i=1;;i++){if(tailArray[i]==255)break;if(msgLength.length>310){numberTooLong=true;break;}msgLength+=tailArray[i];}if(numberTooLong)return callback(err,0,1);bufferTail=sliceBuffer(bufferTail,2+msgLength.length);msgLength=parseInt(msgLength);var msg=sliceBuffer(bufferTail,0,msgLength);if(isString){try{msg=String.fromCharCode.apply(null,new Uint8Array(msg));}catch(e){// iPhone Safari doesn't let you apply to typed arrays
var typed=new Uint8Array(msg);msg='';for(var i=0;i<typed.length;i++){msg+=String.fromCharCode(typed[i]);}}}buffers.push(msg);bufferTail=sliceBuffer(bufferTail,msgLength);}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total);});};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./keys":322,"after":1,"arraybuffer.slice":2,"base64-arraybuffer":5,"blob":6,"has-binary":325,"wtf-8":383}],322:[function(require,module,exports){/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */module.exports=Object.keys||function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){arr.push(i);}}return arr;};},{}],323:[function(require,module,exports){/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */var DIFF_DELETE=-1;var DIFF_INSERT=1;var DIFF_EQUAL=0;/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {Int} cursor_pos Expected edit position in text1 (optional)
 * @return {Array} Array of diff tuples.
 */function diff_main(text1,text2,cursor_pos){// Check for equality (speedup).
if(text1==text2){if(text1){return[[DIFF_EQUAL,text1]];}return[];}// Check cursor_pos within bounds
if(cursor_pos<0||text1.length<cursor_pos){cursor_pos=null;}// Trim off common prefix (speedup).
var commonlength=diff_commonPrefix(text1,text2);var commonprefix=text1.substring(0,commonlength);text1=text1.substring(commonlength);text2=text2.substring(commonlength);// Trim off common suffix (speedup).
commonlength=diff_commonSuffix(text1,text2);var commonsuffix=text1.substring(text1.length-commonlength);text1=text1.substring(0,text1.length-commonlength);text2=text2.substring(0,text2.length-commonlength);// Compute the diff on the middle block.
var diffs=diff_compute_(text1,text2);// Restore the prefix and suffix.
if(commonprefix){diffs.unshift([DIFF_EQUAL,commonprefix]);}if(commonsuffix){diffs.push([DIFF_EQUAL,commonsuffix]);}diff_cleanupMerge(diffs);if(cursor_pos!=null){diffs=fix_cursor(diffs,cursor_pos);}return diffs;};/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */function diff_compute_(text1,text2){var diffs;if(!text1){// Just add some text (speedup).
return[[DIFF_INSERT,text2]];}if(!text2){// Just delete some text (speedup).
return[[DIFF_DELETE,text1]];}var longtext=text1.length>text2.length?text1:text2;var shorttext=text1.length>text2.length?text2:text1;var i=longtext.indexOf(shorttext);if(i!=-1){// Shorter text is inside the longer text (speedup).
diffs=[[DIFF_INSERT,longtext.substring(0,i)],[DIFF_EQUAL,shorttext],[DIFF_INSERT,longtext.substring(i+shorttext.length)]];// Swap insertions for deletions if diff is reversed.
if(text1.length>text2.length){diffs[0][0]=diffs[2][0]=DIFF_DELETE;}return diffs;}if(shorttext.length==1){// Single character string.
// After the previous speedup, the character can't be an equality.
return[[DIFF_DELETE,text1],[DIFF_INSERT,text2]];}// Check to see if the problem can be split in two.
var hm=diff_halfMatch_(text1,text2);if(hm){// A half-match was found, sort out the return data.
var text1_a=hm[0];var text1_b=hm[1];var text2_a=hm[2];var text2_b=hm[3];var mid_common=hm[4];// Send both pairs off for separate processing.
var diffs_a=diff_main(text1_a,text2_a);var diffs_b=diff_main(text1_b,text2_b);// Merge the results.
return diffs_a.concat([[DIFF_EQUAL,mid_common]],diffs_b);}return diff_bisect_(text1,text2);};/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 * @private
 */function diff_bisect_(text1,text2){// Cache the text lengths to prevent multiple calls.
var text1_length=text1.length;var text2_length=text2.length;var max_d=Math.ceil((text1_length+text2_length)/2);var v_offset=max_d;var v_length=2*max_d;var v1=new Array(v_length);var v2=new Array(v_length);// Setting all elements to -1 is faster in Chrome & Firefox than mixing
// integers and undefined.
for(var x=0;x<v_length;x++){v1[x]=-1;v2[x]=-1;}v1[v_offset+1]=0;v2[v_offset+1]=0;var delta=text1_length-text2_length;// If the total number of characters is odd, then the front path will collide
// with the reverse path.
var front=delta%2!=0;// Offsets for start and end of k loop.
// Prevents mapping of space beyond the grid.
var k1start=0;var k1end=0;var k2start=0;var k2end=0;for(var d=0;d<max_d;d++){// Walk the front path one step.
for(var k1=-d+k1start;k1<=d-k1end;k1+=2){var k1_offset=v_offset+k1;var x1;if(k1==-d||k1!=d&&v1[k1_offset-1]<v1[k1_offset+1]){x1=v1[k1_offset+1];}else{x1=v1[k1_offset-1]+1;}var y1=x1-k1;while(x1<text1_length&&y1<text2_length&&text1.charAt(x1)==text2.charAt(y1)){x1++;y1++;}v1[k1_offset]=x1;if(x1>text1_length){// Ran off the right of the graph.
k1end+=2;}else if(y1>text2_length){// Ran off the bottom of the graph.
k1start+=2;}else if(front){var k2_offset=v_offset+delta-k1;if(k2_offset>=0&&k2_offset<v_length&&v2[k2_offset]!=-1){// Mirror x2 onto top-left coordinate system.
var x2=text1_length-v2[k2_offset];if(x1>=x2){// Overlap detected.
return diff_bisectSplit_(text1,text2,x1,y1);}}}}// Walk the reverse path one step.
for(var k2=-d+k2start;k2<=d-k2end;k2+=2){var k2_offset=v_offset+k2;var x2;if(k2==-d||k2!=d&&v2[k2_offset-1]<v2[k2_offset+1]){x2=v2[k2_offset+1];}else{x2=v2[k2_offset-1]+1;}var y2=x2-k2;while(x2<text1_length&&y2<text2_length&&text1.charAt(text1_length-x2-1)==text2.charAt(text2_length-y2-1)){x2++;y2++;}v2[k2_offset]=x2;if(x2>text1_length){// Ran off the left of the graph.
k2end+=2;}else if(y2>text2_length){// Ran off the top of the graph.
k2start+=2;}else if(!front){var k1_offset=v_offset+delta-k2;if(k1_offset>=0&&k1_offset<v_length&&v1[k1_offset]!=-1){var x1=v1[k1_offset];var y1=v_offset+x1-k1_offset;// Mirror x2 onto top-left coordinate system.
x2=text1_length-x2;if(x1>=x2){// Overlap detected.
return diff_bisectSplit_(text1,text2,x1,y1);}}}}}// Diff took too long and hit the deadline or
// number of diffs equals number of characters, no commonality at all.
return[[DIFF_DELETE,text1],[DIFF_INSERT,text2]];};/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @return {Array} Array of diff tuples.
 */function diff_bisectSplit_(text1,text2,x,y){var text1a=text1.substring(0,x);var text2a=text2.substring(0,y);var text1b=text1.substring(x);var text2b=text2.substring(y);// Compute both diffs serially.
var diffs=diff_main(text1a,text2a);var diffsb=diff_main(text1b,text2b);return diffs.concat(diffsb);};/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */function diff_commonPrefix(text1,text2){// Quick check for common null cases.
if(!text1||!text2||text1.charAt(0)!=text2.charAt(0)){return 0;}// Binary search.
// Performance analysis: http://neil.fraser.name/news/2007/10/09/
var pointermin=0;var pointermax=Math.min(text1.length,text2.length);var pointermid=pointermax;var pointerstart=0;while(pointermin<pointermid){if(text1.substring(pointerstart,pointermid)==text2.substring(pointerstart,pointermid)){pointermin=pointermid;pointerstart=pointermin;}else{pointermax=pointermid;}pointermid=Math.floor((pointermax-pointermin)/2+pointermin);}return pointermid;};/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */function diff_commonSuffix(text1,text2){// Quick check for common null cases.
if(!text1||!text2||text1.charAt(text1.length-1)!=text2.charAt(text2.length-1)){return 0;}// Binary search.
// Performance analysis: http://neil.fraser.name/news/2007/10/09/
var pointermin=0;var pointermax=Math.min(text1.length,text2.length);var pointermid=pointermax;var pointerend=0;while(pointermin<pointermid){if(text1.substring(text1.length-pointermid,text1.length-pointerend)==text2.substring(text2.length-pointermid,text2.length-pointerend)){pointermin=pointermid;pointerend=pointermin;}else{pointermax=pointermid;}pointermid=Math.floor((pointermax-pointermin)/2+pointermin);}return pointermid;};/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 */function diff_halfMatch_(text1,text2){var longtext=text1.length>text2.length?text1:text2;var shorttext=text1.length>text2.length?text2:text1;if(longtext.length<4||shorttext.length*2<longtext.length){return null;// Pointless.
}/**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */function diff_halfMatchI_(longtext,shorttext,i){// Start with a 1/4 length substring at position i as a seed.
var seed=longtext.substring(i,i+Math.floor(longtext.length/4));var j=-1;var best_common='';var best_longtext_a,best_longtext_b,best_shorttext_a,best_shorttext_b;while((j=shorttext.indexOf(seed,j+1))!=-1){var prefixLength=diff_commonPrefix(longtext.substring(i),shorttext.substring(j));var suffixLength=diff_commonSuffix(longtext.substring(0,i),shorttext.substring(0,j));if(best_common.length<suffixLength+prefixLength){best_common=shorttext.substring(j-suffixLength,j)+shorttext.substring(j,j+prefixLength);best_longtext_a=longtext.substring(0,i-suffixLength);best_longtext_b=longtext.substring(i+prefixLength);best_shorttext_a=shorttext.substring(0,j-suffixLength);best_shorttext_b=shorttext.substring(j+prefixLength);}}if(best_common.length*2>=longtext.length){return[best_longtext_a,best_longtext_b,best_shorttext_a,best_shorttext_b,best_common];}else{return null;}}// First check if the second quarter is the seed for a half-match.
var hm1=diff_halfMatchI_(longtext,shorttext,Math.ceil(longtext.length/4));// Check again based on the third quarter.
var hm2=diff_halfMatchI_(longtext,shorttext,Math.ceil(longtext.length/2));var hm;if(!hm1&&!hm2){return null;}else if(!hm2){hm=hm1;}else if(!hm1){hm=hm2;}else{// Both matched.  Select the longest.
hm=hm1[4].length>hm2[4].length?hm1:hm2;}// A half-match was found, sort out the return data.
var text1_a,text1_b,text2_a,text2_b;if(text1.length>text2.length){text1_a=hm[0];text1_b=hm[1];text2_a=hm[2];text2_b=hm[3];}else{text2_a=hm[0];text2_b=hm[1];text1_a=hm[2];text1_b=hm[3];}var mid_common=hm[4];return[text1_a,text1_b,text2_a,text2_b,mid_common];};/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples.
 */function diff_cleanupMerge(diffs){diffs.push([DIFF_EQUAL,'']);// Add a dummy entry at the end.
var pointer=0;var count_delete=0;var count_insert=0;var text_delete='';var text_insert='';var commonlength;while(pointer<diffs.length){switch(diffs[pointer][0]){case DIFF_INSERT:count_insert++;text_insert+=diffs[pointer][1];pointer++;break;case DIFF_DELETE:count_delete++;text_delete+=diffs[pointer][1];pointer++;break;case DIFF_EQUAL:// Upon reaching an equality, check for prior redundancies.
if(count_delete+count_insert>1){if(count_delete!==0&&count_insert!==0){// Factor out any common prefixies.
commonlength=diff_commonPrefix(text_insert,text_delete);if(commonlength!==0){if(pointer-count_delete-count_insert>0&&diffs[pointer-count_delete-count_insert-1][0]==DIFF_EQUAL){diffs[pointer-count_delete-count_insert-1][1]+=text_insert.substring(0,commonlength);}else{diffs.splice(0,0,[DIFF_EQUAL,text_insert.substring(0,commonlength)]);pointer++;}text_insert=text_insert.substring(commonlength);text_delete=text_delete.substring(commonlength);}// Factor out any common suffixies.
commonlength=diff_commonSuffix(text_insert,text_delete);if(commonlength!==0){diffs[pointer][1]=text_insert.substring(text_insert.length-commonlength)+diffs[pointer][1];text_insert=text_insert.substring(0,text_insert.length-commonlength);text_delete=text_delete.substring(0,text_delete.length-commonlength);}}// Delete the offending records and add the merged ones.
if(count_delete===0){diffs.splice(pointer-count_insert,count_delete+count_insert,[DIFF_INSERT,text_insert]);}else if(count_insert===0){diffs.splice(pointer-count_delete,count_delete+count_insert,[DIFF_DELETE,text_delete]);}else{diffs.splice(pointer-count_delete-count_insert,count_delete+count_insert,[DIFF_DELETE,text_delete],[DIFF_INSERT,text_insert]);}pointer=pointer-count_delete-count_insert+(count_delete?1:0)+(count_insert?1:0)+1;}else if(pointer!==0&&diffs[pointer-1][0]==DIFF_EQUAL){// Merge this equality with the previous one.
diffs[pointer-1][1]+=diffs[pointer][1];diffs.splice(pointer,1);}else{pointer++;}count_insert=0;count_delete=0;text_delete='';text_insert='';break;}}if(diffs[diffs.length-1][1]===''){diffs.pop();// Remove the dummy entry at the end.
}// Second pass: look for single edits surrounded on both sides by equalities
// which can be shifted sideways to eliminate an equality.
// e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
var changes=false;pointer=1;// Intentionally ignore the first and last element (don't need checking).
while(pointer<diffs.length-1){if(diffs[pointer-1][0]==DIFF_EQUAL&&diffs[pointer+1][0]==DIFF_EQUAL){// This is a single edit surrounded by equalities.
if(diffs[pointer][1].substring(diffs[pointer][1].length-diffs[pointer-1][1].length)==diffs[pointer-1][1]){// Shift the edit over the previous equality.
diffs[pointer][1]=diffs[pointer-1][1]+diffs[pointer][1].substring(0,diffs[pointer][1].length-diffs[pointer-1][1].length);diffs[pointer+1][1]=diffs[pointer-1][1]+diffs[pointer+1][1];diffs.splice(pointer-1,1);changes=true;}else if(diffs[pointer][1].substring(0,diffs[pointer+1][1].length)==diffs[pointer+1][1]){// Shift the edit over the next equality.
diffs[pointer-1][1]+=diffs[pointer+1][1];diffs[pointer][1]=diffs[pointer][1].substring(diffs[pointer+1][1].length)+diffs[pointer+1][1];diffs.splice(pointer+1,1);changes=true;}}pointer++;}// If shifts were made, the diff needs reordering and another shift sweep.
if(changes){diff_cleanupMerge(diffs);}};var diff=diff_main;diff.INSERT=DIFF_INSERT;diff.DELETE=DIFF_DELETE;diff.EQUAL=DIFF_EQUAL;module.exports=diff;/*
 * Modify a diff such that the cursor position points to the start of a change:
 * E.g.
 *   cursor_normalize_diff([[DIFF_EQUAL, 'abc']], 1)
 *     => [1, [[DIFF_EQUAL, 'a'], [DIFF_EQUAL, 'bc']]]
 *   cursor_normalize_diff([[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xyz']], 2)
 *     => [2, [[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xy'], [DIFF_DELETE, 'z']]]
 *
 * @param {Array} diffs Array of diff tuples
 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
 * @return {Array} A tuple [cursor location in the modified diff, modified diff]
 */function cursor_normalize_diff(diffs,cursor_pos){if(cursor_pos===0){return[DIFF_EQUAL,diffs];}for(var current_pos=0,i=0;i<diffs.length;i++){var d=diffs[i];if(d[0]===DIFF_DELETE||d[0]===DIFF_EQUAL){var next_pos=current_pos+d[1].length;if(cursor_pos===next_pos){return[i+1,diffs];}else if(cursor_pos<next_pos){// copy to prevent side effects
diffs=diffs.slice();// split d into two diff changes
var split_pos=cursor_pos-current_pos;var d_left=[d[0],d[1].slice(0,split_pos)];var d_right=[d[0],d[1].slice(split_pos)];diffs.splice(i,1,d_left,d_right);return[i+1,diffs];}else{current_pos=next_pos;}}}throw new Error('cursor_pos is out of bounds!');}/*
 * Modify a diff such that the edit position is "shifted" to the proposed edit location (cursor_position).
 *
 * Case 1)
 *   Check if a naive shift is possible:
 *     [0, X], [ 1, Y] -> [ 1, Y], [0, X]    (if X + Y === Y + X)
 *     [0, X], [-1, Y] -> [-1, Y], [0, X]    (if X + Y === Y + X) - holds same result
 * Case 2)
 *   Check if the following shifts are possible:
 *     [0, 'pre'], [ 1, 'prefix'] -> [ 1, 'pre'], [0, 'pre'], [ 1, 'fix']
 *     [0, 'pre'], [-1, 'prefix'] -> [-1, 'pre'], [0, 'pre'], [-1, 'fix']
 *         ^            ^
 *         d          d_next
 *
 * @param {Array} diffs Array of diff tuples
 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
 * @return {Array} Array of diff tuples
 */function fix_cursor(diffs,cursor_pos){var norm=cursor_normalize_diff(diffs,cursor_pos);var ndiffs=norm[1];var cursor_pointer=norm[0];var d=ndiffs[cursor_pointer];var d_next=ndiffs[cursor_pointer+1];if(d==null){// Text was deleted from end of original string,
// cursor is now out of bounds in new string
return diffs;}else if(d[0]!==DIFF_EQUAL){// A modification happened at the cursor location.
// This is the expected outcome, so we can return the original diff.
return diffs;}else{if(d_next!=null&&d[1]+d_next[1]===d_next[1]+d[1]){// Case 1)
// It is possible to perform a naive shift
ndiffs.splice(cursor_pointer,2,d_next,d);return merge_tuples(ndiffs,cursor_pointer,2);}else if(d_next!=null&&d_next[1].indexOf(d[1])===0){// Case 2)
// d[1] is a prefix of d_next[1]
// We can assume that d_next[0] !== 0, since d[0] === 0
// Shift edit locations..
ndiffs.splice(cursor_pointer,2,[d_next[0],d[1]],[0,d[1]]);var suffix=d_next[1].slice(d[1].length);if(suffix.length>0){ndiffs.splice(cursor_pointer+2,0,[d_next[0],suffix]);}return merge_tuples(ndiffs,cursor_pointer,3);}else{// Not possible to perform any modification
return diffs;}}}/*
 * Try to merge tuples with their neigbors in a given range.
 * E.g. [0, 'a'], [0, 'b'] -> [0, 'ab']
 *
 * @param {Array} diffs Array of diff tuples.
 * @param {Int} start Position of the first element to merge (diffs[start] is also merged with diffs[start - 1]).
 * @param {Int} length Number of consecutive elements to check.
 * @return {Array} Array of merged diff tuples.
 */function merge_tuples(diffs,start,length){// Check from (start-1) to (start+length).
for(var i=start+length-1;i>=0&&i>=start-1;i--){if(i+1<diffs.length){var left_d=diffs[i];var right_d=diffs[i+1];if(left_d[0]===right_d[1]){diffs.splice(i,2,[left_d[0],left_d[1]+right_d[1]]);}}}return diffs;}},{}],324:[function(require,module,exports){// originally pulled out of simple-peer
module.exports=function getBrowserRTC(){if(typeof window==='undefined')return null;var wrtc={RTCPeerConnection:window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,RTCSessionDescription:window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription,RTCIceCandidate:window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate};if(!wrtc.RTCPeerConnection)return null;return wrtc;};},{}],325:[function(require,module,exports){(function(global){/*
 * Module requirements.
 */var isArray=require('isarray');/**
 * Module exports.
 */module.exports=hasBinary;/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true;}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true;}}}else if(obj&&'object'==(typeof obj==="undefined"?"undefined":_typeof(obj))){// see: https://github.com/Automattic/has-binary/pull/4
if(obj.toJSON&&'function'==typeof obj.toJSON){obj=obj.toJSON();}for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&_hasBinary(obj[key])){return true;}}}return false;}return _hasBinary(data);}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"isarray":326}],326:[function(require,module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=='[object Array]';};},{}],327:[function(require,module,exports){/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */try{module.exports=typeof XMLHttpRequest!=='undefined'&&'withCredentials'in new XMLHttpRequest();}catch(err){// if XMLHttp support is disabled in IE then it will throw
// when trying to create
module.exports=false;}},{}],328:[function(require,module,exports){var indexOf=[].indexOf;module.exports=function(arr,obj){if(indexOf)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i;}return-1;};},{}],329:[function(require,module,exports){if(typeof Object.create==='function'){// implementation from standard node.js 'util' module
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}});};}else{// old school shim for old browsers
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function TempCtor(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor();ctor.prototype.constructor=ctor;};}},{}],330:[function(require,module,exports){var toString={}.toString;module.exports=Array.isArray||function(arr){return toString.call(arr)=='[object Array]';};},{}],331:[function(require,module,exports){(function(global){/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */;(function(){// Detect the `define` function exposed by asynchronous module loaders. The
// strict `define` check is necessary for compatibility with `r.js`.
var isLoader=typeof define==="function"&&define.amd;// A set of types used to distinguish objects from primitives.
var objectTypes={"function":true,"object":true};// Detect the `exports` object exposed by CommonJS implementations.
var freeExports=objectTypes[typeof exports==="undefined"?"undefined":_typeof(exports)]&&exports&&!exports.nodeType&&exports;// Use the `global` object exposed by Node (including Browserify via
// `insert-module-globals`), Narwhal, and Ringo as the default context,
// and the `window` object in browsers. Rhino exports a `global` function
// instead.
var root=objectTypes[typeof window==="undefined"?"undefined":_typeof(window)]&&window||this,freeGlobal=freeExports&&objectTypes[typeof module==="undefined"?"undefined":_typeof(module)]&&module&&!module.nodeType&&(typeof global==="undefined"?"undefined":_typeof(global))=="object"&&global;if(freeGlobal&&(freeGlobal["global"]===freeGlobal||freeGlobal["window"]===freeGlobal||freeGlobal["self"]===freeGlobal)){root=freeGlobal;}// Public: Initializes JSON 3 using the given `context` object, attaching the
// `stringify` and `parse` functions to the specified `exports` object.
function runInContext(context,exports){context||(context=root["Object"]());exports||(exports=root["Object"]());// Native constructor aliases.
var Number=context["Number"]||root["Number"],String=context["String"]||root["String"],Object=context["Object"]||root["Object"],Date=context["Date"]||root["Date"],SyntaxError=context["SyntaxError"]||root["SyntaxError"],TypeError=context["TypeError"]||root["TypeError"],Math=context["Math"]||root["Math"],nativeJSON=context["JSON"]||root["JSON"];// Delegate to the native `stringify` and `parse` implementations.
if((typeof nativeJSON==="undefined"?"undefined":_typeof(nativeJSON))=="object"&&nativeJSON){exports.stringify=nativeJSON.stringify;exports.parse=nativeJSON.parse;}// Convenience aliases.
var objectProto=Object.prototype,getClass=objectProto.toString,_isProperty,_forEach,undef;// Test the `Date#getUTC*` methods. Based on work by @Yaffle.
var isExtended=new Date(-3509827334573292);try{// The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
// results for certain dates in Opera >= 10.53.
isExtended=isExtended.getUTCFullYear()==-109252&&isExtended.getUTCMonth()===0&&isExtended.getUTCDate()===1&&// Safari < 2.0.2 stores the internal millisecond time value correctly,
// but clips the values returned by the date methods to the range of
// signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
isExtended.getUTCHours()==10&&isExtended.getUTCMinutes()==37&&isExtended.getUTCSeconds()==6&&isExtended.getUTCMilliseconds()==708;}catch(exception){}// Internal: Determines whether the native `JSON.stringify` and `parse`
// implementations are spec-compliant. Based on work by Ken Snyder.
function has(name){if(has[name]!==undef){// Return cached feature test result.
return has[name];}var isSupported;if(name=="bug-string-char-index"){// IE <= 7 doesn't support accessing string characters using square
// bracket notation. IE 8 only supports this for primitives.
isSupported="a"[0]!="a";}else if(name=="json"){// Indicates whether both `JSON.stringify` and `JSON.parse` are
// supported.
isSupported=has("json-stringify")&&has("json-parse");}else{var value,serialized="{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}";// Test `JSON.stringify`.
if(name=="json-stringify"){var stringify=exports.stringify,stringifySupported=typeof stringify=="function"&&isExtended;if(stringifySupported){// A test function object with a custom `toJSON` method.
(value=function value(){return 1;}).toJSON=value;try{stringifySupported=// Firefox 3.1b1 and b2 serialize string, number, and boolean
// primitives as object literals.
stringify(0)==="0"&&// FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
// literals.
stringify(new Number())==="0"&&stringify(new String())=='""'&&// FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
// does not define a canonical JSON representation (this applies to
// objects with `toJSON` properties as well, *unless* they are nested
// within an object or array).
stringify(getClass)===undef&&// IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
// FF 3.1b3 pass this test.
stringify(undef)===undef&&// Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
// respectively, if the value is omitted entirely.
stringify()===undef&&// FF 3.1b1, 2 throw an error if the given value is not a number,
// string, array, object, Boolean, or `null` literal. This applies to
// objects with custom `toJSON` methods as well, unless they are nested
// inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
// methods entirely.
stringify(value)==="1"&&stringify([value])=="[1]"&&// Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
// `"[null]"`.
stringify([undef])=="[null]"&&// YUI 3.0.0b1 fails to serialize `null` literals.
stringify(null)=="null"&&// FF 3.1b1, 2 halts serialization if an array contains a function:
// `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
// elides non-JSON values from objects and arrays, unless they
// define custom `toJSON` methods.
stringify([undef,getClass,null])=="[null,null,null]"&&// Simple serialization test. FF 3.1b1 uses Unicode escape sequences
// where character escape codes are expected (e.g., `\b` => `\u0008`).
stringify({"a":[value,true,false,null,"\x00\b\n\f\r\t"]})==serialized&&// FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
stringify(null,value)==="1"&&stringify([1,2],null,1)=="[\n 1,\n 2\n]"&&// JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
// serialize extended years.
stringify(new Date(-8.64e15))=='"-271821-04-20T00:00:00.000Z"'&&// The milliseconds are optional in ES 5, but required in 5.1.
stringify(new Date(8.64e15))=='"+275760-09-13T00:00:00.000Z"'&&// Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
// four-digit years instead of six-digit years. Credits: @Yaffle.
stringify(new Date(-621987552e5))=='"-000001-01-01T00:00:00.000Z"'&&// Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
// values less than 1000. Credits: @Yaffle.
stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"';}catch(exception){stringifySupported=false;}}isSupported=stringifySupported;}// Test `JSON.parse`.
if(name=="json-parse"){var parse=exports.parse;if(typeof parse=="function"){try{// FF 3.1b1, b2 will throw an exception if a bare literal is provided.
// Conforming implementations should also coerce the initial argument to
// a string prior to parsing.
if(parse("0")===0&&!parse(false)){// Simple parsing test.
value=parse(serialized);var parseSupported=value["a"].length==5&&value["a"][0]===1;if(parseSupported){try{// Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
parseSupported=!parse('"\t"');}catch(exception){}if(parseSupported){try{// FF 4.0 and 4.0.1 allow leading `+` signs and leading
// decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
// certain octal literals.
parseSupported=parse("01")!==1;}catch(exception){}}if(parseSupported){try{// FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
// points. These environments, along with FF 3.1b1 and 2,
// also allow trailing commas in JSON objects and arrays.
parseSupported=parse("1.")!==1;}catch(exception){}}}}}catch(exception){parseSupported=false;}}isSupported=parseSupported;}}return has[name]=!!isSupported;}if(!has("json")){// Common `[[Class]]` name aliases.
var functionClass="[object Function]",dateClass="[object Date]",numberClass="[object Number]",stringClass="[object String]",arrayClass="[object Array]",booleanClass="[object Boolean]";// Detect incomplete support for accessing string characters by index.
var charIndexBuggy=has("bug-string-char-index");// Define additional utility methods if the `Date` methods are buggy.
if(!isExtended){var floor=Math.floor;// A mapping between the months of the year and the number of days between
// January 1st and the first of the respective month.
var Months=[0,31,59,90,120,151,181,212,243,273,304,334];// Internal: Calculates the number of days between the Unix epoch and the
// first day of the given month.
var getDay=function getDay(year,month){return Months[month]+365*(year-1970)+floor((year-1969+(month=+(month>1)))/4)-floor((year-1901+month)/100)+floor((year-1601+month)/400);};}// Internal: Determines if a property is a direct property of the given
// object. Delegates to the native `Object#hasOwnProperty` method.
if(!(_isProperty=objectProto.hasOwnProperty)){_isProperty=function isProperty(property){var members={},constructor;if((members.__proto__=null,members.__proto__={// The *proto* property cannot be set multiple times in recent
// versions of Firefox and SeaMonkey.
"toString":1},members).toString!=getClass){// Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
// supports the mutable *proto* property.
_isProperty=function isProperty(property){// Capture and break the object's prototype chain (see section 8.6.2
// of the ES 5.1 spec). The parenthesized expression prevents an
// unsafe transformation by the Closure Compiler.
var original=this.__proto__,result=property in(this.__proto__=null,this);// Restore the original prototype chain.
this.__proto__=original;return result;};}else{// Capture a reference to the top-level `Object` constructor.
constructor=members.constructor;// Use the `constructor` property to simulate `Object#hasOwnProperty` in
// other environments.
_isProperty=function isProperty(property){var parent=(this.constructor||constructor).prototype;return property in this&&!(property in parent&&this[property]===parent[property]);};}members=null;return _isProperty.call(this,property);};}// Internal: Normalizes the `for...in` iteration algorithm across
// environments. Each enumerated key is yielded to a `callback` function.
_forEach=function forEach(object,callback){var size=0,Properties,members,property;// Tests for bugs in the current environment's `for...in` algorithm. The
// `valueOf` property inherits the non-enumerable flag from
// `Object.prototype` in older versions of IE, Netscape, and Mozilla.
(Properties=function Properties(){this.valueOf=0;}).prototype.valueOf=0;// Iterate over a new instance of the `Properties` class.
members=new Properties();for(property in members){// Ignore all properties inherited from `Object.prototype`.
if(_isProperty.call(members,property)){size++;}}Properties=members=null;// Normalize the iteration algorithm.
if(!size){// A list of non-enumerable properties inherited from `Object.prototype`.
members=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];// IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
// properties.
_forEach=function forEach(object,callback){var isFunction=getClass.call(object)==functionClass,property,length;var hasProperty=!isFunction&&typeof object.constructor!="function"&&objectTypes[_typeof(object.hasOwnProperty)]&&object.hasOwnProperty||_isProperty;for(property in object){// Gecko <= 1.0 enumerates the `prototype` property of functions under
// certain conditions; IE does not.
if(!(isFunction&&property=="prototype")&&hasProperty.call(object,property)){callback(property);}}// Manually invoke the callback for each non-enumerable property.
for(length=members.length;property=members[--length];hasProperty.call(object,property)&&callback(property)){}};}else if(size==2){// Safari <= 2.0.4 enumerates shadowed properties twice.
_forEach=function forEach(object,callback){// Create a set of iterated properties.
var members={},isFunction=getClass.call(object)==functionClass,property;for(property in object){// Store each property name to prevent double enumeration. The
// `prototype` property of functions is not enumerated due to cross-
// environment inconsistencies.
if(!(isFunction&&property=="prototype")&&!_isProperty.call(members,property)&&(members[property]=1)&&_isProperty.call(object,property)){callback(property);}}};}else{// No bugs detected; use the standard `for...in` algorithm.
_forEach=function forEach(object,callback){var isFunction=getClass.call(object)==functionClass,property,isConstructor;for(property in object){if(!(isFunction&&property=="prototype")&&_isProperty.call(object,property)&&!(isConstructor=property==="constructor")){callback(property);}}// Manually invoke the callback for the `constructor` property due to
// cross-environment inconsistencies.
if(isConstructor||_isProperty.call(object,property="constructor")){callback(property);}};}return _forEach(object,callback);};// Public: Serializes a JavaScript `value` as a JSON string. The optional
// `filter` argument may specify either a function that alters how object and
// array members are serialized, or an array of strings and numbers that
// indicates which properties should be serialized. The optional `width`
// argument may be either a string or number that specifies the indentation
// level of the output.
if(!has("json-stringify")){// Internal: A map of control characters and their escaped equivalents.
var Escapes={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"};// Internal: Converts `value` into a zero-padded string such that its
// length is at least equal to `width`. The `width` must be <= 6.
var leadingZeroes="000000";var toPaddedString=function toPaddedString(width,value){// The `|| 0` expression is necessary to work around a bug in
// Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
return(leadingZeroes+(value||0)).slice(-width);};// Internal: Double-quotes a string `value`, replacing all ASCII control
// characters (characters with code unit values between 0 and 31) with
// their escaped equivalents. This is an implementation of the
// `Quote(value)` operation defined in ES 5.1 section 15.12.3.
var unicodePrefix="\\u00";var quote=function quote(value){var result='"',index=0,length=value.length,useCharIndex=!charIndexBuggy||length>10;var symbols=useCharIndex&&(charIndexBuggy?value.split(""):value);for(;index<length;index++){var charCode=value.charCodeAt(index);// If the character is a control character, append its Unicode or
// shorthand escape sequence; otherwise, append the character as-is.
switch(charCode){case 8:case 9:case 10:case 12:case 13:case 34:case 92:result+=Escapes[charCode];break;default:if(charCode<32){result+=unicodePrefix+toPaddedString(2,charCode.toString(16));break;}result+=useCharIndex?symbols[index]:value.charAt(index);}}return result+'"';};// Internal: Recursively serializes an object. Implements the
// `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
var serialize=function serialize(property,object,callback,properties,whitespace,indentation,stack){var value,className,year,month,date,time,hours,minutes,seconds,milliseconds,results,element,index,length,prefix,result;try{// Necessary for host object support.
value=object[property];}catch(exception){}if((typeof value==="undefined"?"undefined":_typeof(value))=="object"&&value){className=getClass.call(value);if(className==dateClass&&!_isProperty.call(value,"toJSON")){if(value>-1/0&&value<1/0){// Dates are serialized according to the `Date#toJSON` method
// specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
// for the ISO 8601 date time string format.
if(getDay){// Manually compute the year, month, date, hours, minutes,
// seconds, and milliseconds if the `getUTC*` methods are
// buggy. Adapted from @Yaffle's `date-shim` project.
date=floor(value/864e5);for(year=floor(date/365.2425)+1970-1;getDay(year+1,0)<=date;year++){}for(month=floor((date-getDay(year,0))/30.42);getDay(year,month+1)<=date;month++){}date=1+date-getDay(year,month);// The `time` value specifies the time within the day (see ES
// 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
// to compute `A modulo B`, as the `%` operator does not
// correspond to the `modulo` operation for negative numbers.
time=(value%864e5+864e5)%864e5;// The hours, minutes, seconds, and milliseconds are obtained by
// decomposing the time within the day. See section 15.9.1.10.
hours=floor(time/36e5)%24;minutes=floor(time/6e4)%60;seconds=floor(time/1e3)%60;milliseconds=time%1e3;}else{year=value.getUTCFullYear();month=value.getUTCMonth();date=value.getUTCDate();hours=value.getUTCHours();minutes=value.getUTCMinutes();seconds=value.getUTCSeconds();milliseconds=value.getUTCMilliseconds();}// Serialize extended years correctly.
value=(year<=0||year>=1e4?(year<0?"-":"+")+toPaddedString(6,year<0?-year:year):toPaddedString(4,year))+"-"+toPaddedString(2,month+1)+"-"+toPaddedString(2,date)+// Months, dates, hours, minutes, and seconds should have two
// digits; milliseconds should have three.
"T"+toPaddedString(2,hours)+":"+toPaddedString(2,minutes)+":"+toPaddedString(2,seconds)+// Milliseconds are optional in ES 5.0, but required in 5.1.
"."+toPaddedString(3,milliseconds)+"Z";}else{value=null;}}else if(typeof value.toJSON=="function"&&(className!=numberClass&&className!=stringClass&&className!=arrayClass||_isProperty.call(value,"toJSON"))){// Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
// `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
// ignores all `toJSON` methods on these objects unless they are
// defined directly on an instance.
value=value.toJSON(property);}}if(callback){// If a replacement function was provided, call it to obtain the value
// for serialization.
value=callback.call(object,property,value);}if(value===null){return"null";}className=getClass.call(value);if(className==booleanClass){// Booleans are represented literally.
return""+value;}else if(className==numberClass){// JSON numbers must be finite. `Infinity` and `NaN` are serialized as
// `"null"`.
return value>-1/0&&value<1/0?""+value:"null";}else if(className==stringClass){// Strings are double-quoted and escaped.
return quote(""+value);}// Recursively serialize objects and arrays.
if((typeof value==="undefined"?"undefined":_typeof(value))=="object"){// Check for cyclic structures. This is a linear search; performance
// is inversely proportional to the number of unique nested objects.
for(length=stack.length;length--;){if(stack[length]===value){// Cyclic structures cannot be serialized by `JSON.stringify`.
throw TypeError();}}// Add the object to the stack of traversed objects.
stack.push(value);results=[];// Save the current indentation level and indent one additional level.
prefix=indentation;indentation+=whitespace;if(className==arrayClass){// Recursively serialize array elements.
for(index=0,length=value.length;index<length;index++){element=serialize(index,value,callback,properties,whitespace,indentation,stack);results.push(element===undef?"null":element);}result=results.length?whitespace?"[\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"]":"["+results.join(",")+"]":"[]";}else{// Recursively serialize object members. Members are selected from
// either a user-specified list of property names, or the object
// itself.
_forEach(properties||value,function(property){var element=serialize(property,value,callback,properties,whitespace,indentation,stack);if(element!==undef){// According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
// is not the empty string, let `member` {quote(property) + ":"}
// be the concatenation of `member` and the `space` character."
// The "`space` character" refers to the literal space
// character, not the `space` {width} argument provided to
// `JSON.stringify`.
results.push(quote(property)+":"+(whitespace?" ":"")+element);}});result=results.length?whitespace?"{\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"}":"{"+results.join(",")+"}":"{}";}// Remove the object from the traversed object stack.
stack.pop();return result;}};// Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
exports.stringify=function(source,filter,width){var whitespace,callback,properties,className;if(objectTypes[typeof filter==="undefined"?"undefined":_typeof(filter)]&&filter){if((className=getClass.call(filter))==functionClass){callback=filter;}else if(className==arrayClass){// Convert the property names array into a makeshift set.
properties={};for(var index=0,length=filter.length,value;index<length;value=filter[index++],(className=getClass.call(value),className==stringClass||className==numberClass)&&(properties[value]=1)){}}}if(width){if((className=getClass.call(width))==numberClass){// Convert the `width` to an integer and create a string containing
// `width` number of space characters.
if((width-=width%1)>0){for(whitespace="",width>10&&(width=10);whitespace.length<width;whitespace+=" "){}}}else if(className==stringClass){whitespace=width.length<=10?width:width.slice(0,10);}}// Opera <= 7.54u2 discards the values associated with empty string keys
// (`""`) only if they are used directly within an object member list
// (e.g., `!("" in { "": 1})`).
return serialize("",(value={},value[""]=source,value),callback,properties,whitespace,"",[]);};}// Public: Parses a JSON source string.
if(!has("json-parse")){var fromCharCode=String.fromCharCode;// Internal: A map of escaped control characters and their unescaped
// equivalents.
var Unescapes={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"};// Internal: Stores the parser state.
var Index,Source;// Internal: Resets the parser state and throws a `SyntaxError`.
var abort=function abort(){Index=Source=null;throw SyntaxError();};// Internal: Returns the next token, or `"$"` if the parser has reached
// the end of the source string. A token may be a string, number, `null`
// literal, or Boolean literal.
var lex=function lex(){var source=Source,length=source.length,value,begin,position,isSigned,charCode;while(Index<length){charCode=source.charCodeAt(Index);switch(charCode){case 9:case 10:case 13:case 32:// Skip whitespace tokens, including tabs, carriage returns, line
// feeds, and space characters.
Index++;break;case 123:case 125:case 91:case 93:case 58:case 44:// Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
// the current position.
value=charIndexBuggy?source.charAt(Index):source[Index];Index++;return value;case 34:// `"` delimits a JSON string; advance to the next character and
// begin parsing the string. String tokens are prefixed with the
// sentinel `@` character to distinguish them from punctuators and
// end-of-string tokens.
for(value="@",Index++;Index<length;){charCode=source.charCodeAt(Index);if(charCode<32){// Unescaped ASCII control characters (those with a code unit
// less than the space character) are not permitted.
abort();}else if(charCode==92){// A reverse solidus (`\`) marks the beginning of an escaped
// control character (including `"`, `\`, and `/`) or Unicode
// escape sequence.
charCode=source.charCodeAt(++Index);switch(charCode){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:// Revive escaped control characters.
value+=Unescapes[charCode];Index++;break;case 117:// `\u` marks the beginning of a Unicode escape sequence.
// Advance to the first character and validate the
// four-digit code point.
begin=++Index;for(position=Index+4;Index<position;Index++){charCode=source.charCodeAt(Index);// A valid sequence comprises four hexdigits (case-
// insensitive) that form a single hexadecimal value.
if(!(charCode>=48&&charCode<=57||charCode>=97&&charCode<=102||charCode>=65&&charCode<=70)){// Invalid Unicode escape sequence.
abort();}}// Revive the escaped character.
value+=fromCharCode("0x"+source.slice(begin,Index));break;default:// Invalid escape sequence.
abort();}}else{if(charCode==34){// An unescaped double-quote character marks the end of the
// string.
break;}charCode=source.charCodeAt(Index);begin=Index;// Optimize for the common case where a string is valid.
while(charCode>=32&&charCode!=92&&charCode!=34){charCode=source.charCodeAt(++Index);}// Append the string as-is.
value+=source.slice(begin,Index);}}if(source.charCodeAt(Index)==34){// Advance to the next character and return the revived string.
Index++;return value;}// Unterminated string.
abort();default:// Parse numbers and literals.
begin=Index;// Advance past the negative sign, if one is specified.
if(charCode==45){isSigned=true;charCode=source.charCodeAt(++Index);}// Parse an integer or floating-point value.
if(charCode>=48&&charCode<=57){// Leading zeroes are interpreted as octal literals.
if(charCode==48&&(charCode=source.charCodeAt(Index+1),charCode>=48&&charCode<=57)){// Illegal octal literal.
abort();}isSigned=false;// Parse the integer component.
for(;Index<length&&(charCode=source.charCodeAt(Index),charCode>=48&&charCode<=57);Index++){}// Floats cannot contain a leading decimal point; however, this
// case is already accounted for by the parser.
if(source.charCodeAt(Index)==46){position=++Index;// Parse the decimal component.
for(;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++){}if(position==Index){// Illegal trailing decimal.
abort();}Index=position;}// Parse exponents. The `e` denoting the exponent is
// case-insensitive.
charCode=source.charCodeAt(Index);if(charCode==101||charCode==69){charCode=source.charCodeAt(++Index);// Skip past the sign following the exponent, if one is
// specified.
if(charCode==43||charCode==45){Index++;}// Parse the exponential component.
for(position=Index;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++){}if(position==Index){// Illegal empty exponent.
abort();}Index=position;}// Coerce the parsed value to a JavaScript number.
return+source.slice(begin,Index);}// A negative sign may only precede numbers.
if(isSigned){abort();}// `true`, `false`, and `null` literals.
if(source.slice(Index,Index+4)=="true"){Index+=4;return true;}else if(source.slice(Index,Index+5)=="false"){Index+=5;return false;}else if(source.slice(Index,Index+4)=="null"){Index+=4;return null;}// Unrecognized token.
abort();}}// Return the sentinel `$` character if the parser has reached the end
// of the source string.
return"$";};// Internal: Parses a JSON `value` token.
var get=function get(value){var results,hasMembers;if(value=="$"){// Unexpected end of input.
abort();}if(typeof value=="string"){if((charIndexBuggy?value.charAt(0):value[0])=="@"){// Remove the sentinel `@` character.
return value.slice(1);}// Parse object and array literals.
if(value=="["){// Parses a JSON array, returning a new JavaScript array.
results=[];for(;;hasMembers||(hasMembers=true)){value=lex();// A closing square bracket marks the end of the array literal.
if(value=="]"){break;}// If the array literal contains elements, the current token
// should be a comma separating the previous element from the
// next.
if(hasMembers){if(value==","){value=lex();if(value=="]"){// Unexpected trailing `,` in array literal.
abort();}}else{// A `,` must separate each array element.
abort();}}// Elisions and leading commas are not permitted.
if(value==","){abort();}results.push(get(value));}return results;}else if(value=="{"){// Parses a JSON object, returning a new JavaScript object.
results={};for(;;hasMembers||(hasMembers=true)){value=lex();// A closing curly brace marks the end of the object literal.
if(value=="}"){break;}// If the object literal contains members, the current token
// should be a comma separator.
if(hasMembers){if(value==","){value=lex();if(value=="}"){// Unexpected trailing `,` in object literal.
abort();}}else{// A `,` must separate each object member.
abort();}}// Leading commas are not permitted, object property names must be
// double-quoted strings, and a `:` must separate each property
// name and value.
if(value==","||typeof value!="string"||(charIndexBuggy?value.charAt(0):value[0])!="@"||lex()!=":"){abort();}results[value.slice(1)]=get(lex());}return results;}// Unexpected token encountered.
abort();}return value;};// Internal: Updates a traversed object member.
var update=function update(source,property,callback){var element=walk(source,property,callback);if(element===undef){delete source[property];}else{source[property]=element;}};// Internal: Recursively traverses a parsed JSON object, invoking the
// `callback` function for each value. This is an implementation of the
// `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
var walk=function walk(source,property,callback){var value=source[property],length;if((typeof value==="undefined"?"undefined":_typeof(value))=="object"&&value){// `forEach` can't be used to traverse an array in Opera <= 8.54
// because its `Object#hasOwnProperty` implementation returns `false`
// for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
if(getClass.call(value)==arrayClass){for(length=value.length;length--;){update(value,length,callback);}}else{_forEach(value,function(property){update(value,property,callback);});}}return callback.call(source,property,value);};// Public: `JSON.parse`. See ES 5.1 section 15.12.2.
exports.parse=function(source,callback){var result,value;Index=0;Source=""+source;result=get(lex());// If a JSON string contains multiple tokens, it is invalid.
if(lex()!="$"){abort();}// Reset the parser state.
Index=Source=null;return callback&&getClass.call(callback)==functionClass?walk((value={},value[""]=result,value),"",callback):result;};}}exports["runInContext"]=runInContext;return exports;}if(freeExports&&!isLoader){// Export for CommonJS environments.
runInContext(root,freeExports);}else{// Export for web browsers and JavaScript engines.
var nativeJSON=root.JSON,previousJSON=root["JSON3"],isRestored=false;var JSON3=runInContext(root,root["JSON3"]={// Public: Restores the original value of the global `JSON` object and
// returns a reference to the `JSON3` object.
"noConflict":function noConflict(){if(!isRestored){isRestored=true;root.JSON=nativeJSON;root["JSON3"]=previousJSON;nativeJSON=previousJSON=null;}return JSON3;}});root.JSON={"parse":JSON3.parse,"stringify":JSON3.stringify};}// Export for asynchronous module loaders.
if(isLoader){define(function(){return JSON3;});}}).call(this);}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],332:[function(require,module,exports){exports.RateLimiter=require('./lib/rateLimiter');exports.TokenBucket=require('./lib/tokenBucket');},{"./lib/rateLimiter":333,"./lib/tokenBucket":334}],333:[function(require,module,exports){(function(process){var TokenBucket=require('./tokenBucket');/**
 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
 * an additional check to limit how many tokens we can remove each interval.
 * @author John Hurliman <jhurliman@jhurliman.org>
 *
 * @param {Number} tokensPerInterval Maximum number of tokens that can be
 *  removed at any given moment and over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {Boolean} fireImmediately Optional. Whether or not the callback
 *  will fire immediately when rate limiting is in effect (default is false).
 */var RateLimiter=function RateLimiter(tokensPerInterval,interval,fireImmediately){this.tokenBucket=new TokenBucket(tokensPerInterval,tokensPerInterval,interval,null);// Fill the token bucket to start
this.tokenBucket.content=tokensPerInterval;this.curIntervalStart=+new Date();this.tokensThisInterval=0;this.fireImmediately=fireImmediately;};RateLimiter.prototype={tokenBucket:null,curIntervalStart:0,tokensThisInterval:0,fireImmediately:false,/**
   * Remove the requested number of tokens and fire the given callback. If the
   * rate limiter contains enough tokens and we haven't spent too many tokens
   * in this interval already, this will happen immediately. Otherwise, the
   * removal and callback will happen when enough tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */removeTokens:function removeTokens(count,callback){// Make sure the request isn't for more than we can handle
if(count>this.tokenBucket.bucketSize){process.nextTick(callback.bind(null,'Requested tokens '+count+' exceeds maximum tokens per interval '+this.tokenBucket.bucketSize,null));return false;}var self=this;var now=Date.now();// Advance the current interval and reset the current interval token count
// if needed
if(now-this.curIntervalStart>=this.tokenBucket.interval){this.curIntervalStart=now;this.tokensThisInterval=0;}// If we don't have enough tokens left in this interval, wait until the
// next interval
if(count>this.tokenBucket.tokensPerInterval-this.tokensThisInterval){if(this.fireImmediately){process.nextTick(callback.bind(null,null,-1));}else{var waitInterval=Math.ceil(this.curIntervalStart+this.tokenBucket.interval-now);setTimeout(function(){self.tokenBucket.removeTokens(count,afterTokensRemoved);},waitInterval);}return false;}// Remove the requested number of tokens from the token bucket
return this.tokenBucket.removeTokens(count,afterTokensRemoved);function afterTokensRemoved(err,tokensRemaining){if(err)return callback(err,null);self.tokensThisInterval+=count;callback(null,tokensRemaining);}},/**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens and we
   * haven't spent too many tokens in this interval already, this will return
   * true. Otherwise, false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */tryRemoveTokens:function tryRemoveTokens(count){// Make sure the request isn't for more than we can handle
if(count>this.tokenBucket.bucketSize)return false;var now=Date.now();// Advance the current interval and reset the current interval token count
// if needed
if(now-this.curIntervalStart>=this.tokenBucket.interval){this.curIntervalStart=now;this.tokensThisInterval=0;}// If we don't have enough tokens left in this interval, return false
if(count>this.tokenBucket.tokensPerInterval-this.tokensThisInterval)return false;// Try to remove the requested number of tokens from the token bucket
return this.tokenBucket.tryRemoveTokens(count);},/**
   * Returns the number of tokens remaining in the TokenBucket.
   * @returns {Number} The number of tokens remaining.
   */getTokensRemaining:function getTokensRemaining(){this.tokenBucket.drip();return this.tokenBucket.content;}};module.exports=RateLimiter;}).call(this,require('_process'));},{"./tokenBucket":334,"_process":413}],334:[function(require,module,exports){(function(process){/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 * @author John Hurliman <jhurliman@cull.tv>
 *
 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {TokenBucket} parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */var TokenBucket=function TokenBucket(bucketSize,tokensPerInterval,interval,parentBucket){this.bucketSize=bucketSize;this.tokensPerInterval=tokensPerInterval;if(typeof interval==='string'){switch(interval){case'sec':case'second':this.interval=1000;break;case'min':case'minute':this.interval=1000*60;break;case'hr':case'hour':this.interval=1000*60*60;break;case'day':this.interval=1000*60*60*24;break;}}else{this.interval=interval;}this.parentBucket=parentBucket;this.content=0;this.lastDrip=+new Date();};TokenBucket.prototype={bucketSize:1,tokensPerInterval:1,interval:1000,parentBucket:null,content:0,lastDrip:0,/**
   * Remove the requested number of tokens and fire the given callback. If the
   * bucket (and any parent buckets) contains enough tokens this will happen
   * immediately. Otherwise, the removal and callback will happen when enough
   * tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */removeTokens:function removeTokens(count,callback){var self=this;// Is this an infinite size bucket?
if(!this.bucketSize){process.nextTick(callback.bind(null,null,count,Number.POSITIVE_INFINITY));return true;}// Make sure the bucket can hold the requested number of tokens
if(count>this.bucketSize){process.nextTick(callback.bind(null,'Requested tokens '+count+' exceeds bucket size '+this.bucketSize,null));return false;}// Drip new tokens into this bucket
this.drip();// If we don't have enough tokens in this bucket, come back later
if(count>this.content)return comeBackLater();if(this.parentBucket){// Remove the requested from the parent bucket first
return this.parentBucket.removeTokens(count,function(err,remainingTokens){if(err)return callback(err,null);// Check that we still have enough tokens in this bucket
if(count>self.content)return comeBackLater();// Tokens were removed from the parent bucket, now remove them from
// this bucket and fire the callback. Note that we look at the current
// bucket and parent bucket's remaining tokens and return the smaller
// of the two values
self.content-=count;callback(null,Math.min(remainingTokens,self.content));});}else{// Remove the requested tokens from this bucket and fire the callback
this.content-=count;process.nextTick(callback.bind(null,null,this.content));return true;}function comeBackLater(){// How long do we need to wait to make up the difference in tokens?
var waitInterval=Math.ceil((count-self.content)*(self.interval/self.tokensPerInterval));setTimeout(function(){self.removeTokens(count,callback);},waitInterval);return false;}},/**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens this will
   * return true, otherwise false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */tryRemoveTokens:function tryRemoveTokens(count){// Is this an infinite size bucket?
if(!this.bucketSize)return true;// Make sure the bucket can hold the requested number of tokens
if(count>this.bucketSize)return false;// Drip new tokens into this bucket
this.drip();// If we don't have enough tokens in this bucket, return false
if(count>this.content)return false;// Try to remove the requested tokens from the parent bucket
if(this.parentBucket&&!this.parent.tryRemoveTokens(count))return false;// Remove the requested tokens from this bucket and return
this.content-=count;return true;},/**
   * Add any new tokens to the bucket since the last drip.
   * @returns {Boolean} True if new tokens were added, otherwise false.
   */drip:function drip(){if(!this.tokensPerInterval){this.content=this.bucketSize;return;}var now=+new Date();var deltaMS=Math.max(now-this.lastDrip,0);this.lastDrip=now;var dripAmount=deltaMS*(this.tokensPerInterval/this.interval);this.content=Math.min(this.content+dripAmount,this.bucketSize);}};module.exports=TokenBucket;}).call(this,require('_process'));},{"_process":413}],335:[function(require,module,exports){/**
 * Helpers.
 */var s=1000;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */module.exports=function(val,options){options=options||{};var type=typeof val==="undefined"?"undefined":_typeof(val);if(type==='string'&&val.length>0){return parse(val);}else if(type==='number'&&isNaN(val)===false){return options.long?fmtLong(val):fmtShort(val);}throw new Error('val is not a non-empty string or a valid number. val='+JSON.stringify(val));};/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */function parse(str){str=String(str);if(str.length>10000){return;}var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match){return;}var n=parseFloat(match[1]);var type=(match[2]||'ms').toLowerCase();switch(type){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n;default:return undefined;}}/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtShort(ms){if(ms>=d){return Math.round(ms/d)+'d';}if(ms>=h){return Math.round(ms/h)+'h';}if(ms>=m){return Math.round(ms/m)+'m';}if(ms>=s){return Math.round(ms/s)+'s';}return ms+'ms';}/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtLong(ms){return plural(ms,d,'day')||plural(ms,h,'hour')||plural(ms,m,'minute')||plural(ms,s,'second')||ms+' ms';}/**
 * Pluralization helper.
 */function plural(ms,n,name){if(ms<n){return;}if(ms<n*1.5){return Math.floor(ms/n)+' '+name;}return Math.ceil(ms/n)+' '+name+'s';}},{}],336:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj){keys.push(key);}return keys;};/*</replacement>*/module.exports=Duplex;/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/var Readable=require('./_stream_readable');var Writable=require('./_stream_writable');util.inherits(Duplex,Readable);var keys=objectKeys(Writable.prototype);for(var v=0;v<keys.length;v++){var method=keys[v];if(!Duplex.prototype[method])Duplex.prototype[method]=Writable.prototype[method];}function Duplex(options){if(!(this instanceof Duplex))return new Duplex(options);Readable.call(this,options);Writable.call(this,options);if(options&&options.readable===false)this.readable=false;if(options&&options.writable===false)this.writable=false;this.allowHalfOpen=true;if(options&&options.allowHalfOpen===false)this.allowHalfOpen=false;this.once('end',onend);}// the no-half-open enforcer
function onend(){// if we allow half-open state, or if the writable side ended,
// then we're ok.
if(this.allowHalfOpen||this._writableState.ended)return;// no more data can be written.
// But allow more writes to happen in this tick.
processNextTick(onEndNT,this);}function onEndNT(self){self.end();}Object.defineProperty(Duplex.prototype,'destroyed',{get:function get(){if(this._readableState===undefined||this._writableState===undefined){return false;}return this._readableState.destroyed&&this._writableState.destroyed;},set:function set(value){// we ignore the value if the stream
// has not been initialized yet
if(this._readableState===undefined||this._writableState===undefined){return;}// backward compatibility, the user is explicitly
// managing destroyed
this._readableState.destroyed=value;this._writableState.destroyed=value;}});Duplex.prototype._destroy=function(err,cb){this.push(null);this.end();processNextTick(cb,err);};function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i);}}},{"./_stream_readable":338,"./_stream_writable":340,"core-util-is":305,"inherits":329,"process-nextick-args":350}],337:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';module.exports=PassThrough;var Transform=require('./_stream_transform');/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/util.inherits(PassThrough,Transform);function PassThrough(options){if(!(this instanceof PassThrough))return new PassThrough(options);Transform.call(this,options);}PassThrough.prototype._transform=function(chunk,encoding,cb){cb(null,chunk);};},{"./_stream_transform":339,"core-util-is":305,"inherits":329}],338:[function(require,module,exports){(function(process,global){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*/module.exports=Readable;/*<replacement>*/var isArray=require('isarray');/*</replacement>*//*<replacement>*/var Duplex;/*</replacement>*/Readable.ReadableState=ReadableState;/*<replacement>*/var EE=require('events').EventEmitter;var EElistenerCount=function EElistenerCount(emitter,type){return emitter.listeners(type).length;};/*</replacement>*//*<replacement>*/var Stream=require('./internal/streams/stream');/*</replacement>*/// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/var Buffer=require('safe-buffer').Buffer;var OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(chunk){return Buffer.from(chunk);}function _isUint8Array(obj){return Buffer.isBuffer(obj)||obj instanceof OurUint8Array;}/*</replacement>*//*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var debugUtil=require('util');var debug=void 0;if(debugUtil&&debugUtil.debuglog){debug=debugUtil.debuglog('stream');}else{debug=function debug(){};}/*</replacement>*/var BufferList=require('./internal/streams/BufferList');var destroyImpl=require('./internal/streams/destroy');var StringDecoder;util.inherits(Readable,Stream);var kProxyEvents=['error','close','destroy','pause','resume'];function prependListener(emitter,event,fn){// Sadly this is not cacheable as some libraries bundle their own
// event emitter implementation with them.
if(typeof emitter.prependListener==='function'){return emitter.prependListener(event,fn);}else{// This is a hack to make sure that our error handler is attached before any
// userland ones.  NEVER DO THIS. This is here only because this code needs
// to continue to work with older versions of Node.js that do not include
// the prependListener() method. The goal is to eventually remove this hack.
if(!emitter._events||!emitter._events[event])emitter.on(event,fn);else if(isArray(emitter._events[event]))emitter._events[event].unshift(fn);else emitter._events[event]=[fn,emitter._events[event]];}}function ReadableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag. Used to make read(n) ignore n and to
// make all the buffer merging and length checks go away
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.readableObjectMode;// the point at which it stops calling _read() to fill the buffer
// Note: 0 is a valid value, means "don't call _read preemptively ever"
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=Math.floor(this.highWaterMark);// A linked list is used to store data chunks instead of an array because the
// linked list can remove elements from the beginning faster than
// array.shift()
this.buffer=new BufferList();this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.ended=false;this.endEmitted=false;this.reading=false;// a flag to be able to tell if the event 'readable'/'data' is emitted
// immediately, or on a later tick.  We set this to true at first, because
// any actions that shouldn't happen until "later" should generally also
// not happen before the first read call.
this.sync=true;// whenever we return null, then we set a flag to say
// that we're awaiting a 'readable' event emission.
this.needReadable=false;this.emittedReadable=false;this.readableListening=false;this.resumeScheduled=false;// has it been destroyed
this.destroyed=false;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// the number of writers that are awaiting a drain event in .pipe()s
this.awaitDrain=0;// if true, a maybeReadMore has been scheduled
this.readingMore=false;this.decoder=null;this.encoding=null;if(options.encoding){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this.decoder=new StringDecoder(options.encoding);this.encoding=options.encoding;}}function Readable(options){Duplex=Duplex||require('./_stream_duplex');if(!(this instanceof Readable))return new Readable(options);this._readableState=new ReadableState(options,this);// legacy
this.readable=true;if(options){if(typeof options.read==='function')this._read=options.read;if(typeof options.destroy==='function')this._destroy=options.destroy;}Stream.call(this);}Object.defineProperty(Readable.prototype,'destroyed',{get:function get(){if(this._readableState===undefined){return false;}return this._readableState.destroyed;},set:function set(value){// we ignore the value if the stream
// has not been initialized yet
if(!this._readableState){return;}// backward compatibility, the user is explicitly
// managing destroyed
this._readableState.destroyed=value;}});Readable.prototype.destroy=destroyImpl.destroy;Readable.prototype._undestroy=destroyImpl.undestroy;Readable.prototype._destroy=function(err,cb){this.push(null);cb(err);};// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push=function(chunk,encoding){var state=this._readableState;var skipChunkCheck;if(!state.objectMode){if(typeof chunk==='string'){encoding=encoding||state.defaultEncoding;if(encoding!==state.encoding){chunk=Buffer.from(chunk,encoding);encoding='';}skipChunkCheck=true;}}else{skipChunkCheck=true;}return readableAddChunk(this,chunk,encoding,false,skipChunkCheck);};// Unshift should *always* be something directly out of read()
Readable.prototype.unshift=function(chunk){return readableAddChunk(this,chunk,null,true,false);};function readableAddChunk(stream,chunk,encoding,addToFront,skipChunkCheck){var state=stream._readableState;if(chunk===null){state.reading=false;onEofChunk(stream,state);}else{var er;if(!skipChunkCheck)er=chunkInvalid(state,chunk);if(er){stream.emit('error',er);}else if(state.objectMode||chunk&&chunk.length>0){if(typeof chunk!=='string'&&!state.objectMode&&Object.getPrototypeOf(chunk)!==Buffer.prototype){chunk=_uint8ArrayToBuffer(chunk);}if(addToFront){if(state.endEmitted)stream.emit('error',new Error('stream.unshift() after end event'));else addChunk(stream,state,chunk,true);}else if(state.ended){stream.emit('error',new Error('stream.push() after EOF'));}else{state.reading=false;if(state.decoder&&!encoding){chunk=state.decoder.write(chunk);if(state.objectMode||chunk.length!==0)addChunk(stream,state,chunk,false);else maybeReadMore(stream,state);}else{addChunk(stream,state,chunk,false);}}}else if(!addToFront){state.reading=false;}}return needMoreData(state);}function addChunk(stream,state,chunk,addToFront){if(state.flowing&&state.length===0&&!state.sync){stream.emit('data',chunk);stream.read(0);}else{// update the buffer info.
state.length+=state.objectMode?1:chunk.length;if(addToFront)state.buffer.unshift(chunk);else state.buffer.push(chunk);if(state.needReadable)emitReadable(stream);}maybeReadMore(stream,state);}function chunkInvalid(state,chunk){var er;if(!_isUint8Array(chunk)&&typeof chunk!=='string'&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}return er;}// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state){return!state.ended&&(state.needReadable||state.length<state.highWaterMark||state.length===0);}Readable.prototype.isPaused=function(){return this._readableState.flowing===false;};// backwards compatibility.
Readable.prototype.setEncoding=function(enc){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this._readableState.decoder=new StringDecoder(enc);this._readableState.encoding=enc;return this;};// Don't raise the hwm > 8MB
var MAX_HWM=0x800000;function computeNewHighWaterMark(n){if(n>=MAX_HWM){n=MAX_HWM;}else{// Get the next highest power of 2 to prevent increasing hwm excessively in
// tiny amounts
n--;n|=n>>>1;n|=n>>>2;n|=n>>>4;n|=n>>>8;n|=n>>>16;n++;}return n;}// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n,state){if(n<=0||state.length===0&&state.ended)return 0;if(state.objectMode)return 1;if(n!==n){// Only flow one buffer at a time
if(state.flowing&&state.length)return state.buffer.head.data.length;else return state.length;}// If we're asking for more than the current hwm, then raise the hwm.
if(n>state.highWaterMark)state.highWaterMark=computeNewHighWaterMark(n);if(n<=state.length)return n;// Don't have enough
if(!state.ended){state.needReadable=true;return 0;}return state.length;}// you can override either this method, or the async _read(n) below.
Readable.prototype.read=function(n){debug('read',n);n=parseInt(n,10);var state=this._readableState;var nOrig=n;if(n!==0)state.emittedReadable=false;// if we're doing read(0) to trigger a readable event, but we
// already have a bunch of data in the buffer, then just trigger
// the 'readable' event and move on.
if(n===0&&state.needReadable&&(state.length>=state.highWaterMark||state.ended)){debug('read: emitReadable',state.length,state.ended);if(state.length===0&&state.ended)endReadable(this);else emitReadable(this);return null;}n=howMuchToRead(n,state);// if we've ended, and we're now clear, then finish it up.
if(n===0&&state.ended){if(state.length===0)endReadable(this);return null;}// All the actual chunk generation logic needs to be
// *below* the call to _read.  The reason is that in certain
// synthetic stream cases, such as passthrough streams, _read
// may be a completely synchronous operation which may change
// the state of the read buffer, providing enough data when
// before there was *not* enough.
//
// So, the steps are:
// 1. Figure out what the state of things will be after we do
// a read from the buffer.
//
// 2. If that resulting state will trigger a _read, then call _read.
// Note that this may be asynchronous, or synchronous.  Yes, it is
// deeply ugly to write APIs this way, but that still doesn't mean
// that the Readable class should behave improperly, as streams are
// designed to be sync/async agnostic.
// Take note if the _read call is sync or async (ie, if the read call
// has returned yet), so that we know whether or not it's safe to emit
// 'readable' etc.
//
// 3. Actually pull the requested chunks out of the buffer and return.
// if we need a readable event, then we need to do some reading.
var doRead=state.needReadable;debug('need readable',doRead);// if we currently have less than the highWaterMark, then also read some
if(state.length===0||state.length-n<state.highWaterMark){doRead=true;debug('length less than watermark',doRead);}// however, if we've ended, then there's no point, and if we're already
// reading, then it's unnecessary.
if(state.ended||state.reading){doRead=false;debug('reading or ended',doRead);}else if(doRead){debug('do read');state.reading=true;state.sync=true;// if the length is currently zero, then we *need* a readable event.
if(state.length===0)state.needReadable=true;// call internal read method
this._read(state.highWaterMark);state.sync=false;// If _read pushed data synchronously, then `reading` will be false,
// and we need to re-evaluate how much data we can return to the user.
if(!state.reading)n=howMuchToRead(nOrig,state);}var ret;if(n>0)ret=fromList(n,state);else ret=null;if(ret===null){state.needReadable=true;n=0;}else{state.length-=n;}if(state.length===0){// If we have nothing in the buffer, then we want to know
// as soon as we *do* get something into the buffer.
if(!state.ended)state.needReadable=true;// If we tried to read() past the EOF, then emit end on the next tick.
if(nOrig!==n&&state.ended)endReadable(this);}if(ret!==null)this.emit('data',ret);return ret;};function onEofChunk(stream,state){if(state.ended)return;if(state.decoder){var chunk=state.decoder.end();if(chunk&&chunk.length){state.buffer.push(chunk);state.length+=state.objectMode?1:chunk.length;}}state.ended=true;// emit 'readable' now to make sure it gets picked up.
emitReadable(stream);}// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream){var state=stream._readableState;state.needReadable=false;if(!state.emittedReadable){debug('emitReadable',state.flowing);state.emittedReadable=true;if(state.sync)processNextTick(emitReadable_,stream);else emitReadable_(stream);}}function emitReadable_(stream){debug('emit readable');stream.emit('readable');flow(stream);}// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream,state){if(!state.readingMore){state.readingMore=true;processNextTick(maybeReadMore_,stream,state);}}function maybeReadMore_(stream,state){var len=state.length;while(!state.reading&&!state.flowing&&!state.ended&&state.length<state.highWaterMark){debug('maybeReadMore read 0');stream.read(0);if(len===state.length)// didn't get any data, stop spinning.
break;else len=state.length;}state.readingMore=false;}// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read=function(n){this.emit('error',new Error('_read() is not implemented'));};Readable.prototype.pipe=function(dest,pipeOpts){var src=this;var state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest);break;}state.pipesCount+=1;debug('pipe count=%d opts=%j',state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==false)&&dest!==process.stdout&&dest!==process.stderr;var endFn=doEnd?onend:unpipe;if(state.endEmitted)processNextTick(endFn);else src.once('end',endFn);dest.on('unpipe',onunpipe);function onunpipe(readable,unpipeInfo){debug('onunpipe');if(readable===src){if(unpipeInfo&&unpipeInfo.hasUnpiped===false){unpipeInfo.hasUnpiped=true;cleanup();}}}function onend(){debug('onend');dest.end();}// when the dest drains, it reduces the awaitDrain counter
// on the source.  This would be more elegant with a .once()
// handler in flow(), but adding and removing repeatedly is
// too slow.
var ondrain=pipeOnDrain(src);dest.on('drain',ondrain);var cleanedUp=false;function cleanup(){debug('cleanup');// cleanup event handlers once the pipe is broken
dest.removeListener('close',onclose);dest.removeListener('finish',onfinish);dest.removeListener('drain',ondrain);dest.removeListener('error',onerror);dest.removeListener('unpipe',onunpipe);src.removeListener('end',onend);src.removeListener('end',unpipe);src.removeListener('data',ondata);cleanedUp=true;// if the reader is waiting for a drain event from this
// specific writer, then it would cause it to never start
// flowing again.
// So, if this is awaiting a drain, then we just call it now.
// If we don't know, then assume that we are waiting for one.
if(state.awaitDrain&&(!dest._writableState||dest._writableState.needDrain))ondrain();}// If the user pushes more data while we're writing to dest then we'll end up
// in ondata again. However, we only want to increase awaitDrain once because
// dest will only emit one 'drain' event for the multiple writes.
// => Introduce a guard on increasing awaitDrain.
var increasedAwaitDrain=false;src.on('data',ondata);function ondata(chunk){debug('ondata');increasedAwaitDrain=false;var ret=dest.write(chunk);if(false===ret&&!increasedAwaitDrain){// If the user unpiped during `dest.write()`, it is possible
// to get stuck in a permanently paused state if that write
// also returned false.
// => Check whether `dest` is still a piping destination.
if((state.pipesCount===1&&state.pipes===dest||state.pipesCount>1&&indexOf(state.pipes,dest)!==-1)&&!cleanedUp){debug('false write response, pause',src._readableState.awaitDrain);src._readableState.awaitDrain++;increasedAwaitDrain=true;}src.pause();}}// if the dest has an error, then stop piping into it.
// however, don't suppress the throwing behavior for this.
function onerror(er){debug('onerror',er);unpipe();dest.removeListener('error',onerror);if(EElistenerCount(dest,'error')===0)dest.emit('error',er);}// Make sure our error handler is attached before userland ones.
prependListener(dest,'error',onerror);// Both close and finish should trigger unpipe, but only once.
function onclose(){dest.removeListener('finish',onfinish);unpipe();}dest.once('close',onclose);function onfinish(){debug('onfinish');dest.removeListener('close',onclose);unpipe();}dest.once('finish',onfinish);function unpipe(){debug('unpipe');src.unpipe(dest);}// tell the dest that it's being piped to
dest.emit('pipe',src);// start the flow if it hasn't been started already.
if(!state.flowing){debug('pipe resume');src.resume();}return dest;};function pipeOnDrain(src){return function(){var state=src._readableState;debug('pipeOnDrain',state.awaitDrain);if(state.awaitDrain)state.awaitDrain--;if(state.awaitDrain===0&&EElistenerCount(src,'data')){state.flowing=true;flow(src);}};}Readable.prototype.unpipe=function(dest){var state=this._readableState;var unpipeInfo={hasUnpiped:false};// if we're not piping anywhere, then do nothing.
if(state.pipesCount===0)return this;// just one destination.  most common case.
if(state.pipesCount===1){// passed in one, but it's not the right one.
if(dest&&dest!==state.pipes)return this;if(!dest)dest=state.pipes;// got a match.
state.pipes=null;state.pipesCount=0;state.flowing=false;if(dest)dest.emit('unpipe',this,unpipeInfo);return this;}// slow case. multiple pipe destinations.
if(!dest){// remove all.
var dests=state.pipes;var len=state.pipesCount;state.pipes=null;state.pipesCount=0;state.flowing=false;for(var i=0;i<len;i++){dests[i].emit('unpipe',this,unpipeInfo);}return this;}// try to find the right one.
var index=indexOf(state.pipes,dest);if(index===-1)return this;state.pipes.splice(index,1);state.pipesCount-=1;if(state.pipesCount===1)state.pipes=state.pipes[0];dest.emit('unpipe',this,unpipeInfo);return this;};// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);if(ev==='data'){// Start flowing on next tick if stream isn't explicitly paused
if(this._readableState.flowing!==false)this.resume();}else if(ev==='readable'){var state=this._readableState;if(!state.endEmitted&&!state.readableListening){state.readableListening=state.needReadable=true;state.emittedReadable=false;if(!state.reading){processNextTick(nReadingNextTick,this);}else if(state.length){emitReadable(this);}}}return res;};Readable.prototype.addListener=Readable.prototype.on;function nReadingNextTick(self){debug('readable nexttick read 0');self.read(0);}// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume=function(){var state=this._readableState;if(!state.flowing){debug('resume');state.flowing=true;resume(this,state);}return this;};function resume(stream,state){if(!state.resumeScheduled){state.resumeScheduled=true;processNextTick(resume_,stream,state);}}function resume_(stream,state){if(!state.reading){debug('resume read 0');stream.read(0);}state.resumeScheduled=false;state.awaitDrain=0;stream.emit('resume');flow(stream);if(state.flowing&&!state.reading)stream.read(0);}Readable.prototype.pause=function(){debug('call pause flowing=%j',this._readableState.flowing);if(false!==this._readableState.flowing){debug('pause');this._readableState.flowing=false;this.emit('pause');}return this;};function flow(stream){var state=stream._readableState;debug('flow',state.flowing);while(state.flowing&&stream.read()!==null){}}// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap=function(stream){var state=this._readableState;var paused=false;var self=this;stream.on('end',function(){debug('wrapped end');if(state.decoder&&!state.ended){var chunk=state.decoder.end();if(chunk&&chunk.length)self.push(chunk);}self.push(null);});stream.on('data',function(chunk){debug('wrapped data');if(state.decoder)chunk=state.decoder.write(chunk);// don't skip over falsy values in objectMode
if(state.objectMode&&(chunk===null||chunk===undefined))return;else if(!state.objectMode&&(!chunk||!chunk.length))return;var ret=self.push(chunk);if(!ret){paused=true;stream.pause();}});// proxy all the other methods.
// important when wrapping filters and duplexes.
for(var i in stream){if(this[i]===undefined&&typeof stream[i]==='function'){this[i]=function(method){return function(){return stream[method].apply(stream,arguments);};}(i);}}// proxy certain important events.
for(var n=0;n<kProxyEvents.length;n++){stream.on(kProxyEvents[n],self.emit.bind(self,kProxyEvents[n]));}// when we try to consume some more bytes, simply unpause the
// underlying stream.
self._read=function(n){debug('wrapped _read',n);if(paused){paused=false;stream.resume();}};return self;};// exposed for testing purposes only.
Readable._fromList=fromList;// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n,state){// nothing buffered
if(state.length===0)return null;var ret;if(state.objectMode)ret=state.buffer.shift();else if(!n||n>=state.length){// read it all, truncate the list
if(state.decoder)ret=state.buffer.join('');else if(state.buffer.length===1)ret=state.buffer.head.data;else ret=state.buffer.concat(state.length);state.buffer.clear();}else{// read part of list
ret=fromListPartial(n,state.buffer,state.decoder);}return ret;}// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n,list,hasStrings){var ret;if(n<list.head.data.length){// slice is the same for buffers and strings
ret=list.head.data.slice(0,n);list.head.data=list.head.data.slice(n);}else if(n===list.head.data.length){// first chunk is a perfect match
ret=list.shift();}else{// result spans more than one buffer
ret=hasStrings?copyFromBufferString(n,list):copyFromBuffer(n,list);}return ret;}// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n,list){var p=list.head;var c=1;var ret=p.data;n-=ret.length;while(p=p.next){var str=p.data;var nb=n>str.length?str.length:n;if(nb===str.length)ret+=str;else ret+=str.slice(0,n);n-=nb;if(n===0){if(nb===str.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=str.slice(nb);}break;}++c;}list.length-=c;return ret;}// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n,list){var ret=Buffer.allocUnsafe(n);var p=list.head;var c=1;p.data.copy(ret);n-=p.data.length;while(p=p.next){var buf=p.data;var nb=n>buf.length?buf.length:n;buf.copy(ret,ret.length-n,0,nb);n-=nb;if(n===0){if(nb===buf.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=buf.slice(nb);}break;}++c;}list.length-=c;return ret;}function endReadable(stream){var state=stream._readableState;// If we get here before consuming all the bytes, then that is a
// bug in node.  Should never happen.
if(state.length>0)throw new Error('"endReadable()" called on non-empty stream');if(!state.endEmitted){state.ended=true;processNextTick(endReadableNT,state,stream);}}function endReadableNT(state,stream){// Check that we didn't get one last unshift.
if(!state.endEmitted&&state.length===0){state.endEmitted=true;stream.readable=false;stream.emit('end');}}function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i);}}function indexOf(xs,x){for(var i=0,l=xs.length;i<l;i++){if(xs[i]===x)return i;}return-1;}}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./_stream_duplex":336,"./internal/streams/BufferList":341,"./internal/streams/destroy":342,"./internal/streams/stream":343,"_process":413,"core-util-is":305,"events":407,"inherits":329,"isarray":330,"process-nextick-args":350,"safe-buffer":360,"string_decoder/":345,"util":403}],339:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';module.exports=Transform;var Duplex=require('./_stream_duplex');/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/util.inherits(Transform,Duplex);function TransformState(stream){this.afterTransform=function(er,data){return afterTransform(stream,er,data);};this.needTransform=false;this.transforming=false;this.writecb=null;this.writechunk=null;this.writeencoding=null;}function afterTransform(stream,er,data){var ts=stream._transformState;ts.transforming=false;var cb=ts.writecb;if(!cb){return stream.emit('error',new Error('write callback called multiple times'));}ts.writechunk=null;ts.writecb=null;if(data!==null&&data!==undefined)stream.push(data);cb(er);var rs=stream._readableState;rs.reading=false;if(rs.needReadable||rs.length<rs.highWaterMark){stream._read(rs.highWaterMark);}}function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options);this._transformState=new TransformState(this);var stream=this;// start out asking for a readable event once data is transformed.
this._readableState.needReadable=true;// we have implemented the _read method, and done the other things
// that Readable wants before the first _read call, so unset the
// sync guard flag.
this._readableState.sync=false;if(options){if(typeof options.transform==='function')this._transform=options.transform;if(typeof options.flush==='function')this._flush=options.flush;}// When the writable side finishes, then flush out anything remaining.
this.once('prefinish',function(){if(typeof this._flush==='function')this._flush(function(er,data){done(stream,er,data);});else done(stream);});}Transform.prototype.push=function(chunk,encoding){this._transformState.needTransform=false;return Duplex.prototype.push.call(this,chunk,encoding);};// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform=function(chunk,encoding,cb){throw new Error('_transform() is not implemented');};Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;ts.writecb=cb;ts.writechunk=chunk;ts.writeencoding=encoding;if(!ts.transforming){var rs=this._readableState;if(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)this._read(rs.highWaterMark);}};// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read=function(n){var ts=this._transformState;if(ts.writechunk!==null&&ts.writecb&&!ts.transforming){ts.transforming=true;this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform);}else{// mark that we need a transform, so that any data that comes in
// will get processed, now that we've asked for it.
ts.needTransform=true;}};Transform.prototype._destroy=function(err,cb){var _this=this;Duplex.prototype._destroy.call(this,err,function(err2){cb(err2);_this.emit('close');});};function done(stream,er,data){if(er)return stream.emit('error',er);if(data!==null&&data!==undefined)stream.push(data);// if there's nothing in the write buffer, then that means
// that nothing more will ever be provided
var ws=stream._writableState;var ts=stream._transformState;if(ws.length)throw new Error('Calling transform done when ws.length != 0');if(ts.transforming)throw new Error('Calling transform done when still transforming');return stream.push(null);}},{"./_stream_duplex":336,"core-util-is":305,"inherits":329}],340:[function(require,module,exports){(function(process,global){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*/module.exports=Writable;/* <replacement> */function WriteReq(chunk,encoding,cb){this.chunk=chunk;this.encoding=encoding;this.callback=cb;this.next=null;}// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state){var _this=this;this.next=null;this.entry=null;this.finish=function(){onCorkedFinish(_this,state);};}/* </replacement> *//*<replacement>*/var asyncWrite=!process.browser&&['v0.10','v0.9.'].indexOf(process.version.slice(0,5))>-1?setImmediate:processNextTick;/*</replacement>*//*<replacement>*/var Duplex;/*</replacement>*/Writable.WritableState=WritableState;/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var internalUtil={deprecate:require('util-deprecate')};/*</replacement>*//*<replacement>*/var Stream=require('./internal/streams/stream');/*</replacement>*//*<replacement>*/var Buffer=require('safe-buffer').Buffer;var OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(chunk){return Buffer.from(chunk);}function _isUint8Array(obj){return Buffer.isBuffer(obj)||obj instanceof OurUint8Array;}/*</replacement>*/var destroyImpl=require('./internal/streams/destroy');util.inherits(Writable,Stream);function nop(){}function WritableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag to indicate whether or not this stream
// contains buffers or objects.
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.writableObjectMode;// the point at which write() starts returning false
// Note: 0 is a valid value, means that we always return false if
// the entire buffer is not flushed immediately on write()
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=Math.floor(this.highWaterMark);// if _final has been called
this.finalCalled=false;// drain event flag.
this.needDrain=false;// at the start of calling end()
this.ending=false;// when end() has been called, and returned
this.ended=false;// when 'finish' is emitted
this.finished=false;// has it been destroyed
this.destroyed=false;// should we decode strings into buffers before passing to _write?
// this is here so that some node-core streams can optimize string
// handling at a lower level.
var noDecode=options.decodeStrings===false;this.decodeStrings=!noDecode;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// not an actual buffer we keep track of, but a measurement
// of how much we're waiting to get pushed to some underlying
// socket or file.
this.length=0;// a flag to see when we're in the middle of a write.
this.writing=false;// when true all writes will be buffered until .uncork() call
this.corked=0;// a flag to be able to tell if the onwrite cb is called immediately,
// or on a later tick.  We set this to true at first, because any
// actions that shouldn't happen until "later" should generally also
// not happen before the first write call.
this.sync=true;// a flag to know if we're processing previously buffered items, which
// may call the _write() callback in the same tick, so that we don't
// end up in an overlapped onwrite situation.
this.bufferProcessing=false;// the callback that's passed to _write(chunk,cb)
this.onwrite=function(er){onwrite(stream,er);};// the callback that the user supplies to write(chunk,encoding,cb)
this.writecb=null;// the amount that is being written when _write is called.
this.writelen=0;this.bufferedRequest=null;this.lastBufferedRequest=null;// number of pending user-supplied write callbacks
// this must be 0 before 'finish' can be emitted
this.pendingcb=0;// emit prefinish if the only thing we're waiting for is _write cbs
// This is relevant for synchronous Transform streams
this.prefinished=false;// True if the error was already emitted and should not be thrown again
this.errorEmitted=false;// count buffered requests
this.bufferedRequestCount=0;// allocate the first CorkedRequest, there is always
// one allocated and free to use, and we maintain at most two
this.corkedRequestsFree=new CorkedRequest(this);}WritableState.prototype.getBuffer=function getBuffer(){var current=this.bufferedRequest;var out=[];while(current){out.push(current);current=current.next;}return out;};(function(){try{Object.defineProperty(WritableState.prototype,'buffer',{get:internalUtil.deprecate(function(){return this.getBuffer();},'_writableState.buffer is deprecated. Use _writableState.getBuffer '+'instead.','DEP0003')});}catch(_){}})();// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;if(typeof Symbol==='function'&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]==='function'){realHasInstance=Function.prototype[Symbol.hasInstance];Object.defineProperty(Writable,Symbol.hasInstance,{value:function value(object){if(realHasInstance.call(this,object))return true;return object&&object._writableState instanceof WritableState;}});}else{realHasInstance=function realHasInstance(object){return object instanceof this;};}function Writable(options){Duplex=Duplex||require('./_stream_duplex');// Writable ctor is applied to Duplexes, too.
// `realHasInstance` is necessary because using plain `instanceof`
// would return false, as no `_writableState` property is attached.
// Trying to use the custom `instanceof` for Writable here will also break the
// Node.js LazyTransform implementation, which has a non-trivial getter for
// `_writableState` that would lead to infinite recursion.
if(!realHasInstance.call(Writable,this)&&!(this instanceof Duplex)){return new Writable(options);}this._writableState=new WritableState(options,this);// legacy.
this.writable=true;if(options){if(typeof options.write==='function')this._write=options.write;if(typeof options.writev==='function')this._writev=options.writev;if(typeof options.destroy==='function')this._destroy=options.destroy;if(typeof options.final==='function')this._final=options.final;}Stream.call(this);}// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe=function(){this.emit('error',new Error('Cannot pipe, not readable'));};function writeAfterEnd(stream,cb){var er=new Error('write after end');// TODO: defer error events consistently everywhere, not just the cb
stream.emit('error',er);processNextTick(cb,er);}// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream,state,chunk,cb){var valid=true;var er=false;if(chunk===null){er=new TypeError('May not write null values to stream');}else if(typeof chunk!=='string'&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}if(er){stream.emit('error',er);processNextTick(cb,er);valid=false;}return valid;}Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState;var ret=false;var isBuf=_isUint8Array(chunk)&&!state.objectMode;if(isBuf&&!Buffer.isBuffer(chunk)){chunk=_uint8ArrayToBuffer(chunk);}if(typeof encoding==='function'){cb=encoding;encoding=null;}if(isBuf)encoding='buffer';else if(!encoding)encoding=state.defaultEncoding;if(typeof cb!=='function')cb=nop;if(state.ended)writeAfterEnd(this,cb);else if(isBuf||validChunk(this,state,chunk,cb)){state.pendingcb++;ret=writeOrBuffer(this,state,isBuf,chunk,encoding,cb);}return ret;};Writable.prototype.cork=function(){var state=this._writableState;state.corked++;};Writable.prototype.uncork=function(){var state=this._writableState;if(state.corked){state.corked--;if(!state.writing&&!state.corked&&!state.finished&&!state.bufferProcessing&&state.bufferedRequest)clearBuffer(this,state);}};Writable.prototype.setDefaultEncoding=function setDefaultEncoding(encoding){// node::ParseEncoding() requires lower case.
if(typeof encoding==='string')encoding=encoding.toLowerCase();if(!(['hex','utf8','utf-8','ascii','binary','base64','ucs2','ucs-2','utf16le','utf-16le','raw'].indexOf((encoding+'').toLowerCase())>-1))throw new TypeError('Unknown encoding: '+encoding);this._writableState.defaultEncoding=encoding;return this;};function decodeChunk(state,chunk,encoding){if(!state.objectMode&&state.decodeStrings!==false&&typeof chunk==='string'){chunk=Buffer.from(chunk,encoding);}return chunk;}// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream,state,isBuf,chunk,encoding,cb){if(!isBuf){var newChunk=decodeChunk(state,chunk,encoding);if(chunk!==newChunk){isBuf=true;encoding='buffer';chunk=newChunk;}}var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;// we must ensure that previous needDrain will not be reset to false.
if(!ret)state.needDrain=true;if(state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest={chunk:chunk,encoding:encoding,isBuf:isBuf,callback:cb,next:null};if(last){last.next=state.lastBufferedRequest;}else{state.bufferedRequest=state.lastBufferedRequest;}state.bufferedRequestCount+=1;}else{doWrite(stream,state,false,len,chunk,encoding,cb);}return ret;}function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len;state.writecb=cb;state.writing=true;state.sync=true;if(writev)stream._writev(chunk,state.onwrite);else stream._write(chunk,encoding,state.onwrite);state.sync=false;}function onwriteError(stream,state,sync,er,cb){--state.pendingcb;if(sync){// defer the callback if we are being called synchronously
// to avoid piling up things on the stack
processNextTick(cb,er);// this can emit finish, and it will always happen
// after error
processNextTick(finishMaybe,stream,state);stream._writableState.errorEmitted=true;stream.emit('error',er);}else{// the caller expect this to happen before if
// it is async
cb(er);stream._writableState.errorEmitted=true;stream.emit('error',er);// this can emit finish, but finish must
// always follow error
finishMaybe(stream,state);}}function onwriteStateUpdate(state){state.writing=false;state.writecb=null;state.length-=state.writelen;state.writelen=0;}function onwrite(stream,er){var state=stream._writableState;var sync=state.sync;var cb=state.writecb;onwriteStateUpdate(state);if(er)onwriteError(stream,state,sync,er,cb);else{// Check if we're actually ready to finish, but don't emit yet
var finished=needFinish(state);if(!finished&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest){clearBuffer(stream,state);}if(sync){/*<replacement>*/asyncWrite(afterWrite,stream,state,finished,cb);/*</replacement>*/}else{afterWrite(stream,state,finished,cb);}}}function afterWrite(stream,state,finished,cb){if(!finished)onwriteDrain(stream,state);state.pendingcb--;cb();finishMaybe(stream,state);}// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream,state){if(state.length===0&&state.needDrain){state.needDrain=false;stream.emit('drain');}}// if there's something in the buffer waiting, then process it
function clearBuffer(stream,state){state.bufferProcessing=true;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){// Fast case, write everything using _writev()
var l=state.bufferedRequestCount;var buffer=new Array(l);var holder=state.corkedRequestsFree;holder.entry=entry;var count=0;var allBuffers=true;while(entry){buffer[count]=entry;if(!entry.isBuf)allBuffers=false;entry=entry.next;count+=1;}buffer.allBuffers=allBuffers;doWrite(stream,state,true,state.length,buffer,'',holder.finish);// doWrite is almost always async, defer these to save a bit of time
// as the hot path ends with doWrite
state.pendingcb++;state.lastBufferedRequest=null;if(holder.next){state.corkedRequestsFree=holder.next;holder.next=null;}else{state.corkedRequestsFree=new CorkedRequest(state);}}else{// Slow case, write chunks one-by-one
while(entry){var chunk=entry.chunk;var encoding=entry.encoding;var cb=entry.callback;var len=state.objectMode?1:chunk.length;doWrite(stream,state,false,len,chunk,encoding,cb);entry=entry.next;// if we didn't call the onwrite immediately, then
// it means that we need to wait until it does.
// also, that means that the chunk and cb are currently
// being processed, so move the buffer counter past them.
if(state.writing){break;}}if(entry===null)state.lastBufferedRequest=null;}state.bufferedRequestCount=0;state.bufferedRequest=entry;state.bufferProcessing=false;}Writable.prototype._write=function(chunk,encoding,cb){cb(new Error('_write() is not implemented'));};Writable.prototype._writev=null;Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;if(typeof chunk==='function'){cb=chunk;chunk=null;encoding=null;}else if(typeof encoding==='function'){cb=encoding;encoding=null;}if(chunk!==null&&chunk!==undefined)this.write(chunk,encoding);// .end() fully uncorks
if(state.corked){state.corked=1;this.uncork();}// ignore unnecessary end() calls.
if(!state.ending&&!state.finished)endWritable(this,state,cb);};function needFinish(state){return state.ending&&state.length===0&&state.bufferedRequest===null&&!state.finished&&!state.writing;}function callFinal(stream,state){stream._final(function(err){state.pendingcb--;if(err){stream.emit('error',err);}state.prefinished=true;stream.emit('prefinish');finishMaybe(stream,state);});}function prefinish(stream,state){if(!state.prefinished&&!state.finalCalled){if(typeof stream._final==='function'){state.pendingcb++;state.finalCalled=true;processNextTick(callFinal,stream,state);}else{state.prefinished=true;stream.emit('prefinish');}}}function finishMaybe(stream,state){var need=needFinish(state);if(need){prefinish(stream,state);if(state.pendingcb===0){state.finished=true;stream.emit('finish');}}return need;}function endWritable(stream,state,cb){state.ending=true;finishMaybe(stream,state);if(cb){if(state.finished)processNextTick(cb);else stream.once('finish',cb);}state.ended=true;stream.writable=false;}function onCorkedFinish(corkReq,state,err){var entry=corkReq.entry;corkReq.entry=null;while(entry){var cb=entry.callback;state.pendingcb--;cb(err);entry=entry.next;}if(state.corkedRequestsFree){state.corkedRequestsFree.next=corkReq;}else{state.corkedRequestsFree=corkReq;}}Object.defineProperty(Writable.prototype,'destroyed',{get:function get(){if(this._writableState===undefined){return false;}return this._writableState.destroyed;},set:function set(value){// we ignore the value if the stream
// has not been initialized yet
if(!this._writableState){return;}// backward compatibility, the user is explicitly
// managing destroyed
this._writableState.destroyed=value;}});Writable.prototype.destroy=destroyImpl.destroy;Writable.prototype._undestroy=destroyImpl.undestroy;Writable.prototype._destroy=function(err,cb){this.end();cb(err);};}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./_stream_duplex":336,"./internal/streams/destroy":342,"./internal/streams/stream":343,"_process":413,"core-util-is":305,"inherits":329,"process-nextick-args":350,"safe-buffer":360,"util-deprecate":382}],341:[function(require,module,exports){'use strict';/*<replacement>*/function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Buffer=require('safe-buffer').Buffer;/*</replacement>*/function copyBuffer(src,target,offset){src.copy(target,offset);}module.exports=function(){function BufferList(){_classCallCheck(this,BufferList);this.head=null;this.tail=null;this.length=0;}BufferList.prototype.push=function push(v){var entry={data:v,next:null};if(this.length>0)this.tail.next=entry;else this.head=entry;this.tail=entry;++this.length;};BufferList.prototype.unshift=function unshift(v){var entry={data:v,next:this.head};if(this.length===0)this.tail=entry;this.head=entry;++this.length;};BufferList.prototype.shift=function shift(){if(this.length===0)return;var ret=this.head.data;if(this.length===1)this.head=this.tail=null;else this.head=this.head.next;--this.length;return ret;};BufferList.prototype.clear=function clear(){this.head=this.tail=null;this.length=0;};BufferList.prototype.join=function join(s){if(this.length===0)return'';var p=this.head;var ret=''+p.data;while(p=p.next){ret+=s+p.data;}return ret;};BufferList.prototype.concat=function concat(n){if(this.length===0)return Buffer.alloc(0);if(this.length===1)return this.head.data;var ret=Buffer.allocUnsafe(n>>>0);var p=this.head;var i=0;while(p){copyBuffer(p.data,ret,i);i+=p.data.length;p=p.next;}return ret;};return BufferList;}();},{"safe-buffer":360}],342:[function(require,module,exports){'use strict';/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*/// undocumented cb() API, needed for core, not for public API
function destroy(err,cb){var _this=this;var readableDestroyed=this._readableState&&this._readableState.destroyed;var writableDestroyed=this._writableState&&this._writableState.destroyed;if(readableDestroyed||writableDestroyed){if(cb){cb(err);}else if(err&&(!this._writableState||!this._writableState.errorEmitted)){processNextTick(emitErrorNT,this,err);}return;}// we set destroyed to true before firing error callbacks in order
// to make it re-entrance safe in case destroy() is called within callbacks
if(this._readableState){this._readableState.destroyed=true;}// if this is a duplex stream mark the writable part as destroyed as well
if(this._writableState){this._writableState.destroyed=true;}this._destroy(err||null,function(err){if(!cb&&err){processNextTick(emitErrorNT,_this,err);if(_this._writableState){_this._writableState.errorEmitted=true;}}else if(cb){cb(err);}});}function undestroy(){if(this._readableState){this._readableState.destroyed=false;this._readableState.reading=false;this._readableState.ended=false;this._readableState.endEmitted=false;}if(this._writableState){this._writableState.destroyed=false;this._writableState.ended=false;this._writableState.ending=false;this._writableState.finished=false;this._writableState.errorEmitted=false;}}function emitErrorNT(self,err){self.emit('error',err);}module.exports={destroy:destroy,undestroy:undestroy};},{"process-nextick-args":350}],343:[function(require,module,exports){module.exports=require('events').EventEmitter;},{"events":407}],344:[function(require,module,exports){exports=module.exports=require('./lib/_stream_readable.js');exports.Stream=exports;exports.Readable=exports;exports.Writable=require('./lib/_stream_writable.js');exports.Duplex=require('./lib/_stream_duplex.js');exports.Transform=require('./lib/_stream_transform.js');exports.PassThrough=require('./lib/_stream_passthrough.js');},{"./lib/_stream_duplex.js":336,"./lib/_stream_passthrough.js":337,"./lib/_stream_readable.js":338,"./lib/_stream_transform.js":339,"./lib/_stream_writable.js":340}],345:[function(require,module,exports){'use strict';var Buffer=require('safe-buffer').Buffer;var isEncoding=Buffer.isEncoding||function(encoding){encoding=''+encoding;switch(encoding&&encoding.toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':case'raw':return true;default:return false;}};function _normalizeEncoding(enc){if(!enc)return'utf8';var retried;while(true){switch(enc){case'utf8':case'utf-8':return'utf8';case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return'utf16le';case'latin1':case'binary':return'latin1';case'base64':case'ascii':case'hex':return enc;default:if(retried)return;// undefined
enc=(''+enc).toLowerCase();retried=true;}}};// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc){var nenc=_normalizeEncoding(enc);if(typeof nenc!=='string'&&(Buffer.isEncoding===isEncoding||!isEncoding(enc)))throw new Error('Unknown encoding: '+enc);return nenc||enc;}// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder=StringDecoder;function StringDecoder(encoding){this.encoding=normalizeEncoding(encoding);var nb;switch(this.encoding){case'utf16le':this.text=utf16Text;this.end=utf16End;nb=4;break;case'utf8':this.fillLast=utf8FillLast;nb=4;break;case'base64':this.text=base64Text;this.end=base64End;nb=3;break;default:this.write=simpleWrite;this.end=simpleEnd;return;}this.lastNeed=0;this.lastTotal=0;this.lastChar=Buffer.allocUnsafe(nb);}StringDecoder.prototype.write=function(buf){if(buf.length===0)return'';var r;var i;if(this.lastNeed){r=this.fillLast(buf);if(r===undefined)return'';i=this.lastNeed;this.lastNeed=0;}else{i=0;}if(i<buf.length)return r?r+this.text(buf,i):this.text(buf,i);return r||'';};StringDecoder.prototype.end=utf8End;// Returns only complete characters in a Buffer
StringDecoder.prototype.text=utf8Text;// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast=function(buf){if(this.lastNeed<=buf.length){buf.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed);return this.lastChar.toString(this.encoding,0,this.lastTotal);}buf.copy(this.lastChar,this.lastTotal-this.lastNeed,0,buf.length);this.lastNeed-=buf.length;};// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte){if(byte<=0x7F)return 0;else if(byte>>5===0x06)return 2;else if(byte>>4===0x0E)return 3;else if(byte>>3===0x1E)return 4;return-1;}// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self,buf,i){var j=buf.length-1;if(j<i)return 0;var nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0)self.lastNeed=nb-1;return nb;}if(--j<i)return 0;nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0)self.lastNeed=nb-2;return nb;}if(--j<i)return 0;nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0){if(nb===2)nb=0;else self.lastNeed=nb-3;}return nb;}return 0;}// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self,buf,p){if((buf[0]&0xC0)!==0x80){self.lastNeed=0;return"\uFFFD".repeat(p);}if(self.lastNeed>1&&buf.length>1){if((buf[1]&0xC0)!==0x80){self.lastNeed=1;return"\uFFFD".repeat(p+1);}if(self.lastNeed>2&&buf.length>2){if((buf[2]&0xC0)!==0x80){self.lastNeed=2;return"\uFFFD".repeat(p+2);}}}}// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf){var p=this.lastTotal-this.lastNeed;var r=utf8CheckExtraBytes(this,buf,p);if(r!==undefined)return r;if(this.lastNeed<=buf.length){buf.copy(this.lastChar,p,0,this.lastNeed);return this.lastChar.toString(this.encoding,0,this.lastTotal);}buf.copy(this.lastChar,p,0,buf.length);this.lastNeed-=buf.length;}// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf,i){var total=utf8CheckIncomplete(this,buf,i);if(!this.lastNeed)return buf.toString('utf8',i);this.lastTotal=total;var end=buf.length-(total-this.lastNeed);buf.copy(this.lastChar,0,end);return buf.toString('utf8',i,end);}// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf){var r=buf&&buf.length?this.write(buf):'';if(this.lastNeed)return r+"\uFFFD".repeat(this.lastTotal-this.lastNeed);return r;}// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf,i){if((buf.length-i)%2===0){var r=buf.toString('utf16le',i);if(r){var c=r.charCodeAt(r.length-1);if(c>=0xD800&&c<=0xDBFF){this.lastNeed=2;this.lastTotal=4;this.lastChar[0]=buf[buf.length-2];this.lastChar[1]=buf[buf.length-1];return r.slice(0,-1);}}return r;}this.lastNeed=1;this.lastTotal=2;this.lastChar[0]=buf[buf.length-1];return buf.toString('utf16le',i,buf.length-1);}// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf){var r=buf&&buf.length?this.write(buf):'';if(this.lastNeed){var end=this.lastTotal-this.lastNeed;return r+this.lastChar.toString('utf16le',0,end);}return r;}function base64Text(buf,i){var n=(buf.length-i)%3;if(n===0)return buf.toString('base64',i);this.lastNeed=3-n;this.lastTotal=3;if(n===1){this.lastChar[0]=buf[buf.length-1];}else{this.lastChar[0]=buf[buf.length-2];this.lastChar[1]=buf[buf.length-1];}return buf.toString('base64',i,buf.length-n);}function base64End(buf){var r=buf&&buf.length?this.write(buf):'';if(this.lastNeed)return r+this.lastChar.toString('base64',0,3-this.lastNeed);return r;}// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf){return buf.toString(this.encoding);}function simpleEnd(buf){return buf&&buf.length?this.write(buf):'';}},{"safe-buffer":360}],346:[function(require,module,exports){// The streaming binary wire protocol for Multihack
// Why? Because JSON/msgpack/schemapack/protobuf/anything weren't fast enough with chunking.
// For large and/or rapid sequential file transfer over ws/webrtc
var Duplex=require('readable-stream').Duplex;var Buffer=require('safe-buffer').Buffer;var inherits=require('inherits');inherits(Wire,Duplex);var MESSAGE_PROTOCOL=Buffer.from("\x13MultiHack protocol");var MESSAGE_YJS=0;function Wire(opts){if(!(this instanceof Wire))return new Wire(opts);Duplex.call(this);this._sentProtocol=false;this._buffer=[];// stores incomplete message
this._bufferSize=0;// size of above buffer
// number of bytes the next parsing function is waiting on
this._parseSize=MESSAGE_PROTOCOL.length;this._parseState=0;// just use a state for linear parsing trees
this._parseObj={};// the output parsing object
// the function that will handle parsing (changes)
this._parse=this._parseProtocol;this.destroyed=false;this._finished=false;this.on('finish',this._onFinish);}Wire.prototype.destroy=function(){if(this.destroyed)return;this.destroyed=true;this._onFinish();this.emit('close');this.end();this._buffer=null;this._bufferSize=null;this._parseSize=null;this._parseState=null;this._parseObj=null;this._parse=null;};/*
<MESSAGE_YJS>
<message length><message>
*/Wire.prototype.yjs=function(message){var payload=Buffer.from(JSON.stringify(message));var buf=Buffer.alloc(8+32);buf.writeInt8(MESSAGE_YJS);buf.writeInt32LE(payload.length,8);this._push(Buffer.concat([buf,payload]));};Wire.prototype._push=function(chunk){if(this._finished)return;if(!this._sentProtocol){this.push(MESSAGE_PROTOCOL);this._sentProtocol=true;}this.push(chunk);};Wire.prototype._read=function(){};Wire.prototype._write=function(chunk,enc,next){this._bufferSize+=chunk.length;this._buffer.push(chunk);// while we have enough bytes
while(this._bufferSize>=this._parseSize){// save a concat if there's only one sub-buffer
var buffer;if(this._buffer.length===1){buffer=this._buffer[0];// saves a concat
}else{buffer=Buffer.concat(this._buffer);}this._bufferSize-=this._parseSize;// parser ate some bytes
// calculate remaining buffer
if(this._bufferSize){// if there is more buffer
this._buffer=[buffer.slice(this._parseSize)];}else{this._buffer=[];}this._parse(buffer.slice(0,this._parseSize));// parse the data
}next(null);// out of data, get more
};// initial protocol handshake
Wire.prototype._parseProtocol=function(chunk){if(Buffer.compare(chunk,MESSAGE_PROTOCOL)!==0)throw new Error('Invalid PROTOCOL');this._nextMessage();};// parse a message header
Wire.prototype._parseMessage=function(chunk){switch(chunk[0]){case MESSAGE_YJS:this._parse=this._parseYjs;this._parseSize=32;break;}};/*
<MESSAGE_YJS>
<message length><message>
*/Wire.prototype._parseYjs=function(chunk){switch(this._parseState){case 0:// message length
this._parseSize=chunk.readInt32LE(0);this._parseState=1;break;case 1:// message
try{this._parseObj=JSON.parse(chunk.toString());this.emit('yjs',this._parseObj);}catch(e){console.error('Could not parse object.');}this._nextMessage();break;}};// cleans up for next message
Wire.prototype._nextMessage=function(){this._parseObj={};this._parseState=0;this._parseSize=8;this._parse=this._parseMessage;};Wire.prototype._onFinish=function(){this._finished=true;this.push(null);// prevent new writes
while(this.read()){}// consume remaining data
};module.exports=Wire;},{"inherits":329,"readable-stream":344,"safe-buffer":360}],347:[function(require,module,exports){(function(global){/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */var rvalidchars=/^[\],:{}\s]*$/;var rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft=/^\s+/;var rtrimRight=/\s+$/;module.exports=function parsejson(data){if('string'!=typeof data||!data){return null;}data=data.replace(rtrimLeft,'').replace(rtrimRight,'');// Attempt to parse using the native JSON parser first
if(global.JSON&&JSON.parse){return JSON.parse(data);}if(rvalidchars.test(data.replace(rvalidescape,'@').replace(rvalidtokens,']').replace(rvalidbraces,''))){return new Function('return '+data)();}};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],348:[function(require,module,exports){/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */exports.encode=function(obj){var str='';for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+='&';str+=encodeURIComponent(i)+'='+encodeURIComponent(obj[i]);}}return str;};/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */exports.decode=function(qs){var qry={};var pairs=qs.split('&');for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split('=');qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);}return qry;};},{}],349:[function(require,module,exports){/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];module.exports=function parseuri(str){var src=str,b=str.indexOf('['),e=str.indexOf(']');if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,';')+str.substring(e,str.length);}var m=re.exec(str||''),uri={},i=14;while(i--){uri[parts[i]]=m[i]||'';}if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,':');uri.authority=uri.authority.replace('[','').replace(']','').replace(/;/g,':');uri.ipv6uri=true;}return uri;};},{}],350:[function(require,module,exports){(function(process){'use strict';if(!process.version||process.version.indexOf('v0.')===0||process.version.indexOf('v1.')===0&&process.version.indexOf('v1.8.')!==0){module.exports=nextTick;}else{module.exports=process.nextTick;}function nextTick(fn,arg1,arg2,arg3){if(typeof fn!=='function'){throw new TypeError('"callback" argument must be a function');}var len=arguments.length;var args,i;switch(len){case 0:case 1:return process.nextTick(fn);case 2:return process.nextTick(function afterTickOne(){fn.call(null,arg1);});case 3:return process.nextTick(function afterTickTwo(){fn.call(null,arg1,arg2);});case 4:return process.nextTick(function afterTickThree(){fn.call(null,arg1,arg2,arg3);});default:args=new Array(len-1);i=0;while(i<args.length){args[i++]=arguments[i];}return process.nextTick(function afterTick(){fn.apply(null,args);});}}}).call(this,require('_process'));},{"_process":413}],351:[function(require,module,exports){(function(process,global){'use strict';function oldBrowser(){throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11');}var Buffer=require('safe-buffer').Buffer;var crypto=global.crypto||global.msCrypto;if(crypto&&crypto.getRandomValues){module.exports=randomBytes;}else{module.exports=oldBrowser;}function randomBytes(size,cb){// phantomjs needs to throw
if(size>65536)throw new Error('requested too many random bytes');// in case browserify  isn't using the Uint8Array version
var rawBytes=new global.Uint8Array(size);// This will not work in older browsers.
// See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
if(size>0){// getRandomValues fails on IE if size == 0
crypto.getRandomValues(rawBytes);}// XXX: phantomjs doesn't like a buffer being passed here
var bytes=Buffer.from(rawBytes.buffer);if(typeof cb==='function'){return process.nextTick(function(){cb(null,bytes);});}return bytes;}}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"_process":413,"safe-buffer":360}],352:[function(require,module,exports){// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';/*<replacement>*/var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj){keys.push(key);}return keys;};/*</replacement>*/module.exports=Duplex;/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/var Readable=require('./_stream_readable');var Writable=require('./_stream_writable');util.inherits(Duplex,Readable);var keys=objectKeys(Writable.prototype);for(var v=0;v<keys.length;v++){var method=keys[v];if(!Duplex.prototype[method])Duplex.prototype[method]=Writable.prototype[method];}function Duplex(options){if(!(this instanceof Duplex))return new Duplex(options);Readable.call(this,options);Writable.call(this,options);if(options&&options.readable===false)this.readable=false;if(options&&options.writable===false)this.writable=false;this.allowHalfOpen=true;if(options&&options.allowHalfOpen===false)this.allowHalfOpen=false;this.once('end',onend);}// the no-half-open enforcer
function onend(){// if we allow half-open state, or if the writable side ended,
// then we're ok.
if(this.allowHalfOpen||this._writableState.ended)return;// no more data can be written.
// But allow more writes to happen in this tick.
processNextTick(onEndNT,this);}function onEndNT(self){self.end();}function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i);}}},{"./_stream_readable":354,"./_stream_writable":356,"core-util-is":305,"inherits":329,"process-nextick-args":350}],353:[function(require,module,exports){// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';module.exports=PassThrough;var Transform=require('./_stream_transform');/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/util.inherits(PassThrough,Transform);function PassThrough(options){if(!(this instanceof PassThrough))return new PassThrough(options);Transform.call(this,options);}PassThrough.prototype._transform=function(chunk,encoding,cb){cb(null,chunk);};},{"./_stream_transform":355,"core-util-is":305,"inherits":329}],354:[function(require,module,exports){(function(process){'use strict';module.exports=Readable;/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var isArray=require('isarray');/*</replacement>*//*<replacement>*/var Duplex;/*</replacement>*/Readable.ReadableState=ReadableState;/*<replacement>*/var EE=require('events').EventEmitter;var EElistenerCount=function EElistenerCount(emitter,type){return emitter.listeners(type).length;};/*</replacement>*//*<replacement>*/var Stream;(function(){try{Stream=require('st'+'ream');}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter;}})();/*</replacement>*/var Buffer=require('buffer').Buffer;/*<replacement>*/var bufferShim=require('buffer-shims');/*</replacement>*//*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var debugUtil=require('util');var debug=void 0;if(debugUtil&&debugUtil.debuglog){debug=debugUtil.debuglog('stream');}else{debug=function debug(){};}/*</replacement>*/var BufferList=require('./internal/streams/BufferList');var StringDecoder;util.inherits(Readable,Stream);function prependListener(emitter,event,fn){// Sadly this is not cacheable as some libraries bundle their own
// event emitter implementation with them.
if(typeof emitter.prependListener==='function'){return emitter.prependListener(event,fn);}else{// This is a hack to make sure that our error handler is attached before any
// userland ones.  NEVER DO THIS. This is here only because this code needs
// to continue to work with older versions of Node.js that do not include
// the prependListener() method. The goal is to eventually remove this hack.
if(!emitter._events||!emitter._events[event])emitter.on(event,fn);else if(isArray(emitter._events[event]))emitter._events[event].unshift(fn);else emitter._events[event]=[fn,emitter._events[event]];}}function ReadableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag. Used to make read(n) ignore n and to
// make all the buffer merging and length checks go away
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.readableObjectMode;// the point at which it stops calling _read() to fill the buffer
// Note: 0 is a valid value, means "don't call _read preemptively ever"
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=~~this.highWaterMark;// A linked list is used to store data chunks instead of an array because the
// linked list can remove elements from the beginning faster than
// array.shift()
this.buffer=new BufferList();this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.ended=false;this.endEmitted=false;this.reading=false;// a flag to be able to tell if the onwrite cb is called immediately,
// or on a later tick.  We set this to true at first, because any
// actions that shouldn't happen until "later" should generally also
// not happen before the first write call.
this.sync=true;// whenever we return null, then we set a flag to say
// that we're awaiting a 'readable' event emission.
this.needReadable=false;this.emittedReadable=false;this.readableListening=false;this.resumeScheduled=false;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// when piping, we only care about 'readable' events that happen
// after read()ing all the bytes and not getting any pushback.
this.ranOut=false;// the number of writers that are awaiting a drain event in .pipe()s
this.awaitDrain=0;// if true, a maybeReadMore has been scheduled
this.readingMore=false;this.decoder=null;this.encoding=null;if(options.encoding){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this.decoder=new StringDecoder(options.encoding);this.encoding=options.encoding;}}function Readable(options){Duplex=Duplex||require('./_stream_duplex');if(!(this instanceof Readable))return new Readable(options);this._readableState=new ReadableState(options,this);// legacy
this.readable=true;if(options&&typeof options.read==='function')this._read=options.read;Stream.call(this);}// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push=function(chunk,encoding){var state=this._readableState;if(!state.objectMode&&typeof chunk==='string'){encoding=encoding||state.defaultEncoding;if(encoding!==state.encoding){chunk=bufferShim.from(chunk,encoding);encoding='';}}return readableAddChunk(this,state,chunk,encoding,false);};// Unshift should *always* be something directly out of read()
Readable.prototype.unshift=function(chunk){var state=this._readableState;return readableAddChunk(this,state,chunk,'',true);};Readable.prototype.isPaused=function(){return this._readableState.flowing===false;};function readableAddChunk(stream,state,chunk,encoding,addToFront){var er=chunkInvalid(state,chunk);if(er){stream.emit('error',er);}else if(chunk===null){state.reading=false;onEofChunk(stream,state);}else if(state.objectMode||chunk&&chunk.length>0){if(state.ended&&!addToFront){var e=new Error('stream.push() after EOF');stream.emit('error',e);}else if(state.endEmitted&&addToFront){var _e=new Error('stream.unshift() after end event');stream.emit('error',_e);}else{var skipAdd;if(state.decoder&&!addToFront&&!encoding){chunk=state.decoder.write(chunk);skipAdd=!state.objectMode&&chunk.length===0;}if(!addToFront)state.reading=false;// Don't add to the buffer if we've decoded to an empty string chunk and
// we're not in object mode
if(!skipAdd){// if we want the data now, just emit it.
if(state.flowing&&state.length===0&&!state.sync){stream.emit('data',chunk);stream.read(0);}else{// update the buffer info.
state.length+=state.objectMode?1:chunk.length;if(addToFront)state.buffer.unshift(chunk);else state.buffer.push(chunk);if(state.needReadable)emitReadable(stream);}}maybeReadMore(stream,state);}}else if(!addToFront){state.reading=false;}return needMoreData(state);}// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state){return!state.ended&&(state.needReadable||state.length<state.highWaterMark||state.length===0);}// backwards compatibility.
Readable.prototype.setEncoding=function(enc){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this._readableState.decoder=new StringDecoder(enc);this._readableState.encoding=enc;return this;};// Don't raise the hwm > 8MB
var MAX_HWM=0x800000;function computeNewHighWaterMark(n){if(n>=MAX_HWM){n=MAX_HWM;}else{// Get the next highest power of 2 to prevent increasing hwm excessively in
// tiny amounts
n--;n|=n>>>1;n|=n>>>2;n|=n>>>4;n|=n>>>8;n|=n>>>16;n++;}return n;}// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n,state){if(n<=0||state.length===0&&state.ended)return 0;if(state.objectMode)return 1;if(n!==n){// Only flow one buffer at a time
if(state.flowing&&state.length)return state.buffer.head.data.length;else return state.length;}// If we're asking for more than the current hwm, then raise the hwm.
if(n>state.highWaterMark)state.highWaterMark=computeNewHighWaterMark(n);if(n<=state.length)return n;// Don't have enough
if(!state.ended){state.needReadable=true;return 0;}return state.length;}// you can override either this method, or the async _read(n) below.
Readable.prototype.read=function(n){debug('read',n);n=parseInt(n,10);var state=this._readableState;var nOrig=n;if(n!==0)state.emittedReadable=false;// if we're doing read(0) to trigger a readable event, but we
// already have a bunch of data in the buffer, then just trigger
// the 'readable' event and move on.
if(n===0&&state.needReadable&&(state.length>=state.highWaterMark||state.ended)){debug('read: emitReadable',state.length,state.ended);if(state.length===0&&state.ended)endReadable(this);else emitReadable(this);return null;}n=howMuchToRead(n,state);// if we've ended, and we're now clear, then finish it up.
if(n===0&&state.ended){if(state.length===0)endReadable(this);return null;}// All the actual chunk generation logic needs to be
// *below* the call to _read.  The reason is that in certain
// synthetic stream cases, such as passthrough streams, _read
// may be a completely synchronous operation which may change
// the state of the read buffer, providing enough data when
// before there was *not* enough.
//
// So, the steps are:
// 1. Figure out what the state of things will be after we do
// a read from the buffer.
//
// 2. If that resulting state will trigger a _read, then call _read.
// Note that this may be asynchronous, or synchronous.  Yes, it is
// deeply ugly to write APIs this way, but that still doesn't mean
// that the Readable class should behave improperly, as streams are
// designed to be sync/async agnostic.
// Take note if the _read call is sync or async (ie, if the read call
// has returned yet), so that we know whether or not it's safe to emit
// 'readable' etc.
//
// 3. Actually pull the requested chunks out of the buffer and return.
// if we need a readable event, then we need to do some reading.
var doRead=state.needReadable;debug('need readable',doRead);// if we currently have less than the highWaterMark, then also read some
if(state.length===0||state.length-n<state.highWaterMark){doRead=true;debug('length less than watermark',doRead);}// however, if we've ended, then there's no point, and if we're already
// reading, then it's unnecessary.
if(state.ended||state.reading){doRead=false;debug('reading or ended',doRead);}else if(doRead){debug('do read');state.reading=true;state.sync=true;// if the length is currently zero, then we *need* a readable event.
if(state.length===0)state.needReadable=true;// call internal read method
this._read(state.highWaterMark);state.sync=false;// If _read pushed data synchronously, then `reading` will be false,
// and we need to re-evaluate how much data we can return to the user.
if(!state.reading)n=howMuchToRead(nOrig,state);}var ret;if(n>0)ret=fromList(n,state);else ret=null;if(ret===null){state.needReadable=true;n=0;}else{state.length-=n;}if(state.length===0){// If we have nothing in the buffer, then we want to know
// as soon as we *do* get something into the buffer.
if(!state.ended)state.needReadable=true;// If we tried to read() past the EOF, then emit end on the next tick.
if(nOrig!==n&&state.ended)endReadable(this);}if(ret!==null)this.emit('data',ret);return ret;};function chunkInvalid(state,chunk){var er=null;if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==null&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}return er;}function onEofChunk(stream,state){if(state.ended)return;if(state.decoder){var chunk=state.decoder.end();if(chunk&&chunk.length){state.buffer.push(chunk);state.length+=state.objectMode?1:chunk.length;}}state.ended=true;// emit 'readable' now to make sure it gets picked up.
emitReadable(stream);}// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream){var state=stream._readableState;state.needReadable=false;if(!state.emittedReadable){debug('emitReadable',state.flowing);state.emittedReadable=true;if(state.sync)processNextTick(emitReadable_,stream);else emitReadable_(stream);}}function emitReadable_(stream){debug('emit readable');stream.emit('readable');flow(stream);}// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream,state){if(!state.readingMore){state.readingMore=true;processNextTick(maybeReadMore_,stream,state);}}function maybeReadMore_(stream,state){var len=state.length;while(!state.reading&&!state.flowing&&!state.ended&&state.length<state.highWaterMark){debug('maybeReadMore read 0');stream.read(0);if(len===state.length)// didn't get any data, stop spinning.
break;else len=state.length;}state.readingMore=false;}// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read=function(n){this.emit('error',new Error('_read() is not implemented'));};Readable.prototype.pipe=function(dest,pipeOpts){var src=this;var state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest);break;}state.pipesCount+=1;debug('pipe count=%d opts=%j',state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==false)&&dest!==process.stdout&&dest!==process.stderr;var endFn=doEnd?onend:cleanup;if(state.endEmitted)processNextTick(endFn);else src.once('end',endFn);dest.on('unpipe',onunpipe);function onunpipe(readable){debug('onunpipe');if(readable===src){cleanup();}}function onend(){debug('onend');dest.end();}// when the dest drains, it reduces the awaitDrain counter
// on the source.  This would be more elegant with a .once()
// handler in flow(), but adding and removing repeatedly is
// too slow.
var ondrain=pipeOnDrain(src);dest.on('drain',ondrain);var cleanedUp=false;function cleanup(){debug('cleanup');// cleanup event handlers once the pipe is broken
dest.removeListener('close',onclose);dest.removeListener('finish',onfinish);dest.removeListener('drain',ondrain);dest.removeListener('error',onerror);dest.removeListener('unpipe',onunpipe);src.removeListener('end',onend);src.removeListener('end',cleanup);src.removeListener('data',ondata);cleanedUp=true;// if the reader is waiting for a drain event from this
// specific writer, then it would cause it to never start
// flowing again.
// So, if this is awaiting a drain, then we just call it now.
// If we don't know, then assume that we are waiting for one.
if(state.awaitDrain&&(!dest._writableState||dest._writableState.needDrain))ondrain();}// If the user pushes more data while we're writing to dest then we'll end up
// in ondata again. However, we only want to increase awaitDrain once because
// dest will only emit one 'drain' event for the multiple writes.
// => Introduce a guard on increasing awaitDrain.
var increasedAwaitDrain=false;src.on('data',ondata);function ondata(chunk){debug('ondata');increasedAwaitDrain=false;var ret=dest.write(chunk);if(false===ret&&!increasedAwaitDrain){// If the user unpiped during `dest.write()`, it is possible
// to get stuck in a permanently paused state if that write
// also returned false.
// => Check whether `dest` is still a piping destination.
if((state.pipesCount===1&&state.pipes===dest||state.pipesCount>1&&indexOf(state.pipes,dest)!==-1)&&!cleanedUp){debug('false write response, pause',src._readableState.awaitDrain);src._readableState.awaitDrain++;increasedAwaitDrain=true;}src.pause();}}// if the dest has an error, then stop piping into it.
// however, don't suppress the throwing behavior for this.
function onerror(er){debug('onerror',er);unpipe();dest.removeListener('error',onerror);if(EElistenerCount(dest,'error')===0)dest.emit('error',er);}// Make sure our error handler is attached before userland ones.
prependListener(dest,'error',onerror);// Both close and finish should trigger unpipe, but only once.
function onclose(){dest.removeListener('finish',onfinish);unpipe();}dest.once('close',onclose);function onfinish(){debug('onfinish');dest.removeListener('close',onclose);unpipe();}dest.once('finish',onfinish);function unpipe(){debug('unpipe');src.unpipe(dest);}// tell the dest that it's being piped to
dest.emit('pipe',src);// start the flow if it hasn't been started already.
if(!state.flowing){debug('pipe resume');src.resume();}return dest;};function pipeOnDrain(src){return function(){var state=src._readableState;debug('pipeOnDrain',state.awaitDrain);if(state.awaitDrain)state.awaitDrain--;if(state.awaitDrain===0&&EElistenerCount(src,'data')){state.flowing=true;flow(src);}};}Readable.prototype.unpipe=function(dest){var state=this._readableState;// if we're not piping anywhere, then do nothing.
if(state.pipesCount===0)return this;// just one destination.  most common case.
if(state.pipesCount===1){// passed in one, but it's not the right one.
if(dest&&dest!==state.pipes)return this;if(!dest)dest=state.pipes;// got a match.
state.pipes=null;state.pipesCount=0;state.flowing=false;if(dest)dest.emit('unpipe',this);return this;}// slow case. multiple pipe destinations.
if(!dest){// remove all.
var dests=state.pipes;var len=state.pipesCount;state.pipes=null;state.pipesCount=0;state.flowing=false;for(var i=0;i<len;i++){dests[i].emit('unpipe',this);}return this;}// try to find the right one.
var index=indexOf(state.pipes,dest);if(index===-1)return this;state.pipes.splice(index,1);state.pipesCount-=1;if(state.pipesCount===1)state.pipes=state.pipes[0];dest.emit('unpipe',this);return this;};// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);if(ev==='data'){// Start flowing on next tick if stream isn't explicitly paused
if(this._readableState.flowing!==false)this.resume();}else if(ev==='readable'){var state=this._readableState;if(!state.endEmitted&&!state.readableListening){state.readableListening=state.needReadable=true;state.emittedReadable=false;if(!state.reading){processNextTick(nReadingNextTick,this);}else if(state.length){emitReadable(this,state);}}}return res;};Readable.prototype.addListener=Readable.prototype.on;function nReadingNextTick(self){debug('readable nexttick read 0');self.read(0);}// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume=function(){var state=this._readableState;if(!state.flowing){debug('resume');state.flowing=true;resume(this,state);}return this;};function resume(stream,state){if(!state.resumeScheduled){state.resumeScheduled=true;processNextTick(resume_,stream,state);}}function resume_(stream,state){if(!state.reading){debug('resume read 0');stream.read(0);}state.resumeScheduled=false;state.awaitDrain=0;stream.emit('resume');flow(stream);if(state.flowing&&!state.reading)stream.read(0);}Readable.prototype.pause=function(){debug('call pause flowing=%j',this._readableState.flowing);if(false!==this._readableState.flowing){debug('pause');this._readableState.flowing=false;this.emit('pause');}return this;};function flow(stream){var state=stream._readableState;debug('flow',state.flowing);while(state.flowing&&stream.read()!==null){}}// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap=function(stream){var state=this._readableState;var paused=false;var self=this;stream.on('end',function(){debug('wrapped end');if(state.decoder&&!state.ended){var chunk=state.decoder.end();if(chunk&&chunk.length)self.push(chunk);}self.push(null);});stream.on('data',function(chunk){debug('wrapped data');if(state.decoder)chunk=state.decoder.write(chunk);// don't skip over falsy values in objectMode
if(state.objectMode&&(chunk===null||chunk===undefined))return;else if(!state.objectMode&&(!chunk||!chunk.length))return;var ret=self.push(chunk);if(!ret){paused=true;stream.pause();}});// proxy all the other methods.
// important when wrapping filters and duplexes.
for(var i in stream){if(this[i]===undefined&&typeof stream[i]==='function'){this[i]=function(method){return function(){return stream[method].apply(stream,arguments);};}(i);}}// proxy certain important events.
var events=['error','close','destroy','pause','resume'];forEach(events,function(ev){stream.on(ev,self.emit.bind(self,ev));});// when we try to consume some more bytes, simply unpause the
// underlying stream.
self._read=function(n){debug('wrapped _read',n);if(paused){paused=false;stream.resume();}};return self;};// exposed for testing purposes only.
Readable._fromList=fromList;// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n,state){// nothing buffered
if(state.length===0)return null;var ret;if(state.objectMode)ret=state.buffer.shift();else if(!n||n>=state.length){// read it all, truncate the list
if(state.decoder)ret=state.buffer.join('');else if(state.buffer.length===1)ret=state.buffer.head.data;else ret=state.buffer.concat(state.length);state.buffer.clear();}else{// read part of list
ret=fromListPartial(n,state.buffer,state.decoder);}return ret;}// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n,list,hasStrings){var ret;if(n<list.head.data.length){// slice is the same for buffers and strings
ret=list.head.data.slice(0,n);list.head.data=list.head.data.slice(n);}else if(n===list.head.data.length){// first chunk is a perfect match
ret=list.shift();}else{// result spans more than one buffer
ret=hasStrings?copyFromBufferString(n,list):copyFromBuffer(n,list);}return ret;}// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n,list){var p=list.head;var c=1;var ret=p.data;n-=ret.length;while(p=p.next){var str=p.data;var nb=n>str.length?str.length:n;if(nb===str.length)ret+=str;else ret+=str.slice(0,n);n-=nb;if(n===0){if(nb===str.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=str.slice(nb);}break;}++c;}list.length-=c;return ret;}// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n,list){var ret=bufferShim.allocUnsafe(n);var p=list.head;var c=1;p.data.copy(ret);n-=p.data.length;while(p=p.next){var buf=p.data;var nb=n>buf.length?buf.length:n;buf.copy(ret,ret.length-n,0,nb);n-=nb;if(n===0){if(nb===buf.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=buf.slice(nb);}break;}++c;}list.length-=c;return ret;}function endReadable(stream){var state=stream._readableState;// If we get here before consuming all the bytes, then that is a
// bug in node.  Should never happen.
if(state.length>0)throw new Error('"endReadable()" called on non-empty stream');if(!state.endEmitted){state.ended=true;processNextTick(endReadableNT,state,stream);}}function endReadableNT(state,stream){// Check that we didn't get one last unshift.
if(!state.endEmitted&&state.length===0){state.endEmitted=true;stream.readable=false;stream.emit('end');}}function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i);}}function indexOf(xs,x){for(var i=0,l=xs.length;i<l;i++){if(xs[i]===x)return i;}return-1;}}).call(this,require('_process'));},{"./_stream_duplex":352,"./internal/streams/BufferList":357,"_process":413,"buffer":405,"buffer-shims":7,"core-util-is":305,"events":407,"inherits":329,"isarray":330,"process-nextick-args":350,"string_decoder/":380,"util":403}],355:[function(require,module,exports){// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';module.exports=Transform;var Duplex=require('./_stream_duplex');/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/util.inherits(Transform,Duplex);function TransformState(stream){this.afterTransform=function(er,data){return afterTransform(stream,er,data);};this.needTransform=false;this.transforming=false;this.writecb=null;this.writechunk=null;this.writeencoding=null;}function afterTransform(stream,er,data){var ts=stream._transformState;ts.transforming=false;var cb=ts.writecb;if(!cb)return stream.emit('error',new Error('no writecb in Transform class'));ts.writechunk=null;ts.writecb=null;if(data!==null&&data!==undefined)stream.push(data);cb(er);var rs=stream._readableState;rs.reading=false;if(rs.needReadable||rs.length<rs.highWaterMark){stream._read(rs.highWaterMark);}}function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options);this._transformState=new TransformState(this);var stream=this;// start out asking for a readable event once data is transformed.
this._readableState.needReadable=true;// we have implemented the _read method, and done the other things
// that Readable wants before the first _read call, so unset the
// sync guard flag.
this._readableState.sync=false;if(options){if(typeof options.transform==='function')this._transform=options.transform;if(typeof options.flush==='function')this._flush=options.flush;}// When the writable side finishes, then flush out anything remaining.
this.once('prefinish',function(){if(typeof this._flush==='function')this._flush(function(er,data){done(stream,er,data);});else done(stream);});}Transform.prototype.push=function(chunk,encoding){this._transformState.needTransform=false;return Duplex.prototype.push.call(this,chunk,encoding);};// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform=function(chunk,encoding,cb){throw new Error('_transform() is not implemented');};Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;ts.writecb=cb;ts.writechunk=chunk;ts.writeencoding=encoding;if(!ts.transforming){var rs=this._readableState;if(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)this._read(rs.highWaterMark);}};// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read=function(n){var ts=this._transformState;if(ts.writechunk!==null&&ts.writecb&&!ts.transforming){ts.transforming=true;this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform);}else{// mark that we need a transform, so that any data that comes in
// will get processed, now that we've asked for it.
ts.needTransform=true;}};function done(stream,er,data){if(er)return stream.emit('error',er);if(data!==null&&data!==undefined)stream.push(data);// if there's nothing in the write buffer, then that means
// that nothing more will ever be provided
var ws=stream._writableState;var ts=stream._transformState;if(ws.length)throw new Error('Calling transform done when ws.length != 0');if(ts.transforming)throw new Error('Calling transform done when still transforming');return stream.push(null);}},{"./_stream_duplex":352,"core-util-is":305,"inherits":329}],356:[function(require,module,exports){(function(process){// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';module.exports=Writable;/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var asyncWrite=!process.browser&&['v0.10','v0.9.'].indexOf(process.version.slice(0,5))>-1?setImmediate:processNextTick;/*</replacement>*//*<replacement>*/var Duplex;/*</replacement>*/Writable.WritableState=WritableState;/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var internalUtil={deprecate:require('util-deprecate')};/*</replacement>*//*<replacement>*/var Stream;(function(){try{Stream=require('st'+'ream');}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter;}})();/*</replacement>*/var Buffer=require('buffer').Buffer;/*<replacement>*/var bufferShim=require('buffer-shims');/*</replacement>*/util.inherits(Writable,Stream);function nop(){}function WriteReq(chunk,encoding,cb){this.chunk=chunk;this.encoding=encoding;this.callback=cb;this.next=null;}function WritableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag to indicate whether or not this stream
// contains buffers or objects.
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.writableObjectMode;// the point at which write() starts returning false
// Note: 0 is a valid value, means that we always return false if
// the entire buffer is not flushed immediately on write()
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=~~this.highWaterMark;// drain event flag.
this.needDrain=false;// at the start of calling end()
this.ending=false;// when end() has been called, and returned
this.ended=false;// when 'finish' is emitted
this.finished=false;// should we decode strings into buffers before passing to _write?
// this is here so that some node-core streams can optimize string
// handling at a lower level.
var noDecode=options.decodeStrings===false;this.decodeStrings=!noDecode;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// not an actual buffer we keep track of, but a measurement
// of how much we're waiting to get pushed to some underlying
// socket or file.
this.length=0;// a flag to see when we're in the middle of a write.
this.writing=false;// when true all writes will be buffered until .uncork() call
this.corked=0;// a flag to be able to tell if the onwrite cb is called immediately,
// or on a later tick.  We set this to true at first, because any
// actions that shouldn't happen until "later" should generally also
// not happen before the first write call.
this.sync=true;// a flag to know if we're processing previously buffered items, which
// may call the _write() callback in the same tick, so that we don't
// end up in an overlapped onwrite situation.
this.bufferProcessing=false;// the callback that's passed to _write(chunk,cb)
this.onwrite=function(er){onwrite(stream,er);};// the callback that the user supplies to write(chunk,encoding,cb)
this.writecb=null;// the amount that is being written when _write is called.
this.writelen=0;this.bufferedRequest=null;this.lastBufferedRequest=null;// number of pending user-supplied write callbacks
// this must be 0 before 'finish' can be emitted
this.pendingcb=0;// emit prefinish if the only thing we're waiting for is _write cbs
// This is relevant for synchronous Transform streams
this.prefinished=false;// True if the error was already emitted and should not be thrown again
this.errorEmitted=false;// count buffered requests
this.bufferedRequestCount=0;// allocate the first CorkedRequest, there is always
// one allocated and free to use, and we maintain at most two
this.corkedRequestsFree=new CorkedRequest(this);}WritableState.prototype.getBuffer=function getBuffer(){var current=this.bufferedRequest;var out=[];while(current){out.push(current);current=current.next;}return out;};(function(){try{Object.defineProperty(WritableState.prototype,'buffer',{get:internalUtil.deprecate(function(){return this.getBuffer();},'_writableState.buffer is deprecated. Use _writableState.getBuffer '+'instead.')});}catch(_){}})();// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;if(typeof Symbol==='function'&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]==='function'){realHasInstance=Function.prototype[Symbol.hasInstance];Object.defineProperty(Writable,Symbol.hasInstance,{value:function value(object){if(realHasInstance.call(this,object))return true;return object&&object._writableState instanceof WritableState;}});}else{realHasInstance=function realHasInstance(object){return object instanceof this;};}function Writable(options){Duplex=Duplex||require('./_stream_duplex');// Writable ctor is applied to Duplexes, too.
// `realHasInstance` is necessary because using plain `instanceof`
// would return false, as no `_writableState` property is attached.
// Trying to use the custom `instanceof` for Writable here will also break the
// Node.js LazyTransform implementation, which has a non-trivial getter for
// `_writableState` that would lead to infinite recursion.
if(!realHasInstance.call(Writable,this)&&!(this instanceof Duplex)){return new Writable(options);}this._writableState=new WritableState(options,this);// legacy.
this.writable=true;if(options){if(typeof options.write==='function')this._write=options.write;if(typeof options.writev==='function')this._writev=options.writev;}Stream.call(this);}// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe=function(){this.emit('error',new Error('Cannot pipe, not readable'));};function writeAfterEnd(stream,cb){var er=new Error('write after end');// TODO: defer error events consistently everywhere, not just the cb
stream.emit('error',er);processNextTick(cb,er);}// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream,state,chunk,cb){var valid=true;var er=false;// Always throw error if a null is written
// if we are not in object mode then throw
// if it is not a buffer, string, or undefined.
if(chunk===null){er=new TypeError('May not write null values to stream');}else if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}if(er){stream.emit('error',er);processNextTick(cb,er);valid=false;}return valid;}Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState;var ret=false;if(typeof encoding==='function'){cb=encoding;encoding=null;}if(Buffer.isBuffer(chunk))encoding='buffer';else if(!encoding)encoding=state.defaultEncoding;if(typeof cb!=='function')cb=nop;if(state.ended)writeAfterEnd(this,cb);else if(validChunk(this,state,chunk,cb)){state.pendingcb++;ret=writeOrBuffer(this,state,chunk,encoding,cb);}return ret;};Writable.prototype.cork=function(){var state=this._writableState;state.corked++;};Writable.prototype.uncork=function(){var state=this._writableState;if(state.corked){state.corked--;if(!state.writing&&!state.corked&&!state.finished&&!state.bufferProcessing&&state.bufferedRequest)clearBuffer(this,state);}};Writable.prototype.setDefaultEncoding=function setDefaultEncoding(encoding){// node::ParseEncoding() requires lower case.
if(typeof encoding==='string')encoding=encoding.toLowerCase();if(!(['hex','utf8','utf-8','ascii','binary','base64','ucs2','ucs-2','utf16le','utf-16le','raw'].indexOf((encoding+'').toLowerCase())>-1))throw new TypeError('Unknown encoding: '+encoding);this._writableState.defaultEncoding=encoding;return this;};function decodeChunk(state,chunk,encoding){if(!state.objectMode&&state.decodeStrings!==false&&typeof chunk==='string'){chunk=bufferShim.from(chunk,encoding);}return chunk;}// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream,state,chunk,encoding,cb){chunk=decodeChunk(state,chunk,encoding);if(Buffer.isBuffer(chunk))encoding='buffer';var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;// we must ensure that previous needDrain will not be reset to false.
if(!ret)state.needDrain=true;if(state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest=new WriteReq(chunk,encoding,cb);if(last){last.next=state.lastBufferedRequest;}else{state.bufferedRequest=state.lastBufferedRequest;}state.bufferedRequestCount+=1;}else{doWrite(stream,state,false,len,chunk,encoding,cb);}return ret;}function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len;state.writecb=cb;state.writing=true;state.sync=true;if(writev)stream._writev(chunk,state.onwrite);else stream._write(chunk,encoding,state.onwrite);state.sync=false;}function onwriteError(stream,state,sync,er,cb){--state.pendingcb;if(sync)processNextTick(cb,er);else cb(er);stream._writableState.errorEmitted=true;stream.emit('error',er);}function onwriteStateUpdate(state){state.writing=false;state.writecb=null;state.length-=state.writelen;state.writelen=0;}function onwrite(stream,er){var state=stream._writableState;var sync=state.sync;var cb=state.writecb;onwriteStateUpdate(state);if(er)onwriteError(stream,state,sync,er,cb);else{// Check if we're actually ready to finish, but don't emit yet
var finished=needFinish(state);if(!finished&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest){clearBuffer(stream,state);}if(sync){/*<replacement>*/asyncWrite(afterWrite,stream,state,finished,cb);/*</replacement>*/}else{afterWrite(stream,state,finished,cb);}}}function afterWrite(stream,state,finished,cb){if(!finished)onwriteDrain(stream,state);state.pendingcb--;cb();finishMaybe(stream,state);}// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream,state){if(state.length===0&&state.needDrain){state.needDrain=false;stream.emit('drain');}}// if there's something in the buffer waiting, then process it
function clearBuffer(stream,state){state.bufferProcessing=true;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){// Fast case, write everything using _writev()
var l=state.bufferedRequestCount;var buffer=new Array(l);var holder=state.corkedRequestsFree;holder.entry=entry;var count=0;while(entry){buffer[count]=entry;entry=entry.next;count+=1;}doWrite(stream,state,true,state.length,buffer,'',holder.finish);// doWrite is almost always async, defer these to save a bit of time
// as the hot path ends with doWrite
state.pendingcb++;state.lastBufferedRequest=null;if(holder.next){state.corkedRequestsFree=holder.next;holder.next=null;}else{state.corkedRequestsFree=new CorkedRequest(state);}}else{// Slow case, write chunks one-by-one
while(entry){var chunk=entry.chunk;var encoding=entry.encoding;var cb=entry.callback;var len=state.objectMode?1:chunk.length;doWrite(stream,state,false,len,chunk,encoding,cb);entry=entry.next;// if we didn't call the onwrite immediately, then
// it means that we need to wait until it does.
// also, that means that the chunk and cb are currently
// being processed, so move the buffer counter past them.
if(state.writing){break;}}if(entry===null)state.lastBufferedRequest=null;}state.bufferedRequestCount=0;state.bufferedRequest=entry;state.bufferProcessing=false;}Writable.prototype._write=function(chunk,encoding,cb){cb(new Error('_write() is not implemented'));};Writable.prototype._writev=null;Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;if(typeof chunk==='function'){cb=chunk;chunk=null;encoding=null;}else if(typeof encoding==='function'){cb=encoding;encoding=null;}if(chunk!==null&&chunk!==undefined)this.write(chunk,encoding);// .end() fully uncorks
if(state.corked){state.corked=1;this.uncork();}// ignore unnecessary end() calls.
if(!state.ending&&!state.finished)endWritable(this,state,cb);};function needFinish(state){return state.ending&&state.length===0&&state.bufferedRequest===null&&!state.finished&&!state.writing;}function prefinish(stream,state){if(!state.prefinished){state.prefinished=true;stream.emit('prefinish');}}function finishMaybe(stream,state){var need=needFinish(state);if(need){if(state.pendingcb===0){prefinish(stream,state);state.finished=true;stream.emit('finish');}else{prefinish(stream,state);}}return need;}function endWritable(stream,state,cb){state.ending=true;finishMaybe(stream,state);if(cb){if(state.finished)processNextTick(cb);else stream.once('finish',cb);}state.ended=true;stream.writable=false;}// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state){var _this=this;this.next=null;this.entry=null;this.finish=function(err){var entry=_this.entry;_this.entry=null;while(entry){var cb=entry.callback;state.pendingcb--;cb(err);entry=entry.next;}if(state.corkedRequestsFree){state.corkedRequestsFree.next=_this;}else{state.corkedRequestsFree=_this;}};}}).call(this,require('_process'));},{"./_stream_duplex":352,"_process":413,"buffer":405,"buffer-shims":7,"core-util-is":305,"events":407,"inherits":329,"process-nextick-args":350,"util-deprecate":382}],357:[function(require,module,exports){'use strict';var Buffer=require('buffer').Buffer;/*<replacement>*/var bufferShim=require('buffer-shims');/*</replacement>*/module.exports=BufferList;function BufferList(){this.head=null;this.tail=null;this.length=0;}BufferList.prototype.push=function(v){var entry={data:v,next:null};if(this.length>0)this.tail.next=entry;else this.head=entry;this.tail=entry;++this.length;};BufferList.prototype.unshift=function(v){var entry={data:v,next:this.head};if(this.length===0)this.tail=entry;this.head=entry;++this.length;};BufferList.prototype.shift=function(){if(this.length===0)return;var ret=this.head.data;if(this.length===1)this.head=this.tail=null;else this.head=this.head.next;--this.length;return ret;};BufferList.prototype.clear=function(){this.head=this.tail=null;this.length=0;};BufferList.prototype.join=function(s){if(this.length===0)return'';var p=this.head;var ret=''+p.data;while(p=p.next){ret+=s+p.data;}return ret;};BufferList.prototype.concat=function(n){if(this.length===0)return bufferShim.alloc(0);if(this.length===1)return this.head.data;var ret=bufferShim.allocUnsafe(n>>>0);var p=this.head;var i=0;while(p){p.data.copy(ret,i);i+=p.data.length;p=p.next;}return ret;};},{"buffer":405,"buffer-shims":7}],358:[function(require,module,exports){(function(process){var Stream=function(){try{return require('st'+'ream');// hack to fix a circular dependency issue when used with browserify
}catch(_){}}();exports=module.exports=require('./lib/_stream_readable.js');exports.Stream=Stream||exports;exports.Readable=exports;exports.Writable=require('./lib/_stream_writable.js');exports.Duplex=require('./lib/_stream_duplex.js');exports.Transform=require('./lib/_stream_transform.js');exports.PassThrough=require('./lib/_stream_passthrough.js');if(!process.browser&&process.env.READABLE_STREAM==='disable'&&Stream){module.exports=Stream;}}).call(this,require('_process'));},{"./lib/_stream_duplex.js":352,"./lib/_stream_passthrough.js":353,"./lib/_stream_readable.js":354,"./lib/_stream_transform.js":355,"./lib/_stream_writable.js":356,"_process":413}],359:[function(require,module,exports){(function(global){/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */!function(global){"use strict";var Op=Object.prototype;var hasOwn=Op.hasOwnProperty;var undefined;// More compressible than void 0.
var $Symbol=typeof Symbol==="function"?Symbol:{};var iteratorSymbol=$Symbol.iterator||"@@iterator";var asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator";var toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";var inModule=(typeof module==="undefined"?"undefined":_typeof(module))==="object";var runtime=global.regeneratorRuntime;if(runtime){if(inModule){// If regeneratorRuntime is defined globally and we're in a module,
// make the exports object identical to regeneratorRuntime.
module.exports=runtime;}// Don't bother evaluating the rest of this file if the runtime was
// already defined globally.
return;}// Define the runtime globally (as expected by generated code) as either
// module.exports (if we're in a module) or a new, empty object.
runtime=global.regeneratorRuntime=inModule?module.exports:{};function wrap(innerFn,outerFn,self,tryLocsList){// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator;var generator=Object.create(protoGenerator.prototype);var context=new Context(tryLocsList||[]);// The ._invoke method unifies the implementations of the .next,
// .throw, and .return methods.
generator._invoke=makeInvokeMethod(innerFn,self,context);return generator;}runtime.wrap=wrap;// Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.
function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)};}catch(err){return{type:"throw",arg:err};}}var GenStateSuspendedStart="suspendedStart";var GenStateSuspendedYield="suspendedYield";var GenStateExecuting="executing";var GenStateCompleted="completed";// Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.
var ContinueSentinel={};// Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.
function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}// This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.
var IteratorPrototype={};IteratorPrototype[iteratorSymbol]=function(){return this;};var getProto=Object.getPrototypeOf;var NativeIteratorPrototype=getProto&&getProto(getProto(values([])));if(NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)){// This environment has a native %IteratorPrototype%; use it instead
// of the polyfill.
IteratorPrototype=NativeIteratorPrototype;}var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);GeneratorFunction.prototype=Gp.constructor=GeneratorFunctionPrototype;GeneratorFunctionPrototype.constructor=GeneratorFunction;GeneratorFunctionPrototype[toStringTagSymbol]=GeneratorFunction.displayName="GeneratorFunction";// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype){["next","throw","return"].forEach(function(method){prototype[method]=function(arg){return this._invoke(method,arg);};});}runtime.isGeneratorFunction=function(genFun){var ctor=typeof genFun==="function"&&genFun.constructor;return ctor?ctor===GeneratorFunction||// For the native GeneratorFunction constructor, the best we can
// do is to check its .name property.
(ctor.displayName||ctor.name)==="GeneratorFunction":false;};runtime.mark=function(genFun){if(Object.setPrototypeOf){Object.setPrototypeOf(genFun,GeneratorFunctionPrototype);}else{genFun.__proto__=GeneratorFunctionPrototype;if(!(toStringTagSymbol in genFun)){genFun[toStringTagSymbol]="GeneratorFunction";}}genFun.prototype=Object.create(Gp);return genFun;};// Within the body of any async function, `await x` is transformed to
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.
runtime.awrap=function(arg){return{__await:arg};};function AsyncIterator(generator){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if(record.type==="throw"){reject(record.arg);}else{var result=record.arg;var value=result.value;if(value&&(typeof value==="undefined"?"undefined":_typeof(value))==="object"&&hasOwn.call(value,"__await")){return Promise.resolve(value.__await).then(function(value){invoke("next",value,resolve,reject);},function(err){invoke("throw",err,resolve,reject);});}return Promise.resolve(value).then(function(unwrapped){// When a yielded Promise is resolved, its final value becomes
// the .value of the Promise<{value,done}> result for the
// current iteration. If the Promise is rejected, however, the
// result for this iteration will be rejected with the same
// reason. Note that rejections of yielded Promises are not
// thrown back into the generator function, as is the case
// when an awaited Promise is rejected. This difference in
// behavior between yield and await is important, because it
// allows the consumer to decide what to do with the yielded
// rejection (swallow it and continue, manually .throw it back
// into the generator, abandon iteration, whatever). With
// await, by contrast, there is no opportunity to examine the
// rejection reason outside the generator function, so the
// only option is to throw it from the await expression, and
// let the generator function handle the exception.
result.value=unwrapped;resolve(result);},reject);}}if(_typeof(global.process)==="object"&&global.process.domain){invoke=global.process.domain.bind(invoke);}var previousPromise;function enqueue(method,arg){function callInvokeWithMethodAndArg(){return new Promise(function(resolve,reject){invoke(method,arg,resolve,reject);});}return previousPromise=// If enqueue has been called before, then we want to wait until
// all previous Promises have been resolved before calling invoke,
// so that results are always delivered in the correct order. If
// enqueue has not been called before, then it is important to
// call invoke immediately, without waiting on a callback to fire,
// so that the async generator function has the opportunity to do
// any necessary setup in a predictable way. This predictability
// is why the Promise constructor synchronously invokes its
// executor callback, and why async functions synchronously
// execute code before the first await. Since we implement simple
// async functions in terms of async generators, it is especially
// important to get this right, even though it requires care.
previousPromise?previousPromise.then(callInvokeWithMethodAndArg,// Avoid propagating failures to Promises returned by later
// invocations of the iterator.
callInvokeWithMethodAndArg):callInvokeWithMethodAndArg();}// Define the unified helper method that is used to implement .next,
// .throw, and .return (see defineIteratorMethods).
this._invoke=enqueue;}defineIteratorMethods(AsyncIterator.prototype);AsyncIterator.prototype[asyncIteratorSymbol]=function(){return this;};runtime.AsyncIterator=AsyncIterator;// Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.
runtime.async=function(innerFn,outerFn,self,tryLocsList){var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList));return runtime.isGeneratorFunction(outerFn)?iter// If outerFn is a generator, return the full iterator.
:iter.next().then(function(result){return result.done?result.value:iter.next();});};function makeInvokeMethod(innerFn,self,context){var state=GenStateSuspendedStart;return function invoke(method,arg){if(state===GenStateExecuting){throw new Error("Generator is already running");}if(state===GenStateCompleted){if(method==="throw"){throw arg;}// Be forgiving, per 25.3.3.3.3 of the spec:
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
return doneResult();}context.method=method;context.arg=arg;while(true){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult;}}if(context.method==="next"){// Setting context._sent for legacy support of Babel's
// function.sent implementation.
context.sent=context._sent=context.arg;}else if(context.method==="throw"){if(state===GenStateSuspendedStart){state=GenStateCompleted;throw context.arg;}context.dispatchException(context.arg);}else if(context.method==="return"){context.abrupt("return",context.arg);}state=GenStateExecuting;var record=tryCatch(innerFn,self,context);if(record.type==="normal"){// If an exception is thrown from innerFn, we leave state ===
// GenStateExecuting and loop back for another invocation.
state=context.done?GenStateCompleted:GenStateSuspendedYield;if(record.arg===ContinueSentinel){continue;}return{value:record.arg,done:context.done};}else if(record.type==="throw"){state=GenStateCompleted;// Dispatch the exception by looping back around to the
// context.dispatchException(context.arg) call above.
context.method="throw";context.arg=record.arg;}}};}// Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.
function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(method===undefined){// A .throw or .return when the delegate iterator has no .throw
// method always terminates the yield* loop.
context.delegate=null;if(context.method==="throw"){if(delegate.iterator.return){// If the delegate iterator has a return method, give it a
// chance to clean up.
context.method="return";context.arg=undefined;maybeInvokeDelegate(delegate,context);if(context.method==="throw"){// If maybeInvokeDelegate(context) changed context.method from
// "return" to "throw", let that override the TypeError below.
return ContinueSentinel;}}context.method="throw";context.arg=new TypeError("The iterator does not provide a 'throw' method");}return ContinueSentinel;}var record=tryCatch(method,delegate.iterator,context.arg);if(record.type==="throw"){context.method="throw";context.arg=record.arg;context.delegate=null;return ContinueSentinel;}var info=record.arg;if(!info){context.method="throw";context.arg=new TypeError("iterator result is not an object");context.delegate=null;return ContinueSentinel;}if(info.done){// Assign the result of the finished delegate to the temporary
// variable specified by delegate.resultName (see delegateYield).
context[delegate.resultName]=info.value;// Resume execution at the desired location (see delegateYield).
context.next=delegate.nextLoc;// If context.method was "throw" but the delegate handled the
// exception, let the outer generator proceed normally. If
// context.method was "next", forget context.arg since it has been
// "consumed" by the delegate iterator. If context.method was
// "return", allow the original .return call to continue in the
// outer generator.
if(context.method!=="return"){context.method="next";context.arg=undefined;}}else{// Re-yield the result returned by the delegate method.
return info;}// The delegate iterator is finished, so forget it and continue with
// the outer generator.
context.delegate=null;return ContinueSentinel;}// Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.
defineIteratorMethods(Gp);Gp[toStringTagSymbol]="Generator";// A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.
Gp[iteratorSymbol]=function(){return this;};Gp.toString=function(){return"[object Generator]";};function pushTryEntry(locs){var entry={tryLoc:locs[0]};if(1 in locs){entry.catchLoc=locs[1];}if(2 in locs){entry.finallyLoc=locs[2];entry.afterLoc=locs[3];}this.tryEntries.push(entry);}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal";delete record.arg;entry.completion=record;}function Context(tryLocsList){// The root entry object (effectively a try statement without a catch
// or a finally block) gives us a place to store values thrown from
// locations where there is no enclosing try statement.
this.tryEntries=[{tryLoc:"root"}];tryLocsList.forEach(pushTryEntry,this);this.reset(true);}runtime.keys=function(object){var keys=[];for(var key in object){keys.push(key);}keys.reverse();// Rather than returning an object with a next method, we keep
// things simple and return the next function itself.
return function next(){while(keys.length){var key=keys.pop();if(key in object){next.value=key;next.done=false;return next;}}// To avoid creating an additional object, we just hang the .value
// and .done properties off the next function object itself. This
// also ensures that the minifier will not anonymize the function.
next.done=true;return next;};};function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod){return iteratorMethod.call(iterable);}if(typeof iterable.next==="function"){return iterable;}if(!isNaN(iterable.length)){var i=-1,next=function next(){while(++i<iterable.length){if(hasOwn.call(iterable,i)){next.value=iterable[i];next.done=false;return next;}}next.value=undefined;next.done=true;return next;};return next.next=next;}}// Return an iterator with no values.
return{next:doneResult};}runtime.values=values;function doneResult(){return{value:undefined,done:true};}Context.prototype={constructor:Context,reset:function reset(skipTempReset){this.prev=0;this.next=0;// Resetting context._sent for legacy support of Babel's
// function.sent implementation.
this.sent=this._sent=undefined;this.done=false;this.delegate=null;this.method="next";this.arg=undefined;this.tryEntries.forEach(resetTryEntry);if(!skipTempReset){for(var name in this){// Not sure about the optimal order of these conditions:
if(name.charAt(0)==="t"&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))){this[name]=undefined;}}}},stop:function stop(){this.done=true;var rootEntry=this.tryEntries[0];var rootRecord=rootEntry.completion;if(rootRecord.type==="throw"){throw rootRecord.arg;}return this.rval;},dispatchException:function dispatchException(exception){if(this.done){throw exception;}var context=this;function handle(loc,caught){record.type="throw";record.arg=exception;context.next=loc;if(caught){// If the dispatched exception was caught by a catch block,
// then let that catch block handle the exception normally.
context.method="next";context.arg=undefined;}return!!caught;}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];var record=entry.completion;if(entry.tryLoc==="root"){// Exception thrown outside of any try block that could handle
// it, so set the completion value of the entire function to
// throw the exception.
return handle("end");}if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc");var hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc){return handle(entry.catchLoc,true);}else if(this.prev<entry.finallyLoc){return handle(entry.finallyLoc);}}else if(hasCatch){if(this.prev<entry.catchLoc){return handle(entry.catchLoc,true);}}else if(hasFinally){if(this.prev<entry.finallyLoc){return handle(entry.finallyLoc);}}else{throw new Error("try statement without catch or finally");}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break;}}if(finallyEntry&&(type==="break"||type==="continue")&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc){// Ignore the finally entry if control is not jumping to a
// location outside the try/catch block.
finallyEntry=null;}var record=finallyEntry?finallyEntry.completion:{};record.type=type;record.arg=arg;if(finallyEntry){this.method="next";this.next=finallyEntry.finallyLoc;return ContinueSentinel;}return this.complete(record);},complete:function complete(record,afterLoc){if(record.type==="throw"){throw record.arg;}if(record.type==="break"||record.type==="continue"){this.next=record.arg;}else if(record.type==="return"){this.rval=this.arg=record.arg;this.method="return";this.next="end";}else if(record.type==="normal"&&afterLoc){this.next=afterLoc;}return ContinueSentinel;},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc){this.complete(entry.completion,entry.afterLoc);resetTryEntry(entry);return ContinueSentinel;}}},"catch":function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if(record.type==="throw"){var thrown=record.arg;resetTryEntry(entry);}return thrown;}}// The context.catch method must only be called with a location
// argument that corresponds to a known catch block.
throw new Error("illegal catch attempt");},delegateYield:function delegateYield(iterable,resultName,nextLoc){this.delegate={iterator:values(iterable),resultName:resultName,nextLoc:nextLoc};if(this.method==="next"){// Deliberately forget the last sent value so that we don't
// accidentally pass it on to the delegate.
this.arg=undefined;}return ContinueSentinel;}};}(// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global==="undefined"?"undefined":_typeof(global))==="object"?global:(typeof window==="undefined"?"undefined":_typeof(window))==="object"?window:(typeof self==="undefined"?"undefined":_typeof(self))==="object"?self:this);}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],360:[function(require,module,exports){/* eslint-disable node/no-deprecated-api */var buffer=require('buffer');var Buffer=buffer.Buffer;// alternative to using Object.keys for old browsers
function copyProps(src,dst){for(var key in src){dst[key]=src[key];}}if(Buffer.from&&Buffer.alloc&&Buffer.allocUnsafe&&Buffer.allocUnsafeSlow){module.exports=buffer;}else{// Copy properties from require('buffer')
copyProps(buffer,exports);exports.Buffer=SafeBuffer;}function SafeBuffer(arg,encodingOrOffset,length){return Buffer(arg,encodingOrOffset,length);}// Copy static methods from Buffer
copyProps(Buffer,SafeBuffer);SafeBuffer.from=function(arg,encodingOrOffset,length){if(typeof arg==='number'){throw new TypeError('Argument must not be a number');}return Buffer(arg,encodingOrOffset,length);};SafeBuffer.alloc=function(size,fill,encoding){if(typeof size!=='number'){throw new TypeError('Argument must be a number');}var buf=Buffer(size);if(fill!==undefined){if(typeof encoding==='string'){buf.fill(fill,encoding);}else{buf.fill(fill);}}else{buf.fill(0);}return buf;};SafeBuffer.allocUnsafe=function(size){if(typeof size!=='number'){throw new TypeError('Argument must be a number');}return Buffer(size);};SafeBuffer.allocUnsafeSlow=function(size){if(typeof size!=='number'){throw new TypeError('Argument must be a number');}return buffer.SlowBuffer(size);};},{"buffer":405}],361:[function(require,module,exports){(function(Buffer){module.exports=Peer;var debug=require('debug')('simple-peer');var getBrowserRTC=require('get-browser-rtc');var inherits=require('inherits');var randombytes=require('randombytes');var stream=require('readable-stream');var MAX_BUFFERED_AMOUNT=64*1024;inherits(Peer,stream.Duplex);/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */function Peer(opts){var self=this;if(!(self instanceof Peer))return new Peer(opts);self._id=randombytes(4).toString('hex').slice(0,7);self._debug('new peer %o',opts);opts=Object.assign({allowHalfOpen:false},opts);stream.Duplex.call(self,opts);self.channelName=opts.initiator?opts.channelName||randombytes(20).toString('hex'):null;// Needed by _transformConstraints, so set this early
self._isChromium=typeof window!=='undefined'&&!!window.webkitRTCPeerConnection;self.initiator=opts.initiator||false;self.channelConfig=opts.channelConfig||Peer.channelConfig;self.config=opts.config||Peer.config;self.constraints=self._transformConstraints(opts.constraints||Peer.constraints);self.offerConstraints=self._transformConstraints(opts.offerConstraints||{});self.answerConstraints=self._transformConstraints(opts.answerConstraints||{});self.reconnectTimer=opts.reconnectTimer||false;self.sdpTransform=opts.sdpTransform||function(sdp){return sdp;};self.stream=opts.stream||false;self.trickle=opts.trickle!==undefined?opts.trickle:true;self.destroyed=false;self.connected=false;self.remoteAddress=undefined;self.remoteFamily=undefined;self.remotePort=undefined;self.localAddress=undefined;self.localPort=undefined;self._wrtc=opts.wrtc&&_typeof(opts.wrtc)==='object'?opts.wrtc:getBrowserRTC();if(!self._wrtc){if(typeof window==='undefined'){throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment');}else{throw new Error('No WebRTC support: Not a supported browser');}}self._pcReady=false;self._channelReady=false;self._iceComplete=false;// ice candidate trickle done (got null candidate)
self._channel=null;self._pendingCandidates=[];self._previousStreams=[];self._chunk=null;self._cb=null;self._interval=null;self._reconnectTimeout=null;self._pc=new self._wrtc.RTCPeerConnection(self.config,self.constraints);// We prefer feature detection whenever possible, but sometimes that's not
// possible for certain implementations.
self._isWrtc=Array.isArray(self._pc.RTCIceConnectionStates);self._isReactNativeWebrtc=typeof self._pc._peerConnectionId==='number';self._pc.oniceconnectionstatechange=function(){self._onIceConnectionStateChange();};self._pc.onsignalingstatechange=function(){self._onSignalingStateChange();};self._pc.onicecandidate=function(event){self._onIceCandidate(event);};if(self.initiator){var createdOffer=false;self._pc.onnegotiationneeded=function(){if(!createdOffer)self._createOffer();createdOffer=true;};self._setupData({channel:self._pc.createDataChannel(self.channelName,self.channelConfig)});}else{self._pc.ondatachannel=function(event){self._setupData(event);};}if('addTrack'in self._pc){// WebRTC Spec, Firefox
if(self.stream){self.stream.getTracks().forEach(function(track){self._pc.addTrack(track,self.stream);});}self._pc.ontrack=function(event){self._onTrack(event);};}else{// Chrome, etc. This can be removed once all browsers support `ontrack`
if(self.stream)self._pc.addStream(self.stream);self._pc.onaddstream=function(event){self._onAddStream(event);};}// HACK: wrtc doesn't fire the 'negotionneeded' event
if(self.initiator&&self._isWrtc){self._pc.onnegotiationneeded();}self._onFinishBound=function(){self._onFinish();};self.once('finish',self._onFinishBound);}Peer.WEBRTC_SUPPORT=!!getBrowserRTC();/**
 * Expose config, constraints, and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config, opts.constraints, or opts.channelConfig
 * when constructing a Peer.
 */Peer.config={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:global.stun.twilio.com:3478?transport=udp'}]};Peer.constraints={};Peer.channelConfig={};Object.defineProperty(Peer.prototype,'bufferSize',{get:function get(){var self=this;return self._channel&&self._channel.bufferedAmount||0;}});Peer.prototype.address=function(){var self=this;return{port:self.localPort,family:'IPv4',address:self.localAddress};};Peer.prototype.signal=function(data){var self=this;if(self.destroyed)throw new Error('cannot signal after peer is destroyed');if(typeof data==='string'){try{data=JSON.parse(data);}catch(err){data={};}}self._debug('signal()');if(data.candidate){if(self._pc.remoteDescription)self._addIceCandidate(data.candidate);else self._pendingCandidates.push(data.candidate);}if(data.sdp){self._pc.setRemoteDescription(new self._wrtc.RTCSessionDescription(data),function(){if(self.destroyed)return;self._pendingCandidates.forEach(function(candidate){self._addIceCandidate(candidate);});self._pendingCandidates=[];if(self._pc.remoteDescription.type==='offer')self._createAnswer();},function(err){self._onError(err);});}if(!data.sdp&&!data.candidate){self._destroy(new Error('signal() called with invalid signal data'));}};Peer.prototype._addIceCandidate=function(candidate){var self=this;try{self._pc.addIceCandidate(new self._wrtc.RTCIceCandidate(candidate),noop,function(err){self._onError(err);});}catch(err){self._destroy(new Error('error adding candidate: '+err.message));}};/**
 * Send text/binary data to the remote peer.
 * @param {TypedArrayView|ArrayBuffer|Buffer|string|Blob|Object} chunk
 */Peer.prototype.send=function(chunk){var self=this;// HACK: `wrtc` module crashes on Node.js Buffer, so convert to Uint8Array
// See: https://github.com/feross/simple-peer/issues/60
if(self._isWrtc&&Buffer.isBuffer(chunk)){chunk=new Uint8Array(chunk);}self._channel.send(chunk);};Peer.prototype.destroy=function(onclose){var self=this;self._destroy(null,onclose);};Peer.prototype._destroy=function(err,onclose){var self=this;if(self.destroyed)return;if(onclose)self.once('close',onclose);self._debug('destroy (error: %s)',err&&err.message);self.readable=self.writable=false;if(!self._readableState.ended)self.push(null);if(!self._writableState.finished)self.end();self.destroyed=true;self.connected=false;self._pcReady=false;self._channelReady=false;self._previousStreams=null;clearInterval(self._interval);clearTimeout(self._reconnectTimeout);self._interval=null;self._reconnectTimeout=null;self._chunk=null;self._cb=null;if(self._onFinishBound)self.removeListener('finish',self._onFinishBound);self._onFinishBound=null;if(self._pc){try{self._pc.close();}catch(err){}self._pc.oniceconnectionstatechange=null;self._pc.onsignalingstatechange=null;self._pc.onicecandidate=null;if('addTrack'in self._pc){self._pc.ontrack=null;}else{self._pc.onaddstream=null;}self._pc.onnegotiationneeded=null;self._pc.ondatachannel=null;}if(self._channel){try{self._channel.close();}catch(err){}self._channel.onmessage=null;self._channel.onopen=null;self._channel.onclose=null;}self._pc=null;self._channel=null;if(err)self.emit('error',err);self.emit('close');};Peer.prototype._setupData=function(event){var self=this;self._channel=event.channel;self._channel.binaryType='arraybuffer';if(typeof self._channel.bufferedAmountLowThreshold==='number'){self._channel.bufferedAmountLowThreshold=MAX_BUFFERED_AMOUNT;}self.channelName=self._channel.label;self._channel.onmessage=function(event){self._onChannelMessage(event);};self._channel.onbufferedamountlow=function(){self._onChannelBufferedAmountLow();};self._channel.onopen=function(){self._onChannelOpen();};self._channel.onclose=function(){self._onChannelClose();};};Peer.prototype._read=function(){};Peer.prototype._write=function(chunk,encoding,cb){var self=this;if(self.destroyed)return cb(new Error('cannot write after peer is destroyed'));if(self.connected){try{self.send(chunk);}catch(err){return self._onError(err);}if(self._channel.bufferedAmount>MAX_BUFFERED_AMOUNT){self._debug('start backpressure: bufferedAmount %d',self._channel.bufferedAmount);self._cb=cb;}else{cb(null);}}else{self._debug('write before connect');self._chunk=chunk;self._cb=cb;}};// When stream finishes writing, close socket. Half open connections are not
// supported.
Peer.prototype._onFinish=function(){var self=this;if(self.destroyed)return;if(self.connected){destroySoon();}else{self.once('connect',destroySoon);}// Wait a bit before destroying so the socket flushes.
// TODO: is there a more reliable way to accomplish this?
function destroySoon(){setTimeout(function(){self._destroy();},100);}};Peer.prototype._createOffer=function(){var self=this;if(self.destroyed)return;self._pc.createOffer(function(offer){if(self.destroyed)return;offer.sdp=self.sdpTransform(offer.sdp);self._pc.setLocalDescription(offer,noop,function(err){self._onError(err);});var sendOffer=function sendOffer(){var signal=self._pc.localDescription||offer;self._debug('signal');self.emit('signal',{type:signal.type,sdp:signal.sdp});};if(self.trickle||self._iceComplete)sendOffer();else self.once('_iceComplete',sendOffer);// wait for candidates
},function(err){self._onError(err);},self.offerConstraints);};Peer.prototype._createAnswer=function(){var self=this;if(self.destroyed)return;self._pc.createAnswer(function(answer){if(self.destroyed)return;answer.sdp=self.sdpTransform(answer.sdp);self._pc.setLocalDescription(answer,noop,function(err){self._onError(err);});if(self.trickle||self._iceComplete)sendAnswer();else self.once('_iceComplete',sendAnswer);function sendAnswer(){var signal=self._pc.localDescription||answer;self._debug('signal');self.emit('signal',{type:signal.type,sdp:signal.sdp});}},function(err){self._onError(err);},self.answerConstraints);};Peer.prototype._onIceConnectionStateChange=function(){var self=this;if(self.destroyed)return;var iceGatheringState=self._pc.iceGatheringState;var iceConnectionState=self._pc.iceConnectionState;self._debug('iceConnectionStateChange %s %s',iceGatheringState,iceConnectionState);self.emit('iceConnectionStateChange',iceGatheringState,iceConnectionState);if(iceConnectionState==='connected'||iceConnectionState==='completed'){clearTimeout(self._reconnectTimeout);self._pcReady=true;self._maybeReady();}if(iceConnectionState==='disconnected'){if(self.reconnectTimer){// If user has set `opt.reconnectTimer`, allow time for ICE to attempt a reconnect
clearTimeout(self._reconnectTimeout);self._reconnectTimeout=setTimeout(function(){self._destroy();},self.reconnectTimer);}else{self._destroy();}}if(iceConnectionState==='failed'){self._destroy(new Error('Ice connection failed.'));}if(iceConnectionState==='closed'){self._destroy();}};Peer.prototype.getStats=function(cb){var self=this;// Promise-based getStats() (standard)
if(self._pc.getStats.length===0){self._pc.getStats().then(function(res){var reports=[];res.forEach(function(report){reports.push(report);});cb(reports);},function(err){self._onError(err);});// Two-parameter callback-based getStats() (deprecated, former standard)
}else if(self._isReactNativeWebrtc){self._pc.getStats(null,function(res){var reports=[];res.forEach(function(report){reports.push(report);});cb(reports);},function(err){self._onError(err);});// Single-parameter callback-based getStats() (non-standard)
}else if(self._pc.getStats.length>0){self._pc.getStats(function(res){var reports=[];res.result().forEach(function(result){var report={};result.names().forEach(function(name){report[name]=result.stat(name);});report.id=result.id;report.type=result.type;report.timestamp=result.timestamp;reports.push(report);});cb(reports);},function(err){self._onError(err);});// Unknown browser, skip getStats() since it's anyone's guess which style of
// getStats() they implement.
}else{cb([]);}};Peer.prototype._maybeReady=function(){var self=this;self._debug('maybeReady pc %s channel %s',self._pcReady,self._channelReady);if(self.connected||self._connecting||!self._pcReady||!self._channelReady)return;self._connecting=true;self.getStats(function(items){self._connecting=false;self.connected=true;var remoteCandidates={};var localCandidates={};var candidatePairs={};items.forEach(function(item){// TODO: Once all browsers support the hyphenated stats report types, remove
// the non-hypenated ones
if(item.type==='remotecandidate'||item.type==='remote-candidate'){remoteCandidates[item.id]=item;}if(item.type==='localcandidate'||item.type==='local-candidate'){localCandidates[item.id]=item;}if(item.type==='candidatepair'||item.type==='candidate-pair'){candidatePairs[item.id]=item;}});items.forEach(function(item){// Spec-compliant
if(item.type==='transport'){setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId]);}// Old implementations
if(item.type==='googCandidatePair'&&item.googActiveConnection==='true'||(item.type==='candidatepair'||item.type==='candidate-pair')&&item.selected){setSelectedCandidatePair(item);}});function setSelectedCandidatePair(selectedCandidatePair){var local=localCandidates[selectedCandidatePair.localCandidateId];if(local&&local.ip){// Spec
self.localAddress=local.ip;self.localPort=Number(local.port);}else if(local&&local.ipAddress){// Firefox
self.localAddress=local.ipAddress;self.localPort=Number(local.portNumber);}else if(typeof selectedCandidatePair.googLocalAddress==='string'){// TODO: remove this once Chrome 58 is released
local=selectedCandidatePair.googLocalAddress.split(':');self.localAddress=local[0];self.localPort=Number(local[1]);}var remote=remoteCandidates[selectedCandidatePair.remoteCandidateId];if(remote&&remote.ip){// Spec
self.remoteAddress=remote.ip;self.remotePort=Number(remote.port);}else if(remote&&remote.ipAddress){// Firefox
self.remoteAddress=remote.ipAddress;self.remotePort=Number(remote.portNumber);}else if(typeof selectedCandidatePair.googRemoteAddress==='string'){// TODO: remove this once Chrome 58 is released
remote=selectedCandidatePair.googRemoteAddress.split(':');self.remoteAddress=remote[0];self.remotePort=Number(remote[1]);}self.remoteFamily='IPv4';self._debug('connect local: %s:%s remote: %s:%s',self.localAddress,self.localPort,self.remoteAddress,self.remotePort);}if(self._chunk){try{self.send(self._chunk);}catch(err){return self._onError(err);}self._chunk=null;self._debug('sent chunk from "write before connect"');var cb=self._cb;self._cb=null;cb(null);}// If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
// fallback to using setInterval to implement backpressure.
if(typeof self._channel.bufferedAmountLowThreshold!=='number'){self._interval=setInterval(function(){self._onInterval();},150);if(self._interval.unref)self._interval.unref();}self._debug('connect');self.emit('connect');});};Peer.prototype._onInterval=function(){if(!this._cb||!this._channel||this._channel.bufferedAmount>MAX_BUFFERED_AMOUNT){return;}this._onChannelBufferedAmountLow();};Peer.prototype._onSignalingStateChange=function(){var self=this;if(self.destroyed)return;self._debug('signalingStateChange %s',self._pc.signalingState);self.emit('signalingStateChange',self._pc.signalingState);};Peer.prototype._onIceCandidate=function(event){var self=this;if(self.destroyed)return;if(event.candidate&&self.trickle){self.emit('signal',{candidate:{candidate:event.candidate.candidate,sdpMLineIndex:event.candidate.sdpMLineIndex,sdpMid:event.candidate.sdpMid}});}else if(!event.candidate){self._iceComplete=true;self.emit('_iceComplete');}};Peer.prototype._onChannelMessage=function(event){var self=this;if(self.destroyed)return;var data=event.data;if(data instanceof ArrayBuffer)data=new Buffer(data);self.push(data);};Peer.prototype._onChannelBufferedAmountLow=function(){var self=this;if(self.destroyed||!self._cb)return;self._debug('ending backpressure: bufferedAmount %d',self._channel.bufferedAmount);var cb=self._cb;self._cb=null;cb(null);};Peer.prototype._onChannelOpen=function(){var self=this;if(self.connected||self.destroyed)return;self._debug('on channel open');self._channelReady=true;self._maybeReady();};Peer.prototype._onChannelClose=function(){var self=this;if(self.destroyed)return;self._debug('on channel close');self._destroy();};Peer.prototype._onAddStream=function(event){var self=this;if(self.destroyed)return;self._debug('on add stream');self.emit('stream',event.stream);};Peer.prototype._onTrack=function(event){var self=this;if(self.destroyed)return;self._debug('on track');var id=event.streams[0].id;if(self._previousStreams.indexOf(id)!==-1)return;// Only fire one 'stream' event, even though there may be multiple tracks per stream
self._previousStreams.push(id);self.emit('stream',event.streams[0]);};Peer.prototype._onError=function(err){var self=this;if(self.destroyed)return;self._debug('error %s',err.message||err);self._destroy(err);};Peer.prototype._debug=function(){var self=this;var args=[].slice.call(arguments);args[0]='['+self._id+'] '+args[0];debug.apply(null,args);};// Transform constraints objects into the new format (unless Chromium)
// TODO: This can be removed when Chromium supports the new format
Peer.prototype._transformConstraints=function(constraints){var self=this;if(Object.keys(constraints).length===0){return constraints;}if((constraints.mandatory||constraints.optional)&&!self._isChromium){// convert to new format
// Merge mandatory and optional objects, prioritizing mandatory
var newConstraints=Object.assign({},constraints.optional,constraints.mandatory);// fix casing
if(newConstraints.OfferToReceiveVideo!==undefined){newConstraints.offerToReceiveVideo=newConstraints.OfferToReceiveVideo;delete newConstraints['OfferToReceiveVideo'];}if(newConstraints.OfferToReceiveAudio!==undefined){newConstraints.offerToReceiveAudio=newConstraints.OfferToReceiveAudio;delete newConstraints['OfferToReceiveAudio'];}return newConstraints;}else if(!constraints.mandatory&&!constraints.optional&&self._isChromium){// convert to old format
// fix casing
if(constraints.offerToReceiveVideo!==undefined){constraints.OfferToReceiveVideo=constraints.offerToReceiveVideo;delete constraints['offerToReceiveVideo'];}if(constraints.offerToReceiveAudio!==undefined){constraints.OfferToReceiveAudio=constraints.offerToReceiveAudio;delete constraints['offerToReceiveAudio'];}return{mandatory:constraints// NOTE: All constraints are upgraded to mandatory
};}return constraints;};function noop(){}}).call(this,require("buffer").Buffer);},{"buffer":405,"debug":307,"get-browser-rtc":324,"inherits":329,"randombytes":351,"readable-stream":358}],362:[function(require,module,exports){module.exports=SimpleSignalClient;var SimplePeer=require('simple-peer');var cuid=require('cuid');require('babel-polyfill');function SimpleSignalClient(socket,metadata){var self=this;metadata=metadata||{};self._handlers={};self._peers={};self._requests={};self.id=null;self.socket=socket;// Discover own socket.id
socket.on('connect',function(){socket.emit('simple-signal[discover]',metadata);});if(socket.connected){socket.emit('simple-signal[discover]',metadata);}socket.on('simple-signal[discover]',function(data){self.id=data.id;self._emit('ready',data.metadata);});// Respond to offers
socket.on('simple-signal[offer]',function(data){if(self._requests[data.trackingNumber]){if(self._peers[data.trackingNumber]){self._peers[data.trackingNumber].signal(data.signal);}else{self._requests[data.trackingNumber].push(data.signal);}return;}else{self._requests[data.trackingNumber]=[data.signal];}self._emit('request',{id:data.id,metadata:data.metadata||{},accept:function accept(opts,metadata){opts=opts||{};metadata=metadata||{};opts.initiator=false;var peer=new SimplePeer(opts);peer.id=data.id;peer.metadata=data.metadata||{};self._peers[data.trackingNumber]=peer;self._emit('peer',peer);peer.on('signal',function(signal){socket.emit('simple-signal[answer]',{signal:signal,trackingNumber:data.trackingNumber,target:data.id,metadata:metadata});});while(self._requests[data.trackingNumber][0]){peer.signal(self._requests[data.trackingNumber].shift());}}});});// Respond to answers
socket.on('simple-signal[answer]',function(data){var peer=self._peers[data.trackingNumber];if(peer){if(peer.id){peer.id=data.id;}else{peer.id=data.id;peer.metadata=data.metadata;self._emit('peer',peer);}peer.signal(data.signal);}});}SimpleSignalClient.prototype._emit=function(event,data){var self=this;var fns=self._handlers[event]||[];var fn;var i;for(i=0;i<fns.length;i++){fn=fns[i];if(fn&&typeof fn==='function'){fn(data);}}};SimpleSignalClient.prototype.on=function(event,handler){var self=this;if(!self._handlers[event]){self._handlers[event]=[];}if(handler){self._handlers[event].push(handler);}else{return new Promise(function(resolve,reject){self._handlers[event].push(resolve);});}};SimpleSignalClient.prototype.connect=function(id,opts,metadata){var self=this;opts=opts||{};metadata=metadata||{};opts.initiator=true;var trackingNumber=cuid();var peer=new SimplePeer(opts);self._peers[trackingNumber]=peer;peer.on('signal',function(signal){self.socket.emit('simple-signal[offer]',{signal:signal,trackingNumber:trackingNumber,target:id,metadata:metadata});});};SimpleSignalClient.prototype.rediscover=function(metadata){var self=this;metadata=metadata||{};self.socket.emit('simple-signal[discover]',metadata);};SimpleSignalClient.SimplePeer=SimplePeer;},{"babel-polyfill":3,"cuid":306,"simple-peer":361}],363:[function(require,module,exports){/**
 * Module dependencies.
 */var url=require('./url');var parser=require('socket.io-parser');var Manager=require('./manager');var debug=require('debug')('socket.io-client');/**
 * Module exports.
 */module.exports=exports=lookup;/**
 * Managers cache.
 */var cache=exports.managers={};/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */function lookup(uri,opts){if((typeof uri==="undefined"?"undefined":_typeof(uri))==='object'){opts=uri;uri=undefined;}opts=opts||{};var parsed=url(uri);var source=parsed.source;var id=parsed.id;var path=parsed.path;var sameNamespace=cache[id]&&path in cache[id].nsps;var newConnection=opts.forceNew||opts['force new connection']||false===opts.multiplex||sameNamespace;var io;if(newConnection){debug('ignoring socket cache for %s',source);io=Manager(source,opts);}else{if(!cache[id]){debug('new io instance for %s',source);cache[id]=Manager(source,opts);}io=cache[id];}if(parsed.query&&!opts.query){opts.query=parsed.query;}else if(opts&&'object'===_typeof(opts.query)){opts.query=encodeQueryString(opts.query);}return io.socket(parsed.path,opts);}/**
 *  Helper method to parse query objects to string.
 * @param {object} query
 * @returns {string}
 */function encodeQueryString(obj){var str=[];for(var p in obj){if(obj.hasOwnProperty(p)){str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]));}}return str.join('&');}/**
 * Protocol version.
 *
 * @api public
 */exports.protocol=parser.protocol;/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */exports.connect=lookup;/**
 * Expose constructors for standalone build.
 *
 * @api public
 */exports.Manager=require('./manager');exports.Socket=require('./socket');},{"./manager":364,"./socket":366,"./url":367,"debug":368,"socket.io-parser":371}],364:[function(require,module,exports){/**
 * Module dependencies.
 */var eio=require('engine.io-client');var Socket=require('./socket');var Emitter=require('component-emitter');var parser=require('socket.io-parser');var on=require('./on');var bind=require('component-bind');var debug=require('debug')('socket.io-client:manager');var indexOf=require('indexof');var Backoff=require('backo2');/**
 * IE6+ hasOwnProperty
 */var has=Object.prototype.hasOwnProperty;/**
 * Module exports
 */module.exports=Manager;/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri&&'object'===(typeof uri==="undefined"?"undefined":_typeof(uri))){opts=uri;uri=undefined;}opts=opts||{};opts.path=opts.path||'/socket.io';this.nsps={};this.subs=[];this.opts=opts;this.reconnection(opts.reconnection!==false);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1000);this.reconnectionDelayMax(opts.reconnectionDelayMax||5000);this.randomizationFactor(opts.randomizationFactor||0.5);this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null==opts.timeout?20000:opts.timeout);this.readyState='closed';this.uri=uri;this.connecting=[];this.lastPing=null;this.encoding=false;this.packetBuffer=[];this.encoder=new parser.Encoder();this.decoder=new parser.Decoder();this.autoConnect=opts.autoConnect!==false;if(this.autoConnect)this.open();}/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var nsp in this.nsps){if(has.call(this.nsps,nsp)){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments);}}};/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */Manager.prototype.updateSocketIds=function(){for(var nsp in this.nsps){if(has.call(this.nsps,nsp)){this.nsps[nsp].id=this.engine.id;}}};/**
 * Mix in `Emitter`.
 */Emitter(Manager.prototype);/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this;};/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this;};/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;this.backoff&&this.backoff.setMin(v);return this;};Manager.prototype.randomizationFactor=function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor=v;this.backoff&&this.backoff.setJitter(v);return this;};/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;this.backoff&&this.backoff.setMax(v);return this;};/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this;};/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */Manager.prototype.maybeReconnectOnOpen=function(){// Only try to reconnect if it's the first time we're connecting
if(!this.reconnecting&&this._reconnection&&this.backoff.attempts===0){// keeps reconnection from firing twice for the same reconnection loop
this.reconnect();}};/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */Manager.prototype.open=Manager.prototype.connect=function(fn,opts){debug('readyState %s',this.readyState);if(~this.readyState.indexOf('open'))return this;debug('opening %s',this.uri);this.engine=eio(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState='opening';this.skipReconnect=false;// emit `open`
var openSub=on(socket,'open',function(){self.onopen();fn&&fn();});// emit `connect_error`
var errorSub=on(socket,'error',function(data){debug('connect_error');self.cleanup();self.readyState='closed';self.emitAll('connect_error',data);if(fn){var err=new Error('Connection error');err.data=data;fn(err);}else{// Only do this if there is no fn to handle the error
self.maybeReconnectOnOpen();}});// emit `connect_timeout`
if(false!==this._timeout){var timeout=this._timeout;debug('connect attempt will timeout after %d',timeout);// set timer
var timer=setTimeout(function(){debug('connect attempt timed out after %d',timeout);openSub.destroy();socket.close();socket.emit('error','timeout');self.emitAll('connect_timeout',timeout);},timeout);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}this.subs.push(openSub);this.subs.push(errorSub);return this;};/**
 * Called upon transport open.
 *
 * @api private
 */Manager.prototype.onopen=function(){debug('open');// clear old subs
this.cleanup();// mark as open
this.readyState='open';this.emit('open');// add new subs
var socket=this.engine;this.subs.push(on(socket,'data',bind(this,'ondata')));this.subs.push(on(socket,'ping',bind(this,'onping')));this.subs.push(on(socket,'pong',bind(this,'onpong')));this.subs.push(on(socket,'error',bind(this,'onerror')));this.subs.push(on(socket,'close',bind(this,'onclose')));this.subs.push(on(this.decoder,'decoded',bind(this,'ondecoded')));};/**
 * Called upon a ping.
 *
 * @api private
 */Manager.prototype.onping=function(){this.lastPing=new Date();this.emitAll('ping');};/**
 * Called upon a packet.
 *
 * @api private
 */Manager.prototype.onpong=function(){this.emitAll('pong',new Date()-this.lastPing);};/**
 * Called with data.
 *
 * @api private
 */Manager.prototype.ondata=function(data){this.decoder.add(data);};/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */Manager.prototype.ondecoded=function(packet){this.emit('packet',packet);};/**
 * Called upon socket error.
 *
 * @api private
 */Manager.prototype.onerror=function(err){debug('error',err);this.emitAll('error',err);};/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */Manager.prototype.socket=function(nsp,opts){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp,opts);this.nsps[nsp]=socket;var self=this;socket.on('connecting',onConnecting);socket.on('connect',function(){socket.id=self.engine.id;});if(this.autoConnect){// manually call here since connecting evnet is fired before listening
onConnecting();}}function onConnecting(){if(!~indexOf(self.connecting,socket)){self.connecting.push(socket);}}return socket;};/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */Manager.prototype.destroy=function(socket){var index=indexOf(this.connecting,socket);if(~index)this.connecting.splice(index,1);if(this.connecting.length)return;this.close();};/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */Manager.prototype.packet=function(packet){debug('writing packet %j',packet);var self=this;if(packet.query&&packet.type===0)packet.nsp+='?'+packet.query;if(!self.encoding){// encode, then write to engine with result
self.encoding=true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i<encodedPackets.length;i++){self.engine.write(encodedPackets[i],packet.options);}self.encoding=false;self.processPacketQueue();});}else{// add packet to the queue
self.packetBuffer.push(packet);}};/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var pack=this.packetBuffer.shift();this.packet(pack);}};/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */Manager.prototype.cleanup=function(){debug('cleanup');var subsLength=this.subs.length;for(var i=0;i<subsLength;i++){var sub=this.subs.shift();sub.destroy();}this.packetBuffer=[];this.encoding=false;this.lastPing=null;this.decoder.destroy();};/**
 * Close the current socket.
 *
 * @api private
 */Manager.prototype.close=Manager.prototype.disconnect=function(){debug('disconnect');this.skipReconnect=true;this.reconnecting=false;if('opening'===this.readyState){// `onclose` will not fire because
// an open event never happened
this.cleanup();}this.backoff.reset();this.readyState='closed';if(this.engine)this.engine.close();};/**
 * Called upon engine close.
 *
 * @api private
 */Manager.prototype.onclose=function(reason){debug('onclose');this.cleanup();this.backoff.reset();this.readyState='closed';this.emit('close',reason);if(this._reconnection&&!this.skipReconnect){this.reconnect();}};/**
 * Attempt a reconnection.
 *
 * @api private
 */Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){debug('reconnect failed');this.backoff.reset();this.emitAll('reconnect_failed');this.reconnecting=false;}else{var delay=this.backoff.duration();debug('will wait %dms before reconnect attempt',delay);this.reconnecting=true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug('attempting reconnect');self.emitAll('reconnect_attempt',self.backoff.attempts);self.emitAll('reconnecting',self.backoff.attempts);// check again for the case socket closed in above events
if(self.skipReconnect)return;self.open(function(err){if(err){debug('reconnect attempt error');self.reconnecting=false;self.reconnect();self.emitAll('reconnect_error',err.data);}else{debug('reconnect success');self.onreconnect();}});},delay);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}};/**
 * Called upon successful reconnect.
 *
 * @api private
 */Manager.prototype.onreconnect=function(){var attempt=this.backoff.attempts;this.reconnecting=false;this.backoff.reset();this.updateSocketIds();this.emitAll('reconnect',attempt);};},{"./on":365,"./socket":366,"backo2":4,"component-bind":8,"component-emitter":9,"debug":368,"engine.io-client":309,"indexof":328,"socket.io-parser":371}],365:[function(require,module,exports){/**
 * Module exports.
 */module.exports=on;/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */function on(obj,ev,fn){obj.on(ev,fn);return{destroy:function destroy(){obj.removeListener(ev,fn);}};}},{}],366:[function(require,module,exports){/**
 * Module dependencies.
 */var parser=require('socket.io-parser');var Emitter=require('component-emitter');var toArray=require('to-array');var on=require('./on');var bind=require('component-bind');var debug=require('debug')('socket.io-client:socket');var hasBin=require('has-binary');/**
 * Module exports.
 */module.exports=exports=Socket;/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */var events={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1};/**
 * Shortcut to `Emitter#emit`.
 */var emit=Emitter.prototype.emit;/**
 * `Socket` constructor.
 *
 * @api public
 */function Socket(io,nsp,opts){this.io=io;this.nsp=nsp;this.json=this;// compat
this.ids=0;this.acks={};this.receiveBuffer=[];this.sendBuffer=[];this.connected=false;this.disconnected=true;if(opts&&opts.query){this.query=opts.query;}if(this.io.autoConnect)this.open();}/**
 * Mix in `Emitter`.
 */Emitter(Socket.prototype);/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */Socket.prototype.subEvents=function(){if(this.subs)return;var io=this.io;this.subs=[on(io,'open',bind(this,'onopen')),on(io,'packet',bind(this,'onpacket')),on(io,'close',bind(this,'onclose'))];};/**
 * "Opens" the socket.
 *
 * @api public
 */Socket.prototype.open=Socket.prototype.connect=function(){if(this.connected)return this;this.subEvents();this.io.open();// ensure open
if('open'===this.io.readyState)this.onopen();this.emit('connecting');return this;};/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */Socket.prototype.send=function(){var args=toArray(arguments);args.unshift('message');this.emit.apply(this,args);return this;};/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */Socket.prototype.emit=function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this;}var args=toArray(arguments);var parserType=parser.EVENT;// default
if(hasBin(args)){parserType=parser.BINARY_EVENT;}// binary
var packet={type:parserType,data:args};packet.options={};packet.options.compress=!this.flags||false!==this.flags.compress;// event ack callback
if('function'===typeof args[args.length-1]){debug('emitting packet with ack id %d',this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++;}if(this.connected){this.packet(packet);}else{this.sendBuffer.push(packet);}delete this.flags;return this;};/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.packet(packet);};/**
 * Called upon engine `open`.
 *
 * @api private
 */Socket.prototype.onopen=function(){debug('transport is open - connecting');// write connect packet if necessary
if('/'!==this.nsp){if(this.query){this.packet({type:parser.CONNECT,query:this.query});}else{this.packet({type:parser.CONNECT});}}};/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */Socket.prototype.onclose=function(reason){debug('close (%s)',reason);this.connected=false;this.disconnected=true;delete this.id;this.emit('disconnect',reason);};/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */Socket.prototype.onpacket=function(packet){if(packet.nsp!==this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.BINARY_EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.BINARY_ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit('error',packet.data);break;}};/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */Socket.prototype.onevent=function(packet){var args=packet.data||[];debug('emitting event %j',args);if(null!=packet.id){debug('attaching ack callback to event');args.push(this.ack(packet.id));}if(this.connected){emit.apply(this,args);}else{this.receiveBuffer.push(args);}};/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */Socket.prototype.ack=function(id){var self=this;var sent=false;return function(){// prevent double callbacks
if(sent)return;sent=true;var args=toArray(arguments);debug('sending ack %j',args);var type=hasBin(args)?parser.BINARY_ACK:parser.ACK;self.packet({type:type,id:id,data:args});};};/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */Socket.prototype.onack=function(packet){var ack=this.acks[packet.id];if('function'===typeof ack){debug('calling ack %s with %j',packet.id,packet.data);ack.apply(this,packet.data);delete this.acks[packet.id];}else{debug('bad ack %s',packet.id);}};/**
 * Called upon server connect.
 *
 * @api private
 */Socket.prototype.onconnect=function(){this.connected=true;this.disconnected=false;this.emit('connect');this.emitBuffered();};/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */Socket.prototype.emitBuffered=function(){var i;for(i=0;i<this.receiveBuffer.length;i++){emit.apply(this,this.receiveBuffer[i]);}this.receiveBuffer=[];for(i=0;i<this.sendBuffer.length;i++){this.packet(this.sendBuffer[i]);}this.sendBuffer=[];};/**
 * Called upon server disconnect.
 *
 * @api private
 */Socket.prototype.ondisconnect=function(){debug('server disconnect (%s)',this.nsp);this.destroy();this.onclose('io server disconnect');};/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */Socket.prototype.destroy=function(){if(this.subs){// clean subscriptions to avoid reconnections
for(var i=0;i<this.subs.length;i++){this.subs[i].destroy();}this.subs=null;}this.io.destroy(this);};/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */Socket.prototype.close=Socket.prototype.disconnect=function(){if(this.connected){debug('performing disconnect (%s)',this.nsp);this.packet({type:parser.DISCONNECT});}// remove socket from pool
this.destroy();if(this.connected){// fire events
this.onclose('io client disconnect');}return this;};/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */Socket.prototype.compress=function(compress){this.flags=this.flags||{};this.flags.compress=compress;return this;};},{"./on":365,"component-bind":8,"component-emitter":9,"debug":368,"has-binary":325,"socket.io-parser":371,"to-array":381}],367:[function(require,module,exports){(function(global){/**
 * Module dependencies.
 */var parseuri=require('parseuri');var debug=require('debug')('socket.io-client:url');/**
 * Module exports.
 */module.exports=url;/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */function url(uri,loc){var obj=uri;// default to window.location
loc=loc||global.location;if(null==uri)uri=loc.protocol+'//'+loc.host;// relative path support
if('string'===typeof uri){if('/'===uri.charAt(0)){if('/'===uri.charAt(1)){uri=loc.protocol+uri;}else{uri=loc.host+uri;}}if(!/^(https?|wss?):\/\//.test(uri)){debug('protocol-less url %s',uri);if('undefined'!==typeof loc){uri=loc.protocol+'//'+uri;}else{uri='https://'+uri;}}// parse
debug('parse %s',uri);obj=parseuri(uri);}// make sure we treat `localhost:80` and `localhost` equally
if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port='80';}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port='443';}}obj.path=obj.path||'/';var ipv6=obj.host.indexOf(':')!==-1;var host=ipv6?'['+obj.host+']':obj.host;// define unique id
obj.id=obj.protocol+'://'+host+':'+obj.port;// define href
obj.href=obj.protocol+'://'+host+(loc&&loc.port===obj.port?'':':'+obj.port);return obj;}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"debug":368,"parseuri":349}],368:[function(require,module,exports){arguments[4][319][0].apply(exports,arguments);},{"./debug":369,"_process":413,"dup":319}],369:[function(require,module,exports){arguments[4][320][0].apply(exports,arguments);},{"dup":320,"ms":335}],370:[function(require,module,exports){(function(global){/*global Blob,File*//**
 * Module requirements
 */var isArray=require('isarray');var isBuf=require('./is-buffer');/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */exports.deconstructPacket=function(packet){var buffers=[];var packetData=packet.data;function _deconstructPacket(data){if(!data)return data;if(isBuf(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder;}else if(isArray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i]);}return newData;}else if('object'==(typeof data==="undefined"?"undefined":_typeof(data))&&!(data instanceof Date)){var newData={};for(var key in data){newData[key]=_deconstructPacket(data[key]);}return newData;}return data;}var pack=packet;pack.data=_deconstructPacket(packetData);pack.attachments=buffers.length;// number of binary 'attachments'
return{packet:pack,buffers:buffers};};/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */exports.reconstructPacket=function(packet,buffers){var curPlaceHolder=0;function _reconstructPacket(data){if(data&&data._placeholder){var buf=buffers[data.num];// appropriate buffer (should be natural order anyway)
return buf;}else if(isArray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i]);}return data;}else if(data&&'object'==(typeof data==="undefined"?"undefined":_typeof(data))){for(var key in data){data[key]=_reconstructPacket(data[key]);}return data;}return data;}packet.data=_reconstructPacket(packet.data);packet.attachments=undefined;// no longer useful
return packet;};/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */exports.removeBlobs=function(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj;// convert any blob
if(global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){pendingBlobs++;// async filereader
var fileReader=new FileReader();fileReader.onload=function(){// this.result == arraybuffer
if(containingObject){containingObject[curKey]=this.result;}else{bloblessData=this.result;}// if nothing pending its callback time
if(! --pendingBlobs){callback(bloblessData);}};fileReader.readAsArrayBuffer(obj);// blob -> arraybuffer
}else if(isArray(obj)){// handle array
for(var i=0;i<obj.length;i++){_removeBlobs(obj[i],i,obj);}}else if(obj&&'object'==(typeof obj==="undefined"?"undefined":_typeof(obj))&&!isBuf(obj)){// and object
for(var key in obj){_removeBlobs(obj[key],key,obj);}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData);}};}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./is-buffer":372,"isarray":376}],371:[function(require,module,exports){/**
 * Module dependencies.
 */var debug=require('debug')('socket.io-parser');var json=require('json3');var Emitter=require('component-emitter');var binary=require('./binary');var isBuf=require('./is-buffer');/**
 * Protocol version.
 *
 * @api public
 */exports.protocol=4;/**
 * Packet types.
 *
 * @api public
 */exports.types=['CONNECT','DISCONNECT','EVENT','ACK','ERROR','BINARY_EVENT','BINARY_ACK'];/**
 * Packet type `connect`.
 *
 * @api public
 */exports.CONNECT=0;/**
 * Packet type `disconnect`.
 *
 * @api public
 */exports.DISCONNECT=1;/**
 * Packet type `event`.
 *
 * @api public
 */exports.EVENT=2;/**
 * Packet type `ack`.
 *
 * @api public
 */exports.ACK=3;/**
 * Packet type `error`.
 *
 * @api public
 */exports.ERROR=4;/**
 * Packet type 'binary event'
 *
 * @api public
 */exports.BINARY_EVENT=5;/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */exports.BINARY_ACK=6;/**
 * Encoder constructor.
 *
 * @api public
 */exports.Encoder=Encoder;/**
 * Decoder constructor.
 *
 * @api public
 */exports.Decoder=Decoder;/**
 * A socket.io Encoder instance
 *
 * @api public
 */function Encoder(){}/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */Encoder.prototype.encode=function(obj,callback){debug('encoding packet %j',obj);if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){encodeAsBinary(obj,callback);}else{var encoding=encodeAsString(obj);callback([encoding]);}};/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */function encodeAsString(obj){var str='';var nsp=false;// first is type
str+=obj.type;// attachments if we have them
if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){str+=obj.attachments;str+='-';}// if we have a namespace other than `/`
// we append it followed by a comma `,`
if(obj.nsp&&'/'!=obj.nsp){nsp=true;str+=obj.nsp;}// immediately followed by the id
if(null!=obj.id){if(nsp){str+=',';nsp=false;}str+=obj.id;}// json data
if(null!=obj.data){if(nsp)str+=',';str+=json.stringify(obj.data);}debug('encoded %j as %s',obj,str);return str;}/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);// add packet info to beginning of data list
callback(buffers);// write all the buffers
}binary.removeBlobs(obj,writeEncoding);}/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */function Decoder(){this.reconstructor=null;}/**
 * Mix in `Emitter` with Decoder.
 */Emitter(Decoder.prototype);/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */Decoder.prototype.add=function(obj){var packet;if('string'==typeof obj){packet=decodeString(obj);if(exports.BINARY_EVENT==packet.type||exports.BINARY_ACK==packet.type){// binary packet's json
this.reconstructor=new BinaryReconstructor(packet);// no attachments, labeled binary but no binary data to follow
if(this.reconstructor.reconPack.attachments===0){this.emit('decoded',packet);}}else{// non-binary full packet
this.emit('decoded',packet);}}else if(isBuf(obj)||obj.base64){// raw binary data
if(!this.reconstructor){throw new Error('got binary data when not reconstructing a packet');}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){// received final buffer
this.reconstructor=null;this.emit('decoded',packet);}}}else{throw new Error('Unknown type: '+obj);}};/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */function decodeString(str){var p={};var i=0;// look up type
p.type=Number(str.charAt(0));if(null==exports.types[p.type])return error();// look up attachments if type binary
if(exports.BINARY_EVENT==p.type||exports.BINARY_ACK==p.type){var buf='';while(str.charAt(++i)!='-'){buf+=str.charAt(i);if(i==str.length)break;}if(buf!=Number(buf)||str.charAt(i)!='-'){throw new Error('Illegal attachments');}p.attachments=Number(buf);}// look up namespace (if any)
if('/'==str.charAt(i+1)){p.nsp='';while(++i){var c=str.charAt(i);if(','==c)break;p.nsp+=c;if(i==str.length)break;}}else{p.nsp='/';}// look up id
var next=str.charAt(i+1);if(''!==next&&Number(next)==next){p.id='';while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break;}p.id+=str.charAt(i);if(i==str.length)break;}p.id=Number(p.id);}// look up json data
if(str.charAt(++i)){p=tryParse(p,str.substr(i));}debug('decoded %s as %j',str,p);return p;}function tryParse(p,str){try{p.data=json.parse(str);}catch(e){return error();}return p;};/**
 * Deallocates a parser's resources
 *
 * @api public
 */Decoder.prototype.destroy=function(){if(this.reconstructor){this.reconstructor.finishedReconstruction();}};/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */function BinaryReconstructor(packet){this.reconPack=packet;this.buffers=[];}/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */BinaryReconstructor.prototype.takeBinaryData=function(binData){this.buffers.push(binData);if(this.buffers.length==this.reconPack.attachments){// done with buffer list
var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet;}return null;};/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null;this.buffers=[];};function error(data){return{type:exports.ERROR,data:'parser error'};}},{"./binary":370,"./is-buffer":372,"component-emitter":373,"debug":374,"json3":331}],372:[function(require,module,exports){(function(global){module.exports=isBuf;/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */function isBuf(obj){return global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer;}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],373:[function(require,module,exports){/**
 * Expose `Emitter`.
 */module.exports=Emitter;/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */function Emitter(obj){if(obj)return mixin(obj);};/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key];}return obj;}/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this;};/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments);}on.fn=fn;this.on(event,on);return this;};/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};// all
if(0==arguments.length){this._callbacks={};return this;}// specific event
var callbacks=this._callbacks[event];if(!callbacks)return this;// remove all handlers
if(1==arguments.length){delete this._callbacks[event];return this;}// remove specific handler
var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break;}}return this;};/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args);}}return this;};/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[];};/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length;};},{}],374:[function(require,module,exports){/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=require('./debug');exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
 * Colors.
 */exports.colors=['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson'];/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */function useColors(){// is webkit? http://stackoverflow.com/a/16459606/376773
return'WebkitAppearance'in document.documentElement.style||// is firebug? http://stackoverflow.com/a/398120/376773
window.console&&(console.firebug||console.exception&&console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31;}/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */exports.formatters.j=function(v){return JSON.stringify(v);};/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return args;var c='color: '+this.color;args=[args[0],c,'color: inherit'].concat(Array.prototype.slice.call(args,1));// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);return args;}/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */function load(){var r;try{r=exports.storage.debug;}catch(e){}return r;}/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */exports.enable(load());/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */function localstorage(){try{return window.localStorage;}catch(e){}}},{"./debug":375}],375:[function(require,module,exports){/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=require('ms');/**
 * The currently active debug mode names, and names to skip.
 */exports.names=[];exports.skips=[];/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */exports.formatters={};/**
 * Previously assigned color.
 */var prevColor=0;/**
 * Previous log timestamp.
 */var prevTime;/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */function selectColor(){return exports.colors[prevColor++%exports.colors.length];}/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */function debug(namespace){// define the `disabled` version
function disabled(){}disabled.enabled=false;// define the `enabled` version
function enabled(){var self=enabled;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// add the `color` if not set
if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=Array.prototype.slice.call(arguments);args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %o
args=['%o'].concat(args);}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});if('function'===typeof exports.formatArgs){args=exports.formatArgs.apply(self,args);}var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args);}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn;}/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */function enable(namespaces){exports.save(namespaces);var split=(namespaces||'').split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}}/**
 * Disable debug output.
 *
 * @api public
 */function disable(){exports.enable('');}/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}},{"ms":377}],376:[function(require,module,exports){arguments[4][326][0].apply(exports,arguments);},{"dup":326}],377:[function(require,module,exports){/**
 * Helpers.
 */var s=1000;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */module.exports=function(val,options){options=options||{};if('string'==typeof val)return parse(val);return options.long?long(val):short(val);};/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */function parse(str){str=''+str;if(str.length>10000)return;var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2]||'ms').toLowerCase();switch(type){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n;}}/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function short(ms){if(ms>=d)return Math.round(ms/d)+'d';if(ms>=h)return Math.round(ms/h)+'h';if(ms>=m)return Math.round(ms/m)+'m';if(ms>=s)return Math.round(ms/s)+'s';return ms+'ms';}/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function long(ms){return plural(ms,d,'day')||plural(ms,h,'hour')||plural(ms,m,'minute')||plural(ms,s,'second')||ms+' ms';}/**
 * Pluralization helper.
 */function plural(ms,n,name){if(ms<n)return;if(ms<n*1.5)return Math.floor(ms/n)+' '+name;return Math.ceil(ms/n)+' '+name+'s';}},{}],378:[function(require,module,exports){module.exports=require('./src/throttle.js');},{"./src/throttle.js":379}],379:[function(require,module,exports){var inherits=require('util').inherits;var Transform=require('stream').Transform;var TokenBucket=require('limiter').TokenBucket;/*
 * Throttle is a throttled stream implementing the stream.Transform interface.
 * Options:
 *    rate (mandatory): the throttling rate in bytes per second.
 *    chunksize (optional): the maximum chunk size into which larger writes are decomposed.
 * Any other options are passed to stream.Transform.
 */function Throttle(opts,group){if(group===undefined)group=new ThrottleGroup(opts);this.bucket=group.bucket;this.chunksize=group.chunksize;Transform.call(this,opts);}inherits(Throttle,Transform);Throttle.prototype._transform=function(chunk,encoding,done){process(this,chunk,0,done);};function process(self,chunk,pos,done){var slice=chunk.slice(pos,pos+self.chunksize);if(!slice.length){// chunk fully consumed
done();return;}self.bucket.removeTokens(slice.length,function(err){if(err){done(err);return;}self.push(slice);process(self,chunk,pos+self.chunksize,done);});}/*
 * ThrottleGroup throttles an aggregate of streams.
 * Options are the same as for Throttle.
 */function ThrottleGroup(opts){if(!(this instanceof ThrottleGroup))return new ThrottleGroup(opts);opts=opts||{};if(opts.rate===undefined)throw new Error('throttle rate is a required argument');if(typeof opts.rate!=='number'||opts.rate<=0)throw new Error('throttle rate must be a positive number');if(opts.chunksize!==undefined&&(typeof opts.chunksize!=='number'||opts.chunksize<=0)){throw new Error('throttle chunk size must be a positive number');}this.rate=opts.rate;this.chunksize=opts.chunksize||this.rate/10;this.bucket=new TokenBucket(this.rate,this.rate,'second',null);}/*
 * Create a new stream in the throttled group and returns it.
 * Any supplied options are passed to the Throttle constructor.
 */ThrottleGroup.prototype.throttle=function(opts){return new Throttle(opts,this);};module.exports={Throttle:Throttle,ThrottleGroup:ThrottleGroup};},{"limiter":332,"stream":425,"util":430}],380:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var Buffer=require('buffer').Buffer;var isBufferEncoding=Buffer.isEncoding||function(encoding){switch(encoding&&encoding.toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':case'raw':return true;default:return false;}};function assertEncoding(encoding){if(encoding&&!isBufferEncoding(encoding)){throw new Error('Unknown encoding: '+encoding);}}// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder=exports.StringDecoder=function(encoding){this.encoding=(encoding||'utf8').toLowerCase().replace(/[-_]/,'');assertEncoding(encoding);switch(this.encoding){case'utf8':// CESU-8 represents each of Surrogate Pair by 3-bytes
this.surrogateSize=3;break;case'ucs2':case'utf16le':// UTF-16 represents each of Surrogate Pair by 2-bytes
this.surrogateSize=2;this.detectIncompleteChar=utf16DetectIncompleteChar;break;case'base64':// Base-64 stores 3 bytes in 4 chars, and pads the remainder.
this.surrogateSize=3;this.detectIncompleteChar=base64DetectIncompleteChar;break;default:this.write=passThroughWrite;return;}// Enough space to store all bytes of a single character. UTF-8 needs 4
// bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
this.charBuffer=new Buffer(6);// Number of bytes received for the current incomplete multi-byte character.
this.charReceived=0;// Number of bytes expected for the current incomplete multi-byte character.
this.charLength=0;};// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write=function(buffer){var charStr='';// if our last write ended with an incomplete multibyte character
while(this.charLength){// determine how many remaining bytes this buffer has to offer for this char
var available=buffer.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:buffer.length;// add the new bytes to the char buffer
buffer.copy(this.charBuffer,this.charReceived,0,available);this.charReceived+=available;if(this.charReceived<this.charLength){// still not enough chars in this buffer? wait for more ...
return'';}// remove bytes belonging to the current character from the buffer
buffer=buffer.slice(available,buffer.length);// get the character that was split
charStr=this.charBuffer.slice(0,this.charLength).toString(this.encoding);// CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
var charCode=charStr.charCodeAt(charStr.length-1);if(charCode>=0xD800&&charCode<=0xDBFF){this.charLength+=this.surrogateSize;charStr='';continue;}this.charReceived=this.charLength=0;// if there are no more bytes in this buffer, just emit our char
if(buffer.length===0){return charStr;}break;}// determine and set charLength / charReceived
this.detectIncompleteChar(buffer);var end=buffer.length;if(this.charLength){// buffer the incomplete character bytes we got
buffer.copy(this.charBuffer,0,buffer.length-this.charReceived,end);end-=this.charReceived;}charStr+=buffer.toString(this.encoding,0,end);var end=charStr.length-1;var charCode=charStr.charCodeAt(end);// CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
if(charCode>=0xD800&&charCode<=0xDBFF){var size=this.surrogateSize;this.charLength+=size;this.charReceived+=size;this.charBuffer.copy(this.charBuffer,size,0,size);buffer.copy(this.charBuffer,0,0,size);return charStr.substring(0,end);}// or just emit the charStr
return charStr;};// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar=function(buffer){// determine how many bytes we have to check at the end of this buffer
var i=buffer.length>=3?3:buffer.length;// Figure out if one of the last i bytes of our buffer announces an
// incomplete char.
for(;i>0;i--){var c=buffer[buffer.length-i];// See http://en.wikipedia.org/wiki/UTF-8#Description
// 110XXXXX
if(i==1&&c>>5==0x06){this.charLength=2;break;}// 1110XXXX
if(i<=2&&c>>4==0x0E){this.charLength=3;break;}// 11110XXX
if(i<=3&&c>>3==0x1E){this.charLength=4;break;}}this.charReceived=i;};StringDecoder.prototype.end=function(buffer){var res='';if(buffer&&buffer.length)res=this.write(buffer);if(this.charReceived){var cr=this.charReceived;var buf=this.charBuffer;var enc=this.encoding;res+=buf.slice(0,cr).toString(enc);}return res;};function passThroughWrite(buffer){return buffer.toString(this.encoding);}function utf16DetectIncompleteChar(buffer){this.charReceived=buffer.length%2;this.charLength=this.charReceived?2:0;}function base64DetectIncompleteChar(buffer){this.charReceived=buffer.length%3;this.charLength=this.charReceived?3:0;}},{"buffer":405}],381:[function(require,module,exports){module.exports=toArray;function toArray(list,index){var array=[];index=index||0;for(var i=index||0;i<list.length;i++){array[i-index]=list[i];}return array;}},{}],382:[function(require,module,exports){(function(global){/**
 * Module exports.
 */module.exports=deprecate;/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */function deprecate(fn,msg){if(config('noDeprecation')){return fn;}var warned=false;function deprecated(){if(!warned){if(config('throwDeprecation')){throw new Error(msg);}else if(config('traceDeprecation')){console.trace(msg);}else{console.warn(msg);}warned=true;}return fn.apply(this,arguments);}return deprecated;}/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */function config(name){// accessing global.localStorage can trigger a DOMException in sandboxed iframes
try{if(!global.localStorage)return false;}catch(_){return false;}var val=global.localStorage[name];if(null==val)return false;return String(val).toLowerCase()==='true';}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],383:[function(require,module,exports){(function(global){/*! https://mths.be/wtf8 v1.0.0 by @mathias */;(function(root){// Detect free variables `exports`
var freeExports=(typeof exports==="undefined"?"undefined":_typeof(exports))=='object'&&exports;// Detect free variable `module`
var freeModule=(typeof module==="undefined"?"undefined":_typeof(module))=='object'&&module&&module.exports==freeExports&&module;// Detect free variable `global`, from Node.js or Browserified code,
// and use it as `root`
var freeGlobal=(typeof global==="undefined"?"undefined":_typeof(global))=='object'&&global;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal;}/*--------------------------------------------------------------------------*/var stringFromCharCode=String.fromCharCode;// Taken from https://mths.be/punycode
function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=0xD800&&value<=0xDBFF&&counter<length){// high surrogate, and there is a next character
extra=string.charCodeAt(counter++);if((extra&0xFC00)==0xDC00){// low surrogate
output.push(((value&0x3FF)<<10)+(extra&0x3FF)+0x10000);}else{// unmatched surrogate; only append this code unit, in case the next
// code unit is the high surrogate of a surrogate pair
output.push(value);counter--;}}else{output.push(value);}}return output;}// Taken from https://mths.be/punycode
function ucs2encode(array){var length=array.length;var index=-1;var value;var output='';while(++index<length){value=array[index];if(value>0xFFFF){value-=0x10000;output+=stringFromCharCode(value>>>10&0x3FF|0xD800);value=0xDC00|value&0x3FF;}output+=stringFromCharCode(value);}return output;}/*--------------------------------------------------------------------------*/function createByte(codePoint,shift){return stringFromCharCode(codePoint>>shift&0x3F|0x80);}function encodeCodePoint(codePoint){if((codePoint&0xFFFFFF80)==0){// 1-byte sequence
return stringFromCharCode(codePoint);}var symbol='';if((codePoint&0xFFFFF800)==0){// 2-byte sequence
symbol=stringFromCharCode(codePoint>>6&0x1F|0xC0);}else if((codePoint&0xFFFF0000)==0){// 3-byte sequence
symbol=stringFromCharCode(codePoint>>12&0x0F|0xE0);symbol+=createByte(codePoint,6);}else if((codePoint&0xFFE00000)==0){// 4-byte sequence
symbol=stringFromCharCode(codePoint>>18&0x07|0xF0);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6);}symbol+=stringFromCharCode(codePoint&0x3F|0x80);return symbol;}function wtf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString='';while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint);}return byteString;}/*--------------------------------------------------------------------------*/function readContinuationByte(){if(byteIndex>=byteCount){throw Error('Invalid byte index');}var continuationByte=byteArray[byteIndex]&0xFF;byteIndex++;if((continuationByte&0xC0)==0x80){return continuationByte&0x3F;}// If we end up here, it’s not a continuation byte.
throw Error('Invalid continuation byte');}function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error('Invalid byte index');}if(byteIndex==byteCount){return false;}// Read the first byte.
byte1=byteArray[byteIndex]&0xFF;byteIndex++;// 1-byte sequence (no continuation bytes)
if((byte1&0x80)==0){return byte1;}// 2-byte sequence
if((byte1&0xE0)==0xC0){var byte2=readContinuationByte();codePoint=(byte1&0x1F)<<6|byte2;if(codePoint>=0x80){return codePoint;}else{throw Error('Invalid continuation byte');}}// 3-byte sequence (may include unpaired surrogates)
if((byte1&0xF0)==0xE0){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=(byte1&0x0F)<<12|byte2<<6|byte3;if(codePoint>=0x0800){return codePoint;}else{throw Error('Invalid continuation byte');}}// 4-byte sequence
if((byte1&0xF8)==0xF0){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=(byte1&0x0F)<<0x12|byte2<<0x0C|byte3<<0x06|byte4;if(codePoint>=0x010000&&codePoint<=0x10FFFF){return codePoint;}}throw Error('Invalid WTF-8 detected');}var byteArray;var byteCount;var byteIndex;function wtf8decode(byteString){byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol())!==false){codePoints.push(tmp);}return ucs2encode(codePoints);}/*--------------------------------------------------------------------------*/var wtf8={'version':'1.0.0','encode':wtf8encode,'decode':wtf8decode};// Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
if(typeof define=='function'&&_typeof(define.amd)=='object'&&define.amd){define(function(){return wtf8;});}else if(freeExports&&!freeExports.nodeType){if(freeModule){// in Node.js or RingoJS v0.8.0+
freeModule.exports=wtf8;}else{// in Narwhal or RingoJS v0.7.0-
var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in wtf8){hasOwnProperty.call(wtf8,key)&&(freeExports[key]=wtf8[key]);}}}else{// in Rhino or a web browser
root.wtf8=wtf8;}})(this);}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],384:[function(require,module,exports){/* global Y */'use strict';function extend(Y){var YArray=function(_Y$utils$CustomType){_inherits(YArray,_Y$utils$CustomType);function YArray(os,_model,_content){_classCallCheck2(this,YArray);var _this2=_possibleConstructorReturn(this,(YArray.__proto__||Object.getPrototypeOf(YArray)).call(this));_this2.os=os;_this2._model=_model;// Array of all the neccessary content
_this2._content=_content;// this._debugEvents = [] // TODO: remove!!
_this2.eventHandler=new Y.utils.EventHandler(function(op){// this._debugEvents.push(JSON.parse(JSON.stringify(op)))
if(op.struct==='Insert'){// when using indexeddb db adapter, the op could already exist (see y-js/y-indexeddb#2)
if(_this2._content.some(function(c){return Y.utils.compareIds(c.id,op.id);})){// op exists
return;}var pos=void 0;// we check op.left only!,
// because op.right might not be defined when this is called
if(op.left===null){pos=0;}else{pos=1+_this2._content.findIndex(function(c){return Y.utils.compareIds(c.id,op.left);});if(pos<=0){throw new Error('Unexpected operation!');}}/* (see above for new approach)
          var _e = this._content[pos]
          // when using indexeddb db adapter, the op could already exist (see y-js/y-indexeddb#2)
          // If the algorithm works correctly, the double should always exist on the correct position (pos - the computed destination)
          if (_e != null && Y.utils.compareIds(_e.id, op.id)) {
            // is already defined
            return
          }*/var values;var length;if(op.hasOwnProperty('opContent')){_this2._content.splice(pos,0,{id:op.id,type:op.opContent});length=1;values=[_this2.os.getType(op.opContent)];}else{var contents=op.content.map(function(c,i){return{id:[op.id[0],op.id[1]+i],val:c};});// insert value in _content
_this2._content.splice.apply(_this2._content,[pos,0].concat(contents));values=op.content;length=op.content.length;}_this2.eventHandler.callEventListeners({type:'insert',object:_this2,index:pos,values:values,length:length});}else if(op.struct==='Delete'){var i=0;// current position in _content
for(;i<_this2._content.length&&op.length>0;i++){var c=_this2._content[i];if(Y.utils.inDeletionRange(op,c.id)){// is in deletion range!
var delLength;// check how many character to delete in one flush
for(delLength=1;delLength<op.length&&i+delLength<_this2._content.length&&Y.utils.inDeletionRange(op,_this2._content[i+delLength].id);delLength++){}// last operation that will be deleted
c=_this2._content[i+delLength-1];// update delete operation
op.length-=c.id[1]-op.target[1]+1;op.target=[c.id[0],c.id[1]+1];// apply deletion & find send event
var content=_this2._content.splice(i,delLength);var _values=content.map(function(c){if(c.val!=null){return c.val;}else{return _this2.os.getType(c.type);}});_this2.eventHandler.callEventListeners({type:'delete',object:_this2,index:i,values:_values,_content:content,length:delLength});// with the fresh delete op, we can continue
// note: we don't have to increment i, because the i-th content was deleted
// but on the other had, the (i+delLength)-th was not in deletion range
// So we don't do i--
}}}else{throw new Error('Unexpected struct!');}});return _this2;}_createClass(YArray,[{key:"_destroy",value:function _destroy(){this.eventHandler.destroy();this.eventHandler=null;this._content=null;this._model=null;this.os=null;}},{key:"get",value:function get(pos){if(pos==null||typeof pos!=='number'){throw new Error('pos must be a number!');}if(pos>=this._content.length){return undefined;}if(this._content[pos].type==null){return this._content[pos].val;}else{return this.os.getType(this._content[pos].type);}}},{key:"toArray",value:function toArray(){var _this3=this;return this._content.map(function(x,i){if(x.type!=null){return _this3.os.getType(x.type);}else{return x.val;}});}},{key:"push",value:function push(contents){return this.insert(this._content.length,contents);}},{key:"insert",value:function insert(pos,contents){if(typeof pos!=='number'){throw new Error('pos must be a number!');}if(!(contents instanceof Array)){throw new Error('contents must be an Array of objects!');}if(contents.length===0){return;}if(pos>this._content.length||pos<0){throw new Error('This position exceeds the range of the array!');}var mostLeft=pos===0?null:this._content[pos-1].id;var ops=[];var prevId=mostLeft;for(var i=0;i<contents.length;){var op={left:prevId,origin:prevId,// right: mostRight,
// NOTE: I intentionally do not define right here, because it could be deleted
// at the time of inserting this operation (when we get the transaction),
// and would therefore not defined in this._content
parent:this._model,struct:'Insert'};var _content=[];var typeDefinition;while(i<contents.length){var val=contents[i++];typeDefinition=Y.utils.isTypeDefinition(val);if(!typeDefinition){_content.push(val);}else if(_content.length>0){i--;// come back again later
break;}else{break;}}if(_content.length>0){// content is defined
op.content=_content;op.id=this.os.getNextOpId(_content.length);}else{// otherwise its a type
var typeid=this.os.getNextOpId(1);this.os.createType(typeDefinition,typeid);op.opContent=typeid;op.id=this.os.getNextOpId(1);}ops.push(op);prevId=op.id;}var eventHandler=this.eventHandler;this.os.requestTransaction(regeneratorRuntime.mark(function _callee(){var mostRight,ml,j,op;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!(mostLeft!=null)){_context.next=6;break;}return _context.delegateYield(this.getInsertionCleanEnd(mostLeft),"t0",2);case 2:ml=_context.t0;mostRight=ml.right;_context.next=8;break;case 6:return _context.delegateYield(this.getOperation(ops[0].parent),"t1",7);case 7:mostRight=_context.t1.start;case 8:for(j=0;j<ops.length;j++){op=ops[j];op.right=mostRight;}return _context.delegateYield(eventHandler.awaitOps(this,this.applyCreatedOperations,[ops]),"t2",10);case 10:case"end":return _context.stop();}}},_callee,this);}));// always remember to do that after this.os.requestTransaction
// (otherwise values might contain a undefined reference to type)
eventHandler.awaitAndPrematurelyCall(ops);}},{key:"delete",value:function _delete(pos,length){if(length==null){length=1;}if(typeof length!=='number'){throw new Error('length must be a number!');}if(typeof pos!=='number'){throw new Error('pos must be a number!');}if(pos+length>this._content.length||pos<0||length<0){throw new Error('The deletion range exceeds the range of the array!');}if(length===0){return;}var eventHandler=this.eventHandler;var dels=[];for(var i=0;i<length;i=i+delLength){var targetId=this._content[pos+i].id;var delLength;// how many insertions can we delete in one deletion?
for(delLength=1;i+delLength<length;delLength++){if(!Y.utils.compareIds(this._content[pos+i+delLength].id,[targetId[0],targetId[1]+delLength])){break;}}dels.push({target:targetId,struct:'Delete',length:delLength});}this.os.requestTransaction(regeneratorRuntime.mark(function _callee2(){return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:return _context2.delegateYield(eventHandler.awaitOps(this,this.applyCreatedOperations,[dels]),"t0",1);case 1:case"end":return _context2.stop();}}},_callee2,this);}));// always remember to do that after this.os.requestTransaction
// (otherwise values might contain a undefined reference to type)
eventHandler.awaitAndPrematurelyCall(dels);}},{key:"observe",value:function observe(f){this.eventHandler.addEventListener(f);}},{key:"unobserve",value:function unobserve(f){this.eventHandler.removeEventListener(f);}},{key:"_changed",value:regeneratorRuntime.mark(function _changed(transaction,op){var l,left;return regeneratorRuntime.wrap(function _changed$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:if(op.deleted){_context3.next=15;break;}if(!(op.struct==='Insert')){_context3.next=14;break;}// update left
l=op.left;case 3:if(!(l!=null)){_context3.next=11;break;}return _context3.delegateYield(transaction.getInsertion(l),"t0",5);case 5:left=_context3.t0;if(left.deleted){_context3.next=8;break;}return _context3.abrupt("break",11);case 8:l=left.left;_context3.next=3;break;case 11:op.left=l;// if op contains opContent, initialize it
if(!(op.opContent!=null)){_context3.next=14;break;}return _context3.delegateYield(transaction.store.initType.call(transaction,op.opContent),"t1",14);case 14:this.eventHandler.receivedOp(op);case 15:case"end":return _context3.stop();}}},_changed,this);})},{key:"length",get:function get(){return this._content.length;}}]);return YArray;}(Y.utils.CustomType);Y.extend('Array',new Y.utils.CustomTypeDefinition({name:'Array',class:YArray,struct:'List',initType:regeneratorRuntime.mark(function YArrayInitializer(os,model){var _content,_types,i;return regeneratorRuntime.wrap(function YArrayInitializer$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:_content=[];_types=[];return _context4.delegateYield(Y.Struct.List.map.call(this,model,function(op){if(op.hasOwnProperty('opContent')){_content.push({id:op.id,type:op.opContent});_types.push(op.opContent);}else{op.content.forEach(function(c,i){_content.push({id:[op.id[0],op.id[1]+i],val:op.content[i]});});}}),"t0",3);case 3:i=0;case 4:if(!(i<_types.length)){_context4.next=9;break;}return _context4.delegateYield(this.store.initType.call(this,_types[i]),"t1",6);case 6:i++;_context4.next=4;break;case 9:return _context4.abrupt("return",new YArray(os,model.id,_content));case 10:case"end":return _context4.stop();}}},YArrayInitializer,this);}),createType:function YArrayCreateType(os,model){return new YArray(os,model.id,[]);}}));}module.exports=extend;if(typeof Y!=='undefined'){extend(Y);}},{}],385:[function(require,module,exports){/* global Y */'use strict';function extend(Y/* :any */){var YMap=function(_Y$utils$CustomType2){_inherits(YMap,_Y$utils$CustomType2);/* ::
    _model: Id;
    os: Y.AbstractDatabase;
    map: Object;
    contents: any;
    opContents: Object;
    eventHandler: Function;
    */function YMap(os,model,contents,opContents){_classCallCheck2(this,YMap);var _this4=_possibleConstructorReturn(this,(YMap.__proto__||Object.getPrototypeOf(YMap)).call(this));_this4._model=model.id;_this4.os=os;_this4.map=Y.utils.copyObject(model.map);_this4.contents=contents;_this4.opContents=opContents;_this4.eventHandler=new Y.utils.EventHandler(function(op){var oldValue;// key is the name to use to access (op)content
var key=op.struct==='Delete'?op.key:op.parentSub;// compute oldValue
if(_this4.opContents[key]!=null){oldValue=_this4.os.getType(_this4.opContents[key]);}else{oldValue=_this4.contents[key];}// compute op event
if(op.struct==='Insert'){if(op.left===null&&!Y.utils.compareIds(op.id,_this4.map[key])){var value;// TODO: what if op.deleted??? I partially handles this case here.. but need to send delete event instead. somehow related to #4
if(op.opContent!=null){value=_this4.os.getType(op.opContent);delete _this4.contents[key];if(op.deleted){delete _this4.opContents[key];}else{_this4.opContents[key]=op.opContent;}}else{value=op.content[0];delete _this4.opContents[key];if(op.deleted){delete _this4.contents[key];}else{_this4.contents[key]=op.content[0];}}_this4.map[key]=op.id;if(oldValue===undefined){_this4.eventHandler.callEventListeners({name:key,object:_this4,type:'add',value:value});}else{_this4.eventHandler.callEventListeners({name:key,object:_this4,oldValue:oldValue,type:'update',value:value});}}}else if(op.struct==='Delete'){if(Y.utils.compareIds(_this4.map[key],op.target)){delete _this4.opContents[key];delete _this4.contents[key];_this4.eventHandler.callEventListeners({name:key,object:_this4,oldValue:oldValue,type:'delete'});}}else{throw new Error('Unexpected Operation!');}});return _this4;}_createClass(YMap,[{key:"_destroy",value:function _destroy(){this.eventHandler.destroy();this.eventHandler=null;this.contents=null;this.opContents=null;this._model=null;this.os=null;this.map=null;}},{key:"get",value:function get(key){// return property.
// if property does not exist, return null
// if property is a type, return it
if(key==null||typeof key!=='string'){throw new Error('You must specify a key (as string)!');}if(this.opContents[key]==null){return this.contents[key];}else{return this.os.getType(this.opContents[key]);}}},{key:"keys",value:function keys(){return Object.keys(this.contents).concat(Object.keys(this.opContents));}},{key:"keysPrimitives",value:function keysPrimitives(){return Object.keys(this.contents);}},{key:"keysTypes",value:function keysTypes(){return Object.keys(this.opContents);}/*
      If there is a primitive (not a custom type), then return it.
      Returns all primitive values, if propertyName is specified!
      Note: modifying the return value could result in inconsistencies!
        -- so make sure to copy it first!
    */},{key:"getPrimitive",value:function getPrimitive(key){if(key==null){return Y.utils.copyObject(this.contents);}else if(typeof key!=='string'){throw new Error('Key is expected to be a string!');}else{return this.contents[key];}}},{key:"getType",value:function getType(key){if(key==null||typeof key!=='string'){throw new Error('You must specify a key (as string)!');}else if(this.opContents[key]!=null){return this.os.getType(this.opContents[key]);}else{return null;}}},{key:"delete",value:function _delete(key){var right=this.map[key];if(right!=null){var del={target:right,struct:'Delete'};var eventHandler=this.eventHandler;var modDel=Y.utils.copyObject(del);modDel.key=key;this.os.requestTransaction(regeneratorRuntime.mark(function _callee3(){return regeneratorRuntime.wrap(function _callee3$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:return _context5.delegateYield(eventHandler.awaitOps(this,this.applyCreatedOperations,[[del]]),"t0",1);case 1:case"end":return _context5.stop();}}},_callee3,this);}));// always remember to do that after this.os.requestTransaction
// (otherwise values might contain a undefined reference to type)
eventHandler.awaitAndPrematurelyCall([modDel]);}}},{key:"set",value:function set(key,value){// set property.
// if property is a type, return it
// if not, apply immediately on this type an call event
var right=this.map[key]||null;var insert/* :any */={id:this.os.getNextOpId(1),left:null,right:right,origin:null,parent:this._model,parentSub:key,struct:'Insert'};var eventHandler=this.eventHandler;var typeDefinition=Y.utils.isTypeDefinition(value);if(typeDefinition!==false){var type=this.os.createType(typeDefinition);insert.opContent=type._model;// construct a new type
this.os.requestTransaction(regeneratorRuntime.mark(function _callee4(){return regeneratorRuntime.wrap(function _callee4$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:return _context6.delegateYield(eventHandler.awaitOps(this,this.applyCreatedOperations,[[insert]]),"t0",1);case 1:case"end":return _context6.stop();}}},_callee4,this);}));// always remember to do that after this.os.requestTransaction
// (otherwise values might contain a undefined reference to type)
eventHandler.awaitAndPrematurelyCall([insert]);return type;}else{insert.content=[value];this.os.requestTransaction(regeneratorRuntime.mark(function _callee5(){return regeneratorRuntime.wrap(function _callee5$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:return _context7.delegateYield(eventHandler.awaitOps(this,this.applyCreatedOperations,[[insert]]),"t0",1);case 1:case"end":return _context7.stop();}}},_callee5,this);}));// always remember to do that after this.os.requestTransaction
// (otherwise values might contain a undefined reference to type)
eventHandler.awaitAndPrematurelyCall([insert]);return value;}}},{key:"observe",value:function observe(f){this.eventHandler.addEventListener(f);}},{key:"unobserve",value:function unobserve(f){this.eventHandler.removeEventListener(f);}/*
      Observe a path.

      E.g.
      ```
      o.set('textarea', Y.TextBind)
      o.observePath(['textarea'], function(t){
        // is called whenever textarea is replaced
        t.bind(textarea)
      })

      returns a function that removes the observer from the path.
    */},{key:"observePath",value:function observePath(path,f){var self=this;var propertyName;function observeProperty(event){// call f whenever path changes
if(event.name===propertyName){// call this also for delete events!
f(self.get(propertyName));}}if(path.length<1){f(this);return function(){};}else if(path.length===1){propertyName=path[0];f(self.get(propertyName));this.observe(observeProperty);return function(){self.unobserve(f);};}else{var deleteChildObservers;var resetObserverPath=function resetObserverPath(){var map=self.get(path[0]);if(!(map instanceof YMap)){// its either not defined or a primitive value / not a map
map=self.set(path[0],Y.Map);}deleteChildObservers=map.observePath(path.slice(1),f);};var observer=function observer(event){if(event.name===path[0]){if(deleteChildObservers!=null){deleteChildObservers();}if(event.type==='add'||event.type==='update'){resetObserverPath();}// TODO: what about the delete events?
}};self.observe(observer);resetObserverPath();// returns a function that deletes all the child observers
// and how to unobserve the observe from this object
return function(){if(deleteChildObservers!=null){deleteChildObservers();}self.unobserve(observer);};}}},{key:"_changed",value:regeneratorRuntime.mark(function _changed(transaction,op){var target;return regeneratorRuntime.wrap(function _changed$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:if(!(op.struct==='Delete')){_context8.next=7;break;}if(!(op.key==null)){_context8.next=5;break;}return _context8.delegateYield(transaction.getOperation(op.target),"t0",3);case 3:target=_context8.t0;op.key=target.parentSub;case 5:_context8.next=9;break;case 7:if(!(op.opContent!=null)){_context8.next=9;break;}return _context8.delegateYield(transaction.store.initType.call(transaction,op.opContent),"t1",9);case 9:this.eventHandler.receivedOp(op);case 10:case"end":return _context8.stop();}}},_changed,this);})}]);return YMap;}(Y.utils.CustomType);Y.extend('Map',new Y.utils.CustomTypeDefinition({name:'Map',class:YMap,struct:'Map',initType:regeneratorRuntime.mark(function YMapInitializer(os,model){var contents,opContents,map,name,op;return regeneratorRuntime.wrap(function YMapInitializer$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:contents={};opContents={};map=model.map;_context9.t0=regeneratorRuntime.keys(map);case 4:if((_context9.t1=_context9.t0()).done){_context9.next=18;break;}name=_context9.t1.value;return _context9.delegateYield(this.getOperation(map[name]),"t2",7);case 7:op=_context9.t2;if(!op.deleted){_context9.next=10;break;}return _context9.abrupt("continue",4);case 10:if(!(op.opContent!=null)){_context9.next=15;break;}opContents[name]=op.opContent;return _context9.delegateYield(this.store.initType.call(this,op.opContent),"t3",13);case 13:_context9.next=16;break;case 15:contents[name]=op.content[0];case 16:_context9.next=4;break;case 18:return _context9.abrupt("return",new YMap(os,model,contents,opContents));case 19:case"end":return _context9.stop();}}},YMapInitializer,this);}),createType:function YMapCreator(os,model){return new YMap(os,model,{},{});}}));}module.exports=extend;if(typeof Y!=='undefined'){extend(Y);}},{}],386:[function(require,module,exports){/* global Y */'use strict';function extend(Y){require('./RedBlackTree.js')(Y);var Transaction=function(_Y$Transaction){_inherits(Transaction,_Y$Transaction);function Transaction(store){_classCallCheck2(this,Transaction);var _this5=_possibleConstructorReturn(this,(Transaction.__proto__||Object.getPrototypeOf(Transaction)).call(this,store));_this5.store=store;_this5.ss=store.ss;_this5.os=store.os;_this5.ds=store.ds;return _this5;}return Transaction;}(Y.Transaction);var Store=Y.utils.RBTree;var BufferedStore=Y.utils.createSmallLookupBuffer(Store);var Database=function(_Y$AbstractDatabase){_inherits(Database,_Y$AbstractDatabase);function Database(y,opts){_classCallCheck2(this,Database);var _this6=_possibleConstructorReturn(this,(Database.__proto__||Object.getPrototypeOf(Database)).call(this,y,opts));_this6.os=new BufferedStore();_this6.ds=new Store();_this6.ss=new BufferedStore();return _this6;}_createClass(Database,[{key:"logTable",value:function logTable(){var self=this;self.requestTransaction(regeneratorRuntime.mark(function _callee6(){return regeneratorRuntime.wrap(function _callee6$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:console.log('User: ',this.store.y.connector.userId,"==============================");// eslint-disable-line
_context10.t0=console;return _context10.delegateYield(this.getStateSet(),"t1",3);case 3:_context10.t2=_context10.t1;_context10.t0.log.call(_context10.t0,"State Set (SS):",_context10.t2);// eslint-disable-line
console.log("Operation Store (OS):");// eslint-disable-line
return _context10.delegateYield(this.os.logTable(),"t3",7);case 7:// eslint-disable-line
console.log("Deletion Store (DS):");//eslint-disable-line
return _context10.delegateYield(this.ds.logTable(),"t4",9);case 9:// eslint-disable-line
if(this.store.gc1.length>0||this.store.gc2.length>0){console.warn('GC1|2 not empty!',this.store.gc1,this.store.gc2);}if(JSON.stringify(this.store.listenersById)!=='{}'){console.warn('listenersById not empty!');}if(JSON.stringify(this.store.listenersByIdExecuteNow)!=='[]'){console.warn('listenersByIdExecuteNow not empty!');}if(this.store.transactionInProgress){console.warn('Transaction still in progress!');}case 13:case"end":return _context10.stop();}}},_callee6,this);}),true);}},{key:"transact",value:function transact(makeGen){var t=new Transaction(this);while(makeGen!==null){var gen=makeGen.call(t);var res=gen.next();while(!res.done){res=gen.next(res.value);}makeGen=this.getNextRequest();}}},{key:"destroy",value:regeneratorRuntime.mark(function destroy(){return regeneratorRuntime.wrap(function destroy$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:return _context11.delegateYield(_get(Database.prototype.__proto__||Object.getPrototypeOf(Database.prototype),"destroy",this).call(this),"t0",1);case 1:delete this.os;delete this.ss;delete this.ds;case 4:case"end":return _context11.stop();}}},destroy,this);})}]);return Database;}(Y.AbstractDatabase);Y.extend('memory',Database);}module.exports=extend;if(typeof Y!=='undefined'){extend(Y);}},{"./RedBlackTree.js":387}],387:[function(require,module,exports){'use strict';/*
  This file contains a not so fancy implemantion of a Red Black Tree.
*/module.exports=function(Y){var N=function(){// A created node is always red!
function N(val){_classCallCheck2(this,N);this.val=val;this.color=true;this._left=null;this._right=null;this._parent=null;if(val.id===null){throw new Error('You must define id!');}}_createClass(N,[{key:"isRed",value:function isRed(){return this.color;}},{key:"isBlack",value:function isBlack(){return!this.color;}},{key:"redden",value:function redden(){this.color=true;return this;}},{key:"blacken",value:function blacken(){this.color=false;return this;}},{key:"rotateLeft",value:function rotateLeft(tree){var parent=this.parent;var newParent=this.right;var newRight=this.right.left;newParent.left=this;this.right=newRight;if(parent===null){tree.root=newParent;newParent._parent=null;}else if(parent.left===this){parent.left=newParent;}else if(parent.right===this){parent.right=newParent;}else{throw new Error('The elements are wrongly connected!');}}},{key:"next",value:function next(){if(this.right!==null){// search the most left node in the right tree
var o=this.right;while(o.left!==null){o=o.left;}return o;}else{var p=this;while(p.parent!==null&&p!==p.parent.left){p=p.parent;}return p.parent;}}},{key:"prev",value:function prev(){if(this.left!==null){// search the most right node in the left tree
var o=this.left;while(o.right!==null){o=o.right;}return o;}else{var p=this;while(p.parent!==null&&p!==p.parent.right){p=p.parent;}return p.parent;}}},{key:"rotateRight",value:function rotateRight(tree){var parent=this.parent;var newParent=this.left;var newLeft=this.left.right;newParent.right=this;this.left=newLeft;if(parent===null){tree.root=newParent;newParent._parent=null;}else if(parent.left===this){parent.left=newParent;}else if(parent.right===this){parent.right=newParent;}else{throw new Error('The elements are wrongly connected!');}}},{key:"getUncle",value:function getUncle(){// we can assume that grandparent exists when this is called!
if(this.parent===this.parent.parent.left){return this.parent.parent.right;}else{return this.parent.parent.left;}}},{key:"grandparent",get:function get(){return this.parent.parent;}},{key:"parent",get:function get(){return this._parent;}},{key:"sibling",get:function get(){return this===this.parent.left?this.parent.right:this.parent.left;}},{key:"left",get:function get(){return this._left;},set:function set(n){if(n!==null){n._parent=this;}this._left=n;}},{key:"right",get:function get(){return this._right;},set:function set(n){if(n!==null){n._parent=this;}this._right=n;}}]);return N;}();var RBTree=function(){function RBTree(){_classCallCheck2(this,RBTree);this.root=null;this.length=0;}_createClass(RBTree,[{key:"findNext",value:regeneratorRuntime.mark(function findNext(id){return regeneratorRuntime.wrap(function findNext$(_context12){while(1){switch(_context12.prev=_context12.next){case 0:return _context12.delegateYield(this.findWithLowerBound([id[0],id[1]+1]),"t0",1);case 1:return _context12.abrupt("return",_context12.t0);case 2:case"end":return _context12.stop();}}},findNext,this);})},{key:"findPrev",value:regeneratorRuntime.mark(function findPrev(id){return regeneratorRuntime.wrap(function findPrev$(_context13){while(1){switch(_context13.prev=_context13.next){case 0:return _context13.delegateYield(this.findWithUpperBound([id[0],id[1]-1]),"t0",1);case 1:return _context13.abrupt("return",_context13.t0);case 2:case"end":return _context13.stop();}}},findPrev,this);})},{key:"findNodeWithLowerBound",value:function findNodeWithLowerBound(from){if(from===void 0){throw new Error('You must define from!');}var o=this.root;if(o===null){return null;}else{while(true){if((from===null||Y.utils.smaller(from,o.val.id))&&o.left!==null){// o is included in the bound
// try to find an element that is closer to the bound
o=o.left;}else if(from!==null&&Y.utils.smaller(o.val.id,from)){// o is not within the bound, maybe one of the right elements is..
if(o.right!==null){o=o.right;}else{// there is no right element. Search for the next bigger element,
// this should be within the bounds
return o.next();}}else{return o;}}}}},{key:"findNodeWithUpperBound",value:function findNodeWithUpperBound(to){if(to===void 0){throw new Error('You must define from!');}var o=this.root;if(o===null){return null;}else{while(true){if((to===null||Y.utils.smaller(o.val.id,to))&&o.right!==null){// o is included in the bound
// try to find an element that is closer to the bound
o=o.right;}else if(to!==null&&Y.utils.smaller(to,o.val.id)){// o is not within the bound, maybe one of the left elements is..
if(o.left!==null){o=o.left;}else{// there is no left element. Search for the prev smaller element,
// this should be within the bounds
return o.prev();}}else{return o;}}}}},{key:"findSmallestNode",value:function findSmallestNode(){var o=this.root;while(o!=null&&o.left!=null){o=o.left;}return o;}},{key:"findWithLowerBound",value:regeneratorRuntime.mark(function findWithLowerBound(from){var n;return regeneratorRuntime.wrap(function findWithLowerBound$(_context14){while(1){switch(_context14.prev=_context14.next){case 0:n=this.findNodeWithLowerBound(from);return _context14.abrupt("return",n==null?null:n.val);case 2:case"end":return _context14.stop();}}},findWithLowerBound,this);})},{key:"findWithUpperBound",value:regeneratorRuntime.mark(function findWithUpperBound(to){var n;return regeneratorRuntime.wrap(function findWithUpperBound$(_context15){while(1){switch(_context15.prev=_context15.next){case 0:n=this.findNodeWithUpperBound(to);return _context15.abrupt("return",n==null?null:n.val);case 2:case"end":return _context15.stop();}}},findWithUpperBound,this);})},{key:"iterate",value:regeneratorRuntime.mark(function iterate(t,from,to,f){var o;return regeneratorRuntime.wrap(function iterate$(_context16){while(1){switch(_context16.prev=_context16.next){case 0:if(from===null){o=this.findSmallestNode();}else{o=this.findNodeWithLowerBound(from);}case 1:if(!(o!==null&&(to===null||Y.utils.smaller(o.val.id,to)||Y.utils.compareIds(o.val.id,to)))){_context16.next=6;break;}return _context16.delegateYield(f.call(t,o.val),"t0",3);case 3:o=o.next();_context16.next=1;break;case 6:return _context16.abrupt("return",true);case 7:case"end":return _context16.stop();}}},iterate,this);})},{key:"logTable",value:regeneratorRuntime.mark(function logTable(from,to,filter){var os;return regeneratorRuntime.wrap(function logTable$(_context18){while(1){switch(_context18.prev=_context18.next){case 0:if(filter==null){filter=function filter(){return true;};}if(from==null){from=null;}if(to==null){to=null;}os=[];return _context18.delegateYield(this.iterate(this,from,to,regeneratorRuntime.mark(function _callee7(o){var o_,key;return regeneratorRuntime.wrap(function _callee7$(_context17){while(1){switch(_context17.prev=_context17.next){case 0:if(filter(o)){o_={};for(key in o){if(_typeof(o[key])==='object'){o_[key]=JSON.stringify(o[key]);}else{o_[key]=o[key];}}os.push(o_);}case 1:case"end":return _context17.stop();}}},_callee7,this);})),"t0",5);case 5:if(console.table!=null){console.table(os);}case 6:case"end":return _context18.stop();}}},logTable,this);})},{key:"find",value:regeneratorRuntime.mark(function find(id){var n;return regeneratorRuntime.wrap(function find$(_context19){while(1){switch(_context19.prev=_context19.next){case 0:return _context19.abrupt("return",(n=this.findNode(id))?n.val:null);case 1:case"end":return _context19.stop();}}},find,this);})},{key:"findNode",value:function findNode(id){if(id==null||id.constructor!==Array){throw new Error('Expect id to be an array!');}var o=this.root;if(o===null){return false;}else{while(true){if(o===null){return false;}if(Y.utils.smaller(id,o.val.id)){o=o.left;}else if(Y.utils.smaller(o.val.id,id)){o=o.right;}else{return o;}}}}},{key:"delete",value:regeneratorRuntime.mark(function _delete(id){var d,o,isFakeChild,child;return regeneratorRuntime.wrap(function _delete$(_context20){while(1){switch(_context20.prev=_context20.next){case 0:if(!(id==null||id.constructor!==Array)){_context20.next=2;break;}throw new Error('id is expected to be an Array!');case 2:d=this.findNode(id);if(!(d==null)){_context20.next=5;break;}return _context20.abrupt("return");case 5:this.length--;if(d.left!==null&&d.right!==null){// switch d with the greates element in the left subtree.
// o should have at most one child.
o=d.left;// find
while(o.right!==null){o=o.right;}// switch
d.val=o.val;d=o;}// d has at most one child
// let n be the node that replaces d
child=d.left||d.right;if(child===null){isFakeChild=true;child=new N({id:0});child.blacken();d.right=child;}else{isFakeChild=false;}if(!(d.parent===null)){_context20.next=14;break;}if(!isFakeChild){this.root=child;child.blacken();child._parent=null;}else{this.root=null;}return _context20.abrupt("return");case 14:if(!(d.parent.left===d)){_context20.next=18;break;}d.parent.left=child;_context20.next=23;break;case 18:if(!(d.parent.right===d)){_context20.next=22;break;}d.parent.right=child;_context20.next=23;break;case 22:throw new Error('Impossible!');case 23:if(d.isBlack()){if(child.isRed()){child.blacken();}else{this._fixDelete(child);}}this.root.blacken();if(!isFakeChild){_context20.next=35;break;}if(!(child.parent.left===child)){_context20.next=30;break;}child.parent.left=null;_context20.next=35;break;case 30:if(!(child.parent.right===child)){_context20.next=34;break;}child.parent.right=null;_context20.next=35;break;case 34:throw new Error('Impossible #3');case 35:case"end":return _context20.stop();}}},_delete,this);})},{key:"_fixDelete",value:function _fixDelete(n){function isBlack(node){return node!==null?node.isBlack():true;}function isRed(node){return node!==null?node.isRed():false;}if(n.parent===null){// this can only be called after the first iteration of fixDelete.
return;}// d was already replaced by the child
// d is not the root
// d and child are black
var sibling=n.sibling;if(isRed(sibling)){// make sibling the grandfather
n.parent.redden();sibling.blacken();if(n===n.parent.left){n.parent.rotateLeft(this);}else if(n===n.parent.right){n.parent.rotateRight(this);}else{throw new Error('Impossible #2');}sibling=n.sibling;}// parent, sibling, and children of n are black
if(n.parent.isBlack()&&sibling.isBlack()&&isBlack(sibling.left)&&isBlack(sibling.right)){sibling.redden();this._fixDelete(n.parent);}else if(n.parent.isRed()&&sibling.isBlack()&&isBlack(sibling.left)&&isBlack(sibling.right)){sibling.redden();n.parent.blacken();}else{if(n===n.parent.left&&sibling.isBlack()&&isRed(sibling.left)&&isBlack(sibling.right)){sibling.redden();sibling.left.blacken();sibling.rotateRight(this);sibling=n.sibling;}else if(n===n.parent.right&&sibling.isBlack()&&isRed(sibling.right)&&isBlack(sibling.left)){sibling.redden();sibling.right.blacken();sibling.rotateLeft(this);sibling=n.sibling;}sibling.color=n.parent.color;n.parent.blacken();if(n===n.parent.left){sibling.right.blacken();n.parent.rotateLeft(this);}else{sibling.left.blacken();n.parent.rotateRight(this);}}}},{key:"put",value:regeneratorRuntime.mark(function put(v){var node,p;return regeneratorRuntime.wrap(function put$(_context21){while(1){switch(_context21.prev=_context21.next){case 0:if(!(v==null||v.id==null||v.id.constructor!==Array)){_context21.next=2;break;}throw new Error('v is expected to have an id property which is an Array!');case 2:node=new N(v);if(!(this.root!==null)){_context21.next=31;break;}p=this.root;// p abbrev. parent
case 5:if(!true){_context21.next=28;break;}if(!Y.utils.smaller(node.val.id,p.val.id)){_context21.next=15;break;}if(!(p.left===null)){_context21.next=12;break;}p.left=node;return _context21.abrupt("break",28);case 12:p=p.left;case 13:_context21.next=26;break;case 15:if(!Y.utils.smaller(p.val.id,node.val.id)){_context21.next=24;break;}if(!(p.right===null)){_context21.next=21;break;}p.right=node;return _context21.abrupt("break",28);case 21:p=p.right;case 22:_context21.next=26;break;case 24:p.val=node.val;return _context21.abrupt("return",p);case 26:_context21.next=5;break;case 28:this._fixInsert(node);_context21.next=32;break;case 31:this.root=node;case 32:this.length++;this.root.blacken();return _context21.abrupt("return",node);case 35:case"end":return _context21.stop();}}},put,this);})},{key:"_fixInsert",value:function _fixInsert(n){if(n.parent===null){n.blacken();return;}else if(n.parent.isBlack()){return;}var uncle=n.getUncle();if(uncle!==null&&uncle.isRed()){// Note: parent: red, uncle: red
n.parent.blacken();uncle.blacken();n.grandparent.redden();this._fixInsert(n.grandparent);}else{// Note: parent: red, uncle: black or null
// Now we transform the tree in such a way that
// either of these holds:
//   1) grandparent.left.isRed
//     and grandparent.left.left.isRed
//   2) grandparent.right.isRed
//     and grandparent.right.right.isRed
if(n===n.parent.right&&n.parent===n.grandparent.left){n.parent.rotateLeft(this);// Since we rotated and want to use the previous
// cases, we need to set n in such a way that
// n.parent.isRed again
n=n.left;}else if(n===n.parent.left&&n.parent===n.grandparent.right){n.parent.rotateRight(this);// see above
n=n.right;}// Case 1) or 2) hold from here on.
// Now traverse grandparent, make parent a black node
// on the highest level which holds two red nodes.
n.parent.blacken();n.grandparent.redden();if(n===n.parent.left){// Case 1
n.grandparent.rotateRight(this);}else{// Case 2
n.grandparent.rotateLeft(this);}}}},{key:"flush",value:regeneratorRuntime.mark(function flush(){return regeneratorRuntime.wrap(function flush$(_context22){while(1){switch(_context22.prev=_context22.next){case 0:case"end":return _context22.stop();}}},flush,this);})}]);return RBTree;}();Y.utils.RBTree=RBTree;};},{}],388:[function(require,module,exports){/* globals Y */var Y=require('yjs');var Io=require('socket.io-client');var SimpleSignalClient=require('simple-signal-client');var Throttle=require('stream-throttle').Throttle;var Wire=require('multihack-wire');var getBrowserRTC=require('get-browser-rtc');var Connector=function(_Y$AbstractConnector){_inherits(Connector,_Y$AbstractConnector);function Connector(y,opts){var _ret;_classCallCheck2(this,Connector);var _this7=_possibleConstructorReturn(this,(Connector.__proto__||Object.getPrototypeOf(Connector)).call(this,y,opts));var self=_this7;if(!(self instanceof Connector))return _ret=new Connector(y,opts),_possibleConstructorReturn(_this7,_ret);opts=opts||{};opts.role='slave';self.room=opts.room||'welcome';self.wrtc=opts.wrtc||null;self.hostname=opts.hostname||'https://quiet-shelf-57463.herokuapp.com';self.nickname=opts.nickname;self.events=opts.events||function(event,value){};self.id=null;self.queue=[];self.peers=[];self.reconnect();return _this7;}return Connector;}(Y.AbstractConnector);Connector.prototype._setupSocket=function(){var self=this;self._socket.on('forward',function(data){if(data.event==='yjs'){self.receiveMessage(data.id,data.message);}});self._socket.on('peer-join',function(data){if(!self.nop2p&&!data.nop2p)return;// will connect p2p
var fakePeer={metadata:{nickname:data.nickname},id:data.id,nop2p:data.nop2p};self.peers.push(fakePeer);if(data.nop2p)self.mustForward++;self._onGotPeer(fakePeer);});self._socket.on('peer-leave',function(data){if(!self.nop2p&&!data.nop2p)return;// will disconnect p2p 
for(var i=0;i<self.peers.length;i++){if(self.peers[i].id===data.id){self._onLostPeer(self.peers[i]);self.peers.splice(i,1);break;}}if(data.nop2p)self.mustForward--;});self._socket.on('id',function(id){if(self.id)return;self.id=id;self.events('id',{id:self.id,nop2p:self.nop2p});self.setUserId(id);self._socket.emit('join',{room:self.room,nickname:self.nickname,nop2p:self.nop2p});});};Connector.prototype._setupP2P=function(room,nickname){var self=this;self._client=new SimpleSignalClient(self._socket,{room:self.room});self.events('client',self._client);self._client.on('ready',function(peerIDs){self.events('voice',{client:self._client,socket:self._socket});if(!self.id){self.setUserId(self._client.id);self.id=self._client.id;self.events('id',{id:self.id,nop2p:self.nop2p});}for(var i=0;i<peerIDs.length;i++){if(peerIDs[i]===self._client.id)continue;self._client.connect(peerIDs[i],{wrtc:self.wrtc,reconnectTimer:100},{nickname:self.nickname});}});self._client.on('request',function(request){if(request.metadata.voice)return;request.accept({wrtc:self.wrtc,reconnectTimer:100},{nickname:self.nickname});});self._client.on('peer',function(peer){if(peer.metadata.voice)return;peer.metadata.nickname=peer.metadata.nickname||'Guest';// throttle outgoing
var throttle=new Throttle({rate:300*1000,chunksize:15*1000});peer.wire=new Wire();peer.originalSend=peer.send;peer.send=function(chunk){try{peer.originalSend(chunk);}catch(e){peer.send(chunk);}};peer.pipe(peer.wire).pipe(throttle).pipe(peer);self.peers.push(peer);peer.wire.on('yjs',function(message){if(peer.connected){self.receiveMessage(peer.id,message);}else{if(!peer.destroyed){self.queue.push({id:peer.id,message:message});}}});peer.on('connect',function(){self._onGotPeer(peer);self.queue.forEach(function(a){if(a.id===peer.id){self.receiveMessage(a.id,a.message);}});});peer.on('close',function(){console.warn('connection to peer closed');self._destroyPeer(peer);});peer.on('error',function(err){console.error(err);});});};Connector.prototype._destroyPeer=function(peer){var self=this;for(var i=0;i<self.peers.length;i++){if(self.peers[i].id===peer.id){self.peers.splice(i,1);break;}}peer.destroy();self._onLostPeer(peer);};Connector.prototype._sendAllPeers=function(event,message){var self=this;if(self.nop2p||self.mustForward>0){self._socket.emit('forward',{event:event,target:self.room,message:message});return;}for(var i=0;i<self.peers.length;i++){if(!self.peers[i].nop2p){self.peers[i].wire[event](message);}}};Connector.prototype._sendOnePeer=function(id,event,message){var self=this;if(self.nop2p){self._socket.emit('forward',{target:id,event:event,message:message});return;}for(var i=0;i<self.peers.length;i++){if(self.peers[i].id!==id)continue;if(self.peers[i].nop2p){self._socket.emit('forward',{target:id,event:event,message:message});}else{self.peers[i].wire[event](message);}break;}};Connector.prototype._onGotPeer=function(peer){var self=this;self.events('peers',{peers:self.peers,mustForward:self.mustForward});self.events('gotPeer',peer);self.userJoined(peer.id,'master');};Connector.prototype._onLostPeer=function(peer){var self=this;self.events('peers',{peers:self.peers,mustForward:self.mustForward});self.events('lostPeer',peer);self.userLeft(peer.id);};Connector.prototype.disconnect=function(){var self=this;for(var i=0;i<self.peers.length;i++){if(self.peers[i].nop2p||self.nop2p){self.peers[i]=null;}else{self.peers[i].destroy();}}self.voice=null;self._client=null;self.nop2p=null;self.peers=[];self.events('peers',{peers:self.peers,mustForward:self.mustForward});self._handlers=null;self._socket.disconnect();self._socket=null;};Connector.prototype.reconnect=function(){var self=this;self._socket=new Io(self.hostname);self.peers=[];self.events('peers',{peers:self.peers,mustForward:self.mustForward});self.mustForward=0;// num of peers that are nop2p
self._setupSocket();if(!getBrowserRTC()){console.warn('No WebRTC support');self.nop2p=true;}else{self.nop2p=false;self._setupP2P();}};Connector.prototype.sendMeta=function(id,event,message){var self=this;if(event==='yjs')throw new Error('Metadata cannot use the "yjs" event!');self._sendOnePeer(id,event,message);};// only yjs should call this!
Connector.prototype.send=function(id,message){var self=this;self._sendOnePeer(id,'yjs',message);};Connector.prototype.broadcast=function(message){var self=this;self._sendAllPeers('yjs',message);};Connector.prototype.isDisconnected=function(){return false;};function extend(Y){Y.extend('multihack',Connector);}module.exports=extend;if(typeof Y!=='undefined'){extend(Y);}},{"get-browser-rtc":324,"multihack-wire":346,"simple-signal-client":362,"socket.io-client":363,"stream-throttle":378,"yjs":400}],389:[function(require,module,exports){/* global Y, Element */'use strict';var diff=require('fast-diff');var monacoIdentifierTemplate={major:0,minor:0};function extend(Y){Y.requestModules(['Array']).then(function(){var YText=function(_Y$Array$typeDefiniti){_inherits(YText,_Y$Array$typeDefiniti);function YText(os,_model,_content){_classCallCheck2(this,YText);var _this8=_possibleConstructorReturn(this,(YText.__proto__||Object.getPrototypeOf(YText)).call(this,os,_model,_content));_this8.textfields=[];_this8.aceInstances=[];_this8.codeMirrorInstances=[];_this8.monacoInstances=[];return _this8;}_createClass(YText,[{key:"toString",value:function toString(){return this._content.map(function(c){return c.val;}).join('');}},{key:"insert",value:function insert(pos,content){_get(YText.prototype.__proto__||Object.getPrototypeOf(YText.prototype),"insert",this).call(this,pos,content.split(''));}},{key:"unbindAll",value:function unbindAll(){this.unbindTextareaAll();this.unbindAceAll();this.unbindCodeMirrorAll();this.unbindMonacoAll();}// Monaco implementation
},{key:"unbindMonaco",value:function unbindMonaco(monacoInstance){var i=this.monacoInstances.findIndex(function(binding){return binding.editor===monacoInstance;});if(i>=0){var binding=this.monacoInstances[i];this.unobserve(binding.yCallback);binding.disposeBinding();this.monacoInstances.splice(i,1);}}},{key:"unbindMonacoAll",value:function unbindMonacoAll(){for(var i=this.monacoInstances.length-1;i>=0;i--){this.unbindMonaco(this.monacoInstances[i].editor);}}},{key:"bindMonaco",value:function bindMonaco(monacoInstance,options){var self=this;options=options||{};// this function makes sure that either the
// monaco event is executed, or the yjs observer is executed
var token=true;function mutualExcluse(f){if(token){token=false;try{f();}catch(e){token=true;throw new Error(e);}token=true;}}monacoInstance.setValue(this.toString());function monacoCallback(event){mutualExcluse(function(){// compute start.. (col+row -> index position)
// We shouldn't compute the offset on the old model..
//    var start = monacoInstance.model.getOffsetAt({column: event.range.startColumn, lineNumber: event.range.startLineNumber})
// So we compute the offset using the _content of this type
for(var i=0,line=1;line<event.range.startLineNumber;i++){if(self._content[i].val===event.eol){line++;}}var start=i+event.range.startColumn-1;// apply the delete operation first
if(event.rangeLength>0){self.delete(start,event.rangeLength);}// apply insert operation
self.insert(start,event.text);});}var disposeBinding=monacoInstance.onDidChangeModelContent(monacoCallback).dispose;function yCallback(event){mutualExcluse(function(){var start=monacoInstance.model.getPositionAt(event.index);var end,text;if(event.type==='insert'){end=start;text=event.values.join('');}else if(event.type==='delete'){end=monacoInstance.model.modifyPosition(start,event.length);text='';}var range={startLineNumber:start.lineNumber,startColumn:start.column,endLineNumber:end.lineNumber,endColumn:end.column};var id={major:monacoIdentifierTemplate.major,minor:monacoIdentifierTemplate.minor++};monacoInstance.executeEdits('Yjs',[{id:id,range:range,text:text,forceMoveMarkers:true}]);});}this.observe(yCallback);this.monacoInstances.push({editor:monacoInstance,yCallback:yCallback,monacoCallback:monacoCallback,disposeBinding:disposeBinding});}// CodeMirror implementation..
},{key:"unbindCodeMirror",value:function unbindCodeMirror(codeMirrorInstance){var i=this.codeMirrorInstances.findIndex(function(binding){return binding.editor===codeMirrorInstance;});if(i>=0){var binding=this.codeMirrorInstances[i];this.unobserve(binding.yCallback);binding.editor.off('changes',binding.codeMirrorCallback);this.codeMirrorInstances.splice(i,1);}}},{key:"unbindCodeMirrorAll",value:function unbindCodeMirrorAll(){for(var i=this.codeMirrorInstances.length-1;i>=0;i--){this.unbindCodeMirror(this.codeMirrorInstances[i].editor);}}},{key:"bindCodeMirror",value:function bindCodeMirror(codeMirrorInstance,options){var self=this;options=options||{};// this function makes sure that either the
// codemirror event is executed, or the yjs observer is executed
var token=true;function mutualExcluse(f){if(token){token=false;try{f();}catch(e){token=true;throw new Error(e);}token=true;}}codeMirrorInstance.setValue(this.toString());function codeMirrorCallback(cm,deltas){mutualExcluse(function(){for(var i=0;i<deltas.length;i++){var delta=deltas[i];var start=codeMirrorInstance.indexFromPos(delta.from);// apply the delete operation first
if(delta.removed.length>0){var delLength=0;for(var j=0;j<delta.removed.length;j++){delLength+=delta.removed[j].length;}// "enter" is also a character in our case
delLength+=delta.removed.length-1;self.delete(start,delLength);}// apply insert operation
self.insert(start,delta.text.join('\n'));}});}codeMirrorInstance.on('changes',codeMirrorCallback);function yCallback(event){mutualExcluse(function(){var from=codeMirrorInstance.posFromIndex(event.index);if(event.type==='insert'){var to=from;codeMirrorInstance.replaceRange(event.values.join(''),from,to);}else if(event.type==='delete'){var _to=codeMirrorInstance.posFromIndex(event.index+event.length);codeMirrorInstance.replaceRange('',from,_to);}});}this.observe(yCallback);this.codeMirrorInstances.push({editor:codeMirrorInstance,yCallback:yCallback,codeMirrorCallback:codeMirrorCallback});}},{key:"unbindAce",value:function unbindAce(aceInstance){var i=this.aceInstances.findIndex(function(binding){return binding.editor===aceInstance;});if(i>=0){var binding=this.aceInstances[i];this.unobserve(binding.yCallback);binding.editor.off('change',binding.aceCallback);this.aceInstances.splice(i,1);}}},{key:"unbindAceAll",value:function unbindAceAll(){for(var i=this.aceInstances.length-1;i>=0;i--){this.unbindAce(this.aceInstances[i].editor);}}},{key:"bindAce",value:function bindAce(aceInstance,options){var self=this;options=options||{};// this function makes sure that either the
// ace event is executed, or the yjs observer is executed
var token=true;function mutualExcluse(f){if(token){token=false;try{f();}catch(e){token=true;throw new Error(e);}token=true;}}aceInstance.setValue(this.toString());function aceCallback(delta){mutualExcluse(function(){var start;var length;var aceDocument=aceInstance.getSession().getDocument();if(delta.action==='insert'){start=aceDocument.positionToIndex(delta.start,0);self.insert(start,delta.lines.join('\n'));}else if(delta.action==='remove'){start=aceDocument.positionToIndex(delta.start,0);length=delta.lines.join('\n').length;self.delete(start,length);}});}aceInstance.on('change',aceCallback);aceInstance.selection.clearSelection();// We don't that ace is a global variable
// see #2
var aceClass;if(typeof ace!=='undefined'&&options.aceClass==null){aceClass=ace;// eslint-disable-line
}else{aceClass=options.aceClass;}var aceRequire=options.aceRequire||aceClass.require;var Range=aceRequire('ace/range').Range;function yCallback(event){var aceDocument=aceInstance.getSession().getDocument();mutualExcluse(function(){if(event.type==='insert'){var start=aceDocument.indexToPosition(event.index,0);aceDocument.insert(start,event.values.join(''));}else if(event.type==='delete'){var _start=aceDocument.indexToPosition(event.index,0);var end=aceDocument.indexToPosition(event.index+event.length,0);var range=new Range(_start.row,_start.column,end.row,end.column);aceDocument.remove(range);}});}this.observe(yCallback);this.aceInstances.push({editor:aceInstance,yCallback:yCallback,aceCallback:aceCallback});}},{key:"bind",value:function bind(){var e=arguments[0];if(e instanceof Element){this.bindTextarea.apply(this,arguments);}else if(e!=null&&e.session!=null&&e.getSession!=null&&e.setValue!=null){this.bindAce.apply(this,arguments);}else if(e!=null&&e.posFromIndex!=null&&e.replaceRange!=null){this.bindCodeMirror.apply(this,arguments);}else if(e!=null&&e.onDidChangeModelContent!=null){this.bindMonaco.apply(this,arguments);}else{console.error('Cannot bind, unsupported editor!');}}},{key:"unbindTextarea",value:function unbindTextarea(textarea){var i=this.textfields.findIndex(function(binding){return binding.editor===textarea;});if(i>=0){var binding=this.textfields[i];this.unobserve(binding.yCallback);var e=binding.editor;e.removeEventListener('input',binding.eventListener);this.textfields.splice(i,1);}}},{key:"unbindTextareaAll",value:function unbindTextareaAll(){for(var i=this.textfields.length-1;i>=0;i--){this.unbindTextarea(this.textfields[i].editor);}}},{key:"bindTextarea",value:function bindTextarea(textfield,domRoot){domRoot=domRoot||window;// eslint-disable-line
if(domRoot.getSelection==null){domRoot=window;// eslint-disable-line
}// don't duplicate!
for(var t=0;t<this.textfields.length;t++){if(this.textfields[t].editor===textfield){return;}}// this function makes sure that either the
// textfieldt event is executed, or the yjs observer is executed
var token=true;function mutualExcluse(f){if(token){token=false;try{f();}catch(e){token=true;throw new Error(e);}token=true;}}var self=this;textfield.value=this.toString();var createRange,writeRange,writeContent,getContent;if(textfield.selectionStart!=null&&textfield.setSelectionRange!=null){createRange=function createRange(fix){var left=textfield.selectionStart;var right=textfield.selectionEnd;if(fix!=null){left=fix(left);right=fix(right);}return{left:left,right:right};};writeRange=function writeRange(range){writeContent(self.toString());textfield.setSelectionRange(range.left,range.right);};writeContent=function writeContent(content){textfield.value=content;};getContent=function getContent(){return textfield.value;};}else{createRange=function createRange(fix){var range={};var s=domRoot.getSelection();var clength=textfield.textContent.length;range.left=Math.min(s.anchorOffset,clength);range.right=Math.min(s.focusOffset,clength);if(fix!=null){range.left=fix(range.left);range.right=fix(range.right);}var editedElement=s.focusNode;if(editedElement===textfield||editedElement===textfield.childNodes[0]){range.isReal=true;}else{range.isReal=false;}return range;};writeRange=function writeRange(range){writeContent(self.toString());var textnode=textfield.childNodes[0];if(range.isReal&&textnode!=null){if(range.left<0){range.left=0;}range.right=Math.max(range.left,range.right);if(range.right>textnode.length){range.right=textnode.length;}range.left=Math.min(range.left,range.right);var r=document.createRange();// eslint-disable-line
r.setStart(textnode,range.left);r.setEnd(textnode,range.right);var s=domRoot.getSelection();// eslint-disable-line
s.removeAllRanges();s.addRange(r);}};writeContent=function writeContent(content){textfield.innerText=content;/*
            var contentArray = content.replace(new RegExp('\n', 'g'), ' ').split(' '); // eslint-disable-line
            textfield.innerText = ''
            for (var i = 0; i < contentArray.length; i++) {
              var c = contentArray[i]
              textfield.innerText += c
              if (i !== contentArray.length - 1) {
                textfield.innerHTML += '&nbsp;'
              }
            }
            */};getContent=function getContent(){return textfield.innerText;};}writeContent(this.toString());function yCallback(event){mutualExcluse(function(){var oPos,fix;if(event.type==='insert'){oPos=event.index;fix=function fix(cursor){// eslint-disable-line
if(cursor<=oPos){return cursor;}else{cursor+=1;return cursor;}};var r=createRange(fix);writeRange(r);}else if(event.type==='delete'){oPos=event.index;fix=function fix(cursor){// eslint-disable-line
if(cursor<oPos){return cursor;}else{cursor-=1;return cursor;}};r=createRange(fix);writeRange(r);}});}this.observe(yCallback);var textfieldObserver=function textfieldObserver(){mutualExcluse(function(){var r=createRange(function(x){return x;});var oldContent=self.toString();var content=getContent();var diffs=diff(oldContent,content,r.left);var pos=0;for(var i=0;i<diffs.length;i++){var d=diffs[i];if(d[0]===0){// EQUAL
pos+=d[1].length;}else if(d[0]===-1){// DELETE
self.delete(pos,d[1].length);}else{// INSERT
self.insert(pos,d[1]);pos+=d[1].length;}}});};textfield.addEventListener('input',textfieldObserver);this.textfields.push({editor:textfield,yCallback:yCallback,eventListener:textfieldObserver});}},{key:"_destroy",value:function _destroy(){this.unbindAll();this.textfields=null;this.aceInstances=null;_get(YText.prototype.__proto__||Object.getPrototypeOf(YText.prototype),"_destroy",this).call(this);}}]);return YText;}(Y.Array.typeDefinition['class']);Y.extend('Text',new Y.utils.CustomTypeDefinition({name:'Text',class:YText,struct:'List',initType:regeneratorRuntime.mark(function YTextInitializer(os,model){var _content;return regeneratorRuntime.wrap(function YTextInitializer$(_context23){while(1){switch(_context23.prev=_context23.next){case 0:_content=[];return _context23.delegateYield(Y.Struct.List.map.call(this,model,function(op){if(op.hasOwnProperty('opContent')){throw new Error('Text must not contain types!');}else{op.content.forEach(function(c,i){_content.push({id:[op.id[0],op.id[1]+i],val:op.content[i]});});}}),"t0",2);case 2:return _context23.abrupt("return",new YText(os,model.id,_content));case 3:case"end":return _context23.stop();}}},YTextInitializer,this);}),createType:function YTextCreator(os,model){return new YText(os,model.id,[]);}}));});}module.exports=extend;if(typeof Y!=='undefined'){extend(Y);}},{"fast-diff":323}],390:[function(require,module,exports){'use strict';var alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),length=64,map={},seed=0,i=0,prev;/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */function encode(num){var encoded='';do{encoded=alphabet[num%length]+encoded;num=Math.floor(num/length);}while(num>0);return encoded;}/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */function decode(str){var decoded=0;for(i=0;i<str.length;i++){decoded=decoded*length+map[str.charAt(i)];}return decoded;}/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */function yeast(){var now=encode(+new Date());if(now!==prev)return seed=0,prev=now;return now+'.'+encode(seed++);}//
// Map each character to its index.
//
for(;i<length;i++){map[alphabet[i]]=i;}//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode=encode;yeast.decode=decode;module.exports=yeast;},{}],391:[function(require,module,exports){(function(process){/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=require('./debug');exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
 * Colors.
 */exports.colors=['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson'];/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */function useColors(){// NB: In an Electron preload script, document will be defined but not fully
// initialized. Since we know we're in Chrome, we'll just detect this case
// explicitly
if(typeof window!=='undefined'&&window&&typeof window.process!=='undefined'&&window.process.type==='renderer'){return true;}// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&document&&'WebkitAppearance'in document.documentElement.style||// is firebug? http://stackoverflow.com/a/398120/376773
typeof window!=='undefined'&&window&&window.console&&(console.firebug||console.exception&&console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
typeof navigator!=='undefined'&&navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||// double check webkit in userAgent just in case we are in a worker
typeof navigator!=='undefined'&&navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);}/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */function formatArgs(args){var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return;var c='color: '+this.color;args.splice(1,0,c,'color: inherit');// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-zA-Z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);}/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */function load(){var r;try{r=exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(!r&&typeof process!=='undefined'&&'env'in process){r=process.env.DEBUG;}return r;}/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */exports.enable(load());/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */function localstorage(){try{return window.localStorage;}catch(e){}}}).call(this,require('_process'));},{"./debug":392,"_process":413}],392:[function(require,module,exports){/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */exports=module.exports=createDebug.debug=createDebug['default']=createDebug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=require('ms');/**
 * The currently active debug mode names, and names to skip.
 */exports.names=[];exports.skips=[];/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */exports.formatters={};/**
 * Previous log timestamp.
 */var prevTime;/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */function selectColor(namespace){var hash=0,i;for(i in namespace){hash=(hash<<5)-hash+namespace.charCodeAt(i);hash|=0;// Convert to 32bit integer
}return exports.colors[Math.abs(hash)%exports.colors.length];}/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */function createDebug(namespace){function debug(){// disabled?
if(!debug.enabled)return;var self=debug;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// turn the `arguments` into a proper Array
var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %O
args.unshift('%O');}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-zA-Z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting (colors, etc.)
exports.formatArgs.call(self,args);var logFn=debug.log||exports.log||console.log.bind(console);logFn.apply(self,args);}debug.namespace=namespace;debug.enabled=exports.enabled(namespace);debug.useColors=exports.useColors();debug.color=selectColor(namespace);// env-specific initialization logic for debug instances
if('function'===typeof exports.init){exports.init(debug);}return debug;}/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */function enable(namespaces){exports.save(namespaces);exports.names=[];exports.skips=[];var split=(typeof namespaces==='string'?namespaces:'').split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}}/**
 * Disable debug output.
 *
 * @api public
 */function disable(){exports.enable('');}/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}},{"ms":393}],393:[function(require,module,exports){/**
 * Helpers.
 */var s=1000;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */module.exports=function(val,options){options=options||{};var type=typeof val==="undefined"?"undefined":_typeof(val);if(type==='string'&&val.length>0){return parse(val);}else if(type==='number'&&isNaN(val)===false){return options.long?fmtLong(val):fmtShort(val);}throw new Error('val is not a non-empty string or a valid number. val='+JSON.stringify(val));};/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */function parse(str){str=String(str);if(str.length>10000){return;}var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match){return;}var n=parseFloat(match[1]);var type=(match[2]||'ms').toLowerCase();switch(type){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n;default:return undefined;}}/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtShort(ms){if(ms>=d){return Math.round(ms/d)+'d';}if(ms>=h){return Math.round(ms/h)+'h';}if(ms>=m){return Math.round(ms/m)+'m';}if(ms>=s){return Math.round(ms/s)+'s';}return ms+'ms';}/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtLong(ms){return plural(ms,d,'day')||plural(ms,h,'hour')||plural(ms,m,'minute')||plural(ms,s,'second')||ms+' ms';}/**
 * Pluralization helper.
 */function plural(ms,n,name){if(ms<n){return;}if(ms<n*1.5){return Math.floor(ms/n)+' '+name;}return Math.ceil(ms/n)+' '+name+'s';}},{}],394:[function(require,module,exports){/* @flow */'use strict';function canRead(auth){return auth==='read'||auth==='write';}function canWrite(auth){return auth==='write';}module.exports=function(Y/* :any */){var AbstractConnector=function(){/* ::
    y: YConfig;
    role: SyncRole;
    connections: Object;
    isSynced: boolean;
    userEventListeners: Array<Function>;
    whenSyncedListeners: Array<Function>;
    currentSyncTarget: ?UserId;
    syncingClients: Array<UserId>;
    forwardToSyncingClients: boolean;
    debug: boolean;
    broadcastedHB: boolean;
    syncStep2: Promise;
    userId: UserId;
    send: Function;
    broadcast: Function;
    broadcastOpBuffer: Array<Operation>;
    protocolVersion: number;
    *//*
      opts contains the following information:
       role : String Role of this client ("master" or "slave")
       userId : String Uniquely defines the user.
       debug: Boolean Whether to print debug messages (optional)
    */function AbstractConnector(y,opts){_classCallCheck2(this,AbstractConnector);this.y=y;if(opts==null){opts={};}if(opts.role==null||opts.role==='master'){this.role='master';}else if(opts.role==='slave'){this.role='slave';}else{throw new Error("Role must be either 'master' or 'slave'!");}this.log=Y.debug('y:connector');this.logMessage=Y.debug('y:connector-message');this.y.db.forwardAppliedOperations=opts.forwardAppliedOperations||false;this.role=opts.role;this.connections={};this.isSynced=false;this.userEventListeners=[];this.whenSyncedListeners=[];this.currentSyncTarget=null;this.syncingClients=[];this.forwardToSyncingClients=opts.forwardToSyncingClients!==false;this.debug=opts.debug===true;this.broadcastedHB=false;this.syncStep2=Promise.resolve();this.broadcastOpBuffer=[];this.protocolVersion=11;this.authInfo=opts.auth||null;this.checkAuth=opts.checkAuth||function(){return Promise.resolve('write');};// default is everyone has write access
if(opts.generateUserId===true){this.setUserId(Y.utils.generateGuid());}}_createClass(AbstractConnector,[{key:"resetAuth",value:function resetAuth(auth){if(this.authInfo!==auth){this.authInfo=auth;this.broadcast({type:'auth',auth:this.authInfo});}}},{key:"reconnect",value:function reconnect(){this.log('reconnecting..');}},{key:"disconnect",value:function disconnect(){this.log('discronnecting..');this.connections={};this.isSynced=false;this.currentSyncTarget=null;this.broadcastedHB=false;this.syncingClients=[];this.whenSyncedListeners=[];return this.y.db.stopGarbageCollector();}},{key:"repair",value:function repair(){this.log('Repairing the state of Yjs. This can happen if messages get lost, and Yjs detects that something is wrong. If this happens often, please report an issue here: https://github.com/y-js/yjs/issues');for(var name in this.connections){this.connections[name].isSynced=false;}this.isSynced=false;this.currentSyncTarget=null;this.broadcastedHB=false;this.findNextSyncTarget();}},{key:"setUserId",value:function setUserId(userId){if(this.userId==null){this.log('Set userId to "%s"',userId);this.userId=userId;return this.y.db.setUserId(userId);}else{return null;}}},{key:"onUserEvent",value:function onUserEvent(f){this.userEventListeners.push(f);}},{key:"removeUserEventListener",value:function removeUserEventListener(f){this.userEventListeners=this.userEventListeners.filter(function(g){f!==g;});}},{key:"userLeft",value:function userLeft(user){if(this.connections[user]!=null){this.log('User left: %s',user);delete this.connections[user];if(user===this.currentSyncTarget){this.currentSyncTarget=null;this.findNextSyncTarget();}this.syncingClients=this.syncingClients.filter(function(cli){return cli!==user;});var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=this.userEventListeners[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var f=_step.value;f({action:'userLeft',user:user});}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}}},{key:"userJoined",value:function userJoined(user,role){if(role==null){throw new Error('You must specify the role of the joined user!');}if(this.connections[user]!=null){throw new Error('This user already joined!');}this.log('User joined: %s',user);this.connections[user]={isSynced:false,role:role};var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=this.userEventListeners[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var f=_step2.value;f({action:'userJoined',user:user,role:role});}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}if(this.currentSyncTarget==null){this.findNextSyncTarget();}}// Execute a function _when_ we are connected.
// If not connected, wait until connected
},{key:"whenSynced",value:function whenSynced(f){if(this.isSynced){f();}else{this.whenSyncedListeners.push(f);}}},{key:"findNextSyncTarget",value:function findNextSyncTarget(){if(this.currentSyncTarget!=null){return;// "The current sync has not finished!"
}var syncUser=null;for(var uid in this.connections){if(!this.connections[uid].isSynced){syncUser=uid;break;}}var conn=this;if(syncUser!=null){this.currentSyncTarget=syncUser;this.y.db.requestTransaction(regeneratorRuntime.mark(function _callee8(){var stateSet,deleteSet;return regeneratorRuntime.wrap(function _callee8$(_context24){while(1){switch(_context24.prev=_context24.next){case 0:return _context24.delegateYield(this.getStateSet(),"t0",1);case 1:stateSet=_context24.t0;return _context24.delegateYield(this.getDeleteSet(),"t1",3);case 3:deleteSet=_context24.t1;conn.send(syncUser,{type:'sync step 1',stateSet:stateSet,deleteSet:deleteSet,protocolVersion:conn.protocolVersion,auth:conn.authInfo});case 5:case"end":return _context24.stop();}}},_callee8,this);}));}else{if(!conn.isSynced){this.y.db.requestTransaction(regeneratorRuntime.mark(function _callee9(){var _iteratorNormalCompletion3,_didIteratorError3,_iteratorError3,_iterator3,_step3,f;return regeneratorRuntime.wrap(function _callee9$(_context25){while(1){switch(_context25.prev=_context25.next){case 0:if(conn.isSynced){_context25.next=23;break;}// it is crucial that isSynced is set at the time garbageCollectAfterSync is called
conn.isSynced=true;return _context25.delegateYield(this.garbageCollectAfterSync(),"t0",3);case 3:// call whensynced listeners
_iteratorNormalCompletion3=true;_didIteratorError3=false;_iteratorError3=undefined;_context25.prev=6;for(_iterator3=conn.whenSyncedListeners[Symbol.iterator]();!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){f=_step3.value;f();}_context25.next=14;break;case 10:_context25.prev=10;_context25.t1=_context25["catch"](6);_didIteratorError3=true;_iteratorError3=_context25.t1;case 14:_context25.prev=14;_context25.prev=15;if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}case 17:_context25.prev=17;if(!_didIteratorError3){_context25.next=20;break;}throw _iteratorError3;case 20:return _context25.finish(17);case 21:return _context25.finish(14);case 22:conn.whenSyncedListeners=[];case 23:case"end":return _context25.stop();}}},_callee9,this,[[6,10,14,22],[15,,17,21]]);}));}}}},{key:"send",value:function send(uid,message){this.log('Send \'%s\' to %s',message.type,uid);this.logMessage('Message: %j',message);}},{key:"broadcast",value:function broadcast(message){this.log('Broadcast \'%s\'',message.type);this.logMessage('Message: %j',message);}/*
      Buffer operations, and broadcast them when ready.
    */},{key:"broadcastOps",value:function broadcastOps(ops){ops=ops.map(function(op){return Y.Struct[op.struct].encode(op);});var self=this;function broadcastOperations(){if(self.broadcastOpBuffer.length>0){self.broadcast({type:'update',ops:self.broadcastOpBuffer});self.broadcastOpBuffer=[];}}if(this.broadcastOpBuffer.length===0){this.broadcastOpBuffer=ops;if(this.y.db.transactionInProgress){this.y.db.whenTransactionsFinished().then(broadcastOperations);}else{setTimeout(broadcastOperations,0);}}else{this.broadcastOpBuffer=this.broadcastOpBuffer.concat(ops);}}/*
      You received a raw message, and you know that it is intended for Yjs. Then call this function.
    */},{key:"receiveMessage",value:function receiveMessage(sender/* :UserId */,message/* :Message */){var _this9=this;if(sender===this.userId){return Promise.resolve();}this.log('Receive \'%s\' from %s',message.type,sender);this.logMessage('Message: %j',message);if(message.protocolVersion!=null&&message.protocolVersion!==this.protocolVersion){this.log("You tried to sync with a yjs instance that has a different protocol version\n          (You: "+this.protocolVersion+", Client: "+message.protocolVersion+").\n          The sync was stopped. You need to upgrade your dependencies (especially Yjs & the Connector)!\n          ");this.send(sender,{type:'sync stop',protocolVersion:this.protocolVersion});return Promise.reject('Incompatible protocol version');}if(message.auth!=null&&this.connections[sender]!=null){// authenticate using auth in message
var auth=this.checkAuth(message.auth,this.y);this.connections[sender].auth=auth;auth.then(function(auth){var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=_this9.userEventListeners[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var f=_step4.value;f({action:'userAuthenticated',user:sender,auth:auth});}}catch(err){_didIteratorError4=true;_iteratorError4=err;}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return();}}finally{if(_didIteratorError4){throw _iteratorError4;}}}});}else if(this.connections[sender]!=null&&this.connections[sender].auth==null){// authenticate without otherwise
this.connections[sender].auth=this.checkAuth(null,this.y);}if(this.connections[sender]!=null&&this.connections[sender].auth!=null){return this.connections[sender].auth.then(function(auth){if(message.type==='sync step 1'&&canRead(auth)){(function(){var conn=_this9;var m=message;_this9.y.db.requestTransaction(regeneratorRuntime.mark(function _callee10(){var currentStateSet,ds,ops;return regeneratorRuntime.wrap(function _callee10$(_context26){while(1){switch(_context26.prev=_context26.next){case 0:return _context26.delegateYield(this.getStateSet(),"t0",1);case 1:currentStateSet=_context26.t0;if(!canWrite(auth)){_context26.next=4;break;}return _context26.delegateYield(this.applyDeleteSet(m.deleteSet),"t1",4);case 4:return _context26.delegateYield(this.getDeleteSet(),"t2",5);case 5:ds=_context26.t2;return _context26.delegateYield(this.getOperations(m.stateSet),"t3",7);case 7:ops=_context26.t3;conn.send(sender,{type:'sync step 2',os:ops,stateSet:currentStateSet,deleteSet:ds,protocolVersion:this.protocolVersion,auth:this.authInfo});if(this.forwardToSyncingClients){conn.syncingClients.push(sender);setTimeout(function(){conn.syncingClients=conn.syncingClients.filter(function(cli){return cli!==sender;});conn.send(sender,{type:'sync done'});},5000);// TODO: conn.syncingClientDuration)
}else{conn.send(sender,{type:'sync done'});}case 10:case"end":return _context26.stop();}}},_callee10,this);}));})();}else if(message.type==='sync step 2'&&canWrite(auth)){var broadcastHB;var db;var defer;(function(){var conn=_this9;broadcastHB=!_this9.broadcastedHB;_this9.broadcastedHB=true;db=_this9.y.db;defer={};defer.promise=new Promise(function(resolve){defer.resolve=resolve;});_this9.syncStep2=defer.promise;var m/* :MessageSyncStep2 */=message;db.requestTransaction(regeneratorRuntime.mark(function _callee12(){return regeneratorRuntime.wrap(function _callee12$(_context28){while(1){switch(_context28.prev=_context28.next){case 0:return _context28.delegateYield(this.applyDeleteSet(m.deleteSet),"t0",1);case 1:this.store.apply(m.os);db.requestTransaction(regeneratorRuntime.mark(function _callee11(){var ops;return regeneratorRuntime.wrap(function _callee11$(_context27){while(1){switch(_context27.prev=_context27.next){case 0:return _context27.delegateYield(this.getOperations(m.stateSet),"t0",1);case 1:ops=_context27.t0;if(ops.length>0){if(!broadcastHB){// TODO: consider to broadcast here..
conn.send(sender,{type:'update',ops:ops});}else{// broadcast only once!
conn.broadcastOps(ops);}}defer.resolve();case 4:case"end":return _context27.stop();}}},_callee11,this);}));case 3:case"end":return _context28.stop();}}},_callee12,this);}));})();}else if(message.type==='sync done'){var self=_this9;_this9.syncStep2.then(function(){self._setSyncedWith(sender);});}else if(message.type==='update'&&canWrite(auth)){if(_this9.forwardToSyncingClients){var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=_this9.syncingClients[Symbol.iterator](),_step5;!(_iteratorNormalCompletion5=(_step5=_iterator5.next()).done);_iteratorNormalCompletion5=true){var client=_step5.value;_this9.send(client,message);}}catch(err){_didIteratorError5=true;_iteratorError5=err;}finally{try{if(!_iteratorNormalCompletion5&&_iterator5.return){_iterator5.return();}}finally{if(_didIteratorError5){throw _iteratorError5;}}}}if(_this9.y.db.forwardAppliedOperations){var delops=message.ops.filter(function(o){return o.struct==='Delete';});if(delops.length>0){_this9.broadcastOps(delops);}}_this9.y.db.apply(message.ops);}});}else{return Promise.reject('Unable to deliver message');}}},{key:"_setSyncedWith",value:function _setSyncedWith(user){var conn=this.connections[user];if(conn!=null){conn.isSynced=true;}if(user===this.currentSyncTarget){this.currentSyncTarget=null;this.findNextSyncTarget();}}/*
      Currently, the HB encodes operations as JSON. For the moment I want to keep it
      that way. Maybe we support encoding in the HB as XML in the future, but for now I don't want
      too much overhead. Y is very likely to get changed a lot in the future

      Because we don't want to encode JSON as string (with character escaping, wich makes it pretty much unreadable)
      we encode the JSON as XML.

      When the HB support encoding as XML, the format should look pretty much like this.

      does not support primitive values as array elements
      expects an ltx (less than xml) object
    */},{key:"parseMessageFromXml",value:function parseMessageFromXml(m/* :any */){function parseArray(node){var _iteratorNormalCompletion6=true;var _didIteratorError6=false;var _iteratorError6=undefined;try{for(var _iterator6=node.children[Symbol.iterator](),_step6;!(_iteratorNormalCompletion6=(_step6=_iterator6.next()).done);_iteratorNormalCompletion6=true){var n=_step6.value;if(n.getAttribute('isArray')==='true'){return parseArray(n);}else{return parseObject(n);}}}catch(err){_didIteratorError6=true;_iteratorError6=err;}finally{try{if(!_iteratorNormalCompletion6&&_iterator6.return){_iterator6.return();}}finally{if(_didIteratorError6){throw _iteratorError6;}}}}function parseObject(node/* :any */){var json={};for(var attrName in node.attrs){var value=node.attrs[attrName];var int=parseInt(value,10);if(isNaN(int)||''+int!==value){json[attrName]=value;}else{json[attrName]=int;}}for(var n/* :any */in node.children){var name=n.name;if(n.getAttribute('isArray')==='true'){json[name]=parseArray(n);}else{json[name]=parseObject(n);}}return json;}parseObject(m);}/*
      encode message in xml
      we use string because Strophe only accepts an "xml-string"..
      So {a:4,b:{c:5}} will look like
      <y a="4">
        <b c="5"></b>
      </y>
      m - ltx element
      json - Object
    */},{key:"encodeMessageToXml",value:function encodeMessageToXml(msg,obj){// attributes is optional
function encodeObject(m,json){for(var name in json){var value=json[name];if(name==null){// nop
}else if(value.constructor===Object){encodeObject(m.c(name),value);}else if(value.constructor===Array){encodeArray(m.c(name),value);}else{m.setAttribute(name,value);}}}function encodeArray(m,array){m.setAttribute('isArray','true');var _iteratorNormalCompletion7=true;var _didIteratorError7=false;var _iteratorError7=undefined;try{for(var _iterator7=array[Symbol.iterator](),_step7;!(_iteratorNormalCompletion7=(_step7=_iterator7.next()).done);_iteratorNormalCompletion7=true){var e=_step7.value;if(e.constructor===Object){encodeObject(m.c('array-element'),e);}else{encodeArray(m.c('array-element'),e);}}}catch(err){_didIteratorError7=true;_iteratorError7=err;}finally{try{if(!_iteratorNormalCompletion7&&_iterator7.return){_iterator7.return();}}finally{if(_didIteratorError7){throw _iteratorError7;}}}}if(obj.constructor===Object){encodeObject(msg.c('y',{xmlns:'http://y.ninja/connector-stanza'}),obj);}else if(obj.constructor===Array){encodeArray(msg.c('y',{xmlns:'http://y.ninja/connector-stanza'}),obj);}else{throw new Error("I can't encode this json!");}}}]);return AbstractConnector;}();Y.AbstractConnector=AbstractConnector;};},{}],395:[function(require,module,exports){/* global getRandom, async */'use strict';module.exports=function(Y){var globalRoom={users:{},buffers:{},removeUser:function removeUser(user){for(var i in this.users){this.users[i].userLeft(user);}delete this.users[user];delete this.buffers[user];},addUser:function addUser(connector){this.users[connector.userId]=connector;this.buffers[connector.userId]={};for(var uname in this.users){if(uname!==connector.userId){var u=this.users[uname];u.userJoined(connector.userId,'master');connector.userJoined(u.userId,'master');}}},whenTransactionsFinished:function whenTransactionsFinished(){var self=this;return new Promise(function(resolve,reject){// The connector first has to send the messages to the db.
// Wait for the checkAuth-function to resolve
// The test lib only has a simple checkAuth function: `() => Promise.resolve()`
// Just add a function to the event-queue, in order to wait for the event.
// TODO: this may be buggy in test applications (but it isn't be for real-life apps)
setTimeout(function(){var ps=[];for(var name in self.users){ps.push(self.users[name].y.db.whenTransactionsFinished());}Promise.all(ps).then(resolve,reject);},0);});},flushOne:function flushOne(){var bufs=[];for(var receiver in globalRoom.buffers){var buff=globalRoom.buffers[receiver];var push=false;for(var sender in buff){if(buff[sender].length>0){push=true;break;}}if(push){bufs.push(receiver);}}if(bufs.length>0){var userId=getRandom(bufs);var _buff=globalRoom.buffers[userId];var _sender=getRandom(Object.keys(_buff));var m=_buff[_sender].shift();if(_buff[_sender].length===0){delete _buff[_sender];}var user=globalRoom.users[userId];return user.receiveMessage(m[0],m[1]).then(function(){return user.y.db.whenTransactionsFinished();},function(){});}else{return false;}},flushAll:function flushAll(){return new Promise(function(resolve){// flushes may result in more created operations,
// flush until there is nothing more to flush
function nextFlush(){var c=globalRoom.flushOne();if(c){while(c){c=globalRoom.flushOne();}globalRoom.whenTransactionsFinished().then(nextFlush);}else{c=globalRoom.flushOne();if(c){c.then(function(){globalRoom.whenTransactionsFinished().then(nextFlush);});}else{resolve();}}}globalRoom.whenTransactionsFinished().then(nextFlush);});}};Y.utils.globalRoom=globalRoom;var userIdCounter=0;var Test=function(_Y$AbstractConnector2){_inherits(Test,_Y$AbstractConnector2);function Test(y,options){_classCallCheck2(this,Test);if(options===undefined){throw new Error('Options must not be undefined!');}options.role='master';options.forwardToSyncingClients=false;var _this10=_possibleConstructorReturn(this,(Test.__proto__||Object.getPrototypeOf(Test)).call(this,y,options));_this10.setUserId(userIdCounter++ +'').then(function(){globalRoom.addUser(_this10);});_this10.globalRoom=globalRoom;_this10.syncingClientDuration=0;return _this10;}_createClass(Test,[{key:"receiveMessage",value:function receiveMessage(sender,m){return _get(Test.prototype.__proto__||Object.getPrototypeOf(Test.prototype),"receiveMessage",this).call(this,sender,JSON.parse(JSON.stringify(m)));}},{key:"send",value:function send(userId,message){var buffer=globalRoom.buffers[userId];if(buffer!=null){if(buffer[this.userId]==null){buffer[this.userId]=[];}buffer[this.userId].push(JSON.parse(JSON.stringify([this.userId,message])));}}},{key:"broadcast",value:function broadcast(message){for(var key in globalRoom.buffers){var buff=globalRoom.buffers[key];if(buff[this.userId]==null){buff[this.userId]=[];}buff[this.userId].push(JSON.parse(JSON.stringify([this.userId,message])));}}},{key:"isDisconnected",value:function isDisconnected(){return globalRoom.users[this.userId]==null;}},{key:"reconnect",value:function reconnect(){if(this.isDisconnected()){globalRoom.addUser(this);_get(Test.prototype.__proto__||Object.getPrototypeOf(Test.prototype),"reconnect",this).call(this);}return Y.utils.globalRoom.flushAll();}},{key:"disconnect",value:function disconnect(){if(!this.isDisconnected()){globalRoom.removeUser(this.userId);_get(Test.prototype.__proto__||Object.getPrototypeOf(Test.prototype),"disconnect",this).call(this);}return this.y.db.whenTransactionsFinished();}},{key:"flush",value:function flush(){var self=this;return async(regeneratorRuntime.mark(function _callee13(){var buff,sender,m;return regeneratorRuntime.wrap(function _callee13$(_context29){while(1){switch(_context29.prev=_context29.next){case 0:buff=globalRoom.buffers[self.userId];case 1:if(!(Object.keys(buff).length>0)){_context29.next=9;break;}sender=getRandom(Object.keys(buff));m=buff[sender].shift();if(buff[sender].length===0){delete buff[sender];}_context29.next=7;return this.receiveMessage(m[0],m[1]);case 7:_context29.next=1;break;case 9:_context29.next=11;return self.whenTransactionsFinished();case 11:case"end":return _context29.stop();}}},_callee13,this);}));}}]);return Test;}(Y.AbstractConnector);Y.Test=Test;};},{}],396:[function(require,module,exports){/* @flow */'use strict';module.exports=function(Y/* :any */){/*
    Partial definition of an OperationStore.
    TODO: name it Database, operation store only holds operations.

    A database definition must alse define the following methods:
    * logTable() (optional)
      - show relevant information information in a table
    * requestTransaction(makeGen)
      - request a transaction
    * destroy()
      - destroy the database
  */var AbstractDatabase=function(){/* ::
    y: YConfig;
    forwardAppliedOperations: boolean;
    listenersById: Object;
    listenersByIdExecuteNow: Array<Object>;
    listenersByIdRequestPending: boolean;
    initializedTypes: Object;
    whenUserIdSetListener: ?Function;
    waitingTransactions: Array<Transaction>;
    transactionInProgress: boolean;
    executeOrder: Array<Object>;
    gc1: Array<Struct>;
    gc2: Array<Struct>;
    gcTimeout: number;
    gcInterval: any;
    garbageCollect: Function;
    executeOrder: Array<any>; // for debugging only
    userId: UserId;
    opClock: number;
    transactionsFinished: ?{promise: Promise, resolve: any};
    transact: (x: ?Generator) => any;
    */function AbstractDatabase(y,opts){_classCallCheck2(this,AbstractDatabase);this.y=y;var os=this;this.userId=null;var resolve;this.userIdPromise=new Promise(function(r){resolve=r;});this.userIdPromise.resolve=resolve;// whether to broadcast all applied operations (insert & delete hook)
this.forwardAppliedOperations=false;// E.g. this.listenersById[id] : Array<Listener>
this.listenersById={};// Execute the next time a transaction is requested
this.listenersByIdExecuteNow=[];// A transaction is requested
this.listenersByIdRequestPending=false;/* To make things more clear, the following naming conventions:
         * ls : we put this.listenersById on ls
         * l : Array<Listener>
         * id : Id (can't use as property name)
         * sid : String (converted from id via JSON.stringify
                         so we can use it as a property name)

        Always remember to first overwrite
        a property before you iterate over it!
      */// TODO: Use ES7 Weak Maps. This way types that are no longer user,
// wont be kept in memory.
this.initializedTypes={};this.waitingTransactions=[];this.transactionInProgress=false;this.transactionIsFlushed=false;if(typeof YConcurrency_TestingMode!=='undefined'){this.executeOrder=[];}this.gc1=[];// first stage
this.gc2=[];// second stage -> after that, remove the op
this.gc=opts.gc==null||opts.gc;if(this.gc){this.gcTimeout=!opts.gcTimeout?50000:opts.gcTimeout;}else{this.gcTimeout=-1;}function garbageCollect(){return os.whenTransactionsFinished().then(function(){if(os.gc1.length>0||os.gc2.length>0){if(!os.y.connector.isSynced){console.warn('gc should be empty when not synced!');}return new Promise(function(resolve){os.requestTransaction(regeneratorRuntime.mark(function _callee14(){var i,oid;return regeneratorRuntime.wrap(function _callee14$(_context30){while(1){switch(_context30.prev=_context30.next){case 0:if(!(os.y.connector!=null&&os.y.connector.isSynced)){_context30.next=10;break;}i=0;case 2:if(!(i<os.gc2.length)){_context30.next=8;break;}oid=os.gc2[i];return _context30.delegateYield(this.garbageCollectOperation(oid),"t0",5);case 5:i++;_context30.next=2;break;case 8:os.gc2=os.gc1;os.gc1=[];case 10:// TODO: Use setInterval here instead (when garbageCollect is called several times there will be several timeouts..)
if(os.gcTimeout>0){os.gcInterval=setTimeout(garbageCollect,os.gcTimeout);}resolve();case 12:case"end":return _context30.stop();}}},_callee14,this);}));});}else{// TODO: see above
if(os.gcTimeout>0){os.gcInterval=setTimeout(garbageCollect,os.gcTimeout);}return Promise.resolve();}});}this.garbageCollect=garbageCollect;if(this.gcTimeout>0){garbageCollect();}this.repairCheckInterval=!opts.repairCheckInterval?6000:opts.repairCheckInterval;this.opsReceivedTimestamp=new Date();this.startRepairCheck();}_createClass(AbstractDatabase,[{key:"startRepairCheck",value:function startRepairCheck(){var os=this;if(this.repairCheckInterval>0){this.repairCheckIntervalHandler=setInterval(function repairOnMissingOperations(){/*
            Case 1. No ops have been received in a while (new Date() - os.opsReceivedTimestamp > os.repairCheckInterval)
              - 1.1 os.listenersById is empty. Then the state was correct the whole time. -> Nothing to do (nor to update)
              - 1.2 os.listenersById is not empty.
                      * Then the state was incorrect for at least {os.repairCheckInterval} seconds.
                      * -> Remove everything in os.listenersById and sync again (connector.repair())
            Case 2. An op has been received in the last {os.repairCheckInterval } seconds.
                    It is not yet necessary to check for faulty behavior. Everything can still resolve itself. Wait for more messages.
                    If nothing was received for a while and os.listenersById is still not emty, we are in case 1.2
                    -> Do nothing

            Baseline here is: we really only have to catch case 1.2..
          */if(new Date()-os.opsReceivedTimestamp>os.repairCheckInterval&&Object.keys(os.listenersById).length>0// os.listenersById is not empty
){// haven't received operations for over {os.repairCheckInterval} seconds, resend state vector
os.listenersById={};os.opsReceivedTimestamp=new Date();// update so you don't send repair several times in a row
os.y.connector.repair();}},this.repairCheckInterval);}}},{key:"stopRepairCheck",value:function stopRepairCheck(){clearInterval(this.repairCheckIntervalHandler);}},{key:"queueGarbageCollector",value:function queueGarbageCollector(id){if(this.y.connector.isSynced&&this.gc){this.gc1.push(id);}}},{key:"emptyGarbageCollector",value:function emptyGarbageCollector(){var _this11=this;return new Promise(function(resolve){var check=function check(){if(_this11.gc1.length>0||_this11.gc2.length>0){_this11.garbageCollect().then(check);}else{resolve();}};setTimeout(check,0);});}},{key:"addToDebug",value:function addToDebug(){if(typeof YConcurrency_TestingMode!=='undefined'){var command/* :string */=Array.prototype.map.call(arguments,function(s){if(typeof s==='string'){return s;}else{return JSON.stringify(s);}}).join('').replace(/"/g,"'").replace(/,/g,', ').replace(/:/g,': ');this.executeOrder.push(command);}}},{key:"getDebugData",value:function getDebugData(){console.log(this.executeOrder.join('\n'));}},{key:"stopGarbageCollector",value:function stopGarbageCollector(){var self=this;this.gc=false;this.gcTimeout=-1;return new Promise(function(resolve){self.requestTransaction(regeneratorRuntime.mark(function _callee15(){var ungc,i,op;return regeneratorRuntime.wrap(function _callee15$(_context31){while(1){switch(_context31.prev=_context31.next){case 0:ungc/* :Array<Struct> */=self.gc1.concat(self.gc2);self.gc1=[];self.gc2=[];i=0;case 4:if(!(i<ungc.length)){_context31.next=13;break;}return _context31.delegateYield(this.getOperation(ungc[i]),"t0",6);case 6:op=_context31.t0;if(!(op!=null)){_context31.next=10;break;}delete op.gc;return _context31.delegateYield(this.setOperation(op),"t1",10);case 10:i++;_context31.next=4;break;case 13:resolve();case 14:case"end":return _context31.stop();}}},_callee15,this);}));});}/*
      Try to add to GC.

      TODO: rename this function

      Rulez:
      * Only gc if this user is online & gc turned on
      * The most left element in a list must not be gc'd.
        => There is at least one element in the list

      returns true iff op was added to GC
    */},{key:"addToGarbageCollector",value:regeneratorRuntime.mark(function addToGarbageCollector(op,left){var gc;return regeneratorRuntime.wrap(function addToGarbageCollector$(_context32){while(1){switch(_context32.prev=_context32.next){case 0:if(!(op.gc==null&&op.deleted===true&&this.store.gc&&this.store.y.connector.isSynced)){_context32.next=15;break;}gc=false;if(!(left!=null&&left.deleted===true)){_context32.next=6;break;}gc=true;_context32.next=10;break;case 6:if(!(op.content!=null&&op.content.length>1)){_context32.next=10;break;}return _context32.delegateYield(this.getInsertionCleanStart([op.id[0],op.id[1]+1]),"t0",8);case 8:op=_context32.t0;gc=true;case 10:if(!gc){_context32.next=15;break;}op.gc=true;return _context32.delegateYield(this.setOperation(op),"t1",13);case 13:this.store.queueGarbageCollector(op.id);return _context32.abrupt("return",true);case 15:return _context32.abrupt("return",false);case 16:case"end":return _context32.stop();}}},addToGarbageCollector,this);})},{key:"removeFromGarbageCollector",value:function removeFromGarbageCollector(op){function filter(o){return!Y.utils.compareIds(o,op.id);}this.gc1=this.gc1.filter(filter);this.gc2=this.gc2.filter(filter);delete op.gc;}},{key:"destroyTypes",value:function destroyTypes(){for(var key in this.initializedTypes){var type=this.initializedTypes[key];if(type._destroy!=null){type._destroy();}else{console.error('The type you included does not provide destroy functionality, it will remain in memory (updating your packages will help).');}}}},{key:"destroy",value:regeneratorRuntime.mark(function destroy(){return regeneratorRuntime.wrap(function destroy$(_context33){while(1){switch(_context33.prev=_context33.next){case 0:clearInterval(this.gcInterval);this.gcInterval=null;this.stopRepairCheck();case 3:case"end":return _context33.stop();}}},destroy,this);})},{key:"setUserId",value:function setUserId(userId){if(!this.userIdPromise.inProgress){this.userIdPromise.inProgress=true;var self=this;self.requestTransaction(regeneratorRuntime.mark(function _callee16(){var state;return regeneratorRuntime.wrap(function _callee16$(_context34){while(1){switch(_context34.prev=_context34.next){case 0:self.userId=userId;return _context34.delegateYield(this.getState(userId),"t0",2);case 2:state=_context34.t0;self.opClock=state.clock;self.userIdPromise.resolve(userId);case 5:case"end":return _context34.stop();}}},_callee16,this);}));}return this.userIdPromise;}},{key:"whenUserIdSet",value:function whenUserIdSet(f){this.userIdPromise.then(f);}},{key:"getNextOpId",value:function getNextOpId(numberOfIds){if(numberOfIds==null){throw new Error('getNextOpId expects the number of created ids to create!');}else if(this.userId==null){throw new Error('OperationStore not yet initialized!');}else{var id=[this.userId,this.opClock];this.opClock+=numberOfIds;return id;}}/*
      Apply a list of operations.

      * we save a timestamp, because we received new operations that could resolve ops in this.listenersById (see this.startRepairCheck)
      * get a transaction
      * check whether all Struct.*.requiredOps are in the OS
      * check if it is an expected op (otherwise wait for it)
      * check if was deleted, apply a delete operation after op was applied
    */},{key:"apply",value:function apply(ops){this.opsReceivedTimestamp=new Date();for(var i=0;i<ops.length;i++){var o=ops[i];if(o.id==null||o.id[0]!==this.y.connector.userId){var required=Y.Struct[o.struct].requiredOps(o);if(o.requires!=null){required=required.concat(o.requires);}this.whenOperationsExist(required,o);}}}/*
      op is executed as soon as every operation requested is available.
      Note that Transaction can (and should) buffer requests.
    */},{key:"whenOperationsExist",value:function whenOperationsExist(ids,op){if(ids.length>0){var listener={op:op,missing:ids.length};for(var i=0;i<ids.length;i++){var id=ids[i];var sid=JSON.stringify(id);var l=this.listenersById[sid];if(l==null){l=[];this.listenersById[sid]=l;}l.push(listener);}}else{this.listenersByIdExecuteNow.push({op:op});}if(this.listenersByIdRequestPending){return;}this.listenersByIdRequestPending=true;var store=this;this.requestTransaction(regeneratorRuntime.mark(function _callee17(){var exeNow,ls,key,o,sid,l,id,op,_i2,_listener,_o2;return regeneratorRuntime.wrap(function _callee17$(_context35){while(1){switch(_context35.prev=_context35.next){case 0:exeNow=store.listenersByIdExecuteNow;store.listenersByIdExecuteNow=[];ls=store.listenersById;store.listenersById={};store.listenersByIdRequestPending=false;key=0;case 6:if(!(key<exeNow.length)){_context35.next=12;break;}o=exeNow[key].op;return _context35.delegateYield(store.tryExecute.call(this,o),"t0",9);case 9:key++;_context35.next=6;break;case 12:_context35.t1=regeneratorRuntime.keys(ls);case 13:if((_context35.t2=_context35.t1()).done){_context35.next=39;break;}sid=_context35.t2.value;l=ls[sid];id=JSON.parse(sid);if(!(typeof id[1]==='string')){_context35.next=22;break;}return _context35.delegateYield(this.getOperation(id),"t3",19);case 19:op=_context35.t3;_context35.next=24;break;case 22:return _context35.delegateYield(this.getInsertion(id),"t4",23);case 23:op=_context35.t4;case 24:if(!(op==null)){_context35.next=28;break;}store.listenersById[sid]=l;_context35.next=37;break;case 28:_i2=0;case 29:if(!(_i2<l.length)){_context35.next=37;break;}_listener=l[_i2];_o2=_listener.op;if(!(--_listener.missing===0)){_context35.next=34;break;}return _context35.delegateYield(store.tryExecute.call(this,_o2),"t5",34);case 34:_i2++;_context35.next=29;break;case 37:_context35.next=13;break;case 39:case"end":return _context35.stop();}}},_callee17,this);}));}/*
      Actually execute an operation, when all expected operations are available.
    *//* :: // TODO: this belongs somehow to transaction
    store: Object;
    getOperation: any;
    isGarbageCollected: any;
    addOperation: any;
    whenOperationsExist: any;
    */},{key:"tryExecute",value:regeneratorRuntime.mark(function tryExecute(op){var defined,overlapSize,opid,isGarbageCollected;return regeneratorRuntime.wrap(function tryExecute$(_context36){while(1){switch(_context36.prev=_context36.next){case 0:this.store.addToDebug('yield* this.store.tryExecute.call(this, ',JSON.stringify(op),')');if(!(op.struct==='Delete')){_context36.next=5;break;}return _context36.delegateYield(Y.Struct.Delete.execute.call(this,op),"t0",3);case 3:_context36.next=32;break;case 5:return _context36.delegateYield(this.getInsertion(op.id),"t1",6);case 6:defined=_context36.t1;case 7:if(!(defined!=null&&defined.content!=null)){_context36.next=21;break;}if(!(defined.id[1]+defined.content.length<op.id[1]+op.content.length)){_context36.next=18;break;}overlapSize=defined.content.length-(op.id[1]-defined.id[1]);op.content.splice(0,overlapSize);op.id=[op.id[0],op.id[1]+overlapSize];op.left=Y.utils.getLastId(defined);op.origin=op.left;return _context36.delegateYield(this.getOperation(op.id),"t2",15);case 15:defined=_context36.t2;_context36.next=19;break;case 18:return _context36.abrupt("break",21);case 19:_context36.next=7;break;case 21:if(!(defined==null)){_context36.next=32;break;}opid=op.id;return _context36.delegateYield(this.isGarbageCollected(opid),"t3",24);case 24:isGarbageCollected=_context36.t3;if(isGarbageCollected){_context36.next=32;break;}return _context36.delegateYield(Y.Struct[op.struct].execute.call(this,op),"t4",27);case 27:return _context36.delegateYield(this.addOperation(op),"t5",28);case 28:return _context36.delegateYield(this.store.operationAdded(this,op),"t6",29);case 29:return _context36.delegateYield(this.getOperation(opid),"t7",30);case 30:op=_context36.t7;return _context36.delegateYield(this.tryCombineWithLeft(op),"t8",32);case 32:case"end":return _context36.stop();}}},tryExecute,this);})/*
     * Called by a transaction when an operation is added.
     * This function is especially important for y-indexeddb, where several instances may share a single database.
     * Every time an operation is created by one instance, it is send to all other instances and operationAdded is called
     *
     * If it's not a Delete operation:
     *   * Checks if another operation is executable (listenersById)
     *   * Update state, if possible
     *
     * Always:
     *   * Call type
     */},{key:"operationAdded",value:regeneratorRuntime.mark(function operationAdded(transaction,op){var type,opLen,i,sid,l,key,listener,t,parentIsDeleted,o,len,startId,_i3,id,opIsDeleted,delop;return regeneratorRuntime.wrap(function operationAdded$(_context37){while(1){switch(_context37.prev=_context37.next){case 0:if(!(op.struct==='Delete')){_context37.next=6;break;}type=this.initializedTypes[JSON.stringify(op.targetParent)];if(!(type!=null)){_context37.next=4;break;}return _context37.delegateYield(type._changed(transaction,op),"t0",4);case 4:_context37.next=33;break;case 6:return _context37.delegateYield(transaction.updateState(op.id[0]),"t1",7);case 7:opLen=op.content!=null?op.content.length:1;for(i=0;i<opLen;i++){// notify whenOperation listeners (by id)
sid=JSON.stringify([op.id[0],op.id[1]+i]);l=this.listenersById[sid];delete this.listenersById[sid];if(l!=null){for(key in l){listener=l[key];if(--listener.missing===0){this.whenOperationsExist([],listener.op);}}}}t=this.initializedTypes[JSON.stringify(op.parent)];// if parent is deleted, mark as gc'd and return
if(!(op.parent!=null)){_context37.next=16;break;}return _context37.delegateYield(transaction.isDeleted(op.parent),"t2",12);case 12:parentIsDeleted=_context37.t2;if(!parentIsDeleted){_context37.next=16;break;}return _context37.delegateYield(transaction.deleteList(op.id),"t3",15);case 15:return _context37.abrupt("return");case 16:if(!(t!=null)){_context37.next=19;break;}o=Y.utils.copyOperation(op);return _context37.delegateYield(t._changed(transaction,o),"t4",19);case 19:if(op.deleted){_context37.next=33;break;}// Delete if DS says this is actually deleted
len=op.content!=null?op.content.length:1;startId=op.id;// You must not use op.id in the following loop, because op will change when deleted
// TODO: !! console.log('TODO: change this before commiting')
_i3=0;case 23:if(!(_i3<len)){_context37.next=33;break;}id=[startId[0],startId[1]+_i3];return _context37.delegateYield(transaction.isDeleted(id),"t5",26);case 26:opIsDeleted=_context37.t5;if(!opIsDeleted){_context37.next=30;break;}delop={struct:'Delete',target:id};return _context37.delegateYield(this.tryExecute.call(transaction,delop),"t6",30);case 30:_i3++;_context37.next=23;break;case 33:case"end":return _context37.stop();}}},operationAdded,this);})},{key:"whenTransactionsFinished",value:function whenTransactionsFinished(){if(this.transactionInProgress){if(this.transactionsFinished==null){var resolve;var promise=new Promise(function(r){resolve=r;});this.transactionsFinished={resolve:resolve,promise:promise};}return this.transactionsFinished.promise;}else{return Promise.resolve();}}// Check if there is another transaction request.
// * the last transaction is always a flush :)
},{key:"getNextRequest",value:function getNextRequest(){if(this.waitingTransactions.length===0){if(this.transactionIsFlushed){this.transactionInProgress=false;this.transactionIsFlushed=false;if(this.transactionsFinished!=null){this.transactionsFinished.resolve();this.transactionsFinished=null;}return null;}else{this.transactionIsFlushed=true;return regeneratorRuntime.mark(function _callee18(){return regeneratorRuntime.wrap(function _callee18$(_context38){while(1){switch(_context38.prev=_context38.next){case 0:return _context38.delegateYield(this.flush(),"t0",1);case 1:case"end":return _context38.stop();}}},_callee18,this);});}}else{this.transactionIsFlushed=false;return this.waitingTransactions.shift();}}},{key:"requestTransaction",value:function requestTransaction(makeGen/* :any */,callImmediately){var _this12=this;this.waitingTransactions.push(makeGen);if(!this.transactionInProgress){this.transactionInProgress=true;setTimeout(function(){_this12.transact(_this12.getNextRequest());},0);}}/*
      Get a created/initialized type.
    */},{key:"getType",value:function getType(id){return this.initializedTypes[JSON.stringify(id)];}/*
      Init type. This is called when a remote operation is retrieved, and transformed to a type
      TODO: delete type from store.initializedTypes[id] when corresponding id was deleted!
    */},{key:"initType",value:regeneratorRuntime.mark(function initType(id,args){var sid,t,op;return regeneratorRuntime.wrap(function initType$(_context39){while(1){switch(_context39.prev=_context39.next){case 0:sid=JSON.stringify(id);t=this.store.initializedTypes[sid];if(!(t==null)){_context39.next=9;break;}return _context39.delegateYield(this.getOperation(id),"t0",4);case 4:op/* :MapStruct | ListStruct */=_context39.t0;if(!(op!=null)){_context39.next=9;break;}return _context39.delegateYield(Y[op.type].typeDefinition.initType.call(this,this.store,op,args),"t1",7);case 7:t=_context39.t1;this.store.initializedTypes[sid]=t;case 9:return _context39.abrupt("return",t);case 10:case"end":return _context39.stop();}}},initType,this);})/*
     Create type. This is called when the local user creates a type (which is a synchronous action)
    */},{key:"createType",value:function createType(typedefinition,id){var structname=typedefinition[0].struct;id=id||this.getNextOpId(1);var op=Y.Struct[structname].create(id);op.type=typedefinition[0].name;this.requestTransaction(regeneratorRuntime.mark(function _callee19(){return regeneratorRuntime.wrap(function _callee19$(_context40){while(1){switch(_context40.prev=_context40.next){case 0:if(!(op.id[0]==='_')){_context40.next=4;break;}return _context40.delegateYield(this.setOperation(op),"t0",2);case 2:_context40.next=5;break;case 4:return _context40.delegateYield(this.applyCreatedOperations([op]),"t1",5);case 5:case"end":return _context40.stop();}}},_callee19,this);}));var t=Y[op.type].typeDefinition.createType(this,op,typedefinition[1]);this.initializedTypes[JSON.stringify(op.id)]=t;return t;}}]);return AbstractDatabase;}();Y.AbstractDatabase=AbstractDatabase;};},{}],397:[function(require,module,exports){/* @flow */'use strict';/*
 An operation also defines the structure of a type. This is why operation and
 structure are used interchangeably here.

 It must be of the type Object. I hope to achieve some performance
 improvements when working on databases that support the json format.

 An operation must have the following properties:

 * encode
     - Encode the structure in a readable format (preferably string- todo)
 * decode (todo)
     - decode structure to json
 * execute
     - Execute the semantics of an operation.
 * requiredOps
     - Operations that are required to execute this operation.
*/module.exports=function(Y/* :any */){var Struct={/* This is the only operation that is actually not a structure, because
    it is not stored in the OS. This is why it _does not_ have an id

    op = {
      target: Id
    }
    */Delete:{encode:function encode(op){return{target:op.target,length:op.length||0,struct:'Delete'};},requiredOps:function requiredOps(op){return[];// [op.target]
},execute:regeneratorRuntime.mark(function execute(op){return regeneratorRuntime.wrap(function execute$(_context41){while(1){switch(_context41.prev=_context41.next){case 0:return _context41.delegateYield(this.deleteOperation(op.target,op.length||1),"t0",1);case 1:return _context41.abrupt("return",_context41.t0);case 2:case"end":return _context41.stop();}}},execute,this);})},Insert:{/* {
          content: [any],
          opContent: Id,
          id: Id,
          left: Id,
          origin: Id,
          right: Id,
          parent: Id,
          parentSub: string (optional), // child of Map type
        }
      */encode:function encode(op/* :Insertion */)/* :Insertion */{// TODO: you could not send the "left" property, then you also have to
// "op.left = null" in $execute or $decode
var e/* :any */={id:op.id,left:op.left,right:op.right,origin:op.origin,parent:op.parent,struct:op.struct};if(op.parentSub!=null){e.parentSub=op.parentSub;}if(op.hasOwnProperty('opContent')){e.opContent=op.opContent;}else{e.content=op.content.slice();}return e;},requiredOps:function requiredOps(op){var ids=[];if(op.left!=null){ids.push(op.left);}if(op.right!=null){ids.push(op.right);}if(op.origin!=null&&!Y.utils.compareIds(op.left,op.origin)){ids.push(op.origin);}// if (op.right == null && op.left == null) {
ids.push(op.parent);if(op.opContent!=null){ids.push(op.opContent);}return ids;},getDistanceToOrigin:regeneratorRuntime.mark(function getDistanceToOrigin(op){var d,o;return regeneratorRuntime.wrap(function getDistanceToOrigin$(_context42){while(1){switch(_context42.prev=_context42.next){case 0:if(!(op.left==null)){_context42.next=4;break;}return _context42.abrupt("return",0);case 4:d=0;return _context42.delegateYield(this.getInsertion(op.left),"t0",6);case 6:o=_context42.t0;case 7:if(Y.utils.matchesId(o,op.origin)){_context42.next=17;break;}d++;if(!(o.left==null)){_context42.next=13;break;}return _context42.abrupt("break",17);case 13:return _context42.delegateYield(this.getInsertion(o.left),"t1",14);case 14:o=_context42.t1;case 15:_context42.next=7;break;case 17:return _context42.abrupt("return",d);case 18:case"end":return _context42.stop();}}},getDistanceToOrigin,this);}),/*
      # $this has to find a unique position between origin and the next known character
      # case 1: $origin equals $o.origin: the $creator parameter decides if left or right
      #         let $OL= [o1,o2,o3,o4], whereby $this is to be inserted between o1 and o4
      #         o2,o3 and o4 origin is 1 (the position of o2)
      #         there is the case that $this.creator < o2.creator, but o3.creator < $this.creator
      #         then o2 knows o3. Since on another client $OL could be [o1,o3,o4] the problem is complex
      #         therefore $this would be always to the right of o3
      # case 2: $origin < $o.origin
      #         if current $this insert_position > $o origin: $this ins
      #         else $insert_position will not change
      #         (maybe we encounter case 1 later, then this will be to the right of $o)
      # case 3: $origin > $o.origin
      #         $this insert_position is to the left of $o (forever!)
      */execute:regeneratorRuntime.mark(function execute(op){var i,tryToRemergeLater,origin,distanceToOrigin,o,parent,start,startId,oOriginDistance,left,right,m;return regeneratorRuntime.wrap(function execute$(_context43){while(1){switch(_context43.prev=_context43.next){case 0:// loop counter
// during this function some ops may get split into two pieces (e.g. with getInsertionCleanEnd)
// We try to merge them later, if possible
tryToRemergeLater=[];if(!(op.origin!=null)){_context43.next=8;break;}return _context43.delegateYield(this.getInsertionCleanEnd(op.origin),"t0",3);case 3:origin=_context43.t0;if(origin.originOf==null){origin.originOf=[];}origin.originOf.push(op.id);return _context43.delegateYield(this.setOperation(origin),"t1",7);case 7:if(origin.right!=null){tryToRemergeLater.push(origin.right);}case 8:return _context43.delegateYield(Struct.Insert.getDistanceToOrigin.call(this,op),"t2",9);case 9:distanceToOrigin=i=_context43.t2;if(!(op.left!=null)){_context43.next=23;break;}return _context43.delegateYield(this.getInsertionCleanEnd(op.left),"t3",12);case 12:o=_context43.t3;if(!Y.utils.compareIds(op.left,op.origin)&&o.right!=null){// only if not added previously
tryToRemergeLater.push(o.right);}if(!(o.right==null)){_context43.next=18;break;}_context43.t4=null;_context43.next=20;break;case 18:return _context43.delegateYield(this.getOperation(o.right),"t5",19);case 19:_context43.t4=_context43.t5;case 20:o=_context43.t4;_context43.next=34;break;case 23:return _context43.delegateYield(this.getOperation(op.parent),"t6",24);case 24:parent=_context43.t6;startId=op.parentSub?parent.map[op.parentSub]:parent.start;if(!(startId==null)){_context43.next=30;break;}_context43.t7=null;_context43.next=32;break;case 30:return _context43.delegateYield(this.getOperation(startId),"t8",31);case 31:_context43.t7=_context43.t8;case 32:start=_context43.t7;o=start;case 34:if(!(op.right!=null)){_context43.next=37;break;}tryToRemergeLater.push(op.right);return _context43.delegateYield(this.getInsertionCleanStart(op.right),"t9",37);case 37:if(!true){_context43.next=62;break;}if(!(o!=null&&!Y.utils.compareIds(o.id,op.right))){_context43.next=59;break;}return _context43.delegateYield(Struct.Insert.getDistanceToOrigin.call(this,o),"t10",40);case 40:oOriginDistance=_context43.t10;if(!(oOriginDistance===i)){_context43.next=45;break;}// case 1
if(o.id[0]<op.id[0]){op.left=Y.utils.getLastId(o);distanceToOrigin=i+1;// just ignore o.content.length, doesn't make a difference
}_context43.next=50;break;case 45:if(!(oOriginDistance<i)){_context43.next=49;break;}// case 2
if(i-distanceToOrigin<=oOriginDistance){op.left=Y.utils.getLastId(o);distanceToOrigin=i+1;// just ignore o.content.length, doesn't make a difference
}_context43.next=50;break;case 49:return _context43.abrupt("break",62);case 50:i++;if(!(o.right!=null)){_context43.next=56;break;}return _context43.delegateYield(this.getInsertion(o.right),"t11",53);case 53:o=_context43.t11;_context43.next=57;break;case 56:o=null;case 57:_context43.next=60;break;case 59:return _context43.abrupt("break",62);case 60:_context43.next=37;break;case 62:// reconnect..
left=null;right=null;if(!(parent==null)){_context43.next=67;break;}return _context43.delegateYield(this.getOperation(op.parent),"t12",66);case 66:parent=_context43.t12;case 67:if(!(op.left!=null)){_context43.next=75;break;}return _context43.delegateYield(this.getInsertion(op.left),"t13",69);case 69:left=_context43.t13;// link left
op.right=left.right;left.right=op.id;return _context43.delegateYield(this.setOperation(left),"t14",73);case 73:_context43.next=76;break;case 75:// set op.right from parent, if necessary
op.right=op.parentSub?parent.map[op.parentSub]||null:parent.start;case 76:if(!(op.right!=null)){_context43.next=86;break;}return _context43.delegateYield(this.getOperation(op.right),"t15",78);case 78:right=_context43.t15;right.left=Y.utils.getLastId(op);// if right exists, and it is supposed to be gc'd. Remove it from the gc
if(!(right.gc!=null)){_context43.next=85;break;}if(!(right.content!=null&&right.content.length>1)){_context43.next=84;break;}return _context43.delegateYield(this.getInsertionCleanEnd(right.id),"t16",83);case 83:right=_context43.t16;case 84:this.store.removeFromGarbageCollector(right);case 85:return _context43.delegateYield(this.setOperation(right),"t17",86);case 86:if(!(op.parentSub!=null)){_context43.next=96;break;}if(!(left==null)){_context43.next=90;break;}parent.map[op.parentSub]=op.id;return _context43.delegateYield(this.setOperation(parent),"t18",90);case 90:if(!(op.right!=null)){_context43.next=92;break;}return _context43.delegateYield(this.deleteOperation(op.right,1,true),"t19",92);case 92:if(!(op.left!=null)){_context43.next=94;break;}return _context43.delegateYield(this.deleteOperation(op.id,1,true),"t20",94);case 94:_context43.next=100;break;case 96:if(!(right==null||left==null)){_context43.next=100;break;}if(right==null){parent.end=Y.utils.getLastId(op);}if(left==null){parent.start=op.id;}return _context43.delegateYield(this.setOperation(parent),"t21",100);case 100:i=0;case 101:if(!(i<tryToRemergeLater.length)){_context43.next=108;break;}return _context43.delegateYield(this.getOperation(tryToRemergeLater[i]),"t22",103);case 103:m=_context43.t22;return _context43.delegateYield(this.tryCombineWithLeft(m),"t23",105);case 105:i++;_context43.next=101;break;case 108:case"end":return _context43.stop();}}},execute,this);})},List:{/*
      {
        start: null,
        end: null,
        struct: "List",
        type: "",
        id: this.os.getNextOpId(1)
      }
      */create:function create(id){return{start:null,end:null,struct:'List',id:id};},encode:function encode(op){var e={struct:'List',id:op.id,type:op.type};if(op.requires!=null){e.requires=op.requires;}if(op.info!=null){e.info=op.info;}return e;},requiredOps:function requiredOps(){/*
        var ids = []
        if (op.start != null) {
          ids.push(op.start)
        }
        if (op.end != null){
          ids.push(op.end)
        }
        return ids
        */return[];},execute:regeneratorRuntime.mark(function execute(op){return regeneratorRuntime.wrap(function execute$(_context44){while(1){switch(_context44.prev=_context44.next){case 0:op.start=null;op.end=null;case 2:case"end":return _context44.stop();}}},execute,this);}),ref:regeneratorRuntime.mark(function ref(op,pos){var res,o;return regeneratorRuntime.wrap(function ref$(_context45){while(1){switch(_context45.prev=_context45.next){case 0:if(!(op.start==null)){_context45.next=2;break;}return _context45.abrupt("return",null);case 2:res=null;return _context45.delegateYield(this.getOperation(op.start),"t0",4);case 4:o=_context45.t0;case 5:if(!true){_context45.next=15;break;}if(!o.deleted){res=o;pos--;}if(!(pos>=0&&o.right!=null)){_context45.next=12;break;}return _context45.delegateYield(this.getOperation(o.right),"t1",9);case 9:o=_context45.t1;_context45.next=13;break;case 12:return _context45.abrupt("break",15);case 13:_context45.next=5;break;case 15:return _context45.abrupt("return",res);case 16:case"end":return _context45.stop();}}},ref,this);}),map:regeneratorRuntime.mark(function map(o,f){var res,operation;return regeneratorRuntime.wrap(function map$(_context46){while(1){switch(_context46.prev=_context46.next){case 0:o=o.start;res=[];case 2:if(!(o!=null)){_context46.next=9;break;}return _context46.delegateYield(this.getOperation(o),"t0",4);case 4:operation=_context46.t0;if(!operation.deleted){res.push(f(operation));}o=operation.right;_context46.next=2;break;case 9:return _context46.abrupt("return",res);case 10:case"end":return _context46.stop();}}},map,this);})},Map:{/*
        {
          map: {},
          struct: "Map",
          type: "",
          id: this.os.getNextOpId(1)
        }
      */create:function create(id){return{id:id,map:{},struct:'Map'};},encode:function encode(op){var e={struct:'Map',type:op.type,id:op.id,map:{}// overwrite map!!
};if(op.requires!=null){e.requires=op.requires;}if(op.info!=null){e.info=op.info;}return e;},requiredOps:function requiredOps(){return[];},execute:regeneratorRuntime.mark(function execute(){return regeneratorRuntime.wrap(function execute$(_context47){while(1){switch(_context47.prev=_context47.next){case 0:case"end":return _context47.stop();}}},execute,this);}),/*
        Get a property by name
      */get:regeneratorRuntime.mark(function get(op,name){var oid,res;return regeneratorRuntime.wrap(function get$(_context48){while(1){switch(_context48.prev=_context48.next){case 0:oid=op.map[name];if(!(oid!=null)){_context48.next=14;break;}return _context48.delegateYield(this.getOperation(oid),"t0",3);case 3:res=_context48.t0;if(!(res==null||res.deleted)){_context48.next=8;break;}return _context48.abrupt("return",void 0);case 8:if(!(res.opContent==null)){_context48.next=12;break;}return _context48.abrupt("return",res.content[0]);case 12:return _context48.delegateYield(this.getType(res.opContent),"t1",13);case 13:return _context48.abrupt("return",_context48.t1);case 14:case"end":return _context48.stop();}}},get,this);})}};Y.Struct=Struct;};},{}],398:[function(require,module,exports){/* @flow */'use strict';/*
  Partial definition of a transaction

  A transaction provides all the the async functionality on a database.

  By convention, a transaction has the following properties:
  * ss for StateSet
  * os for OperationStore
  * ds for DeleteStore

  A transaction must also define the following methods:
  * checkDeleteStoreForState(state)
    - When increasing the state of a user, an operation with an higher id
      may already be garbage collected, and therefore it will never be received.
      update the state to reflect this knowledge. This won't call a method to save the state!
  * getDeleteSet(id)
    - Get the delete set in a readable format:
      {
        "userX": [
          [5,1], // starting from position 5, one operations is deleted
          [9,4]  // starting from position 9, four operations are deleted
        ],
        "userY": ...
      }
  * getOpsFromDeleteSet(ds) -- TODO: just call this.deleteOperation(id) here
    - get a set of deletions that need to be applied in order to get to
      achieve the state of the supplied ds
  * setOperation(op)
    - write `op` to the database.
      Note: this is allowed to return an in-memory object.
      E.g. the Memory adapter returns the object that it has in-memory.
      Changing values on this object will be stored directly in the database
      without calling this function. Therefore,
      setOperation may have no functionality in some adapters. This also has
      implications on the way we use operations that were served from the database.
      We try not to call copyObject, if not necessary.
  * addOperation(op)
    - add an operation to the database.
      This may only be called once for every op.id
      Must return a function that returns the next operation in the database (ordered by id)
  * getOperation(id)
  * removeOperation(id)
    - remove an operation from the database. This is called when an operation
      is garbage collected.
  * setState(state)
    - `state` is of the form
      {
        user: "1",
        clock: 4
      } <- meaning that we have four operations from user "1"
           (with these id's respectively: 0, 1, 2, and 3)
  * getState(user)
  * getStateVector()
    - Get the state of the OS in the form
    [{
      user: "userX",
      clock: 11
    },
     ..
    ]
  * getStateSet()
    - Get the state of the OS in the form
    {
      "userX": 11,
      "userY": 22
    }
   * getOperations(startSS)
     - Get the all the operations that are necessary in order to achive the
       stateSet of this user, starting from a stateSet supplied by another user
   * makeOperationReady(ss, op)
     - this is called only by `getOperations(startSS)`. It makes an operation
       applyable on a given SS.
*/module.exports=function(Y/* :any */){var TransactionInterface=function(){function TransactionInterface(){_classCallCheck2(this,TransactionInterface);}_createClass(TransactionInterface,[{key:"applyCreatedOperations",/* ::
    store: Y.AbstractDatabase;
    ds: Store;
    os: Store;
    ss: Store;
    *//*
      Apply operations that this user created (no remote ones!)
        * does not check for Struct.*.requiredOps()
        * also broadcasts it through the connector
    */value:regeneratorRuntime.mark(function applyCreatedOperations(ops){var send,i,op;return regeneratorRuntime.wrap(function applyCreatedOperations$(_context49){while(1){switch(_context49.prev=_context49.next){case 0:send=[];i=0;case 2:if(!(i<ops.length)){_context49.next=9;break;}op=ops[i];return _context49.delegateYield(this.store.tryExecute.call(this,op),"t0",5);case 5:if(op.id==null||typeof op.id[1]!=='string'){send.push(Y.Struct[op.struct].encode(op));}case 6:i++;_context49.next=2;break;case 9:if(this.store.y.connector.isSynced&&send.length>0){// TODO: && !this.store.forwardAppliedOperations (but then i don't send delete ops)
// is connected, and this is not going to be send in addOperation
this.store.y.connector.broadcastOps(send);}case 10:case"end":return _context49.stop();}}},applyCreatedOperations,this);})},{key:"deleteList",value:regeneratorRuntime.mark(function deleteList(start){var delLength;return regeneratorRuntime.wrap(function deleteList$(_context50){while(1){switch(_context50.prev=_context50.next){case 0:if(!(start!=null)){_context50.next=15;break;}return _context50.delegateYield(this.getOperation(start),"t0",2);case 2:start=_context50.t0;if(start.gc){_context50.next=12;break;}start.gc=true;start.deleted=true;return _context50.delegateYield(this.setOperation(start),"t1",7);case 7:delLength=start.content!=null?start.content.length:1;return _context50.delegateYield(this.markDeleted(start.id,delLength),"t2",9);case 9:if(!(start.opContent!=null)){_context50.next=11;break;}return _context50.delegateYield(this.deleteOperation(start.opContent),"t3",11);case 11:this.store.queueGarbageCollector(start.id);case 12:start=start.right;_context50.next=0;break;case 15:case"end":return _context50.stop();}}},deleteList,this);})/*
      Mark an operation as deleted, and add it to the GC, if possible.
    */},{key:"deleteOperation",value:regeneratorRuntime.mark(function deleteOperation(targetId,length,preventCallType){var callType,target,targetLength,name,i,left,right;return regeneratorRuntime.wrap(function deleteOperation$(_context51){while(1){switch(_context51.prev=_context51.next){case 0:if(length==null){length=1;}return _context51.delegateYield(this.markDeleted(targetId,length),"t0",2);case 2:if(!(length>0)){_context51.next=64;break;}callType=false;return _context51.delegateYield(this.os.findWithUpperBound([targetId[0],targetId[1]+length-1]),"t1",5);case 5:target=_context51.t1;targetLength=target!=null&&target.content!=null?target.content.length:1;if(!(target==null||target.id[0]!==targetId[0]||target.id[1]+targetLength<=targetId[1])){_context51.next=12;break;}// does not exist or is not in the range of the deletion
target=null;length=0;_context51.next=22;break;case 12:if(target.deleted){_context51.next=21;break;}if(!(target.id[1]<targetId[1])){_context51.next=17;break;}return _context51.delegateYield(this.getInsertionCleanStart(targetId),"t2",15);case 15:target=_context51.t2;targetLength=target.content.length;// must have content property!
case 17:if(!(target.id[1]+targetLength>targetId[1]+length)){_context51.next=21;break;}return _context51.delegateYield(this.getInsertionCleanEnd([targetId[0],targetId[1]+length-1]),"t3",19);case 19:target=_context51.t3;targetLength=target.content.length;case 21:length=target.id[1]-targetId[1];case 22:if(!(target!=null)){_context51.next=62;break;}if(target.deleted){_context51.next=44;break;}callType=true;// set deleted & notify type
target.deleted=true;// delete containing lists
if(!(target.start!=null)){_context51.next=28;break;}return _context51.delegateYield(this.deleteList(target.start),"t4",28);case 28:if(!(target.map!=null)){_context51.next=35;break;}_context51.t5=regeneratorRuntime.keys(target.map);case 30:if((_context51.t6=_context51.t5()).done){_context51.next=35;break;}name=_context51.t6.value;return _context51.delegateYield(this.deleteList(target.map[name]),"t7",33);case 33:_context51.next=30;break;case 35:if(!(target.opContent!=null)){_context51.next=37;break;}return _context51.delegateYield(this.deleteOperation(target.opContent),"t8",37);case 37:if(!(target.requires!=null)){_context51.next=44;break;}i=0;case 39:if(!(i<target.requires.length)){_context51.next=44;break;}return _context51.delegateYield(this.deleteOperation(target.requires[i]),"t9",41);case 41:i++;_context51.next=39;break;case 44:if(!(target.left!=null)){_context51.next=49;break;}return _context51.delegateYield(this.getInsertion(target.left),"t10",46);case 46:left=_context51.t10;_context51.next=50;break;case 49:left=null;case 50:return _context51.delegateYield(this.setOperation(target),"t11",51);case 51:if(!(target.right!=null)){_context51.next=56;break;}return _context51.delegateYield(this.getOperation(target.right),"t12",53);case 53:right=_context51.t12;_context51.next=57;break;case 56:right=null;case 57:if(!(callType&&!preventCallType)){_context51.next=59;break;}return _context51.delegateYield(this.store.operationAdded(this,{struct:'Delete',target:target.id,length:targetLength,targetParent:target.parent}),"t13",59);case 59:return _context51.delegateYield(this.store.addToGarbageCollector.call(this,target,left),"t14",60);case 60:if(!(right!=null)){_context51.next=62;break;}return _context51.delegateYield(this.store.addToGarbageCollector.call(this,right,target),"t15",62);case 62:_context51.next=2;break;case 64:case"end":return _context51.stop();}}},deleteOperation,this);})/*
      Mark an operation as deleted&gc'd
    */},{key:"markGarbageCollected",value:regeneratorRuntime.mark(function markGarbageCollected(id,len){var n,newlen,prev,next;return regeneratorRuntime.wrap(function markGarbageCollected$(_context52){while(1){switch(_context52.prev=_context52.next){case 0:// this.mem.push(["gc", id]);
this.store.addToDebug('yield* this.markGarbageCollected(',id,', ',len,')');return _context52.delegateYield(this.markDeleted(id,len),"t0",2);case 2:n=_context52.t0;if(!(n.id[1]<id[1]&&!n.gc)){_context52.next=9;break;}// un-extend left
newlen=n.len-(id[1]-n.id[1]);n.len-=newlen;return _context52.delegateYield(this.ds.put(n),"t1",7);case 7:n={id:id,len:newlen,gc:false};return _context52.delegateYield(this.ds.put(n),"t2",9);case 9:return _context52.delegateYield(this.ds.findPrev(id),"t3",10);case 10:prev=_context52.t3;return _context52.delegateYield(this.ds.findNext(id),"t4",12);case 12:next=_context52.t4;if(!(id[1]+len<n.id[1]+n.len&&!n.gc)){_context52.next=16;break;}return _context52.delegateYield(this.ds.put({id:[id[0],id[1]+len],len:n.len-len,gc:false}),"t5",15);case 15:n.len=len;case 16:// set gc'd
n.gc=true;// can extend left?
if(!(prev!=null&&prev.gc&&Y.utils.compareIds([prev.id[0],prev.id[1]+prev.len],n.id))){_context52.next=21;break;}prev.len+=n.len;return _context52.delegateYield(this.ds.delete(n.id),"t6",20);case 20:n=prev;// ds.put n here?
case 21:if(!(next!=null&&next.gc&&Y.utils.compareIds([n.id[0],n.id[1]+n.len],next.id))){_context52.next=24;break;}n.len+=next.len;return _context52.delegateYield(this.ds.delete(next.id),"t7",24);case 24:return _context52.delegateYield(this.ds.put(n),"t8",25);case 25:return _context52.delegateYield(this.updateState(n.id[0]),"t9",26);case 26:case"end":return _context52.stop();}}},markGarbageCollected,this);})/*
      Mark an operation as deleted.

      returns the delete node
    */},{key:"markDeleted",value:regeneratorRuntime.mark(function markDeleted(id,length){var n,diff,next,_next;return regeneratorRuntime.wrap(function markDeleted$(_context53){while(1){switch(_context53.prev=_context53.next){case 0:if(length==null){length=1;}// this.mem.push(["del", id]);
return _context53.delegateYield(this.ds.findWithUpperBound(id),"t0",2);case 2:n=_context53.t0;if(!(n!=null&&n.id[0]===id[0])){_context53.next=27;break;}if(!(n.id[1]<=id[1]&&id[1]<=n.id[1]+n.len)){_context53.next=23;break;}// id is in n's range
diff=id[1]+length-(n.id[1]+n.len);// overlapping right
if(!(diff>0)){_context53.next=20;break;}if(n.gc){_context53.next=11;break;}n.len+=diff;_context53.next=18;break;case 11:diff=n.id[1]+n.len-id[1];// overlapping left (id till n.end)
if(!(diff<length)){_context53.next=17;break;}// a partial deletion
n={id:[id[0],id[1]+diff],len:length-diff,gc:false};return _context53.delegateYield(this.ds.put(n),"t1",15);case 15:_context53.next=18;break;case 17:throw new Error('Cannot happen! (it dit though.. :()');case 18:_context53.next=21;break;case 20:return _context53.abrupt("return",n);case 21:_context53.next=25;break;case 23:// cannot extend left (there is no left!)
n={id:id,len:length,gc:false};return _context53.delegateYield(this.ds.put(n),"t2",25);case 25:_context53.next=29;break;case 27:// cannot extend left
n={id:id,len:length,gc:false};return _context53.delegateYield(this.ds.put(n),"t3",29);case 29:return _context53.delegateYield(this.ds.findNext(n.id),"t4",30);case 30:next=_context53.t4;if(!(next!=null&&n.id[0]===next.id[0]&&n.id[1]+n.len>=next.id[1])){_context53.next=61;break;}diff=n.id[1]+n.len-next.id[1];// from next.start to n.end
case 33:if(!(diff>=0)){_context53.next=61;break;}if(!next.gc){_context53.next=44;break;}// gc is stronger, so reduce length of n
n.len-=diff;if(!(diff>=next.len)){_context53.next=41;break;}// delete the missing range after next
diff=diff-next.len;// missing range after next
if(!(diff>0)){_context53.next=41;break;}return _context53.delegateYield(this.ds.put(n),"t5",40);case 40:return _context53.delegateYield(this.markDeleted([next.id[0],next.id[1]+next.len],diff),"t6",41);case 41:return _context53.abrupt("break",61);case 44:if(!(diff>next.len)){_context53.next=56;break;}return _context53.delegateYield(this.ds.findNext(next.id),"t7",46);case 46:_next=_context53.t7;return _context53.delegateYield(this.ds.delete(next.id),"t8",48);case 48:if(!(_next==null||n.id[0]!==_next.id[0])){_context53.next=52;break;}return _context53.abrupt("break",61);case 52:next=_next;diff=n.id[1]+n.len-next.id[1];// from next.start to n.end
// continue!
case 54:_context53.next=59;break;case 56:// n just partially overlaps with next. extend n, delete next, and break this loop
n.len+=next.len-diff;return _context53.delegateYield(this.ds.delete(next.id),"t9",58);case 58:return _context53.abrupt("break",61);case 59:_context53.next=33;break;case 61:return _context53.delegateYield(this.ds.put(n),"t10",62);case 62:return _context53.abrupt("return",n);case 63:case"end":return _context53.stop();}}},markDeleted,this);})/*
      Call this method when the client is connected&synced with the
      other clients (e.g. master). This will query the database for
      operations that can be gc'd and add them to the garbage collector.
    */},{key:"garbageCollectAfterSync",value:regeneratorRuntime.mark(function garbageCollectAfterSync(){return regeneratorRuntime.wrap(function garbageCollectAfterSync$(_context55){while(1){switch(_context55.prev=_context55.next){case 0:if(this.store.gc1.length>0||this.store.gc2.length>0){console.warn('gc should be empty after sync');}if(this.store.gc){_context55.next=3;break;}return _context55.abrupt("return");case 3:return _context55.delegateYield(this.os.iterate(this,null,null,regeneratorRuntime.mark(function _callee20(op){var parentDeleted,i,left;return regeneratorRuntime.wrap(function _callee20$(_context54){while(1){switch(_context54.prev=_context54.next){case 0:if(!op.gc){_context54.next=3;break;}delete op.gc;return _context54.delegateYield(this.setOperation(op),"t0",3);case 3:if(!(op.parent!=null)){_context54.next=23;break;}return _context54.delegateYield(this.isDeleted(op.parent),"t1",5);case 5:parentDeleted=_context54.t1;if(!parentDeleted){_context54.next=23;break;}op.gc=true;if(op.deleted){_context54.next=20;break;}return _context54.delegateYield(this.markDeleted(op.id,op.content!=null?op.content.length:1),"t2",10);case 10:op.deleted=true;if(!(op.opContent!=null)){_context54.next=13;break;}return _context54.delegateYield(this.deleteOperation(op.opContent),"t3",13);case 13:if(!(op.requires!=null)){_context54.next=20;break;}i=0;case 15:if(!(i<op.requires.length)){_context54.next=20;break;}return _context54.delegateYield(this.deleteOperation(op.requires[i]),"t4",17);case 17:i++;_context54.next=15;break;case 20:return _context54.delegateYield(this.setOperation(op),"t5",21);case 21:this.store.gc1.push(op.id);// this is ok becaues its shortly before sync (otherwise use queueGarbageCollector!)
return _context54.abrupt("return");case 23:if(!op.deleted){_context54.next=29;break;}left=null;if(!(op.left!=null)){_context54.next=28;break;}return _context54.delegateYield(this.getInsertion(op.left),"t6",27);case 27:left=_context54.t6;case 28:return _context54.delegateYield(this.store.addToGarbageCollector.call(this,op,left),"t7",29);case 29:case"end":return _context54.stop();}}},_callee20,this);})),"t0",4);case 4:case"end":return _context55.stop();}}},garbageCollectAfterSync,this);})/*
      Really remove an op and all its effects.
      The complicated case here is the Insert operation:
      * reset left
      * reset right
      * reset parent.start
      * reset parent.end
      * reset origins of all right ops
    */},{key:"garbageCollectOperation",value:regeneratorRuntime.mark(function garbageCollectOperation(id){var o,deps,i,dep,left,right,neworigin,neworigin_,_i,originsIn,origin,parent,setParent;return regeneratorRuntime.wrap(function garbageCollectOperation$(_context56){while(1){switch(_context56.prev=_context56.next){case 0:this.store.addToDebug('yield* this.garbageCollectOperation(',id,')');return _context56.delegateYield(this.getOperation(id),"t0",2);case 2:o=_context56.t0;return _context56.delegateYield(this.markGarbageCollected(id,o!=null&&o.content!=null?o.content.length:1),"t1",4);case 4:if(!(o!=null)){_context56.next=74;break;}deps=[];if(o.opContent!=null){deps.push(o.opContent);}if(o.requires!=null){deps=deps.concat(o.requires);}i=0;case 9:if(!(i<deps.length)){_context56.next=26;break;}return _context56.delegateYield(this.getOperation(deps[i]),"t2",11);case 11:dep=_context56.t2;if(!(dep!=null)){_context56.next=22;break;}if(dep.deleted){_context56.next=17;break;}return _context56.delegateYield(this.deleteOperation(dep.id),"t3",15);case 15:return _context56.delegateYield(this.getOperation(dep.id),"t4",16);case 16:dep=_context56.t4;case 17:dep.gc=true;return _context56.delegateYield(this.setOperation(dep),"t5",19);case 19:this.store.queueGarbageCollector(dep.id);_context56.next=23;break;case 22:return _context56.delegateYield(this.markGarbageCollected(deps[i],1),"t6",23);case 23:i++;_context56.next=9;break;case 26:if(!(o.left!=null)){_context56.next=31;break;}return _context56.delegateYield(this.getInsertion(o.left),"t7",28);case 28:left=_context56.t7;left.right=o.right;return _context56.delegateYield(this.setOperation(left),"t8",31);case 31:if(!(o.right!=null)){_context56.next=60;break;}return _context56.delegateYield(this.getOperation(o.right),"t9",33);case 33:right=_context56.t9;right.left=o.left;return _context56.delegateYield(this.setOperation(right),"t10",36);case 36:if(!(o.originOf!=null&&o.originOf.length>0)){_context56.next=60;break;}// find new origin of right ops
// origin is the first left deleted operation
neworigin=o.left;neworigin_=null;case 39:if(!(neworigin!=null)){_context56.next=47;break;}return _context56.delegateYield(this.getInsertion(neworigin),"t11",41);case 41:neworigin_=_context56.t11;if(!neworigin_.deleted){_context56.next=44;break;}return _context56.abrupt("break",47);case 44:neworigin=neworigin_.left;_context56.next=39;break;case 47:_context56.t12=regeneratorRuntime.keys(o.originOf);case 48:if((_context56.t13=_context56.t12()).done){_context56.next=57;break;}_i=_context56.t13.value;return _context56.delegateYield(this.getOperation(o.originOf[_i]),"t14",51);case 51:originsIn=_context56.t14;if(!(originsIn!=null)){_context56.next=55;break;}originsIn.origin=neworigin;return _context56.delegateYield(this.setOperation(originsIn),"t15",55);case 55:_context56.next=48;break;case 57:if(!(neworigin!=null)){_context56.next=60;break;}if(neworigin_.originOf==null){neworigin_.originOf=o.originOf;}else{neworigin_.originOf=o.originOf.concat(neworigin_.originOf);}return _context56.delegateYield(this.setOperation(neworigin_),"t16",60);case 60:if(!(o.origin!=null)){_context56.next=65;break;}return _context56.delegateYield(this.getInsertion(o.origin),"t17",62);case 62:origin=_context56.t17;origin.originOf=origin.originOf.filter(function(_id){return!Y.utils.compareIds(id,_id);});return _context56.delegateYield(this.setOperation(origin),"t18",65);case 65:if(!(o.parent!=null)){_context56.next=68;break;}return _context56.delegateYield(this.getOperation(o.parent),"t19",67);case 67:parent=_context56.t19;case 68:if(!(parent!=null)){_context56.next=73;break;}setParent=false;// whether to save parent to the os
if(o.parentSub!=null){if(Y.utils.compareIds(parent.map[o.parentSub],o.id)){setParent=true;if(o.right!=null){parent.map[o.parentSub]=o.right;}else{delete parent.map[o.parentSub];}}}else{if(Y.utils.compareIds(parent.start,o.id)){// gc'd op is the start
setParent=true;parent.start=o.right;}if(Y.utils.matchesId(o,parent.end)){// gc'd op is the end
setParent=true;parent.end=o.left;}}if(!setParent){_context56.next=73;break;}return _context56.delegateYield(this.setOperation(parent),"t20",73);case 73:return _context56.delegateYield(this.removeOperation(o.id),"t21",74);case 74:case"end":return _context56.stop();}}},garbageCollectOperation,this);})},{key:"checkDeleteStoreForState",value:regeneratorRuntime.mark(function checkDeleteStoreForState(state){var n;return regeneratorRuntime.wrap(function checkDeleteStoreForState$(_context57){while(1){switch(_context57.prev=_context57.next){case 0:return _context57.delegateYield(this.ds.findWithUpperBound([state.user,state.clock]),"t0",1);case 1:n=_context57.t0;if(n!=null&&n.id[0]===state.user&&n.gc){state.clock=Math.max(state.clock,n.id[1]+n.len);}case 3:case"end":return _context57.stop();}}},checkDeleteStoreForState,this);})},{key:"updateState",value:regeneratorRuntime.mark(function updateState(user){var state,o,oLength;return regeneratorRuntime.wrap(function updateState$(_context58){while(1){switch(_context58.prev=_context58.next){case 0:return _context58.delegateYield(this.getState(user),"t0",1);case 1:state=_context58.t0;return _context58.delegateYield(this.checkDeleteStoreForState(state),"t1",3);case 3:return _context58.delegateYield(this.getInsertion([user,state.clock]),"t2",4);case 4:o=_context58.t2;oLength=o!=null&&o.content!=null?o.content.length:1;case 6:if(!(o!=null&&user===o.id[0]&&o.id[1]<=state.clock&&o.id[1]+oLength>state.clock)){_context58.next=14;break;}// either its a new operation (1. case), or it is an operation that was deleted, but is not yet in the OS
state.clock+=oLength;return _context58.delegateYield(this.checkDeleteStoreForState(state),"t3",9);case 9:return _context58.delegateYield(this.os.findNext(o.id),"t4",10);case 10:o=_context58.t4;oLength=o!=null&&o.content!=null?o.content.length:1;_context58.next=6;break;case 14:return _context58.delegateYield(this.setState(state),"t5",15);case 15:case"end":return _context58.stop();}}},updateState,this);})/*
      apply a delete set in order to get
      the state of the supplied ds
    */},{key:"applyDeleteSet",value:regeneratorRuntime.mark(function applyDeleteSet(ds){var deletions,user,dv,pos,d,i,del,counter,o,oLen,ops;return regeneratorRuntime.wrap(function applyDeleteSet$(_context60){while(1){switch(_context60.prev=_context60.next){case 0:deletions=[];_context60.t0=regeneratorRuntime.keys(ds);case 2:if((_context60.t1=_context60.t0()).done){_context60.next=11;break;}user=_context60.t1.value;dv=ds[user];pos=0;d=dv[pos];return _context60.delegateYield(this.ds.iterate(this,[user,0],[user,Number.MAX_VALUE],regeneratorRuntime.mark(function _callee21(n){var diff;return regeneratorRuntime.wrap(function _callee21$(_context59){while(1){switch(_context59.prev=_context59.next){case 0:if(!(d!=null)){_context59.next=10;break;}diff=0;// describe the diff of length in 1) and 2)
if(!(n.id[1]+n.len<=d[0])){_context59.next=6;break;}return _context59.abrupt("break",10);case 6:if(d[0]<n.id[1]){// 2)
// delete maximum the len of d
// else delete as much as possible
diff=Math.min(n.id[1]-d[0],d[1]);deletions.push([user,d[0],diff,d[2]]);}else{// 3)
diff=n.id[1]+n.len-d[0];// never null (see 1)
if(d[2]&&!n.gc){// d marks as gc'd but n does not
// then delete either way
deletions.push([user,d[0],Math.min(diff,d[1]),d[2]]);}}case 7:if(d[1]<=diff){// d doesn't delete anything anymore
d=dv[++pos];}else{d[0]=d[0]+diff;// reset pos
d[1]=d[1]-diff;// reset length
}_context59.next=0;break;case 10:case"end":return _context59.stop();}}},_callee21,this);})),"t2",8);case 8:// for the rest.. just apply it
for(;pos<dv.length;pos++){d=dv[pos];deletions.push([user,d[0],d[1],d[2]]);}_context60.next=2;break;case 11:i=0;case 12:if(!(i<deletions.length)){_context60.next=40;break;}del=deletions[i];// always try to delete..
return _context60.delegateYield(this.deleteOperation([del[0],del[1]],del[2]),"t3",15);case 15:if(!del[3]){_context60.next=36;break;}return _context60.delegateYield(this.markGarbageCollected([del[0],del[1]],del[2]),"t4",17);case 17:// always mark gc'd
// remove operation..
counter=del[1]+del[2];case 18:if(!(counter>=del[1])){_context60.next=36;break;}return _context60.delegateYield(this.os.findWithUpperBound([del[0],counter-1]),"t5",20);case 20:o=_context60.t5;if(!(o==null)){_context60.next=23;break;}return _context60.abrupt("break",36);case 23:oLen=o.content!=null?o.content.length:1;if(!(o.id[0]!==del[0]||o.id[1]+oLen<=del[1])){_context60.next=26;break;}return _context60.abrupt("break",36);case 26:if(!(o.id[1]+oLen>del[1]+del[2])){_context60.next=29;break;}return _context60.delegateYield(this.getInsertionCleanEnd([del[0],del[1]+del[2]-1]),"t6",28);case 28:o=_context60.t6;case 29:if(!(o.id[1]<del[1])){_context60.next=32;break;}return _context60.delegateYield(this.getInsertionCleanStart([del[0],del[1]]),"t7",31);case 31:o=_context60.t7;case 32:counter=o.id[1];return _context60.delegateYield(this.garbageCollectOperation(o.id),"t8",34);case 34:_context60.next=18;break;case 36:if(this.store.forwardAppliedOperations){ops=[];ops.push({struct:'Delete',target:[del[0],del[1]],length:del[2]});this.store.y.connector.broadcastOps(ops);}case 37:i++;_context60.next=12;break;case 40:case"end":return _context60.stop();}}},applyDeleteSet,this);})},{key:"isGarbageCollected",value:regeneratorRuntime.mark(function isGarbageCollected(id){var n;return regeneratorRuntime.wrap(function isGarbageCollected$(_context61){while(1){switch(_context61.prev=_context61.next){case 0:return _context61.delegateYield(this.ds.findWithUpperBound(id),"t0",1);case 1:n=_context61.t0;return _context61.abrupt("return",n!=null&&n.id[0]===id[0]&&id[1]<n.id[1]+n.len&&n.gc);case 3:case"end":return _context61.stop();}}},isGarbageCollected,this);})/*
      A DeleteSet (ds) describes all the deleted ops in the OS
    */},{key:"getDeleteSet",value:regeneratorRuntime.mark(function getDeleteSet(){var ds;return regeneratorRuntime.wrap(function getDeleteSet$(_context63){while(1){switch(_context63.prev=_context63.next){case 0:ds={};return _context63.delegateYield(this.ds.iterate(this,null,null,regeneratorRuntime.mark(function _callee22(n){var user,counter,len,gc,dv;return regeneratorRuntime.wrap(function _callee22$(_context62){while(1){switch(_context62.prev=_context62.next){case 0:user=n.id[0];counter=n.id[1];len=n.len;gc=n.gc;dv=ds[user];if(dv===void 0){dv=[];ds[user]=dv;}dv.push([counter,len,gc]);case 7:case"end":return _context62.stop();}}},_callee22,this);})),"t0",2);case 2:return _context63.abrupt("return",ds);case 3:case"end":return _context63.stop();}}},getDeleteSet,this);})},{key:"isDeleted",value:regeneratorRuntime.mark(function isDeleted(id){var n;return regeneratorRuntime.wrap(function isDeleted$(_context64){while(1){switch(_context64.prev=_context64.next){case 0:return _context64.delegateYield(this.ds.findWithUpperBound(id),"t0",1);case 1:n=_context64.t0;return _context64.abrupt("return",n!=null&&n.id[0]===id[0]&&id[1]<n.id[1]+n.len);case 3:case"end":return _context64.stop();}}},isDeleted,this);})},{key:"setOperation",value:regeneratorRuntime.mark(function setOperation(op){return regeneratorRuntime.wrap(function setOperation$(_context65){while(1){switch(_context65.prev=_context65.next){case 0:return _context65.delegateYield(this.os.put(op),"t0",1);case 1:return _context65.abrupt("return",op);case 2:case"end":return _context65.stop();}}},setOperation,this);})},{key:"addOperation",value:regeneratorRuntime.mark(function addOperation(op){return regeneratorRuntime.wrap(function addOperation$(_context66){while(1){switch(_context66.prev=_context66.next){case 0:return _context66.delegateYield(this.os.put(op),"t0",1);case 1:if(this.store.y.connector.isSynced&&this.store.forwardAppliedOperations&&typeof op.id[1]!=='string'){// is connected, and this is not going to be send in addOperation
this.store.y.connector.broadcastOps([op]);}case 2:case"end":return _context66.stop();}}},addOperation,this);})// if insertion, try to combine with left insertion (if both have content property)
},{key:"tryCombineWithLeft",value:regeneratorRuntime.mark(function tryCombineWithLeft(op){var left;return regeneratorRuntime.wrap(function tryCombineWithLeft$(_context67){while(1){switch(_context67.prev=_context67.next){case 0:if(!(op!=null&&op.left!=null&&op.content!=null&&op.left[0]===op.id[0]&&Y.utils.compareIds(op.left,op.origin))){_context67.next=9;break;}return _context67.delegateYield(this.getInsertion(op.left),"t0",2);case 2:left=_context67.t0;if(!(left.content!=null&&left.id[1]+left.content.length===op.id[1]&&left.originOf.length===1&&!left.gc&&!left.deleted&&!op.gc&&!op.deleted)){_context67.next=9;break;}// combine!
if(op.originOf!=null){left.originOf=op.originOf;}else{delete left.originOf;}left.content=left.content.concat(op.content);left.right=op.right;return _context67.delegateYield(this.os.delete(op.id),"t1",8);case 8:return _context67.delegateYield(this.setOperation(left),"t2",9);case 9:case"end":return _context67.stop();}}},tryCombineWithLeft,this);})},{key:"getInsertion",value:regeneratorRuntime.mark(function getInsertion(id){var ins,len;return regeneratorRuntime.wrap(function getInsertion$(_context68){while(1){switch(_context68.prev=_context68.next){case 0:return _context68.delegateYield(this.os.findWithUpperBound(id),"t0",1);case 1:ins=_context68.t0;if(!(ins==null)){_context68.next=6;break;}return _context68.abrupt("return",null);case 6:len=ins.content!=null?ins.content.length:1;// in case of opContent
if(!(id[0]===ins.id[0]&&id[1]<ins.id[1]+len)){_context68.next=11;break;}return _context68.abrupt("return",ins);case 11:return _context68.abrupt("return",null);case 12:case"end":return _context68.stop();}}},getInsertion,this);})},{key:"getInsertionCleanStartEnd",value:regeneratorRuntime.mark(function getInsertionCleanStartEnd(id){return regeneratorRuntime.wrap(function getInsertionCleanStartEnd$(_context69){while(1){switch(_context69.prev=_context69.next){case 0:return _context69.delegateYield(this.getInsertionCleanStart(id),"t0",1);case 1:return _context69.delegateYield(this.getInsertionCleanEnd(id),"t1",2);case 2:return _context69.abrupt("return",_context69.t1);case 3:case"end":return _context69.stop();}}},getInsertionCleanStartEnd,this);})// Return an insertion such that id is the first element of content
// This function manipulates an operation, if necessary
},{key:"getInsertionCleanStart",value:regeneratorRuntime.mark(function getInsertionCleanStart(id){var ins,left,leftLid;return regeneratorRuntime.wrap(function getInsertionCleanStart$(_context70){while(1){switch(_context70.prev=_context70.next){case 0:return _context70.delegateYield(this.getInsertion(id),"t0",1);case 1:ins=_context70.t0;if(!(ins!=null)){_context70.next=21;break;}if(!(ins.id[1]===id[1])){_context70.next=7;break;}return _context70.abrupt("return",ins);case 7:left=Y.utils.copyObject(ins);ins.content=left.content.splice(id[1]-ins.id[1]);ins.id=id;leftLid=Y.utils.getLastId(left);ins.origin=leftLid;left.originOf=[ins.id];left.right=ins.id;ins.left=leftLid;// debugger // check
return _context70.delegateYield(this.setOperation(left),"t1",16);case 16:return _context70.delegateYield(this.setOperation(ins),"t2",17);case 17:if(left.gc){this.store.queueGarbageCollector(ins.id);}return _context70.abrupt("return",ins);case 19:_context70.next=22;break;case 21:return _context70.abrupt("return",null);case 22:case"end":return _context70.stop();}}},getInsertionCleanStart,this);})// Return an insertion such that id is the last element of content
// This function manipulates an operation, if necessary
},{key:"getInsertionCleanEnd",value:regeneratorRuntime.mark(function getInsertionCleanEnd(id){var ins,right,insLid;return regeneratorRuntime.wrap(function getInsertionCleanEnd$(_context71){while(1){switch(_context71.prev=_context71.next){case 0:return _context71.delegateYield(this.getInsertion(id),"t0",1);case 1:ins=_context71.t0;if(!(ins!=null)){_context71.next=21;break;}if(!(ins.content==null||ins.id[1]+ins.content.length-1===id[1])){_context71.next=7;break;}return _context71.abrupt("return",ins);case 7:right=Y.utils.copyObject(ins);right.content=ins.content.splice(id[1]-ins.id[1]+1);// cut off remainder
right.id=[id[0],id[1]+1];insLid=Y.utils.getLastId(ins);right.origin=insLid;ins.originOf=[right.id];ins.right=right.id;right.left=insLid;// debugger // check
return _context71.delegateYield(this.setOperation(right),"t1",16);case 16:return _context71.delegateYield(this.setOperation(ins),"t2",17);case 17:if(ins.gc){this.store.queueGarbageCollector(right.id);}return _context71.abrupt("return",ins);case 19:_context71.next=22;break;case 21:return _context71.abrupt("return",null);case 22:case"end":return _context71.stop();}}},getInsertionCleanEnd,this);})},{key:"getOperation",value:regeneratorRuntime.mark(function getOperation(id/* :any */){var o,comp,struct,op;return regeneratorRuntime.wrap(function getOperation$(_context72){while(1){switch(_context72.prev=_context72.next){case 0:return _context72.delegateYield(this.os.find(id),"t0",1);case 1:o=_context72.t0;if(!(id[0]!=='_'||o!=null)){_context72.next=6;break;}return _context72.abrupt("return",o);case 6:// type is string
// generate this operation?
comp=id[1].split('_');if(!(comp.length>1)){_context72.next=15;break;}struct=comp[0];op=Y.Struct[struct].create(id);op.type=comp[1];return _context72.delegateYield(this.setOperation(op),"t1",12);case 12:return _context72.abrupt("return",op);case 15:// won't be called. but just in case..
console.error('Unexpected case. How can this happen?');debugger;// eslint-disable-line
return _context72.abrupt("return",null);case 18:case"end":return _context72.stop();}}},getOperation,this);})},{key:"removeOperation",value:regeneratorRuntime.mark(function removeOperation(id){return regeneratorRuntime.wrap(function removeOperation$(_context73){while(1){switch(_context73.prev=_context73.next){case 0:return _context73.delegateYield(this.os.delete(id),"t0",1);case 1:case"end":return _context73.stop();}}},removeOperation,this);})},{key:"setState",value:regeneratorRuntime.mark(function setState(state){var val;return regeneratorRuntime.wrap(function setState$(_context74){while(1){switch(_context74.prev=_context74.next){case 0:val={id:[state.user],clock:state.clock};return _context74.delegateYield(this.ss.put(val),"t0",2);case 2:case"end":return _context74.stop();}}},setState,this);})},{key:"getState",value:regeneratorRuntime.mark(function getState(user){var n,clock;return regeneratorRuntime.wrap(function getState$(_context75){while(1){switch(_context75.prev=_context75.next){case 0:return _context75.delegateYield(this.ss.find([user]),"t0",1);case 1:n=_context75.t0;clock=n==null?null:n.clock;if(clock==null){clock=0;}return _context75.abrupt("return",{user:user,clock:clock});case 5:case"end":return _context75.stop();}}},getState,this);})},{key:"getStateVector",value:regeneratorRuntime.mark(function getStateVector(){var stateVector;return regeneratorRuntime.wrap(function getStateVector$(_context77){while(1){switch(_context77.prev=_context77.next){case 0:stateVector=[];return _context77.delegateYield(this.ss.iterate(this,null,null,regeneratorRuntime.mark(function _callee23(n){return regeneratorRuntime.wrap(function _callee23$(_context76){while(1){switch(_context76.prev=_context76.next){case 0:stateVector.push({user:n.id[0],clock:n.clock});case 1:case"end":return _context76.stop();}}},_callee23,this);})),"t0",2);case 2:return _context77.abrupt("return",stateVector);case 3:case"end":return _context77.stop();}}},getStateVector,this);})},{key:"getStateSet",value:regeneratorRuntime.mark(function getStateSet(){var ss;return regeneratorRuntime.wrap(function getStateSet$(_context79){while(1){switch(_context79.prev=_context79.next){case 0:ss={};return _context79.delegateYield(this.ss.iterate(this,null,null,regeneratorRuntime.mark(function _callee24(n){return regeneratorRuntime.wrap(function _callee24$(_context78){while(1){switch(_context78.prev=_context78.next){case 0:ss[n.id[0]]=n.clock;case 1:case"end":return _context78.stop();}}},_callee24,this);})),"t0",2);case 2:return _context79.abrupt("return",ss);case 3:case"end":return _context79.stop();}}},getStateSet,this);})/*
      Here, we make all missing operations executable for the receiving user.

      Notes:
        startSS: denotes to the SV that the remote user sent
        currSS:  denotes to the state vector that the user should have if he
                 applies all already sent operations (increases is each step)

      We face several problems:
      * Execute op as is won't work because ops depend on each other
       -> find a way so that they do not anymore
      * When changing left, must not go more to the left than the origin
      * When changing right, you have to consider that other ops may have op
        as their origin, this means that you must not set one of these ops
        as the new right (interdependencies of ops)
      * can't just go to the right until you find the first known operation,
        With currSS
          -> interdependency of ops is a problem
        With startSS
          -> leads to inconsistencies when two users join at the same time.
             Then the position depends on the order of execution -> error!

        Solution:
        -> re-create originial situation
          -> set op.left = op.origin (which never changes)
          -> set op.right
               to the first operation that is known (according to startSS)
               or to the first operation that has an origin that is not to the
               right of op.
          -> Enforces unique execution order -> happy user

        Improvements: TODO
          * Could set left to origin, or the first known operation
            (startSS or currSS.. ?)
            -> Could be necessary when I turn GC again.
            -> Is a bad(ish) idea because it requires more computation

      What we do:
      * Iterate over all missing operations.
      * When there is an operation, where the right op is known, send this op all missing ops to the left to the user
      * I explained above what we have to do with each operation. Here is how we do it efficiently:
        1. Go to the left until you find either op.origin, or a known operation (let o denote current operation in the iteration)
        2. Found a known operation -> set op.left = o, and send it to the user. stop
        3. Found o = op.origin -> set op.left = op.origin, and send it to the user. start again from 1. (set op = o)
        4. Found some o -> set o.right = op, o.left = o.origin, send it to the user, continue
    */},{key:"getOperations",value:regeneratorRuntime.mark(function getOperations(startSS){var send,endSV,_iteratorNormalCompletion8,_didIteratorError8,_iteratorError8,_iterator8,_step8,endState,user,startPos,firstMissing;return regeneratorRuntime.wrap(function getOperations$(_context81){while(1){switch(_context81.prev=_context81.next){case 0:// TODO: use bounds here!
if(startSS==null){startSS={};}send=[];return _context81.delegateYield(this.getStateVector(),"t0",3);case 3:endSV=_context81.t0;_iteratorNormalCompletion8=true;_didIteratorError8=false;_iteratorError8=undefined;_context81.prev=7;_iterator8=endSV[Symbol.iterator]();case 9:if(_iteratorNormalCompletion8=(_step8=_iterator8.next()).done){_context81.next=23;break;}endState=_step8.value;user=endState.user;if(!(user==='_')){_context81.next=14;break;}return _context81.abrupt("continue",20);case 14:startPos=startSS[user]||0;if(!(startPos>0)){_context81.next=19;break;}return _context81.delegateYield(this.getInsertion([user,startPos]),"t1",17);case 17:firstMissing=_context81.t1;if(firstMissing!=null){// update startPos
startPos=firstMissing.id[1];startSS[user]=startPos;}case 19:return _context81.delegateYield(this.os.iterate(this,[user,startPos],[user,Number.MAX_VALUE],regeneratorRuntime.mark(function _callee25(op){var o,missing_origins,newright,s;return regeneratorRuntime.wrap(function _callee25$(_context80){while(1){switch(_context80.prev=_context80.next){case 0:op=Y.Struct[op.struct].encode(op);if(!(op.struct!=='Insert')){_context80.next=5;break;}send.push(op);_context80.next=27;break;case 5:if(!(op.right==null||op.right[1]<(startSS[op.right[0]]||0))){_context80.next=27;break;}// case 1. op.right is known
o=op;// Remember: ?
// -> set op.right
//    1. to the first operation that is known (according to startSS)
//    2. or to the first operation that has an origin that is not to the
//      right of op.
// For this we maintain a list of ops which origins are not found yet.
missing_origins=[op];newright=op.right;case 9:if(!true){_context80.next=27;break;}if(!(o.left==null)){_context80.next=15;break;}op.left=null;send.push(op);if(!Y.utils.compareIds(o.id,op.id)){o=Y.Struct[op.struct].encode(o);o.right=missing_origins[missing_origins.length-1].id;send.push(o);}return _context80.abrupt("break",27);case 15:return _context80.delegateYield(this.getInsertion(o.left),"t0",16);case 16:o=_context80.t0;// we set another o, check if we can reduce $missing_origins
while(missing_origins.length>0&&Y.utils.matchesId(o,missing_origins[missing_origins.length-1].origin)){missing_origins.pop();}if(!(o.id[1]<(startSS[o.id[0]]||0))){_context80.next=24;break;}// case 2. o is known
op.left=Y.utils.getLastId(o);send.push(op);return _context80.abrupt("break",27);case 24:if(Y.utils.matchesId(o,op.origin)){// case 3. o is op.origin
op.left=op.origin;send.push(op);op=Y.Struct[op.struct].encode(o);op.right=newright;if(missing_origins.length>0){console.log('This should not happen .. :( please report this');}missing_origins=[op];}else{// case 4. send o, continue to find op.origin
s=Y.Struct[op.struct].encode(o);s.right=missing_origins[missing_origins.length-1].id;s.left=s.origin;send.push(s);missing_origins.push(o);}case 25:_context80.next=9;break;case 27:case"end":return _context80.stop();}}},_callee25,this);})),"t2",20);case 20:_iteratorNormalCompletion8=true;_context81.next=9;break;case 23:_context81.next=29;break;case 25:_context81.prev=25;_context81.t3=_context81["catch"](7);_didIteratorError8=true;_iteratorError8=_context81.t3;case 29:_context81.prev=29;_context81.prev=30;if(!_iteratorNormalCompletion8&&_iterator8.return){_iterator8.return();}case 32:_context81.prev=32;if(!_didIteratorError8){_context81.next=35;break;}throw _iteratorError8;case 35:return _context81.finish(32);case 36:return _context81.finish(29);case 37:return _context81.abrupt("return",send.reverse());case 38:case"end":return _context81.stop();}}},getOperations,this,[[7,25,29,37],[30,,32,36]]);})/* this is what we used before.. use this as a reference..
    * makeOperationReady (startSS, op) {
      op = Y.Struct[op.struct].encode(op)
      op = Y.utils.copyObject(op) -- use copyoperation instead now!
      var o = op
      var ids = [op.id]
      // search for the new op.right
      // it is either the first known op (according to startSS)
      // or the o that has no origin to the right of op
      // (this is why we use the ids array)
      while (o.right != null) {
        var right = yield* this.getOperation(o.right)
        if (o.right[1] < (startSS[o.right[0]] || 0) || !ids.some(function (id) {
          return Y.utils.compareIds(id, right.origin)
        })) {
          break
        }
        ids.push(o.right)
        o = right
      }
      op.right = o.right
      op.left = op.origin
      return op
    }
    */},{key:"flush",value:regeneratorRuntime.mark(function flush(){return regeneratorRuntime.wrap(function flush$(_context82){while(1){switch(_context82.prev=_context82.next){case 0:return _context82.delegateYield(this.os.flush(),"t0",1);case 1:return _context82.delegateYield(this.ss.flush(),"t1",2);case 2:return _context82.delegateYield(this.ds.flush(),"t2",3);case 3:case"end":return _context82.stop();}}},flush,this);})}]);return TransactionInterface;}();Y.Transaction=TransactionInterface;};},{}],399:[function(require,module,exports){/* @flow */'use strict';/*
  EventHandler is an helper class for constructing custom types.

  Why: When constructing custom types, you sometimes want your types to work
  synchronous: E.g.
  ``` Synchronous
    mytype.setSomething("yay")
    mytype.getSomething() === "yay"
  ```
  versus
  ``` Asynchronous
    mytype.setSomething("yay")
    mytype.getSomething() === undefined
    mytype.waitForSomething().then(function(){
      mytype.getSomething() === "yay"
    })
  ```

  The structures usually work asynchronously (you have to wait for the
  database request to finish). EventHandler helps you to make your type
  synchronous.
*/module.exports=function(Y/* : any*/){Y.utils={};var EventListenerHandler=function(){function EventListenerHandler(){_classCallCheck2(this,EventListenerHandler);this.eventListeners=[];}_createClass(EventListenerHandler,[{key:"destroy",value:function destroy(){this.eventListeners=null;}/*
      Basic event listener boilerplate...
    */},{key:"addEventListener",value:function addEventListener(f){this.eventListeners.push(f);}},{key:"removeEventListener",value:function removeEventListener(f){this.eventListeners=this.eventListeners.filter(function(g){return f!==g;});}},{key:"removeAllEventListeners",value:function removeAllEventListeners(){this.eventListeners=[];}},{key:"callEventListeners",value:function callEventListeners(event){for(var i=0;i<this.eventListeners.length;i++){try{this.eventListeners[i](event);}catch(e){console.error('Your observer threw an error. This error was caught so that Yjs still can ensure data consistency! In order to debug this error you have to check "Pause On Caught Exceptions"',e);}}}}]);return EventListenerHandler;}();Y.utils.EventListenerHandler=EventListenerHandler;var EventHandler=function(_EventListenerHandler){_inherits(EventHandler,_EventListenerHandler);/* ::
    waiting: Array<Insertion | Deletion>;
    awaiting: number;
    onevent: Function;
    eventListeners: Array<Function>;
    *//*
      onevent: is called when the structure changes.

      Note: "awaiting opertations" is used to denote operations that were
      prematurely called. Events for received operations can not be executed until
      all prematurely called operations were executed ("waiting operations")
    */function EventHandler(onevent/* : Function */){_classCallCheck2(this,EventHandler);var _this13=_possibleConstructorReturn(this,(EventHandler.__proto__||Object.getPrototypeOf(EventHandler)).call(this));_this13.waiting=[];_this13.awaiting=0;_this13.onevent=onevent;return _this13;}_createClass(EventHandler,[{key:"destroy",value:function destroy(){_get(EventHandler.prototype.__proto__||Object.getPrototypeOf(EventHandler.prototype),"destroy",this).call(this);this.waiting=null;this.onevent=null;}/*
      Call this when a new operation arrives. It will be executed right away if
      there are no waiting operations, that you prematurely executed
    */},{key:"receivedOp",value:function receivedOp(op){if(this.awaiting<=0){this.onevent(op);}else if(op.struct==='Delete'){var self=this;var checkDelete=function checkDelete(d){if(d.length==null){throw new Error('This shouldn\'t happen! d.length must be defined!');}// we check if o deletes something in self.waiting
// if so, we remove the deleted operation
for(var w=0;w<self.waiting.length;w++){var i=self.waiting[w];if(i.struct==='Insert'&&i.id[0]===d.target[0]){var iLength=i.hasOwnProperty('content')?i.content.length:1;var dStart=d.target[1];var dEnd=d.target[1]+(d.length||1);var iStart=i.id[1];var iEnd=i.id[1]+iLength;// Check if they don't overlap
if(iEnd<=dStart||dEnd<=iStart){// no overlapping
continue;}// we check all overlapping cases. All cases:
/*
                1)  iiiii
                      ddddd
                    --> modify i and d
                2)  iiiiiii
                      ddddd
                    --> modify i, remove d
                3)  iiiiiii
                      ddd
                    --> remove d, modify i, and create another i (for the right hand side)
                4)  iiiii
                    ddddddd
                    --> remove i, modify d
                5)  iiiiiii
                    ddddddd
                    --> remove both i and d (**)
                6)  iiiiiii
                    ddddd
                    --> modify i, remove d
                7)    iii
                    ddddddd
                    --> remove i, create and apply two d with checkDelete(d) (**)
                8)    iiiii
                    ddddddd
                    --> remove i, modify d (**)
                9)    iiiii
                    ddddd
                    --> modify i and d
                (**) (also check if i contains content or type)
              */// TODO: I left some debugger statements, because I want to debug all cases once in production. REMEMBER END TODO
if(iStart<dStart){if(dStart<iEnd){if(iEnd<dEnd){// Case 1
// remove the right part of i's content
i.content.splice(dStart-iStart);// remove the start of d's deletion
d.length=dEnd-iEnd;d.target=[d.target[0],iEnd];continue;}else if(iEnd===dEnd){// Case 2
i.content.splice(dStart-iStart);// remove d, we do that by simply ending this function
return;}else{// (dEnd < iEnd)
// Case 3
var newI={id:[i.id[0],dEnd],content:i.content.slice(dEnd-iStart),struct:'Insert'};self.waiting.push(newI);i.content.splice(dStart-iStart);return;}}}else if(dStart===iStart){if(iEnd<dEnd){// Case 4
d.length=dEnd-iEnd;d.target=[d.target[0],iEnd];i.content=[];continue;}else if(iEnd===dEnd){// Case 5
self.waiting.splice(w,1);return;}else{// (dEnd < iEnd)
// Case 6
i.content=i.content.slice(dEnd-iStart);i.id=[i.id[0],dEnd];return;}}else{// (dStart < iStart)
if(iStart<dEnd){// they overlap
/*
                  7)    iii
                      ddddddd
                      --> remove i, create and apply two d with checkDelete(d) (**)
                  8)    iiiii
                      ddddddd
                      --> remove i, modify d (**)
                  9)    iiiii
                      ddddd
                      --> modify i and d
                  */if(iEnd<dEnd){// Case 7
// debugger // TODO: You did not test this case yet!!!! (add the debugger here)
self.waiting.splice(w,1);checkDelete({target:[d.target[0],dStart],length:iStart-dStart,struct:'Delete'});checkDelete({target:[d.target[0],iEnd],length:iEnd-dEnd,struct:'Delete'});return;}else if(iEnd===dEnd){// Case 8
self.waiting.splice(w,1);w--;d.length-=iLength;continue;}else{// dEnd < iEnd
// Case 9
d.length=iStart-dStart;i.content.splice(0,dEnd-iStart);i.id=[i.id[0],dEnd];continue;}}}}}// finished with remaining operations
self.waiting.push(d);};if(op.key==null){// deletes in list
checkDelete(op);}else{// deletes in map
this.waiting.push(op);}}else{this.waiting.push(op);}}/*
      You created some operations, and you want the `onevent` function to be
      called right away. Received operations will not be executed untill all
      prematurely called operations are executed
    */},{key:"awaitAndPrematurelyCall",value:function awaitAndPrematurelyCall(ops){this.awaiting++;ops.map(Y.utils.copyOperation).forEach(this.onevent);}},{key:"awaitOps",value:regeneratorRuntime.mark(function awaitOps(transaction,f,args){var notSoSmartSort,before,_i4,o,_o,left,ins,dels,i;return regeneratorRuntime.wrap(function awaitOps$(_context83){while(1){switch(_context83.prev=_context83.next){case 0:notSoSmartSort=function notSoSmartSort(array){// this function sorts insertions in a executable order
var result=[];while(array.length>0){for(var i=0;i<array.length;i++){var independent=true;for(var j=0;j<array.length;j++){if(Y.utils.matchesId(array[j],array[i].left)){// array[i] depends on array[j]
independent=false;break;}}if(independent){result.push(array.splice(i,1)[0]);i--;}}}return result;};before=this.waiting.length;// somehow create new operations
return _context83.delegateYield(f.apply(transaction,args),"t0",3);case 3:// remove all appended ops / awaited ops
this.waiting.splice(before);if(this.awaiting>0)this.awaiting--;// if there are no awaited ops anymore, we can update all waiting ops, and send execute them (if there are still no awaited ops)
if(!(this.awaiting===0&&this.waiting.length>0)){_context83.next=70;break;}_i4=0;case 7:if(!(_i4<this.waiting.length)){_context83.next=41;break;}o=this.waiting[_i4];if(!(o.struct==='Insert')){_context83.next=38;break;}return _context83.delegateYield(transaction.getInsertion(o.id),"t1",11);case 11:_o=_context83.t1;if(!(_o.parentSub!=null&&_o.left!=null)){_context83.next=17;break;}// if o is an insertion of a map struc (parentSub is defined), then it shouldn't be necessary to compute left
this.waiting.splice(_i4,1);_i4--;// update index
_context83.next=38;break;case 17:if(Y.utils.compareIds(_o.id,o.id)){_context83.next=21;break;}// o got extended
o.left=[o.id[0],o.id[1]-1];_context83.next=38;break;case 21:if(!(_o.left==null)){_context83.next=25;break;}o.left=null;_context83.next=38;break;case 25:return _context83.delegateYield(transaction.getInsertion(_o.left),"t2",26);case 26:left=_context83.t2;case 27:if(!(left.deleted!=null)){_context83.next=37;break;}if(!(left.left!=null)){_context83.next=33;break;}return _context83.delegateYield(transaction.getInsertion(left.left),"t3",30);case 30:left=_context83.t3;_context83.next=35;break;case 33:left=null;return _context83.abrupt("break",37);case 35:_context83.next=27;break;case 37:o.left=left!=null?Y.utils.getLastId(left):null;case 38:_i4++;_context83.next=7;break;case 41:// the previous stuff was async, so we have to check again!
// We also pull changes from the bindings, if there exists such a method, this could increase awaiting too
if(this._pullChanges!=null){this._pullChanges();}if(!(this.awaiting===0)){_context83.next=70;break;}// sort by type, execute inserts first
ins=[];dels=[];this.waiting.forEach(function(o){if(o.struct==='Delete'){dels.push(o);}else{ins.push(o);}});this.waiting=[];// put in executable order
ins=notSoSmartSort(ins);// this.onevent can trigger the creation of another operation
// -> check if this.awaiting increased & stop computation if it does
i=0;case 49:if(!(i<ins.length)){_context83.next=59;break;}if(!(this.awaiting===0)){_context83.next=54;break;}this.onevent(ins[i]);_context83.next=56;break;case 54:this.waiting=this.waiting.concat(ins.slice(i));return _context83.abrupt("break",59);case 56:i++;_context83.next=49;break;case 59:i=0;case 60:if(!(i<dels.length)){_context83.next=70;break;}if(!(this.awaiting===0)){_context83.next=65;break;}this.onevent(dels[i]);_context83.next=67;break;case 65:this.waiting=this.waiting.concat(dels.slice(i));return _context83.abrupt("break",70);case 67:i++;_context83.next=60;break;case 70:case"end":return _context83.stop();}}},awaitOps,this);})// TODO: Remove awaitedInserts and awaitedDeletes in favor of awaitedOps, as they are deprecated and do not always work
// Do this in one of the coming releases that are breaking anyway
/*
      Call this when you successfully awaited the execution of n Insert operations
    */},{key:"awaitedInserts",value:function awaitedInserts(n){var ops=this.waiting.splice(this.waiting.length-n);for(var oid=0;oid<ops.length;oid++){var op=ops[oid];if(op.struct==='Insert'){for(var i=this.waiting.length-1;i>=0;i--){var w=this.waiting[i];// TODO: do I handle split operations correctly here? Super unlikely, but yeah..
// Also: can this case happen? Can op be inserted in the middle of a larger op that is in $waiting?
if(w.struct==='Insert'){if(Y.utils.matchesId(w,op.left)){// include the effect of op in w
w.right=op.id;// exclude the effect of w in op
op.left=w.left;}else if(Y.utils.compareIds(w.id,op.right)){// similar..
w.left=Y.utils.getLastId(op);op.right=w.right;}}}}else{throw new Error('Expected Insert Operation!');}}this._tryCallEvents(n);}/*
      Call this when you successfully awaited the execution of n Delete operations
    */},{key:"awaitedDeletes",value:function awaitedDeletes(n,newLeft){var ops=this.waiting.splice(this.waiting.length-n);for(var j=0;j<ops.length;j++){var del=ops[j];if(del.struct==='Delete'){if(newLeft!=null){for(var i=0;i<this.waiting.length;i++){var w=this.waiting[i];// We will just care about w.left
if(w.struct==='Insert'&&Y.utils.compareIds(del.target,w.left)){w.left=newLeft;}}}}else{throw new Error('Expected Delete Operation!');}}this._tryCallEvents(n);}/* (private)
      Try to execute the events for the waiting operations
    */},{key:"_tryCallEvents",value:function _tryCallEvents(){function notSoSmartSort(array){var result=[];while(array.length>0){for(var i=0;i<array.length;i++){var independent=true;for(var j=0;j<array.length;j++){if(Y.utils.matchesId(array[j],array[i].left)){// array[i] depends on array[j]
independent=false;break;}}if(independent){result.push(array.splice(i,1)[0]);i--;}}}return result;}if(this.awaiting>0)this.awaiting--;if(this.awaiting===0&&this.waiting.length>0){var ins=[];var dels=[];this.waiting.forEach(function(o){if(o.struct==='Delete'){dels.push(o);}else{ins.push(o);}});ins=notSoSmartSort(ins);ins.forEach(this.onevent);dels.forEach(this.onevent);this.waiting=[];}}}]);return EventHandler;}(EventListenerHandler);Y.utils.EventHandler=EventHandler;/*
    Default class of custom types!
  */var CustomType=function CustomType(){_classCallCheck2(this,CustomType);};Y.utils.CustomType=CustomType;/*
    A wrapper for the definition of a custom type.
    Every custom type must have three properties:

    * struct
      - Structname of this type
    * initType
      - Given a model, creates a custom type
    * class
      - the constructor of the custom type (e.g. in order to inherit from a type)
  */var CustomTypeDefinition=// eslint-disable-line
/* ::
    struct: any;
    initType: any;
    class: Function;
    name: String;
    */function CustomTypeDefinition(def){_classCallCheck2(this,CustomTypeDefinition);if(def.struct==null||def.initType==null||def.class==null||def.name==null||def.createType==null){throw new Error('Custom type was not initialized correctly!');}this.struct=def.struct;this.initType=def.initType;this.createType=def.createType;this.class=def.class;this.name=def.name;if(def.appendAdditionalInfo!=null){this.appendAdditionalInfo=def.appendAdditionalInfo;}this.parseArguments=(def.parseArguments||function(){return[this];}).bind(this);this.parseArguments.typeDefinition=this;};Y.utils.CustomTypeDefinition=CustomTypeDefinition;Y.utils.isTypeDefinition=function isTypeDefinition(v){if(v!=null){if(v instanceof Y.utils.CustomTypeDefinition)return[v];else if(v.constructor===Array&&v[0]instanceof Y.utils.CustomTypeDefinition)return v;else if(v instanceof Function&&v.typeDefinition instanceof Y.utils.CustomTypeDefinition)return[v.typeDefinition];}return false;};/*
    Make a flat copy of an object
    (just copy properties)
  */function copyObject(o){var c={};for(var key in o){c[key]=o[key];}return c;}Y.utils.copyObject=copyObject;/*
    Copy an operation, so that it can be manipulated.
    Note: You must not change subproperties (except o.content)!
  */function copyOperation(o){o=copyObject(o);if(o.content!=null){o.content=o.content.map(function(c){return c;});}return o;}Y.utils.copyOperation=copyOperation;/*
    Defines a smaller relation on Id's
  */function smaller(a,b){return a[0]<b[0]||a[0]===b[0]&&(a[1]<b[1]||_typeof(a[1])<_typeof(b[1]));}Y.utils.smaller=smaller;function inDeletionRange(del,ins){return del.target[0]===ins[0]&&del.target[1]<=ins[1]&&ins[1]<del.target[1]+(del.length||1);}Y.utils.inDeletionRange=inDeletionRange;function compareIds(id1,id2){if(id1==null||id2==null){return id1===id2;}else{return id1[0]===id2[0]&&id1[1]===id2[1];}}Y.utils.compareIds=compareIds;function matchesId(op,id){if(id==null||op==null){return id===op;}else{if(id[0]===op.id[0]){if(op.content==null){return id[1]===op.id[1];}else{return id[1]>=op.id[1]&&id[1]<op.id[1]+op.content.length;}}}}Y.utils.matchesId=matchesId;function getLastId(op){if(op.content==null||op.content.length===1){return op.id;}else{return[op.id[0],op.id[1]+op.content.length-1];}}Y.utils.getLastId=getLastId;function createEmptyOpsArray(n){var a=new Array(n);for(var i=0;i<a.length;i++){a[i]={id:[null,null]};}return a;}function createSmallLookupBuffer(Store){/*
      This buffer implements a very small buffer that temporarily stores operations
      after they are read / before they are written.
      The buffer basically implements FIFO. Often requested lookups will be re-queued every time they are looked up / written.

      It can speed up lookups on Operation Stores and State Stores. But it does not require notable use of memory or processing power.

      Good for os and ss, bot not for ds (because it often uses methods that require a flush)

      I tried to optimize this for performance, therefore no highlevel operations.
    */var SmallLookupBuffer=function(_Store){_inherits(SmallLookupBuffer,_Store);function SmallLookupBuffer(arg1,arg2){_classCallCheck2(this,SmallLookupBuffer);var _this14=_possibleConstructorReturn(this,(SmallLookupBuffer.__proto__||Object.getPrototypeOf(SmallLookupBuffer)).call(this,arg1,arg2));// super(...arguments) -- do this when this is supported by stable nodejs
_this14.writeBuffer=createEmptyOpsArray(5);_this14.readBuffer=createEmptyOpsArray(10);return _this14;}_createClass(SmallLookupBuffer,[{key:"find",value:regeneratorRuntime.mark(function find(id,noSuperCall){var i,r,o;return regeneratorRuntime.wrap(function find$(_context84){while(1){switch(_context84.prev=_context84.next){case 0:i=this.readBuffer.length-1;case 1:if(!(i>=0)){_context84.next=10;break;}r=this.readBuffer[i];// we don't have to use compareids, because id is always defined!
if(!(r.id[1]===id[1]&&r.id[0]===id[0])){_context84.next=7;break;}// found r
// move r to the end of readBuffer
for(;i<this.readBuffer.length-1;i++){this.readBuffer[i]=this.readBuffer[i+1];}this.readBuffer[this.readBuffer.length-1]=r;return _context84.abrupt("return",r);case 7:i--;_context84.next=1;break;case 10:i=this.writeBuffer.length-1;case 11:if(!(i>=0)){_context84.next=19;break;}r=this.writeBuffer[i];if(!(r.id[1]===id[1]&&r.id[0]===id[0])){_context84.next=16;break;}o=r;return _context84.abrupt("break",19);case 16:i--;_context84.next=11;break;case 19:if(!(i<0&&noSuperCall===undefined)){_context84.next=22;break;}return _context84.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"find",this).call(this,id),"t0",21);case 21:o=_context84.t0;case 22:if(o!=null){for(i=0;i<this.readBuffer.length-1;i++){this.readBuffer[i]=this.readBuffer[i+1];}this.readBuffer[this.readBuffer.length-1]=o;}return _context84.abrupt("return",o);case 24:case"end":return _context84.stop();}}},find,this);})},{key:"put",value:regeneratorRuntime.mark(function put(o){var id,i,r,write;return regeneratorRuntime.wrap(function put$(_context85){while(1){switch(_context85.prev=_context85.next){case 0:id=o.id;i=this.writeBuffer.length-1;case 2:if(!(i>=0)){_context85.next=11;break;}r=this.writeBuffer[i];if(!(r.id[1]===id[1]&&r.id[0]===id[0])){_context85.next=8;break;}// is already in buffer
// forget r, and move o to the end of writeBuffer
for(;i<this.writeBuffer.length-1;i++){this.writeBuffer[i]=this.writeBuffer[i+1];}this.writeBuffer[this.writeBuffer.length-1]=o;return _context85.abrupt("break",11);case 8:i--;_context85.next=2;break;case 11:if(!(i<0)){_context85.next=17;break;}// did not reach break in last loop
// write writeBuffer[0]
write=this.writeBuffer[0];if(!(write.id[0]!==null)){_context85.next=15;break;}return _context85.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"put",this).call(this,write),"t0",15);case 15:// put o to the end of writeBuffer
for(i=0;i<this.writeBuffer.length-1;i++){this.writeBuffer[i]=this.writeBuffer[i+1];}this.writeBuffer[this.writeBuffer.length-1]=o;case 17:// check readBuffer for every occurence of o.id, overwrite if found
// whether found or not, we'll append o to the readbuffer
for(i=0;i<this.readBuffer.length-1;i++){r=this.readBuffer[i+1];if(r.id[1]===id[1]&&r.id[0]===id[0]){this.readBuffer[i]=o;}else{this.readBuffer[i]=r;}}this.readBuffer[this.readBuffer.length-1]=o;case 19:case"end":return _context85.stop();}}},put,this);})},{key:"delete",value:regeneratorRuntime.mark(function _delete(id){var i,r;return regeneratorRuntime.wrap(function _delete$(_context86){while(1){switch(_context86.prev=_context86.next){case 0:for(i=0;i<this.readBuffer.length;i++){r=this.readBuffer[i];if(r.id[1]===id[1]&&r.id[0]===id[0]){this.readBuffer[i]={id:[null,null]};}}return _context86.delegateYield(this.flush(),"t0",2);case 2:return _context86.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"delete",this).call(this,id),"t1",3);case 3:case"end":return _context86.stop();}}},_delete,this);})},{key:"findWithLowerBound",value:regeneratorRuntime.mark(function findWithLowerBound(id){var o,_args87=arguments;return regeneratorRuntime.wrap(function findWithLowerBound$(_context87){while(1){switch(_context87.prev=_context87.next){case 0:return _context87.delegateYield(this.find(id,true),"t0",1);case 1:o=_context87.t0;if(!(o!=null)){_context87.next=6;break;}return _context87.abrupt("return",o);case 6:return _context87.delegateYield(this.flush(),"t1",7);case 7:return _context87.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"findWithLowerBound",this).apply(this,_args87),"t2",8);case 8:return _context87.abrupt("return",_context87.t2);case 9:case"end":return _context87.stop();}}},findWithLowerBound,this);})},{key:"findWithUpperBound",value:regeneratorRuntime.mark(function findWithUpperBound(id){var o,_args88=arguments;return regeneratorRuntime.wrap(function findWithUpperBound$(_context88){while(1){switch(_context88.prev=_context88.next){case 0:return _context88.delegateYield(this.find(id,true),"t0",1);case 1:o=_context88.t0;if(!(o!=null)){_context88.next=6;break;}return _context88.abrupt("return",o);case 6:return _context88.delegateYield(this.flush(),"t1",7);case 7:return _context88.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"findWithUpperBound",this).apply(this,_args88),"t2",8);case 8:return _context88.abrupt("return",_context88.t2);case 9:case"end":return _context88.stop();}}},findWithUpperBound,this);})},{key:"findNext",value:regeneratorRuntime.mark(function findNext(){var _args89=arguments;return regeneratorRuntime.wrap(function findNext$(_context89){while(1){switch(_context89.prev=_context89.next){case 0:return _context89.delegateYield(this.flush(),"t0",1);case 1:return _context89.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"findNext",this).apply(this,_args89),"t1",2);case 2:return _context89.abrupt("return",_context89.t1);case 3:case"end":return _context89.stop();}}},findNext,this);})},{key:"findPrev",value:regeneratorRuntime.mark(function findPrev(){var _args90=arguments;return regeneratorRuntime.wrap(function findPrev$(_context90){while(1){switch(_context90.prev=_context90.next){case 0:return _context90.delegateYield(this.flush(),"t0",1);case 1:return _context90.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"findPrev",this).apply(this,_args90),"t1",2);case 2:return _context90.abrupt("return",_context90.t1);case 3:case"end":return _context90.stop();}}},findPrev,this);})},{key:"iterate",value:regeneratorRuntime.mark(function iterate(){var _args91=arguments;return regeneratorRuntime.wrap(function iterate$(_context91){while(1){switch(_context91.prev=_context91.next){case 0:return _context91.delegateYield(this.flush(),"t0",1);case 1:return _context91.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"iterate",this).apply(this,_args91),"t1",2);case 2:case"end":return _context91.stop();}}},iterate,this);})},{key:"flush",value:regeneratorRuntime.mark(function flush(){var i,write;return regeneratorRuntime.wrap(function flush$(_context92){while(1){switch(_context92.prev=_context92.next){case 0:i=0;case 1:if(!(i<this.writeBuffer.length)){_context92.next=9;break;}write=this.writeBuffer[i];if(!(write.id[0]!==null)){_context92.next=6;break;}return _context92.delegateYield(_get(SmallLookupBuffer.prototype.__proto__||Object.getPrototypeOf(SmallLookupBuffer.prototype),"put",this).call(this,write),"t0",5);case 5:this.writeBuffer[i]={id:[null,null]};case 6:i++;_context92.next=1;break;case 9:case"end":return _context92.stop();}}},flush,this);})}]);return SmallLookupBuffer;}(Store);return SmallLookupBuffer;}Y.utils.createSmallLookupBuffer=createSmallLookupBuffer;// Generates a unique id, for use as a user id.
// Thx to @jed for this script https://gist.github.com/jed/982883
function generateGuid(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateGuid);}// eslint-disable-line
Y.utils.generateGuid=generateGuid;};},{}],400:[function(require,module,exports){/* @flow */'use strict';require('./Connector.js')(Y);require('./Database.js')(Y);require('./Transaction.js')(Y);require('./Struct.js')(Y);require('./Utils.js')(Y);require('./Connectors/Test.js')(Y);Y.debug=require('debug');var requiringModules={};module.exports=Y;Y.requiringModules=requiringModules;Y.extend=function(name,value){if(arguments.length===2&&typeof name==='string'){if(value instanceof Y.utils.CustomTypeDefinition){Y[name]=value.parseArguments;}else{Y[name]=value;}if(requiringModules[name]!=null){requiringModules[name].resolve();delete requiringModules[name];}}else{for(var i=0;i<arguments.length;i++){var f=arguments[i];if(typeof f==='function'){f(Y);}else{throw new Error('Expected function!');}}}};Y.requestModules=requestModules;function requestModules(modules){var sourceDir;if(Y.sourceDir===null){sourceDir=null;}else{sourceDir=Y.sourceDir||'/bower_components';}// determine if this module was compiled for es5 or es6 (y.js vs. y.es6)
// if Insert.execute is a Function, then it isnt a generator..
// then load the es5(.js) files..
var extention=typeof regeneratorRuntime!=='undefined'?'.js':'.es6';var promises=[];for(var i=0;i<modules.length;i++){var module=modules[i].split('(')[0];var modulename='y-'+module.toLowerCase();if(Y[module]==null){if(requiringModules[module]==null){// module does not exist
if(typeof window!=='undefined'&&window.Y!=='undefined'){var imported;(function(){if(sourceDir!=null){imported=document.createElement('script');imported.src=sourceDir+'/'+modulename+'/'+modulename+extention;document.head.appendChild(imported);}var requireModule={};requiringModules[module]=requireModule;requireModule.promise=new Promise(function(resolve){requireModule.resolve=resolve;});promises.push(requireModule.promise);})();}else{console.info('YJS: Please do not depend on automatic requiring of modules anymore! Extend modules as follows `require(\'y-modulename\')(Y)`');require(modulename)(Y);}}else{promises.push(requiringModules[modules[i]].promise);}}}return Promise.all(promises);}/* ::
type MemoryOptions = {
  name: 'memory'
}
type IndexedDBOptions = {
  name: 'indexeddb',
  namespace: string
}
type DbOptions = MemoryOptions | IndexedDBOptions

type WebRTCOptions = {
  name: 'webrtc',
  room: string
}
type WebsocketsClientOptions = {
  name: 'websockets-client',
  room: string
}
type ConnectionOptions = WebRTCOptions | WebsocketsClientOptions

type YOptions = {
  connector: ConnectionOptions,
  db: DbOptions,
  types: Array<TypeName>,
  sourceDir: string,
  share: {[key: string]: TypeName}
}
*/function Y(opts/* :YOptions */)/* :Promise<YConfig> */{if(opts.hasOwnProperty('sourceDir')){Y.sourceDir=opts.sourceDir;}opts.types=opts.types!=null?opts.types:[];var modules=[opts.db.name,opts.connector.name].concat(opts.types);for(var name in opts.share){modules.push(opts.share[name]);}return new Promise(function(resolve,reject){if(opts==null)reject('An options object is expected! ');else if(opts.connector==null)reject('You must specify a connector! (missing connector property)');else if(opts.connector.name==null)reject('You must specify connector name! (missing connector.name property)');else if(opts.db==null)reject('You must specify a database! (missing db property)');else if(opts.connector.name==null)reject('You must specify db name! (missing db.name property)');else{opts=Y.utils.copyObject(opts);opts.connector=Y.utils.copyObject(opts.connector);opts.db=Y.utils.copyObject(opts.db);opts.share=Y.utils.copyObject(opts.share);setTimeout(function(){Y.requestModules(modules).then(function(){var yconfig=new YConfig(opts);yconfig.db.whenUserIdSet(function(){yconfig.init(function(){resolve(yconfig);});});}).catch(reject);},0);}});}var YConfig=function(){/* ::
  db: Y.AbstractDatabase;
  connector: Y.AbstractConnector;
  share: {[key: string]: any};
  options: Object;
  */function YConfig(opts,callback){_classCallCheck2(this,YConfig);this.options=opts;this.db=new Y[opts.db.name](this,opts.db);this.connector=new Y[opts.connector.name](this,opts.connector);this.connected=true;}_createClass(YConfig,[{key:"init",value:function init(callback){var opts=this.options;var share={};this.share=share;this.db.requestTransaction(regeneratorRuntime.mark(function requestTransaction(){var propertyname,typeConstructor,typeName,type,typedef,id,args;return regeneratorRuntime.wrap(function requestTransaction$(_context93){while(1){switch(_context93.prev=_context93.next){case 0:_context93.t0=regeneratorRuntime.keys(opts.share);case 1:if((_context93.t1=_context93.t0()).done){_context93.next=26;break;}propertyname=_context93.t1.value;typeConstructor=opts.share[propertyname].split('(');typeName=typeConstructor.splice(0,1);type=Y[typeName];typedef=type.typeDefinition;id=['_',typedef.struct+'_'+typeName+'_'+propertyname+'_'+typeConstructor];args=[];if(!(typeConstructor.length===1)){_context93.next=22;break;}_context93.prev=10;args=JSON.parse('['+typeConstructor[0].split(')')[0]+']');_context93.next=17;break;case 14:_context93.prev=14;_context93.t2=_context93["catch"](10);throw new Error('Was not able to parse type definition! (share.'+propertyname+')');case 17:if(!(type.typeDefinition.parseArguments==null)){_context93.next=21;break;}throw new Error(typeName+' does not expect arguments!');case 21:args=typedef.parseArguments(args[0])[1];case 22:return _context93.delegateYield(this.store.initType.call(this,id,args),"t3",23);case 23:share[propertyname]=_context93.t3;_context93.next=1;break;case 26:this.store.whenTransactionsFinished().then(callback);case 27:case"end":return _context93.stop();}}},requestTransaction,this,[[10,14]]);}));}},{key:"isConnected",value:function isConnected(){return this.connector.isSynced;}},{key:"disconnect",value:function disconnect(){if(this.connected){this.connected=false;return this.connector.disconnect();}else{return Promise.resolve();}}},{key:"reconnect",value:function reconnect(){if(!this.connected){this.connected=true;return this.connector.reconnect();}else{return Promise.resolve();}}},{key:"destroy",value:function destroy(){var self=this;return this.close().then(function(){if(self.db.deleteDB!=null){return self.db.deleteDB();}else{return Promise.resolve();}});}},{key:"close",value:function close(){var self=this;this.share=null;if(this.connector.destroy!=null){this.connector.destroy();}else{this.connector.disconnect();}return this.db.whenTransactionsFinished(function(){this.db.destroyTypes();// make sure to wait for all transactions before destroying the db
this.db.requestTransaction(regeneratorRuntime.mark(function _callee26(){return regeneratorRuntime.wrap(function _callee26$(_context94){while(1){switch(_context94.prev=_context94.next){case 0:return _context94.delegateYield(self.db.destroy(),"t0",1);case 1:case"end":return _context94.stop();}}},_callee26,this);}));return this.db.whenTransactionsFinished();});}}]);return YConfig;}();},{"./Connector.js":394,"./Connectors/Test.js":395,"./Database.js":396,"./Struct.js":397,"./Transaction.js":398,"./Utils.js":399,"debug":391}],401:[function(require,module,exports){/* globals window */require('babel-polyfill');var Y=require('yjs');require('y-memory')(Y);require('y-array')(Y);require('y-map')(Y);require('y-multihack')(Y);var YText=require('y-text')(Y);var EventEmitter=require('events').EventEmitter;var inherits=require('inherits');var Voice;inherits(RemoteManager,EventEmitter);function RemoteManager(opts){var self=this;opts=opts||{};Voice=opts.voice||null;opts.wrtc=opts.wrtc||null;self.roomID=opts.room||'welcome';self.hostname=opts.hostname||'https://quiet-shelf-57463.herokuapp.com';self.nickname=opts.nickname||'Guest';self.id=null;self.yfs=null;self.ySelections=null;self.posFromIndex=function(filePath,index,cb){console.warn('No "remote.posFromIndex" provided. Unable to apply change!');};self.client=null;self.voice=null;self.peers=[];self.lastSelection=null;var tokens={};self.mutualExcluse=function(key,f){if(!tokens[key]){tokens[key]=true;try{f();}catch(e){delete tokens[key];throw new Error(e);}delete tokens[key];}};self.onceReady=function(f){if(!self.yfs){self.once('ready',function(){f();});}else{f();}};Y({db:{name:'memory'},connector:{name:'multihack',// TODO: Use a custom connector
room:self.roomID,hostname:self.hostname,nickname:self.nickname,wrtc:opts.wrtc,events:function events(event,value){if(event==='id'){self.id=value.id;self.nop2p=value.nop2p;}else if(event==='client'){self.client=value;}else if(event==='voice'){if(Voice){self.voice=new Voice(value.socket,value.client,self.roomID);}}else if(event==='peers'){self.peers=value.peers;self.mustForward=value.mustForward;}else if(event==='lostPeer'){self._onLostPeer(value);}self.emit(event,value);}},share:{selections:'Array',dir_tree:'Map'}}).then(function(y){self.y=y;self.yfs=y.share.dir_tree;self.ySelections=y.share.selections;self.ySelections.observe(function(event){event.values.forEach(function(sel){if(sel.id!==self.id||!self.id){self.emit('changeSelection',self.ySelections.toArray().filter(function(sel){return sel.id!==self.id;}));}});});self.yfs.observe(function(event){var filePath=event.name;if(event.type==='add'||event.type==='update'){// create file/folder     
if(event.value instanceof Y.Text.typeDefinition.class){event.value.observe(self._onYTextAdd.bind(self,filePath));self.emit('createFile',{filePath:filePath,content:event.value.toString()});}else{self.emit('createDir',{path:filePath});}}else if(event.type==='delete'){// delete
self.emit('deleteFile',{filePath:filePath});}});self.emit('ready');});}RemoteManager.prototype.getContent=function(filePath){var self=this;return self.yfs.get(filePath).toString();};RemoteManager.prototype.createFile=function(filePath,contents){var self=this;self.onceReady(function(){self.yfs.set(filePath,Y.Text);insertChunked(self.yfs.get(filePath),0,contents||'');});};RemoteManager.prototype.createDir=function(filePath,contents){var self=this;self.onceReady(function(){self.yfs.set(filePath,'DIR');});};function insertChunked(ytext,start,str){var i=start;var CHUNK_SIZE=60000;chunkString(str,CHUNK_SIZE).forEach(function(chunk){ytext.insert(i,chunk);i+=chunk.length;});}function chunkString(str,size){var numChunks=Math.ceil(str.length/size),chunks=new Array(numChunks);for(var i=0,o=0;i<numChunks;++i,o+=size){chunks[i]=str.substr(o,size);}return chunks;}RemoteManager.prototype.replaceFile=function(oldPath,newPath){var self=this;self.onceReady(function(){self.yfs.set(newPath,self.yfs.get(oldPath));});};RemoteManager.prototype.deleteFile=function(filePath){var self=this;self.onceReady(function(){self.yfs.delete(filePath);});};RemoteManager.prototype.changeFile=function(filePath,delta){var self=this;self.onceReady(function(){self.mutualExcluse(filePath,function(){var ytext=self.yfs.get(filePath);if(!ytext){self.createFile(filePath,'');ytext=self.yfs.get(filePath);}// apply the delta to the ytext instance
var start=delta.start;// apply the delete operation first
if(delta.removed.length>0){var delLength=0;for(var j=0;j<delta.removed.length;j++){delLength+=delta.removed[j].length;}// "enter" is also a character in our case
delLength+=delta.removed.length-1;ytext.delete(start,delLength);}// apply insert operation
insertChunked(ytext,start,delta.text.join('\n'));});});};RemoteManager.prototype.changeSelection=function(data){var self=this;self.onceReady(function(){// remove our last select first
if(self.lastSelection!==null){self.ySelections.toArray().forEach(function(a,i){if(a.tracker===self.lastSelection){self.ySelections.delete(i);}});}data.id=self.id;data.tracker=Math.random();self.lastSelection=data.tracker;self.ySelections.push([data]);});};RemoteManager.prototype._onYTextAdd=function(filePath,event){var self=this;self.mutualExcluse(filePath,function(){self.posFromIndex(filePath,event.index,function(from){if(event.type==='insert'){var _self$emit;self.emit('changeFile',(_self$emit={filePath:filePath},_defineProperty(_self$emit,"filePath",filePath),_defineProperty(_self$emit,"change",{from:from,to:from,text:event.values.join('')}),_self$emit));}else if(event.type==='delete'){self.posFromIndex(filePath,event.index+event.length,function(to){var _self$emit2;self.emit('changeFile',(_self$emit2={filePath:filePath},_defineProperty(_self$emit2,"filePath",filePath),_defineProperty(_self$emit2,"change",{from:from,to:to,text:''}),_self$emit2));});}});});};RemoteManager.prototype._onLostPeer=function(peer){var self=this;self.ySelections.toArray().forEach(function(sel,i){if(sel.id===peer.id){self.ySelections.delete(i);}});};RemoteManager.prototype.destroy=function(){var self=this;self.y.connector.disconnect();self.client=null;self.voice=null;self.id=null;self.y=null;self.yfs=null;self.ySelections=null;self.posFromIndex=null;self.lastSelection=null;};module.exports=RemoteManager;},{"babel-polyfill":3,"events":407,"inherits":329,"y-array":384,"y-map":385,"y-memory":386,"y-multihack":388,"y-text":389,"yjs":400}],402:[function(require,module,exports){'use strict';exports.byteLength=byteLength;exports.toByteArray=toByteArray;exports.fromByteArray=fromByteArray;var lookup=[];var revLookup=[];var Arr=typeof Uint8Array!=='undefined'?Uint8Array:Array;var code='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';for(var i=0,len=code.length;i<len;++i){lookup[i]=code[i];revLookup[code.charCodeAt(i)]=i;}revLookup['-'.charCodeAt(0)]=62;revLookup['_'.charCodeAt(0)]=63;function placeHoldersCount(b64){var len=b64.length;if(len%4>0){throw new Error('Invalid string. Length must be a multiple of 4');}// the number of equal signs (place holders)
// if there are two placeholders, than the two characters before it
// represent one byte
// if there is only one, then the three characters before it represent 2 bytes
// this is just a cheap hack to not do indexOf twice
return b64[len-2]==='='?2:b64[len-1]==='='?1:0;}function byteLength(b64){// base64 is 4/3 + up to two characters of the original data
return b64.length*3/4-placeHoldersCount(b64);}function toByteArray(b64){var i,j,l,tmp,placeHolders,arr;var len=b64.length;placeHolders=placeHoldersCount(b64);arr=new Arr(len*3/4-placeHolders);// if there are placeholders, only get up to the last complete 4 chars
l=placeHolders>0?len-4:len;var L=0;for(i=0,j=0;i<l;i+=4,j+=3){tmp=revLookup[b64.charCodeAt(i)]<<18|revLookup[b64.charCodeAt(i+1)]<<12|revLookup[b64.charCodeAt(i+2)]<<6|revLookup[b64.charCodeAt(i+3)];arr[L++]=tmp>>16&0xFF;arr[L++]=tmp>>8&0xFF;arr[L++]=tmp&0xFF;}if(placeHolders===2){tmp=revLookup[b64.charCodeAt(i)]<<2|revLookup[b64.charCodeAt(i+1)]>>4;arr[L++]=tmp&0xFF;}else if(placeHolders===1){tmp=revLookup[b64.charCodeAt(i)]<<10|revLookup[b64.charCodeAt(i+1)]<<4|revLookup[b64.charCodeAt(i+2)]>>2;arr[L++]=tmp>>8&0xFF;arr[L++]=tmp&0xFF;}return arr;}function tripletToBase64(num){return lookup[num>>18&0x3F]+lookup[num>>12&0x3F]+lookup[num>>6&0x3F]+lookup[num&0x3F];}function encodeChunk(uint8,start,end){var tmp;var output=[];for(var i=start;i<end;i+=3){tmp=(uint8[i]<<16)+(uint8[i+1]<<8)+uint8[i+2];output.push(tripletToBase64(tmp));}return output.join('');}function fromByteArray(uint8){var tmp;var len=uint8.length;var extraBytes=len%3;// if we have 1 byte left, pad 2 bytes
var output='';var parts=[];var maxChunkLength=16383;// must be multiple of 3
// go through the array every three bytes, we'll deal with trailing stuff later
for(var i=0,len2=len-extraBytes;i<len2;i+=maxChunkLength){parts.push(encodeChunk(uint8,i,i+maxChunkLength>len2?len2:i+maxChunkLength));}// pad the end with zeros, but make sure to not forget the extra bytes
if(extraBytes===1){tmp=uint8[len-1];output+=lookup[tmp>>2];output+=lookup[tmp<<4&0x3F];output+='==';}else if(extraBytes===2){tmp=(uint8[len-2]<<8)+uint8[len-1];output+=lookup[tmp>>10];output+=lookup[tmp>>4&0x3F];output+=lookup[tmp<<2&0x3F];output+='=';}parts.push(output);return parts.join('');}},{}],403:[function(require,module,exports){},{}],404:[function(require,module,exports){arguments[4][7][0].apply(exports,arguments);},{"buffer":405,"dup":7}],405:[function(require,module,exports){(function(global){/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 *//* eslint-disable no-proto */'use strict';var base64=require('base64-js');var ieee754=require('ieee754');var isArray=require('isarray');exports.Buffer=Buffer;exports.SlowBuffer=SlowBuffer;exports.INSPECT_MAX_BYTES=50;/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */Buffer.TYPED_ARRAY_SUPPORT=global.TYPED_ARRAY_SUPPORT!==undefined?global.TYPED_ARRAY_SUPPORT:typedArraySupport();/*
 * Export kMaxLength after typed array support is determined.
 */exports.kMaxLength=kMaxLength();function typedArraySupport(){try{var arr=new Uint8Array(1);arr.__proto__={__proto__:Uint8Array.prototype,foo:function foo(){return 42;}};return arr.foo()===42&&// typed array instances can be augmented
typeof arr.subarray==='function'&&// chrome 9-10 lack `subarray`
arr.subarray(1,1).byteLength===0;// ie10 has broken `subarray`
}catch(e){return false;}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?0x7fffffff:0x3fffffff;}function createBuffer(that,length){if(kMaxLength()<length){throw new RangeError('Invalid typed array length');}if(Buffer.TYPED_ARRAY_SUPPORT){// Return an augmented `Uint8Array` instance, for best performance
that=new Uint8Array(length);that.__proto__=Buffer.prototype;}else{// Fallback: Return an object instance of the Buffer class
if(that===null){that=new Buffer(length);}that.length=length;}return that;}/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */function Buffer(arg,encodingOrOffset,length){if(!Buffer.TYPED_ARRAY_SUPPORT&&!(this instanceof Buffer)){return new Buffer(arg,encodingOrOffset,length);}// Common case.
if(typeof arg==='number'){if(typeof encodingOrOffset==='string'){throw new Error('If encoding is specified then the first argument must be a string');}return allocUnsafe(this,arg);}return from(this,arg,encodingOrOffset,length);}Buffer.poolSize=8192;// not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment=function(arr){arr.__proto__=Buffer.prototype;return arr;};function from(that,value,encodingOrOffset,length){if(typeof value==='number'){throw new TypeError('"value" argument must not be a number');}if(typeof ArrayBuffer!=='undefined'&&value instanceof ArrayBuffer){return fromArrayBuffer(that,value,encodingOrOffset,length);}if(typeof value==='string'){return fromString(that,value,encodingOrOffset);}return fromObject(that,value);}/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/Buffer.from=function(value,encodingOrOffset,length){return from(null,value,encodingOrOffset,length);};if(Buffer.TYPED_ARRAY_SUPPORT){Buffer.prototype.__proto__=Uint8Array.prototype;Buffer.__proto__=Uint8Array;if(typeof Symbol!=='undefined'&&Symbol.species&&Buffer[Symbol.species]===Buffer){// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:true});}}function assertSize(size){if(typeof size!=='number'){throw new TypeError('"size" argument must be a number');}else if(size<0){throw new RangeError('"size" argument must not be negative');}}function alloc(that,size,fill,encoding){assertSize(size);if(size<=0){return createBuffer(that,size);}if(fill!==undefined){// Only pay attention to encoding if it's a string. This
// prevents accidentally sending in a number that would
// be interpretted as a start offset.
return typeof encoding==='string'?createBuffer(that,size).fill(fill,encoding):createBuffer(that,size).fill(fill);}return createBuffer(that,size);}/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/Buffer.alloc=function(size,fill,encoding){return alloc(null,size,fill,encoding);};function allocUnsafe(that,size){assertSize(size);that=createBuffer(that,size<0?0:checked(size)|0);if(!Buffer.TYPED_ARRAY_SUPPORT){for(var i=0;i<size;++i){that[i]=0;}}return that;}/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */Buffer.allocUnsafe=function(size){return allocUnsafe(null,size);};/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */Buffer.allocUnsafeSlow=function(size){return allocUnsafe(null,size);};function fromString(that,string,encoding){if(typeof encoding!=='string'||encoding===''){encoding='utf8';}if(!Buffer.isEncoding(encoding)){throw new TypeError('"encoding" must be a valid string encoding');}var length=byteLength(string,encoding)|0;that=createBuffer(that,length);var actual=that.write(string,encoding);if(actual!==length){// Writing a hex string, for example, that contains invalid characters will
// cause everything after the first invalid character to be ignored. (e.g.
// 'abxxcd' will be treated as 'ab')
that=that.slice(0,actual);}return that;}function fromArrayLike(that,array){var length=array.length<0?0:checked(array.length)|0;that=createBuffer(that,length);for(var i=0;i<length;i+=1){that[i]=array[i]&255;}return that;}function fromArrayBuffer(that,array,byteOffset,length){array.byteLength;// this throws if `array` is not a valid ArrayBuffer
if(byteOffset<0||array.byteLength<byteOffset){throw new RangeError('\'offset\' is out of bounds');}if(array.byteLength<byteOffset+(length||0)){throw new RangeError('\'length\' is out of bounds');}if(byteOffset===undefined&&length===undefined){array=new Uint8Array(array);}else if(length===undefined){array=new Uint8Array(array,byteOffset);}else{array=new Uint8Array(array,byteOffset,length);}if(Buffer.TYPED_ARRAY_SUPPORT){// Return an augmented `Uint8Array` instance, for best performance
that=array;that.__proto__=Buffer.prototype;}else{// Fallback: Return an object instance of the Buffer class
that=fromArrayLike(that,array);}return that;}function fromObject(that,obj){if(Buffer.isBuffer(obj)){var len=checked(obj.length)|0;that=createBuffer(that,len);if(that.length===0){return that;}obj.copy(that,0,0,len);return that;}if(obj){if(typeof ArrayBuffer!=='undefined'&&obj.buffer instanceof ArrayBuffer||'length'in obj){if(typeof obj.length!=='number'||isnan(obj.length)){return createBuffer(that,0);}return fromArrayLike(that,obj);}if(obj.type==='Buffer'&&isArray(obj.data)){return fromArrayLike(that,obj.data);}}throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');}function checked(length){// Note: cannot use `length < kMaxLength()` here because that fails when
// length is NaN (which is otherwise coerced to zero.)
if(length>=kMaxLength()){throw new RangeError('Attempt to allocate Buffer larger than maximum '+'size: 0x'+kMaxLength().toString(16)+' bytes');}return length|0;}function SlowBuffer(length){if(+length!=length){// eslint-disable-line eqeqeq
length=0;}return Buffer.alloc(+length);}Buffer.isBuffer=function isBuffer(b){return!!(b!=null&&b._isBuffer);};Buffer.compare=function compare(a,b){if(!Buffer.isBuffer(a)||!Buffer.isBuffer(b)){throw new TypeError('Arguments must be Buffers');}if(a===b)return 0;var x=a.length;var y=b.length;for(var i=0,len=Math.min(x,y);i<len;++i){if(a[i]!==b[i]){x=a[i];y=b[i];break;}}if(x<y)return-1;if(y<x)return 1;return 0;};Buffer.isEncoding=function isEncoding(encoding){switch(String(encoding).toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'latin1':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return true;default:return false;}};Buffer.concat=function concat(list,length){if(!isArray(list)){throw new TypeError('"list" argument must be an Array of Buffers');}if(list.length===0){return Buffer.alloc(0);}var i;if(length===undefined){length=0;for(i=0;i<list.length;++i){length+=list[i].length;}}var buffer=Buffer.allocUnsafe(length);var pos=0;for(i=0;i<list.length;++i){var buf=list[i];if(!Buffer.isBuffer(buf)){throw new TypeError('"list" argument must be an Array of Buffers');}buf.copy(buffer,pos);pos+=buf.length;}return buffer;};function byteLength(string,encoding){if(Buffer.isBuffer(string)){return string.length;}if(typeof ArrayBuffer!=='undefined'&&typeof ArrayBuffer.isView==='function'&&(ArrayBuffer.isView(string)||string instanceof ArrayBuffer)){return string.byteLength;}if(typeof string!=='string'){string=''+string;}var len=string.length;if(len===0)return 0;// Use a for loop to avoid recursion
var loweredCase=false;for(;;){switch(encoding){case'ascii':case'latin1':case'binary':return len;case'utf8':case'utf-8':case undefined:return utf8ToBytes(string).length;case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return len*2;case'hex':return len>>>1;case'base64':return base64ToBytes(string).length;default:if(loweredCase)return utf8ToBytes(string).length;// assume utf8
encoding=(''+encoding).toLowerCase();loweredCase=true;}}}Buffer.byteLength=byteLength;function slowToString(encoding,start,end){var loweredCase=false;// No need to verify that "this.length <= MAX_UINT32" since it's a read-only
// property of a typed array.
// This behaves neither like String nor Uint8Array in that we set start/end
// to their upper/lower bounds if the value passed is out of range.
// undefined is handled specially as per ECMA-262 6th Edition,
// Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
if(start===undefined||start<0){start=0;}// Return early if start > this.length. Done here to prevent potential uint32
// coercion fail below.
if(start>this.length){return'';}if(end===undefined||end>this.length){end=this.length;}if(end<=0){return'';}// Force coersion to uint32. This will also coerce falsey/NaN values to 0.
end>>>=0;start>>>=0;if(end<=start){return'';}if(!encoding)encoding='utf8';while(true){switch(encoding){case'hex':return hexSlice(this,start,end);case'utf8':case'utf-8':return utf8Slice(this,start,end);case'ascii':return asciiSlice(this,start,end);case'latin1':case'binary':return latin1Slice(this,start,end);case'base64':return base64Slice(this,start,end);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return utf16leSlice(this,start,end);default:if(loweredCase)throw new TypeError('Unknown encoding: '+encoding);encoding=(encoding+'').toLowerCase();loweredCase=true;}}}// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer=true;function swap(b,n,m){var i=b[n];b[n]=b[m];b[m]=i;}Buffer.prototype.swap16=function swap16(){var len=this.length;if(len%2!==0){throw new RangeError('Buffer size must be a multiple of 16-bits');}for(var i=0;i<len;i+=2){swap(this,i,i+1);}return this;};Buffer.prototype.swap32=function swap32(){var len=this.length;if(len%4!==0){throw new RangeError('Buffer size must be a multiple of 32-bits');}for(var i=0;i<len;i+=4){swap(this,i,i+3);swap(this,i+1,i+2);}return this;};Buffer.prototype.swap64=function swap64(){var len=this.length;if(len%8!==0){throw new RangeError('Buffer size must be a multiple of 64-bits');}for(var i=0;i<len;i+=8){swap(this,i,i+7);swap(this,i+1,i+6);swap(this,i+2,i+5);swap(this,i+3,i+4);}return this;};Buffer.prototype.toString=function toString(){var length=this.length|0;if(length===0)return'';if(arguments.length===0)return utf8Slice(this,0,length);return slowToString.apply(this,arguments);};Buffer.prototype.equals=function equals(b){if(!Buffer.isBuffer(b))throw new TypeError('Argument must be a Buffer');if(this===b)return true;return Buffer.compare(this,b)===0;};Buffer.prototype.inspect=function inspect(){var str='';var max=exports.INSPECT_MAX_BYTES;if(this.length>0){str=this.toString('hex',0,max).match(/.{2}/g).join(' ');if(this.length>max)str+=' ... ';}return'<Buffer '+str+'>';};Buffer.prototype.compare=function compare(target,start,end,thisStart,thisEnd){if(!Buffer.isBuffer(target)){throw new TypeError('Argument must be a Buffer');}if(start===undefined){start=0;}if(end===undefined){end=target?target.length:0;}if(thisStart===undefined){thisStart=0;}if(thisEnd===undefined){thisEnd=this.length;}if(start<0||end>target.length||thisStart<0||thisEnd>this.length){throw new RangeError('out of range index');}if(thisStart>=thisEnd&&start>=end){return 0;}if(thisStart>=thisEnd){return-1;}if(start>=end){return 1;}start>>>=0;end>>>=0;thisStart>>>=0;thisEnd>>>=0;if(this===target)return 0;var x=thisEnd-thisStart;var y=end-start;var len=Math.min(x,y);var thisCopy=this.slice(thisStart,thisEnd);var targetCopy=target.slice(start,end);for(var i=0;i<len;++i){if(thisCopy[i]!==targetCopy[i]){x=thisCopy[i];y=targetCopy[i];break;}}if(x<y)return-1;if(y<x)return 1;return 0;};// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer,val,byteOffset,encoding,dir){// Empty buffer means no match
if(buffer.length===0)return-1;// Normalize byteOffset
if(typeof byteOffset==='string'){encoding=byteOffset;byteOffset=0;}else if(byteOffset>0x7fffffff){byteOffset=0x7fffffff;}else if(byteOffset<-0x80000000){byteOffset=-0x80000000;}byteOffset=+byteOffset;// Coerce to Number.
if(isNaN(byteOffset)){// byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
byteOffset=dir?0:buffer.length-1;}// Normalize byteOffset: negative offsets start from the end of the buffer
if(byteOffset<0)byteOffset=buffer.length+byteOffset;if(byteOffset>=buffer.length){if(dir)return-1;else byteOffset=buffer.length-1;}else if(byteOffset<0){if(dir)byteOffset=0;else return-1;}// Normalize val
if(typeof val==='string'){val=Buffer.from(val,encoding);}// Finally, search either indexOf (if dir is true) or lastIndexOf
if(Buffer.isBuffer(val)){// Special case: looking for empty string/buffer always fails
if(val.length===0){return-1;}return arrayIndexOf(buffer,val,byteOffset,encoding,dir);}else if(typeof val==='number'){val=val&0xFF;// Search for a byte value [0-255]
if(Buffer.TYPED_ARRAY_SUPPORT&&typeof Uint8Array.prototype.indexOf==='function'){if(dir){return Uint8Array.prototype.indexOf.call(buffer,val,byteOffset);}else{return Uint8Array.prototype.lastIndexOf.call(buffer,val,byteOffset);}}return arrayIndexOf(buffer,[val],byteOffset,encoding,dir);}throw new TypeError('val must be string, number or Buffer');}function arrayIndexOf(arr,val,byteOffset,encoding,dir){var indexSize=1;var arrLength=arr.length;var valLength=val.length;if(encoding!==undefined){encoding=String(encoding).toLowerCase();if(encoding==='ucs2'||encoding==='ucs-2'||encoding==='utf16le'||encoding==='utf-16le'){if(arr.length<2||val.length<2){return-1;}indexSize=2;arrLength/=2;valLength/=2;byteOffset/=2;}}function read(buf,i){if(indexSize===1){return buf[i];}else{return buf.readUInt16BE(i*indexSize);}}var i;if(dir){var foundIndex=-1;for(i=byteOffset;i<arrLength;i++){if(read(arr,i)===read(val,foundIndex===-1?0:i-foundIndex)){if(foundIndex===-1)foundIndex=i;if(i-foundIndex+1===valLength)return foundIndex*indexSize;}else{if(foundIndex!==-1)i-=i-foundIndex;foundIndex=-1;}}}else{if(byteOffset+valLength>arrLength)byteOffset=arrLength-valLength;for(i=byteOffset;i>=0;i--){var found=true;for(var j=0;j<valLength;j++){if(read(arr,i+j)!==read(val,j)){found=false;break;}}if(found)return i;}}return-1;}Buffer.prototype.includes=function includes(val,byteOffset,encoding){return this.indexOf(val,byteOffset,encoding)!==-1;};Buffer.prototype.indexOf=function indexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,true);};Buffer.prototype.lastIndexOf=function lastIndexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,false);};function hexWrite(buf,string,offset,length){offset=Number(offset)||0;var remaining=buf.length-offset;if(!length){length=remaining;}else{length=Number(length);if(length>remaining){length=remaining;}}// must be an even number of digits
var strLen=string.length;if(strLen%2!==0)throw new TypeError('Invalid hex string');if(length>strLen/2){length=strLen/2;}for(var i=0;i<length;++i){var parsed=parseInt(string.substr(i*2,2),16);if(isNaN(parsed))return i;buf[offset+i]=parsed;}return i;}function utf8Write(buf,string,offset,length){return blitBuffer(utf8ToBytes(string,buf.length-offset),buf,offset,length);}function asciiWrite(buf,string,offset,length){return blitBuffer(asciiToBytes(string),buf,offset,length);}function latin1Write(buf,string,offset,length){return asciiWrite(buf,string,offset,length);}function base64Write(buf,string,offset,length){return blitBuffer(base64ToBytes(string),buf,offset,length);}function ucs2Write(buf,string,offset,length){return blitBuffer(utf16leToBytes(string,buf.length-offset),buf,offset,length);}Buffer.prototype.write=function write(string,offset,length,encoding){// Buffer#write(string)
if(offset===undefined){encoding='utf8';length=this.length;offset=0;// Buffer#write(string, encoding)
}else if(length===undefined&&typeof offset==='string'){encoding=offset;length=this.length;offset=0;// Buffer#write(string, offset[, length][, encoding])
}else if(isFinite(offset)){offset=offset|0;if(isFinite(length)){length=length|0;if(encoding===undefined)encoding='utf8';}else{encoding=length;length=undefined;}// legacy write(string, encoding, offset, length) - remove in v0.13
}else{throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');}var remaining=this.length-offset;if(length===undefined||length>remaining)length=remaining;if(string.length>0&&(length<0||offset<0)||offset>this.length){throw new RangeError('Attempt to write outside buffer bounds');}if(!encoding)encoding='utf8';var loweredCase=false;for(;;){switch(encoding){case'hex':return hexWrite(this,string,offset,length);case'utf8':case'utf-8':return utf8Write(this,string,offset,length);case'ascii':return asciiWrite(this,string,offset,length);case'latin1':case'binary':return latin1Write(this,string,offset,length);case'base64':// Warning: maxLength not taken into account in base64Write
return base64Write(this,string,offset,length);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return ucs2Write(this,string,offset,length);default:if(loweredCase)throw new TypeError('Unknown encoding: '+encoding);encoding=(''+encoding).toLowerCase();loweredCase=true;}}};Buffer.prototype.toJSON=function toJSON(){return{type:'Buffer',data:Array.prototype.slice.call(this._arr||this,0)};};function base64Slice(buf,start,end){if(start===0&&end===buf.length){return base64.fromByteArray(buf);}else{return base64.fromByteArray(buf.slice(start,end));}}function utf8Slice(buf,start,end){end=Math.min(buf.length,end);var res=[];var i=start;while(i<end){var firstByte=buf[i];var codePoint=null;var bytesPerSequence=firstByte>0xEF?4:firstByte>0xDF?3:firstByte>0xBF?2:1;if(i+bytesPerSequence<=end){var secondByte,thirdByte,fourthByte,tempCodePoint;switch(bytesPerSequence){case 1:if(firstByte<0x80){codePoint=firstByte;}break;case 2:secondByte=buf[i+1];if((secondByte&0xC0)===0x80){tempCodePoint=(firstByte&0x1F)<<0x6|secondByte&0x3F;if(tempCodePoint>0x7F){codePoint=tempCodePoint;}}break;case 3:secondByte=buf[i+1];thirdByte=buf[i+2];if((secondByte&0xC0)===0x80&&(thirdByte&0xC0)===0x80){tempCodePoint=(firstByte&0xF)<<0xC|(secondByte&0x3F)<<0x6|thirdByte&0x3F;if(tempCodePoint>0x7FF&&(tempCodePoint<0xD800||tempCodePoint>0xDFFF)){codePoint=tempCodePoint;}}break;case 4:secondByte=buf[i+1];thirdByte=buf[i+2];fourthByte=buf[i+3];if((secondByte&0xC0)===0x80&&(thirdByte&0xC0)===0x80&&(fourthByte&0xC0)===0x80){tempCodePoint=(firstByte&0xF)<<0x12|(secondByte&0x3F)<<0xC|(thirdByte&0x3F)<<0x6|fourthByte&0x3F;if(tempCodePoint>0xFFFF&&tempCodePoint<0x110000){codePoint=tempCodePoint;}}}}if(codePoint===null){// we did not generate a valid codePoint so insert a
// replacement char (U+FFFD) and advance only 1 byte
codePoint=0xFFFD;bytesPerSequence=1;}else if(codePoint>0xFFFF){// encode to utf16 (surrogate pair dance)
codePoint-=0x10000;res.push(codePoint>>>10&0x3FF|0xD800);codePoint=0xDC00|codePoint&0x3FF;}res.push(codePoint);i+=bytesPerSequence;}return decodeCodePointsArray(res);}// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH=0x1000;function decodeCodePointsArray(codePoints){var len=codePoints.length;if(len<=MAX_ARGUMENTS_LENGTH){return String.fromCharCode.apply(String,codePoints);// avoid extra slice()
}// Decode in chunks to avoid "call stack size exceeded".
var res='';var i=0;while(i<len){res+=String.fromCharCode.apply(String,codePoints.slice(i,i+=MAX_ARGUMENTS_LENGTH));}return res;}function asciiSlice(buf,start,end){var ret='';end=Math.min(buf.length,end);for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i]&0x7F);}return ret;}function latin1Slice(buf,start,end){var ret='';end=Math.min(buf.length,end);for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i]);}return ret;}function hexSlice(buf,start,end){var len=buf.length;if(!start||start<0)start=0;if(!end||end<0||end>len)end=len;var out='';for(var i=start;i<end;++i){out+=toHex(buf[i]);}return out;}function utf16leSlice(buf,start,end){var bytes=buf.slice(start,end);var res='';for(var i=0;i<bytes.length;i+=2){res+=String.fromCharCode(bytes[i]+bytes[i+1]*256);}return res;}Buffer.prototype.slice=function slice(start,end){var len=this.length;start=~~start;end=end===undefined?len:~~end;if(start<0){start+=len;if(start<0)start=0;}else if(start>len){start=len;}if(end<0){end+=len;if(end<0)end=0;}else if(end>len){end=len;}if(end<start)end=start;var newBuf;if(Buffer.TYPED_ARRAY_SUPPORT){newBuf=this.subarray(start,end);newBuf.__proto__=Buffer.prototype;}else{var sliceLen=end-start;newBuf=new Buffer(sliceLen,undefined);for(var i=0;i<sliceLen;++i){newBuf[i]=this[i+start];}}return newBuf;};/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */function checkOffset(offset,ext,length){if(offset%1!==0||offset<0)throw new RangeError('offset is not uint');if(offset+ext>length)throw new RangeError('Trying to access beyond buffer length');}Buffer.prototype.readUIntLE=function readUIntLE(offset,byteLength,noAssert){offset=offset|0;byteLength=byteLength|0;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset];var mul=1;var i=0;while(++i<byteLength&&(mul*=0x100)){val+=this[offset+i]*mul;}return val;};Buffer.prototype.readUIntBE=function readUIntBE(offset,byteLength,noAssert){offset=offset|0;byteLength=byteLength|0;if(!noAssert){checkOffset(offset,byteLength,this.length);}var val=this[offset+--byteLength];var mul=1;while(byteLength>0&&(mul*=0x100)){val+=this[offset+--byteLength]*mul;}return val;};Buffer.prototype.readUInt8=function readUInt8(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length);return this[offset];};Buffer.prototype.readUInt16LE=function readUInt16LE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);return this[offset]|this[offset+1]<<8;};Buffer.prototype.readUInt16BE=function readUInt16BE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);return this[offset]<<8|this[offset+1];};Buffer.prototype.readUInt32LE=function readUInt32LE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return(this[offset]|this[offset+1]<<8|this[offset+2]<<16)+this[offset+3]*0x1000000;};Buffer.prototype.readUInt32BE=function readUInt32BE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return this[offset]*0x1000000+(this[offset+1]<<16|this[offset+2]<<8|this[offset+3]);};Buffer.prototype.readIntLE=function readIntLE(offset,byteLength,noAssert){offset=offset|0;byteLength=byteLength|0;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset];var mul=1;var i=0;while(++i<byteLength&&(mul*=0x100)){val+=this[offset+i]*mul;}mul*=0x80;if(val>=mul)val-=Math.pow(2,8*byteLength);return val;};Buffer.prototype.readIntBE=function readIntBE(offset,byteLength,noAssert){offset=offset|0;byteLength=byteLength|0;if(!noAssert)checkOffset(offset,byteLength,this.length);var i=byteLength;var mul=1;var val=this[offset+--i];while(i>0&&(mul*=0x100)){val+=this[offset+--i]*mul;}mul*=0x80;if(val>=mul)val-=Math.pow(2,8*byteLength);return val;};Buffer.prototype.readInt8=function readInt8(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length);if(!(this[offset]&0x80))return this[offset];return(0xff-this[offset]+1)*-1;};Buffer.prototype.readInt16LE=function readInt16LE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset]|this[offset+1]<<8;return val&0x8000?val|0xFFFF0000:val;};Buffer.prototype.readInt16BE=function readInt16BE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset+1]|this[offset]<<8;return val&0x8000?val|0xFFFF0000:val;};Buffer.prototype.readInt32LE=function readInt32LE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return this[offset]|this[offset+1]<<8|this[offset+2]<<16|this[offset+3]<<24;};Buffer.prototype.readInt32BE=function readInt32BE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return this[offset]<<24|this[offset+1]<<16|this[offset+2]<<8|this[offset+3];};Buffer.prototype.readFloatLE=function readFloatLE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,true,23,4);};Buffer.prototype.readFloatBE=function readFloatBE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,false,23,4);};Buffer.prototype.readDoubleLE=function readDoubleLE(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,true,52,8);};Buffer.prototype.readDoubleBE=function readDoubleBE(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,false,52,8);};function checkInt(buf,value,offset,ext,max,min){if(!Buffer.isBuffer(buf))throw new TypeError('"buffer" argument must be a Buffer instance');if(value>max||value<min)throw new RangeError('"value" argument is out of bounds');if(offset+ext>buf.length)throw new RangeError('Index out of range');}Buffer.prototype.writeUIntLE=function writeUIntLE(value,offset,byteLength,noAssert){value=+value;offset=offset|0;byteLength=byteLength|0;if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0);}var mul=1;var i=0;this[offset]=value&0xFF;while(++i<byteLength&&(mul*=0x100)){this[offset+i]=value/mul&0xFF;}return offset+byteLength;};Buffer.prototype.writeUIntBE=function writeUIntBE(value,offset,byteLength,noAssert){value=+value;offset=offset|0;byteLength=byteLength|0;if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0);}var i=byteLength-1;var mul=1;this[offset+i]=value&0xFF;while(--i>=0&&(mul*=0x100)){this[offset+i]=value/mul&0xFF;}return offset+byteLength;};Buffer.prototype.writeUInt8=function writeUInt8(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,1,0xff,0);if(!Buffer.TYPED_ARRAY_SUPPORT)value=Math.floor(value);this[offset]=value&0xff;return offset+1;};function objectWriteUInt16(buf,value,offset,littleEndian){if(value<0)value=0xffff+value+1;for(var i=0,j=Math.min(buf.length-offset,2);i<j;++i){buf[offset+i]=(value&0xff<<8*(littleEndian?i:1-i))>>>(littleEndian?i:1-i)*8;}}Buffer.prototype.writeUInt16LE=function writeUInt16LE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,2,0xffff,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value&0xff;this[offset+1]=value>>>8;}else{objectWriteUInt16(this,value,offset,true);}return offset+2;};Buffer.prototype.writeUInt16BE=function writeUInt16BE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,2,0xffff,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>8;this[offset+1]=value&0xff;}else{objectWriteUInt16(this,value,offset,false);}return offset+2;};function objectWriteUInt32(buf,value,offset,littleEndian){if(value<0)value=0xffffffff+value+1;for(var i=0,j=Math.min(buf.length-offset,4);i<j;++i){buf[offset+i]=value>>>(littleEndian?i:3-i)*8&0xff;}}Buffer.prototype.writeUInt32LE=function writeUInt32LE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,4,0xffffffff,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset+3]=value>>>24;this[offset+2]=value>>>16;this[offset+1]=value>>>8;this[offset]=value&0xff;}else{objectWriteUInt32(this,value,offset,true);}return offset+4;};Buffer.prototype.writeUInt32BE=function writeUInt32BE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,4,0xffffffff,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=value&0xff;}else{objectWriteUInt32(this,value,offset,false);}return offset+4;};Buffer.prototype.writeIntLE=function writeIntLE(value,offset,byteLength,noAssert){value=+value;offset=offset|0;if(!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit);}var i=0;var mul=1;var sub=0;this[offset]=value&0xFF;while(++i<byteLength&&(mul*=0x100)){if(value<0&&sub===0&&this[offset+i-1]!==0){sub=1;}this[offset+i]=(value/mul>>0)-sub&0xFF;}return offset+byteLength;};Buffer.prototype.writeIntBE=function writeIntBE(value,offset,byteLength,noAssert){value=+value;offset=offset|0;if(!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit);}var i=byteLength-1;var mul=1;var sub=0;this[offset+i]=value&0xFF;while(--i>=0&&(mul*=0x100)){if(value<0&&sub===0&&this[offset+i+1]!==0){sub=1;}this[offset+i]=(value/mul>>0)-sub&0xFF;}return offset+byteLength;};Buffer.prototype.writeInt8=function writeInt8(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,1,0x7f,-0x80);if(!Buffer.TYPED_ARRAY_SUPPORT)value=Math.floor(value);if(value<0)value=0xff+value+1;this[offset]=value&0xff;return offset+1;};Buffer.prototype.writeInt16LE=function writeInt16LE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,2,0x7fff,-0x8000);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value&0xff;this[offset+1]=value>>>8;}else{objectWriteUInt16(this,value,offset,true);}return offset+2;};Buffer.prototype.writeInt16BE=function writeInt16BE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,2,0x7fff,-0x8000);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>8;this[offset+1]=value&0xff;}else{objectWriteUInt16(this,value,offset,false);}return offset+2;};Buffer.prototype.writeInt32LE=function writeInt32LE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,4,0x7fffffff,-0x80000000);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value&0xff;this[offset+1]=value>>>8;this[offset+2]=value>>>16;this[offset+3]=value>>>24;}else{objectWriteUInt32(this,value,offset,true);}return offset+4;};Buffer.prototype.writeInt32BE=function writeInt32BE(value,offset,noAssert){value=+value;offset=offset|0;if(!noAssert)checkInt(this,value,offset,4,0x7fffffff,-0x80000000);if(value<0)value=0xffffffff+value+1;if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=value&0xff;}else{objectWriteUInt32(this,value,offset,false);}return offset+4;};function checkIEEE754(buf,value,offset,ext,max,min){if(offset+ext>buf.length)throw new RangeError('Index out of range');if(offset<0)throw new RangeError('Index out of range');}function writeFloat(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,4,3.4028234663852886e+38,-3.4028234663852886e+38);}ieee754.write(buf,value,offset,littleEndian,23,4);return offset+4;}Buffer.prototype.writeFloatLE=function writeFloatLE(value,offset,noAssert){return writeFloat(this,value,offset,true,noAssert);};Buffer.prototype.writeFloatBE=function writeFloatBE(value,offset,noAssert){return writeFloat(this,value,offset,false,noAssert);};function writeDouble(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,8,1.7976931348623157E+308,-1.7976931348623157E+308);}ieee754.write(buf,value,offset,littleEndian,52,8);return offset+8;}Buffer.prototype.writeDoubleLE=function writeDoubleLE(value,offset,noAssert){return writeDouble(this,value,offset,true,noAssert);};Buffer.prototype.writeDoubleBE=function writeDoubleBE(value,offset,noAssert){return writeDouble(this,value,offset,false,noAssert);};// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy=function copy(target,targetStart,start,end){if(!start)start=0;if(!end&&end!==0)end=this.length;if(targetStart>=target.length)targetStart=target.length;if(!targetStart)targetStart=0;if(end>0&&end<start)end=start;// Copy 0 bytes; we're done
if(end===start)return 0;if(target.length===0||this.length===0)return 0;// Fatal error conditions
if(targetStart<0){throw new RangeError('targetStart out of bounds');}if(start<0||start>=this.length)throw new RangeError('sourceStart out of bounds');if(end<0)throw new RangeError('sourceEnd out of bounds');// Are we oob?
if(end>this.length)end=this.length;if(target.length-targetStart<end-start){end=target.length-targetStart+start;}var len=end-start;var i;if(this===target&&start<targetStart&&targetStart<end){// descending copy from end
for(i=len-1;i>=0;--i){target[i+targetStart]=this[i+start];}}else if(len<1000||!Buffer.TYPED_ARRAY_SUPPORT){// ascending copy from start
for(i=0;i<len;++i){target[i+targetStart]=this[i+start];}}else{Uint8Array.prototype.set.call(target,this.subarray(start,start+len),targetStart);}return len;};// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill=function fill(val,start,end,encoding){// Handle string cases:
if(typeof val==='string'){if(typeof start==='string'){encoding=start;start=0;end=this.length;}else if(typeof end==='string'){encoding=end;end=this.length;}if(val.length===1){var code=val.charCodeAt(0);if(code<256){val=code;}}if(encoding!==undefined&&typeof encoding!=='string'){throw new TypeError('encoding must be a string');}if(typeof encoding==='string'&&!Buffer.isEncoding(encoding)){throw new TypeError('Unknown encoding: '+encoding);}}else if(typeof val==='number'){val=val&255;}// Invalid ranges are not set to a default, so can range check early.
if(start<0||this.length<start||this.length<end){throw new RangeError('Out of range index');}if(end<=start){return this;}start=start>>>0;end=end===undefined?this.length:end>>>0;if(!val)val=0;var i;if(typeof val==='number'){for(i=start;i<end;++i){this[i]=val;}}else{var bytes=Buffer.isBuffer(val)?val:utf8ToBytes(new Buffer(val,encoding).toString());var len=bytes.length;for(i=0;i<end-start;++i){this[i+start]=bytes[i%len];}}return this;};// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;function base64clean(str){// Node strips out invalid characters like \n and \t from the string, base64-js does not
str=stringtrim(str).replace(INVALID_BASE64_RE,'');// Node converts strings with length < 2 to ''
if(str.length<2)return'';// Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
while(str.length%4!==0){str=str+'=';}return str;}function stringtrim(str){if(str.trim)return str.trim();return str.replace(/^\s+|\s+$/g,'');}function toHex(n){if(n<16)return'0'+n.toString(16);return n.toString(16);}function utf8ToBytes(string,units){units=units||Infinity;var codePoint;var length=string.length;var leadSurrogate=null;var bytes=[];for(var i=0;i<length;++i){codePoint=string.charCodeAt(i);// is surrogate component
if(codePoint>0xD7FF&&codePoint<0xE000){// last char was a lead
if(!leadSurrogate){// no lead yet
if(codePoint>0xDBFF){// unexpected trail
if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD);continue;}else if(i+1===length){// unpaired lead
if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD);continue;}// valid lead
leadSurrogate=codePoint;continue;}// 2 leads in a row
if(codePoint<0xDC00){if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD);leadSurrogate=codePoint;continue;}// valid surrogate pair
codePoint=(leadSurrogate-0xD800<<10|codePoint-0xDC00)+0x10000;}else if(leadSurrogate){// valid bmp char, but last char was a lead
if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD);}leadSurrogate=null;// encode utf8
if(codePoint<0x80){if((units-=1)<0)break;bytes.push(codePoint);}else if(codePoint<0x800){if((units-=2)<0)break;bytes.push(codePoint>>0x6|0xC0,codePoint&0x3F|0x80);}else if(codePoint<0x10000){if((units-=3)<0)break;bytes.push(codePoint>>0xC|0xE0,codePoint>>0x6&0x3F|0x80,codePoint&0x3F|0x80);}else if(codePoint<0x110000){if((units-=4)<0)break;bytes.push(codePoint>>0x12|0xF0,codePoint>>0xC&0x3F|0x80,codePoint>>0x6&0x3F|0x80,codePoint&0x3F|0x80);}else{throw new Error('Invalid code point');}}return bytes;}function asciiToBytes(str){var byteArray=[];for(var i=0;i<str.length;++i){// Node's code seems to be doing this and not & 0x7F..
byteArray.push(str.charCodeAt(i)&0xFF);}return byteArray;}function utf16leToBytes(str,units){var c,hi,lo;var byteArray=[];for(var i=0;i<str.length;++i){if((units-=2)<0)break;c=str.charCodeAt(i);hi=c>>8;lo=c%256;byteArray.push(lo);byteArray.push(hi);}return byteArray;}function base64ToBytes(str){return base64.toByteArray(base64clean(str));}function blitBuffer(src,dst,offset,length){for(var i=0;i<length;++i){if(i+offset>=dst.length||i>=src.length)break;dst[i+offset]=src[i];}return i;}function isnan(val){return val!==val;// eslint-disable-line no-self-compare
}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"base64-js":402,"ieee754":408,"isarray":411}],406:[function(require,module,exports){(function(Buffer){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg){if(Array.isArray){return Array.isArray(arg);}return objectToString(arg)==='[object Array]';}exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean';}exports.isBoolean=isBoolean;function isNull(arg){return arg===null;}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null;}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number';}exports.isNumber=isNumber;function isString(arg){return typeof arg==='string';}exports.isString=isString;function isSymbol(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol';}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0;}exports.isUndefined=isUndefined;function isRegExp(re){return objectToString(re)==='[object RegExp]';}exports.isRegExp=isRegExp;function isObject(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&arg!==null;}exports.isObject=isObject;function isDate(d){return objectToString(d)==='[object Date]';}exports.isDate=isDate;function isError(e){return objectToString(e)==='[object Error]'||e instanceof Error;}exports.isError=isError;function isFunction(arg){return typeof arg==='function';}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol'||// ES6 symbol
typeof arg==='undefined';}exports.isPrimitive=isPrimitive;exports.isBuffer=Buffer.isBuffer;function objectToString(o){return Object.prototype.toString.call(o);}}).call(this,{"isBuffer":require("../../is-buffer/index.js")});},{"../../is-buffer/index.js":410}],407:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
function EventEmitter(){this._events=this._events||{};this._maxListeners=this._maxListeners||undefined;}module.exports=EventEmitter;// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._maxListeners=undefined;// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners=10;// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||n<0||isNaN(n))throw TypeError('n must be a positive number');this._maxListeners=n;return this;};EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(!this._events)this._events={};// If there is no 'error' event listener then throw.
if(type==='error'){if(!this._events.error||isObject(this._events.error)&&!this._events.error.length){er=arguments[1];if(er instanceof Error){throw er;// Unhandled 'error' event
}else{// At least give some kind of context to the user
var err=new Error('Uncaught, unspecified "error" event. ('+er+')');err.context=er;throw err;}}}handler=this._events[type];if(isUndefined(handler))return false;if(isFunction(handler)){switch(arguments.length){// fast cases
case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;// slower
default:args=Array.prototype.slice.call(arguments,1);handler.apply(this,args);}}else if(isObject(handler)){args=Array.prototype.slice.call(arguments,1);listeners=handler.slice();len=listeners.length;for(i=0;i<len;i++){listeners[i].apply(this,args);}}return true;};EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events)this._events={};// To avoid recursion in the case that type === "newListener"! Before
// adding it to the listeners, first emit "newListener".
if(this._events.newListener)this.emit('newListener',type,isFunction(listener.listener)?listener.listener:listener);if(!this._events[type])// Optimize the case of one listener. Don't need the extra array object.
this._events[type]=listener;else if(isObject(this._events[type]))// If we've already got an array, just append.
this._events[type].push(listener);else// Adding the second element, need to change to array.
this._events[type]=[this._events[type],listener];// Check for listener leak
if(isObject(this._events[type])&&!this._events[type].warned){if(!isUndefined(this._maxListeners)){m=this._maxListeners;}else{m=EventEmitter.defaultMaxListeners;}if(m&&m>0&&this._events[type].length>m){this._events[type].warned=true;console.error('(node) warning: possible EventEmitter memory '+'leak detected. %d listeners added. '+'Use emitter.setMaxListeners() to increase limit.',this._events[type].length);if(typeof console.trace==='function'){// not supported in IE 10
console.trace();}}}return this;};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.once=function(type,listener){if(!isFunction(listener))throw TypeError('listener must be a function');var fired=false;function g(){this.removeListener(type,g);if(!fired){fired=true;listener.apply(this,arguments);}}g.listener=listener;this.on(type,g);return this;};// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events||!this._events[type])return this;list=this._events[type];length=list.length;position=-1;if(list===listener||isFunction(list.listener)&&list.listener===listener){delete this._events[type];if(this._events.removeListener)this.emit('removeListener',type,listener);}else if(isObject(list)){for(i=length;i-->0;){if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break;}}if(position<0)return this;if(list.length===1){list.length=0;delete this._events[type];}else{list.splice(position,1);}if(this._events.removeListener)this.emit('removeListener',type,listener);}return this;};EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;// not listening for removeListener, no need to emit
if(!this._events.removeListener){if(arguments.length===0)this._events={};else if(this._events[type])delete this._events[type];return this;}// emit removeListener for all listeners on all events
if(arguments.length===0){for(key in this._events){if(key==='removeListener')continue;this.removeAllListeners(key);}this.removeAllListeners('removeListener');this._events={};return this;}listeners=this._events[type];if(isFunction(listeners)){this.removeListener(type,listeners);}else if(listeners){// LIFO order
while(listeners.length){this.removeListener(type,listeners[listeners.length-1]);}}delete this._events[type];return this;};EventEmitter.prototype.listeners=function(type){var ret;if(!this._events||!this._events[type])ret=[];else if(isFunction(this._events[type]))ret=[this._events[type]];else ret=this._events[type].slice();return ret;};EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;else if(evlistener)return evlistener.length;}return 0;};EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type);};function isFunction(arg){return typeof arg==='function';}function isNumber(arg){return typeof arg==='number';}function isObject(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&arg!==null;}function isUndefined(arg){return arg===void 0;}},{}],408:[function(require,module,exports){exports.read=function(buffer,offset,isLE,mLen,nBytes){var e,m;var eLen=nBytes*8-mLen-1;var eMax=(1<<eLen)-1;var eBias=eMax>>1;var nBits=-7;var i=isLE?nBytes-1:0;var d=isLE?-1:1;var s=buffer[offset+i];i+=d;e=s&(1<<-nBits)-1;s>>=-nBits;nBits+=eLen;for(;nBits>0;e=e*256+buffer[offset+i],i+=d,nBits-=8){}m=e&(1<<-nBits)-1;e>>=-nBits;nBits+=mLen;for(;nBits>0;m=m*256+buffer[offset+i],i+=d,nBits-=8){}if(e===0){e=1-eBias;}else if(e===eMax){return m?NaN:(s?-1:1)*Infinity;}else{m=m+Math.pow(2,mLen);e=e-eBias;}return(s?-1:1)*m*Math.pow(2,e-mLen);};exports.write=function(buffer,value,offset,isLE,mLen,nBytes){var e,m,c;var eLen=nBytes*8-mLen-1;var eMax=(1<<eLen)-1;var eBias=eMax>>1;var rt=mLen===23?Math.pow(2,-24)-Math.pow(2,-77):0;var i=isLE?0:nBytes-1;var d=isLE?1:-1;var s=value<0||value===0&&1/value<0?1:0;value=Math.abs(value);if(isNaN(value)||value===Infinity){m=isNaN(value)?1:0;e=eMax;}else{e=Math.floor(Math.log(value)/Math.LN2);if(value*(c=Math.pow(2,-e))<1){e--;c*=2;}if(e+eBias>=1){value+=rt/c;}else{value+=rt*Math.pow(2,1-eBias);}if(value*c>=2){e++;c/=2;}if(e+eBias>=eMax){m=0;e=eMax;}else if(e+eBias>=1){m=(value*c-1)*Math.pow(2,mLen);e=e+eBias;}else{m=value*Math.pow(2,eBias-1)*Math.pow(2,mLen);e=0;}}for(;mLen>=8;buffer[offset+i]=m&0xff,i+=d,m/=256,mLen-=8){}e=e<<mLen|m;eLen+=mLen;for(;eLen>0;buffer[offset+i]=e&0xff,i+=d,e/=256,eLen-=8){}buffer[offset+i-d]|=s*128;};},{}],409:[function(require,module,exports){arguments[4][329][0].apply(exports,arguments);},{"dup":329}],410:[function(require,module,exports){/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports=function(obj){return obj!=null&&(isBuffer(obj)||isSlowBuffer(obj)||!!obj._isBuffer);};function isBuffer(obj){return!!obj.constructor&&typeof obj.constructor.isBuffer==='function'&&obj.constructor.isBuffer(obj);}// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj){return typeof obj.readFloatLE==='function'&&typeof obj.slice==='function'&&isBuffer(obj.slice(0,0));}},{}],411:[function(require,module,exports){arguments[4][330][0].apply(exports,arguments);},{"dup":330}],412:[function(require,module,exports){arguments[4][350][0].apply(exports,arguments);},{"_process":413,"dup":350}],413:[function(require,module,exports){// shim for using process in browser
var process=module.exports={};// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error('setTimeout has not been defined');}function defaultClearTimeout(){throw new Error('clearTimeout has not been defined');}(function(){try{if(typeof setTimeout==='function'){cachedSetTimeout=setTimeout;}else{cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}try{if(typeof clearTimeout==='function'){cachedClearTimeout=clearTimeout;}else{cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){//normal enviroments in sane situations
return setTimeout(fun,0);}// if setTimeout wasn't available but was latter defined
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0);}try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedSetTimeout(fun,0);}catch(e){try{// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
return cachedSetTimeout.call(null,fun,0);}catch(e){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
return cachedSetTimeout.call(this,fun,0);}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){//normal enviroments in sane situations
return clearTimeout(marker);}// if clearTimeout wasn't available but was latter defined
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker);}try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedClearTimeout(marker);}catch(e){try{// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
return cachedClearTimeout.call(null,marker);}catch(e){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
// Some versions of I.E. have different rules for clearTimeout vs setTimeout
return cachedClearTimeout.call(this,marker);}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return;}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else{queueIndex=-1;}if(queue.length){drainQueue();}}function drainQueue(){if(draining){return;}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}queueIndex=-1;len=queue.length;}currentQueue=null;draining=false;runClearTimeout(timeout);}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};// v8 likes predictible objects
function Item(fun,array){this.fun=fun;this.array=array;}Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title='browser';process.browser=true;process.env={};process.argv=[];process.version='';// empty string to avoid regexp issues
process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error('process.binding is not supported');};process.cwd=function(){return'/';};process.chdir=function(dir){throw new Error('process.chdir is not supported');};process.umask=function(){return 0;};},{}],414:[function(require,module,exports){module.exports=require("./lib/_stream_duplex.js");},{"./lib/_stream_duplex.js":415}],415:[function(require,module,exports){arguments[4][352][0].apply(exports,arguments);},{"./_stream_readable":417,"./_stream_writable":419,"core-util-is":406,"dup":352,"inherits":409,"process-nextick-args":412}],416:[function(require,module,exports){arguments[4][353][0].apply(exports,arguments);},{"./_stream_transform":418,"core-util-is":406,"dup":353,"inherits":409}],417:[function(require,module,exports){(function(process){'use strict';module.exports=Readable;/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var isArray=require('isarray');/*</replacement>*/Readable.ReadableState=ReadableState;/*<replacement>*/var EE=require('events').EventEmitter;var EElistenerCount=function EElistenerCount(emitter,type){return emitter.listeners(type).length;};/*</replacement>*//*<replacement>*/var Stream;(function(){try{Stream=require('st'+'ream');}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter;}})();/*</replacement>*/var Buffer=require('buffer').Buffer;/*<replacement>*/var bufferShim=require('buffer-shims');/*</replacement>*//*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var debugUtil=require('util');var debug=void 0;if(debugUtil&&debugUtil.debuglog){debug=debugUtil.debuglog('stream');}else{debug=function debug(){};}/*</replacement>*/var BufferList=require('./internal/streams/BufferList');var StringDecoder;util.inherits(Readable,Stream);function prependListener(emitter,event,fn){if(typeof emitter.prependListener==='function'){return emitter.prependListener(event,fn);}else{// This is a hack to make sure that our error handler is attached before any
// userland ones.  NEVER DO THIS. This is here only because this code needs
// to continue to work with older versions of Node.js that do not include
// the prependListener() method. The goal is to eventually remove this hack.
if(!emitter._events||!emitter._events[event])emitter.on(event,fn);else if(isArray(emitter._events[event]))emitter._events[event].unshift(fn);else emitter._events[event]=[fn,emitter._events[event]];}}var Duplex;function ReadableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag. Used to make read(n) ignore n and to
// make all the buffer merging and length checks go away
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.readableObjectMode;// the point at which it stops calling _read() to fill the buffer
// Note: 0 is a valid value, means "don't call _read preemptively ever"
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=~~this.highWaterMark;// A linked list is used to store data chunks instead of an array because the
// linked list can remove elements from the beginning faster than
// array.shift()
this.buffer=new BufferList();this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.ended=false;this.endEmitted=false;this.reading=false;// a flag to be able to tell if the onwrite cb is called immediately,
// or on a later tick.  We set this to true at first, because any
// actions that shouldn't happen until "later" should generally also
// not happen before the first write call.
this.sync=true;// whenever we return null, then we set a flag to say
// that we're awaiting a 'readable' event emission.
this.needReadable=false;this.emittedReadable=false;this.readableListening=false;this.resumeScheduled=false;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// when piping, we only care about 'readable' events that happen
// after read()ing all the bytes and not getting any pushback.
this.ranOut=false;// the number of writers that are awaiting a drain event in .pipe()s
this.awaitDrain=0;// if true, a maybeReadMore has been scheduled
this.readingMore=false;this.decoder=null;this.encoding=null;if(options.encoding){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this.decoder=new StringDecoder(options.encoding);this.encoding=options.encoding;}}var Duplex;function Readable(options){Duplex=Duplex||require('./_stream_duplex');if(!(this instanceof Readable))return new Readable(options);this._readableState=new ReadableState(options,this);// legacy
this.readable=true;if(options&&typeof options.read==='function')this._read=options.read;Stream.call(this);}// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push=function(chunk,encoding){var state=this._readableState;if(!state.objectMode&&typeof chunk==='string'){encoding=encoding||state.defaultEncoding;if(encoding!==state.encoding){chunk=bufferShim.from(chunk,encoding);encoding='';}}return readableAddChunk(this,state,chunk,encoding,false);};// Unshift should *always* be something directly out of read()
Readable.prototype.unshift=function(chunk){var state=this._readableState;return readableAddChunk(this,state,chunk,'',true);};Readable.prototype.isPaused=function(){return this._readableState.flowing===false;};function readableAddChunk(stream,state,chunk,encoding,addToFront){var er=chunkInvalid(state,chunk);if(er){stream.emit('error',er);}else if(chunk===null){state.reading=false;onEofChunk(stream,state);}else if(state.objectMode||chunk&&chunk.length>0){if(state.ended&&!addToFront){var e=new Error('stream.push() after EOF');stream.emit('error',e);}else if(state.endEmitted&&addToFront){var _e=new Error('stream.unshift() after end event');stream.emit('error',_e);}else{var skipAdd;if(state.decoder&&!addToFront&&!encoding){chunk=state.decoder.write(chunk);skipAdd=!state.objectMode&&chunk.length===0;}if(!addToFront)state.reading=false;// Don't add to the buffer if we've decoded to an empty string chunk and
// we're not in object mode
if(!skipAdd){// if we want the data now, just emit it.
if(state.flowing&&state.length===0&&!state.sync){stream.emit('data',chunk);stream.read(0);}else{// update the buffer info.
state.length+=state.objectMode?1:chunk.length;if(addToFront)state.buffer.unshift(chunk);else state.buffer.push(chunk);if(state.needReadable)emitReadable(stream);}}maybeReadMore(stream,state);}}else if(!addToFront){state.reading=false;}return needMoreData(state);}// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state){return!state.ended&&(state.needReadable||state.length<state.highWaterMark||state.length===0);}// backwards compatibility.
Readable.prototype.setEncoding=function(enc){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this._readableState.decoder=new StringDecoder(enc);this._readableState.encoding=enc;return this;};// Don't raise the hwm > 8MB
var MAX_HWM=0x800000;function computeNewHighWaterMark(n){if(n>=MAX_HWM){n=MAX_HWM;}else{// Get the next highest power of 2 to prevent increasing hwm excessively in
// tiny amounts
n--;n|=n>>>1;n|=n>>>2;n|=n>>>4;n|=n>>>8;n|=n>>>16;n++;}return n;}// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n,state){if(n<=0||state.length===0&&state.ended)return 0;if(state.objectMode)return 1;if(n!==n){// Only flow one buffer at a time
if(state.flowing&&state.length)return state.buffer.head.data.length;else return state.length;}// If we're asking for more than the current hwm, then raise the hwm.
if(n>state.highWaterMark)state.highWaterMark=computeNewHighWaterMark(n);if(n<=state.length)return n;// Don't have enough
if(!state.ended){state.needReadable=true;return 0;}return state.length;}// you can override either this method, or the async _read(n) below.
Readable.prototype.read=function(n){debug('read',n);n=parseInt(n,10);var state=this._readableState;var nOrig=n;if(n!==0)state.emittedReadable=false;// if we're doing read(0) to trigger a readable event, but we
// already have a bunch of data in the buffer, then just trigger
// the 'readable' event and move on.
if(n===0&&state.needReadable&&(state.length>=state.highWaterMark||state.ended)){debug('read: emitReadable',state.length,state.ended);if(state.length===0&&state.ended)endReadable(this);else emitReadable(this);return null;}n=howMuchToRead(n,state);// if we've ended, and we're now clear, then finish it up.
if(n===0&&state.ended){if(state.length===0)endReadable(this);return null;}// All the actual chunk generation logic needs to be
// *below* the call to _read.  The reason is that in certain
// synthetic stream cases, such as passthrough streams, _read
// may be a completely synchronous operation which may change
// the state of the read buffer, providing enough data when
// before there was *not* enough.
//
// So, the steps are:
// 1. Figure out what the state of things will be after we do
// a read from the buffer.
//
// 2. If that resulting state will trigger a _read, then call _read.
// Note that this may be asynchronous, or synchronous.  Yes, it is
// deeply ugly to write APIs this way, but that still doesn't mean
// that the Readable class should behave improperly, as streams are
// designed to be sync/async agnostic.
// Take note if the _read call is sync or async (ie, if the read call
// has returned yet), so that we know whether or not it's safe to emit
// 'readable' etc.
//
// 3. Actually pull the requested chunks out of the buffer and return.
// if we need a readable event, then we need to do some reading.
var doRead=state.needReadable;debug('need readable',doRead);// if we currently have less than the highWaterMark, then also read some
if(state.length===0||state.length-n<state.highWaterMark){doRead=true;debug('length less than watermark',doRead);}// however, if we've ended, then there's no point, and if we're already
// reading, then it's unnecessary.
if(state.ended||state.reading){doRead=false;debug('reading or ended',doRead);}else if(doRead){debug('do read');state.reading=true;state.sync=true;// if the length is currently zero, then we *need* a readable event.
if(state.length===0)state.needReadable=true;// call internal read method
this._read(state.highWaterMark);state.sync=false;// If _read pushed data synchronously, then `reading` will be false,
// and we need to re-evaluate how much data we can return to the user.
if(!state.reading)n=howMuchToRead(nOrig,state);}var ret;if(n>0)ret=fromList(n,state);else ret=null;if(ret===null){state.needReadable=true;n=0;}else{state.length-=n;}if(state.length===0){// If we have nothing in the buffer, then we want to know
// as soon as we *do* get something into the buffer.
if(!state.ended)state.needReadable=true;// If we tried to read() past the EOF, then emit end on the next tick.
if(nOrig!==n&&state.ended)endReadable(this);}if(ret!==null)this.emit('data',ret);return ret;};function chunkInvalid(state,chunk){var er=null;if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==null&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}return er;}function onEofChunk(stream,state){if(state.ended)return;if(state.decoder){var chunk=state.decoder.end();if(chunk&&chunk.length){state.buffer.push(chunk);state.length+=state.objectMode?1:chunk.length;}}state.ended=true;// emit 'readable' now to make sure it gets picked up.
emitReadable(stream);}// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream){var state=stream._readableState;state.needReadable=false;if(!state.emittedReadable){debug('emitReadable',state.flowing);state.emittedReadable=true;if(state.sync)processNextTick(emitReadable_,stream);else emitReadable_(stream);}}function emitReadable_(stream){debug('emit readable');stream.emit('readable');flow(stream);}// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream,state){if(!state.readingMore){state.readingMore=true;processNextTick(maybeReadMore_,stream,state);}}function maybeReadMore_(stream,state){var len=state.length;while(!state.reading&&!state.flowing&&!state.ended&&state.length<state.highWaterMark){debug('maybeReadMore read 0');stream.read(0);if(len===state.length)// didn't get any data, stop spinning.
break;else len=state.length;}state.readingMore=false;}// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read=function(n){this.emit('error',new Error('not implemented'));};Readable.prototype.pipe=function(dest,pipeOpts){var src=this;var state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest);break;}state.pipesCount+=1;debug('pipe count=%d opts=%j',state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==false)&&dest!==process.stdout&&dest!==process.stderr;var endFn=doEnd?onend:cleanup;if(state.endEmitted)processNextTick(endFn);else src.once('end',endFn);dest.on('unpipe',onunpipe);function onunpipe(readable){debug('onunpipe');if(readable===src){cleanup();}}function onend(){debug('onend');dest.end();}// when the dest drains, it reduces the awaitDrain counter
// on the source.  This would be more elegant with a .once()
// handler in flow(), but adding and removing repeatedly is
// too slow.
var ondrain=pipeOnDrain(src);dest.on('drain',ondrain);var cleanedUp=false;function cleanup(){debug('cleanup');// cleanup event handlers once the pipe is broken
dest.removeListener('close',onclose);dest.removeListener('finish',onfinish);dest.removeListener('drain',ondrain);dest.removeListener('error',onerror);dest.removeListener('unpipe',onunpipe);src.removeListener('end',onend);src.removeListener('end',cleanup);src.removeListener('data',ondata);cleanedUp=true;// if the reader is waiting for a drain event from this
// specific writer, then it would cause it to never start
// flowing again.
// So, if this is awaiting a drain, then we just call it now.
// If we don't know, then assume that we are waiting for one.
if(state.awaitDrain&&(!dest._writableState||dest._writableState.needDrain))ondrain();}// If the user pushes more data while we're writing to dest then we'll end up
// in ondata again. However, we only want to increase awaitDrain once because
// dest will only emit one 'drain' event for the multiple writes.
// => Introduce a guard on increasing awaitDrain.
var increasedAwaitDrain=false;src.on('data',ondata);function ondata(chunk){debug('ondata');increasedAwaitDrain=false;var ret=dest.write(chunk);if(false===ret&&!increasedAwaitDrain){// If the user unpiped during `dest.write()`, it is possible
// to get stuck in a permanently paused state if that write
// also returned false.
// => Check whether `dest` is still a piping destination.
if((state.pipesCount===1&&state.pipes===dest||state.pipesCount>1&&indexOf(state.pipes,dest)!==-1)&&!cleanedUp){debug('false write response, pause',src._readableState.awaitDrain);src._readableState.awaitDrain++;increasedAwaitDrain=true;}src.pause();}}// if the dest has an error, then stop piping into it.
// however, don't suppress the throwing behavior for this.
function onerror(er){debug('onerror',er);unpipe();dest.removeListener('error',onerror);if(EElistenerCount(dest,'error')===0)dest.emit('error',er);}// Make sure our error handler is attached before userland ones.
prependListener(dest,'error',onerror);// Both close and finish should trigger unpipe, but only once.
function onclose(){dest.removeListener('finish',onfinish);unpipe();}dest.once('close',onclose);function onfinish(){debug('onfinish');dest.removeListener('close',onclose);unpipe();}dest.once('finish',onfinish);function unpipe(){debug('unpipe');src.unpipe(dest);}// tell the dest that it's being piped to
dest.emit('pipe',src);// start the flow if it hasn't been started already.
if(!state.flowing){debug('pipe resume');src.resume();}return dest;};function pipeOnDrain(src){return function(){var state=src._readableState;debug('pipeOnDrain',state.awaitDrain);if(state.awaitDrain)state.awaitDrain--;if(state.awaitDrain===0&&EElistenerCount(src,'data')){state.flowing=true;flow(src);}};}Readable.prototype.unpipe=function(dest){var state=this._readableState;// if we're not piping anywhere, then do nothing.
if(state.pipesCount===0)return this;// just one destination.  most common case.
if(state.pipesCount===1){// passed in one, but it's not the right one.
if(dest&&dest!==state.pipes)return this;if(!dest)dest=state.pipes;// got a match.
state.pipes=null;state.pipesCount=0;state.flowing=false;if(dest)dest.emit('unpipe',this);return this;}// slow case. multiple pipe destinations.
if(!dest){// remove all.
var dests=state.pipes;var len=state.pipesCount;state.pipes=null;state.pipesCount=0;state.flowing=false;for(var _i=0;_i<len;_i++){dests[_i].emit('unpipe',this);}return this;}// try to find the right one.
var i=indexOf(state.pipes,dest);if(i===-1)return this;state.pipes.splice(i,1);state.pipesCount-=1;if(state.pipesCount===1)state.pipes=state.pipes[0];dest.emit('unpipe',this);return this;};// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);if(ev==='data'){// Start flowing on next tick if stream isn't explicitly paused
if(this._readableState.flowing!==false)this.resume();}else if(ev==='readable'){var state=this._readableState;if(!state.endEmitted&&!state.readableListening){state.readableListening=state.needReadable=true;state.emittedReadable=false;if(!state.reading){processNextTick(nReadingNextTick,this);}else if(state.length){emitReadable(this,state);}}}return res;};Readable.prototype.addListener=Readable.prototype.on;function nReadingNextTick(self){debug('readable nexttick read 0');self.read(0);}// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume=function(){var state=this._readableState;if(!state.flowing){debug('resume');state.flowing=true;resume(this,state);}return this;};function resume(stream,state){if(!state.resumeScheduled){state.resumeScheduled=true;processNextTick(resume_,stream,state);}}function resume_(stream,state){if(!state.reading){debug('resume read 0');stream.read(0);}state.resumeScheduled=false;state.awaitDrain=0;stream.emit('resume');flow(stream);if(state.flowing&&!state.reading)stream.read(0);}Readable.prototype.pause=function(){debug('call pause flowing=%j',this._readableState.flowing);if(false!==this._readableState.flowing){debug('pause');this._readableState.flowing=false;this.emit('pause');}return this;};function flow(stream){var state=stream._readableState;debug('flow',state.flowing);while(state.flowing&&stream.read()!==null){}}// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap=function(stream){var state=this._readableState;var paused=false;var self=this;stream.on('end',function(){debug('wrapped end');if(state.decoder&&!state.ended){var chunk=state.decoder.end();if(chunk&&chunk.length)self.push(chunk);}self.push(null);});stream.on('data',function(chunk){debug('wrapped data');if(state.decoder)chunk=state.decoder.write(chunk);// don't skip over falsy values in objectMode
if(state.objectMode&&(chunk===null||chunk===undefined))return;else if(!state.objectMode&&(!chunk||!chunk.length))return;var ret=self.push(chunk);if(!ret){paused=true;stream.pause();}});// proxy all the other methods.
// important when wrapping filters and duplexes.
for(var i in stream){if(this[i]===undefined&&typeof stream[i]==='function'){this[i]=function(method){return function(){return stream[method].apply(stream,arguments);};}(i);}}// proxy certain important events.
var events=['error','close','destroy','pause','resume'];forEach(events,function(ev){stream.on(ev,self.emit.bind(self,ev));});// when we try to consume some more bytes, simply unpause the
// underlying stream.
self._read=function(n){debug('wrapped _read',n);if(paused){paused=false;stream.resume();}};return self;};// exposed for testing purposes only.
Readable._fromList=fromList;// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n,state){// nothing buffered
if(state.length===0)return null;var ret;if(state.objectMode)ret=state.buffer.shift();else if(!n||n>=state.length){// read it all, truncate the list
if(state.decoder)ret=state.buffer.join('');else if(state.buffer.length===1)ret=state.buffer.head.data;else ret=state.buffer.concat(state.length);state.buffer.clear();}else{// read part of list
ret=fromListPartial(n,state.buffer,state.decoder);}return ret;}// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n,list,hasStrings){var ret;if(n<list.head.data.length){// slice is the same for buffers and strings
ret=list.head.data.slice(0,n);list.head.data=list.head.data.slice(n);}else if(n===list.head.data.length){// first chunk is a perfect match
ret=list.shift();}else{// result spans more than one buffer
ret=hasStrings?copyFromBufferString(n,list):copyFromBuffer(n,list);}return ret;}// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n,list){var p=list.head;var c=1;var ret=p.data;n-=ret.length;while(p=p.next){var str=p.data;var nb=n>str.length?str.length:n;if(nb===str.length)ret+=str;else ret+=str.slice(0,n);n-=nb;if(n===0){if(nb===str.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=str.slice(nb);}break;}++c;}list.length-=c;return ret;}// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n,list){var ret=bufferShim.allocUnsafe(n);var p=list.head;var c=1;p.data.copy(ret);n-=p.data.length;while(p=p.next){var buf=p.data;var nb=n>buf.length?buf.length:n;buf.copy(ret,ret.length-n,0,nb);n-=nb;if(n===0){if(nb===buf.length){++c;if(p.next)list.head=p.next;else list.head=list.tail=null;}else{list.head=p;p.data=buf.slice(nb);}break;}++c;}list.length-=c;return ret;}function endReadable(stream){var state=stream._readableState;// If we get here before consuming all the bytes, then that is a
// bug in node.  Should never happen.
if(state.length>0)throw new Error('"endReadable()" called on non-empty stream');if(!state.endEmitted){state.ended=true;processNextTick(endReadableNT,state,stream);}}function endReadableNT(state,stream){// Check that we didn't get one last unshift.
if(!state.endEmitted&&state.length===0){state.endEmitted=true;stream.readable=false;stream.emit('end');}}function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i);}}function indexOf(xs,x){for(var i=0,l=xs.length;i<l;i++){if(xs[i]===x)return i;}return-1;}}).call(this,require('_process'));},{"./_stream_duplex":415,"./internal/streams/BufferList":420,"_process":413,"buffer":405,"buffer-shims":404,"core-util-is":406,"events":407,"inherits":409,"isarray":411,"process-nextick-args":412,"string_decoder/":426,"util":403}],418:[function(require,module,exports){// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';module.exports=Transform;var Duplex=require('./_stream_duplex');/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*/util.inherits(Transform,Duplex);function TransformState(stream){this.afterTransform=function(er,data){return afterTransform(stream,er,data);};this.needTransform=false;this.transforming=false;this.writecb=null;this.writechunk=null;this.writeencoding=null;}function afterTransform(stream,er,data){var ts=stream._transformState;ts.transforming=false;var cb=ts.writecb;if(!cb)return stream.emit('error',new Error('no writecb in Transform class'));ts.writechunk=null;ts.writecb=null;if(data!==null&&data!==undefined)stream.push(data);cb(er);var rs=stream._readableState;rs.reading=false;if(rs.needReadable||rs.length<rs.highWaterMark){stream._read(rs.highWaterMark);}}function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options);this._transformState=new TransformState(this);// when the writable side finishes, then flush out anything remaining.
var stream=this;// start out asking for a readable event once data is transformed.
this._readableState.needReadable=true;// we have implemented the _read method, and done the other things
// that Readable wants before the first _read call, so unset the
// sync guard flag.
this._readableState.sync=false;if(options){if(typeof options.transform==='function')this._transform=options.transform;if(typeof options.flush==='function')this._flush=options.flush;}this.once('prefinish',function(){if(typeof this._flush==='function')this._flush(function(er){done(stream,er);});else done(stream);});}Transform.prototype.push=function(chunk,encoding){this._transformState.needTransform=false;return Duplex.prototype.push.call(this,chunk,encoding);};// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform=function(chunk,encoding,cb){throw new Error('Not implemented');};Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;ts.writecb=cb;ts.writechunk=chunk;ts.writeencoding=encoding;if(!ts.transforming){var rs=this._readableState;if(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)this._read(rs.highWaterMark);}};// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read=function(n){var ts=this._transformState;if(ts.writechunk!==null&&ts.writecb&&!ts.transforming){ts.transforming=true;this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform);}else{// mark that we need a transform, so that any data that comes in
// will get processed, now that we've asked for it.
ts.needTransform=true;}};function done(stream,er){if(er)return stream.emit('error',er);// if there's nothing in the write buffer, then that means
// that nothing more will ever be provided
var ws=stream._writableState;var ts=stream._transformState;if(ws.length)throw new Error('Calling transform done when ws.length != 0');if(ts.transforming)throw new Error('Calling transform done when still transforming');return stream.push(null);}},{"./_stream_duplex":415,"core-util-is":406,"inherits":409}],419:[function(require,module,exports){(function(process){// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';module.exports=Writable;/*<replacement>*/var processNextTick=require('process-nextick-args');/*</replacement>*//*<replacement>*/var asyncWrite=!process.browser&&['v0.10','v0.9.'].indexOf(process.version.slice(0,5))>-1?setImmediate:processNextTick;/*</replacement>*/Writable.WritableState=WritableState;/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var internalUtil={deprecate:require('util-deprecate')};/*</replacement>*//*<replacement>*/var Stream;(function(){try{Stream=require('st'+'ream');}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter;}})();/*</replacement>*/var Buffer=require('buffer').Buffer;/*<replacement>*/var bufferShim=require('buffer-shims');/*</replacement>*/util.inherits(Writable,Stream);function nop(){}function WriteReq(chunk,encoding,cb){this.chunk=chunk;this.encoding=encoding;this.callback=cb;this.next=null;}var Duplex;function WritableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};// object stream flag to indicate whether or not this stream
// contains buffers or objects.
this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.writableObjectMode;// the point at which write() starts returning false
// Note: 0 is a valid value, means that we always return false if
// the entire buffer is not flushed immediately on write()
var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;// cast to ints.
this.highWaterMark=~~this.highWaterMark;this.needDrain=false;// at the start of calling end()
this.ending=false;// when end() has been called, and returned
this.ended=false;// when 'finish' is emitted
this.finished=false;// should we decode strings into buffers before passing to _write?
// this is here so that some node-core streams can optimize string
// handling at a lower level.
var noDecode=options.decodeStrings===false;this.decodeStrings=!noDecode;// Crypto is kind of old and crusty.  Historically, its default string
// encoding is 'binary' so we have to make this configurable.
// Everything else in the universe uses 'utf8', though.
this.defaultEncoding=options.defaultEncoding||'utf8';// not an actual buffer we keep track of, but a measurement
// of how much we're waiting to get pushed to some underlying
// socket or file.
this.length=0;// a flag to see when we're in the middle of a write.
this.writing=false;// when true all writes will be buffered until .uncork() call
this.corked=0;// a flag to be able to tell if the onwrite cb is called immediately,
// or on a later tick.  We set this to true at first, because any
// actions that shouldn't happen until "later" should generally also
// not happen before the first write call.
this.sync=true;// a flag to know if we're processing previously buffered items, which
// may call the _write() callback in the same tick, so that we don't
// end up in an overlapped onwrite situation.
this.bufferProcessing=false;// the callback that's passed to _write(chunk,cb)
this.onwrite=function(er){onwrite(stream,er);};// the callback that the user supplies to write(chunk,encoding,cb)
this.writecb=null;// the amount that is being written when _write is called.
this.writelen=0;this.bufferedRequest=null;this.lastBufferedRequest=null;// number of pending user-supplied write callbacks
// this must be 0 before 'finish' can be emitted
this.pendingcb=0;// emit prefinish if the only thing we're waiting for is _write cbs
// This is relevant for synchronous Transform streams
this.prefinished=false;// True if the error was already emitted and should not be thrown again
this.errorEmitted=false;// count buffered requests
this.bufferedRequestCount=0;// allocate the first CorkedRequest, there is always
// one allocated and free to use, and we maintain at most two
this.corkedRequestsFree=new CorkedRequest(this);}WritableState.prototype.getBuffer=function writableStateGetBuffer(){var current=this.bufferedRequest;var out=[];while(current){out.push(current);current=current.next;}return out;};(function(){try{Object.defineProperty(WritableState.prototype,'buffer',{get:internalUtil.deprecate(function(){return this.getBuffer();},'_writableState.buffer is deprecated. Use _writableState.getBuffer '+'instead.')});}catch(_){}})();var Duplex;function Writable(options){Duplex=Duplex||require('./_stream_duplex');// Writable ctor is applied to Duplexes, though they're not
// instanceof Writable, they're instanceof Readable.
if(!(this instanceof Writable)&&!(this instanceof Duplex))return new Writable(options);this._writableState=new WritableState(options,this);// legacy.
this.writable=true;if(options){if(typeof options.write==='function')this._write=options.write;if(typeof options.writev==='function')this._writev=options.writev;}Stream.call(this);}// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe=function(){this.emit('error',new Error('Cannot pipe, not readable'));};function writeAfterEnd(stream,cb){var er=new Error('write after end');// TODO: defer error events consistently everywhere, not just the cb
stream.emit('error',er);processNextTick(cb,er);}// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream,state,chunk,cb){var valid=true;var er=false;// Always throw error if a null is written
// if we are not in object mode then throw
// if it is not a buffer, string, or undefined.
if(chunk===null){er=new TypeError('May not write null values to stream');}else if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk');}if(er){stream.emit('error',er);processNextTick(cb,er);valid=false;}return valid;}Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState;var ret=false;if(typeof encoding==='function'){cb=encoding;encoding=null;}if(Buffer.isBuffer(chunk))encoding='buffer';else if(!encoding)encoding=state.defaultEncoding;if(typeof cb!=='function')cb=nop;if(state.ended)writeAfterEnd(this,cb);else if(validChunk(this,state,chunk,cb)){state.pendingcb++;ret=writeOrBuffer(this,state,chunk,encoding,cb);}return ret;};Writable.prototype.cork=function(){var state=this._writableState;state.corked++;};Writable.prototype.uncork=function(){var state=this._writableState;if(state.corked){state.corked--;if(!state.writing&&!state.corked&&!state.finished&&!state.bufferProcessing&&state.bufferedRequest)clearBuffer(this,state);}};Writable.prototype.setDefaultEncoding=function setDefaultEncoding(encoding){// node::ParseEncoding() requires lower case.
if(typeof encoding==='string')encoding=encoding.toLowerCase();if(!(['hex','utf8','utf-8','ascii','binary','base64','ucs2','ucs-2','utf16le','utf-16le','raw'].indexOf((encoding+'').toLowerCase())>-1))throw new TypeError('Unknown encoding: '+encoding);this._writableState.defaultEncoding=encoding;return this;};function decodeChunk(state,chunk,encoding){if(!state.objectMode&&state.decodeStrings!==false&&typeof chunk==='string'){chunk=bufferShim.from(chunk,encoding);}return chunk;}// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream,state,chunk,encoding,cb){chunk=decodeChunk(state,chunk,encoding);if(Buffer.isBuffer(chunk))encoding='buffer';var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;// we must ensure that previous needDrain will not be reset to false.
if(!ret)state.needDrain=true;if(state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest=new WriteReq(chunk,encoding,cb);if(last){last.next=state.lastBufferedRequest;}else{state.bufferedRequest=state.lastBufferedRequest;}state.bufferedRequestCount+=1;}else{doWrite(stream,state,false,len,chunk,encoding,cb);}return ret;}function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len;state.writecb=cb;state.writing=true;state.sync=true;if(writev)stream._writev(chunk,state.onwrite);else stream._write(chunk,encoding,state.onwrite);state.sync=false;}function onwriteError(stream,state,sync,er,cb){--state.pendingcb;if(sync)processNextTick(cb,er);else cb(er);stream._writableState.errorEmitted=true;stream.emit('error',er);}function onwriteStateUpdate(state){state.writing=false;state.writecb=null;state.length-=state.writelen;state.writelen=0;}function onwrite(stream,er){var state=stream._writableState;var sync=state.sync;var cb=state.writecb;onwriteStateUpdate(state);if(er)onwriteError(stream,state,sync,er,cb);else{// Check if we're actually ready to finish, but don't emit yet
var finished=needFinish(state);if(!finished&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest){clearBuffer(stream,state);}if(sync){/*<replacement>*/asyncWrite(afterWrite,stream,state,finished,cb);/*</replacement>*/}else{afterWrite(stream,state,finished,cb);}}}function afterWrite(stream,state,finished,cb){if(!finished)onwriteDrain(stream,state);state.pendingcb--;cb();finishMaybe(stream,state);}// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream,state){if(state.length===0&&state.needDrain){state.needDrain=false;stream.emit('drain');}}// if there's something in the buffer waiting, then process it
function clearBuffer(stream,state){state.bufferProcessing=true;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){// Fast case, write everything using _writev()
var l=state.bufferedRequestCount;var buffer=new Array(l);var holder=state.corkedRequestsFree;holder.entry=entry;var count=0;while(entry){buffer[count]=entry;entry=entry.next;count+=1;}doWrite(stream,state,true,state.length,buffer,'',holder.finish);// doWrite is almost always async, defer these to save a bit of time
// as the hot path ends with doWrite
state.pendingcb++;state.lastBufferedRequest=null;if(holder.next){state.corkedRequestsFree=holder.next;holder.next=null;}else{state.corkedRequestsFree=new CorkedRequest(state);}}else{// Slow case, write chunks one-by-one
while(entry){var chunk=entry.chunk;var encoding=entry.encoding;var cb=entry.callback;var len=state.objectMode?1:chunk.length;doWrite(stream,state,false,len,chunk,encoding,cb);entry=entry.next;// if we didn't call the onwrite immediately, then
// it means that we need to wait until it does.
// also, that means that the chunk and cb are currently
// being processed, so move the buffer counter past them.
if(state.writing){break;}}if(entry===null)state.lastBufferedRequest=null;}state.bufferedRequestCount=0;state.bufferedRequest=entry;state.bufferProcessing=false;}Writable.prototype._write=function(chunk,encoding,cb){cb(new Error('not implemented'));};Writable.prototype._writev=null;Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;if(typeof chunk==='function'){cb=chunk;chunk=null;encoding=null;}else if(typeof encoding==='function'){cb=encoding;encoding=null;}if(chunk!==null&&chunk!==undefined)this.write(chunk,encoding);// .end() fully uncorks
if(state.corked){state.corked=1;this.uncork();}// ignore unnecessary end() calls.
if(!state.ending&&!state.finished)endWritable(this,state,cb);};function needFinish(state){return state.ending&&state.length===0&&state.bufferedRequest===null&&!state.finished&&!state.writing;}function prefinish(stream,state){if(!state.prefinished){state.prefinished=true;stream.emit('prefinish');}}function finishMaybe(stream,state){var need=needFinish(state);if(need){if(state.pendingcb===0){prefinish(stream,state);state.finished=true;stream.emit('finish');}else{prefinish(stream,state);}}return need;}function endWritable(stream,state,cb){state.ending=true;finishMaybe(stream,state);if(cb){if(state.finished)processNextTick(cb);else stream.once('finish',cb);}state.ended=true;stream.writable=false;}// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state){var _this=this;this.next=null;this.entry=null;this.finish=function(err){var entry=_this.entry;_this.entry=null;while(entry){var cb=entry.callback;state.pendingcb--;cb(err);entry=entry.next;}if(state.corkedRequestsFree){state.corkedRequestsFree.next=_this;}else{state.corkedRequestsFree=_this;}};}}).call(this,require('_process'));},{"./_stream_duplex":415,"_process":413,"buffer":405,"buffer-shims":404,"core-util-is":406,"events":407,"inherits":409,"process-nextick-args":412,"util-deprecate":427}],420:[function(require,module,exports){arguments[4][357][0].apply(exports,arguments);},{"buffer":405,"buffer-shims":404,"dup":357}],421:[function(require,module,exports){module.exports=require("./lib/_stream_passthrough.js");},{"./lib/_stream_passthrough.js":416}],422:[function(require,module,exports){arguments[4][358][0].apply(exports,arguments);},{"./lib/_stream_duplex.js":415,"./lib/_stream_passthrough.js":416,"./lib/_stream_readable.js":417,"./lib/_stream_transform.js":418,"./lib/_stream_writable.js":419,"_process":413,"dup":358}],423:[function(require,module,exports){module.exports=require("./lib/_stream_transform.js");},{"./lib/_stream_transform.js":418}],424:[function(require,module,exports){module.exports=require("./lib/_stream_writable.js");},{"./lib/_stream_writable.js":419}],425:[function(require,module,exports){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
module.exports=Stream;var EE=require('events').EventEmitter;var inherits=require('inherits');inherits(Stream,EE);Stream.Readable=require('readable-stream/readable.js');Stream.Writable=require('readable-stream/writable.js');Stream.Duplex=require('readable-stream/duplex.js');Stream.Transform=require('readable-stream/transform.js');Stream.PassThrough=require('readable-stream/passthrough.js');// Backwards-compat with node 0.4.x
Stream.Stream=Stream;// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.
function Stream(){EE.call(this);}Stream.prototype.pipe=function(dest,options){var source=this;function ondata(chunk){if(dest.writable){if(false===dest.write(chunk)&&source.pause){source.pause();}}}source.on('data',ondata);function ondrain(){if(source.readable&&source.resume){source.resume();}}dest.on('drain',ondrain);// If the 'end' option is not supplied, dest.end() will be called when
// source gets the 'end' or 'close' events.  Only dest.end() once.
if(!dest._isStdio&&(!options||options.end!==false)){source.on('end',onend);source.on('close',onclose);}var didOnEnd=false;function onend(){if(didOnEnd)return;didOnEnd=true;dest.end();}function onclose(){if(didOnEnd)return;didOnEnd=true;if(typeof dest.destroy==='function')dest.destroy();}// don't leave dangling pipes when there are errors.
function onerror(er){cleanup();if(EE.listenerCount(this,'error')===0){throw er;// Unhandled stream error in pipe.
}}source.on('error',onerror);dest.on('error',onerror);// remove all the event listeners that were added.
function cleanup(){source.removeListener('data',ondata);dest.removeListener('drain',ondrain);source.removeListener('end',onend);source.removeListener('close',onclose);source.removeListener('error',onerror);dest.removeListener('error',onerror);source.removeListener('end',cleanup);source.removeListener('close',cleanup);dest.removeListener('close',cleanup);}source.on('end',cleanup);source.on('close',cleanup);dest.on('close',cleanup);dest.emit('pipe',source);// Allow for unix-like usage: A.pipe(B).pipe(C)
return dest;};},{"events":407,"inherits":409,"readable-stream/duplex.js":414,"readable-stream/passthrough.js":421,"readable-stream/readable.js":422,"readable-stream/transform.js":423,"readable-stream/writable.js":424}],426:[function(require,module,exports){arguments[4][380][0].apply(exports,arguments);},{"buffer":405,"dup":380}],427:[function(require,module,exports){arguments[4][382][0].apply(exports,arguments);},{"dup":382}],428:[function(require,module,exports){arguments[4][329][0].apply(exports,arguments);},{"dup":329}],429:[function(require,module,exports){module.exports=function isBuffer(arg){return arg&&(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&typeof arg.copy==='function'&&typeof arg.fill==='function'&&typeof arg.readUInt8==='function';};},{}],430:[function(require,module,exports){(function(process,global){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var formatRegExp=/%[sdj%]/g;exports.format=function(f){if(!isString(f)){var objects=[];for(var i=0;i<arguments.length;i++){objects.push(inspect(arguments[i]));}return objects.join(' ');}var i=1;var args=arguments;var len=args.length;var str=String(f).replace(formatRegExp,function(x){if(x==='%%')return'%';if(i>=len)return x;switch(x){case'%s':return String(args[i++]);case'%d':return Number(args[i++]);case'%j':try{return JSON.stringify(args[i++]);}catch(_){return'[Circular]';}default:return x;}});for(var x=args[i];i<len;x=args[++i]){if(isNull(x)||!isObject(x)){str+=' '+x;}else{str+=' '+inspect(x);}}return str;};// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate=function(fn,msg){// Allow for deprecating things in the process of starting up.
if(isUndefined(global.process)){return function(){return exports.deprecate(fn,msg).apply(this,arguments);};}if(process.noDeprecation===true){return fn;}var warned=false;function deprecated(){if(!warned){if(process.throwDeprecation){throw new Error(msg);}else if(process.traceDeprecation){console.trace(msg);}else{console.error(msg);}warned=true;}return fn.apply(this,arguments);}return deprecated;};var debugs={};var debugEnviron;exports.debuglog=function(set){if(isUndefined(debugEnviron))debugEnviron=process.env.NODE_DEBUG||'';set=set.toUpperCase();if(!debugs[set]){if(new RegExp('\\b'+set+'\\b','i').test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=exports.format.apply(exports,arguments);console.error('%s %d: %s',set,pid,msg);};}else{debugs[set]=function(){};}}return debugs[set];};/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 *//* legacy: obj, showHidden, depth, colors*/function inspect(obj,opts){// default options
var ctx={seen:[],stylize:stylizeNoColor};// legacy...
if(arguments.length>=3)ctx.depth=arguments[2];if(arguments.length>=4)ctx.colors=arguments[3];if(isBoolean(opts)){// legacy...
ctx.showHidden=opts;}else if(opts){// got an "options" object
exports._extend(ctx,opts);}// set default options
if(isUndefined(ctx.showHidden))ctx.showHidden=false;if(isUndefined(ctx.depth))ctx.depth=2;if(isUndefined(ctx.colors))ctx.colors=false;if(isUndefined(ctx.customInspect))ctx.customInspect=true;if(ctx.colors)ctx.stylize=stylizeWithColor;return formatValue(ctx,obj,ctx.depth);}exports.inspect=inspect;// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors={'bold':[1,22],'italic':[3,23],'underline':[4,24],'inverse':[7,27],'white':[37,39],'grey':[90,39],'black':[30,39],'blue':[34,39],'cyan':[36,39],'green':[32,39],'magenta':[35,39],'red':[31,39],'yellow':[33,39]};// Don't use 'blue' not visible on cmd.exe
inspect.styles={'special':'cyan','number':'yellow','boolean':'yellow','undefined':'grey','null':'bold','string':'green','date':'magenta',// "name": intentionally not styling
'regexp':'red'};function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];if(style){return"\x1B["+inspect.colors[style][0]+'m'+str+"\x1B["+inspect.colors[style][1]+'m';}else{return str;}}function stylizeNoColor(str,styleType){return str;}function arrayToHash(array){var hash={};array.forEach(function(val,idx){hash[val]=true;});return hash;}function formatValue(ctx,value,recurseTimes){// Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it
if(ctx.customInspect&&value&&isFunction(value.inspect)&&// Filter out the util module, it's inspect function is special
value.inspect!==exports.inspect&&// Also filter out any prototype objects using the circular check.
!(value.constructor&&value.constructor.prototype===value)){var ret=value.inspect(recurseTimes,ctx);if(!isString(ret)){ret=formatValue(ctx,ret,recurseTimes);}return ret;}// Primitive types cannot have properties
var primitive=formatPrimitive(ctx,value);if(primitive){return primitive;}// Look up the keys of the object.
var keys=Object.keys(value);var visibleKeys=arrayToHash(keys);if(ctx.showHidden){keys=Object.getOwnPropertyNames(value);}// IE doesn't make error fields non-enumerable
// http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
if(isError(value)&&(keys.indexOf('message')>=0||keys.indexOf('description')>=0)){return formatError(value);}// Some type of object without properties can be shortcutted.
if(keys.length===0){if(isFunction(value)){var name=value.name?': '+value.name:'';return ctx.stylize('[Function'+name+']','special');}if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}if(isDate(value)){return ctx.stylize(Date.prototype.toString.call(value),'date');}if(isError(value)){return formatError(value);}}var base='',array=false,braces=['{','}'];// Make Array say that they are Array
if(isArray(value)){array=true;braces=['[',']'];}// Make functions say that they are functions
if(isFunction(value)){var n=value.name?': '+value.name:'';base=' [Function'+n+']';}// Make RegExps say that they are RegExps
if(isRegExp(value)){base=' '+RegExp.prototype.toString.call(value);}// Make dates with properties first say the date
if(isDate(value)){base=' '+Date.prototype.toUTCString.call(value);}// Make error with message first say the error
if(isError(value)){base=' '+formatError(value);}if(keys.length===0&&(!array||value.length==0)){return braces[0]+base+braces[1];}if(recurseTimes<0){if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}else{return ctx.stylize('[Object]','special');}}ctx.seen.push(value);var output;if(array){output=formatArray(ctx,value,recurseTimes,visibleKeys,keys);}else{output=keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array);});}ctx.seen.pop();return reduceToSingleString(output,base,braces);}function formatPrimitive(ctx,value){if(isUndefined(value))return ctx.stylize('undefined','undefined');if(isString(value)){var simple='\''+JSON.stringify(value).replace(/^"|"$/g,'').replace(/'/g,"\\'").replace(/\\"/g,'"')+'\'';return ctx.stylize(simple,'string');}if(isNumber(value))return ctx.stylize(''+value,'number');if(isBoolean(value))return ctx.stylize(''+value,'boolean');// For some reason typeof null is "object", so special case here.
if(isNull(value))return ctx.stylize('null','null');}function formatError(value){return'['+Error.prototype.toString.call(value)+']';}function formatArray(ctx,value,recurseTimes,visibleKeys,keys){var output=[];for(var i=0,l=value.length;i<l;++i){if(hasOwnProperty(value,String(i))){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),true));}else{output.push('');}}keys.forEach(function(key){if(!key.match(/^\d+$/)){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,true));}});return output;}function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]};if(desc.get){if(desc.set){str=ctx.stylize('[Getter/Setter]','special');}else{str=ctx.stylize('[Getter]','special');}}else{if(desc.set){str=ctx.stylize('[Setter]','special');}}if(!hasOwnProperty(visibleKeys,key)){name='['+key+']';}if(!str){if(ctx.seen.indexOf(desc.value)<0){if(isNull(recurseTimes)){str=formatValue(ctx,desc.value,null);}else{str=formatValue(ctx,desc.value,recurseTimes-1);}if(str.indexOf('\n')>-1){if(array){str=str.split('\n').map(function(line){return'  '+line;}).join('\n').substr(2);}else{str='\n'+str.split('\n').map(function(line){return'   '+line;}).join('\n');}}}else{str=ctx.stylize('[Circular]','special');}}if(isUndefined(name)){if(array&&key.match(/^\d+$/)){return str;}name=JSON.stringify(''+key);if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){name=name.substr(1,name.length-2);name=ctx.stylize(name,'name');}else{name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");name=ctx.stylize(name,'string');}}return name+': '+str;}function reduceToSingleString(output,base,braces){var numLinesEst=0;var length=output.reduce(function(prev,cur){numLinesEst++;if(cur.indexOf('\n')>=0)numLinesEst++;return prev+cur.replace(/\u001b\[\d\d?m/g,'').length+1;},0);if(length>60){return braces[0]+(base===''?'':base+'\n ')+' '+output.join(',\n  ')+' '+braces[1];}return braces[0]+base+' '+output.join(', ')+' '+braces[1];}// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar){return Array.isArray(ar);}exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean';}exports.isBoolean=isBoolean;function isNull(arg){return arg===null;}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null;}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number';}exports.isNumber=isNumber;function isString(arg){return typeof arg==='string';}exports.isString=isString;function isSymbol(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol';}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0;}exports.isUndefined=isUndefined;function isRegExp(re){return isObject(re)&&objectToString(re)==='[object RegExp]';}exports.isRegExp=isRegExp;function isObject(arg){return(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&arg!==null;}exports.isObject=isObject;function isDate(d){return isObject(d)&&objectToString(d)==='[object Date]';}exports.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==='[object Error]'||e instanceof Error);}exports.isError=isError;function isFunction(arg){return typeof arg==='function';}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol'||// ES6 symbol
typeof arg==='undefined';}exports.isPrimitive=isPrimitive;exports.isBuffer=require('./support/isBuffer');function objectToString(o){return Object.prototype.toString.call(o);}function pad(n){return n<10?'0'+n.toString(10):n.toString(10);}var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];// 26 Feb 16:19:34
function timestamp(){var d=new Date();var time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(':');return[d.getDate(),months[d.getMonth()],time].join(' ');}// log is just a thin wrapper to console.log that prepends a timestamp
exports.log=function(){console.log('%s - %s',timestamp(),exports.format.apply(exports,arguments));};/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */exports.inherits=require('inherits');exports._extend=function(origin,add){// Don't do anything if add isn't an object
if(!add||!isObject(add))return origin;var keys=Object.keys(add);var i=keys.length;while(i--){origin[keys[i]]=add[keys[i]];}return origin;};function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop);}}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./support/isBuffer":429,"_process":413,"inherits":428}]},{},[401])(401);});
