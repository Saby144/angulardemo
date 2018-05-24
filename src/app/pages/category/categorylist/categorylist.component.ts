import { Component, OnInit, AfterContentInit } from '@angular/core';
import { CategoryService } from '../../../../services/categoryaddedit.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../services/categoryaddedit.model';
import { CategoryModel } from '../../../../services/categoryaddedit.model';
declare var $:any;

@Component({
  selector: 'categorylist',
  templateUrl: './categorylist.component.html'
})

export class CategorylistComponent implements OnInit, AfterContentInit {
  dataTable: any;
  constructor(public categoryService:CategoryService, private toastr : ToastrService) { 
  }

  ngOnInit() {
    this.getCategoryData();
  }

  ngAfterContentInit(){
    this.reInitDatatable();
  }

  getCategoryData(){
    this.categoryService.getCategories(localStorage.getItem('ClientId'));
  }

  private initDatatable(): void {
    let catTable: any = $('#category-table');
    this.dataTable = catTable.DataTable();
  }

  private reInitDatatable(): void {
    if (this.dataTable) {
      this.dataTable.destroy()
      this.dataTable = null;
    }
    setTimeout(() => this.initDatatable(),0)
  }

  showForEdit(category: Category) {
    this.categoryService.selectedCategory = Object.assign({}, category);;
  }

  showImageModal(categoryImage: string){
    $("#imageModal").show();
    var categoryImageEle = document.getElementById("categoryFullImg") as HTMLImageElement;
    categoryImageEle.src = categoryImage;
  }

  hideImageModal(){
    $("#imageModal").hide();
  }

  onDelete(categoryId: number) {
    if (confirm('Are you sure to delete this category?') == true) {
      this.categoryService.deleteCategory(categoryId)
      .subscribe(x => {
        this.categoryService.getCategories(localStorage.getItem('ClientId'));
        this.reInitDatatable();
        this.toastr.toastrConfig.positionClass = "toast-bottom-right";
        this.toastr.success("Category deleted successfully :)","Category");
      },
      err => {
        if(!err.ok){
          let obj = JSON.parse(err._body);
          this.toastr.toastrConfig.positionClass = "toast-bottom-right";
          this.toastr.error(obj.Message, 'Category');
        }
      })
    }
  }

  onStatusUpdate(categoryId: number) {
    if (confirm('Are you sure to change category status?') == true) {
      this.categoryService.activeInActiveCategory(categoryId)
      .subscribe(x => {
        this.categoryService.getCategories(localStorage.getItem('ClientId'));
        this.reInitDatatable();
        this.toastr.toastrConfig.positionClass = "toast-bottom-right";
        this.toastr.success("Category status updated successfully :)","Category");
      },
      err => {
        if(!err.ok){
          let obj = JSON.parse(err._body);
          this.toastr.toastrConfig.positionClass = "toast-bottom-right";
          this.toastr.error(obj.Message, 'Category');
        }
      })
    }
  }

  onSequenceChange(event,categoryId: number){
    var sequenceNo = event.target.value;
    this.categoryService.updateCategorySequence(categoryId, sequenceNo)
      .subscribe(x => {
        this.categoryService.getCategories(localStorage.getItem('ClientId'));
        this.reInitDatatable();
        this.toastr.toastrConfig.positionClass = "toast-bottom-right";
        this.toastr.success("Category sequence no. updated successfully :)","Category");
      },
      err => {
        if(!err.ok){
          let obj = JSON.parse(err._body);
          this.toastr.toastrConfig.positionClass = "toast-bottom-right";
          this.toastr.error(obj.Message, 'Category');
        }
      })
  }
}

