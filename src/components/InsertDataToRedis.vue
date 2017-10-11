<template>
    <Card :bordered="true" :dis-hover="true">
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
                <Input v-model="insertRedisFormValue.insertStringValue"/>
            </FormItem>
            <FormItem label="Sorted Set:" prop="insertSortedSet" v-show="insertRedisFormValue.insertRedisType=='Sorted Set'">
                <Input v-model="insertRedisFormValue.insertSortedSet"/>
            </FormItem>
            <FormItem>
                <Button @click.native.prevent="submitInsertForm" type="primary" shape="circle">{{lang.save}}</Button>
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
    export default{
        data() {
            let self = this;
            return {
                lang: self.i18n,
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
                        {required: true, message: 'Key必填', trigger: 'blur'}
                    ],
                    insertStringValue: [
                        {required: true, message: 'Value必填', trigger: 'blur'},
                    ]
                },
                showRedisInsertError: false,
                errorRedisInsertMessage: ''
            }
        },
        methods: {
            /*
             * redis插入数据
             *
             * */
            submitInsertForm(){
                this.$refs.insertRedisForm.validate((valid) => {
                    if (valid) {
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
                            case "Sorted Set":
                                if((!isNaN(sortedSet)) && sortedSet%1 === 0) {
                                    insertRedisMethod = me.redis.zadd(redisKey, sortedSet, redisValue);
                                }else{
                                    me.showRedisInsertError = true;
                                    me.errorRedisInsertMessage = "Sorted Set必须是整数";
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
                                    me.errorRedisInsertMessage = "Value不是正确的Json格式";
                                    return false;
                                }
                                insertRedisMethod = me.redis.hmset(redisKey, valueJson);
                                break;
                        }
                        insertRedisMethod.then(function (result) {
                            console.log(result);
                            if (result === "OK" || result > 0) {
                                me.$Message.info('添加成功');
                                me.$emit('doSearchKey');
                                me.showRedisInsertError = false;
                                me.errorRedisInsertMessage = '';
                                me.$refs['insertRedisForm'].resetFields();
                                return;
                            }
                            me.showRedisInsertError = true;
                            if (result === 0) {
                                me.errorRedisInsertMessage = "插入未成功,数据重复";
                            } else {
                                me.errorRedisInsertMessage = result;
                            }
                        }).catch((error) => {
                            me.showRedisInsertError = true;
                            if (error.message == "WRONGTYPE Operation against a key holding the wrong kind of value") {
                                me.errorRedisInsertMessage = "其它数据类型占有此key";
                            } else {
                                me.errorRedisInsertMessage = error;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>