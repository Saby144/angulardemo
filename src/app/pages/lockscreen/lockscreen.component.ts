import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms'
import { LoginService } from '../../../services/user.service'
import { ToastrService } from 'ngx-toastr'
import { FormsModule }   from '@angular/forms';
import { Router } from "@angular/router";
import { AppAdminInfo } from '../../layouts/layout.model'

declare var $:any;

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
})
export class LockscreenComponent implements OnInit {

  constructor(public loginService: LoginService, private toastr: ToastrService, private router: Router, public appModel: AppAdminInfo) { }

  ngOnInit() {
    $('body').addClass('empty-layout bg-silver-300');
    this.resetForm();
    this.appModel.ClientName = localStorage.getItem('ClientName');
    this.appModel.ClientId = localStorage.getItem('ClientId');
    this.appModel.ClientImage = localStorage.getItem('ClientLogo');
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.loginService.selectedUser = {
      UserId: '',
      UserName: localStorage.getItem('Username'),
      Password: ''
    }
  }

  onSubmit(form: NgForm) {
    this.loginService.postUser(form.value)
    .subscribe(data => {
        if(data.Flag == true)
        {
            localStorage.setItem('ClientId', data.ClientId);
            localStorage.setItem('ClientName', data.ClientName);
            localStorage.setItem('ClientLogo', data.ClientLogo);
            localStorage.setItem('LoadingImage', data.LoadingImage);
            localStorage.setItem('FavIcon', data.FavIcon);
            localStorage.setItem('Username', form.value.Username);
            this.router.navigate(['/index']);
        }
        else
        {
            this.toastr.toastrConfig.positionClass = "toast-bottom-right";
            this.toastr.error('Invalid password :(', 'Lock');
        }
    })
  }
}
