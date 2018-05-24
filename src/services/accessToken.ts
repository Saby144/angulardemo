import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { API_URL, TokenUrl } from '../constants';
import { Router } from "@angular/router";
declare var $:any;
import { ToastrService, Toast } from 'ngx-toastr';

@Injectable()
export class AccessToken{
    public accessToken: string = '';
    constructor(private http: Http, private router: Router, private toastr: ToastrService){ }

    getAccessToken(){
        var token = localStorage.getItem('AccessToken');
        
        var expiryDate = new Date(localStorage.getItem('Expiry')).toISOString();
        var expiryFormattedDate = new Date(expiryDate);
        var UTCstring = new Date().toISOString();
        var utcFormattedDate = new Date(UTCstring);

        if(utcFormattedDate >= expiryFormattedDate){
            this.getRefreshToken().subscribe(data => {
                if(data.Message == "Success")
                {
                    localStorage.setItem('AccessToken', data.token_type + " " + data.access_token);
                    localStorage.setItem('Expiry', data[".expires"]);
                    localStorage.setItem('RefreshToken', data.refresh_token);
                    this.accessToken = data.refresh_token;
                }
                else
                {
                  this.router.navigate(['/login']);
                }
            },
            err => {
                if(!err.ok){
                    let obj = JSON.parse(err._body);
                    this.toastr.toastrConfig.positionClass = "toast-bottom-right";
                    this.toastr.error(obj.error + ": " + obj.error_description, 'Token');
                }
            });
        }
        return this.accessToken = token;
    }

    getRefreshToken(){
        var parameters = {
            refresh_token: localStorage.getItem('RefreshToken'),
            grant_type: "refresh_token"
        }
        let headersObj = new Headers();
        headersObj.set('Content-Type', 'application/x-www-form-urlencoded');
        let requestArg = new RequestOptions({ headers: headersObj, method: "POST" });
        var params = new URLSearchParams();
        for(let key of Object.keys(parameters)){ 
            params.set(key, parameters[key]);
        };
        return this.http.post(TokenUrl + 'token', params.toString(), requestArg).map(response => response.json());
    }
}
