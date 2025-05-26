const DashboardCard = ({ title, children, footer }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 bg-gray-50">{footer}</div>}
    </div>
  );
};

export default DashboardCard;