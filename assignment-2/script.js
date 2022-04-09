function getNumber(id) {
  return parseFloat(document.getElementById(id).value)
}

const btnCallbacks = {
  add() {
    return getNumber('num1') + getNumber('num2')
  },

  sub() {
    return getNumber('num1') - getNumber('num2')
  },

  mul() {
    return getNumber('num1') * getNumber('num2')
  },

  div() {
    return getNumber('num1') / getNumber('num2')
  }
}

Object.entries(btnCallbacks).forEach(([btnId, performOp]) => {
  document.getElementById(btnId).onclick = () => {
    const result = performOp()
    document.getElementById('result').innerText = result;
  }
})
