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
import {UNITS} from "../../../constants/units";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {ConsumablesService} from "../../../services/consumables.service";
import {Consumable} from "../../../models/consumables/consumable.model";
import {SupplierService} from "../../../services/supplier.service";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {CONSUMABLE_OPERATION_TYPES} from "../../../constants/consumable_operation_types";
import {InoutService} from "../../../services/inout.service";


@Component({
  selector: 'app-make-operation-dialog',
  styleUrls: ['./operation.component.scss'],
  templateUrl: './operation.component.html',
  providers: [CheckboxControlValueAccessor]
})


export class OperationComponent implements OnInit {
  operationForm!: FormGroup;
  formSubmitting: boolean = false;


  readonly UNITS = UNITS;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  private allowAddTags = false;
  public filteredTags!: Observable<String[]>;
  protected consumables!: Consumable[]
  protected suppliers!: Supplier[]
  readonly CONSUMABLE_OPERATION_TYPES = CONSUMABLE_OPERATION_TYPES
  type: any = ''
  consumable_id: any = ''

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    private dialogRef: MatDialogRef<OperationComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private consumableService: ConsumablesService,
    private supplierService: SupplierService,
    private inoutService: InoutService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.consumableService.list().subscribe(consumables => {
      this.consumables = consumables;
    })

    this.supplierService.list().subscribe(suppliers => {
      this.suppliers = suppliers;
    })
    console.log(data)
    this.type = data && data.hasOwnProperty('type') ? data.type : ''
    this.consumable_id = data && data.hasOwnProperty('consumable_id') ? data.consumable_id : ''

  }

  ngOnInit() {
    this.operationForm = this.formBuilder.group({
      operation_type: [this.type, {
        validators: [Validators.required],
      }],
      type: ['', {
        validators: [Validators.required],
      }],
      consumable_id: [this.consumable_id, {
        validators: [Validators.required],
      }],
      supplier_id: ['', {
        validators: [],
      }],
      qty: ['', {
        validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)],
      }],
      price_per_unit: ['', {
        validators: [],
      }],
      delivery_status: [false, {
        validators: [],
      }],
      payment_status: [false, {
        validators: [],
      }],
      details: ['', {
        validators: [],
      }]
    });


  }

  typesValidations() {
    const type = <FormControl>this.operationForm.controls['type'];
    const supplier_id = <FormControl>this.operationForm.controls['supplier_id'];
    const price_per_unit = <FormControl>this.operationForm.controls['price_per_unit'];
    const details = <FormControl>this.operationForm.controls['details'];
    const delivery_status = <FormControl>this.operationForm.controls['delivery_status'];
    const payment_status = <FormControl>this.operationForm.controls['payment_status'];

    if(type.value == 1) {
      supplier_id.setValidators([Validators.required]);
      details.setValidators([]);
      price_per_unit.setValidators([Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.required]);
      delivery_status.setValue(0)
      payment_status.setValue(0)
    }else{
      supplier_id.setValidators([]);
      details.setValidators([Validators.required]);
      price_per_unit.setValidators([]);
      delivery_status.setValue('')
      payment_status.setValue('')
    }
    supplier_id.updateValueAndValidity();
    details.updateValueAndValidity();
    price_per_unit.updateValueAndValidity();
  }





  onSubmit() {

    if (this.operationForm.invalid) {
      return;
    }


    this.formSubmitting = true
    this.inoutService.inout(this.operationForm.controls['consumable_id'].value, JSON.stringify(this.operationForm.value)).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Операция успешно добавлена!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Операция не добавлена!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Операция не добавлена!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }


  onCancel() {
    this.dialogRef.close();
  }

}
