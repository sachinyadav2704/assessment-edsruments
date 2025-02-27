import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import LoginImage from '../assets/images/login.png';

const LoginSchema = Yup.object().shape({
   username: Yup.string().required('Required Username'),
   password: Yup.string().required('Required Password'),
});

const Login = () => {
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleLogin = values => {
      login(values);
      navigate('/invoice');
   };

   return (
      <div className="login-container">
         <div className="login-card">
            <div className="login-image">
               <img src={LoginImage} alt="Login" />
            </div>
            <div className="login-form">
               <h1>Login</h1>
               <Formik initialValues={{ username: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
                  {({ isSubmitting }) => (
                     <Form>
                        <div className="form-group">
                           <label>Username</label>
                           <Field type="text" name="username" />
                           <ErrorMessage name="username" component="div" className="error" />
                        </div>

                        <div className="form-group">
                           <label>Password</label>
                           <Field type="password" name="password" />
                           <ErrorMessage name="password" component="div" className="error" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="login-button">
                           Login
                        </button>
                     </Form>
                  )}
               </Formik>
            </div>
         </div>
      </div>
   );
};

export default Login;
