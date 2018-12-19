function extractFilename(path) {
  if (path.substr(0, 12) == "C:\\fakepath\\")
    return path.substr(12); // modern browser
  let x;
  x = path.lastIndexOf('/');
  if (x >= 0) // Unix-based path
    return path.substr(x + 1);
  x = path.lastIndexOf('\\');
  if (x >= 0) // Windows-based path
    return path.substr(x + 1);
  return path; // just the file name
}

function updateFilenames(path) {
  let name = extractFilename(path);
  document.getElementById('file-label').innerText = name;
  document.getElementById('music-name').value = name;
}
