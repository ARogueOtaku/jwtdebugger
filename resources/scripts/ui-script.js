import {
  setHeader,
  setPayload,
  setToken,
  verifyTokenSignature,
  setCaretPositionAtEnd,
  highlightToken,
  getCaretPosition,
  setCaretPosition,
} from "./utils.js";

const tokenInputElement = document.getElementById("token");
const headerInputElement = document.getElementById("header");
const payloadInputElement = document.getElementById("payload");
const signatureInputElement = document.getElementById("signature");
const validIconElement = document.getElementById("valid-icon");
const invalidIconElement = document.getElementById("invalid-icon");
const validityTextElement = document.getElementById("signature-validity");

const NO_OPERATIONS = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Alt",
  "Enter",
  "Shift",
  "Tab",
  "Home",
  "End",
];
const RESTORE_CURSOR = ["Backspace"];
let NO_OPERATIONS_FLAG = false;

tokenInputElement.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && ["a", "c", "x", "z", "y"].includes(e.key.toLowerCase())) {
    NO_OPERATIONS_FLAG = true;
  } else {
    NO_OPERATIONS_FLAG = false;
  }
});

tokenInputElement.addEventListener("keyup", (e) => {
  if (NO_OPERATIONS.includes(e.key) || NO_OPERATIONS_FLAG) {
    return;
  }
  const { position: caretPosition } = getCaretPosition(tokenInputElement);
  const [headerPart, payloadPart, signaturePart] = setToken(tokenInputElement.textContent, tokenInputElement);
  highlightToken(tokenInputElement.textContent, tokenInputElement);
  if (RESTORE_CURSOR.includes(e.key)) {
    setCaretPosition(tokenInputElement, caretPosition);
  } else {
    setCaretPositionAtEnd(tokenInputElement);
  }
  setHeader(headerPart, headerInputElement);
  setPayload(payloadPart, payloadInputElement);
  verifyTokenSignature(
    tokenInputElement.textContent,
    "your-256-bit-secret",
    validIconElement,
    invalidIconElement,
    validityTextElement
  );
});
