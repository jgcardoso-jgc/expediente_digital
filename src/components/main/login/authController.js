/* eslint-disable quotes */
async function checkUser(uid, db) {
  try {
    const queryAdmin = await db
      .collection('admin')
      .where('uid', '==', uid)
      .get();
    if (queryAdmin.size > 0) {
      localStorage.setItem('admin', true);
      return 'admin';
    }
    const queryUser = await db
      .collection('users')
      .where('uid', '==', uid)
      .get();
    if (queryUser.size > 0) {
      queryUser.docs.forEach((doc) => {
        const data = doc.data();
        let cargo = '';
        if (data.cargo != null) {
          cargo = data.cargo;
        }
        const userData = {
          fullName: data.fullname,
          email: data.email,
          rfc: data.rfc,
          curp: data.curp,
          onboarding: data.onboarding,
          cargo,
          token: ''
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return 'user';
      });
    } else {
      return 'error';
    }
  } catch (e) {
    return e;
  }
  return 'network error';
}

export default checkUser;
