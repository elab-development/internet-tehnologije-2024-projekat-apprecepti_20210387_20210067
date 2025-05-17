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

  const handleExport = () => {
    const token = sessionStorage.getItem('token');
  
    fetch('http://localhost:8000/api/admin/export-users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Backend vraća CSV fajl kao "blob" (binary large object)
      .then((res) => res.blob())
      .then((blob) => {
        // Kreira se URL koji pokazuje na primljeni fajl
        const url = window.URL.createObjectURL(blob);
        // Kreira se skriveni <a> (link) element
        const a = document.createElement('a');
        a.href = url;
        // Postavlja se da preuzme fajl pod nazivom users.csv
        a.download = 'users.csv';
        // Simulira se klik na taj <a> element, čime automatski počinje preuzimanje fajla
        a.click();
      });
  };
  

  return (
    <div>
      <h3>Korisnici</h3>
      <button onClick={handleExport}>Exportuj korisnike (CSV)</button>
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
