/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable object-shorthand */
import "jquery";
import "jquery.soap";
import axios from "axios";
import { stringify } from "querystring";
import SegurisignUser from "../segurisign_user";

const $ = require("jquery");
require("jquery.soap");

class SoapController {
  constructor() {
    this.passwordDomain = "HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=";
    this.userDomain = "ws_test";
    this.idDomain = "1";
    this.url =
      "https://feb.seguridata.com/WS_HRVertical_Operations/WSOperationsHRV";
    this.segurisignUser = new SegurisignUser();
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
    console.log(docResponse);
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
    console.log(docResponse);
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
    return new Promise((resolve, reject) => {
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

      $.ajax(settings).then((data) => {
        const parser = new DOMParser();
        const docResponse = parser.parseFromString(
          data.documentElement.innerHTML,
          "application/xhtml+xml"
        );
        console.log(docResponse);
        const resultado =
          docResponse.getElementsByTagName("resultado")[0].childNodes[0]
            .nodeValue;
        console.log(`res:${resultado}`);
        if (resultado !== "1") {
          reject("Correo no válido o no registrado");
        }
        const idPerson =
          docResponse.getElementsByTagName("idPerson")[0].childNodes[0]
            .nodeValue;
        this.segurisignUser.idPerson = idPerson;
        resolve(idPerson);
      });
    });
  }

