import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';  // Import qs library

interface SecretQuestion {
  id: string;
  question: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  userName: string;
  role: string;
  password: string;
  question: string;
  answer: string;
}

const RegistrationForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [secretQuestions, setSecretQuestions] = useState<SecretQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues: FormData = {
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    userName: '',
    role: '',
    password: '',
    question: '',
    answer: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    userName: Yup.string().required('Username is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    question: Yup.string().required('Secret question is required'),
    answer: Yup.string().required('Answer is required'),
  });

  const handleSubmit = async (values: FormData) => {
    console.log('Form Data:', values);
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        userName: values.userName,
        role: values.role,
        password: values.password,
        question: values.question,
        answer: values.answer,
      };

      // Use qs.stringify to serialize the data
      const serializedData = qs.stringify(userData);

      await axios.post('http://127.0.0.1:5000/register', serializedData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Set the content type to URL-encoded
      });

      setSuccessMessage('Registration successful! Redirecting to sign-in...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error: any) {
      setSuccessMessage(null);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSecretQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/masterquestion');
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));

        if (response.data && Array.isArray(response.data.data)) {
          setSecretQuestions(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setSecretQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching secret questions:', error);
        setSecretQuestions([]);
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

      {isLoading && (
        <div className="text-center text-gray-500">Loading secret questions...</div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form Data:', values);
          handleSubmit(values);
        }}
      >
        {({ isValid, touched }) => (
          <Form>
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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">Address</label>
              <Field
                type="text"
                name="address"
                className="w-full p-2 border rounded text-black"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">Username</label>
              <Field
                type="text"
                name="userName"
                className="w-full p-2 border rounded text-black"
              />
              <ErrorMessage
                name="userName"
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
              <Field
                as="select"
                name="question"
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select Question</option>
                {secretQuestions.map((sq) => (
                  <option key={sq.id} value={sq.id}>
                    {sq.question}
                  </option>
                ))}
              </Field>
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

            <div className="mb-4">
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded"
                disabled={!isValid || !touched}
              >
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;