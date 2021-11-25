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
            await user.updatePassword(newPassword);
            return true;
        } catch (error) {
            return false;
        }
    };

    updatePassword = async (user, newPassword) => {
        try {
            const resultSign = await this.soapController.loginAndUpdatePassword(user, newPassword);
            if (resultSign) {
                const fUser = await this.auth.signInWithEmailAndPassword(user.email, user.password);
                return this.updateFirebasePassword(fUser.user, newPassword);
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
            const resultSign = await this.soapController
                .loginAndUpdatePassword(signUser, newPassword);
            if (resultSign) {
                const fUser = await this.auth.signInWithEmailAndPassword(user.email, user.password);
                return this.updateFirebasePassword(fUser.user, newPassword);
            }
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
