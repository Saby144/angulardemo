import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { API_URL } from '../constants';
import { MenuModel } from '../services/menu.model'
import { AccessToken } from '../services/accessToken'
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

@Injectable()
export class MenuService{
  menuList : MenuModel[];
  constructor(private http: Http, private accessToken: AccessToken, private toastr: ToastrService, private router: Router){ }

  getMenuList(clientId: string){
    var accessTkn = this.accessToken.getAccessToken();
    let headersObj = new Headers();
    headersObj.set('Authorization', accessTkn);
    let requestArg = new RequestOptions({ method: RequestMethod.Get, headers: headersObj });
    return this.http.get(API_URL + 'Menu?clientId=' + clientId, requestArg)
    .map((data : Response) =>{
      return data.json() as MenuModel[];
    }).toPromise().then(x => {
        this.menuList = x;
    },
    err =>{
      if(!err.ok){
          let obj = JSON.parse(err._body);
          this.toastr.toastrConfig.positionClass = "toast-bottom-right";
          this.toastr.error(obj.Message, 'Menu');
          this.router.navigate(['/login']);
      }
    });
  }
}