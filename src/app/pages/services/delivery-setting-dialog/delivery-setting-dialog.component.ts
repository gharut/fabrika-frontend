import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import value from "*.json";
import {SettingsService} from "../../../services/settings.service";
import {Setting} from "../../../models/settings/setting.model";
import {DeliveryLimits} from "../../../models/settings/deliveryLimits.model";

@Component({
  selector: 'app-delivery-setting-dialog',
  templateUrl: './delivery-setting-dialog.component.html',
  styleUrls: ['./delivery-setting-dialog.component.scss']
})
export class DeliverySettingDialogComponent implements OnInit {
  deliverySettingForm!: FormGroup;
  currentDeliveryLimits!: DeliveryLimits
  submitting: boolean = false
  constructor(
    private dialogRef: MatDialogRef<DeliverySettingDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.settingsService.getByName('DELIVERY_ITEMS_LIMITS').subscribe(setting => {
      this.currentDeliveryLimits = new DeliveryLimits(setting.id!, setting.category!, setting.name!, setting.value!)
      this.deliverySettingForm = this.formBuilder.group({
        category: ['DELIVERY_SETTING', Validators.required],
        name: ['DELIVERY_ITEMS_LIMITS', Validators.required],
        value: this.formBuilder.group({
          volume_base: [this.currentDeliveryLimits.getVolumeBase(), Validators.required],
          weight_base: [this.currentDeliveryLimits.getWeightBase(), Validators.required],
          volume: new FormArray([]),
          weight: new FormArray([]),
        })
      })
      console.log(setting)

      if(this.currentDeliveryLimits.getVolumes() != null) {
        this.currentDeliveryLimits.getVolumes().forEach((vol: {min: number, max: number, price: number}) => {
          this.addNewVolume(vol.min, vol.max, vol.price)
        })
      }

      if(this.currentDeliveryLimits.getWeights() != null) {
        this.currentDeliveryLimits.getWeights().forEach((vol: {min: number, max: number, price: number}) => {
          this.addNewWeight(vol.min, vol.max, vol.price)
        })
      }
    })

  }

  get valueForm(): FormGroup {
    return this.deliverySettingForm.get('value') as FormGroup
  }

  get volumeForm(): FormArray {
    return this.deliverySettingForm.get('value')!.get('volume') as FormArray
  }

  get weightForm(): FormArray {
    return this.deliverySettingForm.get('value')!.get('weight') as FormArray
  }

  addNewVolume(min?: number, max?: number, price?: number): void {
    this.volumeForm.push(this.formBuilder.group({
      min: [min, Validators.required],
      max: [max],
      price: [price, Validators.required]
    }))
  }

  deleteVolume(i: number) {
    this.volumeForm.removeAt(i)
  }

  addNewWeight(min?: number, max?: number, price?: number): void {
    this.weightForm.push(this.formBuilder.group({
      min: [min, Validators.required],
      max: [max],
      price: [price, Validators.required]
    }))
  }

  deleteWeight(i: number) {
    this.weightForm.removeAt(i)
  }

  onSubmit() {
    this.currentDeliveryLimits.value = JSON.stringify(this.valueForm.value)
    this.submitting = true
    this.settingsService.updateSetting(this.currentDeliveryLimits.id!, this.currentDeliveryLimits).subscribe({

      next: result => {
        this.submitting = false
        if(result.success) {
          this.toastrService.success("","Изменения сохранены!")
          this.dialogRef.close();
        }else{
          this.toastrService.error("", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.submitting = false
        this.toastrService.error("", "Произошла ошибка")
        this.dialogRef.close();
      }
    })

    this.dialogRef.close()
  }

}
