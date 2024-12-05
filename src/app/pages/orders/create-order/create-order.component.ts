import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../services/client.service";
import {ServicesService} from "../../../services/services.service";
import {AttributeService} from "../../../services/attribute.service";
import {ConsumablesService} from "../../../services/consumables.service";
import {ToastrService} from "ngx-toastr";
import {Client} from "../../../models/suppliers/client.model";
import {Consumable} from "../../../models/consumables/consumable.model";
import {Attribute} from "../../../models/attributes/attribute.model";
import {CreateClientDialogComponent} from "../../clients/create-client-dialog/create-client-dialog.component";
import {
  OrderChildProduct,
  OrderData, OrderProduct,
  OrderProductPackaging,
  OrderServices,
  OrderSize
} from "../../../models/order/orderData.model";
import {Service, ServiceAttributeData} from "../../../models/services/service.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {cibEvernote} from "@coreui/icons";
import {
  Calculation,
  CalculationPackaging,
  CalculationPickup, CalculationProduct,
  CalculationService, DeliveryItems
} from "../../../models/order/calculation.model";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {DeliveryLimits} from "../../../models/settings/deliveryLimits.model";
import {SettingsService} from "../../../services/settings.service";
import {OrdersService} from "../../../services/orders.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  @ViewChild('clientSearch') clientSearch!: ElementRef;

  orderForm!: FormGroup;

  orderFormData: OrderData = {
    client: -1,
    pickup: {
      products: [{
        index: 0,
        name: "",
        color: "",
        size: [
          {index: 0, size: "", qty: 0}
        ],
        child: []
      }],
      supply_date: "",
      supply_time: "",
      supply_items: [],
      supply_details: {
        name: "",
        phone: "",
        load_number: "",
        other: "",
      },
      services: []
    },
    packaging: []
  }

  clients: Client[] = []
  selectedClients: Client[] = []

  consumableByTag: Array<Array<Consumable>> = []
  consumableById: Consumable[] = []

  attributes: Attribute[] = []

  services: Service[] = []
  servicesById: Service[] = []

  dsId: number = 2

  currentDeliveryLimits!: DeliveryLimits

  calculation: Calculation = {
    pickup: {
      deliveryItems: {
        qty: 0,
        total_weight: 0,
        total_volume: 0,
        volume_price: 0,
        weight_price: 0,
        total_price: 0
      },
      services: [],
      total_price: 0
    },
    packaging: {
      products: [],
      total_price: 0,
    },

    total_price: 0
  }

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private servicesService: ServicesService,
    private attributeService: AttributeService,
    private consumablesService: ConsumablesService,
    private toastr: ToastrService,
    private settingsService: SettingsService,
    private orderService: OrdersService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.clientService.list().subscribe((clients: Client[]) => {
      this.clients = clients
      this.selectedClients = clients
    });

    this.settingsService.getByName('DELIVERY_ITEMS_LIMITS').subscribe(setting => {
      this.currentDeliveryLimits = new DeliveryLimits(setting.id!, setting.category!, setting.name!, setting.value!)
      this.currentDeliveryLimits.getVolumeTotalPrice(1234)
    })

    this.consumablesService.list().subscribe((consumables: Consumable[]) => {
      consumables.forEach(consumable => {
        this.consumableById[parseInt(consumable.id!)] = consumable
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
  }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      client: [this.orderFormData.client, {
        validators: [Validators.required],
      }],
      pickup: this.formBuilder.group({
        products: this.getProductsForm(),
        supply_date: [this.orderFormData.pickup.supply_date, Validators.required],
        supply_time: [this.orderFormData.pickup.supply_date, Validators.required],
        supply_items: new FormArray([]),
        supply_details: new FormArray([
          this.formBuilder.group({
            name: [''],
            phone: [''],
            load_number: [''],
            other: [''],
          })
        ]),
        services: new FormArray([])
      }),

      packaging: new FormArray([]),
    });

    this.servicesService.list().subscribe((services: Service[]) => {
      this.services = services
      services.forEach(service => {
        this.servicesById[parseInt(service.id!)] = service
      })
      this.addServicesToProduct(0)
      this.addServicesToPickup()
    });

    this.orderForm.valueChanges.subscribe((formData) => {
      this.orderFormData = formData;
    });

    this.addNewSupplyItem();
  }

  getRealElementCount(array: FormArray) {
    let count = 0
    for(let i = 0; i<array.length; i++) {
      if(array.at(i) !== undefined) {
        count ++
      }
    }

    return count
  }

  get getPickupFormGroup() {
    return this.orderForm.get('pickup') as FormGroup
  }

  get pickupService() {
    return this.getPickupFormGroup.get('services') as FormArray
  }

  get getPackagingFormArray() {
    return this.orderForm.get('packaging') as FormArray
  }

  getPackagingServicesArray(i: number) {
    return this.getPackagingFormArray.at(i).get('services') as FormArray
  }

  get supplyItems() {
    return this.getPickupFormGroup.get('supply_items') as FormArray
  }

  get supplyDetails() {
    return this.getPickupFormGroup.get('supply_details') as FormArray
  }

  get productsArray() {
    return this.getPickupFormGroup.get('products') as FormArray
  }

  sizesArray(prodIndex: number): FormArray {
    return this.productsArray.at(prodIndex).get('size') as FormArray
  }

  childSizesArray(prodIndex: number, childIndex: number): FormArray {
    return (this.productsArray.at(prodIndex).get('child') as FormArray).at(childIndex).get("size") as FormArray
  }

  childArray(prodIndex: number): FormArray {
    return this.productsArray.at(prodIndex).get('child') as FormArray
  }

  addSizeToProduct(i: number) {
    let size_form = this.getSizeForm()
    let productSizeForm = this.sizesArray(i)
    productSizeForm.push(size_form)
  }

  removeSizeFromProduct(prodIndex: number, sizeIndex: number) {
    (this.productsArray.at(prodIndex).get("size") as FormArray).removeAt(sizeIndex)
  }

  removeSizeFromProductChild(prodIndex: number, childIndex: number, sizeIndex: number) {
    ((this.productsArray.at(prodIndex).get("child") as FormArray).at(childIndex).get('size') as FormArray).removeAt(sizeIndex)
  }

  addNewProduct() {
    this.productsArray.push(this.newProductForm())
    this.addServicesToProduct(this.productsArray.length - 1)
  }

  removeProduct(i: number) {
    if(this.getRealElementCount(this.productsArray) > 1) {
      this.productsArray.removeAt(i)
      this.removeProductServices(i)
    }

  }

  addServicesToProduct(i: number) {
    let servicesForm = this.formBuilder.group({
      complect: [1, Validators.required],
      product_id: [i, Validators.required],
      services: new FormArray([])
    })
    this.services.forEach(service => {
      if (service.step == "PROCESSING") {
        (servicesForm.get('services') as FormArray).push(this.getServiceForm(parseInt(service.id!)))
      }
    })

    this.getPackagingFormArray.push(servicesForm)
  }

  addServicesToPickup() {
    this.services.forEach(service => {
      if (service.step === "PREPROCESSING") {
        (this.getPickupFormGroup.get('services') as FormArray).push(this.getServiceForm(parseInt(service.id!), parseInt(service.id!) == this.dsId))
      }
    })
  }

  getServiceForm(service_id: number, enabled: boolean = false) {
    return this.formBuilder.group({
      service_id: [service_id, Validators.required],
      service_tag_id: [''],
      service_attribute: [''],
      service_enabled: [enabled]
    })
  }

  getDeliveryServiceForm() {
    let pickup_services_form = this.getPickupFormGroup.get('services') as FormArray
    let idx = 0
    for (let i = 0; i < pickup_services_form.length; i++) {
      if (pickup_services_form.at(i).get('services_id')?.value == this.dsId) {
        idx = i
        break
      }
    }

    return pickup_services_form.at(idx)
  }

  getDeliveryServiceData(): OrderServices{
    let idx = -1
    for (let i = 0; i < this.orderFormData.pickup.services.length; i++) {
      if (this.orderFormData.pickup.services[i].service_id == this.dsId) {
        idx = i
      }
    }

    return this.orderFormData.pickup.services[idx]
  }

  toggleDelivery(event: MatCheckboxChange) {
    let enabled = !event.checked

    this.getDeliveryServiceForm()!.get('service_enabled')?.setValue(enabled)
    this.getDeliveryServiceForm()!.get('service_attribute')?.setValidators([])
    this.getDeliveryServiceForm().updateValueAndValidity()

    this.supplyItems.controls.forEach((item: any) => {
      Object.keys(item.controls).forEach((key) => {
        if (enabled) {
          item.controls[key].setValidators(Validators.required);
        } else {
          item.controls[key].clearValidators();
        }

        item.controls[key].updateValueAndValidity();
      })
    })

    setTimeout(() => {
      this.supplyItems.updateValueAndValidity();
    });
  }

  addSizeToProductChild(i: number, ic: number) {
    let size_form = this.getSizeForm()
    let childSizeForm = this.childSizesArray(i, ic)
    childSizeForm.push(size_form)
  }

  addColorToProduct(i: number) {
    let child_form = this.getChildForm()
    let productChildForm = this.childArray(i)
    productChildForm.push(child_form)
  }

  removeColorFromProduct(i: number, ic: number) {
    (this.productsArray.at(i).get("child") as FormArray).removeAt(ic)
  }

  getProductsForm() {
    let products_form = new FormArray([])
    if (this.orderFormData != null) {
      if (this.orderFormData.pickup.products !== undefined && this.orderFormData.pickup.products.length > 0) {
        this.orderFormData.pickup.products.forEach(prd => {
          let product_item = this.formBuilder.group({
            name: [prd.name, Validators.required],
            color: [prd.color, Validators.required],
            size: new FormArray([]),
            child: new FormArray([]),
          })

          if (prd.size != undefined && prd.size.length > 0) {
            let product_item_size_form = product_item.get('size') as FormArray
            prd.size.forEach((size: OrderSize, index: number) => {
              let size_form = this.getSizeForm(size.size, size.qty)
              product_item_size_form.insert(index, size_form)
            })

          }

          let product_item_child_form = product_item.get('child') as FormArray
          if (prd.child != undefined && prd.child.length > 0) {

            prd.child.forEach((child: OrderChildProduct, index: number) => {
              let childForm = this.getChildForm(child.color, child.size)
              product_item_child_form.insert(index, childForm)
            })
          }

          (products_form as unknown as FormArray).insert(prd.index, product_item)
        })
      }
    }

    return products_form
  }

  getSizeForm(size: string = "", qty: number = 0) {
    return this.formBuilder.group({
      size: [size],
      qty: [qty, Validators.required]
    })
  }

  removeProductServices(productIndex: number) {
    this.getPackagingFormArray.controls.forEach((frm, idx) => {
      if (frm.get('product_id')?.value == productIndex) {
        this.getPackagingFormArray.removeAt(idx)
      }
    })
  }

  getChildForm(color: string = "", sizes: OrderSize[] = []) {
    let childForm = this.formBuilder.group({
      color: [color, Validators.required],
      size: new FormArray([])
    })

    sizes.forEach(size => {
      (childForm.get('size') as FormArray).insert(size.index!, this.getSizeForm(size.size, size.qty))
    })

    if (sizes.length === 0) {
      (childForm.get('size') as FormArray).insert(0, this.getSizeForm())
    }

    return childForm
  }

  newProductForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      color: [''],
      size: new FormArray([this.getSizeForm()]),
      child: new FormArray([]),
    })
  }


  // Client create/select methods

  clientListEvent(event: boolean) {
    if (!event) {
      this.clientSearch.nativeElement.value = ""
      this.selectedClients = this.clients
    }
  }

  onClientSearchKey(event: KeyboardEvent) {
    this.selectedClients = this.searchClient((event.target as HTMLInputElement).value);
  }

  searchClient(value: string) {
    let filter = value.toLowerCase();
    return this.clients.filter(client => client.name!.toLowerCase().startsWith(filter));
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

  addNewSupplyItem() {
    this.supplyItems.push(
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
    this.supplyItems.removeAt(supplyItemIndex);
  }

  serviceById(id: any) {
    return this.services.find(x => x.id == id)
  }

  getProductTotalCount(i: number): number {
    let qty = 0
    this.orderFormData.pickup.products[i].size.forEach(el => {
      qty += el.qty
    })

    this.orderFormData.pickup.products[i].child?.forEach(ch => {
      ch.size.forEach(el => {
        qty += el.qty
      })
    })

    return qty
  }

  getTotalSupplyItemsData(): DeliveryItems|null {
    if(this.orderFormData.pickup.supply_items?.length == 0) {
      return null
    }

    let result:DeliveryItems = {
      qty: 0,
      total_volume: 0,
      volume_price: 0,
      total_weight: 0,
      weight_price: 0,
      total_price: 0,
    }
    this.orderFormData.pickup.supply_items?.forEach(item => {
      let items_total_volume = parseInt(item.length)*parseInt(item.height)*parseInt(item.width)*parseInt(item.qty)
      if(item.unit == "cm") {
        items_total_volume = Math.round(items_total_volume/1000)
      }else{
        items_total_volume = items_total_volume*1000
      }
      let items_total_weight = parseInt(item.weight)*parseInt(item.qty)
      result.total_volume += items_total_volume
      result.total_weight += items_total_weight
      result.qty += parseInt(item.qty)
    })

    result.volume_price = Math.round(this.currentDeliveryLimits.getVolumeTotalPrice(result.total_volume))
    result.weight_price = Math.round(this.currentDeliveryLimits.getWeightTotalPrice(result.total_weight))
    result.total_price = result.volume_price+result.weight_price

    return result
  }

  calculatePickup(): CalculationPickup {
    let result: CalculationPickup = {
      deliveryItems: {
        qty: 0,
        total_weight: 0,
        total_volume: 0,
        volume_price: 0,
        weight_price: 0,
        total_price: 0
      },
      services: [],
      total_price: 0
    }

    this.orderFormData.pickup.services.forEach(service => {
      if (service.service_enabled === true) {
        let serviceCalculation = this.getCalculationService(service)

        if(service.service_id == this.dsId) {
          let deliveryItems = this.getTotalSupplyItemsData()
          if(deliveryItems != null) {
            result.deliveryItems = deliveryItems
            serviceCalculation.total_price += deliveryItems.total_price
          }
        }
        result.services.push(serviceCalculation)
        result.total_price += serviceCalculation.total_price
      }
    })

    return result
  }

  calculatePackaging(): CalculationPackaging {
    let result: CalculationPackaging = {
      products: [],
      total_price: 0
    }

    this.orderFormData.packaging.forEach(order => {
      let productCalc = this.calculateProductServices(order)
      result.total_price += productCalc.total_price
      result.products.push(productCalc)
    })

    return result
  }

  calculateProductServices(order: OrderProductPackaging): CalculationProduct {
    let product = this.orderFormData.pickup.products[order.product_id]
    let result: CalculationProduct = {
      product_name: product.name,
      product_count: this.getProductTotalCount(order.product_id),
      colors_count: product.child.length+1,
      services: [],
      total_price: 0
    }

    order.services.forEach(svc => {
      if(svc.service_enabled == true) {
        let prdService = this.getCalculationService(svc, order.product_id, order.complect)
        result.total_price += prdService.total_price
        result.services.push(prdService)
      }
    })

    return result
  }

  calculate():Calculation {

    let result: Calculation = {
      pickup: this.calculatePickup(),
      packaging: this.calculatePackaging(),
      total_price: 0
    }

    result.total_price = result.pickup.total_price+result.packaging.total_price
    console.log(result)
    console.log(this.getTotalSupplyItemsData())
    return result
  }

  getCalculationService(order_service: OrderServices, product_index: number = -1, complect: number = -1): CalculationService {
    let service = this.servicesById[order_service.service_id]
    let result: CalculationService = {
      service_name: service.name!,
      service_price: service.price!,
      count: 0,
      total_price: 0,
    }

    if (service.attributes!.length > 0) {
      let apply_type = service.attributes![0].apply_to_price_type!
      let attr_price = 0
      let attr_json: ServiceAttributeData
      try {
        attr_json = JSON.parse(order_service.service_attribute);
        attr_price = parseInt(attr_json.price)
      } catch (e) {

      }
      if (apply_type == 1) {
        result.service_price += attr_price
      }

      if (apply_type == 2) {
        result.service_price -= attr_price
      }

      if (apply_type == 3) {
        result.service_price = attr_price
      }
    }

    if (service.apply_to === 'ORDER') {
      result.count = 1
    }

    if (service.apply_to === 'PRODUCT') {
      result.count = Math.floor(this.getProductTotalCount(product_index) / complect)
    }

    if (service.apply_to === 'PRODUCT_UNIT') {
      result.count = this.getProductTotalCount(product_index)
    }

    if (service.apply_to === 'CUSTOM_COUNT') {
      result.count = parseInt(order_service.service_attribute)
    }

    result.total_price = result.count * result.service_price

    if (service.use_consumable) {
      let consumable = this.consumableById[parseInt(order_service.service_attribute)]
      result.consumable = {
        consumable_name: consumable.name!,
        consumable_price: parseInt(consumable.price!),
        count: result.count,
        total_price: result.count * parseInt(consumable.price!)
      }

      result.total_price += result.consumable.total_price
    }

    return result
  }

  onStepChange(event: StepperSelectionEvent){
    if(event.selectedIndex == 2 && this.orderForm.valid) {
      this.calculation = this.calculate()
    }
  }

  onSubmit() {
    if(this.orderForm.invalid) {
      return
    }

    if (!this.getDeliveryServiceForm()?.get('service_enabled')?.value) {
      this.orderFormData.pickup.supply_items = []
    }

    this.orderService.createOrder(this.orderFormData).subscribe({
      next: (result: any) => {
        this.toastr.success("Заказ успешно создан.")
        this.router.navigate(['/orders/view', result.data.id]);
      },
      error: data => {
        console.error(data)
      }
    })
  }

  protected readonly FormGroup = FormGroup;
}
