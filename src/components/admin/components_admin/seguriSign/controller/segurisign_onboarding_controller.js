/* eslint-disable no-undef */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
class SegurisignOnboardingController {
  idDomain = 1;

  selfieAPIIdentifier = "10264735-1f67-48fb-a688-6458d018659b";

  header = { "Content-Type": "application/json" };

  apiUrl = "http://200.66.66.212:8087/ws-rest-hrv-4.7.0";

  user = "";

  idProfileCompany;

  idProcessOnboarding;

  idPersonOnboarding;

  constructor() {
    this.user = firebase.auth().currentUser;
  }

  async initiateOnboarding() {
    await this.getProfileInfo();
    await this.addOnboardingRequest();
    await this.addPersonOnboarding();
  }

  async getProfileInfo() {
    const body = {
      companyCode: "seguridata",
      email: this.user.email,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/getProfileInfo`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      this.idProfileCompany = data.idProfileCompany;
      return data.result === 1;
      // handle data
    }
    return false;
  }

  async addOnboardingRequest() {
    const body = {
      idProfileCompany: this.idProfileCompany,
      email: this.user.email,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/addProcessOnboarding`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      this.idProcessOnboarding = data.idProcessOnboarding;
      return data.idProcessOnboarding;
      // handle data
    }
    return 0;
  }

  async addPersonOnboarding() {
    const body = {
      geoLatitud: "",
      geoLongitud: "",
      idProcessOnboarding: this.idProcessOnboarding,
      idProfileCompany: this.idProfileCompany,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/addPersonOnboarding`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.idProcessOnboarding;
    }
    return 0;
  }

  async addBiometricalSignature() {
    const body = {
      febBiometricX: "[]",
      febBiometricY: "[]",
      febBiometricZ: "[]",
      febImage: "",
      idPersonOnboarding: this.idPersonOnboarding,
      idProfileCompany: this.idProfileCompany,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(`${this.apiUrl}/addFEB`, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      return data.idProcessOnboarding;
    }
    return 0;
  }

  async addIdentitySelfie() {
    const idInfo = {
      address: "",
      curp: "",
      docPortrait: "",
      email: this.user.email,
      locality: "x",
      state: "x",
      name: "",
    };

    const idSelfie = {
      backImage: "",
      faceImage: "",
      frontImage: "",
    };

    const body = {
      idIdentifierAPI: this.apiUrl,
      idPersonOnboarding: this.idPersonOnboarding,
      idProfileCompany: this.idProfileCompany,
      identityInfo: idInfo,
      messageCompare:
        "Falla verificación biométrica, Imagen Reverso no puede ser identificada, Verificación incorrecta",
      resultCompare: false,
      identitySelfie: idSelfie,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/addIdentitySelfie`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1;
    }
    return false;
  }

  async compareIdentitySelfie() {
    const idSelfie = {
      backImage: "",
      faceImage: "",
      frontImage: "",
    };

    const body = {
      identitySelfie: idSelfie,
      idProfileCompany: this.idProfileCompany,
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${this.apiUrl}/compareIdentitySelfie`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.resultCompare;
    }
    return false;
  }

  async addUser() {
    const body = {
      email: this.user.email,
      address: "",
      curp: "",
      idPersonOnboarding: this.idPersonOnboarding,
      idProfileCompany: this.idProfileCompany,
      idDomain: this.idDomain,
      identifierHR: this.user.uid,
      rfc: "",
      name: "",
    };

    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(body),
    };
    const response = await fetch(`${this.apiUrl}/addUser`, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      return data.resultado === 1;
    }
    return false;
  }
}

export default SegurisignOnboardingController;
