/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import axios from "axios";
import SegurisignDocument from "../model/segurisign_document";
import { auth } from "./firebase_controller";
import SegurisignUser from "../model/segurisign_user";

class SegurisignController {
  iDDomain = "1";

  apiUrl = "https://200.66.66.212:8088/ws-rest-hrv-4.7.0";

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
      emailToSend: auth.currentUser.email,
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
      return data.resultado === 1;
    }
    return [];
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

    const response = await fetch(
      `${this.apiUrl}/getStatus`,
      this.getSecureRequestOptions(body)
    );

    if (response.status === 200) {
      const data = await response.json();
      Object.keys(data.lstReceipts).forEach((doc) =>
        documents.push(new SegurisignDocument(data.lstReceipts[doc]))
      );
      return documents;
    }
    return "404";
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

  async loginUser(password) {
    const formData = new FormData();
    formData.append("strlogin", auth.currentUser.email);

    return axios
      .post(`${this.apiUrl}/login`, formData)
      .then((res) => {
        this.segurisignUser.idPerson = res.data.idPerson;
        this.segurisignUser.token = res.data.token;
        this.segurisignUser.idEmployeeProfile = res.data.idEmployeeProfile;
        return this.authUser(password).then((value) => value);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async authUser(password) {
    const body = {
      strlogin: auth.currentUser.email,
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

    return fetch(`${this.apiUrl}/user`, requestOptions).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          this.segurisignUser.idRh = data.idRh;
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
      login: auth.currentUser.email,
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
