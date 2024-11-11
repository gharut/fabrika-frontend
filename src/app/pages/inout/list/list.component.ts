import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicPaginationComponent} from "../../../components/basic-pagination/basic-pagination.component";
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {InoutService} from "../../../services/inout.service";
import {CONSUMABLE_OPERATION_TYPES} from "../../../constants/consumable_operation_types";
import {UNITS_SHORT} from "../../../constants/units";
import {AccountService} from "../../../services/account.service";
import {
  CreateConsumableDialogComponent
} from "../../consumable/consumables/create-consumable-dialog/create-consumable-dialog.component";
import {ConsumableWithDeleting} from "../../consumable/consumables/consumables.component";
import {MatDialog} from "@angular/material/dialog";
import {OperationComponent} from "../operation/operation.component";

@Component({
  selector: 'app-inout-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BasicPaginationComponent, {static: true}) paginator?: BasicPaginationComponent;
  private _unsubscribeAll: Subject<any>;
  isLoading = false; // show data table if it is false, here you may use a loader when it is true
  displayedColumns: string[] = [
    'type',
    'type-text',
    'type-consumable-name',
    'type-supplier',
    'date',
    'qty',
    'price_per_unit',
    'total_price'
  ];
  dataSource?: MatTableDataSource<any>; // mat table data source
  // for pagination
  total: any;
  pageOffset: any;
  pageIndex: any;
  orderBy: any;

  readonly CONSUMABLE_OPERATION_TYPES = CONSUMABLE_OPERATION_TYPES
  readonly UNIT_SHORT = UNITS_SHORT

  constructor(
    private _service: InoutService,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.pageOffset = 10;
    this.pageIndex = 1;
    this.orderBy = 'desc';
  }

  // call the service for http call
  getValues(): void {
    this.isLoading = true;
    this._service.getAll(this.pageOffset, this.pageIndex, this.orderBy)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.total = res.total;
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    // after paginate state update in pagination component
    this.paginator?.paginate.pipe(takeUntil(this._unsubscribeAll)).subscribe(paginator => {
      this.pageIndex = paginator.page;
      this.pageOffset = paginator.pageOffset;
      this.getValues();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    //this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  sum(qty: string, price_per_unit: string): any {
    return (parseInt(qty)*parseFloat(price_per_unit)).toFixed(2)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  openOperation() {
    const dialogRef = this.dialog.open(OperationComponent, {});

    dialogRef.afterClosed().subscribe(data => {
      // if (consumable) {
      //   this.consumables!.push(consumable);
      //   this.tableData = new MatTableDataSource<ConsumableWithDeleting>(this.consumables)
      // }
    });
  }
}
