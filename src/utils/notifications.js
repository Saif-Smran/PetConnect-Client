import Swal from 'sweetalert2';

// Success notification
export const showSuccess = (title, text = '') => {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        background: '#f0f9ff',
        color: '#0f172a',
        iconColor: '#059669'
    });
};

// Error notification
export const showError = (title, text = '') => {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        background: '#fef2f2',
        color: '#0f172a',
        iconColor: '#dc2626'
    });
};

// Warning notification
export const showWarning = (title, text = '') => {
    return Swal.fire({
        icon: 'warning',
        title,
        text,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        background: '#fffbeb',
        color: '#0f172a',
        iconColor: '#d97706'
    });
};

// Info notification
export const showInfo = (title, text = '') => {
    return Swal.fire({
        icon: 'info',
        title,
        text,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        background: '#f0f9ff',
        color: '#0f172a',
        iconColor: '#2563eb'
    });
};

// Loading notification
export const showLoading = (title = 'Loading...') => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

// Confirmation dialog
export const showConfirmation = (title, text, confirmButtonText = 'Yes, proceed!') => {
    return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#dc2626',
        confirmButtonText,
        cancelButtonText: 'Cancel'
    });
};

// Close any open Swal
export const closeSwal = () => {
    Swal.close();
};
