/**
 * Add a class to a DOM element
 * @param {Element} target element that the class will be added
 * @param {String} name the name of the class
 */
function addClass(target, name) {
    if (target.className.baseVal.indexOf(name) == -1) {
        target.className.baseVal += " " + name;
    }
}


/**
 * remove a class from a DOM element
 * @param {Element} target element from whitch the class will be removed
 * @param {String} name the of tha class
 */
function removeClass(target, name) {
    target.className.baseVal = target.className.baseVal.replace(name, "");
}