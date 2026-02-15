import { useState } from 'react';
import axios from 'axios';

function AdminSetup() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls the /create route we made earlier in backend/routes/admin.js
      await axios.post('http://localhost:5000/api/admin/create', formData);
      alert("Admin Created Successfully! Now delete this page.");
    } catch (err) {
      alert("Error creating admin");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Secret Admin Creation</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Admin Username" onChange={e => setFormData({...formData, username: e.target.value})} /><br/>
        <input type="text" placeholder="Admin Password" onChange={e => setFormData({...formData, password: e.target.value})} /><br/>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
}

export default AdminSetup;