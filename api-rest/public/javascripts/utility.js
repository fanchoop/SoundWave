Utility.prototype.svgURI = "http://www.w3.org/2000/svg";

/**
 * Add a class to a DOM element
 * @param {Element} target element that the class will be added
 * @param {String} name the name of the class
 */

Utility.prototype.addClassSvg = function (target, name) {
    if (target.className.baseVal.indexOf(name) == -1) {
        target.className.baseVal += " " + name;
    } 
}

Utility.prototype.addClass = function (target, name) {
    if (target.className.indexOf(" " + name) == -1) {
        target.className += " " + name;
    } 
}

/**
 * remove a class from a DOM element
 * @param {Element} target element from whitch the class will be removed
 * @param {String} name the of tha class
 */
Utility.prototype.removeClassSvg = function (target, name) {
    target.className.baseVal = target.className.baseVal.replace(name, "");
}
Utility.prototype.removeClass = function (target, name) {
    target.className = target.className.replace(" " + name, "");
}


/**
 * create a svg rect and returns it
 * @param {Number} x x of the rect
 * @param {Number} y y of the rect
 * @param {Number} rx round corner
 * @param {Number} ry round corners
 * @param {Number} width width of the rect
 * @param {Number} height height of the rect
 * @param {String} style inline style os the rect
 * @return the new rext svg
 */
Utility.prototype.createRectSvg = function (x, y, rx, ry, width, height, style) {
    let rect = document.createElementNS(this.svgURI, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("rx", rx);
    rect.setAttribute("ry", ry);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("style", style);
    return rect;
}

/**
 * renvoie le dernier peak possedant la classe CSS "passed". 
 * Il est considéré comme le dernier élément "actif"
 * @return {Element} le pique en question ou le premier pique du svg
 */
Utility.prototype.findCurrentPeak = function () {
    let arr = document.querySelectorAll("rect.passed");
    if (arr.length > 0) {
        return arr[arr.length - 1];
    } else {
        //selectionne le premier pique du svg
        let peak = document.querySelector("svg > rect");
        util.addClassSvg(peak, 'passed');
        return peak;
    }
}

/**
 * find a DOM element in the next siblings of the current element
 * @param {Element} current the current element
 * @param {function(Element): boolean} condition return true if the current element is the right one, false if not
 */
Utility.prototype.searchRight = function(current, condition) {
    if(current != null) {
        if(condition(current)) {
            return current;
        } else {
            return this.searchRight(current.nextElementSibling, condition);
        }
    }
    return null;
}

/**
 * find a rect that is x position is under the given one*
 * the search will only be executed on the nexts siblings of the current peak 
 * @param {Number} x the given x position
 */
Utility.prototype.searchRect = function (x) {
    return this.searchRight(this.findCurrentPeak(), function(current) {
        if(current.nextElementSibling) {
            return parseInt(current.nextElementSibling.getAttribute("x")) > x;
        } else {
            return true;
        }
    });
}

/**
 * return x in pixel
 */
Utility.prototype.getXFromTime = function (time) {
    let svg = document.querySelector("svg");
    return svg.getBoundingClientRect().width*(time/ (util.duree * 1000));
}

/**
 * return time in second
 */
Utility.prototype.getTimeFromX = function (x) {
    let svg = document.querySelector("svg");
    return (x/svg.getBoundingClientRect().width) * util.duree;    
}

/**
 * calcule la moyenne des valeur absolue d'un tableau
 * @param {Array} array tableau dont la moyenne est calculé
 */
Utility.prototype.averageAbs = function(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += Math.abs(array[i]);
    }
    return sum / array.length;
}

/**
 * return la valeur absolue maximale d'un tableau donnée
 * @param {Array} array tableau dont la valeur max est extrait
 */
Utility.prototype.findMaxAbs = function (array) {
    let max = 0;
    for (let k = 0; k < array.length; k++) {
        if (max <= Math.abs(array[k])) {
            max = Math.abs(array[k]);
        }
    }
    return max;
}

/**
 * delete every timeout in then arrau
 * @param {Array} timeoutsIds array containing timeouts ids
 */
Utility.prototype.clearTimeouts = function(timeoutsIds) {
    for (let i = 0; i < timeoutsIds.length; i ++) {
        clearTimeout(timeoutsIds[i]);
    }
}

Utility.prototype.SecToMin = function(sec) {
    let minutes = Math.floor(sec/60);
    let remainingSec = sec - minutes * 60;
    if (remainingSec < 10) {
        return minutes + ".0" + Math.round(remainingSec);
    } else {
        return minutes + "." + Math.round(remainingSec);
    }
}

let util = new Utility();