const NUMBER = 0;
const EQUALS = 1;
const OPERATION = 2;
const CLEAR = 3;

let computation = "";

function addListeners() {
    let nums = getNumberNodes();
    let oper = getOperatorNodes();
    let equal = getEqualNode();
    let clear = getClearNode();

    nums.forEach(numberNode => {
        numberNode.addEventListener("click", numberListener);
    });
    oper.forEach(operatorNode => {
        operatorNode.addEventListener("click", operatorListener);
    })
    equal.addEventListener("click", equalListener);
    clear.addEventListener("click", clearListener);
}

function numberListener(event) {
    let num = event.currentTarget.textContent;
    update(NUMBER, num);
}

function operatorListener(event) {
    let oper = event.currentTarget.textContent;
    update(OPERATION, oper);
}

function equalListener() {
    update(EQUALS, null);
}

function clearListener() {
    update(CLEAR, null);
}

function getNumberNodes() {
    return document.querySelector(".nums").childNodes;
}
function getOperatorNodes() {
    return document.querySelector(".oper").childNodes;
}
function getEqualNode() {
    return document.querySelector(".misc__equal");
}
function getClearNode() {
    return document.querySelector(".misc__clear");
}


// Updates display and the computation string
// updateDisplay() handles the display, update() handles the computation string
// Is called whenever a calculator button is pressed
function update(action, value) {
    switch(action) {
        // Numbers added to the computation string will never cause an invalid expression
        case NUMBER: 
            computation += value;
            updateDisplay(value);
            break;
        case OPERATION: 
            if (canCompute(computation)) {
                computation = compute(computation);
            }
            if (canCompute(computation) || canAddOperator(computation)) {
                computation += value;
                updateDisplay(`${value}`, OPERATION);
            }
            break;
        case EQUALS:
            if (canCompute(computation)) {
                computation = compute(computation);
                updateDisplay(computation, EQUALS);
            }
            break;
        case CLEAR:
            computation = "";
            updateDisplay(null, CLEAR);
            break;
    }
    
}

function updateDisplay(value, flag = null) {
    let dispNode = getDisplay();
    let additional;
    switch(flag) {
        case EQUALS: 
            dispNode.textContent = value;
            break;
        case CLEAR:
            dispNode.textContent = "";
            break;
        case OPERATION:
            // Whitespace between operators in display to improve legibility
            additional = document.createTextNode(` ${value} `);
            dispNode.appendChild(additional);
            break;
        default:
            additional = document.createTextNode(`${value}`);
            dispNode.appendChild(additional);
            break;
    }
}
// Ensures that the computation string is a valid expression, 
// Otherwise something nonsensical like 43+*/2 or 43- might happen
function canCompute(computation) {
    return lastCharacterIsNumber(computation) && firstCharacterIsNumber(computation)
        && containsOperation(computation);
}
// See above
function canAddOperator(computation) {
    return firstCharacterIsNumber(computation) && !containsOperation(computation);
}
function firstCharacterIsNumber(string) {
    console.log(`typeof firstCharacterIsNumber string=${typeof string}`);
    let first = +string.charAt(0);
    return !Number.isNaN(first) && typeof first == "number";
}
function lastCharacterIsNumber(string) {
    let last = +getLastCharacter(string);
    return !Number.isNaN(last) && typeof last == "number";
}
function getLastCharacter(string) {
    return string.charAt(string.length - 1);
}
function containsOperation(string) {
    return string.includes('+') || 
        string.includes('-') || 
        string.includes('*') || 
        string.includes('/');
}
function compute(displayVal) {
    let evaluated = new Function(`return ${displayVal}`)();
    // new Function() will convert the String to a Number, so it must be converted back to String
    return stringify(evaluated); 
}
function getDisplay() {
    return document.querySelector(".display");
}
function stringify(obj) {
    return obj + "";
}

function start() {
    addListeners();
}

start();