import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { API_URL } from '../constants';
import { Category } from '../services/categoryaddedit.model'
import { AccessToken } from '../services/accessToken'
import { ToastrService, Toast } from 'ngx-toastr';

@Injectable()
export class CategoryService{
    selectedCategory : Category;
    categoryList : Category[];
    constructor(private http: Http, private accessToken: AccessToken, private toastr: ToastrService){ }
  
    postCategory(formData, parameters){
        var accessTkn = this.accessToken.getAccessToken();
        let headers = new Headers({ 'Content-Type': null });
        headers.delete('Content-Type');
        headers.set('Authorization', accessTkn);
        let options = new RequestOptions({method: RequestMethod.Post, headers: headers });
        options.params = parameters;
        return this.http.post(API_URL + 'Category/CategoryAddEdit', formData, options).map(response => response.json());
    }

    getCategories(clientId: string){
        var accessTkn = this.accessToken.getAccessToken();
        let headersObj = new Headers();
        headersObj.set('Authorization', accessTkn);
        let requestArg = new RequestOptions({ method: RequestMethod.Get, headers: headersObj });
        this.http.get(API_URL + 'Category/CategoryList?clientId=' + clientId, requestArg)
        .map((data : Response) =>{
            return data.json() as Category[];
        }).toPromise().then(x => {
            this.categoryList = x;
        },
        err => {
            if(!err.ok){
                let obj = JSON.parse(err._body);
                this.toastr.toastrConfig.positionClass = "toast-bottom-right";
                this.toastr.error(obj.Message, 'Category');
            }
        })
    }

    deleteCategory(categoryId: number) {
        var accessTkn = this.accessToken.getAccessToken();
        let headersObj = new Headers();
        headersObj.set('Authorization', accessTkn);
        let requestArg = new RequestOptions({ method: RequestMethod.Get, headers: headersObj });
        return this.http.get(API_URL + 'Category/Delete?categoryId=' + categoryId, requestArg).map(res => res.json());
    }

    activeInActiveCategory(categoryId: number) {
        var accessTkn = this.accessToken.getAccessToken();
        let headersObj = new Headers();
        headersObj.set('Authorization', accessTkn);
        let requestArg = new RequestOptions({ method: RequestMethod.Get, headers: headersObj });
        return this.http.get(API_URL + 'Category/UpdateStatus?categoryId=' + categoryId, requestArg).map(res => res.json());
    }

    updateCategorySequence(categoryId: number, sequenceNo: number) {
        var accessTkn = this.accessToken.getAccessToken();
        let headersObj = new Headers();
        headersObj.set('Authorization', accessTkn);
        let requestArg = new RequestOptions({ method: RequestMethod.Get, headers: headersObj });
        return this.http.get(API_URL + 'Category/UpdateSequenceNo?categoryId=' + categoryId+'&sequenceNo='+sequenceNo, requestArg).map(res => res.json());
    }
}