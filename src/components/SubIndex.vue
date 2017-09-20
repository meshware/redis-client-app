<template>
    <div id="right-content" style="height: 100%; padding-left:0; padding-top: 10px">
        <!--<div class="layout-breadcrumb">-->
            <!--<Breadcrumb>-->
                <!--<Breadcrumb-item href="#">DB1</Breadcrumb-item>-->
                <!--<Breadcrumb-item>KEY1</Breadcrumb-item>-->
            <!--</Breadcrumb>-->
        <!--</div>-->
        <Card :dis-hover="true" style="width:100%">
            <div style="text-align:center">
                <img src="./asserts/icons/256xieicon.png">
                <h3>基于IORedis, Electron的Redis桌面客户端！</h3>
            </div>
        </Card>
    <!-- <div class="layout-copy">
        2011-2017 &copy; UUGU
    </div> -->
    </div>
</template>

<script>
    import SystemInformation from './landingPage/SystemInformation'

    import executor from '../common/executor';

//    executor.run("ls /");

    export default {
        name: 'landing-page',
        components: {SystemInformation},
        data () {
            return {
                key: this.$route.params.key,
                content: null,
                spanLeft: 5,
                spanRight: 19,
                tab0: true,
                tab1: true,
                tab2: true
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        },
        created() {
           
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'doGetContent'
        }
    }
</script>

<style>


</style>
