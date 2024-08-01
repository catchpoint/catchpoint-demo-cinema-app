import React from "react";

import Login from "../../components/Login";
import Register from "../../components/Register";
import Section from "../../components/Section/Section";

import "./Authentication.css";
const Authentication = ({ login }) => {
  return (
    <Section id="auth" bgImage="/bg.jpg" height="100vh" opacity={0.4}>
      {login ? <Login /> : <Register />}
    </Section>
  );
};

export default Authentication;
