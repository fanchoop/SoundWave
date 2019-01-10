function songSubmit(e) {
    e.preventDefautlt();
    console.log('submit');
    appendAlert('eheheheeh', 4000);
}

function test() {
    console.log(document.getElementById('form-song').elements)
}

function extractFilename(path) {
    if (path.substr(0, 12) == "C:\\fakepath\\") return path.substr(12); // modern browser
    let x;
    x = path.lastIndexOf("/");
    if (x >= 0)
        // Unix-based path
        return path.substr(x + 1);
    x = path.lastIndexOf("\\");
    if (x >= 0)
        // Windows-based path
        return path.substr(x + 1);
    return path; // just the file name
}

function updateFilenames(elem, target) {
    console.log(elem.value);
    if (elem.value != "") {
        target.innerText = extractFilename(elem.value);
        target.value = extractFilename(elem.value);
    }
}