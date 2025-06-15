import React, { useState } from 'react';
import { Box, Button, Typography, Card, TextField, List, ListItem, ListItemText, IconButton, Divider, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


export type Gorev = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoListProps = {
  gorevler: Gorev[];
  onGorevEkle: (text: string) => void;
  onGorevDurumDegistir: (id: number) => void;
  onGorevSil: (id: number) => void;
};

const TodoList = ({ gorevler, onGorevEkle, onGorevDurumDegistir, onGorevSil }: TodoListProps) => {
  const [yeniGorevMetni, setYeniGorevMetni] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yeniGorevMetni.trim() === '') return;
    onGorevEkle(yeniGorevMetni);
    setYeniGorevMetni('');
  };

  return (
    <Card sx={{ p: 2, width: '100%', maxWidth: 480, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>Görevler</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField label="Yeni bir görev ekle..." variant="outlined" size="small" fullWidth value={yeniGorevMetni} onChange={(e) => setYeniGorevMetni(e.target.value)} />
        <Button type="submit" variant="contained" sx={{ px: 3 }}><AddIcon /></Button>
      </Box>
      <Divider />
      <List>
        {gorevler.map((gorev) => (
          <ListItem key={gorev.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => onGorevSil(gorev.id)}><DeleteIcon /></IconButton>
            }
            disablePadding
          >
            <Checkbox checked={gorev.completed} onChange={() => onGorevDurumDegistir(gorev.id)} />
            <ListItemText primary={gorev.text} sx={{ textDecoration: gorev.completed ? 'line-through' : 'none', opacity: gorev.completed ? 0.6 : 1 }} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default TodoList;