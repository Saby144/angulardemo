import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { API_URL, TokenUrl } from '../constants';
import { User } from'./user.model'
import { AccessToken } from '../services/accessToken'
declare var $:any;

@Injectable()
export class LoginService{
  selectedUser : User;
  userList : User[];
  constructor(private http: Http, private accessToken: AccessToken){ }

  getToken(parameters){
    let headersObj = new Headers();
    headersObj.set('Content-Type', 'application/x-www-form-urlencoded');
    let requestArg = new RequestOptions({ headers: headersObj, method: "POST" });
    var params = new URLSearchParams();
    for(let key of Object.keys(parameters)){ 
      params.set(key, parameters[key]);
    };
    return this.http.post(TokenUrl + 'token', params.toString(), requestArg).map(response => response.json());
  }

  postUser(user: User){
      var accessTkn = this.accessToken.getAccessToken();
     var body = JSON.stringify(user);
     var headerOptions = new Headers({'Content-Type':'application/json'});
     headerOptions.set('Authorization', accessTkn);
     var requestOptions = new RequestOptions({method : RequestMethod.Post, headers : headerOptions});
     return this.http.post(API_URL + 'AdminPanelLogin', body, requestOptions).map(x => x.json());
  }
}
