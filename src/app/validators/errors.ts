import { BehaviorSubject, distinctUntilChanged, Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";

export interface ErrorMessages {
  [key: string]: string;
}

export class Errors {
  subscription: Subscription[] = [];

  errors = new BehaviorSubject<{ [key: string]: string }>({});
  public errors$ = this.errors;

  constructor(errors: { [key: string]: string }, form: FormGroup) {
    Object.keys(errors).forEach((key) => {
      const sub = form.get(key)?.statusChanges?.pipe(distinctUntilChanged()).subscribe((status) => {
        const err = this.errors.value;
        if (status === "INVALID") {
          err[key] = errors[key];
        } else {
          delete err[key];
        }
        this.errors.next(err);
      });

      if (sub) {
        this.subscription.push(sub);
      }
    });
  }

  unsubscribe() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
