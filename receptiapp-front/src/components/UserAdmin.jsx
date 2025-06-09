import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';



const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem('token');
  // cuvamo stanje kako bi obezbedili prikaz dijaloga
  const [showConfirm, setShowConfirm] = useState(false);
  // cuvamo id korisnika kojeg zelimo da brisemo
  const [selectedUserId, setSelectedUserId] = useState(null);


  const fetchUsers = async () => {
    const res = await axios.get('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.data || res.data);
  };

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const deleteUser = async () => {
    await axios.delete(`/users/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowConfirm(false);
    setSelectedUserId(null);
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
    <div className="user-admin-container">
      <div className="user-admin-header">
        <h3>Korisnici</h3>
        <button onClick={handleExport}>Exportuj korisnike (CSV)</button>
      </div>

      <table className="user-admin-table">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => confirmDelete(u.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteUser}
        message="Da li ste sigurni da želite da obrišete korisnika?"
      />
    </div>
  );
};

export default UserAdmin;


