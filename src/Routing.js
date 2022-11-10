import React from "react";
import Layout from "./Layout";
import { MainRouter } from "./Router";
import { Router, Route, Switch, useHistory } from "react-router-dom";

const Navigation = () => {
  const history = useHistory();
  return (
    <>
      <Router history={history}>
        <Switch>
          {MainRouter.map((i, index) => (
            <Route
              exact={i.exact}
              key={index}
              path={i.path}
              render={(props) => (
                <Layout history={props.history}>
                  <i.component {...props} />{" "}
                </Layout>
              )}
            />
          ))}
        </Switch>
      </Router>
    </>
  );
};

export default Navigation;
