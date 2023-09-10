import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {OrderListItem, OrderListItemService, OrderListItemSupplyItem} from "../../../models/order/order.list.item";
import {MatTableDataSource} from "@angular/material/table";
import {OrdersService} from "../../../services/orders.service";
import {CLIENT_TYPES} from "../../../constants/client_types";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UNITS_SHORT} from "../../../constants/units";
import {ServicesService} from "../../../services/services.service";
import {Service} from "../../../models/services/service.model";
import {PickupFormModel} from "../../../models/order/pickup.form.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {
  PackagingFormModel,
  PackagingFormProduct, PackagingFormProductChild,
  PackagingFormService
} from "../../../models/order/packaging.form.model";
import {OrderSize} from "../../../models/order/orderData.model";
import {Consumable} from "../../../models/consumables/consumable.model";
import {ConsumablesService} from "../../../services/consumables.service";
import {
  CreateConsumableDialogComponent
} from "../../consumable/consumables/create-consumable-dialog/create-consumable-dialog.component";
import {ConsumableWithDeleting} from "../../consumable/consumables/consumables.component";
import {CalculationSheetDialogComponent} from "../calculation-sheet-dialog/calculation-sheet-dialog.component";
import {MatDialog} from "@angular/material/dialog";



@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit{
  order_id!: number
  order!: OrderListItem
  pickupForm!: FormGroup
  pickupFormData!: PickupFormModel

  packagingForm!: FormGroup
  packagingFormData!: PackagingFormModel

  pickupEdit: boolean = false
  packagingEdit: boolean = false

  services: Service[] = []
  servicesById: Service[] = []
  loaded: boolean = false

  dsId: number = 2

  activeProdPanel: number = 0

  consumableByTag: Array<Array<Consumable>> = []
  consumableById: Consumable[] = []
  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderService: OrdersService,
              private formBuilder: FormBuilder,
              private servicesService: ServicesService,
              private consumableService: ConsumablesService,
              private dialog: MatDialog) {}
  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id')
      if(id === null) {
        this.router.navigate(['orders']);
      }
      this.order_id = parseInt(id!)

      this.servicesService.list().subscribe((services: Service[]) => {
        this.services = services
        services.forEach(service => {
          this.servicesById[parseInt(service.id!)] = service
        })

        this.consumableService.list().subscribe((consumables: Consumable[]) => {
          consumables.forEach(consumable => {
            this.consumableById[parseInt(consumable.id!)] = consumable
            consumable.tags?.forEach(tag => {
              if (this.consumableByTag[parseInt(tag.id!)] == undefined) {
                this.consumableByTag[parseInt(tag.id!)] = []
              }
              this.consumableByTag[parseInt(tag.id!)].push(consumable)
            })
          })

          this.orderService.getOrder(this.order_id).subscribe( result => {
            if(!result.success) {
              this.router.navigate(['orders']);
            }

            this.order = result.data

            //console.log(this.order)
            this.initPickupForm()
            this.initPackagingForm()
            this.pickupForm.valueChanges.subscribe((pickupFormData) => {
              this.pickupFormData = pickupFormData;

            });

            this.packagingForm.valueChanges.subscribe((packagingFormData) => {
              this.packagingFormData = packagingFormData;
            });
            this.loaded = true

          })

        });




      });
    })

  }

  getServiceIfEnabled(service_id:number): OrderListItemService|boolean {
    let result: OrderListItemService|boolean = false
    this.order.order_services.forEach( service => {
      if(service.service_id == service_id) {
        result = service
      }
    })

    return result
  }

  getServiceForm(service_id: number, service_attribute: string, enabled: boolean = false) {
    return this.formBuilder.group({
      service_id: [service_id, Validators.required],
      service_tag_id: [''],
      service_attribute: [service_attribute],
      service_enabled: [enabled]
    })
  }

  saJson(data: string) {
    if(data == "") {
      return false
    }

    let json = JSON.parse(data)
    return json.value
  }

  serviceById(id: any) {
    return this.services.find(x => x.id == id)
  }

  //* DELIVERY FORM METHODS **/

  toggleDelivery(event: MatCheckboxChange) {
    let enabled = !event.checked
    this.getDeliveryServiceForm()!.get('service_enabled')?.setValue(enabled)
    this.getDeliveryServiceForm()!.get('service_attribute')?.setValidators([])
    this.getDeliveryServiceForm().updateValueAndValidity()
    if (event.checked) {
      (this.pickupForm.get('supply_items') as FormArray).clear()
    }else{
      this.initSupplyItems()
    }
  }

  get supplyItems() {
    return this.pickupForm.get('supply_items') as FormArray
  }

  get getPickupServices() {
    return this.pickupForm.get('services') as FormArray
  }



  getDeliveryServiceForm() {
    let pickup_services_form = this.getPickupServices
    let idx = 0
    for (let i = 0; i < pickup_services_form.length; i++) {
      if (pickup_services_form.at(i).get('services_id')?.value == this.dsId) {
        idx = i
        break
      }
    }

    return pickup_services_form.at(idx)
  }

  initPickupForm() {
    this.initPickupFormData()
    this.pickupForm = this.formBuilder.group({
      supply_date: [this.pickupFormData.supply_date, Validators.required],
      supply_time: [this.pickupFormData.supply_time, Validators.required],
      supply_details: new FormArray([
        this.formBuilder.group({
          name: this.pickupFormData.supply_details.name,
          phone: this.pickupFormData.supply_details.phone,
          load_number: this.pickupFormData.supply_details.load_number,
          other: this.pickupFormData.supply_details.other,
        })
      ]),
      supply_items: new FormArray([]),
      services: new FormArray([]),
    })

    this.initSupplyItems()
    this.initPickupFormServices()
  }
  initPickupFormData() {
    this.pickupFormData = {
      supply_date: this.order.supply_date,
      supply_time: this.order.supply_time,
      supply_items: this.order.supply_items,
      supply_details: {
        name: this.order.supply_details[0]?.name,
        phone: this.order.supply_details[0]?.phone,
        load_number: this.order.supply_details[0]?.load_number,
        other: this.order.supply_details[0]?.other,
      },
      services: []
    }
  }

  initSupplyItems() {
    this.order.supply_items.forEach(item => {
      this.addNewSupplyItem(item)
    })
  }


  initPickupFormServices() {
    this.getPickupServices.clear()
    this.pickupFormData.services = []
    this.services.forEach(service => {
      if (service.step === "PREPROCESSING") {
        let service_enabled = false
        let service_attribute = ""
        let serviceData = this.getServiceIfEnabled(parseInt(service.id!))
        if(serviceData !== false && typeof serviceData !== "boolean") {
          service_enabled = true
          service_attribute = serviceData.service_attribute
        }
        this.getPickupServices.push(this.getServiceForm(parseInt(service.id!), service_attribute, service_enabled))
        this.pickupFormData.services.push({
          service_id: parseInt(service.id!),
          service_attribute: service_attribute,
          service_enabled: service_enabled
        })
      }
    })
  }

  addNewSupplyItem(item?: OrderListItemSupplyItem) {
    this.supplyItems.push(
      this.formBuilder.group({
        qty: [item?.qty, Validators.required],
        width: [item?.width, Validators.required],
        length: [item?.length, Validators.required],
        height: [item?.height, Validators.required],
        unit: [item?.unit, Validators.required],
        weight: [item?.weight, Validators.required],
      })
    )
  }

  removeSupplyItem(supplyItemIndex: number) {
    if(this.getRealElementCount(this.supplyItems) > 1) {
      this.supplyItems.removeAt(supplyItemIndex);
    }
  }

  cancelDeliveryFormEdit() {
    this.pickupForm = this.formBuilder.group({
      supply_items: new FormArray([]),
    })
    this.initPickupForm()
  }

  cancelPackagingFormEdit() {
    this.packagingForm = this.formBuilder.group({
      products: new FormArray([]),
    })
    this.initPackagingForm()
  }

  savePackagingForm() {
    if(this.packagingForm.invalid) {
      return
    }

    console.log(this.packagingFormData);
    this.orderService.updatePackaging(this.order_id, this.packagingFormData).subscribe(
      {

        next: result => {
          if(result.success) {
            this.order = result.data
            this.initPackagingFormData()
            this.packagingEdit = false
          }
        },
        error: data => {
          console.log(data)
        }


      })
  }

  updateStatus(attribute: string, value: any) {

    this.orderService.updateStatus(this.order_id, attribute, value).subscribe(
      {
        next: result => {
          if(result.success) {
            this.order = result.data
          }
        },
        error: data => {
          console.log(data)
        }


      })
  }

  savePickupForm() {
    if(this.pickupForm.invalid) {
      return
    }
    this.orderService.updatePickup(this.order_id, this.pickupFormData).subscribe(
      {

        next: result => {
          if(result.success) {
            this.order = result.data
            this.initPickupForm()
            this.pickupEdit = false
          }
        },
        error: data => {
          console.log(data)
        }


    })
  }






  // PACKAGING FORM METHODS

  get getPackagingProducts(): FormArray {
    return this.packagingForm.get('products') as FormArray
  }

  getPackagingProductSizes(product_index: number): FormArray {
    return this.getPackagingProducts.at(product_index).get('size') as FormArray
  }

  getPackagingProductServices(product_index: number): FormArray {
    return this.getPackagingProducts.at(product_index).get('services') as FormArray
  }

  getPackagingProductChild(product_index: number): FormArray {
    return this.getPackagingProducts.at(product_index).get('child') as FormArray
  }

  getPackagingProductChildSizes(product_index: number, child_index: number): FormArray {
    return this.getPackagingProductChild(product_index).at(child_index).get('size') as FormArray
  }


  removeSizeItem(product_index: number, size_index: number) {
    let sizes = this.getPackagingProductSizes(product_index)
    if(this.getRealElementCount(sizes) > 1) {
      sizes.removeAt(size_index)
    }
  }

  removeChildSizeItem(product_index: number, child_index: number, size_index: number) {
    let sizes = this.getPackagingProductChildSizes(product_index, child_index)
    if(this.getRealElementCount(sizes) > 1) {
      sizes.removeAt(size_index)
    }
  }

  addSizeItem(product_index: number,) {
    this.getPackagingProductSizes(product_index).push(this.getNewProductSizeForm())
  }

  addChildSizeItem(product_index: number, child_index:number) {
    this.getPackagingProductChildSizes(product_index, child_index).push(this.getNewProductSizeForm())
  }

  addNewChildItem(product_index: number) {
    this.getPackagingProductChild(product_index).push(this.getNewChildForm())
  }

  removeChild(product_index: number, child_index:number) {
    this.getPackagingProductChild(product_index).removeAt(child_index)
  }

  getProductServiceIfEnabled(service_id:number, product_id: number): OrderListItemService|boolean {
    let result: OrderListItemService|boolean = false
    this.order.order_services.forEach( service => {
      if(service.service_id == service_id && service.product_id == product_id) {
        result = service
      }
    })

    return result
  }
  initPackagingForm() {
    this.initPackagingFormData()
    this.packagingForm = this.formBuilder.group({
      products: new FormArray([]),
    })

    this.initProductsForms()
  }

  initProductsForms() {
    let productsForm = this.getPackagingProducts;
    this.packagingFormData.products.forEach( prd => {
      productsForm.push(this.getNewProductForm(prd))
    })
  }

  getNewProductForm(product: PackagingFormProduct|boolean = false, new_name:string="") {
    let id = typeof product != "boolean" ? product.product_id : null
    let name = typeof product != "boolean" ? product.name : new_name ?? ""
    let color = typeof product != "boolean" ? product.color : ""
    let complect = typeof product != "boolean" ? product.complect : ""
    let sizes: any[] = []
    let child: any[] = []
    let services: any[] = []

    if(typeof product != "boolean") {
      product.size.forEach(sz => {
        sizes.push(this.getNewProductSizeForm(sz))
      })
    }

    if(typeof product != "boolean" && product.child.length > 0) {
      product.child.forEach(ch => {
        child.push(this.getNewChildForm(ch))
      })
    }

    this.getProductServices(id).forEach(svc => {
      services.push(this.getNewServiceForm(svc))
    })

    if(sizes.length === 0) {
      sizes.push(this.getNewProductSizeForm())
    }
    return this.formBuilder.group({
      product_id: [id],
      name: [name, Validators.required],
      color: [color, Validators.required],
      complect: [complect, Validators.required],
      size: new FormArray(sizes),
      child: new FormArray(child),
      services: new FormArray(services),
    })
  }

  getNewProductSizeForm(size: OrderSize|boolean = false) {
    let sz = typeof size != "boolean" ? size.size : ""
    let qty = typeof size != "boolean" ? size.qty : 0
    return this.formBuilder.group({
      size: [sz],
      qty: [qty, Validators.required]
    })
  }

  getNewChildForm(child: PackagingFormProductChild|boolean = false) {
    let id = typeof child != "boolean" ? child.product_id : ""
    let color = typeof child != "boolean" ? child.color : ""
    let sizes: any[] = []
    if(typeof child != "boolean") {
      child.size.forEach(sz => {
        sizes.push(this.getNewProductSizeForm(sz))
      })
    }

    if(sizes.length === 0) {
      sizes.push(this.getNewProductSizeForm())
    }

    return this.formBuilder.group({
      product_id: [id],
      color: [color, Validators.required],
      size: new FormArray(sizes)
    })
  }

  getNewServiceForm(svc: PackagingFormService|boolean = false) {
    let record_id = typeof svc != "boolean" ? svc.record_id : ""
    let service_id = typeof svc != "boolean" ? svc.service_id : ""
    let service_attribute = typeof svc != "boolean" ? svc.service_attribute : ""
    let service_enabled = typeof svc != "boolean" ? svc.service_enabled : ""
    let service_tag_id = null

    if(typeof service_id == "number") {
      let cur_service  = this.servicesById[service_id]
      if(cur_service.use_consumable == true && service_attribute != "") {
        let tags  = this.consumableById[parseInt(service_attribute)]!.tags
        if(typeof tags !== undefined) {
          service_tag_id = tags![0].id
        }

      }
    }
    return this.formBuilder.group({
      record_id: [record_id],
      service_id: [service_id],
      service_tag_id: [service_tag_id],
      service_attribute: [service_attribute],
      service_enabled: [service_enabled],
    })
  }

  initPackagingFormData() {
    this.packagingFormData = {
      products: [],
    }

    this.order.products.forEach(product => {
      if(product.parent_id == null) {
        let newPrd: PackagingFormProduct = {
          product_id: product.id,
          name: product.name,
          color: product.color,
          complect: product.complect,
          size: [],
          child: [],
          services: this.getProductServices(product.id),
        }
        product.size.forEach(size => {
          newPrd.size.push({size: size.size, qty: size.qty})
        })

        this.order.products.forEach(chP => {
          if(chP.parent_id === product.id) {
            let childProduct: PackagingFormProductChild = {
              product_id: chP.id,
              color: chP.color,
              size: []
            }

            chP.size.forEach(size => {
              childProduct.size.push({size: size.size, qty: size.qty})
            })
            newPrd.child.push(childProduct)
          }
        })
        this.packagingFormData.products.push(newPrd)
      }

    })
  }

  getProductServices(product_id: number|null = null): PackagingFormService[] {
    let services: PackagingFormService[] = []
    this.services.forEach(service => {
      if (service.step === "PROCESSING") {
        let service_enabled = false
        let service_attribute = ""
        let record_id: number|null = null
        var serviceData: boolean|OrderListItemService = false
        if(product_id !== null) {
          serviceData = this.getProductServiceIfEnabled(parseInt(service.id!), product_id)
        }

        if(serviceData !== false && typeof serviceData !== "boolean") {
          service_enabled = true
          service_attribute = serviceData.service_attribute
          record_id = serviceData.id
        }

        services.push({
          record_id: record_id,
          service_id: parseInt(service.id!),
          service_attribute: service_attribute,
          service_enabled: service_enabled
        })
      }
    })

    return services
  }

  addNewProduct() {
    this.getPackagingProducts.push(this.getNewProductForm(false, ''))
    this.activeProdPanel = this.getPackagingProducts.length-1
  }

  getTotalQtyByIndex(i: number) {
    let qty: number = 0
    this.packagingFormData.products[i].size.forEach(size => {
      qty += size.qty
    })

    return qty
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

  openCalculationDialog(id: number) {
    const dialogRef = this.dialog.open(CalculationSheetDialogComponent, {
      data: {
        id: id,
      },
      width: '780px'
    });
  }

  serviceAttributeParse(data: any) {
    try {
      let json = JSON.parse(data);
      return json.value;
    } catch (error) {
      return data;
    }
  }


  protected readonly CLIENT_TYPES = CLIENT_TYPES;
  protected readonly UNITS_SHORT = UNITS_SHORT;
  protected readonly parseInt = parseInt;
}
