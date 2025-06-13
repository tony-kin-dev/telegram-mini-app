import React, { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      console.log('Получена заявка:', { service, date, time, name, phone, email });
      const res = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, date, time, name, phone, email })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess('Заявка успешно отправлена!');
        setService(''); setDate(''); setTime(''); setName(''); setPhone(''); setEmail('');
      } else {
        setSuccess('Ошибка при отправке заявки. Попробуйте позже.');
      }
    } catch (e) {
      console.error('Ошибка при отправке заявки:', e);
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
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
