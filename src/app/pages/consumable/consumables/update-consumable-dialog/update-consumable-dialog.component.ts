import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup, ValidationErrors,
  Validators
} from '@angular/forms';

import { CheckboxControlValueAccessor } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {TagService} from "../../../../services/tag.service";
import {Tag} from "../../../../models/tags/tag.model";
import {TAG_TYPES} from "../../../../constants/tag_types";
import {UNITS} from "../../../../constants/units";
import {PRICE_THRESHOLD_TYPES} from "../../../../constants/price_threshold_types";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {Consumable} from "../../../../models/consumables/consumable.model";
import {ConsumablesService} from "../../../../services/consumables.service";


@Component({
  selector: 'app-update-consumable-dialog',
  styleUrls: ['./update-consumable-dialog.component.scss'],
  templateUrl: './update-consumable-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})


export class UpdateConsumableDialogComponent implements OnInit {
  consumableForm!: FormGroup;
  formSubmitting: boolean = false;
  public tags: Tag[] = [];
  readonly UNITS = UNITS;
  readonly PRICE_THRESHOLD_TYPES = PRICE_THRESHOLD_TYPES
  separatorKeysCodes: number[] = [ENTER, COMMA];

  public selectedTagList: Tag[] = [];
  private allowAddTags = false;
  public filteredTags!: Observable<String[]>;
  private consumable: Consumable;


  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    private dialogRef: MatDialogRef<UpdateConsumableDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private tagService: TagService,
    private consumableService: ConsumablesService,
    @Inject(MAT_DIALOG_DATA) public data: {tags: any, consumable: Consumable}
  ) {
    this.tags = Object.values(data.tags);
    this.consumable = data.consumable
  }

  ngOnInit() {

    this.consumableForm = this.formBuilder.group({
      name: [this.consumable.name, {
        validators: [Validators.required],
      }],
      size: [this.consumable.size, {
        validators: [Validators.required],
      }],
      unit: [this.consumable.unit, {
        validators: [Validators.required, this.validateUnit],
      }],
      price: [this.consumable.price, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }],
      tags: ['',Validators.required],
      price_threshold_type: [this.consumable.price_threshold_type, this.validatePriceThresholdType],
      price_threshold: [this.consumable.price_threshold, Validators.pattern('^[0-9]*$')],
      qty_threshold: [this.consumable.qty_threshold, Validators.pattern('^[0-9]*$')],
    });

    this.thresholdValidationCheck()
    this.selectedTagList = this.consumable.tags!

    this.filteredTags = this.consumableForm.controls['tags'].valueChanges.pipe(
      startWith(null),
      map(tagName => this.filterOnValueChange(tagName))
    );
  }

  thresholdValidationCheck() {
    const threshold_type = <FormControl>this.consumableForm.controls['price_threshold_type'];
    const threshold = <FormControl>this.consumableForm.controls['price_threshold'];

    if (threshold_type.value || threshold.value) {
      threshold_type.setValidators([Validators.required, this.validatePriceThresholdType]);
      threshold.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    } else {
      threshold_type.setValidators([this.validatePriceThresholdType]);
      threshold_type.updateValueAndValidity()
      threshold.setValidators([Validators.pattern('^[0-9]*$')]);
      threshold.updateValueAndValidity()
    }

    threshold_type.updateValueAndValidity();
    threshold.updateValueAndValidity();
  }

  validateUnit(control: AbstractControl): ValidationErrors | null {
    const selectedValue = control.value;
    if (!UNITS.hasOwnProperty(selectedValue)) {
      return { invalidUnit: true };
    }
    return null;
  }

  validatePriceThresholdType(control: AbstractControl): ValidationErrors | null {
    const selectedValue = control.value;
    if(control.value) {
      if (!PRICE_THRESHOLD_TYPES.hasOwnProperty(selectedValue)) {
        return { invalidUnit: true };
      }
    }

    return null;
  }

  onSubmit() {
    this.consumableForm.controls['tags'].setValue(this.selectedTagList.map(s=>s.id))

    if (this.consumableForm.invalid) {
      return;
    }

    this.formSubmitting = true
    this.consumableService.updateConsumable(this.consumable.id!, JSON.stringify(this.consumableForm.value)).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Расходник успешно обнавлен!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Расходник не обнавлен!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Расходник не обнавлен!", "Произошла ошибка")
        this.dialogRef.close();
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
    this.consumableForm.controls['tags'].setValue(null);
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

  showVal(){
    let data = this.consumableForm.value
    data.tags = this.selectedTagList.map(s=>s.id);
    console.log(data)
    console.log(this.selectedTagList)
  }

}
