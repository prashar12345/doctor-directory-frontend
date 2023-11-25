function isNumber(e){
    let key = e;
    console.log("value", key)
    if (key.value.length > key.maxLength) key.value = key.value.slice(0, key.maxLength);
    key.value = key.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
}