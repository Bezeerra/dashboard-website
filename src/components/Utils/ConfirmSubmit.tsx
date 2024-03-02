import {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";

export const useConfirmDialog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const requestConfirm = (confirmAction: any) => {
    setIsVisible(true);
    setOnConfirm(() => confirmAction);
  };

  useEffect(() => {
    if (isVisible) {
      const div = document.createElement('div');
      div.id = 'confirm-dialog-container';
      document.body.appendChild(div);

      const root = createRoot(div);
      root.render(<ConfirmDialog onConfirm={() => {
        onConfirm();
        setIsVisible(false);
        document.body.removeChild(div);
      }} onCancel={() => {
        setIsVisible(false);
        document.body.removeChild(div);
      }}/>);

      return () => {
        if (document.body.contains(div)) {
          document.body.removeChild(div);
        }
      };
    }
  }, [isVisible, onConfirm]);

  return { requestConfirm };
};

const ConfirmDialog = ({ onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="w-80 h-90 bg-white p-5 rounded-lg shadow">
      Do you have sure want to do this action?
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);