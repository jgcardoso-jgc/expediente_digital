export interface User {
  uid: string | undefined;
  fullname: string;
  email: string;
  rfc: string;
  token: string;
  onboarding: boolean;
  cargo: string;
  docsAdmin: [];
  documents: [];
}
