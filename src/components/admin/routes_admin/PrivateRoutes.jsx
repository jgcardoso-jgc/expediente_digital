/* eslint-disable quotes */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SLUGS from "../resources/slugs";
import LoadingComponent from "../../shared/loading/LoadingComponent";
import UserView from "../components_admin/users/users";

const DashboardComponent = lazy(() => import("../components_admin/dashboard"));

function PrivateRoutes() {
  return (
    <Suspense fallback={<LoadingComponent loading />}>
      <Switch>
        <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
        <Route exact path={SLUGS.contacts} render={() => <UserView />} />
        <Route exact path={SLUGS.settings} render={() => <div>Ajustes</div>} />
        <Redirect to={SLUGS.dashboard} />
      </Switch>
    </Suspense>
  );
}

export default PrivateRoutes;
