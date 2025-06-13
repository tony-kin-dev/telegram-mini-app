import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Box } from '@mui/material';

const services = [
  { label: 'Стрижка', value: 'haircut', price: 1000 },
  { label: 'Маникюр', value: 'manicure', price: 1500 },
  { label: 'Массаж', value: 'massage', price: 2000 },
];

function App() {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string|null>(null);

  useEffect(() => {
    // Инициализация Telegram WebApp MainButton
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.MainButton.setText('Записаться');
      tg.MainButton.show();
      tg.MainButton.onClick(handleSubmit as any);
    }
    return () => {
      if (tg) tg.MainButton.offClick(handleSubmit as any);
    };
    // eslint-disable-next-line
  }, [service, date, time, name, phone, email]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, date, time, name, phone, email })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess('Заявка успешно отправлена!');
        setService(''); setDate(''); setTime(''); setName(''); setPhone(''); setEmail('');
        // Закрыть мини-приложение в Telegram
        const tg = (window as any).Telegram?.WebApp;
        if (tg) tg.close();
      } else {
        setSuccess('Ошибка при отправке заявки. Попробуйте позже.');
      }
    } catch {
      setSuccess('Ошибка при отправке заявки. Попробуйте позже.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Онлайн-запись</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select
          label="Услуга"
          value={service}
          onChange={e => setService(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {services.map(s => (
            <MenuItem key={s.value} value={s.value}>
              {s.label} ({s.price} ₽)
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Дата"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Время"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading} style={{ display: (window as any).Telegram?.WebApp ? 'none' : 'block' }}>
          {loading ? 'Отправка...' : 'Записаться'}
        </Button>
        {success && (
          <Typography color={success.startsWith('Ошибка') ? 'error' : 'primary'} sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
