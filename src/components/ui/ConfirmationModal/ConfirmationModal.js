// src/components/ui/ConfirmationModal/ConfirmationModal.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi", 
  message, 
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  type = "danger", // danger, warning, info
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: faExclamationTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      icon: faExclamationTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      icon: faExclamationTriangle,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
          <div className="p-6">
            <div className="flex items-center">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${currentStyle.iconBg}`}>
                <FontAwesomeIcon 
                  icon={currentStyle.icon} 
                  className={`h-6 w-6 ${currentStyle.iconColor}`} 
                />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2 h-4 w-4" />
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${currentStyle.confirmBtn}`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghapus...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;