const log = document.querySelectorAll("div.log")[0];
const banners = document.querySelectorAll("picture.added img, video.added");
let message = log.innerHTML;
let loaded = false;
let title = "";
let isVideo = false;

const handleVideoClick = (e) => {
    e.preventDefault();
    e.target.muted = !e.target.muted;
};
const countVideoLoop = (e) => {
    if (e.target.currentTime > 0.5) return;
    let i =
        e.target.dataset.loopCount !== undefined
            ? e.target.dataset.loopCount
            : 0;
    i++;
    e.target.dataset.loopCount = i;
    console.log(e.target.title + " loop #" + i);
};

document.addEventListener("scroll", (e) => {
    loaded = true;
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            isVideo = false;
            title = entry.target.alt;
            if (entry.target.nodeName === "VIDEO") {
                isVideo = true;
                title = entry.target.title;
            }
            entry.target.classList.toggle("show", entry.isIntersecting);
            if (entry.isIntersecting) {
                if (isVideo) {
                    entry.target.addEventListener("click", handleVideoClick);
                    entry.target.addEventListener("playing", countVideoLoop);
                    entry.target.play();
                }
                message += '<br>"' + title + '" fully displayed > start event';
                if (eval("typeof " + "gtag") === "function") {
                    gtag("event", "banner_display", {
                        event_category: "visible",
                        event_label: title,
                        value: 1,
                        non_interaction: true,
                    });
                }
            } else {
                if (isVideo) {
                    entry.target.removeEventListener("click", handleVideoClick);
                    entry.target.removeEventListener("playing", countVideoLoop);
                    isPlayingTracked = false;
                    entry.target.muted = true;
                    entry.target.pause();
                }
                if (loaded) {
                    message +=
                        '<br>"' + title + '" out of viewport > end event';
                    if (eval("typeof " + "gtag") === "function") {
                        gtag("event", "banner_display", {
                            event_category: "hidden",
                            event_label: title,
                            value: 1,
                            non_interaction: true,
                        });
                    }
                } else {
                    message +=
                        '<br>"' +
                        title +
                        '" out of viewport but on pageload > no event';
                }
            }
            log.innerHTML = message;
        });
    },
    { threshold: 1 }
);

banners.forEach((banner) => {
    observer.observe(banner);
    if (banner.nodeName === "VIDEO") {
    }
});
