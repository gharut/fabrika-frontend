import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { CheckboxControlValueAccessor } from '@angular/forms';
import {Observable, of} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {SupplierService} from "../../../services/supplier.service";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {PAYMENT_TYPES} from "../../../constants/payment_types";


@Component({
  selector: 'app-update-supplier-dialog',
  styleUrls: ['./update-supplier-dialog.component.scss'],
  templateUrl: './update-supplier-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})

export class UpdateSupplierDialogComponent implements OnInit {
  supplierForm!: FormGroup;
  supplier: Supplier

  formSubmitting: boolean = false;
  readonly PAYMENT_TYPES = PAYMENT_TYPES;
  readonly urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;


  constructor(
    private dialogRef: MatDialogRef<UpdateSupplierDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public data: Supplier
  ) {
    console.log(data)
    this.supplier = data
  }

  ngOnInit() {
    this.supplierForm = this.formBuilder.group({
      name: [this.supplier.name, {
        validators: [Validators.required],
      }],
      address: [this.supplier.address, {
        validators: [],
      }],
      website: [this.supplier.website, {
        validators: [Validators.pattern(this.urlRegex)],
      }],
      payments: new FormArray([]),
      contacts: new FormArray([]),

      tags: [''],
    });

    const contact_form = this.supplierForm.get('contacts') as FormArray;
    this.supplier.contacts?.forEach((contact, i) => {
      contact_form.push(
        this.formBuilder.group({
          name: [contact.name, Validators.required],
          position: [contact.position ? contact.position  : ''],
          phone: [contact.phone ? contact.phone  : ''],
          email: [contact.email ? contact.email  : ''],
        })
      )
    })

    const payments_form = this.supplierForm.get('payments') as FormArray;
    this.supplier.payments?.forEach((payment, i) => {
      payments_form.push(
        this.formBuilder.group({
          type: [payment.type, Validators.required],
          payments: [payment.details ? payment.details  : ''],
        })
      )
    })
  }

  get contacts () {
    return this.supplierForm.get('contacts') as FormArray
  }

  removeContact(index: number) {
    const contact_form = this.supplierForm.get('contacts') as FormArray;
    contact_form.removeAt(index)
  }

  addNewContactGroup() {
    const contact_form = this.supplierForm.get('contacts') as FormArray;
    contact_form.push(this.formBuilder.group({
      name: ['', Validators.required],
      position: [''],
      phone: [],
      email: [],
    }))
  }

  get payments () {
    return this.supplierForm.get('payments') as FormArray
  }


  removePayment(index: number) {
    const payment_form = this.supplierForm.get('payments') as FormArray;
    payment_form.removeAt(index)
  }

  addNewPaymentGroup() {
    const payment_form = this.supplierForm.get('payments') as FormArray;
    payment_form.push(this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      payments: new FormControl(''),
    }))
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      return;
    }

    const supplier: Supplier = {
      id: this.supplier.id,
      name: this.supplierForm.value.name,
      address: this.supplierForm.value.address,
      website: this.supplierForm.value.website,
      contacts: this.contacts.value,
      payments: this.payments.value,
      tags: this.supplierForm.value.tags,
    };

    this.formSubmitting = true
    this.supplierService.updateSupplier(supplier.id!, supplier).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Поставщик успешно обнавлен!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Поставщик не обнавлен!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: (errorResponse) => {
        this.formSubmitting = false;
        this.toastrService.error("Поставщик не обновлен!", "Произошла ошибка");

        // Capture backend validation errors
        if (errorResponse?.data.errors) {
          const backendErrors = errorResponse.data.errors;

          // Iterate through errors and set them on the corresponding form controls
          for (const [field, messages] of Object.entries(backendErrors)) {
            const control = this.supplierForm.get(field);
            if (control) {
              control.setErrors({ serverError: (messages as string[]).join(', ') });
            }
          }
        }
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
