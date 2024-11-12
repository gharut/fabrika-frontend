import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { CheckboxControlValueAccessor } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {SERVICE_STEPS} from "../../../constants/service_steps";
import {SERVICE_APPLY_TO} from "../../../constants/service_apply_to";
import {SERVICE_REPORT_TYPES} from "../../../constants/service_report_types";
import {SERVICE_ATTRIBUTE_TYPES} from "../../../constants/service_attribute_types";
import {SERVICE_ATTRIBUTE_APPLY_PRICE_TYPES} from "../../../constants/service_attribute_apply_price_types";
import {Tag} from "../../../models/tags/tag.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {Observable, startWith} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {map} from "rxjs/operators";
import {ServicesService} from "../../../services/services.service";
import {Service, ServiceAttribute, ServiceAttributeData} from "../../../models/services/service.model";


@Component({
  selector: 'app-update-service-dialog',
  styleUrls: ['./update-service-dialog.component.scss'],
  templateUrl: './update-service-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class UpdateServiceDialogComponent implements OnInit {
  serviceForm!: FormGroup;
  formSubmitting: boolean = false
  serviceApplyTo: string = ""

  SERVICE_STEPS = SERVICE_STEPS
  SERVICE_APPLY_TO = SERVICE_APPLY_TO
  SERVICE_REPORT_TYPES = SERVICE_REPORT_TYPES
  SERVICE_ATTRIBUTE_TYPES = SERVICE_ATTRIBUTE_TYPES
  SERVICE_ATTRIBUTE_APPLY_PRICE_TYPES = SERVICE_ATTRIBUTE_APPLY_PRICE_TYPES


  public tags: Tag[] = [];
  public service: Service;
  public selectedTagList: Tag[] = [];
  private allowAddTags = false;
  public filteredTags!: Observable<String[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    private dialogRef: MatDialogRef<UpdateServiceDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private servicesService: ServicesService,
    @Inject(MAT_DIALOG_DATA) public data: {tags: Tag[], service: Service}
  ) {
    this.tags = Object.values(data.tags);
    this.service = data.service
  }

  ngOnInit() {
    this.serviceForm = this.formBuilder.group({
      name: [this.service.name, {
        validators: [Validators.required],
      }],
      use_consumable: [this.service.use_consumable, {
        validators: [Validators.required],
      }],
      step: [this.service.step, {
        validators: [Validators.required],
      }],
      apply_to: [this.service.apply_to, {
        validators: [Validators.required],
      }],
      multiple_products: [this.service.multiple_products, {
        validators: [Validators.required],
      }],
      count_label: [this.service.count_label, {
        validators: [],
      }],
      report_type: [this.service.report_type, {
        validators: [Validators.required],
      }],
      price: [this.service.price, {
        validators: [Validators.required],
      }],
      sort: [this.service.sort, {
        validators: [Validators.required],
      }],
      tags: [''],
      attributes: new FormArray([]),
    });

    this.selectedTagList = this.service.tags ? this.service.tags : []

    if(this.service.attributes) {
      const attributes_form = this.serviceForm.get('attributes') as FormArray;
      this.service.attributes.forEach(attribute => {

        attributes_form.push(this.getAttributeGroupWithValues(attribute))
      })
    }

    this.filteredTags = this.serviceForm.controls['tags'].valueChanges.pipe(
      startWith(null),
      map(tagName => this.filterOnValueChange(tagName))
    );
  }

  get attributes () {
    return this.serviceForm.get('attributes') as FormArray
  }

  attributeForm (index: number) {
    return (this.serviceForm.get('attributes') as FormArray).at(index)
  }

  attributeArray (index: number): FormArray {
    return (this.serviceForm.get('attributes') as FormArray).at(index).get('attribute_data') as FormArray
  }

  addNewAttribute() {
    const attributes_form = this.serviceForm.get('attributes') as FormArray;
    attributes_form.push(this.formBuilder.group({
      name: ['', Validators.required],
      attribute_type: ['', Validators.required],
      allow_multiselect: [0, Validators.required],
      apply_to_price_type: [0, Validators.required,],
      attribute_data: new FormArray([]),

    }))
  }

  getAttributeGroupWithValues(attribute: ServiceAttribute) {
    let attribute_data: FormGroup[] = []
    if(attribute.attribute_data) {
      attribute.attribute_data.forEach(attributeData => {
        attribute_data.push(this.getAttributeDataGroupWithValues(attributeData))
      })
    }
    return this.formBuilder.group({
      name: [attribute.name, Validators.required],
      attribute_type: [attribute.attribute_type, Validators.required],
      allow_multiselect: [attribute.allow_multiselect, Validators.required],
      apply_to_price_type: [attribute.apply_to_price_type, Validators.required,],
      attribute_data: new FormArray(attribute_data),

    })
  }

  getAttributeDataGroupWithValues(attributeData: ServiceAttributeData) {
    return this.formBuilder.group({
      value: [attributeData.value, Validators.required],
      price: [attributeData.price],
    })
  }

  removeAttribute(attributeIndex: number) {
    (this.serviceForm.get('attributes') as FormArray).removeAt(attributeIndex);
  }

  removeAttributeData(attributeIndex: number, attributeDataIndex: number) {
    ((this.serviceForm.get('attributes')! as FormArray).at(attributeIndex).get('attribute_data') as FormArray).removeAt(attributeDataIndex)
  }

  addNewAttributeData(index: number) {
    const attribute   = (this.serviceForm.get('attributes')! as FormArray).at(index)

    const attributes_data = attribute.get('attribute_data') as FormArray;


    attributes_data.push(this.formBuilder.group({
      value: ['', Validators.required],
      price: [''],
    }))
  }

  applyToChange() {
    this.serviceApplyTo = this.serviceForm.controls['apply_to'].value
  }

  onSubmit() {
    if(this.serviceForm.controls['use_consumable'].value) {
      this.serviceForm.controls['tags'].setValue(this.selectedTagList.map(s=>s.id))
    }else{
      this.serviceForm.controls['tags'].setValue([])
    }

    if (this.serviceForm.invalid) {
      return;
    }


    this.formSubmitting = true
    this.servicesService.updateService(this.service.id!, JSON.stringify(this.serviceForm.value)).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Категория успешно создана!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Категория не создана!", "Произошла ошибка")
          //this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Категория не создана!", "Произошла ошибка")
        //this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }





  public removeTag(tag: Tag): void {
    const index = this.selectedTagList.indexOf(tag);
    if (index >= 0) {
      this.selectedTagList.splice(index, 1);
      this.resetInputs();
    }
  }

  private resetInputs() {
    // clear input element
    this.tagsInput.nativeElement.value = '';
    // clear control value and trigger engineerControl.valueChanges event
    this.serviceForm.controls['tags'].setValue(null);
  }

  public addTag(event: MatChipInputEvent): void {
    if (!this.allowAddTags) {

      return;
    }


    if (this.matAutocomplete.isOpen) {
      return;
    }

    // Add our engineer
    const value = event.value;
    if ((value || '').trim()) {
      this.selectTagByName(value.trim());
    }

    this.resetInputs();
  }

  private selectTagByName(tagName: string) {
    let fountTag = this.tags.filter(tag => tag.name == tagName);
    if (fountTag.length) {
      //
      // We found the engineer name in the allEngineers list
      //
      this.selectedTagList.push(fountTag[0]);
    }
  }

  public tagSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectTagByName(event.option.value);
    this.resetInputs();
  }

  private filterOnValueChange(tagName: string | null | undefined): String[] {
    let result: String[] = [];
    //
    // Remove the engineers we have already selected from all engineers to
    // get a starting point for the autocomplete list.
    //
    if(tagName !== undefined) {
      let allTagsLessSelected = this.tags.filter(tag => this.selectedTagList.indexOf(tag) < 0);
      if (tagName) {
        result = this.filterTag(allTagsLessSelected, tagName);
      } else {
        result = allTagsLessSelected.map(tag => tag.name!);
      }
    }

    return result;
  }

  private filterTag(tagList: Tag[], tagName: String): String[] {
    let filteredTagList: Tag[] = [];
    const filterValue = tagName.toLowerCase();
    let tagsMatchingTagName = tagList.filter(tag => tag.name!.toLowerCase().indexOf(filterValue) === 0);
    if (tagsMatchingTagName.length || this.allowAddTags) {
      //
      // either the engineer name matched some autocomplete options
      // or the name didn't match but we're allowing
      // non-autocomplete engineer names to be entered
      //
      filteredTagList = tagsMatchingTagName;
    } else {
      //
      // the engineer name didn't match the autocomplete list
      // and we're only allowing engineers to be selected from the list
      // so we show the whjole list
      //
      filteredTagList = tagList;
    }
    //
    // Convert filtered list of engineer objects to list of engineer
    // name strings and return it
    //
    return filteredTagList.map(tag => tag.name!);
  }
}
