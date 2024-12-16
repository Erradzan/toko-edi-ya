import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import withTheme from '../hocs/withTheme';

interface SignInProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface SignInFormValues {
  userName: string;
  password: string;
}

interface ForgotPasswordValues {
  userName: string;
  question: number;
  answer: string;
  password: string;
  repeat_password: string;
}

const initialSignInValues: SignInFormValues = {
  userName: '',
  password: '',
};

const initialForgotPasswordValues: ForgotPasswordValues = {
  userName: '',
  question: 0,
  answer: '',
  password: '',
  repeat_password: '',
};

const validationSchemaSignIn = Yup.object({
  userName: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const validationSchemaForgotPassword = Yup.object({
  userName: Yup.string().required('Required'),
  question: Yup.number().required('Required'),
  answer: Yup.string().required('Required'),
  password: Yup.string()
    .required('Required')
    .min(6, 'Password must be at least 6 characters'),
  repeat_password: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), ''], 'Passwords must match'),
});

const loginUser = async (userName: string, password: string) => {
  try {
    const response = await axios.post('https://vicious-damara-gentaproject-0a193137.koyeb.app/login', { userName, password });
    return response.data;
  } catch (err) {
    throw new Error('Failed to login. Please check your credentials.');
  }
};

const forgotPassword = async (values: ForgotPasswordValues) => {
  const payload = {
    ...values,
    question: Number(values.question),
  };
  try {
    const response = await axios.post(
      'https://vicious-damara-gentaproject-0a193137.koyeb.app/login/forgotpassword',
      payload,
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to process forgot password. Please try again.');
  }
};

const SignIn: React.FC<SignInProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState<{ id: string; question: string }[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errorFetchingQuestions, setErrorFetchingQuestions] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/masterquestion')
      .then((response) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          setSecurityQuestions(response.data.data);
        } else {
          setErrorFetchingQuestions(true);
        }
      })
      .catch(() => setErrorFetchingQuestions(true))
      .finally(() => setLoadingQuestions(false));
  }, []);

  const handleSignIn = async (
    values: SignInFormValues,
    { setSubmitting, setStatus }: { setSubmitting: (isSubmitting: boolean) => void; setStatus: (status?: any) => void }
  ) => {
    try {
      const response = await loginUser(values.userName, values.password);
      if (response?.access_token && response?.role && response?.user_id) {
        login(response.access_token, response.role, response.user_id);
        navigate('/');
      } else {
        setStatus('Invalid username or password');
      }
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (
    values: ForgotPasswordValues,
    { setSubmitting, setStatus }: { setSubmitting: (isSubmitting: boolean) => void; setStatus: (status?: any) => void }
  ) => {
    try {
      const response = await forgotPassword(values);
      console.log('Forgot password response:', response);
      setSuccessMessage('Password reset successful. Redirecting...');
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 2000);
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-3xl font-bold mb-8 text-[#f03846]">{isForgotPassword ? 'Forgot Password' : 'Sign In'}</h1>

      {!isForgotPassword && (
        <Formik
          initialValues={initialSignInValues}
          validationSchema={validationSchemaSignIn}
          onSubmit={handleSignIn}
        >
          {({ isSubmitting, status }) => (
            <Form className={`p-8 rounded-lg shadow-md w-full max-w-md ${isDarkMode ? 'bg-white text-gray-700' : 'bg-gray-700 text-white'}`}>
              {status && <div className="text-red-500 mb-4">{status}</div>}
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Username:</label>
                <Field
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                <ErrorMessage name="userName" component="div" className="text-red-500" />
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
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 mt-4"
              >
                Forgot Password?
              </button>
            </Form>
          )}
        </Formik>
      )}

      {isForgotPassword && (
        <Formik
          initialValues={initialForgotPasswordValues}
          validationSchema={validationSchemaForgotPassword}
          onSubmit={handleForgotPassword}
        >
          {({ isSubmitting, status }) => (
            <Form className={`p-8 rounded-lg shadow-md w-full max-w-md ${isDarkMode ? 'bg-white text-gray-700' : 'bg-gray-700 text-white'}`}>
              {status && <div className="text-red-500 mb-4">{status}</div>}
              {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Username:</label>
                <Field
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                <ErrorMessage name="userName" component="div" className="text-red-500" />
              </div>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Security Question:</label>
                {loadingQuestions ? (
                  <p>Loading...</p>
                ) : errorFetchingQuestions ? (
                  <p>Error loading questions.</p>
                ) : (
                  <Field
                    as="select"
                    name="question"
                    className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                  >
                    <option value="">Select a question</option>
                    {securityQuestions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.question}
                      </option>
                    ))}
                  </Field>
                )}
                <ErrorMessage name="question" component="div" className="text-red-500" />
              </div>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Answer:</label>
                <Field
                  type="text"
                  name="answer"
                  placeholder="Enter your answer"
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                <ErrorMessage name="answer" component="div" className="text-red-500" />
              </div>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>New Password:</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your new password"
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                <ErrorMessage name="password" component="div" className="text-red-500" />
              </div>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-700' : 'text-gray-100'}`}>Repeat New Password:</label>
                <Field
                  type="password"
                  name="repeat_password"
                  placeholder="Repeat your new password"
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                <ErrorMessage name="repeat_password" component="div" className="text-red-500" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-blue-500 mt-4"
              >
                Back to Sign In
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default withTheme(SignIn);