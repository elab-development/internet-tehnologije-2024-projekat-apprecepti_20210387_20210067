import { useEffect, useState } from 'react';
import axios from 'axios';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await axios.get('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.data || res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Obrisati korisnika?')) return;
    await axios.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Korisnici</h3>
      <table>
        <thead>
          <tr><th>Ime</th><th>Email</th><th>Uloga</th><th>Akcije</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdmin;
