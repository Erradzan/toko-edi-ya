import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: string;
  password: string;
  question: string;
  answer: string;
}

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [secretQuestions, setSecretQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues: FormData = {
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    username: '',
    role: '',
    password: '',
    question: '',
    answer: '',
  };

  const stepOneValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  const stepTwoValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    question: Yup.string().required('Secret question is required'),
    answer: Yup.string().required('Answer is required'),
  });

  const handleSubmit = async (values: FormData) => {
    try {
      await axios.post(
        'https://contemporary-milissent-gentaproject-897ea311.koyeb.app/register',
        values
      );
      setSuccessMessage('Registration successful! Redirecting to sign-in...');
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSecretQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://contemporary-milissent-gentaproject-897ea311.koyeb.app/masterquestion');
        setSecretQuestions(response.data);
      } catch (error) {
        console.error('Error fetching secret questions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSecretQuestions();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg mt-20 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-black">Register</h1>

      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={step === 1 ? stepOneValidationSchema : stepTwoValidationSchema}
        onSubmit={(values) => {
          if (step === 1) {
            setStep(2);
          } else {
            handleSubmit(values);
          }
        }}
      >
        {({ values, isValid, touched }) => (
          <Form>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">First Name</label>
                  <Field
                    type="text"
                    name="firstName"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Gender</label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full p-2 border rounded text-black"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Phone Number</label>
                  <Field
                    type="tel"
                    name="phoneNumber"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isValid || Object.keys(touched).length === 0}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Role</label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full p-2 border rounded text-black"
                  >
                    <option value="">Select Role</option>
                    <option value="seller">Seller</option>
                    <option value="customer">Customer</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Secret Question</label>
                  {isLoading ? (
                    <p>Loading secret questions...</p>
                  ) : (
                    <Field
                      as="select"
                      name="question"
                      className="w-full p-2 border rounded text-black"
                    >
                      <option value="">Select a Secret Question</option>
                      {secretQuestions.map((question) => (
                        <option key={question.id} value={question.id}>
                          {question.question}
                        </option>
                      ))}
                    </Field>
                  )}
                  <ErrorMessage
                    name="question"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Answer</label>
                  <Field
                    type="text"
                    name="answer"
                    className="w-full p-2 border rounded text-black"
                  />
                  <ErrorMessage
                    name="answer"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                  Register
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;