const tokenInputElement = document.getElementById("token");
const headerInputElement = document.getElementById("header");
const payloadInputElement = document.getElementById("payload");
const signatureInputElement = document.getElementById("signature");

/*-----------------Token Related Functions------------------*/

//Cursor Manipulation Shenanigans
let allowCursorMovement = true;
let timeoutId;

//Highlight Token With Colors
function highlightToken(tokenText, tokenElement) {
  console.log(allowCursorMovement);
  const partOptions = [
    {
      id: "token-header",
      colorCode: "#fb015b",
    },
    {
      id: "payload-header",
      colorCode: "#d63aff",
    },
    {
      id: "signature-header",
      colorCode: "#00b9f1",
    },
  ];
  const tokenParts = tokenText.replace(/\s+/, "").split(".");
  while (tokenElement.lastChild) {
    tokenElement.removeChild(tokenElement.lastChild);
  }
  tokenParts.forEach((tokenPart, index) => {
    const partElement = document.createElement("span");
    partElement.id = partOptions[index]?.id ?? `token-part-${index}`;
    partElement.style.color = partOptions[index]?.colorCode ?? "inherit";
    partElement.textContent = tokenPart;
    if (index !== 0) {
      tokenElement.appendChild(document.createTextNode("."));
    }
    tokenElement.appendChild(partElement);
  });
  if (allowCursorMovement) {
    setCursorPositionAtEnd(tokenElement);
  }
  return tokenParts;
}

//Sets the Token
function setToken(token, tokenElement) {
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/g.test(token) && token !== undefined && token.length > 0) {
    setElementValidity(tokenElement, false);
  } else {
    setElementValidity(tokenElement);
  }
  return highlightToken(token, tokenElement);
}

//Verify Token Validity
function verifyTokenSignature(token, validityElement) {}

/*-----------------Token Related Functions------------------*/

/*-----------------Header Related Functions------------------*/

//Set Header Text
function setHeader(headerText = "", headerElement) {
  const { isValid, data: header } = validateBase64JSONString(headerText);
  if (isValid || headerText === undefined || headerText.length === 0) {
    setElementValidity(headerElement);
  } else {
    setElementValidity(headerElement, false);
  }
  headerElement.textContent = header ? JSON.stringify(header, null, "  ") : headerText;
}

/*-----------------Header Related Functions------------------*/

/*-----------------Payload Related Functions------------------*/

//Set Payload Text
function setPayload(payloadText = "", payloadElement) {
  const { isValid, data: payload } = validateBase64JSONString(payloadText);
  if (isValid || payloadText === undefined || payloadText.length === 0) {
    setElementValidity(payloadElement);
  } else {
    setElementValidity(payloadElement, false);
  }
  payloadElement.textContent = payload ? JSON.stringify(payload, null, "  ") : payloadText;
}

/*-----------------Payload Related Functions------------------*/

/*-----------------Utility Functions------------------*/

//Validate a Base 64 String as JSON Parsable
function validateBase64JSONString(inputString) {
  let isValid = false;
  let data = null;
  try {
    data = JSON.parse(atob(inputString));
    isValid = true;
  } catch (e) {
    // :)
  }
  return { data, isValid };
}

//Set Cursor at End of an Input
function setCursorPositionAtEnd(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.addRange(range);
  element.focus();
}

function setElementValidity(element, valid = true) {
  element.style.backgroundColor = valid ? "inherit" : "rgba(255,0,0,0.3)";
}

tokenInputElement.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.key === "Backspace") {
    allowCursorMovement = false;
  } else {
    allowCursorMovement = true;
  }
  const [headerPart, payloadPart, signaturePart] = setToken(tokenInputElement.textContent, tokenInputElement);
  setHeader(headerPart, headerInputElement);
  setPayload(payloadPart, payloadInputElement);
  //verifyTokenSignature(tokenInputElement.textContent);
});
