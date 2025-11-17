let value="ABC";
let bufferValue=Buffer.from(value);

let value2=" XYZ";
let bufferValue2=Buffer.from(value2);

console.log(bufferValue,bufferValue2);
let combinedBuffer=Buffer.concat([bufferValue,bufferValue2]);
console.log(combinedBuffer);