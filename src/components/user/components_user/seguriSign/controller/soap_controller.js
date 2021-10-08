/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable object-shorthand */
import 'jquery';
import 'jquery.soap';

const $ = require('jquery');
require('jquery.soap');

class SoapController {
	constructor(segurisignUser) {
		this.segurisignUser = segurisignUser;
		this.passwordDomain = 'HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=';
		this.userDomain = 'ws_test';
		this.idDomain = '1';
	}

	toBase64 = (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

	async addDocumentString(signers, file) {
		const b64 = await this.toBase64(file);
		const b64Str = b64.substr(b64.indexOf(',') + 1);
		let signersJSON = '';
		signers.forEach((signer) => {
			signersJSON = signersJSON.concat(
				`<lstParticipant>
			<infoEmployee>${signer}</infoEmployee>
			<inputDataType>EMAIL</inputDataType>
			<participantType>EMPLOYEE</participantType>
			<role>FIRMANTE</role>
			</lstParticipant>`,
			);
		});
		console.log(signersJSON);
		const settings = {
			url: 'https://feb.seguridata.com/WS_HRVertical_Operations/WSOperationsHRV',
			method: 'POST',
			timeout: 0,
			headers: {
				'Content-Type': 'text/xml',
			},
			data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:addDocumentConfigurationParticipantsHRV>
         <docListParticipantsRequest>
			${signersJSON}
            <docType>CONTRATOS</docType>
            <document>${b64Str}</document>
            <userDomain>${this.userDomain}</userDomain>
            <passwordDomain>${this.passwordDomain}</passwordDomain>
            <docNameWithExtension>${file.name}</docNameWithExtension>
            <automaticSignatureDomain>false</automaticSignatureDomain>
            <idDomain>${this.idDomain}</idDomain>
            <initiatorEmail>${this.segurisignUser.email}</initiatorEmail>
            <initiatorIdRh>${this.segurisignUser.idRh}</initiatorIdRh>
            <domainSignatureAtTheEnd>false</domainSignatureAtTheEnd>
            <concurrentSignature>true</concurrentSignature>
         </docListParticipantsRequest>
      </ser:addDocumentConfigurationParticipantsHRV>
   </soapenv:Body>
</soapenv:Envelope>`,
		};

		return $.ajax(settings).done((response) => {
			const parser = new DOMParser();
			const docResponse = parser.parseFromString(response.documentElement.innerHTML, 'application/xhtml+xml');
			const multilateralId = docResponse.getElementsByTagName('multilateralId')[0].childNodes[0].nodeValue;
			const resultado = docResponse.getElementsByTagName('resultado')[0].childNodes[0].nodeValue;
			return [resultado, { multilateralId }];
		});
	}

	async getHashToSign(multilateralId) {
		const settings = {
			url: 'https://feb.seguridata.com/WS_HRVertical_Operations/WSOperationsHRV',
			method: 'POST',
			timeout: 0,
			headers: {
				'Content-Type': 'text/xml',
			},
			data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:getHashToSign>
	  <documentRequest>
            <idDomain>${this.idDomain}</idDomain>
            <idRhEmp>${this.segurisignUser.idRh}</idRhEmp>
            <multilateralId>${multilateralId}</multilateralId>
            <userDomain>${this.userDomain}</userDomain>
            <passwordDomain>${this.passwordDomain}</passwordDomain>
         </documentRequest> 
	  </ser:getHashToSign>
   </soapenv:Body>
</soapenv:Envelope>`,
		};

		return $.ajax(settings).done((response) => {
			const parser = new DOMParser();
			const docResponse = parser.parseFromString(response.documentElement.innerHTML, 'application/xhtml+xml');
			const hashHex = docResponse.getElementsByTagName('hashHex')[0].childNodes[0].nodeValue;
			const resultado = docResponse.getElementsByTagName('resultado')[0].childNodes[0].nodeValue;
			return resultado === 1 ? hashHex : '';
		});
	}

	async establishHashAndPkcs7(multilateralId, hashHex, password) {
		const settings = {
			url: 'https://feb.seguridata.com/WS_HRVertical_Operations/WSOperationsHRV',
			method: 'POST',
			timeout: 0,
			headers: {
				'Content-Type': 'text/xml',
			},
			data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:establishHashAndPkcs7>
	  <documentRequest>
            <idDomain>${this.idDomain}</idDomain>
            <idRhEmp>${this.segurisignUser.idRh}</idRhEmp>
            <multilateralId>${multilateralId}</multilateralId>
            <userDomain>${this.userDomain}</userDomain>
            <passwordDomain>${this.passwordDomain}</passwordDomain>
         </documentRequest> 
		          <hashHex>${hashHex}</hashHex>
         <passPrivateKey>${password}</passPrivateKey>
	  </ser:establishHashAndPkcs7>
   </soapenv:Body>
</soapenv:Envelope>`,
		};

		return $.ajax(settings).done((response) => {
			const parser = new DOMParser();
			const docResponse = parser.parseFromString(response.documentElement.innerHTML, 'application/xhtml+xml');
			const resultado = docResponse.getElementsByTagName('resultado')[0].childNodes[0].nodeValue;
			return resultado === 1;
		});
	}
}

export default SoapController;
