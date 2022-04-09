/*-----------------Utility Functions------------------*/
//Validate a Base 64 String
function validateBase64String(inputString) {
  let isValid = false;
  let data = null;
  try {
    data = window.atob(inputString);
    isValid = true;
  } catch (e) {
    // :)
  }
  return { data, isValid };
}

//Validate a JSON Parsable String
function validateJSONString(inputString) {
  let isValid = false;
  let data = null;
  try {
    data = JSON.parse(inputString);
    isValid = true;
  } catch (e) {
    // :)
  }
  return { data, isValid };
}

//Validate a Base 64 String as JSON Parsable
function validateBase64JSONString(inputString) {
  let data = null;
  let isValid = false;
  const { data: decodedData, isValid: base64Valid } = validateBase64String(inputString);
  if (base64Valid) {
    const { data: jsonData, isValid: jsonIsValid } = validateJSONString(decodedData);
    data = jsonData;
    isValid = jsonIsValid;
  }
  return { data, isValid };
}

//Set Cursor at End of an Input
function setCaretPositionAtEnd(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.addRange(range);
  element.focus();
}

//Get Current Caret Position
function getCaretPosition(element, selection = document.getSelection(), position = 0) {
  let found = false;
  if (element === selection.focusNode) {
    position += selection.focusOffset;
    found = true;
  } else if (!element.contains(selection.focusNode)) {
    position += element.textContent.length;
  } else {
    const allChildNodes = element.childNodes;
    for (let i = 0; i < allChildNodes.length && !found; i++) {
      const { position: pos, found: fFlag } = getCaretPosition(allChildNodes[i], selection, position);
      position = pos;
      found = fFlag;
    }
  }
  return { position, found };
}

//Set Caret Position
function setCaretPosition(element, position) {
  function traverseNode(node) {
    if (node.hasChildNodes()) {
      const allChildNodes = node.childNodes;
      for (let i = 0; i < allChildNodes.length && position > 0; i++) {
        node = traverseNode(allChildNodes[i]);
      }
    } else if (position > node.textContent.length) {
      position -= node.textContent.length;
    }
    return node;
  }
  const selection = window.getSelection();
  const range = document.createRange();
  const node = traverseNode(element);
  range.setStart(node, position);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
}

//Set Visual Indicator if an Element is Valid
function setElementValidity(element, valid = true) {
  element.style.backgroundColor = valid ? "inherit" : "rgba(255,0,0,0.3)";
}
/*-----------------Utility Functions------------------*/

/*-----------------Token Related Functions------------------*/

//Highlight Token With Colors
function highlightToken(tokenText, tokenElement) {
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
}

//Sets the Token
function setToken(token, tokenElement) {
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/g.test(token) && token !== undefined && token.length > 0) {
    setElementValidity(tokenElement, false);
  } else {
    setElementValidity(tokenElement);
  }
  return token.replace(/\s+/, "").split(".");
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

export {
  validateBase64String,
  validateJSONString,
  validateBase64JSONString,
  setCaretPositionAtEnd,
  setElementValidity,
  setToken,
  setHeader,
  setPayload,
  highlightToken,
  verifyTokenSignature,
  getCaretPosition,
  setCaretPosition,
};
