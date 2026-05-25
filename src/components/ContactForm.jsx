import React, { useState, useEffect } from 'react';

// Додано export default, щоб App.jsx міг бачити цей компонент [cite: 133, 140]
const ContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Автоматичне відкриття через 1 хвилину (60000 мс) 
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer); // Очищення таймера для запобігання витоку пам'яті
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[2000] flex justify-center items-center p-4">
      {/* Виправлено клас max-w-md  */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-indigo-500/20 relative">
        <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">Залишити запит</h3>
        
        {/* Форма налаштована на Formspree [cite: 65, 66, 67, 149] */}
        <form action="https://formspree.io/f/mojkzdqk" method="POST" className="space-y-4">
          <input type="text" name="name" placeholder="Ваше ім'я" required className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="email" name="email" placeholder="Email" required className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="tel" name="phone" placeholder="+380..." required className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-indigo-500 outline-none" />
          <textarea name="message" placeholder="Ваше повідомлення" required className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-indigo-500 outline-none h-32"></textarea>
          
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30">Відправити</button>
            {/* Кнопка закриття встановити isOpen в false [cite: 145] */}
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-4 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">Закрити</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;