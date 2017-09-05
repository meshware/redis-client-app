<template>
    <i-form :model="formItem" :label-width="80">
        <Form-item label="输入框">
            <Input v-model="formItem.input" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="选择器">
            <Select v-model="formItem.select" placeholder="请选择">
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="shenzhen">深圳市</Option>
            </Select>
        </Form-item>
        <Form-item label="日期控件">
            <Row>
                <Col span="11">
                    <Date-picker type="date" placeholder="选择日期" v-model="formItem.date"></Date-picker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <Time-picker type="time" placeholder="选择时间" v-model="formItem.time"></Time-picker>
                </Col>
            </Row>
        </Form-item>
        <Form-item label="单选框">
            <Radio-group v-model="formItem.radio">
                <Radio label="male">男</Radio>
                <Radio label="female">女</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="多选框">
            <Checkbox-group v-model="formItem.checkbox">
                <Checkbox label="吃饭"></Checkbox>
                <Checkbox label="睡觉"></Checkbox>
                <Checkbox label="跑步"></Checkbox>
                <Checkbox label="看电影"></Checkbox>
            </Checkbox-group>
        </Form-item>
        <Form-item label="开关">
            <i-switch v-model="formItem.switch" size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </Form-item>
        <Form-item label="滑块">
            <Slider v-model="formItem.slider" range></Slider>
        </Form-item>
        <Form-item label="文本域">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item>
            <Button type="primary">提交</Button>
            <Button type="ghost" style="margin-left: 8px">取消</Button>
        </Form-item>
    </i-form>
</template>
<script>
    export default {
        name: "addDB",
        data () {
            return {
                formItem: {
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                }
            }
        }
    }
</script>
<style scoped>
    @import url('./asserts/css/iview.css');
</style>
