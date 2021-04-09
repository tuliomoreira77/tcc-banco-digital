import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component'
import { UserMainScreenComponent } from './user-main-screen/user-main-screen.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'main' , component: UserMainScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
