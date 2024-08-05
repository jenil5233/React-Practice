import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance"
import MyChatbot from "./chatbot";
import './dashboard.css'; // Import the custom CSS file

function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [editEmployee, setEditEmployee] = useState(null);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const sessionUser = sessionStorage.getItem("user");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/employees')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the employee data!", error);
            });
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleEdit = (employee) => {
        setEditEmployee(employee);
    };

    const handleSave = () => {
        axiosInstance.put(`/employees/${editEmployee._id}`, editEmployee)
            .then(response => {
                const updatedEmployee = response.data;
                setEmployees(employees.map(emp => (emp._id === updatedEmployee._id ? updatedEmployee : emp)));
                setEditEmployee(null);
            })
            .catch(error => {
                console.error("There was an error updating the employee data!", error);
            });
    };

    const handleDelete = (id) => {
        axiosInstance.delete(`/employees/${id}`)
            .then(response => {
                setEmployees(employees.filter(employee => employee._id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the employee data!", error);
            });
    };

    const handleChange = (e) => {
        setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
    };
    const toggleChatbot = () => {
        setIsChatbotVisible(prev => !prev);
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className="btn btn-info" onClick={toggleChatbot}>
                        {isChatbotVisible ? 'Close Plan Inquiry' : 'Plan Inquiry'}
                    </button>
                    <button className="btn btn-danger mt-2" onClick={handleLogout}>Logout</button>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <h3>Welcome, {sessionUser}!</h3>
                </header>
                <section className="employee-section">
                    <h4>Employee List</h4>
                    <div className="employee-list mt-4">
                        {employees.map(employee => (
                            <div key={employee._id} className="employee-card">
                                {editEmployee && editEmployee._id === employee._id ? (
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editEmployee.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            className="form-control"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={editEmployee.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className="form-control"
                                        />
                                        <button className="btn btn-success" onClick={handleSave}>Save</button>
                                        <button className="btn btn-secondary" onClick={() => setEditEmployee(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="employee-details">
                                        <div className="info">
                                            <strong>{employee.name}</strong>
                                            <br />
                                            <small>{employee.email}</small>
                                        </div>
                                        <div className="actions">
                                            <button className="btn btn-info" onClick={() => handleEdit(employee)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(employee._id)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <MyChatbot isVisible={isChatbotVisible} onClose={toggleChatbot} />
        </div>
    );
}

export default Dashboard;
