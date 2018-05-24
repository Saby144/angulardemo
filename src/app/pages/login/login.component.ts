import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../../services/user.service';
import { ToastrService, Toast } from 'ngx-toastr';
import { FormsModule }   from '@angular/forms';
import { Router } from "@angular/router";
import { AppAdminInfo } from '../../layouts/layout.model';
declare var $:any;
import { TokenUrl } from '../../../constants'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(public loginService: LoginService, private toastr: ToastrService, private router: Router, public appModel: AppAdminInfo) { }

  ngOnInit() {
    localStorage.clear();
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.loginService.selectedUser = {
      UserId: '',
      UserName: '',
      Password: ''
    }
  }

  onSubmit(form: NgForm) {
    if (form.value.UserId == null || form.value.UserId == "") {

      var parameters = {
        username: form.value.UserName,
        password: form.value.Password,
        grant_type: "password"
      }
          
      this.loginService.getToken(parameters)
        .subscribe(data => {
            if(data.Message == "Success")
            {
              localStorage.setItem('ClientId', data.ClientId);
              localStorage.setItem('ClientName', data.ClientName);
              localStorage.setItem('ClientLogo', data.ClientLogo);
              localStorage.setItem('LoadingImage', data.LoadingImage);
              localStorage.setItem('FavIcon', data.FavIcon);
              localStorage.setItem('Username', form.value.Username);
              localStorage.setItem('AccessToken', data.token_type + " " + data.access_token);
              localStorage.setItem('Expiry', data[".expires"]);
              localStorage.setItem('RefreshToken', data.refresh_token);
              this.router.navigate(['/index']);
            }
            else
            {
              this.toastr.toastrConfig.positionClass = "toast-bottom-right";
              this.toastr.error('Invalid credentials :(', 'User Login');
            }
          this.resetForm(form);
        },
      err => {
        if(!err.ok){
            let obj = JSON.parse(err._body);
            this.toastr.toastrConfig.positionClass = "toast-bottom-right";
            this.toastr.error(obj.error + ": " + obj.error_description, 'User Login');
            this.resetForm(form);
        }
      });
    }
  }
}
