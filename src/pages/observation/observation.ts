import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup } from "@angular/forms";
import { QuestionBase } from "../dynamic-form/question-base";
import { QuestionControlService } from "../dynamic-form/question-control.service";
import { QuestionService } from "../dynamic-form/question.service";

@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html',
    providers: [ QuestionControlService, QuestionService ]
})
export class ObservationPage {

    questions: QuestionBase<any>[] = [];
    form: FormGroup;
    payLoad = '';

    constructor(public navCtrl: NavController, private questionControlService: QuestionControlService, private questionService: QuestionService) {
        this.questions = questionService.getQuestions();
    }

    ngOnInit() {
        this.form = this.questionControlService.toFormGroup(this.questions);
    }

    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }

}
