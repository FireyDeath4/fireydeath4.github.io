/**
 * ZLIB functions.
 *
 * This source file uses pako under the MIT license. The license is available at:
 *
 * https://github.com/nodeca/pako/blob/master/LICENSE
 *
 * This source file uses zlib under the zlib license. The license is available at:
 *
 * https://zlib.net/zlib_license.html
 */

//Also I made it more dense, to satisfy myself

function textToGzip(input)
	{try{var uint8Array=pako.gzip(input);
		var stringValue=uint8ToString(uint8Array);
		return btoa(stringValue)}
	catch(error){console.log(error);
		if(error.name==="InvalidCharacterError")
		throw new Error("Invalid character in text to be encoded into GZIP.");
		else throw new Error("Cannot encode text into GZIP.")}}

function gzipToText(input)
	{try{var stringValue=atob(input.trim()),
			charArray=stringValue.split('').map(function(x)
				{return x.charCodeAt(0)});
		return pako.ungzip(charArray,{to:"string"})}
	catch(error){throw new Error("Value is not a valid GZIP compressed text.")}}

function textToDeflate(input)
	{try{var uint8Array=pako.deflate(input),
			stringValue=uint8ToString(uint8Array);
		return btoa(stringValue)}
	catch(error)
		{if(error.name==="InvalidCharacterError")throw new Error
			("Invalid character in text to be encoded into Deflate.");
		else throw new Error("Cannot encode text into Deflate.")}}

function deflateToText(input)
	{try{var stringValue=atob(input.trim()),
			charArray=stringValue.split('').map(function(x)
				{return x.charCodeAt(0)});
		return pako.inflate(charArray,{ to: "string" })}
	catch(error){
		throw new Error("Value is not a valid Deflate compressed text.")}}

function uint8ToString(uint8Value)
	{var bufferSize=0x8000,c=[];
	for(var i=0;i<uint8Value.length;i+=bufferSize)
		{c.push(String.fromCharCode.apply
			(null,uint8Value.subarray(i,i+bufferSize)))}
	return c.join("")}