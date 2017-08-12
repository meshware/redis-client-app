<template>
    <div id="right-content" style="height: 100%; padding-left:10px; padding-top: 10px">
        <!--<div class="layout-breadcrumb">-->
            <!--<Breadcrumb>-->
                <!--<Breadcrumb-item href="#">DB1</Breadcrumb-item>-->
                <!--<Breadcrumb-item>KEY1</Breadcrumb-item>-->
            <!--</Breadcrumb>-->
        <!--</div>-->
        <Tabs style="-webkit-app-region: drag;">
            <Tab-pane label="内容" icon="document-text">
                标签一的内容
            </Tab-pane>
            <Tab-pane label="设置" icon="gear-a">
                标签二的内容
            </Tab-pane>
            <Tab-pane label="其他" icon="ios-pulse-strong">
                标签三的内容
            </Tab-pane>
        </Tabs>
    <!--<div class="layout-copy">-->
        <!--2011-2017 &copy; UUGU-->
    <!--</div>-->
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
            },
            handleTabRemove (name) {
                this['tab' + name] = false;
            },
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            }
        }
    }
</script>

<style>


</style>
