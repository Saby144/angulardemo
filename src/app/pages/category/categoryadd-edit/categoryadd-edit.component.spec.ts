import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryaddEditComponent } from './categoryadd-edit.component';

describe('CategoryaddEditComponent', () => {
  let component: CategoryaddEditComponent;
  let fixture: ComponentFixture<CategoryaddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryaddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryaddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
