import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {IsAfterConstraint} from './IsAfterConstraint';


@Entity()
export default class Task {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column('nvarchar', {length: 30, nullable: false})
  @IsString()
  @Length(1, 30, {message: 'Title must be between $constraint1 and $constraint2 characters long'})
  taskTitle: string;

  @Column('nvarchar', {nullable: true})
  @IsString()
  @IsOptional()
  taskDescription: string;

  @Column('integer', {nullable: false})
  @IsInt()
  @Min(1, {message: 'Priority must be at least $constraint1'})
  @Max(5, {message: 'Priority cannot be larger than $constraint1'})
  taskPriority: number;

  @Column('integer', {nullable: false})
  @IsInt()
  @Min(1, {message: 'Status must be at least $constraint1'})
  @Max(3, {message: 'Status cannot be larger than $constraint1'})
  taskStatus: number;

  @Column('datetime', {nullable: false})
  @IsDateString({message: 'Incorrect date format, task not created'})
  @IsNotEmpty({message: 'Creation date must not be null or empty'})
  dateCreated: Date;

  @Column( 'datetime', {nullable: true})
  @IsDateString('datetime', {message: 'Incorrect date format, task not created'})
  @IsOptional()
  @Validate(IsAfterConstraint, {message: 'Due date must be in the future, task not created'})
  dueDate: Date;
}
