/* eslint-disable spaced-comment */
/* eslint-disable quotes */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SLUGS from "../resources/slugs";
import LoadingComponent from "../components_user/loading";
/*import HelloInit from "../components_user/hello/hello";
import Onboarding from "../components_user/onboarding/onboarding";
import FinalStep from "../components_user/finalSteps/finalStep";
import ToOnBoarding from "../components_user/toOnboarding/toOnboarding";
import Documents from "../components_user/documents/documents";
import AlertasPagina from "../components_user/alertasPagina/alertasPagina";*/
import MyProfile from "../components_user/perfil/perfil";

const DashboardComponent = lazy(() => import("../components_user/dashboard"));

function PrivateRoutes() {
  return (
    <Suspense fallback={<LoadingComponent loading />}>
      <Switch>
        <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
        <Route exact path={SLUGS.overviewTwo} render={() => <MyProfile />} />
        <Route
          exact
          path={SLUGS.overviewThree}
          render={() => <div>overviewThree</div>}
        />
        <Route exact path={SLUGS.overview} render={() => <div>overview</div>} />
        <Route exact path={SLUGS.tickets} render={() => <div>tickets</div>} />
        <Route exact path={SLUGS.ideasTwo} render={() => <div>ideasTwo</div>} />
        <Route
          exact
          path={SLUGS.ideasThree}
          render={() => <div>ideasThree</div>}
        />
        <Route exact path={SLUGS.ideas} render={() => <div>ideas</div>} />
        <Route exact path={SLUGS.contacts} render={() => <div>contacts</div>} />
        <Route exact path={SLUGS.agents} render={() => <div>agents</div>} />
        <Route exact path={SLUGS.articles} render={() => <div>articles</div>} />
        <Route exact path={SLUGS.settings} render={() => <div>settings</div>} />
        <Route
          exact
          path={SLUGS.subscription}
          render={() => <div>subscription</div>}
        />
        <Redirect to={SLUGS.dashboard} />
      </Switch>
    </Suspense>
  );
}

export default PrivateRoutes;
