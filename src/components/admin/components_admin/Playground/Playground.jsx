/* eslint-disable no-shadow */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import styles from './playground.module.scss';

const Playground = () => {
  const [input, setInput] = useState('Hola mundo');
  const crypts = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

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

  const generateKey = () => {
    window.crypto.subtle
      .generateKey(
        {
          name: 'RSA-PSS',
          modulusLength: 2048, // can be 1024, 2048, or 4096
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: 'SHA-256' } // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        false, // whether the key is extractable (i.e. can be used in exportKey)
        ['sign', 'verify'] // can be any combination of "sign" and "verify"
      )
      .then((key) => {
        // returns a keypair object
        console.log(key);
        console.log(key.publicKey);
        console.log(key.privateKey);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const rsapss = () => {
    generateKey();
  };

  return (
    <div>
      <h1>Hash</h1>
      <p>Ingresa el texto:</p>
      <input
        type="text"
        id="plainTextGCM"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <div className={styles.flex}>
        {crypts.map((c) => (
          <button
            className={styles.addBt}
            type="button"
            onClick={() => getHash(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div>
        <p>Texto hasheado:</p>{' '}
        <textarea type="text" cols="50" rows={5} id="hashtext" size="124" />
      </div>
      <button onClick={rsapss} type="button">
        RSA PSS
      </button>
    </div>
  );
};

export default Playground;
