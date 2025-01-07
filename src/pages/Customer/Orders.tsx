import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import withTheme from "../../hocs/withTheme";
import Dark from '../../support/Dark.png';
import Light from '../../support/Light.png';

interface Product {
  product_id: number;
  product_name: string;
  quantity: number;
  seller: string;
  sum_price: string;
}

interface Transaction {
  Transaction_id: number;
  Bank: string;
  customer: string;
  date: string;
  order_products: Product[];
  payment_method: string[];
  status: string;
  total_price: string;
}

interface HistoryProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Orders: React.FC<HistoryProps> = ({ isDarkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "customer") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vicious-damara-gentaproject-0a193137.koyeb.app/historytransaction",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount: string) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    return formatter.format(Number(amount));
  };

  const updateTransactionStatus = async (transactionId: number, product: Product) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://vicious-damara-gentaproject-0a193137.koyeb.app/updatetransaction",
        {
          transaction_id: transactionId,
          status: "complete",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.Transaction_id === transactionId
              ? { ...transaction, status: "complete" }
              : transaction
          )
        );
        setSelectedProduct(product);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const submitRating = async () => {
    if (!selectedProduct) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `https://vicious-damara-gentaproject-0a193137.koyeb.app/product/${selectedProduct.product_id}/addreview`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Thank you for your rating!");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "text-white" : "text-gray-900"} py-12`}
    style={{
      backgroundImage: `url(${isDarkMode ? Dark : Light})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Transaction History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-[#40b446]">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Products</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Payment Method</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Total Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.Transaction_id} className={`hover:bg-[#40b446] transition duration-150 ${isDarkMode ? 'bg-[#888888]' : 'bg-white'}`}>
                  <td className="border border-gray-300 px-4 py-2 text-black">{transaction.Transaction_id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.order_products.map((product, index) => (
                      <div key={index}>
                        <strong>{product.product_name}</strong> by {product.seller}
                        <br />
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {Array.isArray(transaction.payment_method)
                      ? transaction.payment_method.join(", ")
                      : transaction.payment_method}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {formatCurrency(transaction.total_price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{transaction.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    <button
                      onClick={() => updateTransactionStatus(transaction.Transaction_id, transaction.order_products[0])}
                      className={`py-1 px-4 rounded mr-2 border border-black ${
                        transaction.status === "on_delivery"
                          ? "bg-[#40b446] text-white"
                          : "bg-gray-500 text-gray-300 cursor-not-allowed"
                      }`}
                      disabled={transaction.status !== "on_delivery"}
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Rate Product</h2>
            <p>
              Rate <strong>{selectedProduct.product_name}</strong> by {selectedProduct.seller}:
            </p>
            <div className="my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`px-3 py-1 border ${rating >= star ? "bg-yellow-400" : "bg-gray-200"} rounded mr-1`}
                  onClick={() => setRating(star)}
                >
                  {star}
                </button>
              ))}
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={submitRating}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withTheme(Orders);