import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// import {jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const [setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);

                navigate ('/dashboard');

            }
            catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }
    ,);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [token, setToken] = useState(localStorage.getItem('token') || '');

    const handleLogin = async (e) => {
        try {
            const response = await axios.post('http://192.168.10.65:3000/api/user/login', {
                username,
                password,
            });

            localStorage.setItem('token',  JSON.stringify(response));
            navigate('/dashboard');
        } catch (error) {
            console.log('Login Failed', error);
        }
    }

    return (
        <>
        <div classname="container">
            <Row classname="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xl={12}>
                    <input type ="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type ="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Button onClick={handleLogin}>Login</Button>
                </Col>
            </Row>
        </div>
        </>
    );
};

export default Login;

