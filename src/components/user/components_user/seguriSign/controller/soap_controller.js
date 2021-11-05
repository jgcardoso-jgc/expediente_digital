/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable object-shorthand */
import "jquery";
import "jquery.soap";

const $ = require("jquery");
require("jquery.soap");

class SoapController {
  constructor(segurisignUser) {
    this.segurisignUser = segurisignUser;
    this.passwordDomain = "HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=";
    this.userDomain = "ws_test";
    this.idDomain = "1";
    this.url = "https://feb.seguridata.com/WS_HRVertical_Operations/WSOperationsHRV";
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async addDocumentString(signers, file) {
    const b64 = await this.toBase64(file);
    const b64Str = b64.substr(b64.indexOf(",") + 1);
    let signersJSON = "";
    const docType = "CONTRATOS";
    signers.forEach((signer) => {
      signersJSON = signersJSON.concat(
        `<lstParticipant>
			<infoEmployee>${signer}</infoEmployee>
			<inputDataType>EMAIL</inputDataType>
			<participantType>EMPLOYEE</participantType>
			<role>FIRMANTE</role>
			</lstParticipant>`
      );
    });
    console.log(signersJSON);
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:addDocumentConfigurationParticipantsHRV>
         <docListParticipantsRequest>
			${signersJSON}
            <docType>${docType}</docType>
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

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const multilateralId =
      docResponse.getElementsByTagName("multilateralId")[0].childNodes[0]
        .nodeValue;
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    return [resultado, { multilateralId, docType, fileName: file.name }];
  }

  async getHashToSign(multilateralId) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
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

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const hashHex =
      docResponse.getElementsByTagName("hashHex")[0].childNodes[0].nodeValue;
    return hashHex;
  }

  async establishHashAndPkcs7(multilateralId, hashHex, password) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
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

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    console.log(docResponse);
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    return resultado === "1";
  }

  async sign(multilateralId, password) {
    const hash = await this.getHashToSign(multilateralId);
    console.log(hash);
    return this.establishHashAndPkcs7(multilateralId, hash, password);
  }

  async verifyLogin(email) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
   <ser:verifyLogin>
            <login>${email}</login>
        </ser:verifyLogin>
   </soapenv:Body>
</soapenv:Envelope>`,
    };

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const idPerson =
      docResponse.getElementsByTagName("idPerson")[0].childNodes[0].nodeValue;
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    if (resultado !== 1) {
      alert('Error, correo no válido o no registrado');
    }
    return idPerson;
  }

  async authenticateUser(idPerson, password) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
   <idDomain>${this.idDomain}</idDomain>
            <idPerson>${idPerson}</idPerson>
            <autType>USUARIO_PASSWORD</autType>
            <password>${password}</password>
   </soapenv:Body>
</soapenv:Envelope>`,
    };

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    return resultado === '1';
  }

  async updateUserPassword(email, password) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
   		<ser:doUpdateUserPasswords xmlns:ser="http://service.rne.operations.seguridata/">
   <request>
				<resultado>0</resultado>
				<idDomain>${this.idDomain}</idDomain>
				<idRhEmp>${this.segurisignUser.idRh}</idRhEmp>
				<userDomain>${this.userDomain}</userDomain>
				<passwordDomain>${this.passwordDomain}</passwordDomain>
				<login>${email}</login>
				<password>${password}<password>
				<idEmployeeProfile>${this.segurisignUser.idEmployeeProfile}</idEmployeeProfile>
				<updateCert>false</updateCert>
				<flexUser>false</flexUser>
				<onlyVerify>false</onlyVerify>
				<noVerifyCert>false</noVerifyCert>
				<autType>USUARIO_PASSWORD</autType>
				<newPasswordAut>${password}</newPasswordAut>
				<newPasswordPrivateKey>${password}</newPasswordPrivateKey>
				<agentDefinedPassw>${password}</agentDefinedPassw>
			</request>
      		</ser:doUpdateUserPasswords>
   </soapenv:Body>
</soapenv:Envelope>`,
    };

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    return resultado === '1';
  }

  async loginUser(email, password) {
    const idPerson = await this.verifyLogin(email);
    return this.authenticateUser(idPerson, password);
  }

  async createUser(user) {
    const rand = 1 + Math.random() * (10000 - 1);
    const header = 'NOMBRE|LOGIN|EMAIL|ESTATUS_USUARIO|IDENTIFICADOR_RH|DIRECCION|LOCALIDAD|ESTADO|CODIGO_POSTAL|RFC|CURP|TELEFONO|FAX|CLAVE_PAIS|CLAVE_DOMINIO|TITULO_USUARIO|AREA|CLAVE_PERFIL|PASSWORD|PERMISOS';
    const userString = `${user.name}|${user.email}|${user.email}|1||||||DICE920101LS1|DICE920101HVZZRL01||||${this.idDomain}|||4|${user.password}|1`;
    const b64Str = btoa(header + userString);
    console.log(b64Str);
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
   <ser:readFileEmployees xmlns:ser="http://service.rne.adminreportes.seguridata/">
			<idDomain>${this.idDomain}</idDomain>
			<idRh>${rand}</idRh>
			<inputFile>${b64Str}</inputFile>
			<userDomain>${this.userDomain}</userDomain>
			<passwordDomain>${this.passwordDomain}</passwordDomain>
		</ser:readFileEmployees>
 </soapenv:Body>
</soapenv:Envelope>`,
    };

    const response = await $.ajax(settings).done();
    const parser = new DOMParser();
    const docResponse = parser.parseFromString(
      response.documentElement.innerHTML,
      "application/xhtml+xml"
    );
    const resultado =
      docResponse.getElementsByTagName("resultado")[0].childNodes[0].nodeValue;
    console.log(docResponse);
    return resultado === '1';
  }
}

export default SoapController;
