import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({name: 'isAfter', async: false})
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: Date, args: ValidationArguments) {
    const startDate = new Date(propertyValue);
    return startDate.valueOf()> Date.now();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Due Date must be in the future, task not created';
  }
}
