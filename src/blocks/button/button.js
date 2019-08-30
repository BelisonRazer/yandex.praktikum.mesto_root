
export default function FormButtonState() {
    function active(btn) {
        btn.removeAttribute('disabled');
        btn.style.cursor = 'pointer';
        btn.style.background = "#000000";
        btn.style.color = '#ffffff';
        btn.style.opacity = "1";
    }

    function deactive(btn) {
        btn.setAttribute('disabled', true);
        btn.style.cursor = 'default';
        btn.style.background = "#FFFFFF";
        btn.style.color = '#000000';
        btn.style.opacity = "0.2";
    }

    return {
        active,
        deactive
    };
}