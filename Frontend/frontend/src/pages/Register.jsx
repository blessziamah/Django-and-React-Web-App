import React from 'react';
import Form from "../components/Form.jsx";

const Register = () => {
    return (
        <Form method={"register"} route={"/api/user/register/"} />

    );
};

export default Register;