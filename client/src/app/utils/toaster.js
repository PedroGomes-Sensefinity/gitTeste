import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toaster = {
    notify(type = "info", msg = "", callback) {
        const toasterProperties = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: callback,
        }

        const types = ["success", "info", "warning", "error"]

        toast[type](msg, toasterProperties);
    }

}

export default toaster;