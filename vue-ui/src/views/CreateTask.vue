<template>
  <div class="container-sm">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Title:" label-for="input-1">
        <b-form-input
          size="lg"
          id="input-1"
          v-model="form.taskTitle"
          placeholder="Task title"
        ></b-form-input>
      </b-form-group>
<br><br>
      <b-form-group id="input-group-2" label="Task Description" label-for="input-2">
        <b-form-input
          size="lg"
          id="input-2"
          v-model="form.taskDescription"
          placeholder="Enter description for your task"
        ></b-form-input>
      </b-form-group>
      <br><br>
      <div>
        <label for="dueDate">Choose a task due date</label>
        <b-form-datepicker id="dueDate" v-model="form.dueDate" class="mb-2" value-as-date></b-form-datepicker>
        <p>Value: '{{ form.dueDate }}'</p>
      </div>
      <br><br>
      <div>
        <label for="creationDate">Task Creation date</label>
        <b-form-datepicker id="creationDate" v-model="form.dateCreated" class="mb-2" disabled></b-form-datepicker>
        <p>Value: '{{ form.dateCreated }}'</p>
      </div>

      <b-form-group id="input-group-3" label="Priority:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.taskPriority"
          :options="priorities"
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4" label="Task Status:" label-for="input-4">
        <b-form-select
          id="input-4"
          v-model="form.taskStatus"
          :options="statuses"
        ></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import { violationErrors } from '../main'
export default {
  name: 'CreateTask',
  data () {
    return {
      violation: {}, // contains the task props that have error messages
      taskToCreate: {}, // js object that stores the task data we are going to POST to the api
      form: {
        // defaults for the form
        taskTitle: '',
        taskDescription: '',
        dueDate: null,
        dateCreated: new Date(Date.now()),
        taskPriority: 0,
        taskStatus: 1
      },
      // list of options for drop down menus
      priorities: [{ text: 'Select One', value: 0 }, { text: 'Highest', value: 1 }, { text: 'High', value: 2 }, { text: 'Medium', value: 3 }, { text: 'Low', value: 4 }, { text: 'Lowest', value: 5 }],
      statuses: [{ text: 'In Progress', value: 1 }, { text: 'Completed', value: 2 }, { text: 'Deleted', value: 3 }],
      show: true
    }
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()

      // Creates the database entry by sending an API request
      this.postTask()
    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.taskTitle = ''
      this.form.taskDescription = ''
      this.form.taskPriority = 0
      this.form.dateCreated = new Date(Date.now())
      this.form.dueDate = null
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    apiRequest: async (method = 'GET', paramPath = '/', data = {}) => {
      const url = 'http://localhost:3009/task' + paramPath
      const fetchOptions = {
        credentials: 'include', // allows api to set cookies in the browser
        referrerPolicy: 'strict-origin-when-cross-origin',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XmlHttpRequest',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
      // ensure valid/allowed request methods
      method = method.toUpperCase()
      fetchOptions.method = ['GET', 'POST', 'PUT', 'DELETE'].includes(method) ? method : 'GET'
      // convert JS object to JSON string – GET request cannot have a body property
      if (fetchOptions.method !== 'GET')fetchOptions.body = JSON.stringify(data)
      const res = await fetch(url, fetchOptions) // this the browser's version of Postman
      console.log(res)// OPTIONAL: help debug if we have issues
      // if status code of the response in not in the 200s
      if (!res.ok) {
        const error = new Error(res.statusText + ':' + res.status)
        error.status = res.status
        error.statusText = res.statusText
        error.data = await res.json()
        throw error
      }

      return res.json() // convert response body/data INTO JSON
    },
    postTask () {
      this.violation = {} // clear errors from previous attempt
      // The next two lines are for setting the time in local time
      if (this.form.dueDate !== null) { this.form.dueDate.setHours(this.form.dueDate.getHours() - 6) }
      this.form.dateCreated.setHours(this.form.dateCreated.getHours() - 6)
      this.taskToCreate = { taskTitle: this.form.taskTitle, taskDescription: this.form.taskDescription, taskPriority: this.form.taskPriority, taskStatus: this.form.taskStatus, dateCreated: this.form.dateCreated, dueDate: this.form.dueDate }
      this.apiRequest('POST', '/', this.taskToCreate)
        .then(data => {
          console.log(data)
          this.$router.push('Success')
        })
        .catch(err => {
          if (err.status === 422) { // constraint violation object should have been returned by the server
            // read the violations from the server and act accordingly
            const temp = {}
            err.data.forEach(vio => {
              Object.assign(temp, { [vio.property]: vio.constraints[Object.keys(vio.constraints)[0]] })
            })
            this.violation = temp
            if (violationErrors.length) { violationErrors.pop() } // resets the errors list
            violationErrors.push(this.violation)
            this.$router.push('Failure')
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
