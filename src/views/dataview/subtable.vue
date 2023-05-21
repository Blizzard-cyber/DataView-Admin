<style scoped>
    .expand-row{
        margin-bottom: 10px;
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="(item,index) in row" :key="index">
            <Col span="8" offset="4">
                <span class="expand-key">姓名: </span>
                <span class="expand-value">{{ item.name }}</span>
            </Col>
            <Col span="8" offset="4">
                <span class="expand-key">属性: </span>
                <span class="expand-value">{{ item.attr }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Array
        }
    };
</script>