import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

import { DefaultTemplate } from "payload/components/templates";
import { Button } from "payload/components/elements";
import { AdminViewComponent } from "payload/config";
import { useStepNav } from "payload/components/hooks";
import { useConfig, Meta } from "payload/components/utilities";

import classes from "./CustomDefaultRoute.module.scss";

const CustomDefaultRoute: AdminViewComponent = ({ user, canAccessAdmin }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();

  // The effect below will only run one time and will allow us
  // to set the step nav to display our custom route name
  useEffect(() => {
    setStepNav([
      {
        label: "Custom Route with Default Template",
      },
    ]);
  }, [setStepNav]);

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  return (
    <DefaultTemplate>
      <Meta
        title="Custom Route with Default Template"
        description="Building custom routes into Payload is easy."
        keywords="Custom React Components, Payload, CMS"
      />
      <div className={classes.root}>
        <h1>Custom Route</h1>
        <p>
          Here is a custom route that was added in the Payload config. It uses
          the Default Template, so the sidebar is rendered.
        </p>
        <Button el="link" to={`${adminRoute}`} buttonStyle="secondary">
          Go to Dashboard
        </Button>
      </div>
    </DefaultTemplate>
  );
};

export default CustomDefaultRoute;
