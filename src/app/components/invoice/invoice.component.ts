import {Component, Inject, Input, OnInit} from '@angular/core';
import {Calculation} from "../../models/order/calculation.model";
import {Service} from "../../models/services/service.model";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {OrdersService} from "../../services/orders.service";
import {ServicesService} from "../../services/services.service";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() orderUuid!: string;
  public calculation!: Calculation
  public loaded: boolean = false
  public dsId: number = 2

  services: Service[] = []
  servicesById: Service[] = []

  constructor(
    private orderService: OrdersService,
    private servicesService: ServicesService,
  ) {}

  ngOnInit() {
    this.servicesService.list().subscribe((services: Service[]) => {
      this.services = services
      services.forEach(service => {
        this.servicesById[parseInt(service.id!)] = service
      })
    })

    this.orderService.getCalculation(this.orderUuid).subscribe({
      next: result => {
        this.calculation = result.data
        this.loaded = true
      },
      error: data => {
        console.error(data)
      }
    })
  }
}
