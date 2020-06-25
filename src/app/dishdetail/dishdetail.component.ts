import { Component, OnInit,Inject ,ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params,ActivatedRoute } from '@angular/router';
import{ Location } from '@angular/common';
import {DishService } from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import {Comment} from '../shared/comment';
import {trigger, state, style,animate,transition} from '@angular/animations';
// import {baseURL} from '../shared/baseurl';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [trigger('visibility', 
              [state('shown',style({
                transform: 'scale(1.0)',
                opacity: 1
              })), 
                state('hidden', style({
                  transform: 'scale(0.5)',
                  opacity: 0
                })),
                transition('* => *',animate('0.5s ease-in-out'))
            ]) 
          ]
        })
export class DishdetailComponent implements OnInit {

  commentsForm: FormGroup;
  comments: Comment;
  dish:Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess:string;
  dishcopy:Dish;
  visibility ='shown';
  

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute,
              private cb:FormBuilder, 
               @Inject('BaseURL') private BaseURL)
   {
    this.createForm();
   }

     formErrors={
       'author': '',
       'comment': ''
     };
     validationMessage = {
       'author': {
         'required': 'Author Name is required.',
         'minlength': 'Author Name must be at least 2 characters long.'
       },
       'comment':
       {
         'required': 'Comment is required.'
       }
     };
  
  ngOnInit() {
   
    this.dishService.getDishIds()
    .subscribe((dishIds) =>this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params:Params)=>{ this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
       .subscribe((dish)=>{this.dish=dish; this.dishcopy=dish; this.setPrevNext(dish.id); this.visibility='shown';} , errMess=>this.errMess= <any> errMess); 
  }

  createForm()
  {
    this.commentsForm=this.cb.group({
    author:['',[Validators.required, Validators.minLength(2)]],
    rating: [5],
    comment:['',[Validators.required]],
    date:''
  });

  this.commentsForm.valueChanges.subscribe(data => this.onValueChanged(data));
this.onValueChanged();
}

onValueChanged(data?: any)
{
  if(!this.commentsForm)
  return;

  const form =this.commentsForm;
  for(const field in this.formErrors)
  { if (this.formErrors.hasOwnProperty(field)){
    this.formErrors[field]='';
    const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessage[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
          }
        }
      }
    }
  }
  onSubmit()
  {
    this.comments=this.commentsForm.value;
    console.log(this.comments);
    let newComment:Comment=this.commentsForm.value;
    //this.dishcopy.comments.push(this.comments);
  newComment.date = new Date().toISOString();
  this.dishcopy.comments.push(newComment);
  this.dishService.putDish(this.dishcopy).subscribe(dish=>{
    this.dish = dish; this.dishcopy = dish;
  },
  errMess => { this.dish =null; this.dishcopy = null; this.errMess =<any> errMess});
    this.commentsForm.reset({
      author:'',
      rating:5,
      comment: ''
    });
  }
  
     setPrevNext(dishId: string){
       const index=this.dishIds.indexOf(dishId);
       this.prev=this.dishIds[(this.dishIds.length + index-1)%this.dishIds.length];
       this.next = this.dishIds[(this.dishIds.length+index+1)%this.dishIds.length];
  
     }
  goBack():void 
  {
    this.location.back();
  }

}
