import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ServicesService} from "../../../services/services.service";
import {CreateClientDialogComponent} from "../../clients/create-client-dialog/create-client-dialog.component";
import {ClientService} from "../../../services/client.service";
import {Client} from "../../../models/suppliers/client.model";
import {Service, ServiceAttributeData} from "../../../models/services/service.model";
import {AttributeService} from "../../../services/attribute.service";
import {Attribute} from "../../../models/attributes/attribute.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ConsumablesService} from "../../../services/consumables.service";
import {Consumable} from "../../../models/consumables/consumable.model";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-create-order-dialog',
  templateUrl: './create-order-dialog.component.html',
  styleUrls: ['./create-order-dialog.component.scss']
})
export class CreateOrderDialogComponent implements OnInit {
  @ViewChild('clientSearch') clientSearch!: ElementRef;
  @ViewChild('clientDelivery') clientDelivery!: ElementRef;
  orderForm!: FormGroup;
  clients: Client[] = []
  services: Service[] = []
  servicesById: Service[] = []
  isServiceEnabled: Array<boolean> = []
  selectedClients: Client[] = []
  attributes: Attribute[] = []
  consumableByTag: Array<Array<Consumable>> = []
  tagSelections: Array<number> = []
  calculationSheet: Object = {}
  ssId: number = 2


  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(
    private dialogRef: MatDialogRef<CreateOrderDialogComponent>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private servicesService: ServicesService,
    private attributeService: AttributeService,
    private consumablesService: ConsumablesService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.clientService.list().subscribe((clients: Client[]) => {
      this.clients = clients
      this.selectedClients = clients
    });

    this.consumablesService.list().subscribe((consumables: Consumable[]) => {
      consumables.forEach(consumable => {
        consumable.tags?.forEach(tag => {
          if (this.consumableByTag[parseInt(tag.id!)] == undefined) {
            this.consumableByTag[parseInt(tag.id!)] = []
          }
          this.consumableByTag[parseInt(tag.id!)].push(consumable)
        })
      })

    });


    this.attributeService.list().subscribe((attributes: Attribute[]) => {
      this.attributes = attributes
    });

    this.orderForm = this.formBuilder.group({
      client: ['', {
        validators: [Validators.required],
      }],
      supply_date: [Validators.required],
      supply_time: [Validators.required],
      products: new FormArray([]),
      supply_items: new FormArray([]),
      supply_details: new FormArray([
        this.formBuilder.group({
          name: [''],
          phone: [''],
          load_number: [''],
          other: [''],
        })
      ]),
      order_services: new FormArray([]),
    });

    this.orderForm.statusChanges.subscribe(value => {
      this.calculate()
    })

    this.addNewProduct()
    this.addNewSupplyItem()
    this.servicesService.list().subscribe((services: Service[]) => {
      this.services = services
      services.forEach(service => {
        this.addNewService(service.id)
        this.servicesById[parseInt(service.id!)] = service
        this.isServiceEnabled[parseInt(service.id!)] = false
        if (parseInt(service.id!) == this.ssId) {
          this.isServiceEnabled[parseInt(service.id!)] = true
        }
      })
    });

  }

  get products() {
    return this.orderForm.get('products') as FormArray
  }

  get supplyItems() {
    return this.orderForm.get('supply_items') as FormArray
  }

  get supplyDetails() {
    return this.orderForm.get('supply_details') as FormArray
  }

  productsForm(index: number) {
    return (this.orderForm.get('products') as FormArray).at(index)
  }

  supplyItemsForm(index: number) {
    return (this.orderForm.get('supply_items') as FormArray).at(index)
  }

  get orderServices() {
    return this.orderForm.get('order_services') as FormArray
  }

  addNewProduct() {
    const products_form = this.orderForm.get('products') as FormArray;
    products_form.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        qty: ['', Validators.required],
        size: [''],
        color: ['']
      })
    )
  }

  addNewService(id: any) {
    const order_services = this.orderForm.get('order_services') as FormArray;
    this.services.forEach(value => {
      if (value.id == id) {
        order_services.insert(parseInt(value.id!),
          this.formBuilder.group({
            service_id: [id, Validators.required],
            service_attribute: ['', ],
            service_enabled: [id == this.ssId, ],
          })
        )
      }
    })
  }

  serviceById(id: any) {
    return this.services.find(x => x.id == id)
  }

  removeProduct(productIndex: number) {
    (this.orderForm.get('products') as FormArray).removeAt(productIndex);
  }

  addNewSupplyItem() {
    const supply_items_form = this.orderForm.get('supply_items') as FormArray;
    supply_items_form.push(
      this.formBuilder.group({
        qty: ['', Validators.required],
        width: ['', Validators.required],
        length: ['', Validators.required],
        height: ['', Validators.required],
        unit: ['', Validators.required],
        weight: ['', Validators.required],
      })
    )
  }

  removeSupplyItem(supplyItemIndex: number) {
    (this.orderForm.get('supply_items') as FormArray).removeAt(supplyItemIndex);
  }

  openCreateClientDialog() {
    const dialogRef = this.dialog.open(CreateClientDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(newClient => {
      if (newClient) {
        this.clients.push(newClient)
      }
    });
  }

  onKey(event: KeyboardEvent) {
    this.selectedClients = this.search((event.target as HTMLInputElement).value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.clients.filter(client => client.name!.toLowerCase().startsWith(filter));
  }

  clientListEvent(event: boolean) {
    if (!event) {
      this.clientSearch.nativeElement.value = ""
      this.selectedClients = this.clients
    }
  }

  serviceCheckListen(event: MatCheckboxChange) {
    this.isServiceEnabled[parseInt(event.source._inputElement.nativeElement.value)] = event.checked
    console.log(this.isServiceEnabled)
  }

  changeConsumable(event: MatSelectChange) {
    const id = event.source.id
    this.tagSelections[parseInt(id)] = event.value
    console.log(this.tagSelections)
  }

  calculate() {
    let qty = 0
    for (let control of this.products.controls) {
      qty += parseInt(control.get("qty")?.value)
    }

    for (let control of this.orderServices.controls) {
      const service_id = control.get("service_id")!.value
      if(control.get("service_enabled")?.value) {
        let service = this.servicesById[service_id]
        let service_attribute = control.get("service_attribute")?.value ?? ""
        if(service !== undefined && service.apply_to == "ORDER") {
          let price = service.price ?? 0
          let attr_price = 0
          if(service.attributes!.length > 0 && control.get("service_attribute")?.value != ""){
            let attr_json :ServiceAttributeData
            try {
              attr_json = JSON.parse(service_attribute);
              attr_price = parseInt(attr_json.price)
            } catch (e) {

            }
            if(service.attributes![0].apply_to_price_type == 1) {
              price += attr_price
            }else if(service.attributes![0].apply_to_price_type == 2) {
              price -= attr_price
            }else if(service.attributes![0].apply_to_price_type == 3) {
              price = attr_price
            }
          }
        }
      }
    }

  }

  protected readonly parseInt = parseInt;
}
