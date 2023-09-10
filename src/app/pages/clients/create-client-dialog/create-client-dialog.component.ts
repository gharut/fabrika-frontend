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
  selector: 'app-create-client-dialog',
  templateUrl: './create-client-dialog.component.html',
  styleUrls: ['./create-client-dialog.component.scss']
})

export class CreateClientDialogComponent implements OnInit {
  clientForm!: FormGroup;

  formSubmitting: boolean = false;
  readonly CLIENT_TYPES = CLIENT_TYPES;
  readonly urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;


  constructor(
    private dialogRef: MatDialogRef<CreateClientDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
      }],
      type: ['', {
        validators: [Validators.required],
      }],
      phone: ['', {
        validators: [Validators.required],
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
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
      name: this.clientForm.value.name,
      type: this.clientForm.value.type,
      phone: this.clientForm.value.phone,
      email: this.clientForm.value.email,
      details: this.details.value,
    };

    this.formSubmitting = true
    this.clientService.createClient(client).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Клиент успешно создан!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Клиент не создан!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Клиент не создан!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
