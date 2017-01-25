(function ($) {
    'use strict';
    $.fn.player = function () {
        var playerLoc = this[0];
        var responsive = "yes", //You must place <div id="wthvideo"></div> inside the div you want the video to be in.
            width = "172", //video width
            height = "155", //video height
            position = "fixed", //fixed or absolute positioning
            left = "50%", //if centering on page change this to 50%
            right = "auto",
            divTop = "auto",
            bottom = "auto",
            centeroffset = "auto", //if centering on page negative numbers are left and positive numbers are right
            color = "rgba(61,156,235,0.4)", //the color of the player bar.
            volume = "0.8",
            delay = 0, //delay start of video
            /*controlbar = "mouse",*/ //options for showing the controlbar, yes, no, and mouse
            exitbtn = "yes", //show or not show exitbtn
            autostart = "no", //autostart options yes, no, mute, oncethenpic, oncethenmute, onceonlythenpic, onceonlythenmute, and loop
            exitoncomplete = "no", //option for player to close after video completes. "yes" or "no"
            oncepersession = "no", //option for number of times video plays "yes", "no", or "onceonly"
            vidLink = "", //make the Talking Heads Player a link. Either leave this set to "no" or you can put a complete URL inside the quotes.
            openIn = "_blank",
            path = "wthvideo", //path to where the files are located
            actorpic = "Cassi_short", //transparent gif
            h264 = "Cassi_short", //Just name,not extension h264
            // end Main Player Vars
            imagePath = path + "/",
            gb = imagePath + actorpic,
            gifBackground = "url('" + gb + ".png')",
            buttonPath = imagePath + "buttons" + "/",
            hVideo = path + "/" + h264 + ".mp4",
            leftEnd = left.charAt(left.length - 1),
            overflow = "hidden",
            playerBarWidth = 134,
            btnWidth = 32,
            playerBarHeight = btnWidth + 4,
            /*playerBarMarginBase = (playerBarHeight * (-1)) + "px",*/
            playerBarMargin = (width - playerBarWidth) / 2,
            hasSeenLS, hasSeenSS = false,
            actorGif, thplayer, spokespersonImage, playingS, toLoop, toMute = false,
            toPlay = true,
            hasSeen = "hasSeen" + h264;
        btnWidth = btnWidth + "px";
        delay = delay * 1000;
        actorGif = imagePath + actorpic + ".png";
        buttonPath = imagePath + "buttons" + "/";
        leftEnd = left.charAt(left.length - 1);
        switch (leftEnd) {
            case "%":
                break;
            case "o":
                break;
            default:
                left += "px";
        }
        if (divTop !== "auto") {
            divTop += "px";
        }
        if (right !== "auto") {
            right += "px";
        }
        if (centeroffset !== "auto") {
            centeroffset += "px";
        }
        if (bottom !== "auto") {
            bottom += "px";
        }

        hVideo = path + "/" + h264 + ".mp4";
        hasSeenSS = sessionStorage.getItem(hasSeen);
        hasSeenLS = localStorage.getItem(hasSeen);
        if (hasSeenLS === null) {
            if (autostart !== "no" || autostart === "mute") {
                autostart = "yes";
            }
        } else {
            oncepersessionSwitch();
            autostartSwitch();
        }
        if (hasSeenSS !== null) {
            switch (autostart) {
                case "oncethenmute":
                case "mute":
                case "loop":
                    toLoop = true;
                    toMute = true;
                    autostart = "mute";
                    break;
                case "oncethenpic":
                case "onceonlythenpic":
                    autostart = "no";
                    break;
            }
        }
        sessionStorage.setItem(hasSeen, true);
        localStorage.setItem(hasSeen, true);
        if (toPlay === true) {
            setTimeout(function () {
                createDiv();
            }, delay);
        } else {
            return;
        }

        function autostartSwitch() {
            switch (autostart) {
                case "onceonlythenmute":
                    autostart = "mute";
                    break;
                case "onceonlythenpic":
                    autostart = "no";
                    break;
                default:
                    break;
            }
        }

        function oncepersessionSwitch() {
            switch (oncepersession) {
                case "yes":
                    if (hasSeenSS === "true") {
                        toPlay = false;
                    }
                    break;
                case "onceonly":
                    if (hasSeenLS === "true") {
                        toPlay = false;
                    }
                    break;
                default:
                    toPlay = true;
                    break;
            }
        }

        function createDiv() {
            if (responsive === "yes") {
                $(playerLoc).css({
                    "position": "relative",
                    "left": "50%",
                    "margin-left": (width / 2) * -1 + "px",
                    "top": "auto",
                    "bottom": "0"
                });
            } else {
                $(playerLoc).css({
                    "position": position,
                    "left": left,
                    "margin-left": centeroffset,
                    "top": divTop,
                    "bottom": bottom,
                    "right": right
                });
                $(document).append($(playerLoc));
            }
            $(playerLoc).css({
                "height": height + "px",
                "width": width + "px",
                "cursor": "pointer",
                "overflow": overflow
            });
            createVideo();
            createControls();
            HTML5Autostart();
            addListeners();
        }

        function createVideo() {
            var video = $("<video/>", {
                "id": "talkinghead",
                "playsinline": "playsinline",
                "src": hVideo,
                "poster": actorGif,
                "volume": volume,
                "width": width + "px",
                "height": height + "px"
            });
            if (toLoop) {
                video.attr("loop", "true");
            }
            if (toMute) {
                video.attr("muted", "true");
            }
            $(playerLoc).append(video);
            thplayer = $('#talkinghead')[0];
        }


        function createControls() {
            //holder
            $(playerLoc).append('<div id="playerHolder"/>');
            $('#playerHolder').css({
                "position": "relative",
                "left": "0",
                "top": (height * -1) + "px",
                "width": width + "px",
                "height": height + "px"
            });
            ///add exit btn if needed
            if (exitbtn === "yes") {
                $('<img />', {
                    "id": "exitMain",
                    "width": "16px",
                    "src": buttonPath + "ExitBtn-full.png"
                }).appendTo($('#playerHolder'));
                $('#exitMain').css({
                    "margin-left": (width - 20) + "px",
                    "margin-top": "-2px"
                });
            }
            jQuery('<div/>', {
                "id": 'PlayerBar'
            }).appendTo(playerLoc);
            $('#PlayerBar').css({
                "height": playerBarHeight + "px",
                "width": playerBarWidth + "px",
                "borderRadius": "8px",
                "border": "1px solid #3D9CEB",
                "paddingLeft": "3px",
                "paddingTop": "1px",
                "margin": "0 auto",
                "left": playerBarMargin + "px",
                "bottom": "0px",
                "position": "absolute",
                "background": color
            });
            $('<img />', {
                "id": "PlayPauseBtn",
                "src": buttonPath + "PlayBtn.png",
                "width": btnWidth,
                "height": btnWidth,
                "class": "playerBtns"
            }).appendTo($('#PlayerBar'));
            $('<img />', {
                "id": "muteBtn",
                "src": buttonPath + "VolumeBtn.png",
                "width": btnWidth,
                "height": btnWidth,
                "class": "playerBtns"
            }).appendTo($('#PlayerBar'));
            $('<img />', {
                "id": "restartBtn",
                "src": buttonPath + "RestartBtn.png",
                "width": btnWidth,
                "height": btnWidth,
                "class": "playerBtns"
            }).appendTo($('#PlayerBar'));
            $('<img />', {
                "id": "playerClose",
                "src": buttonPath + "ExitBtn.png",
                "width": btnWidth,
                "height": btnWidth,
                "class": "playerBtns"
            }).appendTo($('#PlayerBar'));
        }

        function HTML5Autostart() {
            if (autostart === "yes" || toLoop === true) {
                thplayer.oncanplay = function () {
                    if (thplayer.paused === true) {
                        autostart = "cant auto play";
                        addBackground();
                    }
                };
            }
            if (autostart === "yes" || toLoop === true) {
                thplayer.autoplay = true;
                document.getElementById("PlayPauseBtn").src = buttonPath + "PauseBtn.png";
                document.getElementById("PlayerBar").style.opacity = "1";
                startPlaying();
            } else {
                addBackground();
            }
            if (exitoncomplete === "yes") {
                thplayer.addEventListener("ended", closePlayer, false);
            }
        }

        function addListeners() {
            //Hover
            $('.playerBtns').each(function (index, element) {
                $(element).mouseenter(function () {
                    $(element).css("opacity", 0.8);
                });
            });
            //mouse out
            $('.playerBtns').each(function (index, element) {
                $(element).mouseout(function () {
                    $(element).css("opacity", 1);
                });
            });
            //clicks
            $(playerLoc).click(function (e) {
                console.log(e.target);
                if (e.target !== e.currentTarget) {
                    if (toMute) {
                        removeMuted();
                    }
                    switch (e.target.id) {
                        case "PlayPauseBtn":
                        case "playerHolder":
                            if (spokespersonImage) {
                                spokespersonImage.style.display = "none";
                            }
                            playToggle();
                            break;
                        case "muteBtn":
                            muteToggle();
                            break;
                        case "restartBtn":
                            restartClick();
                            break;
                        case "playerClose":
                        case "exitMain":
                            closePlayer();
                            break;
                        case "spokespersonImage":
                            playClick();
                            break;
                        case "talkinghead":
                            if (vidLink !== "") {
                                openLink();
                            } else {
                                playToggle();
                            }
                            break;
                        case "imgLnk":
                        case "Spokesperson":
                        case "talkinghead":
                            openLink();
                            break;
                    }
                }
                e.stopPropagation();
            });
        }
        $('#talkinghead').bind('ended', function () {
            if (exitoncomplete === "yes") {
                closePlayer();
            }
        });

        function playClick() {
            try {
                spokespersonImage.style.display = "none";
            } catch (err) {}
            thplayer.play();
            document.getElementById("PlayPauseBtn").src = buttonPath + "PauseBtn.png";
        }

        function playToggle() {
            if (thplayer.paused) {
                thplayer.play();
                document.getElementById("PlayPauseBtn").src = buttonPath + "PauseBtn.png";
                document.getElementById("PlayerBar").style.opacity = "1";
            } else {
                document.getElementById("PlayPauseBtn").src = buttonPath + "PlayBtn.png";
                thplayer.pause();
            }
        }

        function muteToggle() {
            if (thplayer.muted) {
                thplayer.muted = false;
                document.getElementById("muteBtn").src = buttonPath + "VolumeBtn.png";
            } else {
                document.getElementById("muteBtn").src = buttonPath + "VolumeBtnMute.png";
                thplayer.muted = true;
            }
        }

        function restartClick() {
            thplayer.currentTime = 0;
            document.getElementById("PlayPauseBtn").src = buttonPath + "PauseBtn.png";
            playClick();
            thplayer.play();
        }

        function closePlayer() {
            thplayer.pause();
            clearInterval(playingS);
             $(playerLoc).remove();
        }

        function addBackground() {
            $('#spokespersonImage').css({
                "background-image": gifBackground,
                "background-repeat": "no-repeat",
                "position": "absolute",
                "height": height + "px",
                "width": width + "px",
                "cursor": "pointer",
                "overflow": overflow
            });
            $('#spokespersonImage').insertBefore($(playerLoc));
        }


        function openLink() {
            document.getElementById("PlayPauseBtn").src = buttonPath + "PlayBtn.png";
            thplayer.pause();
            window.open(vidLink, openIn);
        }

        function removeMuted() {
            document.getElementById("muteBtn").src = buttonPath + "VolumeBtn.png";
            toMute = false;
            toLoop = false;
            thplayer.muted = false;
            thplayer.loop = false;
            setTimeout(function () {
                restartClick();
            }, 150);
        }

        function startPlaying() {
            thplayer.play();
            document.getElementById("PlayPauseBtn").src = buttonPath + "PauseBtn.png";
        }
    };
}(jQuery));
