import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import './MiniChat.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Oi! Posso te ajudar a analisar receitas, despesas, saldos e comparar clubes.',
};

export default function MiniChat() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const canSend = input.trim().length > 1 && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSend) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMessage.content,
        context: {
          pathname: location.pathname,
          fiscal_year: new Date().getFullYear(),
        },
        history: messages.slice(-6),
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data?.answer || 'Não consegui responder agora.' },
      ]);
    } catch (err) {
      const apiError = err.response?.data?.error || '';
      const isServiceUnavailable =
        err.response?.status === 503 ||
        apiError.toLowerCase().includes('não configurada');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isServiceUnavailable
            ? 'Assistente temporariamente indisponível no momento.'
            : err.response?.data?.error || 'Não consegui responder agora. Tente novamente.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mini-chat-root" aria-live="polite">
      {open && (
        <section className="mini-chat-panel" aria-label="Assistente do ClubeAberto">
          <header className="mini-chat-header">
            <div>
              <strong>Assistente</strong>
              <p>Dados do ClubeAberto</p>
            </div>
            <button className="mini-chat-close" onClick={() => setOpen(false)} aria-label="Fechar chat">
              ×
            </button>
          </header>

          <div className="mini-chat-messages">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`mini-chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="mini-chat-bubble assistant">Analisando seus dados...</div>}
          </div>

          <form className="mini-chat-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mini-chat-input"
              placeholder="Pergunte sobre finanças dos clubes"
              maxLength={2000}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!canSend}>
              Enviar
            </button>
          </form>
        </section>
      )}

      <button
        className="mini-chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar assistente' : 'Abrir assistente'}
      >
        {open ? 'Fechar' : 'Perguntar'}
      </button>
    </div>
  );
}
