import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, Stack, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';


type TimerProps = {
  aktifGorev: string | null;
};


const VAKIT_AYARLARI = { 
  pomodoro: 25 * 60, 
  kisaMola: 5 * 60, 
  uzunMola: 15 * 60 
};

const Timer = ({ aktifGorev }: TimerProps) => {
  const [mod, setMod] = useState<'pomodoro' | 'kisaMola' | 'uzunMola'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(VAKIT_AYARLARI[mod]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsActive(false); 
    }
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const modDegistir = (yeniMod: 'pomodoro' | 'kisaMola' | 'uzunMola') => {
    setMod(yeniMod);
    setIsActive(false);
    setSecondsLeft(VAKIT_AYARLARI[yeniMod]);
  };

  const sifirlaZamanlayici = () => {
    setIsActive(false);
    setSecondsLeft(VAKIT_AYARLARI[mod]);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 4 }, width: '100%', maxWidth: 480, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        <Button variant={mod === 'pomodoro' ? 'contained' : 'text'} onClick={() => modDegistir('pomodoro')}>Pomodoro</Button>
        <Button variant={mod === 'kisaMola' ? 'contained' : 'text'} onClick={() => modDegistir('kisaMola')}>Kısa Mola</Button>
        <Button variant={mod === 'uzunMola' ? 'contained' : 'text'} onClick={() => modDegistir('uzunMola')}>Uzun Mola</Button>
      </Stack>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative', 
      }}>
        <Typography variant="h1" sx={{ 
            fontSize: { xs: '4.5rem', sm: '6rem' }, 
            fontWeight: 'bold',
            lineHeight: 1, 
         }}>
          {formatTime(secondsLeft)}
        </Typography>
        <IconButton onClick={sifirlaZamanlayici} sx={{ ml: 2, alignSelf: 'center' }}>
          <ReplayIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Box>
      <Button variant="contained" size="large" onClick={toggleTimer} sx={{ width: 200, mt: 2, mb: 2, py: 1.5, fontSize: '1.2rem', color: 'black' }}>
        {isActive ? 'DURDUR' : 'BAŞLAT'}
      </Button>
      <Typography variant="h6">
        {aktifGorev ? aktifGorev : 'Tüm görevler tamamlandı! 🎉'}
      </Typography>
    </Card>
  );
};

export default Timer;