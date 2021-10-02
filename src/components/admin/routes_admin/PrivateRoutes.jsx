/* eslint-disable quotes */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SLUGS from "../resources/slugs";
import LoadingComponent from "../../shared/loading/LoadingComponent";
import UserView from "../components_admin/users/users";
import AjustesAdmin from "../components_admin/ajustes/ajustes";
import EditUser from "../components_admin/editUser/editUser";
import AlertasPagina from "../components_admin/alertasPagina/alertasPagina";

const DashboardComponent = lazy(() => import("../components_admin/dashboard"));

function PrivateRoutes() {
  return (
    <Suspense fallback={<LoadingComponent loading />}>
      <Switch>
        <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
        <Route exact path={SLUGS.usuarios} render={() => <UserView />} />
        <Route exact path={SLUGS.editUser} render={() => <EditUser />} />
        <Route exact path={SLUGS.settings} render={() => <AjustesAdmin />} />
        <Route exact path={SLUGS.alertas} render={() => <AlertasPagina />} />
        <Redirect to={SLUGS.dashboard} />
      </Switch>
    </Suspense>
  );
}

export default PrivateRoutes;
