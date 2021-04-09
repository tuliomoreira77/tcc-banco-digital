import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../login-service/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  formRegister = this.fb.group({
    usuario: ['', [Validators.required]],
    senha: ['', [Validators.required]],
  });

  constructor(
    private loginService:LoginService,
    private fb: FormBuilder, 
    private service: AuthServiceService, 
    private router: Router,
    private snack: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    this.spinner.show();
    let formValue = this.formRegister.value;
    try {
     let data = await this.loginService.getToken(formValue.usuario, formValue.senha);
     let userInfo = await this.loginService.getUserInfo(data.access_token);
     this.service.persistToken(data.access_token, userInfo);

     this.router.navigateByUrl('/main');
    } catch(err) {
      console.log(err);
    }
  }

}
