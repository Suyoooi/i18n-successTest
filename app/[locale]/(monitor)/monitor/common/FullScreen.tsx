export const fullscreen = (element: any) => {
    if (element.requestFullscreen) return element.requestFullscreen()
    else if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen()
    else if (element.mozRequestFullScreen) return element.mozRequestFullScreen()
    else if (element.msRequestFullscreen) return element.msRequestFullscreen()
}

export const exitFullScreen = () => {
    const documentElement = document as unknown as { 
        exitFullscreen: () => void;
        webkitCancelFullscreen: () => void;
        mozCancelFullScreen: () => void;
        msExitFullscreen: () => void;
    };
    if (documentElement.exitFullscreen) return documentElement.exitFullscreen()
    else if (documentElement.webkitCancelFullscreen) return documentElement.webkitCancelFullscreen()
    else if (documentElement.mozCancelFullScreen) return documentElement.mozCancelFullScreen()
    else if (documentElement.msExitFullscreen) return documentElement.msExitFullscreen()
}

export const toggleFullScreen = (element: any) => {
    const documentElement = document as unknown as { 
        exitFullscreen: () => void;
        webkitCancelFullscreen: () => void;
        mozCancelFullScreen: () => void;
        msExitFullscreen: () => void;
    };
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) return element.requestFullscreen()
        else if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen()
        else if (element.mozRequestFullScreen) return element.mozRequestFullScreen()
        else if (element.msRequestFullscreen) return element.msRequestFullscreen()
    } else {
        if (documentElement.exitFullscreen) return documentElement.exitFullscreen()
        else if (documentElement.webkitCancelFullscreen) return documentElement.webkitCancelFullscreen()
        else if (documentElement.mozCancelFullScreen) return documentElement.mozCancelFullScreen()
        else if (documentElement.msExitFullscreen) return documentElement.msExitFullscreen()
    }
}

