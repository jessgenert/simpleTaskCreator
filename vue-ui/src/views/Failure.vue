<template>
<div class="container-sm">
  <b-container class="bv-example-row">
    <b-row>
      <b-col></b-col>
      <b-col>
        <ul id="example-1">
        <li v-for="item in items" :key="item.message">
          {{ item.message }}
        </li>
      </ul>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>

</div>
</template>

<script>
import { violationErrors } from '../main'
export default {
  name: 'Failure',
  data () {
    return {
      items: [
        { message: violationErrors[0].taskTitle },
        { message: violationErrors[0].taskPriority },
        { message: violationErrors[0].dueDate }
      ]
    }
  }

}
</script>

<style scoped>
#example-1{
  max-width: 400px;
}
</style>
