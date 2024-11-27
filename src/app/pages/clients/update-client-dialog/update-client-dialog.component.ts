import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {SupplierService} from "../../../services/supplier.service";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {ClientService} from "../../../services/client.service";
import {Client} from "../../../models/suppliers/client.model";
import {CLIENT_TYPES} from "../../../constants/client_types";

@Component({
  selector: 'app-update-client-dialog',
  templateUrl: './update-client-dialog.component.html',
  styleUrls: ['./update-client-dialog.component.scss']
})

export class UpdateClientDialogComponent implements OnInit {
  clientForm!: FormGroup;
  client: Client;

  formSubmitting: boolean = false;
  readonly CLIENT_TYPES = CLIENT_TYPES;
  readonly urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;


  constructor(
    private dialogRef: MatDialogRef<UpdateClientDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) {
    this.client = data
  }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      name: [this.client.name, {
        validators: [Validators.required],
      }],
      type: [this.client.type, {
        validators: [Validators.required],
      }],
      phone: [this.client.phone, {
        validators: [Validators.required],
      }],
      email: [this.client.email, {
        validators: [Validators.required, Validators.email],
      }],
      telegram: [this.client.telegram, {validators: []}],
      tin: [this.client.tin, {validators: []}],
      psrn: [this.client.psrn, {validators: []}],
      account: [this.client.account, {validators: []}],
      bank: [this.client.bank, {validators: []}],
      correspondent_account: [this.client.correspondent_account, {validators: []}],
      bic: [this.client.bic, {validators: []}],
      legal_address: [this.client.legal_address, {validators: []}],
      vat: [this.client.vat, {
        validators: [Validators.min(0), Validators.max(100)],
      }],
      details: new FormArray([]),
    });
  }

  get details () {
    return this.clientForm.get('details') as FormArray
  }

  removeDetail(index: number) {
    const details_form = this.clientForm.get('details') as FormArray;
    details_form.removeAt(index)
  }

  addNewDetailGroup() {
    const details_form = this.clientForm.get('details') as FormArray;
    details_form.push(this.formBuilder.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    }))
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }

    const client: Client = {
      id: this.client.id,
      name: this.clientForm.value.name,
      type: this.clientForm.value.type,
      phone: this.clientForm.value.phone,
      email: this.clientForm.value.email,
      telegram: this.clientForm.value.telegram,
      tin: this.clientForm.value.tin,
      psrn: this.clientForm.value.psrn,
      account: this.clientForm.value.account,
      bank: this.clientForm.value.bank,
      correspondent_account: this.clientForm.value.correspondent_account,
      bic: this.clientForm.value.bic,
      legal_address: this.clientForm.value.legal_address,
      vat: this.clientForm.value.vat,
      details: this.details.value,
    };

    this.formSubmitting = true
    this.clientService.updateClient(client.id!, client).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Клиент успешно изменен!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Клиент не изменен!", "Произошла ошибка")
          //this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Клиент не изменен!", "Произошла ошибка")
        //this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
