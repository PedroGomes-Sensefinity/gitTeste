import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toaster = {
    notify( type = "", msg = "") {
        const toasterProperties = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }

        const types = ["info", "warning", "error"]
        
        if ( !types.includes( type ) ) {
            toast( msg, toasterProperties );
            return;
        }

        toast[type]( msg, toasterProperties );
    }

}

export default toaster;