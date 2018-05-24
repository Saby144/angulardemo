import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CategoryService } from '../../../../services/categoryaddedit.service';
import { Category } from '../../../../services/categoryaddedit.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'categoryadd-edit',
  templateUrl: './categoryadd-edit.component.html'
})
export class CategoryaddEditComponent implements OnInit {
  selectedCategory : Category;
  errors: Array<string> = [];
  dragAreaClass: string = 'dragarea';
  @Input() fileExt: string = "JPG, JPEG, PNG";
  @Input() maxFiles: number = 1;
  @Input() maxSize: number = 5; // 5MB
  @Output() uploadStatus = new EventEmitter();
  @Input() formData = new FormData();
  dataTable: any;
  fileUploadCount: number = 0;

  constructor(public categoryService:CategoryService, private toastr: ToastrService) { }
  ngOnInit() { 
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.categoryService.selectedCategory = {
      CategoryId: null,
      CategoryName: '',
      SequenceNo: null,
      Description: '',
      Image: '',
    }
    var categoryImageEle = document.getElementById("displayCategoryImage") as HTMLImageElement;
    if(categoryImageEle){
      categoryImageEle.src = '';
    }
    $("#divUploadImage").show();
    $("#divShowImage").hide();
  }

  onFileChange(event: any){
    let files = event.target.files;
    this.errors = [];
    if (files.length > 0 && (this.isValidFiles(files))) {
        const reader = new FileReader();
        reader.onload = (event) => {
        const img = new Image();
        if (reader.result) {
          img.src = reader.result;
        }
        img.onload = (event2) => {
          if(!(img.height >= 100 && img.width >= 100)){
            this.errors.push("Error (File Dimension): " + files[0].name + ": invalid file dimension (" + img.height + " x " + img.width + ")");
          }
          else
          {
            this.fileUploadCount = 1;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var imageString = canvas.toDataURL('image/jpg');
            var categoryImageEle = document.getElementById("displayCategoryImage") as HTMLImageElement;
            categoryImageEle.src = imageString;
            $("#divUploadImage").hide();
            $("#divShowImage").show();
          }
        };
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    this.saveFiles(files);
  }

  saveFiles(files){
    if (files.length > 0 && (!this.isValidFiles(files))) {
        this.uploadStatus.emit(false);
        return;
    }       
    if (files.length > 0) {
      this.formData = new FormData();
      for (var j = 0; j < files.length; j++) {
        this.formData.append("UploadedImage", files[j]);
      }
      this.uploadStatus.emit(true);
    } 
  }

  onSubmit(form: NgForm) {
    if(form.value.CategoryId == null && this.fileUploadCount == 0){
      this.errors.push("Error (Image not found): Please upload category image file.");
      return;
    }
    var parameters = {
      categoryId: form.value.CategoryId == null ? 0 : form.value.CategoryId,
      categoryName: form.value.CategoryName,
      sequenceNo: form.value.SequenceNo,
      description: form.value.Description
    }
    this.categoryService.postCategory(this.formData, parameters)
      .subscribe(data => {
        this.resetForm(form);
        this.categoryService.getCategories(localStorage.getItem('ClientId'));
        this.reInitDatatable();
        this.toastr.toastrConfig.positionClass = "toast-bottom-right";
        this.toastr.success('New category added Succcessfully :)', 'Category');
      },
      err =>{
          let obj = JSON.parse(err._body);
          this.toastr.toastrConfig.positionClass = "toast-bottom-right";
          this.toastr.error(obj.Message, 'Menu');
          this.resetForm(form);
          this.categoryService.getCategories(localStorage.getItem('ClientId'));
          this.reInitDatatable();
      })
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

  private isValidFiles(files){
     if (files.length > this.maxFiles) {
         this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
         return;
     }        
     this.isValidFileExtension(files);
     return this.errors.length === 0;
 }

  private isValidFileExtension(files){
    var extensions = (this.fileExt.split(','))
                  .map(function (x) { return x.toLocaleUpperCase().trim() });
    for (var i = 0; i < files.length; i++) {
       var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
       var exists = extensions.includes(ext);
       if (!exists) {
          this.errors.push("Error (Extension): " + files[i].name);
       }
       this.isValidFileSize(files[i]);
     }
  }

  private isValidFileSize(file) {
     var fileSizeinMB = file.size / (1024 * 1000);
     var size = Math.round(fileSizeinMB * 100) / 100;
     if (size > this.maxSize)
       this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {   
    this.dragAreaClass = "dragarea";           
    event.preventDefault();
    event.stopPropagation();
    var files = event.dataTransfer.files;
    this.errors = [];
    if (files.length > 0 && (this.isValidFiles(files))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        if (reader.result) {
          img.src = reader.result;
        }
        img.onload = (event2) => {
          if(!(img.height >= 100 && img.width >= 100)){
            this.errors.push("Error (File Dimension): " + files[0].name + ": invalid file dimension (" + img.height + " x " + img.width + ")");
          }
          else
          {
            this.fileUploadCount = 1;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var imageString = canvas.toDataURL('image/jpg');
            var categoryImageEle = document.getElementById("displayCategoryImage") as HTMLImageElement;
            categoryImageEle.src = imageString;
            $("#divUploadImage").hide();
            $("#divShowImage").show();
          }
        };
      }
      reader.readAsDataURL(event.dataTransfer.files[0]);
    }
    this.saveFiles(files);
  }

  deleteCategoryImage(){
    this.formData = new FormData();
    var categoryImageEle = document.getElementById("displayCategoryImage") as HTMLImageElement;
    categoryImageEle.src = "";
    $("#divUploadImage").show();
    $("#divShowImage").hide();
  }
}
