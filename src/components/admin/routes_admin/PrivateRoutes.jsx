/* eslint-disable quotes */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SLUGS from "../resources/slugs";
import LoadingComponent from "../../shared/loading/LoadingComponent";
import UserView from "../components_admin/users/users";
import AjustesAdmin from "../components_admin/ajustes/ajustes";
import EditUser from "../components_admin/editUser/editUser";

const DashboardComponent = lazy(() => import("../components_admin/dashboard"));

function PrivateRoutes() {
  return (
    <Suspense fallback={<LoadingComponent loading />}>
      <Switch>
        <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
        <Route exact path={SLUGS.contacts} render={() => <UserView />} />
        <Route exact path={SLUGS.editUser} render={() => <EditUser />} />
        <Route exact path={SLUGS.settings} render={() => <AjustesAdmin />} />
        <Redirect to={SLUGS.dashboard} />
      </Switch>
    </Suspense>
  );
}

export default PrivateRoutes;
