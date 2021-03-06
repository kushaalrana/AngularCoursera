import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import {flyInOut,expand} from '../animations/app.animation';
import {FeedbackService} from '../services/feedback.service';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block;'
    
      },
      animations: [flyInOut(),expand()]
    })
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  feedbackcopy: Feedback;
  errMess: string;

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters.'
    },
    'lastname': {
      'required': 'Last name name is required.',
      'minlength': 'Last name name must be 2 characters long.',
      'maxlength': 'Last name name cannot be more than 25 characters.'
    },
    'telnum': {
      'required': 'Tel number is required.',
      'pattern': 'Tel number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    }
  };
  isLoading: boolean;
  isShowingResponse: boolean;
  
  constructor(private feedbackService: FeedbackService , private fb: FormBuilder) {
    this.createForm();
    this.isLoading = false;
    this.isShowingResponse = false;
  }
  ngOnInit(): void {

  }
  createForm() {//this is the structure of the form whenever this method is called  this form will be reactive form 
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();//(re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }
}
onSubmit() {
  this.isLoading = true;
  this.feedback = this.feedbackForm.value;
  this.feedbackService.submitFeedback(this.feedback)
    .subscribe(feedback => {
        this.feedback = feedback;
        console.log(this.feedback);
      } ,
      errmess => {
        this.feedback = null;
        this.feedbackcopy = null;
        this.errMess = <any>errmess;
      } ,
      () => {
        this.isShowingResponse = true;
        setTimeout(() => {
          this.feedbackForm.reset();
            this.isShowingResponse = false;
            this.isLoading = false;
          } , 5000
        );
      })
  ;
  this.feedbackForm.reset({
    firstname: '' ,
    lastname: '' ,
    telnum: '' ,
    email: '' ,
    agree: false ,
    contacttype: 'None' ,
    message: ''
  });
}
}