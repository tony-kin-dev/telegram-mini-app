import express from 'express';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Telegram Bot
const botToken = process.env.BOT_TOKEN || '8055666970:AAG5shWIiqGo0Nhhshe_oaFPcSUQUutBZrg';
const bot = new Telegraf(botToken);

bot.start((ctx) => ctx.reply('Бот для управления записями запущен!'));

bot.on('message', (ctx) => {
  console.log('Ваш chat_id:', ctx.from?.id);
  ctx.reply(`Ваш chat_id: ${ctx.from?.id}`);
});

// Запуск бота
bot.launch();

// Пример API endpoint
app.get('/', (req, res) => {
  res.send('Backend для Telegram Mini App работает!');
});

// Endpoint для приёма заявок
app.post('/api/booking', async (req, res) => {
  const { service, date, time, name, phone, email } = req.body;
  try {
    // Формируем текст уведомления
    const text = `Новая заявка!\n\nУслуга: ${service}\nДата: ${date}\nВремя: ${time}\nИмя: ${name}\nТелефон: ${phone}\nE-mail: ${email || '-'} `;
    // Отправляем админу (замените chat_id на свой или используйте ctx.from.id при первом обращении к боту)
    await bot.telegram.sendMessage('460187509', text);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Ошибка при отправке заявки' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 