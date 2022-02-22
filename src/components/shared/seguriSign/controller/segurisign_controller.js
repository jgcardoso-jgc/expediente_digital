/* eslint-disable class-methods-use-this */

/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import axios from "axios";
import SegurisignDocument from "../model/segurisign_document";
import SegurisignUser from "../model/segurisign_user";

class SegurisignController {
  iDDomain = "1";

  apiUrl = "https://feb.seguridata.com/ws-rest-hrv-4.7.0";

  userDomain = "ws_test";

  passwordDomain = "HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=";

  header = {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
  };

  segurisignUser;

  constructor() {
    this.segurisignUser = new SegurisignUser();
  }

  getCurrentDate() {
    return new Date(Date.now())
      .toLocaleString()
      .split(",")[0]
      .split(" ")[0]
      .replaceAll("/", "-");
  }

  getSecureRequestOptions(body) {
    return {
      method: "POST",
      headers: this.getSecureHeader(),
      body: JSON.stringify(body),
    };
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async biometricSignature(signData, multilateralId, lat, long) {
    const biometricX = [];
    const biometricY = [];
    const biometricP = [];
    const biometricT = [];
    signData.toData()[0].forEach((point) => {
      biometricX.push(point.x);
      biometricY.push(point.y);
      biometricT.push(point.time);
      biometricP.push(1);
    });
    const body = {
      biometricData: "Probando Segurisign",
      biometricDate: this.getCurrentDate(),
      biometricTime: biometricT.join(","),
      biometricX: biometricX.join(","),
      biometricY: biometricY.join(","),
      biometricP: biometricP.join(","),
      blSendEmail: true,
      canvasHeight: 200,
      canvasWidth: 500,
      emailToSend: this.segurisignUser.email,
      geolocationData: {
        geoLatitud: lat,
        geoLongitud: long,
      },
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      lineWidth: 3,
      location: "",
      multilateralId,
      nameSign: "",
      passwordDomain: "",
      radius: 3,
      signatureImage: signData.toDataURL(),
      signatureReason: "Razón de firma",
      userDomain: "",
    };

    const requestOptions = {
      method: "POST",
      headers: this.getSecureHeader(),
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/biometricsignature`,
      requestOptions
    );
    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1;
    }
    return false;
  }

  async cancelDocument(multilateralId, motive) {
    const body = {
      cancelReceipt: true,
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      multilateralId,
      passwordDomain: "",
      userDomain: "",
      reasonForCancellation: motive,
    };

    const response = await fetch(
      `${this.apiUrl}/cancel`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      // console.log(data, multilateralId);
      return data.resultado === 1;
    }
    return [];
  }

  async pkcs7(multilateralId, passPrivateKey, hashHex) {
    // console.log(this.segurisignUser.idRh);
    const documentRequest = {
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      multilateralId,
      passwordDomain: this.passwordDomain,
      userDomain: this.userDomain,
    };

    const body = {
      documentRequest,
      hashHex,
      passPrivateKey,
    };

    const response = await fetch(
      `${this.apiUrl}/getHash`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.hashHex;
    }
    return "";
  }

  async getHash(multilateralId) {
    /// /console.log(this.segurisignUser.idRh);
    const body = {
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      multilateralId,
      passwordDomain: "HZAOT0hG50ZFkji3vTb47RjK3WOxHUExxIwII3zp6TY=",
      userDomain: "ws_test",
    };

    const response = await fetch(
      `${this.apiUrl}/getHash`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.hashHex;
    }
    return "";
  }

  async getDocument(multilateralId) {
    const body = {
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      multilateralId,
      passwordDomain: "",
      userDomain: "",
    };

    const response = await fetch(
      `${this.apiUrl}/get`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1 ? data.document : "";
    }
    return [];
  }

  async getStatus(status) {
    const documents = [];
    const body = {
      endDate: this.getCurrentDate(),
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      iniDate: "01-01-2021",
      passwordDomain: "",
      statusReceipt: status,
      userDomain: "",
    };

    try {
      const response = await fetch(
        `${this.apiUrl}/getStatus`,
        this.getSecureRequestOptions(body)
      );
      const data = await response.json();
      Object.keys(data.lstReceipts).forEach((doc) =>
        documents.push(new SegurisignDocument(data.lstReceipts[doc]))
      );
      return documents;
    } catch {
      return "404";
    }
  }

  async addDocumentForParticipants(signers, file) {
    const b64 = await this.toBase64(file);
    const b64Str = b64.substr(b64.indexOf(",") + 1);
    const signersJSON = [];
    const docType = "CONTRATOS";
    signers.forEach((signer) =>
      signersJSON.push({
        infoEmployee: signer,
        inputDataType: "EMAIL",
        participantType: "EMPLOYEE",
        role: "FIRMANTE",
      })
    );
    const body = {
      automaticSignatureDomain: false,
      docNameWithExtension: file.name,
      docType,
      document: b64Str,
      idDomain: this.iDDomain,
      lstParticipant: signersJSON,
      passwordDomain: "",
      userDomain: "",
      xmlCallback: "",
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

  async getSignersList(email) {
    const body = {
      email: "",
      idDomain: this.iDDomain,
      idRhEmp: this.segurisignUser.idRh,
      login: email,
      name: "",
      passwordDomain: "",
      rfc: "",
      userDomain: "",
    };

    const response = await fetch(
      `${this.apiUrl}/getlist`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1 && data.signerList.length > 0;
      // handle data
    }
    return false;
  }

  async loginUser(email, password) {
    const formData = new FormData();
    formData.append("strlogin", email);

    return axios
      .post(`${this.apiUrl}/login`, formData)
      .then((res) => {
        this.segurisignUser.idPerson = res.data.idPerson;
        this.segurisignUser.email = email;
        this.segurisignUser.token = res.data.token;
        this.segurisignUser.idEmployeeProfile = res.data.idEmployeeProfile;
        return this.authUser(password).then((value) => value);
      })
      .catch(
        () =>
          // console.log(err);
          false
      );
  }

  async authUser(password) {
    const body = {
      strlogin: this.segurisignUser.email,
      autType: "USUARIO_PASSWORD",
      idDomain: this.iDDomain,
      idPerson: this.segurisignUser.idPerson,
      password,
      token: this.segurisignUser.token,
    };
    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    /// /console.log("auth, ", this.segurisignUser.idPerson);
    return fetch(`${this.apiUrl}/user`, requestOptions).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          this.segurisignUser.idRh = data.idRh;
          /// /console.log(data);
          return data.resultado === 1;
        });
      }
      return false;
    });
  }

  async updatePassword(oldPassword, newPassword) {
    const body = {
      autType: "USUARIO_PASSWORD",
      certificate: "",
      idEmployeeProfile: this.segurisignUser.idEmployeeProfile,
      idRhEmp: this.segurisignUser.idRh,
      login: this.segurisignUser.email,
      message: "",
      newPasswordAut: newPassword,
      idDomain: this.iDDomain,
      newPasswordPrivateKey: "",
      password: oldPassword,
      passwordDomain: "",
      resultado: 0,
      userDomain: "",
    };
    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `${this.apiUrl}/updateUserPasswords`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1;
    }
    return false;
  }

  getSecureHeader() {
    return {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
      authorization: this.segurisignUser.token,
    };
  }
}

export default SegurisignController;
