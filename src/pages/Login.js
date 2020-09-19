import React, {useEffect} from "react";
import {Field, Form, Formik} from "formik";
import {makeStyles} from "@material-ui/styles";
import * as Yup from "yup";
import {TextField} from "formik-material-ui";
import {Button, Container} from "@material-ui/core";
import AuthService from "../services/AuthService";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        marginTop: '20vh',
    },
}));

const initialValues = {
    username: "",
    password: "",
};

const validationSchema = Yup.object({
    username: Yup.string().email("Invalid Email ").required("Required"),
    password: Yup.string().required("Required"),
});

const Login = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const userIsLogged = useSelector((state) => state.session.isLogged);
    const notify = (text) => toast.warn(text, {});

    useEffect(() => {
        if (userIsLogged) {
            history.push("/home");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userIsLogged]);

    const _login = (values, {setSubmitting}) => {
        dispatch(AuthService.login(values, (res, err) => {
            setSubmitting(false);
            if (err) {
                notify(err);
            }
        }));
    };

    return (
        <>
            <ToastContainer />
            <Container maxWidth="sm" className={classes.container}>
                <h1>Login</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={_login}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Field
                                name="username"
                                label="Username"
                                type="text"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                required
                                component={TextField}
                            />

                            <Field
                                name="password"
                                label="Password"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                required
                                component={TextField}
                            />

                            <Button
                                href=''
                                className={classes.submit}
                                type="submit"
                                variant="contained"
                                color="secondary"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
}

export default Login;
