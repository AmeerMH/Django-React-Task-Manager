import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/tasks/', {
        title,
        description,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle('');
      setDescription('');
      setStatus(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/tasks/${editing}/`, {
        title,
        description,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle('');
      setDescription('');
      setStatus(false);
      setEditing(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditing(task.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h2>Task Manager</h2>
      <form onSubmit={editing ? handleEdit : handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Completed
        </label>
        <button type="submit">{editing ? 'Update' : 'Add'} Task</button>
        {editing && <button onClick={() => setEditing(null)}>Cancel</button>}
      </form>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status ? 'Completed' : 'Pending'}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => startEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;