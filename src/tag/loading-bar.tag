<loading-bar>
    <div class="load-bar">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>
    <style>
        .load-bar {
        position: fixed;
        top: 40px;
        left: 0;
        width: 100%;
        height: 6px;
        background-color: #A5D6A7;
        }
        .bar {
        content: "";
        display: inline;
        position: absolute;
        width: 0;
        height: 100%;
        left: 50%;
        text-align: center;
        }
        .bar:nth-child(1) {
        background-color: #00BCD4;
        animation: loading 3s linear infinite;
        }
        .bar:nth-child(2) {
        background-color: #FFEB3B;
        animation: loading 3s linear 1s infinite;
        }
        .bar:nth-child(3) {
        background-color: #FF5722;
        animation: loading 3s linear 2s infinite;
        }
        @keyframes loading {
            from {left: 50%; width: 0;z-index:100;}
            33.3333% {left: 0; width: 100%;z-index: 10;}
            to {left: 0; width: 100%;}
        }
    </style>
</loading-bar>