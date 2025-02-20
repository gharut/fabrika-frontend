import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {WarehouseService} from "../../../services/warehouse.service";
import {Warehouse} from "../../../models/warehouses/warehouse.model";
import {UpdateWarehouse} from "../../../models/warehouses/update-warehouse.model";
import {WAREHOUSE_SHIPPING_TYPES} from "../../../constants/warehouse_shipping_types";

@Component({
  selector: 'app-update-warehouse-dialog',
  templateUrl: './update-warehouse-dialog.component.html',
  styleUrls: ['./update-warehouse-dialog.component.scss']
})

export class UpdateWarehouseDialogComponent implements OnInit {
  formData!: FormGroup;
  warehouse: Warehouse;
  formSubmitting: boolean = false;
  readonly WAREHOUSE_SHIPPING_TYPES = WAREHOUSE_SHIPPING_TYPES;

  constructor(
    private dialogRef: MatDialogRef<UpdateWarehouseDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.warehouse = data.warehouse

    console.log(this.warehouse, 'xxxx')
  }

  ngOnInit() {
    console.log('this.warehouse.prices:', this.warehouse.prices)
    this.formData = this.formBuilder.group({
      name: [this.warehouse.name, {
        validators: [Validators.required],
      }],
      shipping_type: [this.warehouse.shipping_type, {
        validators: [Validators.required],
      }],
      consumable_id: [this.warehouse.consumable.id, {
        validators: [Validators.required],
      }],
      supplier_id: [this.warehouse.supplier.id, {
        validators: [Validators.required],
      }],
      prices: this.formBuilder.array(this.initPrices(this.warehouse.prices)),
    })
  }

  initPrices(prices: any[]): FormGroup[] {
    return prices.map(price => this.formBuilder.group({
      min_quantity: [price.min_quantity, [Validators.required]],
      max_quantity: [price.max_quantity, [Validators.required]],
      price: [price.price, [Validators.required]],
      cost_price: [price.cost_price, [Validators.required]]
    }));
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

    const data: UpdateWarehouse = {
      name: this.formData.value.name,
      shipping_type: this.formData.value.shipping_type,
      consumable_id: this.formData.value.consumable_id,
      supplier_id: this.formData.value.supplier_id,
      prices: this.formData.value.prices
    };

    this.formSubmitting = true
    this.warehouseService.updateWarehouse(`${this.warehouse.id}`, data).subscribe({
      next: result => {
        this.formSubmitting = false

        if (result.success) {
          this.toastrService.success("Склад успешно изменен!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        } else {
          this.toastrService.error("Склад не изменен!", "Произошла ошибка")
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Склад не изменен!", "Произошла ошибка")
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
