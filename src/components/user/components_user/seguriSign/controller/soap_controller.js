import 'jquery';
import 'jquery.soap';


class SoapController {
	constructor() {

		this.passwordDomain = "HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=";
		this.userDomain = "ws_test";
		this.$ = require('jquery');
		require('jquery.soap');
		$.soap({
			url: 'http://my.server.com/soapservices/',
			namespaceQualifier: 'myns',
			namespaceURL: 'urn://service.my.server.com',
			error: function (soapResponse) {
				alert(soapResponse);
			}
		});
	}

	addDocument(signers, file) {
		const b64 = await this.toBase64(file);
		const b64Str = b64.substr(b64.indexOf(",") + 1);
		const signersJSON = [];
		signers.forEach((signer) =>
			signersJSON.push({
				infoEmployee: signer,
				inputDataType: "EMAIL",
				participantType: "EMPLOYEE",
				role: "FIRMANTE",
			})
		);
		const docType = "CONTRATOS";
		$.soap({
			method: 'addDocumentConfigurationParticipantsHRV',
			data: {
				automaticSignatureDomain: false,
				docNameWithExtension: file.name,
				docType,
				document: b64Str,
				domainSignatureAtTheEnd: false,
				concurrentSignature: true,
				idDomain: this.iDDomain,
				lstParticipant: signersJSON,
				initiatorEmail: this.signUserEmail,
				initiatorIdRh: this.segurisignUser.idRh,
				passwordDomain: this.passwordDomain,
				userDomain: this.userDomain,
				xmlCallback: "",
			},
			done: function (soapResponse) {
				response = soapResponse.toJSON();
				console.log('soapResponse:	', soapResponse)
				return response.resultado === 1;
				// do stuff with soapResponse
			},
			error: function (err) {
				alert(err);
			}
		});
	}

	async addDocumentForParticipantsServer(signers, file) {
		const body = {
		};

		const response = await fetch(
			`${this.apiUrl}/participants`,
			this.getSecureRequestOptions(body)
		);

		if (response.status === 200) {
			const data = await response.json();
			return [
				data.resultado === 1,
				{
					multilateralId: data.multilateralId,
					fileName: file.name,
					docType,
					iniDate: data.iniDate,
				},
			];
			// handle data
		}
		return false;
	}

}
export default SoapController;