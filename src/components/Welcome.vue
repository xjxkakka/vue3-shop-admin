<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
    >
      <el-table-column type="index" label="#" width="60"/>
      <el-table-column prop="date" label="date"  width="180" />
      <el-table-column prop="name" label="Name"  width="180" />
    </el-table>
  </div>
  <button @click="add">+1</button>
</template>
<script  setup>

let a = [1,2,3,4,5,6,7]
let b =[...a]
console.log(a,b)
const add = ()=>{
  b.push(88)
  console.log(a)
  console.log(b)
}

const tableData = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
      },
    ],
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
  },
]

</script>
