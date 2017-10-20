<template>
    <Card :bordered="true" :dis-hover="true">
        <Modal v-model="showDeleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{lang.deleteConfirm}}</span>
            </p>
            <div style="text-align:center">
                <p>{{lang.deleteConfirmInfo}}</p>
                <p>{{lang.deleteConfirmYesOrNo}}</p>
            </div>
            <div slot="footer">
                <Button type="error" size="small" long @click="del">{{lang.delete}}</Button>
            </div>
        </Modal>
        <Form :model="insertRedisFormValue" :rules="ruleValidate" ref="insertRedisForm" :label-width="80"
              style="with:95%;font-size: 30px; color: #6d7380; font-weight:900;">
            <FormItem :label="lang.insertRedisType" :label-width="140" prop="insertRedisType">
                <RadioGroup v-model="insertRedisFormValue.insertRedisType">
                    <Radio v-for="redisType in redisTypes" :label="redisType.text"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Key:" prop="insertStringKey">
                <Input v-model="insertRedisFormValue.insertStringKey"/>
            </FormItem>
            <FormItem label="Value:" prop="insertStringValue">
                <Input v-model="insertRedisFormValue.insertStringValue" type="textarea"
                       :autosize="{minRows: 10,maxRows:7}"/>
            </FormItem>
            <FormItem label="Sorted Set:" prop="insertSortedSet"
                      v-show="insertRedisFormValue.insertRedisType=='Sorted Set'">
                <Input v-model="insertRedisFormValue.insertSortedSet"/>
            </FormItem>
            <FormItem>
                <Button @click.native.prevent="submitInsertForm" type="primary">{{lang.save}}</Button>
            </FormItem>
            <Card style="color:red" v-show="showRedisInsertError">
                <div style="margin-left: 10px">
                    <span>{{lang.error}}</span>
                    <Row style="width: 100%; word-wrap:break-word;">{{errorRedisInsertMessage}}</Row>
                </div>
            </Card>
        </Form>
    </Card>
</template>

<script>
    export default {
        data() {
            let self = this;
            return {
                lang: self.i18n,
                showDeleteModal: false,
                redisTypes: [
                    {text: 'String'},
                    {text: 'List'},
                    {text: 'Set'},
                    {text: 'Hash'},
                    {text: 'Sorted Set'}
                ],
                insertRedisFormValue: {
                    insertStringKey: '',
                    insertStringValue: '',
                    insertSortedSet: 1,
                    insertRedisType: 'String',
                },
                ruleValidate: {
                    insertStringKey: [
                        {required: true, message: 'Key is necessary', trigger: 'blur'}
                    ],
                    insertStringValue: [
                        {required: true, message: 'Value is necessary', trigger: 'blur'},
                    ]
                },
                showRedisInsertError: false,
                errorRedisInsertMessage: ''
            }
        },
        methods: {
            //删除Key存在的数据
            del() {
                let me = this;
                let redisKey = this.insertRedisFormValue.insertStringKey;
                me.redis.del(redisKey).then(function (result) {
                    if (result > 0) {
                        me.insertRedisData();
                        me.showDeleteModal = false;
                    }
                }).catch(res => {
                    me.$Message.error(res);
                });
            },
            /*
             * redis插入数据
             *
             * */
            insertRedisData() {
                let me = this;
                let insertRedisMethod = "";
                let redisKey = this.insertRedisFormValue.insertStringKey;
                let redisType = this.insertRedisFormValue.insertRedisType;
                let redisValue = this.insertRedisFormValue.insertStringValue;
                let sortedSet = this.insertRedisFormValue.insertSortedSet;
                switch (redisType) {
                    case "String":
                        insertRedisMethod = me.redis.set(redisKey, redisValue);
                        break;
                    case "Set":
                        insertRedisMethod = me.redis.sadd(redisKey, redisValue);
                        break;
                    case "Sorted Set":
                        if ((!isNaN(sortedSet)) && sortedSet % 1 === 0) {
                            insertRedisMethod = me.redis.zadd(redisKey, sortedSet, redisValue);
                        } else {
                            me.showRedisInsertError = true;
                            if (me.lang._lang_name === '简体中文') {
                                me.errorRedisInsertMessage = "Sorted Set必须是整数";
                            } else {
                                me.errorRedisInsertMessage = "Sorted Set should be integer";
                            }
                            return false;
                        }
                        break;
                    case "List":
                        insertRedisMethod = me.redis.lpush(redisKey, redisValue);
                        break;
                    case "Hash":
                        let valueJson = "";
                        try {
                            valueJson = JSON.parse(redisValue.toString());
                        } catch (e) {
                            me.showRedisInsertError = true;
                            if (me.lang._lang_name === '简体中文') {
                                me.errorRedisInsertMessage = "Value不是正确的Json格式";
                            } else {
                                me.errorRedisInsertMessage = "Value should be Json";
                            }
                            return false;
                        }
                        insertRedisMethod = me.redis.hmset(redisKey, valueJson);
                        break;
                }
                //insert data
                insertRedisMethod.then(function (result) {
                    if (result === "OK" || result > 0) {
                        me.$Message.success('添加成功');
                        me.$emit('doSearchKey');
                        me.showRedisInsertError = false;
                        me.errorRedisInsertMessage = '';
                        me.$refs['insertRedisForm'].resetFields();
                        return;
                    }
                    me.showRedisInsertError = true;
                    if (result === 0) {
                        if (me.lang._lang_name === '简体中文') {
                            me.errorRedisInsertMessage = "数据重复";
                        } else {
                            me.errorRedisInsertMessage = "duplicate data";
                        }
                    } else {
                        me.errorRedisInsertMessage = result;
                    }
                }).catch((error) => {
                    me.showRedisInsertError = true;
                    me.errorRedisInsertMessage = error;
                });
            },
            /**
             *submit data
             *
             **/
            submitInsertForm() {
                let me = this;
                me.$refs.insertRedisForm.validate((valid) => {
                    if (valid) {
                        let redisKey = me.insertRedisFormValue.insertStringKey;
                        me.redis.keys(redisKey).then(result => {
                            if (result && result.length !== 0) {
                                me.showDeleteModal = true;
                            } else {
                                me.insertRedisData();

                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
        }
    }
</script>