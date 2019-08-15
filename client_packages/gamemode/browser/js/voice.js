$(document).ready(() => {
    window.voiceAPI = {
        on: () => {
            $("#microphone").css("opacity", '1.0');
        },
        off: () => {
            $("#microphone").css("opacity", '0.3');
        }
    };
});
