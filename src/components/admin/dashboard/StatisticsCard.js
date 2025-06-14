const StatisticsCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: "text-blue-500",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "text-green-500",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "text-yellow-500",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: "text-red-500",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      icon: "text-purple-500",
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-full ${classes.bg}`}>
          <i className={`fas ${icon} ${classes.icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;