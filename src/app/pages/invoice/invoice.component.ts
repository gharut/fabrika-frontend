import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class PageInvoiceComponent implements OnInit {
  uuid!: string

  constructor(
    private route: ActivatedRoute
  ) {
    this.uuid = this.route.snapshot.paramMap.get('uuid')!;
  }

  ngOnInit(): void {
  }
}
