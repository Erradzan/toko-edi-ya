import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../services/Api';
import { useAuth } from '../context/authContext';
import withTheme from '../hocs/withTheme';

interface SignInProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialValues: SignInFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

const SignIn: React.FC<SignInProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (
    values: SignInFormValues,
    { setSubmitting, setStatus }: { setSubmitting: (isSubmitting: boolean) => void; setStatus: (status?: any) => void }
  ) => {
    try {
      console.log('Attempting login with values:', values);
      const response = await loginUser({ email: values.email, password: values.password });
      console.log('API Response:', response);

      if (response?.access_token) {
        login(response.access_token, values.rememberMe);
        navigate('/');
      } else {
        setStatus('Invalid email or password');
      }
    } catch (err: unknown) {
      console.error('An error occurred during sign-in:', err);

      if (err instanceof Error) {
        setStatus(err.message || 'An error occurred. Please try again.');
      } else {
        setStatus('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-3xl font-bold mb-8 text-[#f03846]">Sign in</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSignIn}
      >
        {({ isSubmitting, status }) => (
          <Form className={`p-8 rounded-lg shadow-md w-full max-w-md ${isDarkMode ? 'bg-white text-gray-700' : 'bg-gray-700 text-white'}`}>
            {status && <div className="text-red-500 mb-4">{status}</div>}
            <div className="mb-4">
              <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Email:</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <div className="mb-4 flex items-center">
              <Field type="checkbox" name="rememberMe" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className={`${isDarkMode ? 'text-gray-700': 'text-gray-100'}`}>Remember Me</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withTheme(SignIn);