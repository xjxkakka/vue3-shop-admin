<template>
  <!--  面包屑   -->
  <Breadcrumb firstName="数据统计" secondName="数据报表"></Breadcrumb>
  <el-card>
    <div style="width: 750px;height: 400px;" ref="chartDom">

    </div>
  </el-card>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts';
import { reqGetEcharts } from '../../api/order'

const chartDom = ref()
onMounted(()=>{

  reqGetEcharts().then(res=>{
    var myChart = echarts.init(chartDom.value);
    let option = {
      title: {
        text: '图表'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: []
      },
      xAxis: {},
      yAxis: {},
      series: []
    };
    console.log(res)
    myChart.setOption({...option,...res.data});
  })
})



</script>

<style scoped>

</style>