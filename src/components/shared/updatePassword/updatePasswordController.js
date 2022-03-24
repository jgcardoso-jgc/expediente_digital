/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable class-methods-use-this */
/* eslint-disable indent */
import { toast } from 'react-toastify';
import { useFirebaseApp } from 'reactfire';
import SoapController from '../seguriSign/controller/soap_controller';

class UpdatePasswordController {
  constructor() {
    this.soapController = new SoapController();
    this.firebase = useFirebaseApp();
    this.auth = this.firebase.auth();
  }

  updateFirebasePassword = async (user, newPassword) => {
    console.log('entrada a firebase');
    try {
      console.log(user, newPassword);
      await user
        .updatePassword(newPassword)
        .then(() => {
          alert('succes');
          // Update successful.
        })
        .catch((error) => {
          alert(error);
          // An error ocurred
          // ...
        });
      return true;
    } catch (error) {
      toast(error);
      return false;
    }
  };

  updatePassword = async (user, newPassword) => {
    try {
      const resultSign = await this.soapController.loginAndUpdatePassword(
        user,
        newPassword
      );
      if (resultSign) {
        const fUser = await this.auth.signInWithEmailAndPassword(
          user.email,
          user.password
        );
        console.log(fUser);
        console.log('begin updtd');
        await this.updateFirebasePassword(fUser.user, newPassword);
        console.log('finish updtd');
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        toast(error);
      }
      return false;
    }
  };

  updatePasswordSign = async (user, newPassword, signPassword) => {
    try {
      const signUser = { email: user.email, password: signPassword };
      const resultSign = await this.soapController.loginAndUpdatePassword(
        signUser,
        newPassword
      );
      if (resultSign) {
        const fUser = await this.auth.signInWithEmailAndPassword(
          user.email,
          user.password
        );
        console.log('begin updtd');
        await this.updateFirebasePassword(fUser.user, newPassword);
        console.log('finish updtd');
      }
      toast('Error');
      return false;
    } catch (error) {
      if (error instanceof Error) {
        toast(error);
      }
      return false;
    }
  };
}

export default UpdatePasswordController;
