/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
    try {
      // console.log(user, newPassword);
      await user
        .updatePassword(newPassword)
        .then(() => 200)
        .catch((error) => {
          throw error;
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
        console.log('begin updtd', fUser);
        const update = await this.updateFirebasePassword(
          fUser.user,
          newPassword
        );
        console.log(update);
        toast(update);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        toast(error);
        console.log(error);
      }
      return false;
    }
  };

  updatePasswordSign = async (user, signPassword) => {
    try {
      const signUser = { email: user.email, password: signPassword };
      if (signUser) {
        const fUser = await this.auth.signInWithEmailAndPassword(
          user.email,
          user.password
        );
        const success = await this.updateFirebasePassword(
          fUser.user,
          signPassword
        );

        if (success) {
          toast('Éxito');
          return false;
        }
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