  verifyLoginAdmin = async () =>
    new Promise((resolve, reject) => {
      const settings = {
        url: "https://feb.seguridata.com/WS_HRVertical_Admin_Reports/WSAdminReportsHRV",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "text/xml",
        },
        data: `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.adminreportes.seguridata/">
      <soapenv:Header/>
      <soapenv:Body>
          <ser:verifyLogin>
              <login>agente@seguridata.com</login>
          </ser:verifyLogin>
      </soapenv:Body>
  </soapenv:Envelope>`,
      };
      $.ajax(settings)
        .then((data) => {
          const parser = new DOMParser();
          const docResponse = parser.parseFromString(
            data.documentElement.innerHTML,
            "application/xhtml+xml"
          );
          const resultado =
            docResponse.getElementsByTagName("resultado")[0].childNodes[0]
              .nodeValue;
          resolve(resultado === 1);
        })
        .fail(() => {
          reject("error");
        });
    });

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
           <ser:authenticateUser>
   <idDomain>${this.idDomain}</idDomain>
            <idPerson>${idPerson}</idPerson>
            <autType>USUARIO_PASSWORD</autType>
            <password>${password}</password>
           </ser:authenticateUser>
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
    return resultado === "1";
  }

  async loginUser(email, password) {
    try {
      const idPerson = await this.verifyLogin(email);
      console.log(`idPerson:${idPerson}`);
      if (idPerson === "Correo no válido o no registrado") {
        console.log("throw");
        throw idPerson;
      }
      const result = await this.authenticateUser(idPerson, password);
      return [result, idPerson];
    } catch (e) {
      console.log("catched");
      return new Error(e);
    }
  }

  async updateUserPassword(user) {
    const settings = {
      url: this.url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "text/xml",
      },
      data: `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.operations.seguridata/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:doUpdateUserPasswords>
         <request>
            <idDomain>${this.idDomain}</idDomain>
            <idRhEmp>${user.idRh}</idRhEmp>
            <userDomain>${this.userDomain}</userDomain>
            <passwordDomain>${this.passwordDomain}</passwordDomain>
            <login>${user.email}</login>
            <password>${user.password}</password>
            <idEmployeeProfile>4</idEmployeeProfile>
            <autType>USUARIO_PASSWORD</autType>
            <newPasswordAut>${user.password}</newPasswordAut>
            <newPasswordPrivateKey>${user.password}</newPasswordPrivateKey>
         </request>
      </ser:doUpdateUserPasswords>
   </soapenv:Body>
</soapenv:Envelope>

`,
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

  async createUser(user) {
    return new Promise((resolve, reject) => {
      this.verifyLoginAdmin().then(() => {
        const settings = {
          url: "https://feb.seguridata.com/WS_HRVertical_Admin_Reports/WSAdminReportsHRV",
          method: "POST",
          timeout: 0,
          headers: {
            "Content-Type": "text/xml",
          },
          data: `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.rne.adminreportes.seguridata/">
        <soapenv:Header/>
        <soapenv:Body>
            <ser:addEmployee>
                <employeeData>
                    <autType>USUARIO_PASSWORD</autType>
                    <blPermissionAddDocument>true</blPermissionAddDocument>
                    <blPreCert>true</blPreCert>
                    <employee>
                        <addressEmployee></addressEmployee>
                        <area>INTEGRACIONES POSTMAN</area>
                        <country>MX</country>
                        <curp></curp>
                        <descriptionDomain></descriptionDomain>
                        <email>${user.email}</email>
                        <fax></fax>
                        <idDomain>${this.idDomain}</idDomain>
                        <idEmp></idEmp>
                        <idEmployeeProfile>4</idEmployeeProfile>
                        <idPerson></idPerson>
                        <idRh></idRh>
                        <keyMakerStorageType>KEYMAKER_DB</keyMakerStorageType>
                        <locality></locality>
                        <login>${user.email}</login>
                        <nameEmployee>${user.name}</nameEmployee>
                        <phone></phone>
                        <receiveNotification>1</receiveNotification>
                        <rfcEmployee>${user.rfc}</rfcEmployee>
                        <state></state>
                        <statusCertificate></statusCertificate>
                        <storageType>1</storageType>
                        <title></title>
                        <totSignaturesPending></totSignaturesPending>
                        <zipCode></zipCode>
                        <idDomainFrom></idDomainFrom>
                        <idProfile>4</idProfile>
                        <keyTypeValue></keyTypeValue>
                        <lockDateUser></lockDateUser>
                        <postalCode></postalCode>
                        <statusDomainTo></statusDomainTo>
                        <unLockDateUser></unLockDateUser>
                        <userExternalKeys>false</userExternalKeys>
                        <userImportKeys>false</userImportKeys>
                        <userService>false</userService>
                    </employee>
                    <idDomainTo>1</idDomainTo>
                    <password>${user.password}</password>
                    <passwordDomain>${this.passwordDomain}</passwordDomain>
                    <userDomain>${this.userDomain}</userDomain>
                </employeeData>
            </ser:addEmployee>
        </soapenv:Body>
    </soapenv:Envelope>
          `,
        };

        $.ajax(settings)
          .done((data) => {
            const parser = new DOMParser();
            const docResponse = parser.parseFromString(
              data.documentElement.innerHTML,
              "application/xhtml+xml"
            );
            const resultado =
              docResponse.getElementsByTagName("resultado")[0].childNodes[0]
                .nodeValue;
            console.log(`final:${docResponse}`);
            resolve(resultado === "1");
          })
          .fail((e) => {
            reject(e);
          });
      });
    });
  }

  async createNewUser(user) {
    return new Promise((resolve, reject) => {
      this.createUser(user)
        .then(async () => {
          const resultado = await this.loginUser(user.email, user.password);
          if (resultado[0]) {
            user.idRh = resultado[1];
            console.log(user.idRh);
          } else {
            reject("error");
          }
          resolve(this.updateUserPassword(user));
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  sendWelcomeEmail = async (email) =>
    new Promise((resolve, reject) => {
      const msg = "Tienes que subir un nuevo documento.";
      // agregar mensaje de bienvenida a estudiante
      const data = {
        email,
        msg,
      };
      axios({
        method: "post",
        url: "https://us-central1-seguridata-in-a-box.cloudfunctions.net/sendWelcome",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: stringify(data),
      })
        .then((res) => resolve(`sended:${res.status}`))
        .catch((res) => reject(`error:${res}`));
    });
}

export default SoapController;
