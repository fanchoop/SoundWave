function songSubmit(e) {
    e.preventDefautlt();
    appendAlert('eheheheeh', 4000);
}

function extractFilenameNoExt (path) {
    let filename = extractFilename(path).split('.');
    filename.splice(filename.length - 1, 1);
    return filename.join('');

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

function updateFilenames(string, target) {
    if (string != "") {
        target.innerText = string;
        target.value = string;
    }
}