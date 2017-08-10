<template>
<div id="wrapper">
        <main>
            <div class="left-side">
        <span class="title">
          Menu {{ $route.params.userId }}
        </span>
            </div>

            <div class="right-side">
                <div class="doc">
                    <div class="title">Getting Started</div>
                    <p>
                        Test
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import Sockjs from 'sockjs-client';
    import { ipcRenderer } from 'electron'
    import config from '../../common/config_util';

    export default {
        name: 'simulation',
        components: {},
        data() {
            return {
                strategyId: $route.params.strategyId,
                resultId: $route.params.resultId,
                ws: null,
                connected: false
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            /**
             * 连接WebSocket
             */
            connect () {
                var self = this;
                this.ws = new Sockjs(config.getServerUrl() + "/getSimulationResult");
                console.log(ws);
                ws.onopen = function () {
                    this.connected = true;
                    console.log('Info: connection opened.');
                };
                ws.onmessage = function (event) {
                    alert('Received:' + event.data);
                    console.log('Received: ' + event.data);
                };
                ws.onclose = function (event) {
                    this.connected = false;
                    console.log('Info: connection closed.');
                    console.log(event);
                };
//                ipcRenderer.send(IPC_CHANNEL_OPEN_FILE_DIALOG)
            }
        },
        //初始化事件
        created () {
            this.connect();
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }


</style>
