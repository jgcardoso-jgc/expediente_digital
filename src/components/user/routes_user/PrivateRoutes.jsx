/* eslint-disable spaced-comment */
/* eslint-disable quotes */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SLUGS from "../resources/slugs";
import LoadingComponent from "../../shared/loading/LoadingComponent";
import AlertasPagina from "../components_user/alertasPagina/alertasPagina";
import HelloInit from "../components_user/hello/hello";
import MyProfile from "../components_user/perfil/perfil";
import Documents from "../components_user/documents/documents";
import Onboarding from "../components_user/onboarding/onboarding";
import ToOnBoarding from "../components_user/toOnboarding/toOnboarding";
import FinalStep from "../components_user/finalSteps/finalStep";
import AjustesUser from "../components_user/ajustes/ajustes";
import SubirDocumentos from "../components_user/subirDocumento/subirDocumento";

const DashboardComponent = lazy(() => import("../components_user/dashboard"));

function PrivateRoutes() {
  return (
    <Suspense fallback={<LoadingComponent loading />}>
      <Switch>
        <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
        <Route exact path={SLUGS.perfil} render={() => <MyProfile />} />
        <Route exact path={SLUGS.documentos} render={() => <Documents />} />
        <Route exact path="/hello" render={() => <HelloInit />} />
        <Route exact path="/onboard" render={() => <Onboarding />} />
        <Route exact path="/toOnboarding" render={() => <ToOnBoarding />} />
        <Route exact path="/finalStep" render={() => <FinalStep />} />
        <Route exact path="/alertas" render={() => <AlertasPagina />} />
        <Route exact path={SLUGS.subir} render={() => <SubirDocumentos />} />
        <Route exact path={SLUGS.settings} render={() => <AjustesUser />} />
        <Redirect to={SLUGS.dashboard} />
      </Switch>
    </Suspense>
  );
}

export default PrivateRoutes;
