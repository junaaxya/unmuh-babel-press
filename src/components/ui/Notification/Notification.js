export default function Notification({ type, message }) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`p-3 rounded ${colors[type]}`}>
      {message}
    </div>
  );
}
