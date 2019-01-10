function appendAlert(msg, timeout) {
    let cross = document.createElement("span");
    cross.classList.add("delete-icon");
    cross.classList.add("float-right");
    cross.innerText = "×";

    let alert = document.createElement("div");
    alert.classList.add("alert");
    alert.classList.add("alert-success");
    alert.classList.add("float-right");

    alert.setAttribute("role", "alert");
    alert.style.transition = "opacity " + timeout*0.66 + "ms ease-in";
    alert.innerText = msg;
    alert.onclick = function(e) {
        closeAlert(e.currentTarget);
    };

    alert.appendChild(cross);
    document.body.appendChild(alert);
    
    window.setTimeout(function() {
        alert.classList.add('masking');
    }, timeout*0.34);
    window.setTimeout(function() {
        closeAlert(alert);
    }, timeout);
}

function closeAlert(alert) {
    if (alert.parentElement != null) {
        alert.parentElement.removeChild(alert);
    }
}
