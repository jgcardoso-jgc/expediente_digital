export interface User {
  uid: string | undefined;
  fullname: string;
  email: string;
  rfc: string;
  token: string;
  registradoSign: boolean;
  onboarding: boolean;
  cargo: string;
  docsAdmin: [];
  documents: [];
}
