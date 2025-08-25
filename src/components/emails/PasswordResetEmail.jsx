import React from 'react';

const container = {
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
};

const button = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderRadius: '4px',
  textDecoration: 'none',
};

export default function PasswordResetEmail({ resetLink }) {
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={container}>
        <h2 style={{ color: '#111827' }}>Reset Password</h2>
        <p style={{ color: '#374151', lineHeight: '1.5' }}>
          Anda menerima email ini karena ada permintaan untuk mereset kata sandi akun Anda.
          Klik tombol di bawah ini untuk melanjutkan proses reset kata sandi.
        </p>
        <p style={{ textAlign: 'center', margin: '30px 0' }}>
          <a href={resetLink} style={button}>Reset Password</a>
        </p>
        <p style={{ color: '#374151', lineHeight: '1.5' }}>
          Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini. Tautan reset berlaku selama 1 jam.
        </p>
      </div>
    </div>
  );
}

