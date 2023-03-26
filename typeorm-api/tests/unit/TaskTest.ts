import Task from '../../src/entity/Task';
import {validateSync} from 'class-validator';

const taskData: any ={};

beforeEach(() => {
  taskData.taskTitle = 'Task1';
  taskData.taskDescription = 'This is task one';
  taskData.taskPriority = 3;
  taskData.taskStatus = 1;
  taskData.dateCreated = '2022-01-24T12:28:07.345Z';
  taskData.dueDate = '2022-01-29T06:00:00.000Z';
});

test('Member creates a task successfully with due date in the future', () => {
  // Check the violations are empty as the creation should be successful
  // Check that the due date is in the future
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations.length).toBe(0);
});

test('Member creates a task unsuccessfully with wrong due date format', () => {
  // Check that the date is actually a date with the built in expect

  taskData.dueDate = '20-01-2023';
  // expect(taskData.dueDate).not.toBeInstanceOf(Date);
  // Check the violations given and compared it to error message expected
  // Check that the date is actually a date
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations[0].constraints.isDateString).toEqual('Incorrect date format, task not created');
});

test('Member creates a task unsuccessfully with a due date in the past', () => {
  taskData.dueDate = '2020-01-29T06:00:00.000Z';

  // Check the violations given and compared it to error message expected
  // Check that the due date is in the future
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations[0].constraints.isAfter).toEqual('Due date must be in the future, task not created');
});

test('Member creates a task successfully with a null due date', () => {
  // Check that the due date is null with the built in expect
  taskData.dueDate = null;
  expect(taskData.dueDate).toBeNull();
  // Check the violations are empty as the creation should be successful
  // Check that the date is actually nullable
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations.length).toBe(0);
});

test('Member creates a task unsuccessfully with a null creation date', () => {
  // Check that the creation date is null with the built in expect
  taskData.dateCreated = null;
  expect(taskData.dateCreated).toBeNull();
  // Check the violations given and compared it to error message expected
  // Check that the creation date is neither empty nor null
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations[0].constraints.isNotEmpty).toEqual('Creation date must not be null or empty');
});

test('Member creates a task unsuccessfully with a priority of 0 or 6', () => {
  // Check that the priority is greater than 5 with the built in expect
  taskData.taskPriority = 6;
  expect(taskData.taskPriority).toBeGreaterThan(5);

  const task1 = Object.assign(new Task(), taskData);
  const violations1 = validateSync(task1);
  expect(violations1[0].constraints.max).toEqual('Priority cannot be larger than 5');
  // Check that the priority is less than 1 with the built in expect
  taskData.taskPriority = 0;
  expect(taskData.taskPriority).toBeLessThan(1);
  // Check the violations given and compared it to error message expected
  // Check that the task priority is between 1 and 5
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations[0].constraints.min).toEqual('Priority must be at least 1');
});

test('Member creates a task successfully with a priority of 1 to 5', () => {
  for (let i = 1; i< 6; i++) {
    taskData.taskPriority = i;
    // Check that the priority is greater than 0 and less than 5 with the built in expect
    expect(taskData.taskPriority).toBeLessThan(6);
    expect(taskData.taskPriority).toBeGreaterThan(0);
  }
  // Check the violations are empty as the creation should be successful
  // Check that the task priority is between 1 and 5
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations.length).toBe(0);
});

test('Member creates a task successfully with an empty or null description', () => {
  // Check that the description is empty with the built in expect
  taskData.taskDescription = '';
  expect(taskData.taskDescription).toBe('');
  // test that the description is null with the built in expect
  // Check the violations are empty as the creation should be successful
  // Check that the task can be empty
  const task = Object.assign(new Task(), taskData);
  const violations1 = validateSync(task);
  expect(violations1.length).toBe(0);
  taskData.taskDescription = null;
  expect(taskData.taskDescription).toBeNull();
  // Check the violations are empty as the creation should be successful
  // Check that the task can be nullable
  const violations2 = validateSync(task);
  expect(violations2.length).toBe(0);
});

test('Member creates a task successfully with a non-empty description', () => {
  // Check that the description is not null or empty with the build in expect
  expect(taskData.taskDescription).not.toBeNull();
  // Check the violations are empty as the creation should be successful
  // Check that the description is able to be created with any amount of characters
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations.length).toBe(0);
});
test('Member creates a task unsuccessfully with an empty or null title', () => {
  // Check that the title is empty with the built in expect
  taskData.taskTitle = '';
  expect(taskData.taskTitle).toBe('');
  // Check the violations given and compared it to error message expected
  // Check that the title is at least one character long and not empty
  const task = Object.assign(new Task(), taskData);
  const violations1 = validateSync(task);
  expect(violations1[0].constraints.isLength).toEqual('Title must be between 1 and 30 characters long');
  // Check that the description is null with the built in expect
  taskData.taskTitle = null;
  expect(taskData.taskTitle).toBeNull();
  // Check the violations given and compared it to error message expected
  // Check that the title is at least one character long and not null
  const violations2 = validateSync(task);
  expect(violations2[0].constraints.isLength).toEqual('Title must be between 1 and 30 characters long');
});
test('Member creates a task unsuccessfully with a 31-character title', () => {
  // Check that the title is 31 characters long with the built in expect
  taskData.taskTitle = 'a'.repeat(31);
  expect(taskData.taskTitle.length).toBeGreaterThanOrEqual(31);
  // Check the violations given and compared it to error message expected
  // Check that the title cannot be more than 30 characters in length
  const task = Object.assign(new Task(), taskData);
  const violations = validateSync(task);
  expect(violations[0].constraints.isLength).toEqual('Title must be between 1 and 30 characters long');
});
test('Member creates a task successfully with a title between 1 and 30 characters', () => {
  taskData.taskTitle = 'a';
  for (let i = 1; i < 30; i++) {
    taskData.taskTitle += 'a';
    // Check that the title is greater than or equal to 1 character long with the built in expect
    expect(taskData.taskTitle.length).toBeGreaterThanOrEqual(1);
    // Check that the title is less than or equal to 30 characters long with the built in expect
    expect(taskData.taskTitle.length).toBeLessThanOrEqual(30);
    // Check the violations are empty as the creation should be successful
    // Check that the task can be anywhere between 1 and 30 characters long
    const task = Object.assign(new Task(), taskData);
    const violations = validateSync(task);
    expect(violations.length).toBe(0);
  }
});


