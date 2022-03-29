/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

const Playground = () => {
  function hex(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
      // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
      const value = view.getUint32(i);
      // toString(16) will give the hex representation of the number without padding
      const stringValue = value.toString(16);
      // We use concatenation and slice for padding
      const padding = '00000000';
      const paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }
    // Join all the hex strings into one

    return hexCodes.join('');
  }

  function getHash(type) {
    const str = document.getElementById('plainTextGCM').value;
    const buffer = new TextEncoder('utf-8').encode(str);
    const typeHash = type;
    return crypto.subtle.digest(typeHash, buffer).then((hash) => {
      document.getElementById('hashtext').value = hex(hash);
    });
  }

  return (
    <div>
      <h1>Playground</h1>
      <p>Plain Text: </p>
      <input type="text" id="plainTextGCM" value="Hola mundo" />
      <button type="button" onClick={() => getHash('SHA-256')}>
        SHA 256
      </button>
      <button type="button" onClick={() => getHash('SHA-512')}>
        SHA 512
      </button>
      <button type="button" onClick={() => getHash('SHA-1')}>
        SHA 1
      </button>
      <div>
        <p> Hashed Text:</p> <input type="text" id="hashtext" size="120" />
      </div>
    </div>
  );
};

export default Playground;
