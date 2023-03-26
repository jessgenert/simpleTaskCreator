import {NextFunction, Request, Response} from 'express';
import {Controller} from '../decorator/Controller';
import {Route} from '../decorator/Route';
import {getRepository} from 'typeorm';
import {validate, ValidatorOptions} from 'class-validator';
import Task from '../entity/Task';

@Controller('/task')
export default class TaskController {
  private taskRepo = getRepository(Task);

  private validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: {target: false, value: false},
  };

  @Route('post')
  async save(request: Request, response: Response, next: NextFunction) {
    // get the metadata/decorations from the User Object and fill with the values in the request body (which does not have any decorations)
    const newTask = Object.assign(new Task(), request.body);
    const violations = await validate(newTask, this.validOptions);
    if (violations.length) {
      response.statusCode = 422; // Uncrossable Entity
      return violations;
    } else {
      response.statusCode = 201; // Created
      return this.taskRepo.save(newTask);
    }
  }
}
