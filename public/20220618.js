function palindrome(word){
    let arr = word.split();

    for (let i = 0; i < arr.length; i++){
        let b = arr.length-i-1;
        if(arr[i]!==arr[b]) return false;
        if (i>=b) return true;
    }
    return true;    
}

