import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  Login(item: NgForm) {
    if (item.valid) {
      console.log('login data', item);
    } else {
      console.log('invalid form!');
    }
  }
}
