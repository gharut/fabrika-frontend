import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {WarehouseService} from "../../../services/warehouse.service";
import {CreateWarehouse} from "../../../models/warehouses/create-warehouse.model";
import {WAREHOUSE_SHIPPING_TYPES} from "../../../constants/warehouse_shipping_types";

@Component({
  selector: 'app-create-warehouse-dialog',
  templateUrl: './create-warehouse-dialog.component.html',
  styleUrls: ['./create-warehouse-dialog.component.scss']
})

export class CreateWarehouseDialogComponent implements OnInit {
  formData!: FormGroup;
  formSubmitting: boolean = false;
  readonly WAREHOUSE_SHIPPING_TYPES = WAREHOUSE_SHIPPING_TYPES;

  constructor(
    private dialogRef: MatDialogRef<CreateWarehouseDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.formData = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
      }],
      shipping_type: ['', {
        validators: [Validators.required],
      }],
      consumable_id: ['', {
        validators: [Validators.required],
      }],
      supplier_id: ['', {
        validators: [Validators.required],
      }],
      prices: this.formBuilder.array([])
    })

    this.addPrice()
  }

  get prices () {
    return this.formData.get('prices') as FormArray
  }

  createPriceGroup(): FormGroup {
    return this.formBuilder.group({
      min_quantity: ['', Validators.required],
      max_quantity: ['', Validators.required],
      price: ['', Validators.required],
      cost_price: ['', Validators.required]
    });
  }

  addPrice(): void {
    this.prices.push(this.createPriceGroup());
  }

  removePrice(index: number): void {
    this.prices.removeAt(index);
  }

  onSubmit() {
    if (this.formData.invalid) {
      return;
    }

    const data: CreateWarehouse = {
      name: this.formData.value.name,
      shipping_type: this.formData.value.shipping_type,
      consumable_id: this.formData.value.consumable_id,
      supplier_id: this.formData.value.supplier_id,
      prices: this.formData.value.prices
    };

    this.formSubmitting = true
    this.warehouseService.createWarehouse(data).subscribe({
      next: result => {
        this.formSubmitting = false

        if (result.success) {
          this.toastrService.success("Склад успешно создан!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        } else {
          this.toastrService.error("Склад не создан!", "Произошла ошибка")
        }
      },
      error: () => {
        this.formSubmitting = false
        this.toastrService.error("Склад не создан!", "Произошла ошибка")
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
