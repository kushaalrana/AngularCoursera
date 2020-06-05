import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username: '',password: '', remember: false};

  constructor(public dialogRef: MatDialogRef<LoginComponent>) { } //becase we can close the dialogue box again sp we are injecting dialogueref that is reference of dialogue so that you can class once its filled

  ngOnInit() {
  }

onSubmit()
{
  console.log('User: ', this.user);
  this.dialogRef.close();
}
}
