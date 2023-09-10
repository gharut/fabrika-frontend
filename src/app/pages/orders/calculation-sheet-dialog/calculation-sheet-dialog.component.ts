import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Tag} from "../../../models/tags/tag.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable, startWith} from "rxjs";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {TagService} from "../../../services/tag.service";
import {ConsumablesService} from "../../../services/consumables.service";
import {OrdersService} from "../../../services/orders.service";
import {map} from "rxjs/operators";
import {Calculation} from "../../../models/order/calculation.model";
import {Service} from "../../../models/services/service.model";
import {ServicesService} from "../../../services/services.service";

@Component({
  selector: 'app-calculation-sheet-dialog',
  templateUrl: './calculation-sheet-dialog.component.html',
  styleUrls: ['./calculation-sheet-dialog.component.scss']
})
export class CalculationSheetDialogComponent implements OnInit{
  private id: number;
  public calculation!: Calculation
  public loaded: boolean = false
  public dsId: number = 2

  services: Service[] = []
  servicesById: Service[] = []


  constructor(
    private dialogRef: MatDialogRef<CalculationSheetDialogComponent>,
    private orderService: OrdersService,
    private servicesService: ServicesService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ) {
    this.id = data.id;
  }

  ngOnInit() {
    this.servicesService.list().subscribe((services: Service[]) => {
      this.services = services
      services.forEach(service => {
        this.servicesById[parseInt(service.id!)] = service
      })
    })

    this.orderService.getCalculation(this.id).subscribe({

      next: result => {
        this.calculation = result.data
        console.log(result.data)
        this.loaded = true


      },
      error: data => {
        console.log(data)
      }
    })
  }
}
