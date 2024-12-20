import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  userName: string;
  role: string;
}

interface OrderProduct {
  seller: string;
  title: string;
  quantity: number;
  price: string;
}

interface Transaction {
  id: number;
  order_date: string;
  total_price: string;
  order_product: OrderProduct[];
}

const Order: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userIdArray = localStorage.getItem('userId');
        if (!token || !userIdArray) throw new Error('No token or userId found');
        const userId = Array.isArray(JSON.parse(userIdArray)) ? parseInt(JSON.parse(userIdArray)[0], 10) : 4;
        const response = await axios.get(`https://vicious-damara-gentaproject-0a193137.koyeb.app/userprofile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const profileData = response.data.data;
        setUserProfile(profileData);

        if (profileData.role !== "Seller") {
          alert("Access denied. This page is for sellers only.");
          navigate("/"); // Redirect to home or another page.
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/historytransaction/seller', {
            headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
            }
        });
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchTransactions();
  }, [navigate]);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.order_product.some(
      (product) => product.seller === userProfile?.userName
    )
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order History</h1>
      {filteredTransactions.length === 0 ? (
        <p>No transactions found for your products.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.order_date).toLocaleDateString()}</td>
                <td>{transaction.total_price}</td>
                <td>
                  <ul>
                    {transaction.order_product.map((product, index) => (
                      <li key={index}>
                        {product.title} - {product.quantity} pcs @ {product.price}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;