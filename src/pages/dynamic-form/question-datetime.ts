import { QuestionBase } from './question-base';

export class DatetimeQuestion extends QuestionBase<string> {
    controlType = 'datetime';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
