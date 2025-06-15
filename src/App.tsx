import { useState, useEffect } from 'react';
import Timer from './features/Timer/Timer';
import TodoList, { type Gorev } from './features/TodoList/TodoList';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import api from './lib/api';

import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Avatar, 
  TextField, 
  Container, 
  IconButton 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


const LoginForm = () => {
  const { loginUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    loginUser(username, password);
  };

   return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, bgcolor: 'background.paper', borderRadius: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight={500}>
          Giriş Yap
        </Typography>
        <TextField label="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <TextField label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained" size="large" sx={{ mt: 1, py: 1.5 }}>Giriş</Button>
      </Box>
    </Container>
  );
};


function App() {
  const { user, logoutUser, loading } = useAuth();
  const [gorevler, setGorevler] = useState<Gorev[]>([]);
  
  useEffect(() => {
    if (user) {
      api.get('/tasks/')
        .then(response => {
          setGorevler(response.data);
        })
        .catch(error => {
          console.error("Görevler çekilirken hata:", error);
          if (error.response && error.response.status === 401) {
            logoutUser();
          }
        });
    } else {
      setGorevler([]);
    }
  }, [user, logoutUser]);


  const gorevEkle = async (text: string) => {
    try {
      const response = await api.post('/tasks/', { text });
      setGorevler([...gorevler, response.data]);
    } catch (error) {
      console.error("Görev eklenirken hata:", error);
    }
  };

  const gorevDurumunuDegistir = async (id: number) => {
    const task = gorevler.find(g => g.id === id);
    if (!task) return;

    try {
      const response = await api.put(`/tasks/${id}/`, { completed: !task.completed });
      setGorevler(gorevler.map(g => (g.id === id ? response.data : g)));
    } catch (error) {
      console.error("Görev güncellenirken hata:", error);
    }
  };

  const gorevSil = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}/`);
      setGorevler(gorevler.filter(g => g.id !== id));
    } catch (error) {
      console.error("Görev silinirken hata:", error);
    }
  };

  const siradakiGorev = gorevler.find(g => !g.completed);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </Avatar>
              <Typography>Hoş geldin, {user.username}</Typography>
              <IconButton onClick={logoutUser} title="Çıkış Yap" color="primary">
                <LogoutIcon />
              </IconButton>
            </Box>
          </Box>
          <main>
            <Timer aktifGorev={siradakiGorev ? siradakiGorev.text : null} />
            <TodoList
              gorevler={gorevler}
              onGorevEkle={gorevEkle}
              onGorevDurumDegistir={gorevDurumunuDegistir}
              onGorevSil={gorevSil}
            />
          </main>
        </Container>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}



export default App;