import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

interface State {
  page: number;
  pageOffset: number;
}

@Component({
  selector: 'basic-pagination',
  templateUrl: './basic-pagination.component.html',
  styleUrls: ['./basic-pagination.component.scss']
})

export class BasicPaginationComponent implements OnInit, AfterViewInit {
  @Input('length') length!: number;
  @Input('pageOffset') pageOffset!: number;
  @Input('pageIndex') pageIndex!: number;

  paginate = new BehaviorSubject<State>({
    page: 1,
    pageOffset: 10
  });

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const newState = this.paginate.value;
    newState.page = this.pageIndex = 1;
    newState.pageOffset = this.pageOffset = 10;
    this.paginate.next(newState);
  }

  getFirstPage() {
    const newState = this.paginate.value;
    newState.page = this.pageIndex = 1;
    newState.pageOffset = this.pageOffset = 10;
    this.paginate.next(newState);
  }

  getNextPage() {
    const newState = this.paginate.value;
    newState.page = this.pageIndex = this.pageIndex + 1;
    newState.pageOffset = this.pageOffset = 10;
    this.paginate.next(newState);
  }

  getPreviousPage() {
    const newState = this.paginate.value;
    newState.page = this.pageIndex = this.pageIndex - 1;
    newState.pageOffset = this.pageOffset = 10;
    this.paginate.next(newState);
  }

  getLastPage() {
    const newState = this.paginate.value;
    this.pageIndex = (this.length % this.pageOffset == 0) ? (this.length / this.pageOffset) : ((this.length / this.pageOffset) + 1);
    this.pageIndex = Math.floor(this.pageIndex);
    newState.page = this.pageIndex;
    newState.pageOffset  = 10;
    this.paginate.next(newState);
  }
}
